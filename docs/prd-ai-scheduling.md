# PRD — AI Scheduling Engine (SIPENTA)

| | |
|---|---|
| **Komponen** | AI Scheduling Engine (Genetic Algorithm microservice, `ai-service/`) |
| **Owner** | 2 AI Engineer |
| **Status** | Draft v2 — klasifikasi hard/soft constraint dikoreksi (§5) |
| **Dokumen teknis** | [`ga-design.md`](ga-design.md) · kontrak: [`api-contract.md`](api-contract.md) §E |

---

## 1. Masalah

Penjadwalan Sempro/Semhas manual: mencocokkan 4 dosen + jadwal mengajar + jadwal kuliah mahasiswa + ruangan untuk puluhan mahasiswa/gelombang. Data riil Genap 25/26 (45 sempro + 48 sidang): 14/72 pasangan (penguji,hari) menguji >1 topik sehari (sempro), 18/76 (semhas), ada yang 3 topik sehari; 41/126 pasangan (dosen,hari) terlibat >1 sidang. Penyusunan makan waktu berhari-hari.

## 2. Tujuan & Metrik

| Metrik | Baseline manual | Target |
|---|---|---|
| Bentrok ruangan/dosen/mengajar/kuliah | tak terukur | **0 — wajib mutlak** |
| Dosen menguji >1 topik/hari (S0) | 14 / 18 | serendah mungkin |
| (dosen,hari) dengan >1 keterlibatan (S1) | 41/126 | < 15 |
| Waktu generate ≤30 seminar | hitungan hari | < 10 detik |
| Seminar gagal terjadwal tanpa penjelasan | — | 0 |

Aturan "1 dosen 1 topik/hari" **diusahakan** (soft), bukan diwajibkan — bukan bentrok fisik, jadi kalau gelombang tak punya solusi sempurna, sistem tetap keluarkan jadwal valid dengan pelanggaran minimal.

## 3. Ruang Lingkup

**Masuk (AI Engineer)**: generator slot + reduksi domain, mesin GA (kromosom/fitness/operator), REST API FastAPI, pelaporan (jadwal + skor + `stats` + `unscheduled`), benchmark.
**Di luar**: parsing Excel & normalisasi nama→id & ekspansi Sesi→jam (Edge Function), UI, alur approval, notifikasi, penyimpanan DB.

## 4. Alur (5 fase)

1. **Input & Normalisasi** *(Edge Function)* — parse SPS, nama dosen → `dosen_id`, Sesi → rentang jam, rakit payload.
2. **Generate Slot** *(GA)* — tanggal × ruangan × durasi → daftar slot berindeks. Slot `is_online` boleh paralel.
3. **Reduksi Domain** *(GA)* — `domain[i]` = slot yang lolos H3–H5 untuk seminar i. Gene i hanya dari `domain[i]` → H3–H5 mustahil dilanggar. Domain kosong → `unscheduled` + alasan.
4. **Optimasi GA** *(GA)* — populasi 100, loop: fitness → tournament → uniform crossover → reassignment mutation → elitism. Berhenti saat V_hard=0 & stabil / plateau / 500 generasi.
5. **Decode & Output** *(GA)* — kromosom terbaik → jadwal + `conflict_count` (selalu 0) + `fitness_score` + `stats` + `unscheduled`.

## 5. Desain Constraint

**Prinsip**: hard = bentrok waktu yang **fisiknya mustahil** terjadi bersamaan. Batas beban kerja = soft.

### Hard (wajib 0, tanpa pengecualian)
| ID | Constraint | Milik role | Penegakan |
|---|---|---|---|
| H1 | Ruangan tidak dipakai 2 seminar bersamaan | Admin | fitness (skip bila `is_online`) |
| H2 | Dosen tidak di 2 seminar bersamaan (4 peran) | Dosen | fitness |
| H3 | Tidak bentrok jadwal mengajar | Dosen | reduksi domain |
| H4 | Tidak bentrok blokir waktu | Dosen | reduksi domain |
| H5 | Tidak bentrok jadwal kuliah mahasiswa | Mahasiswa | reduksi domain |

### Soft (kualitas, tidak memblokir)
| ID | Constraint | Bobot |
|---|---|---|
| S0 | Dosen menguji maks. 1 topik/hari (peran penguji) | 10 |
| S1 | Dosen total maks. 1 keterlibatan/hari (4 peran) | 5 |
| S2 | Beban merata antar dosen | 4 |
| S3 | Minim gap kosong per ruangan | 3 |
| S4 | Sebar merata antar hari | 2 |
| S5 | Dosen tidak lompat ruangan | 1 |

### Kenapa H6/H7 versi lama dikoreksi jadi soft
(1) Mencampur "tidak mungkin" (bentrok) dan "tidak ideal" (beban) dalam satu kategori kegagalan mutlak → definisi tidak konsisten. (2) Feasibility hard-cap dihitung dari satu semester histori; gelombang lain (dosen cuti, dll.) bisa membuat cap mustahil → GA gagal total, padahal jadwal valid tersedia. Sebagai S0 (bobot 10) tujuan tetap tercapai tanpa risiko gagal.

## 6. Fitness

```
V_hard = H1 + H2                                       # H3–H5 = 0 (reduksi domain)
P_soft = 10*S0 + 5*S1 + 4*S2 + 3*S3 + 2*S4 + 1*S5      # maks 25
fitness = 1 / (1 + 100*V_hard + P_soft)
konflik = V_hard (wajib 0) ; skor_kualitas = 100*(1 − P_soft/25)
```
Bobot 100/hard-violation memastikan 1 bentrok selalu lebih buruk dari seluruh soft memburuk sekaligus.

## 7. Input/Output

`POST /solve` — skema di [`api-contract.md`](api-contract.md) §E. Parameter GA default + `soft_weights` terkonfigurasi. `random_seed` opsional untuk reproduksibilitas demo.

## 8. Evaluasi

- Unit test per constraint (bentrok sengaja → terdeteksi; kasus bersih → lolos; H3–H5 → slot tersingkir dari domain).
- **Skala nyata: 1 gelombang = ≤ 15 seminar** (kuota prodi maks 15 mahasiswa/bulan). Benchmark = pecah data manual Genap 25/26 per bulan jadi fixture ≤15, jalankan GA per gelombang, agregasi. Fokus S0 & S1 vs baseline manual per periode.
- Uji ketahanan: gelombang padat tetap konvergen ke V_hard=0; domain kosong → `unscheduled` bukan crash; konsistensi antar-run dengan seed tetap.
- Durasi: Sempro 60 mnt, Semhas 105 mnt (1 jam 45 menit) — dikonfirmasi; bisa di-override per gelombang.

## 9. Risiko

| Risiko | Mitigasi |
|---|---|
| Domain kosong sebagian seminar | `unscheduled` + alasan; admin tambah hari/ruangan lalu generate ulang |
| Gelombang padat → S0/S1 tak sempurna | soft, jadwal tetap valid, dilaporkan lewat `stats` |
| Nama dosen tak konsisten | API hanya terima `dosen_id`; normalisasi di Edge Function |
| Eksekusi lambat N besar | reduksi domain + terminasi dini; siapkan pola async |
| Hasil beda tiap run | `random_seed` |

## 10. Milestone

| # | Isi |
|---|---|
| M1 | `slots.py` + reduksi domain + unit test; laporan ukuran domain/seminar |
| M2 | `fitness.py` H1–H2 + S0–S5 + unit test per constraint |
| M3 | operator + loop GA; konvergen dataset kecil |
| M4 | FastAPI `/solve` sesuai kontrak, integrasi awal dengan Edge Function |
| M5 | benchmark vs manual Genap 25/26 |
| M6 | tuning bobot soft, dokumentasi akhir |
