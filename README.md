# SIPENTA — Sistem Penjadwalan Seminar Tugas Akhir

Aplikasi multiplatform (web + mobile native) untuk penjadwalan otomatis Seminar Proposal (Sempro) dan Seminar Hasil (Semhas) menggunakan **Algoritma Genetika**.

Capstone Project — tim 7 orang (1 PM, 2 Frontend, 2 Backend, 2 AI Engineer).

## Tech stack

| Lapisan | Teknologi |
|---|---|
| Frontend (web + mobile) | **Nuxt 3** (Vue 3) · Tailwind CSS · **Capacitor** (Android/iOS) |
| Backend / BaaS | **Supabase** — Postgres, Auth, Row Level Security, Storage, Realtime, Edge Functions (Deno) |
| AI / Penjadwalan | **Python** · FastAPI · Algoritma Genetika custom |

## Struktur repo

```
sipenta/
├── app/          → Nuxt 3 — SATU codebase untuk web & mobile (Capacitor)   [Frontend]
├── supabase/     → skema DB, RLS, Edge Functions, seed                       [Backend]
├── ai-service/   → microservice Python algoritma genetika                    [AI Engineer]
├── docs/         → PRD, API contract, ERD, ADR
└── figmake/      → prototipe UI/UX referensi (React, tidak di-build)
```

Detail pembagian folder & kepemilikan: [`docs/STRUCTURE.md`](docs/STRUCTURE.md)

## Dokumen inti

| Dokumen | Isi |
|---|---|
| [`docs/STRUCTURE.md`](docs/STRUCTURE.md) | Struktur folder, siapa mengerjakan apa, konvensi |
| [`docs/sprint-plan.md`](docs/sprint-plan.md) | Rencana 7 sprint per area (FE/BE/AI) + aturan anti-tabrakan |
| [`docs/prd.md`](docs/prd.md) | Product Requirements — peran, alur, semua use case |
| [`docs/api-contract.md`](docs/api-contract.md) | Kontrak API per use case (Supabase + Edge Function + AI service) |
| [`docs/database-erd.md`](docs/database-erd.md) | Skema database & relasi |
| [`docs/ga-design.md`](docs/ga-design.md) | Desain algoritma genetika (kromosom, fitness, constraint) |
| [`docs/prd-ai-scheduling.md`](docs/prd-ai-scheduling.md) | PRD khusus komponen AI |

## Mulai kerja

Backend = **1 project Supabase cloud** yang di-share (tanpa Docker). Isi `.env` tiap area dari `.env.example`.

```bash
# Frontend — sambung ke Supabase cloud
cd app && npm install && npm run dev

# Backend — Supabase CLI saja (tanpa Docker Desktop)
npm i -g supabase && supabase login
cd supabase && supabase link --project-ref <ref> && supabase db push

# AI service
cd ai-service && uv sync && uv run uvicorn app.main:app --reload
```

Detail alur migrasi & deploy Edge Function: [`supabase/README.md`](supabase/README.md).
