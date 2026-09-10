# Database ERD — SIPENTA

Postgres (Supabase). Nama tabel & kolom pakai bahasa Indonesia domain. Sumber kebenaran skema: `supabase/migrations/`.

## Diagram relasi

```mermaid
erDiagram
    profiles ||--o| dosen : "role=dosen"
    profiles ||--o| mahasiswa : "role=mahasiswa"
    %% hanya 3 role: admin, dosen, mahasiswa (fungsi kaprodi = akun admin)

    dosen ||--o{ jadwal_mengajar : mengajar
    dosen ||--o{ blokir_waktu : memblokir
    mahasiswa ||--o{ jadwal_kuliah : mengambil

    gelombang ||--o{ seminar : berisi
    gelombang ||--o{ schedule_run : "di-generate jadi"
    mahasiswa ||--o| seminar : mendaftar

    dosen ||--o{ seminar : "pembimbing/penguji (4 FK)"

    schedule_run ||--o{ schedule_slot : menghasilkan
    seminar ||--o| schedule_slot : dijadwalkan
    schedule_slot ||--o{ approval : "butuh 4"
    dosen ||--o{ approval : menyetujui

    profiles ||--o{ notification : menerima

    profiles {
        uuid id PK "= auth.users.id"
        text role "admin|dosen|mahasiswa"
        text nama
        bigint dosen_id FK "nullable"
        bigint mahasiswa_id FK "nullable"
    }
    dosen {
        bigint id PK
        text nip UK
        text nama
        text gelar
        text email
        text bidang
        text status "aktif|nonaktif"
    }
    mahasiswa {
        bigint id PK
        text nim UK
        text nama
        text angkatan
    }
    ruangan {
        bigint id PK
        text kode UK
        text nama
        int kapasitas
        int lantai
        bool is_online
        text status "aktif|nonaktif"
    }
    jadwal_mengajar {
        bigint id PK
        bigint dosen_id FK
        text matkul
        text kelas
        text hari
        time jam_mulai
        time jam_selesai
        text ruangan_kode
        text semester
    }
    blokir_waktu {
        bigint id PK
        bigint dosen_id FK
        text hari "nullable"
        date tanggal "nullable"
        time jam_mulai
        time jam_selesai
        text keterangan
    }
    jadwal_kuliah {
        bigint id PK
        bigint mahasiswa_id FK
        text matkul
        text kelas
        text hari
        time jam_mulai
        time jam_selesai
        text ruangan_kode
        text dosen_nama
    }
    gelombang {
        bigint id PK
        text nama
        text jenis "sempro|semhas"
        text periode_label
        date tanggal_mulai
        date tanggal_selesai
        text[] hari_aktif
        time jam_operasional_mulai
        time jam_operasional_selesai
        int jeda_menit
        text[] ruangan_aktif
        text sps_file_path
        text status "draft|siap_generate|dijadwalkan"
        uuid created_by FK
    }
    seminar {
        bigint id PK
        bigint gelombang_id FK
        bigint mahasiswa_id FK
        text jenis "sempro|semhas"
        text jenis_ta "skripsi|proyek|prototipe"
        text judul
        bigint pembimbing_utama_id FK
        bigint pembimbing_pendamping_id FK
        bigint penguji1_id FK
        bigint penguji2_id FK
        bool is_online "ditetapkan admin"
        text validasi "valid|invalid|duplikat"
        text catatan
    }
    schedule_run {
        bigint id PK
        bigint gelombang_id FK
        text nama
        numeric fitness_score
        int conflict_count
        int generations_run
        int exec_ms
        jsonb stats
        jsonb unscheduled
        text status "draft|tersimpan|final|dibatalkan"
        timestamptz finalized_at "nullable"
        uuid finalized_by FK "nullable"
        text pembatalan_alasan "nullable"
        uuid created_by FK
        timestamptz created_at
    }
    schedule_slot {
        bigint id PK
        bigint run_id FK
        bigint seminar_id FK
        date tanggal
        time jam_mulai
        time jam_selesai
        text ruangan_kode
        bool is_online
    }
    approval {
        bigint id PK
        bigint slot_id FK
        bigint run_id FK "denormalisasi utk RLS/filter"
        bigint dosen_id FK
        text peran "pembimbing_utama|pembimbing_pendamping|penguji_1|penguji_2"
        text status "pending|approved|declined"
        text alasan
        timestamptz updated_at
    }
    notification {
        bigint id PK
        uuid user_id FK
        text judul
        text pesan
        text tipe
        bool dibaca
        bigint ref_run_id "nullable"
        timestamptz created_at
    }
```

## Catatan desain

- **`profiles`** memetakan `auth.users` → role + tautan ke `dosen`/`mahasiswa`. Helper SQL `auth.role()`, `auth.dosen_id()`, `auth.mahasiswa_id()` dipakai di kebijakan RLS.
- **`seminar`** punya **4 FK ke `dosen`** (pembimbing utama, pembimbing pendamping, penguji 1, penguji 2). Data mahasiswa + kedua pembimbing berasal dari **sheet pendaftaran** (dibaca `parse-sps`, `mahasiswa` dibuat otomatis). Penguji 1 & 2 diisi **manual oleh admin** di langkah preview → nullable saat impor, wajib sebelum `generate`. `is_online` juga ditetapkan admin di langkah preview.
- **`schedule_run`** = satu kali eksekusi GA untuk sebuah gelombang. Satu gelombang boleh punya banyak run (generate ulang); hanya satu yang akhirnya `final`. `final` hanya bisa dicapai lewat RPC `finalisasi_jadwal` **setelah setiap slot di-ACC 4 dari 4 dosen** (2 pembimbing + 2 penguji); run lain di gelombang itu otomatis jadi `dibatalkan`.
- **`approval`** menyimpan `run_id` (denormalisasi) supaya RLS & realtime bisa filter tanpa join berantai.
- **Waktu** disimpan `time` + `hari` (text: `senin`..`jumat`) untuk data berulang (jadwal mengajar/kuliah/blokir), dan `date` + `time` untuk slot seminar konkret.
- **`ruangan.is_online`** — slot di ruangan online tak dibatasi kapasitas paralel; GA melewati H1.
- **Cascade**: hapus `schedule_run` → hapus `schedule_slot` → hapus `approval`. Hapus `gelombang` → hapus `seminar` + semua run.
- **Index penting**: `seminar(gelombang_id)`, `schedule_slot(run_id)`, `approval(dosen_id, status)`, `approval(run_id)`, `notification(user_id, dibaca)`, `jadwal_mengajar(dosen_id)`.

## Storage buckets

| Bucket | Isi | Akses |
|---|---|---|
| `sps` | file Excel pendaftaran per gelombang | `admin` upload/read; privat |
| `exports` | hasil Excel/PDF | dibuat Edge Fn; signed URL berlaku 1 jam |
| `templates` | template Excel SPS resmi | publik read |
