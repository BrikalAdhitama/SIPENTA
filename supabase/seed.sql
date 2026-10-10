-- SIPENTA seed data awal untuk development.
-- Aman dijalankan ulang: baris yang memiliki unique key tidak ditimpa.
-- Jalankan setelah seluruh migration berhasil diterapkan.

begin;

insert into
    public.dosen (nip, nama, bidang, status)
values (
        '1987001',
        'Dr. Siti Aminah',
        'Sistem Informasi',
        'aktif'
    ),
    (
        '1987002',
        'Budi Santoso, M.Kom',
        'Rekayasa Perangkat Lunak',
        'aktif'
    ),
    (
        '1987003',
        'Dewi Lestari, M.T.',
        'Data dan Kecerdasan Buatan',
        'aktif'
    ),
    (
        '1987004',
        'Agus Wijaya, M.T.',
        'Sistem Informasi',
        'aktif'
    ) on conflict (nip) do nothing;

insert into
    public.mahasiswa (nim, nama, angkatan)
values (
        '220001',
        'Andi Pratama',
        '2022'
    ),
    (
        '220002',
        'Rina Salsabila',
        '2022'
    ),
    (
        '220003',
        'Fajar Nugraha',
        '2023'
    ) on conflict (nim) do nothing;

insert into
    public.ruangan (
        kode,
        nama,
        lantai,
        gedung,
        is_online,
        status
    )
values (
        'R201',
        'R.201',
        2,
        'F',
        false,
        'aktif'
    ),
    (
        'LAB-MULTI',
        'Lab Multimedia',
        3,
        'F',
        false,
        'aktif'
    ),
    (
        'AUDITORIUM',
        'Auditorium',
        1,
        'A',
        false,
        'aktif'
    ),
    (
        'ONLINE',
        'Seminar Online',
        null,
        null,
        true,
        'aktif'
    ) on conflict (kode) do nothing;

-- Contoh jadwal mengajar & kuliah untuk demo onboarding + bahan GA.
insert into
    public.jadwal_mengajar (dosen_id, mata_kuliah, kelas, hari, jam_mulai, jam_selesai, ruangan)
select d.id, 'Basis Data', 'A', 'senin', '10:20', '12:00', 'R.201'
from public.dosen d
where d.nip = '1987001'
  and not exists (
    select 1 from public.jadwal_mengajar j where j.dosen_id = d.id
  );

insert into
    public.jadwal_kuliah (mahasiswa_id, mata_kuliah, kelas, hari, jam_mulai, jam_selesai, ruangan)
select m.id, 'Pemrograman Web', 'A', 'selasa', '13:00', '15:30', 'Lab Multimedia'
from public.mahasiswa m
where m.nim = '220001'
  and not exists (
    select 1 from public.jadwal_kuliah j where j.mahasiswa_id = m.id
  );

-- 1 gelombang siap generate + 2 seminar valid untuk demo POST /api/admin/generate-schedule.
insert into public.gelombang
  (nama, jenis, periode_label, tanggal_mulai, tanggal_selesai, hari_aktif,
   jam_operasional_mulai, jam_operasional_selesai, jeda_menit, durasi_menit,
   kuota_maks, ruangan_aktif, status)
select
  'Sempro Demo', 'seminar_proposal', 'Demo Okt 2026',
  current_date + 5, current_date + 9, '{senin,selasa,rabu,kamis,jumat}',
  '08:00', '17:00', 10, 60, 15, '{R201,LAB-MULTI}', 'siap_generate'
where not exists (select 1 from public.gelombang where nama = 'Sempro Demo');

insert into public.seminar
  (gelombang_id, mahasiswa_id, jenis, judul,
   pembimbing_utama_id, pembimbing_pendamping_id, penguji1_id, penguji2_id,
   is_online, urutan_daftar, dijadwalkan, validasi)
select
  (select id from public.gelombang where nama = 'Sempro Demo' limit 1),
  m.id, 'seminar_proposal', 'Sistem ' || m.nama,
  (select id from public.dosen where nip = '1987001'),
  (select id from public.dosen where nip = '1987002'),
  (select id from public.dosen where nip = '1987003'),
  (select id from public.dosen where nip = '1987004'),
  false, 1, true, 'valid'
from public.mahasiswa m
where m.nim in ('220001', '220002')
on conflict (gelombang_id, mahasiswa_id) do nothing;

-- buka gate onboarding untuk akun demo supaya generate tidak 409
update public.profiles p set onboarding_at = now()
where p.onboarding_at is null
  and (
    p.dosen_id in (select id from public.dosen where nip in ('1987001','1987002','1987003','1987004'))
    or p.mahasiswa_id in (select id from public.mahasiswa where nim in ('220001','220002'))
  );

commit;