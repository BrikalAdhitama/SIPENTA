# ai-service/ — AI (Algoritma Genetika)

Owner: 2 AI Engineer. Microservice Python yang menerima data penjadwalan lewat HTTP dan mengembalikan jadwal optimal.

Desain algoritma lengkap: [`../docs/ga-design.md`](../docs/ga-design.md). PRD komponen AI: [`../docs/prd-ai-scheduling.md`](../docs/prd-ai-scheduling.md).

## Kontrak

`POST /solve` — dipanggil **hanya** oleh Edge Function `generate-schedule` (header `X-AI-Key`). Sinkron, timeout 60 dtk.
`GET /health` — cek hidup.

Skema request/response: [`../docs/api-contract.md`](../docs/api-contract.md) §E. Payload sudah bersih: jadwal mengajar/kuliah dalam rentang jam, dosen sebagai `dosen_id` — GA tidak tahu aturan Sesi kampus.

## Struktur

```
app/
  main.py           FastAPI app + route /solve, /health
  api/routes.py
  models/           pydantic SolveRequest, SolveResponse
  config.py         AI_KEY, defaults
  ga/
    slots.py        generate slot kandidat (buang irisan blackout_windows / waktu sholat) + REDUKSI DOMAIN (buang slot langgar H3-H5)
    chromosome.py   array integer, 1 gene = 1 seminar → index slot dari domain[i]
    fitness.py      V_hard = H1 + H2 ; soft = 10*S0 + 5*S1 + 4*S2 + 3*S3 + 2*S4 + 1*S5
    operators.py    tournament(k=3), uniform crossover(0.8), reassignment mutation(0.1), elitism(2)
    engine.py       loop GA + terminasi (hard=0 & stabil / plateau / max gen)
tests/
  fixtures/         dataset riil Genap 25/26 (anonim) untuk benchmark vs jadwal manual
notebooks/          eksperimen tuning bobot soft
```

## Constraint (ringkas)

| Hard (wajib 0) | Cara |
|---|---|
| H1 bentrok ruangan (skip bila `is_online`) | fitness |
| H2 dosen di 2 seminar bersamaan | fitness |
| H3 bentrok jadwal mengajar | **reduksi domain** |
| H4 bentrok blokir waktu | **reduksi domain** |
| H5 bentrok jadwal kuliah mahasiswa | **reduksi domain** |

| Soft (kualitas) | Bobot |
|---|---|
| S0 dosen menguji > 1 topik/hari | 10 |
| S1 dosen total > 1 keterlibatan/hari | 5 |
| S2 beban merata · S3 gap ruangan · S4 sebar hari · S5 lompat ruangan | 4·3·2·1 |

## Jalankan

```bash
uv sync
uv run uvicorn app.main:app --reload --port 8000
uv run pytest
```

## Env (`.env`)
```
AI_SERVICE_KEY=            # shared secret, dicek terhadap header X-AI-Key
```

## Deploy
Container (`Dockerfile`) ke Railway / Render / Fly.io. Set `AI_SERVICE_KEY`. URL & key dipasang di env Supabase Edge Function.
