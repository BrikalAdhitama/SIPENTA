# ai-service/ — AI (Algoritma Genetika)

Owner: 2 AI Engineer. Microservice Python yang menerima data penjadwalan lewat HTTP dan mengembalikan jadwal optimal.

Desain algoritma lengkap: [`../docs/ga-design.md`](../docs/ga-design.md) · uraian implementasi + diagram alir: [`../docs/proposal-algoritma-genetika.md`](../docs/proposal-algoritma-genetika.md) · PRD komponen AI: [`../docs/prd-ai-scheduling.md`](../docs/prd-ai-scheduling.md).

## Kontrak

| Method | Route | Keterangan |
|---|---|---|
| `POST` | `/solve` | Dipanggil **hanya** oleh Edge Function `generate-schedule` (header `X-AI-Key`). Sinkron, timeout 60 dtk. |
| `GET` | `/health` | Cek hidup (dipakai uptime ping / cold start Render). |

Skema request/response: [`../docs/api-contract.md`](../docs/api-contract.md) §E. Payload sudah bersih: jadwal mengajar/kuliah dalam rentang jam, dosen sebagai `dosen_id` — GA tidak tahu aturan Sesi kampus.

## Struktur

```
app/
  main.py           FastAPI app: /solve, /health
  config.py         AI_KEY, path fixture
  models/__init__.py  pydantic SolveRequest / SolveResponse (api-contract §E)
  ga/
    timeutil.py     "13:30" ↔ menit, cek irisan waktu, nama hari
    context.py      Context: jadwal mengajar/kuliah/waktu pribadi → interval menit; peta dosen→seminar
    slots.py        generate slot kandidat (buang irisan blackout / waktu sholat) + REDUKSI DOMAIN (buang slot langgar H3–H5)
    chromosome.py   list[int], 1 gene = 1 seminar → index slot (-1 = tak terjadwal); seed greedy first-fit
    fitness.py      V_hard = H1 + H2 ; soft = 10*S0 + 5*S1 + 4*S2 + 3*S3 + 2*S4 + 1*S5
    operators.py    tournament(k=3), uniform crossover(0.8), reassignment mutation(0.1), elitism(2)
    engine.py       loop GA + terminasi (hard=0 & plateau / 2×plateau / batas waktu 25 dtk) ; solve() = pipeline 5 fase
tests/
  fixtures/         dataset riil Genap 25/26 (anonim) + contoh_sempro_februari.json (rakitan tangan)
  test_*.py         unit test slot, fitness, engine + kontrak HTTP /solve (46 test)
Dockerfile          image produksi (python:3.11-slim, uvicorn)
```

`solve(req, trace=...)` menerima argumen opsional `trace` (dict) untuk merekam jejak evolusi per generasi — dipakai saat benchmark/tuning, tidak memengaruhi hasil dan tidak dipakai `/solve`.

## Constraint (ringkas)

| Hard (wajib 0) | Cara |
|---|---|
| H1 bentrok ruangan (skip bila `is_online`) | fitness |
| H2 dosen di 2 seminar bersamaan | fitness |
| H3 bentrok jadwal mengajar | **reduksi domain** |
| H4 bentrok waktu pribadi dosen (hari berulang **atau** tanggal tertentu) | **reduksi domain** |
| H5 bentrok jadwal kuliah mahasiswa | **reduksi domain** |

| Soft (kualitas) | Bobot |
|---|---|
| S0 dosen menguji > 1 topik/hari | 10 |
| S1 dosen total > 1 keterlibatan/hari | 5 |
| S2 beban merata · S3 gap ruangan · S4 sebar hari · S5 lompat ruangan | 4·3·2·1 |

`fitness = 1000 / (1 + 100·V_hard + 10·soft)`. Field `fitness_score` pada response = skor kualitas 0–100.

## Jalankan

```bash
uv sync                                        # atau: pip install fastapi "uvicorn[standard]" pydantic
uv run uvicorn app.main:app --reload --port 8000
uv run pytest -q                               # 46 test
```

Uji `/solve` memakai fixture sebagai payload:

```bash
curl -X POST http://127.0.0.1:8000/solve \
     -H "Content-Type: application/json" \
     --data @tests/fixtures/genap2526_sempro_februari.json
# bila AI_SERVICE_KEY di-set: tambahkan -H "X-AI-Key: <rahasia>"
```

Hasil acuan (seed 42): `genap2526_sempro_februari.json` (15 seminar riil) → 15/15 terjadwal, 0 bentrok, skor 94.5, ~2 dtk.


## Untuk Backend (integrasi Edge Function)

Service ini **stateless**: tidak ada database, tidak ada state antar-permintaan. Panggil berulang kali dengan aman; hasil sama bila `ga_params.random_seed` sama.

### Panggilan

```
POST {AI_URL}/solve
Content-Type: application/json
X-AI-Key: <AI_SERVICE_KEY>        # wajib bila service dijalankan dengan env AI_SERVICE_KEY
```

Payload & response: [`../docs/api-contract.md`](../docs/api-contract.md) §E. Contoh payload siap pakai ada di `tests/fixtures/*.json` (dataset riil Genap 25/26, anonim).

### Format error (sama dengan Edge Function)

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "rooms tidak boleh kosong", "details": { "field": "rooms" } } }
```

| HTTP | `code` | Kapan |
|---|---|---|
| 401 | `UNAUTHENTICATED` | `X-AI-Key` salah / tidak dikirim (saat env di-set) |
| 422 | `VALIDATION_FAILED` | payload tidak lolos validasi; `details.field` menunjuk field penyebab |
| 500 | `INTERNAL` | kesalahan tak terduga di AI service |

Yang divalidasi: `seminar_type` ∈ {sempro, semhas} · `period` format & urutan tanggal · `active_days` & `hari` harus nama hari Indonesia · jam `HH:MM` (toleran `13.30` dan `13:30:00`) · `operational_hours` urut & muat satu sesi · `rooms`/`seminars` tidak kosong & `id` tidak ganda · `dosen_id`/`nim` wajib pada tiap interval · seminar daring wajib ada ruangan `is_online` · rentang `ga_params`.

### Hal yang memudahkan Edge Function

- **`ga_params` opsional dan boleh sebagian.** `app_config.ga_defaults` yang hanya memuat `s0…` & `s1…` tetap diterima — bobot lain memakai default (10·5·4·3·2·1). Kunci bobot yang salah tulis ditolak 422, bukan diam-diam diabaikan.
- **`stats.peringatan`** berisi daftar masalah data yang tidak menggagalkan generate, misalnya `nim` di `student_class_schedule` yang tidak cocok dengan seminar mana pun, `dosen_id` yang tidak terlibat seminar, atau `dosen_teaching_schedule` kosong (berarti H3 tidak diterapkan). Berguna saat merakit payload pertama kali.
- **`unscheduled[]`** memuat `seminar_id` + `alasan` bila sebuah seminar tidak punya slot layak sama sekali. `conflict_count` tetap 0 dan `status` = `success`.
- **Log** tiap permintaan: id ringkas, jumlah seminar, status, jumlah terjadwal, bentrok, skor, generasi, dan waktu eksekusi.

### Checklist payload dari Edge Function

1. `seminars` hanya yang `validasi = 'valid'` **dan** `dijadwalkan = true`.
2. Isi `nim` tiap seminar (dipakai H5) dan `dosen_id` keempat peran.
2b. `dosen_waktu_pribadi` (tabel `blokir_waktu`): kirim `hari` **atau** `tanggal` per entry — keduanya didukung. Nama lama `dosen_blocked_time` masih diterima.
3. Ekspansi "hari + Sesi N" → `jam_mulai`/`jam_selesai` memakai `app_config.jadwal_kampus.sesi` (kolom Jumat untuk hari Jumat).
4. `rooms` = `gelombang.ruangan_aktif` (+ satu ruangan `is_online: true` bila ada seminar daring).
5. `blackout_windows` dari `app_config.jadwal_kampus.blackout` (`mulai`/`selesai` → `start`/`end`).
6. Timeout panggilan 60 detik; GA sendiri berhenti maksimal 25 detik (`ga_params.max_seconds`).

### Uji cepat tanpa Supabase

```bash
uv run uvicorn app.main:app --port 8000
curl -X POST http://127.0.0.1:8000/solve -H "Content-Type: application/json" \
     --data @tests/fixtures/genap2526_sempro_februari.json | python -m json.tool
```

Dokumentasi interaktif (coba langsung dari browser): `http://127.0.0.1:8000/docs`.

## Docker

```bash
docker build -t sipenta-ai .
docker run -p 8000:8000 -e AI_SERVICE_KEY=<rahasia> sipenta-ai
```

## Env (`.env`)
```
AI_SERVICE_KEY=            # shared secret, dicek terhadap header X-AI-Key
```

## Deploy

Panduan langkah demi langkah (ramah pemula, tanpa nulis Docker): **[`../docs/deploy-ai-service.md`](../docs/deploy-ai-service.md)**.

Ringkas: Render → New Web Service → Root `ai-service` → env `AI_SERVICE_KEY` → dapat URL → serahkan URL + key ke BE (`supabase secrets set`). Cold start Render Free diatasi dengan ping `/health` tiap 10 menit via cron-job.org.
