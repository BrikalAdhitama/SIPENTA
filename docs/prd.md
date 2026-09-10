# PRD — SIPENTA (Sistem Penjadwalan Seminar Tugas Akhir)

| | |
|---|---|
| **Produk** | SIPENTA — penjadwalan otomatis Sempro & Semhas berbasis Algoritma Genetika |
| **Platform** | Web (browser) + Mobile native (Android & iOS via Capacitor) — satu codebase |
| **Status** | Draft v1 — tahap awal, disusun dari prototipe `figmake/` |
| **Tanggal** | 10 September 2026 |
| **Tim** | 1 PM · 2 Frontend · 2 Backend · 2 AI Engineer |
| **Dokumen turunan** | [`api-contract.md`](api-contract.md) · [`database-erd.md`](database-erd.md) · [`ga-design.md`](ga-design.md) |

---

## 1. Ringkasan

Penjadwalan Seminar Proposal (Sempro) dan Seminar Hasil (Semhas) di program studi masih disusun manual. Untuk setiap mahasiswa, koordinator harus mencocokkan ketersediaan **4 dosen** (2 pembimbing + 2 penguji), jadwal mengajar mereka, jadwal kuliah si mahasiswa, dan ketersediaan ruangan — dikalikan puluhan mahasiswa per gelombang. Prosesnya makan waktu berhari-hari dan sering menghasilkan bentrok.

SIPENTA mengotomatiskan ini: admin mengunggah sheet pendaftaran, menetapkan penguji & parameter periode, lalu **Algoritma Genetika** menghasilkan jadwal bebas bentrok dalam hitungan detik. Setiap slot lalu **disetujui keempat dosennya** (2 pembimbing + 2 penguji) lewat aplikasi; begitu semua slot 4/4 di-ACC, admin memfinalisasi jadwal dan mahasiswa melihatnya — semua dari web atau HP.

## 2. Sasaran & Non-Sasaran

### Sasaran

- **S1** Jadwal seminar bebas bentrok (ruangan, dosen, jadwal mengajar, jadwal kuliah mahasiswa) dihasilkan otomatis.
- **S2** Waktu penyusunan jadwal turun dari hitungan hari ke < 1 menit per gelombang.
- **S3** Alur persetujuan digital: **jadwal fix hanya setelah di-ACC keempat dosen** tiap slot (2 pembimbing + 2 penguji), dengan jejak alasan penolakan.
- **S4** Satu aplikasi jalan di web dan mobile native tanpa codebase terpisah.
- **S5** Transparan: seminar yang tidak bisa dijadwalkan disertai alasan konkret.
- **S6** Notifikasi sampai lewat **in-app dan email** (keduanya).

### Non-Sasaran (di luar cakupan capstone ini)

- Integrasi langsung ke SIAKAD/sistem akademik kampus (data masuk lewat unggah Excel).
- Penjadwalan ujian selain Sempro/Semhas (UTS, UAS, sidang yudisium).
- Manajemen nilai / berita acara seminar (hanya penjadwalan).
- Push notification native (in-app + email sudah cukup untuk MVP; push opsional nanti).

## 3. Persona & Peran

**Tiga role.** Fungsi "kaprodi" (finalisasi jadwal, laporan) dijalankan lewat **akun admin** — kaprodi tidak jadi role terpisah.

| Peran | Siapa | Kebutuhan utama |
|---|---|---|
| **Admin** | Koordinator TA / Kaprodi | Kelola data master, jalankan penjadwalan, tetapkan penguji, pantau approval, **finalisasi jadwal**, laporan, ekspor |
| **Dosen** | Pembimbing / Penguji | Lihat jadwal mengajar, atur waktu blokir, setujui/tolak slot seminar miliknya (+ alasan) |
| **Mahasiswa** | Peserta seminar | Daftarkan jadwal kuliah (hard constraint GA), lihat jadwal seminar & progres persetujuan |

Autentikasi: email + password (Supabase Auth). Role disimpan di tabel `profiles` (`admin` \| `dosen` \| `mahasiswa`), ditegakkan lewat Row Level Security.

**Gate onboarding.** Data jadwal dari dosen & mahasiswa adalah bahan mentah GA (H3, H5), jadi akun mereka **terkunci sampai jadwalnya diisi**:
- **Dosen** login pertama kali → langsung ke layar *Isi Jadwal Mengajar*. Menu lain tidak bisa dibuka sampai ≥1 baris jadwal diisi (atau centang "tidak mengajar semester ini"), lalu tekan **Selesai** (`profiles.onboarding_at` terisi).
- **Mahasiswa** login pertama kali → layar *Isi Jadwal Kuliah*, aturan sama.
- **Admin** tanpa gate.
- Saat admin menekan **Generate**, sistem menolak bila masih ada dosen/mahasiswa terkait yang belum menyelesaikan onboarding — dan menyebut namanya.

## 4. Arsitektur (ringkas)

```
┌─────────────────────────────┐        ┌──────────────────────────────────────┐
│  app/  (Nuxt 3 SPA)         │        │  supabase/                           │
│  • web  → Cloudflare Pages  │◄──────►│  • Postgres + RLS  (data & aturan)  │
│  • mobile → Capacitor       │  HTTPS │  • Auth             (sesi & role)    │
│    (Android / iOS)          │        │  • Storage          (Excel, PDF)     │
└─────────────────────────────┘        │  • Realtime         (status approval)│
                                       │  • Edge Functions   (logika server)  │
                                       └───────────────┬──────────────────────┘
                                                       │ HTTPS (server-to-server)
                                                       ▼
                                          ┌──────────────────────────────┐
                                          │  ai-service/  (FastAPI)      │
                                          │  Algoritma Genetika          │
                                          │  POST /solve                 │
                                          └──────────────────────────────┘
```

- Client **tidak pernah** memanggil `ai-service` langsung. Alurnya: client → Edge Function `generate-schedule` → `ai-service` → tulis hasil ke DB → client baca dari DB.
- CRUD sederhana (data master, blokir waktu, jadwal kuliah, baca jadwal) lewat **Supabase client SDK langsung**, diamankan RLS.
- Operasi dengan aturan bisnis / secret / file → **Edge Function** atau **Postgres RPC**.

**Mode backend**: satu project **Supabase cloud** yang di-share (tanpa Docker/stack lokal). Migrasi diterapkan lewat `supabase db push`, Edge Function lewat `supabase functions deploy`. Detail: [`../supabase/README.md`](../supabase/README.md).

Keputusan arsitektur lengkap: `docs/adr/`.

## 5. Multiplatform — bagaimana web & mobile berbagi satu codebase

| Aspek | Pendekatan |
|---|---|
| Build | Nuxt `ssr: false` (SPA). Output `.output/public` dipakai apa adanya oleh web hosting **dan** dibungkus Capacitor untuk native. |
| Navigasi | Vue Router (hash/history). Di native, back-button Android ditangani plugin `@capacitor/app`. |
| Auth di native | `@supabase/supabase-js` dengan `persistSession` ke `@capacitor/preferences`. Email+password → tanpa redirect, aman di WebView. |
| Unggah Excel SPS | Web: `<input type="file">`. Mobile: `@capawesome/capacitor-file-picker` → upload ke Supabase Storage. |
| Unduh Excel/PDF | Edge Function hasilkan file → signed URL. Web: link unduh. Mobile: `@capacitor/filesystem` + `@capacitor/share`. |
| UX adaptif | Composable `usePlatform()` → `isNative`, `isIOS`. Safe-area inset, bottom-nav di mobile vs sidebar di desktop, haptics saat approve/tolak. |
| Realtime | Supabase Realtime channel — sama di web & native. |
| Update | Web: deploy biasa. Native: OTA lewat `@capgo/capacitor-updater` (opsional) atau rilis store. |

Layar padat-tabel (wizard penjadwalan, monitor approval, laporan) dioptimalkan untuk **desktop/web**; layar dosen & mahasiswa dioptimalkan untuk **mobile**. Semua tetap responsif di kedua platform.

## 6. Alur Utama (end-to-end)

```
ADMIN                          AI SERVICE           DOSEN (x4 per slot)        MAHASISWA
  │
  ├─ 1. Kelola data master (dosen di-input manual, ruangan, jadwal mengajar)
  │
  │                                             ┌─ atur blokir waktu
  │                                                              ┌───────────── daftarkan jadwal kuliah
  │
  ├─ 2. Buat gelombang + unggah SHEET PENDAFTARAN (Excel) — data mhs & pembimbing sudah lengkap
  ├─ 3. Preview & validasi → tetapkan Penguji 1 & 2 manual + tandai seminar yang online
  ├─ 4. Konfigurasi periode (tanggal, hari, jam, jeda, ruangan)
  ├─ 5. GENERATE ───────────────► jalankan GA ──► jadwal + skor + unscheduled
  ├─ 6. Review hasil (tabel / kalender), simpan
  │
  │                                             ┌─ 7. approve / tolak (+ alasan) tiap slot miliknya
  ├─ 8. pantau progres approval ◄───────────────┘   (realtime); perbaiki slot yang ditolak → generate ulang
  │
  ├─ 9. semua slot 4/4 ACC → FINALISASI JADWAL (status → final)
  │                                                                                    │
  └─ 10. jadwal final terlihat semua dosen & mahasiswa ────────────────────────────────┘
```

## 7. Use Case — daftar lengkap

Notasi: **AC**=Auth, **MD**=Master Data, **DS**=Dosen self-service, **MS**=Mahasiswa self-service, **SC**=Scheduling, **AP**=Approval, **NT**=Notifikasi, **RP**=Laporan. Kontrak tiap use case ada di [`api-contract.md`](api-contract.md).

### Autentikasi
| ID | Use case | Aktor |
|---|---|---|
| AC-1 | Login (email + password) | semua |
| AC-2 | Ambil sesi + profil (role, nama, `onboarding_at`) | semua |
| AC-3 | Logout | semua |
| AC-4 | Reset password via email | semua |
| AC-5 | **Onboarding wajib**: dosen isi jadwal mengajar / mahasiswa isi jadwal kuliah → tekan Selesai (`selesai_onboarding`); akses menu lain terkunci sampai ini beres | Dosen, Mahasiswa |

### Data Master (Admin)
| ID | Use case | Aktor |
|---|---|---|
| MD-1 | Lihat / tambah / ubah / nonaktifkan **dosen** — **di-input manual oleh admin** | Admin |
| MD-2 | Lihat / tambah / ubah / hapus **jadwal mengajar** dosen | Admin |
| MD-3 | Lihat / tambah / ubah / nonaktifkan **ruangan** (termasuk flag `is_online`) | Admin |
| MD-4 | Lihat daftar **mahasiswa** — **dibuat otomatis** dari sheet pendaftaran saat SC-2, tidak di-input manual | Admin |

### Dosen — self-service
| ID | Use case | Aktor |
|---|---|---|
| DS-1 | Lihat jadwal mengajar sendiri | Dosen |
| DS-2 | Tambah / ubah / hapus **blokir waktu** sendiri | Dosen |
| DS-3 | Lihat seminar tempat dirinya jadi pembimbing / penguji | Dosen |

### Mahasiswa — self-service
| ID | Use case | Aktor |
|---|---|---|
| MS-1 | Tambah / ubah / hapus **jadwal kuliah** sendiri (hard constraint GA) | Mahasiswa |
| MS-2 | Lihat detail seminar sendiri + slot jadwal + progres persetujuan 4 dosen | Mahasiswa |

### Penjadwalan (Admin)
| ID | Use case | Aktor |
|---|---|---|
| SC-1 | Buat **gelombang** baru (jenis Sempro/Semhas) + unggah **sheet pendaftaran** | Admin |
| SC-2 | Parse sheet → daftar seminar (data mhs & pembimbing sudah lengkap dari sheet); ringkasan valid/invalid/duplikat + **pembagian kuota** (15 pertama `dijadwalkan`, sisanya ditunda) | Admin (Edge Fn) |
| SC-3 | Preview & validasi: tetapkan **Penguji 1 & 2** manual per mahasiswa, **tandai seminar yang online**, tinjau/ubah pembagian kuota, perbaiki data | Admin |
| SC-4 | Simpan **konfigurasi** periode (tanggal mulai/selesai, hari aktif, jam operasional, jeda antar sesi, ruangan aktif) | Admin |
| SC-5 | **Generate jadwal** — jalankan GA | Admin (Edge Fn → AI service) |
| SC-6 | Lihat hasil: tampilan **tabel** & **kalender**, skor fitness, jumlah konflik, daftar `unscheduled` | Admin |
| SC-7 | **Simpan** run ke riwayat / buang draft | Admin |
| SC-8 | **Generate ulang** dengan konfigurasi sama atau diubah | Admin |
| SC-9 | Lihat **riwayat** semua run | Admin |
| SC-10 | **Hapus** run beserta slot & approval-nya | Admin |
| SC-11 | **Ekspor** jadwal ke Excel / PDF | Admin (Edge Fn) |

### Persetujuan
| ID | Use case | Aktor |
|---|---|---|
| AP-1 | Dosen: lihat daftar slot yang butuh persetujuannya (per peran) | Dosen |
| AP-2 | Dosen: **setujui** slot | Dosen (RPC) |
| AP-3 | Dosen: **tolak** slot + alasan wajib | Dosen (RPC) |
| AP-4 | Dosen: reset persetujuan ke "menunggu" | Dosen (RPC) |
| AP-5 | Admin: **pantau** status approval — agregat per dosen & per slot, realtime | Admin |
| AP-6 | Admin: **finalisasi jadwal** — hanya boleh bila **setiap slot sudah 4/4 di-ACC**; run jadi `final`, run lain di gelombang itu `dibatalkan` | Admin (RPC) |
| AP-7 | Admin: **batalkan** run (mis. ada slot ditolak & mau generate ulang, atau batalkan jadwal `final` karena kondisi berubah) + alasan | Admin (RPC) |

### Laporan & Notifikasi
| ID | Use case | Aktor |
|---|---|---|
| RP-1 | Admin: dashboard laporan — total jadwal, total seminar, rata-rata fitness, total konflik | Admin |
| RP-2 | Admin: ekspor laporan (Excel / PDF) | Admin (Edge Fn) |
| NT-1 | Notifikasi (in-app + email) ke dosen saat slot ditetapkan untuknya | sistem |
| NT-2 | Notifikasi (in-app + email) ke admin saat dosen menolak slot | sistem |
| NT-3 | Notifikasi (in-app + email) ke dosen + mahasiswa saat jadwal difinalisasi / dibatalkan | sistem |
| NT-4 | Lihat & tandai-baca notifikasi in-app | semua |

## 8. Rincian layar (mengacu prototipe `figmake/`)

### Admin
- **Dashboard** — kartu statistik (total seminar, sempro, semhas, ruangan aktif), jadwal terbaru, status penjadwalan, aksi cepat.
- **Buat Penjadwalan** (wizard 4 langkah): Upload SPS → Preview & Validasi → Konfigurasi → Generate. Stepper menandai progres. Langkah Generate menampilkan progres tahap GA (Preparing Data → Generate Population → Fitness Evaluation → Selection → Crossover → Mutation → Complete).
- **Data Seminar** — tabel semua seminar per gelombang, status validasi, pilih penguji, kolom kuota (`dijadwalkan` / `ditunda`) yang bisa diubah admin.
- **Jadwal** — daftar run tersimpan; klik → detail: tabel slot dengan kolom 4 dosen + indikator status persetujuan (dot hijau/kuning/merah) + progress bar `n/4 disetujui`; modal detail per slot menampilkan 4 kartu approval + alasan penolakan. Tombol **Finalisasi Jadwal** aktif hanya bila semua slot 4/4; tombol **Batalkan**.
- **Data Dosen** — CRUD dosen (nip, nama, gelar, email, bidang, status) — input manual.
- **Jadwal Dosen** — CRUD jadwal mengajar per dosen (matkul, kelas, hari, jam, ruangan).
- **Ruangan** — kartu per ruangan (kapasitas, lantai, status, `is_online`).
- **Status Approval** — akordeon per dosen: total slot, disetujui / menunggu / ditolak, rincian per slot + alasan.
- **Riwayat** — tabel run (nama, jenis, tanggal, periode, jumlah seminar, fitness bar, konflik, status); preview modal; hapus.
- **Laporan** — kartu ringkasan (total jadwal, total seminar, rata-rata fitness, total konflik) + tabel semua run + tombol ekspor Excel/PDF. *(fungsi kaprodi, dijalankan admin)*

### Dosen
- **Onboarding — Isi Jadwal Mengajar** *(muncul sekali, memblok menu lain sampai selesai)* — tabel jadwal mengajar (matkul, kelas, hari, Sesi/jam, ruangan) yang bisa ditambah/ubah/hapus; checkbox "Saya tidak mengajar semester ini"; tombol **Selesai** aktif bila ≥1 baris atau checkbox dicentang.
- **Dashboard** — statistik (seminar sebagai pembimbing, sebagai penguji, perlu disetujui), daftar seminar terlibat, aksi cepat.
- **Seminar Saya** — dua daftar: sebagai Pembimbing, sebagai Penguji; tampilkan slot bila sudah dijadwalkan.
- **Blokir Waktu** — tab Jadwal Mengajar (read-only) + tab Blokir Waktu (CRUD: hari, jam mulai/selesai, keterangan).
- **Approve Jadwal** — grid kartu slot miliknya; badge peran; 4 dot progres dosen; tombol Setujui / Tolak; modal alasan penolakan; tombol reset ke menunggu.

### Mahasiswa
- **Onboarding — Isi Jadwal Kuliah** *(muncul sekali, memblok menu lain sampai selesai)* — CRUD mata kuliah (matkul, kelas, hari, Sesi/jam, ruangan, dosen); checkbox "Tidak ada kuliah semester ini"; tombol **Selesai**.
- **Jadwal Seminar** — kartu detail seminar (judul, NIM, pembimbing, penguji) + kartu slot (tanggal, jam, ruangan) + progres persetujuan `n/4` + status per dosen.
- **Jadwal Kuliah** — sama seperti layar onboarding tapi bisa diakses kapan saja untuk memperbarui; banner "N mata kuliah terdaftar sebagai hard constraint GA".

## 8b. Gelombang & Kuota (aturan prodi — Pengumuman Koordinator TA, 28 Jul 2026)

- **Sempro dan Sidang TA (Semhas) punya timeline gelombang terpisah**, dibuka bertahap per bulan. Contoh Gasal 2026/2027:

  | Jenis | Gelombang | Pendaftaran | Pelaksanaan |
  |---|---|---|---|
  | Sempro | G1 | 06–11 Agu 2026 | 18–21 Agu 2026 |
  | Sempro | G2 | 01–09 Sep 2026 | 21–25 Sep 2026 |
  | Sempro | G3 | tgl 01–09 (Okt/Nov/Des) | mulai tgl 15 bulan berjalan |
  | Sidang TA | G1 | 01–09 Okt 2026 | mulai 15 Okt 2026 |
  | Sidang TA | G2 | 01–09 Nov 2026 | mulai 15 Nov 2026 |
  | Sidang TA | — | batas pelaksanaan | 22 Des 2026 |

- **Pola**: pendaftaran di awal bulan (tgl 01–09) → jadwal detail (hari, jam, penguji) diumumkan **setelah pendaftaran ditutup** (inilah yang SIPENTA generate) → pelaksanaan mulai tgl 15.
- **Kuota maksimal 15 mahasiswa per bulan** per jenis. Bila pendaftar > 15, kelebihannya (menurut **urutan waktu pendaftaran**) **ditunda ke gelombang bulan berikutnya**.
- Di SIPENTA: satu **`gelombang`** = satu batch bulanan (satu jenis), `kuota_maks` default 15. `parse-sps` mengurutkan pendaftar (`urutan_daftar`) dan menandai baris ke-16 dst. sebagai `dijadwalkan = false`. Hanya `dijadwalkan = true` yang masuk ke GA.
- Pembimbing (utama + pendamping) sudah disetujui sebelum mahasiswa mendaftar → datang lengkap dari sheet. Penguji 1 & 2 ditetapkan admin setelah pendaftaran ditutup.

## 9. Aturan Penjadwalan (ringkas — detail di `ga-design.md`)

**Hard constraint** (wajib 0, jadwal tidak valid bila dilanggar) — semua adalah bentrok waktu yang mustahil terjadi bersamaan:
- H1 ruangan tidak dipakai 2 seminar bersamaan (dilewati bila `is_online`)
- H2 dosen tidak di 2 seminar bersamaan (berlaku 4 peran)
- H3 tidak bentrok jadwal mengajar dosen
- H4 tidak bentrok blokir waktu dosen
- H5 tidak bentrok jadwal kuliah mahasiswa

**Soft constraint** (menentukan kualitas, tidak memblokir hasil):
- S0 (bobot tertinggi) dosen idealnya menguji maks. 1 topik/hari
- S1 dosen idealnya total maks. 1 keterlibatan/hari
- S2 beban merata antar dosen · S3 minim gap ruangan · S4 sebar antar hari · S5 dosen tidak lompat ruangan

Durasi per sesi: **Sempro 60 menit**, **Semhas 105 menit** (1 jam 45 menit) — bisa di-override per gelombang lewat `gelombang.durasi_menit`. Satu gelombang = satu jenis, maks 15 seminar (lihat §8b).

**Jendela blackout** (tidak ada seminar): Sholat Dzuhur 12.00–13.00 (Sen–Kam), Sholat Jumat 11.00–13.00 (Jumat), Sholat Ashar 15.00–16.00 (semua hari). Diterapkan GA saat generate slot kandidat. **Jadwal kuliah kampus pakai sistem Sesi 1–4** dengan jam berbeda antara Sen–Kam dan Jumat (detail di [`ga-design.md`](ga-design.md) §2); Edge Function mengubah Sesi → jam sebelum kirim ke GA.

## 10. Kebutuhan Non-Fungsional

| Kategori | Target |
|---|---|
| Performa generate | < 10 dtk untuk gelombang ≤ 30 seminar (sinkron); pola async bila lebih besar |
| Performa UI | First load < 3 dtk di 4G; interaksi < 100 ms |
| Ketersediaan | best-effort (capstone) — Supabase + hosting managed |
| Keamanan | RLS di semua tabel; secret hanya di Edge Function & AI service; HTTPS wajib; tidak ada kredensial di client bundle |
| Privasi | data mahasiswa/dosen hanya terlihat sesuai peran; alasan penolakan hanya admin + dosen terkait |
| Notifikasi | in-app (tabel `notification` + Realtime) **dan** email (Resend) untuk setiap event — keduanya, bukan salah satu |
| Aksesibilitas | kontras AA, target sentuh ≥ 44px, fokus keyboard terlihat |
| Kompatibilitas | Chrome/Safari/Firefox terbaru; Android 8+; iOS 14+ |
| Offline (mobile) | baca-saja untuk data yang sudah dimuat; aksi tulis butuh online (tampilkan status) |
| Observability | log terstruktur di Edge Function & AI service; `schedule_run.stats` menyimpan metrik tiap generate |

## 11. Rilis / Milestone (draft, tanggal diisi PM)

| # | Milestone | Isi |
|---|---|---|
| M0 | Fondasi | Repo, struktur folder, skema DB + RLS awal, auth, shell app (sidebar/bottom-nav), CI |
| M1 | Data master + self-service | CRUD dosen/ruangan/jadwal mengajar, blokir waktu dosen, jadwal kuliah mahasiswa |
| M2 | Wizard penjadwalan | Upload sheet pendaftaran, parse (buat mhs+seminar), preview & validasi (penguji + tandai online), konfigurasi, simpan gelombang |
| M3 | GA terintegrasi | `ai-service` MVP (hard constraint), Edge Function `generate-schedule`, tampilan hasil tabel/kalender, simpan run |
| M4 | Approval & finalisasi | Approve/tolak dosen, monitor admin (realtime), RPC `finalisasi_jadwal` (gate 4/4) + `batalkan_jadwal`, notifikasi in-app + email |
| M5 | Multiplatform & ekspor | Build Capacitor Android/iOS, plugin native, ekspor Excel/PDF, polish mobile |
| M6 | Benchmark & dokumentasi | Uji GA vs jadwal manual Genap 25/26, tuning bobot, dokumen akhir capstone |

## 12. Risiko

| Risiko | Mitigasi |
|---|---|
| Format sheet pendaftaran bervariasi antar periode | Parser toleran + template unduhan resmi + langkah preview/validasi manual |
| Nama dosen tidak konsisten di sumber data | Normalisasi ke `dosen_id` saat impor; GA hanya terima id |
| GA lambat untuk gelombang besar | Reduksi domain (H3–H5 dibuang sebelum GA) + terminasi dini; siapkan pola async |
| Dosen tidak kunjung approve → jadwal tak bisa difinalisasi | Reminder notifikasi berkala; admin bisa hubungi manual; run bisa dibatalkan & digenerate ulang |
| Satu slot ditolak → seluruh finalisasi tertahan | Admin generate ulang (bisa kunci slot yang sudah ACC di iterasi berikutnya — enhancement) atau sesuaikan manual lalu minta ACC ulang |
| Capacitor build iOS butuh Mac | Pakai runner CI macOS (GitHub Actions) atau 1 anggota dengan Mac untuk rilis |
| Email deliverability (Resend) | Verifikasi domain pengirim; fallback: notifikasi in-app tetap tercatat |
| Supabase free-tier limit | Cukup untuk capstone; pantau kuota; hindari query N+1 · project di-pause bila 1 minggu idle → tinggal restore |
| **DB cloud dipakai bersama** (mode tanpa Docker) | Migrasi hanya lewat file + PR, tidak ubah tabel di dashboard · satu "DB owner" yang `db push` · idealnya 2 project: `sipenta-dev` + `sipenta-demo` |

## 13. Pertanyaan Terbuka

> Sudah dijawab tim (revisi 2026-09-10): (1) hanya 3 role, kaprodi = admin; (2) jadwal fix = **wajib 4/4 ACC** semua slot; (3) `online` **ditetapkan admin** per seminar; (4) notifikasi **in-app + email**; (5) **data dosen manual**, data mahasiswa + pembimbing dari **sheet pendaftaran**, penguji dipilih admin; (6) jadwal kuliah pakai **sistem Sesi 1–4** (07.30–10.00 / 10.20–12.00 / 13.00–15.30 / 15.50–17.30, Edge Function yang ekspansi ke jam); (7) **jendela blackout** sholat Dzuhur 12.00–13.00 & Ashar 15.00–16.00 — tidak ada seminar di jam ini. Sisa:

1. Semhas (105 mnt) tidak muat di jendela sore 16.00–17.30 (berakhir 17.45) — jam operasional diperpanjang, atau slot sore Semhas hanya 13.00–15.00?
2. Hari Jumat: sholat Jumat lebih panjang (± 11.30–13.00) — perlu jendela blackout khusus Jumat?
3. Libur nasional / cuti bersama — perlu dikecualikan dari rentang tanggal gelombang?
4. Urutan bobot soft constraint GA (S0=10 > S1=5 > …) — sudah sesuai prioritas? (mudah di-tuning kapan saja)
5. Provider email: Resend, atau SMTP kampus?
6. Perlu fitur "kunci slot yang sudah ACC" saat generate ulang (biar dosen tak perlu ACC ulang slot yang sudah oke)?
