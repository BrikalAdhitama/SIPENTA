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

commit;