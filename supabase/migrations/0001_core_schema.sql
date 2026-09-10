-- ============================================================================
-- SIPENTA — Skema inti
-- 0001_core_schema.sql
-- Enum, tabel, index. RLS ada di 0002. Fungsi/RPC di 0003. Trigger notif di 0004.
--
-- Catatan peran: hanya 3 role — admin, dosen, mahasiswa. Fungsi "kaprodi"
-- (persetujuan akhir jadwal) dijalankan oleh akun admin. Jadwal menjadi 'final'
-- HANYA setelah SETIAP slot di-ACC oleh keempat dosennya (2 pembimbing + 2 penguji).
-- ============================================================================

-- ── Enum ────────────────────────────────────────────────────────────────────
create type role_pengguna     as enum ('admin', 'dosen', 'mahasiswa');  -- kaprodi memakai akun admin
create type jenis_seminar      as enum ('sempro', 'semhas');
create type peran_dosen        as enum ('pembimbing_utama', 'pembimbing_pendamping', 'penguji_1', 'penguji_2');
create type validasi_seminar   as enum ('valid', 'invalid', 'duplikat');
create type status_gelombang   as enum ('draft', 'siap_generate', 'dijadwalkan');
create type status_run         as enum ('draft', 'tersimpan', 'final', 'dibatalkan');
create type status_approval    as enum ('pending', 'approved', 'declined');
create type status_aktif       as enum ('aktif', 'nonaktif');
create type hari_kerja         as enum ('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu');

-- ── Dosen & Mahasiswa ──────────────────────────────────────────────────────
create table dosen (
  id        bigint generated always as identity primary key,
  nip       text unique,
  nama      text not null,
  gelar     text,
  email     text,
  bidang    text,
  status    status_aktif not null default 'aktif',
  created_at timestamptz not null default now()
);

create table mahasiswa (
  id        bigint generated always as identity primary key,
  nim       text unique not null,
  nama      text not null,
  angkatan  text,
  created_at timestamptz not null default now()
);

-- ── profiles: jembatan auth.users → role ───────────────────────────────────
create table profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  role          role_pengguna not null,
  nama          text not null,
  dosen_id      bigint references dosen (id),
  mahasiswa_id  bigint references mahasiswa (id),
  -- gate onboarding: dosen wajib isi jadwal mengajar, mahasiswa wajib isi jadwal kuliah,
  -- baru diisi (now()) saat mereka menekan "Selesai" di layar onboarding. null = belum → akses dikunci.
  onboarding_at timestamptz,
  created_at    timestamptz not null default now(),
  constraint chk_profile_link check (
    (role = 'dosen'     and dosen_id is not null) or
    (role = 'mahasiswa' and mahasiswa_id is not null) or
    (role = 'admin')
  )
);

-- helper untuk RLS
create or replace function auth.role() returns role_pengguna language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;
create or replace function auth.dosen_id() returns bigint language sql stable as $$
  select dosen_id from public.profiles where id = auth.uid()
$$;
create or replace function auth.mahasiswa_id() returns bigint language sql stable as $$
  select mahasiswa_id from public.profiles where id = auth.uid()
$$;
create or replace function auth.onboarded() returns boolean language sql stable as $$
  select onboarding_at is not null from public.profiles where id = auth.uid()
$$;
-- RPC selesai_onboarding() didefinisikan di bawah, setelah tabel jadwal_mengajar & jadwal_kuliah.

-- ── Ruangan ────────────────────────────────────────────────────────────────
create table ruangan (
  id         bigint generated always as identity primary key,
  kode       text unique not null,
  nama       text not null,
  kapasitas  int,
  lantai     int,
  is_online  boolean not null default false,
  status     status_aktif not null default 'aktif'
);

-- ── Jadwal mengajar / blokir waktu / jadwal kuliah (data berulang) ──────────
create table jadwal_mengajar (
  id           bigint generated always as identity primary key,
  dosen_id     bigint not null references dosen (id) on delete cascade,
  matkul       text not null,
  kelas        text,
  hari         hari_kerja not null,
  jam_mulai    time not null,
  jam_selesai  time not null,
  ruangan_kode text,
  semester     text not null,
  check (jam_selesai > jam_mulai)
);
create index idx_jm_dosen on jadwal_mengajar (dosen_id);

create table blokir_waktu (
  id           bigint generated always as identity primary key,
  dosen_id     bigint not null references dosen (id) on delete cascade,
  hari         hari_kerja,
  tanggal      date,
  jam_mulai    time not null,
  jam_selesai  time not null,
  keterangan   text,
  check (jam_selesai > jam_mulai),
  check (num_nonnulls(hari, tanggal) = 1)   -- tepat salah satu
);
create index idx_blokir_dosen on blokir_waktu (dosen_id);

create table jadwal_kuliah (
  id           bigint generated always as identity primary key,
  mahasiswa_id bigint not null references mahasiswa (id) on delete cascade,
  matkul       text not null,
  kelas        text,
  hari         hari_kerja not null,
  jam_mulai    time not null,
  jam_selesai  time not null,
  ruangan_kode text,
  dosen_nama   text,
  check (jam_selesai > jam_mulai)
);
create index idx_jk_mhs on jadwal_kuliah (mahasiswa_id);

-- RPC dipanggil client saat user menekan "Selesai" di layar onboarding.
-- p_tidak_ada = true bila user menyatakan tidak mengajar / tidak ada kuliah semester ini.
create or replace function selesai_onboarding(p_tidak_ada boolean default false)
returns timestamptz
language plpgsql security definer set search_path = public as $$
declare
  v_role  role_pengguna;
  v_dosen bigint;
  v_mhs   bigint;
  v_ts    timestamptz;
  n       int := 0;
begin
  select role, dosen_id, mahasiswa_id into v_role, v_dosen, v_mhs
    from profiles where id = auth.uid();

  if v_role = 'dosen' and not p_tidak_ada then
    select count(*) into n from jadwal_mengajar where dosen_id = v_dosen;
    if n = 0 then raise exception 'jadwal mengajar belum diisi' using errcode = 'check_violation'; end if;
  elsif v_role = 'mahasiswa' and not p_tidak_ada then
    select count(*) into n from jadwal_kuliah where mahasiswa_id = v_mhs;
    if n = 0 then raise exception 'jadwal kuliah belum diisi' using errcode = 'check_violation'; end if;
  end if;

  update profiles set onboarding_at = now() where id = auth.uid()
    returning onboarding_at into v_ts;
  return v_ts;
end $$;

-- ── Gelombang & Seminar ────────────────────────────────────────────────────
create table gelombang (
  id                      bigint generated always as identity primary key,
  nama                    text not null,
  jenis                   jenis_seminar not null,
  periode_label           text,
  tanggal_mulai           date,   -- pelaksanaan (prodi: mulai tanggal 15 bulan berjalan)
  tanggal_selesai         date,
  hari_aktif              hari_kerja[] not null default '{senin,selasa,rabu,kamis,jumat}',
  jam_operasional_mulai   time not null default '08:00',
  jam_operasional_selesai time not null default '17:00',
  jeda_menit              int  not null default 15,
  durasi_menit            int,   -- null = ikut default jenis (sempro 60, semhas 105); isi utk override
  kuota_maks              int  not null default 15,   -- prodi: maks 15 mahasiswa per bulan; sisanya ditunda
  ruangan_aktif           text[] not null default '{}',
  sps_file_path           text,
  status                  status_gelombang not null default 'draft',
  created_by              uuid references profiles (id),
  created_at              timestamptz not null default now(),
  check (tanggal_selesai is null or tanggal_mulai is null or tanggal_selesai >= tanggal_mulai)
);

create table seminar (
  id                        bigint generated always as identity primary key,
  gelombang_id              bigint not null references gelombang (id) on delete cascade,
  mahasiswa_id              bigint not null references mahasiswa (id),
  jenis                     jenis_seminar not null,
  jenis_ta                  text,
  judul                     text,
  pembimbing_utama_id       bigint references dosen (id),
  pembimbing_pendamping_id  bigint references dosen (id),
  penguji1_id               bigint references dosen (id),
  penguji2_id               bigint references dosen (id),
  is_online                 boolean not null default false,   -- ditetapkan admin; GA menjadwalkan waktunya, venue = online
  urutan_daftar             int,                              -- urutan waktu pendaftaran dari sheet (utk aturan kuota)
  dijadwalkan               boolean not null default true,    -- false = melebihi kuota_maks, ditunda ke gelombang bulan berikutnya
  validasi                  validasi_seminar not null default 'invalid',
  catatan                   text,
  unique (gelombang_id, mahasiswa_id)
);
create index idx_seminar_gelombang on seminar (gelombang_id);

-- validasi 4 dosen sebelum boleh generate (dipakai trigger / dicek Edge Fn)
create or replace function seminar_dosen_valid(s seminar) returns boolean language sql stable as $$
  select s.pembimbing_utama_id is not null
     and s.pembimbing_pendamping_id is not null
     and s.penguji1_id is not null
     and s.penguji2_id is not null
     and s.penguji1_id <> s.penguji2_id
     and s.penguji1_id not in (s.pembimbing_utama_id, s.pembimbing_pendamping_id)
     and s.penguji2_id not in (s.pembimbing_utama_id, s.pembimbing_pendamping_id)
$$;

-- ── Hasil penjadwalan ──────────────────────────────────────────────────────
create table schedule_run (
  id              bigint generated always as identity primary key,
  gelombang_id    bigint not null references gelombang (id) on delete cascade,
  nama            text,
  fitness_score   numeric(5,2),
  conflict_count  int not null default 0,
  generations_run int,
  exec_ms         int,
  stats           jsonb not null default '{}',
  unscheduled     jsonb not null default '[]',
  status          status_run not null default 'draft',
  finalized_at    timestamptz,
  finalized_by    uuid references profiles (id),
  pembatalan_alasan text,
  created_by      uuid references profiles (id),
  created_at      timestamptz not null default now()
);
create index idx_run_gelombang on schedule_run (gelombang_id);

create table schedule_slot (
  id           bigint generated always as identity primary key,
  run_id       bigint not null references schedule_run (id) on delete cascade,
  seminar_id   bigint not null references seminar (id),
  tanggal      date not null,
  jam_mulai    time not null,
  jam_selesai  time not null,
  ruangan_kode text not null,
  is_online    boolean not null default false,
  check (jam_selesai > jam_mulai)
);
create index idx_slot_run on schedule_slot (run_id);

create table approval (
  id         bigint generated always as identity primary key,
  slot_id    bigint not null references schedule_slot (id) on delete cascade,
  run_id     bigint not null references schedule_run (id) on delete cascade,
  dosen_id   bigint not null references dosen (id),
  peran      peran_dosen not null,
  status     status_approval not null default 'pending',
  alasan     text,
  updated_at timestamptz not null default now(),
  unique (slot_id, peran)
);
create index idx_appr_dosen  on approval (dosen_id, status);
create index idx_appr_run    on approval (run_id);

-- ── Notifikasi ─────────────────────────────────────────────────────────────
create table notification (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references profiles (id) on delete cascade,
  judul      text not null,
  pesan      text,
  tipe       text,
  dibaca     boolean not null default false,
  ref_run_id bigint references schedule_run (id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_notif_user on notification (user_id, dibaca);

-- ── Konfigurasi aplikasi (ambang approval, default GA params, dst) ──────────
create table app_config (
  key   text primary key,
  value jsonb not null
);
insert into app_config (key, value) values
  ('ga_defaults', '{"population_size":100,"generations":500,"crossover_rate":0.8,"mutation_rate":0.1,"elitism_count":2,"soft_weights":{"s0_menguji_lebih_dari_1_per_hari":10,"s1_total_peran_lebih_dari_1_per_hari":5}}'),
  -- mapping Sesi kuliah kampus → rentang jam (dipakai Edge Function saat ekspansi jadwal mengajar/kuliah)
  -- + jendela blackout (waktu sholat) yang dilarang untuk seminar. Jumat berbeda.
  ('jadwal_kampus', '{
    "sesi": {
      "reguler": {
        "1": {"mulai": "07:30", "selesai": "10:00"},
        "2": {"mulai": "10:20", "selesai": "12:00"},
        "3": {"mulai": "13:00", "selesai": "15:30"},
        "4": {"mulai": "15:50", "selesai": "17:30"}
      },
      "jumat": {
        "1": {"mulai": "07:30", "selesai": "09:10"},
        "2": {"mulai": "09:20", "selesai": "11:00"},
        "3": {"mulai": "13:00", "selesai": "15:30"},
        "4": {"mulai": "16:00", "selesai": "17:40"}
      }
    },
    "blackout": [
      {"mulai": "12:00", "selesai": "13:00", "label": "Sholat Dzuhur", "hari": ["senin","selasa","rabu","kamis"]},
      {"mulai": "11:00", "selesai": "13:00", "label": "Sholat Jumat",  "hari": ["jumat"]},
      {"mulai": "15:00", "selesai": "16:00", "label": "Sholat Ashar"}
    ]
  }'),
  -- jadwal hanya bisa di-finalisasi bila SETIAP slot sudah di-ACC 4 dari 4 dosen (2 pembimbing + 2 penguji)
  ('finalisasi', '{"wajib_semua_dosen_acc": true}');

-- Realtime: aktifkan untuk approval & notification
alter publication supabase_realtime add table approval, notification, schedule_run;
