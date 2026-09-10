# Desain Genetic Algorithm — Penjadwalan Sempro/Semhas (SIPENTA)

Status: **Draft v3** — batasan "1 dosen 1 topik/hari" ada di *soft* constraint, bukan hard. Hard constraint hanya untuk **bentrok waktu yang benar-benar tidak mungkin terjadi bersamaan**.

Author: AI Engineer (GA & scheduling service)

---

## 1. Ringkasan

Dari daftar seminar (Sempro/Semhas) + daftar dosen + constraint waktu → jadwal (tanggal, jam, ruangan) yang **bebas bentrok** (hard) dan **optimal** (soft) memakai Genetic Algorithm. Berjalan sebagai microservice Python (`ai-service/`), dipanggil oleh Edge Function `generate-schedule` (bukan client).

## 2. Temuan dari Data Riil (Informatika ITK, Genap 25/26)

| Temuan | Detail | Dampak |
|---|---|---|
| Durasi Sempro = **60 menit** (1 jam) | dikonfirmasi tim 2026-09-10 | `session_duration_minutes` = 60 |
| Durasi Semhas = **105 menit** (1 jam 45 menit) | dikonfirmasi tim 2026-09-10 | `session_duration_minutes` = 105 |
| Kuota **maks 15 seminar/gelombang** | aturan prodi (maks 15 mahasiswa/bulan) | GA menerima ≤ 15 seminar per panggilan; sisanya ditunda oleh BE sebelum generate |
| Venue **"online"** sah | 15/45 sempro online; semhas selalu offline | slot online tak konsumsi ruangan → H1 dilewati |
| Gelombang = bulan pendaftaran | Jan–Jun, bukan periode 1 minggu | 1 batch generate = 1 gelombang |
| Jadwal kuliah pakai sistem **Sesi 1–4** | jam per Sesi (beda Sen–Kam vs Jumat) | Edge Function ekspansi Sesi → jam sebelum kirim ke GA |
| Beban dosen 13–17 peran/orang | dari 13–14 dosen aktif | sudah relatif merata → S2 bukan masalah utama |
| Dosen menguji >1 topik/hari | sempro 14/72 pasangan (penguji,hari), ada yang 3 topik sehari; semhas 18/76 | pain point utama → **S0** (soft, bobot tertinggi) |
| Dosen terlibat >1 sidang/hari (semua peran) | 41/126 pasangan | **S1** (soft) |

### Mapping Sesi → Jam (fix, dikonfirmasi 2026-09-10) — **berbeda Jumat**
| Sesi | Senin–Kamis | Jumat |
|---|---|---|
| 1 | 07.30–10.00 | 07.30–09.10 |
| 2 | 10.20–12.00 | 09.20–11.00 |
| 3 | 13.00–15.30 | 13.00–15.30 |
| 4 | 15.50–17.30 | 16.00–17.40 |

Edge Function memakai tabel ini untuk mengubah "hari + Sesi N" pada jadwal kuliah/mengajar menjadi rentang jam sebelum dikirim ke GA. Pilih kolom Jumat bila `hari = jumat`.

### Jendela blackout harian (tidak boleh ada seminar) — **berbeda Jumat**
| Hari | Waktu | Keterangan |
|---|---|---|
| Senin–Kamis | 12.00–13.00 | Sholat Dzuhur |
| **Jumat** | **11.00–13.00** | **Sholat Jumat** |
| Semua hari | 15.00–16.00 | Sholat Ashar |

Berlaku **global** untuk semua ruangan & semua seminar. Diterapkan saat **generate slot kandidat** (§5) — slot yang beririsan tidak pernah dibuat. Tiap entry blackout boleh punya field `hari` (daftar hari berlakunya; tanpa `hari` = semua hari aktif).

> Konsekuensi kapasitas: Ashar 15.00–16.00 memotong sore jadi dua jendela — 13.00–15.00 dan 16.00–17.30. Semhas (105 mnt) **tidak muat** di jendela 16.00–17.30 (berakhir 17.45 > 17.30), jadi praktis hanya bisa di 13.00–15.00 pada sore hari. Jumat pagi juga lebih sempit (blackout mulai 11.00). Perlu dikonfirmasi tim: jam operasional seminar diperpanjang, atau terima kondisi ini.

### Masalah kualitas data (ditangani Edge Function saat impor)
Nama dosen tidak konsisten (`Ramadhan Paninggalih S.Si.,…` vs `…, S.Si.,…`), tanggal campur string & datetime, jam `10:00 : 11:00`, typo `17 Juni 206`, satu ruangan tiga penulisan. → **GA hanya menerima `dosen_id`**, bukan string nama.

## 3. Tiga role & pembagian hard/soft

Hard constraint menjaga kalender milik **Dosen** & **Mahasiswa** tidak pernah tumpang tindih, plus resource **Admin** (ruangan) tidak dipakai dua sidang sekaligus. Batas beban kerja bukan bentrok fisik → soft. Pengaman tambahan: setiap slot **wajib disetujui dosen** (halaman Approve Jadwal) — dosen yang harinya padat bisa menolak dengan alasan.

## 4. Representasi Kromosom

`chromosome = [slot_idx_1, …, slot_idx_N]`, panjang N = jumlah seminar dalam batch (**N ≤ 15** karena kuota prodi — BE hanya mengirim yang `dijadwalkan = true`). Posisi ke-`i` = identitas seminar tetap. Nilai = index ke `domain[i]` (slot kandidat yang lolos H3–H5). Crossover & mutation gene-wise.

## 5. Slot Kandidat + Reduksi Domain

```
untuk setiap tanggal dalam [tanggal_mulai, tanggal_selesai]
  jika hari(tanggal) ∈ hari_aktif:
    untuk setiap ruangan ∈ ruangan_aktif (termasuk "online"):
      isi jam_operasional dengan slot berurutan:
        durasi_sesi (60 sempro / 105 semhas) + jeda_menit
      buang slot yang beririsan dengan blackout_windows (sholat: Dzuhur/Jumat + Ashar)
      → slot = (tanggal, jam_mulai, jam_selesai, ruangan)

domain[i] = { slot s : s tidak melanggar H3, H4, H5 untuk seminar i }
```

`blackout_windows` dikirim dari Edge Function (dari `app_config.jadwal_kampus`, sudah termasuk aturan khusus Jumat). Tiap entry: `{ start, end, label, hari? }`. Filter ini setara dengan "di dalam jam operasional" & "di hari aktif" — struktural, tanpa biaya fitness.

Gene `i` **hanya** boleh bernilai index dari `domain[i]`. Inisialisasi, mutasi, crossover semuanya menghormati batas ini → **H3–H5 mustahil dilanggar**, tidak perlu dicek di fitness. `domain[i]` kosong → seminar masuk `unscheduled` dengan alasan, tanpa ikut GA.

**Venue online**: `seminars[i].is_online` **ditetapkan admin** (bukan diputuskan GA). Bila `true`, `domain[i]` hanya berisi slot online (venue dikunci "online"); GA tetap mengoptimasi *waktunya*. Slot online tak konsumsi ruangan fisik → H1 dilewati untuknya.

## 6. Fitness Function

### Hard constraints — wajib 0

| # | Constraint | Milik | Cara |
|---|---|---|---|
| H1 | Ruangan tidak dipakai 2 seminar bersamaan | Admin | fitness — dilewati bila `is_online` |
| H2 | Dosen tidak di 2 seminar bersamaan (4 peran) | Dosen | fitness |
| H3 | Tidak bentrok jadwal mengajar | Dosen | reduksi domain → dijamin 0 |
| H4 | Tidak bentrok blokir waktu | Dosen | reduksi domain → dijamin 0 |
| H5 | Tidak bentrok jadwal kuliah mahasiswa | Mahasiswa | reduksi domain → dijamin 0 |

### Soft constraints — kualitas, tidak memblokir

| # | Constraint | Bobot |
|---|---|---|
| S0 | Dosen idealnya menguji maks. 1 topik/hari (peran penguji saja) | **10** |
| S1 | Dosen idealnya total maks. 1 keterlibatan/hari (semua peran) | 5 |
| S2 | Beban merata antar dosen | 4 |
| S3 | Minim gap kosong per ruangan/hari | 3 |
| S4 | Sebar merata antar hari | 2 |
| S5 | Hindari dosen lompat ruangan berdekatan waktu | 1 |

### Kenapa S0/S1 bukan hard

Kalau "1 sidang/hari" dipaksa hard atas 4 peran, gelombang Januari & Maret jadi mustahil dijadwalkan (butuh 2 hari, tersedia 1), Februari mepet tanpa slack. Dan mencampur "tidak mungkin" (bentrok) dengan "tidak ideal" (beban) bikin definisi hard tidak konsisten + rapuh terhadap gelombang yang datanya beda dari histori. Sebagai soft berbobot tertinggi, tujuannya tetap tercapai tanpa risiko gagal generate.

### Formula

```
V_hard = H1 + H2                                         # H3–H5 dijamin 0
soft   = 10*S0 + 5*S1 + 4*S2 + 3*S3 + 2*S4 + 1*S5        # dinormalisasi per komponen, maks 25
fitness = 1000 / (1 + V_hard*100 + soft*10)
```
`conflict_count` yang dilaporkan ke user = `V_hard` (wajib 0). Kepadatan dosen dilaporkan lewat `stats`, bukan konflik.

## 7. Operator GA

| Tahap | Metode |
|---|---|
| Inisialisasi | gene acak dari `domain[i]` |
| Seleksi | tournament k=3 |
| Crossover | uniform, rate 0.8 |
| Mutasi | reassignment dari `domain[i]`, rate 0.1 |
| Elitism | top-2 utuh |
| Terminasi | V_hard=0 & stabil / plateau N generasi / max 500 |

## 8. Parameter Default

```json
{
  "population_size": 100, "generations": 500,
  "crossover_rate": 0.8, "mutation_rate": 0.1, "elitism_count": 2, "tournament_size": 3,
  "soft_weights": {
    "s0_menguji_lebih_dari_1_per_hari": 10,
    "s1_total_peran_lebih_dari_1_per_hari": 5,
    "s2_beban_merata_antar_dosen": 4,
    "s3_gap_kosong_ruangan": 3,
    "s4_sebar_antar_hari": 2,
    "s5_dosen_lompat_ruangan": 1
  }
}
```
`soft_weights` dapat dikonfigurasi tanpa ubah kode.

## 9. Kontrak API

`POST {AI_URL}/solve` — detail request/response di [`api-contract.md`](api-contract.md) §E. Payload sudah bersih (jam-range + `dosen_id`); GA tidak tahu aturan Sesi kampus.

## 10. Isu Terbuka

> Terjawab (2026-09-10): (a) venue `online` **ditetapkan admin** per seminar; (b) mapping Sesi 1–4 fix, beda Jumat (§2); (c) blackout sholat Dzuhur 12.00–13.00 (Sen–Kam), Jumat 11.00–13.00, Ashar 15.00–16.00 (semua hari). Sisa:

1. ⚠️ Semhas (105 mnt) tidak muat di jendela sore 16.00–17.30 → jam operasional diperpanjang, atau slot sore Semhas hanya 13.00–15.00?
2. ⚠️ Urutan bobot soft — sesuai prioritas tim? (mudah di-tuning lewat `soft_weights`)
3. ⚠️ Libur nasional / cuti bersama — dikecualikan dari rentang tanggal?
4. ⚠️ Jeda minimum antar sidang untuk dosen yang sama (mis. 30 menit)? → jadi S6 bila ada.

## 11. Rencana Implementasi

Stack Python 3.11+, FastAPI. Struktur: lihat [`../ai-service/README.md`](../ai-service/README.md).

Testing: unit test per constraint (kasus sengaja bentrok → terdeteksi; domain kosong → `unscheduled`, bukan crash), lalu **benchmark vs jadwal manual**.

> Catatan skala: satu panggilan `/solve` = satu gelombang bulanan = **≤ 15 seminar** (kuota prodi). Data manual Genap 25/26 (45 sempro + 48 semhas) itu total ~6 gelombang. Untuk benchmark, pecah dataset per bulan pendaftaran jadi beberapa fixture ≤15, jalankan GA per gelombang, lalu agregasi metrik. Ukuran kecil ini menguntungkan: ruang pencarian sempit, konvergensi cepat, `conflict_count = 0` mudah dicapai.

- `conflict_count` (H1+H2) **wajib 0** di setiap gelombang.
- S0 (dosen menguji >1 topik/hari) ditekan serendah mungkin — baseline manual per periode.
- S1 (keterlibatan >1/hari) jauh di bawah baseline manual.
