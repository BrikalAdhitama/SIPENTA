-- ============================================================================
-- SIPENTA — RLS per tabel per role
-- 0002_rls_policies.sql
-- Ringkasan kebijakan: docs/api-contract.md §B.
-- Helper user_*() dibuat ulang SECURITY DEFINER supaya kebijakan tabel
-- profiles tidak rekursi (fungsi milik owner lolos RLS).
-- ============================================================================

-- ── Helper (definer) ────────────────────────────────────────────────────────
create or replace function public.user_role() returns role_pengguna
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.user_dosen_id() returns bigint
language sql stable security definer set search_path = public as $$
  select dosen_id from public.profiles where id = auth.uid()
$$;

create or replace function public.user_mahasiswa_id() returns bigint
language sql stable security definer set search_path = public as $$
  select mahasiswa_id from public.profiles where id = auth.uid()
$$;

create or replace function public.user_onboarded() returns boolean
language sql stable security definer set search_path = public as $$
  select onboarding_at is not null from public.profiles where id = auth.uid()
$$;

-- ── Aktifkan RLS ────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table dosen enable row level security;
alter table mahasiswa enable row level security;
alter table ruangan enable row level security;
alter table jadwal_mengajar enable row level security;
alter table blokir_waktu enable row level security;
alter table jadwal_kuliah enable row level security;
alter table gelombang enable row level security;
alter table seminar enable row level security;
alter table schedule_run enable row level security;
alter table schedule_slot enable row level security;
alter table approval enable row level security;
alter table notification enable row level security;
alter table app_config enable row level security;

-- ── profiles: pemilik + admin ───────────────────────────────────────────────
drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles for select using (
  auth.uid() = id or public.user_role() = 'admin'
);
drop policy if exists profiles_insert on profiles;
create policy profiles_insert on profiles for insert with check (
  auth.uid() = id or public.user_role() = 'admin'
);
drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles for update using (
  auth.uid() = id or public.user_role() = 'admin'
) with check (
  auth.uid() = id or public.user_role() = 'admin'
);
drop policy if exists profiles_delete on profiles;
create policy profiles_delete on profiles for delete using (
  public.user_role() = 'admin'
);

-- ── Master: baca semua terautentikasi, tulis admin ──────────────────────────
drop policy if exists dosen_select on dosen;
create policy dosen_select on dosen for select using (auth.uid() is not null);
drop policy if exists dosen_write on dosen;
create policy dosen_write on dosen for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists mahasiswa_select on mahasiswa;
create policy mahasiswa_select on mahasiswa for select using (auth.uid() is not null);
drop policy if exists mahasiswa_write on mahasiswa;
create policy mahasiswa_write on mahasiswa for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

drop policy if exists ruangan_select on ruangan;
create policy ruangan_select on ruangan for select using (auth.uid() is not null);
drop policy if exists ruangan_write on ruangan;
create policy ruangan_write on ruangan for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── Jadwal mengajar: baca semua, tulis admin/pemilik ────────────────────────
drop policy if exists jadwal_mengajar_select on jadwal_mengajar;
create policy jadwal_mengajar_select on jadwal_mengajar for select using (auth.uid() is not null);
drop policy if exists jadwal_mengajar_write on jadwal_mengajar;
create policy jadwal_mengajar_write on jadwal_mengajar for all using (
  public.user_role() = 'admin' or public.user_dosen_id() = dosen_id
) with check (
  public.user_role() = 'admin' or public.user_dosen_id() = dosen_id
);

-- ── Blokir waktu: admin + pemilik ───────────────────────────────────────────
drop policy if exists blokir_waktu_select on blokir_waktu;
create policy blokir_waktu_select on blokir_waktu for select using (
  public.user_role() = 'admin' or public.user_dosen_id() = dosen_id
);
drop policy if exists blokir_waktu_write on blokir_waktu;
create policy blokir_waktu_write on blokir_waktu for all using (
  public.user_role() = 'admin' or public.user_dosen_id() = dosen_id
) with check (
  public.user_role() = 'admin' or public.user_dosen_id() = dosen_id
);

-- ── Jadwal kuliah: admin + pemilik ──────────────────────────────────────────
drop policy if exists jadwal_kuliah_select on jadwal_kuliah;
create policy jadwal_kuliah_select on jadwal_kuliah for select using (
  public.user_role() = 'admin' or public.user_mahasiswa_id() = mahasiswa_id
);
drop policy if exists jadwal_kuliah_write on jadwal_kuliah;
create policy jadwal_kuliah_write on jadwal_kuliah for all using (
  public.user_role() = 'admin' or public.user_mahasiswa_id() = mahasiswa_id
) with check (
  public.user_role() = 'admin' or public.user_mahasiswa_id() = mahasiswa_id
);

-- ── Gelombang: admin + peserta (dosen/mhs yang punya seminar di dalamnya) ───
drop policy if exists gelombang_select on gelombang;
create policy gelombang_select on gelombang for select using (
  public.user_role() = 'admin'
  or exists (
    select 1 from seminar s
    where s.gelombang_id = gelombang.id
      and (
        s.mahasiswa_id = public.user_mahasiswa_id()
        or public.user_dosen_id() in (
          s.pembimbing_utama_id, s.pembimbing_pendamping_id, s.penguji1_id, s.penguji2_id
        )
      )
  )
);
drop policy if exists gelombang_write on gelombang;
create policy gelombang_write on gelombang for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── Seminar: admin + dosen terlibat (4 peran) + mhs pemilik ─────────────────
drop policy if exists seminar_select on seminar;
create policy seminar_select on seminar for select using (
  public.user_role() = 'admin'
  or seminar.mahasiswa_id = public.user_mahasiswa_id()
  or public.user_dosen_id() in (
    seminar.pembimbing_utama_id, seminar.pembimbing_pendamping_id,
    seminar.penguji1_id, seminar.penguji2_id
  )
);
drop policy if exists seminar_write on seminar;
create policy seminar_write on seminar for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── schedule_run: admin + run final untuk semua terautentikasi ──────────────
drop policy if exists schedule_run_select on schedule_run;
create policy schedule_run_select on schedule_run for select using (
  public.user_role() = 'admin'
  or (auth.uid() is not null and status = 'final')
);
drop policy if exists schedule_run_write on schedule_run;
create policy schedule_run_write on schedule_run for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── schedule_slot: admin + dosen/mhs lewat seminar (tanpa via approval ──────
-- agar tidak rekursi kebijakan dengan tabel approval) ────────────────────────
drop policy if exists schedule_slot_select on schedule_slot;
create policy schedule_slot_select on schedule_slot for select using (
  public.user_role() = 'admin'
  or exists (
    select 1 from seminar s
    where s.id = schedule_slot.seminar_id
      and (
        s.mahasiswa_id = public.user_mahasiswa_id()
        or public.user_dosen_id() in (
          s.pembimbing_utama_id, s.pembimbing_pendamping_id, s.penguji1_id, s.penguji2_id
        )
      )
  )
);
drop policy if exists schedule_slot_write on schedule_slot;
create policy schedule_slot_write on schedule_slot for all using (public.user_role() = 'admin')
  with check (public.user_role() = 'admin');

-- ── approval: admin + dosen pemilik baris + mhs lewat slot→seminar ──────────
-- Tulis lewat RPC submit_approval() (definer, lolos RLS); tanpa policy tulis.
drop policy if exists approval_select on approval;
create policy approval_select on approval for select using (
  public.user_role() = 'admin'
  or approval.dosen_id = public.user_dosen_id()
  or exists (
    select 1 from schedule_slot sl
    join seminar s on s.id = sl.seminar_id
    where sl.id = approval.slot_id
      and s.mahasiswa_id = public.user_mahasiswa_id()
  )
);

-- ── notification: pemilik (+ admin baca) ────────────────────────────────────
drop policy if exists notification_select on notification;
create policy notification_select on notification for select using (
  user_id = auth.uid() or public.user_role() = 'admin'
);
drop policy if exists notification_update on notification;
create policy notification_update on notification for update using (
  user_id = auth.uid() or public.user_role() = 'admin'
) with check (
  user_id = auth.uid() or public.user_role() = 'admin'
);
-- tanpa policy insert/delete: tulis lewat trigger notifikasi (definer) / service role.

-- ── app_config: admin saja (Edge pakai service role) ────────────────────────
drop policy if exists app_config_select on app_config;
create policy app_config_select on app_config for select using (
  public.user_role() = 'admin'
);

-- ── Storage buckets (SC-1 upload SPS, SC-11 exports, templates publik) ──────
insert into storage.buckets (id, name, public)
values ('sps', 'sps', false), ('exports', 'exports', false), ('templates', 'templates', true)
on conflict (id) do nothing;

drop policy if exists sps_admin_all on storage.objects;
create policy sps_admin_all on storage.objects for all using (
  bucket_id = 'sps' and public.user_role() = 'admin'
) with check (
  bucket_id = 'sps' and public.user_role() = 'admin'
);

drop policy if exists exports_admin_read on storage.objects;
create policy exports_admin_read on storage.objects for select using (
  bucket_id = 'exports' and public.user_role() = 'admin'
);

drop policy if exists templates_public_read on storage.objects;
create policy templates_public_read on storage.objects for select using (
  bucket_id = 'templates'
);
