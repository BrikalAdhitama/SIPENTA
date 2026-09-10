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
| [`docs/prd.md`](docs/prd.md) | Product Requirements — peran, alur, semua use case |
| [`docs/api-contract.md`](docs/api-contract.md) | Kontrak API per use case (Supabase + Edge Function + GA service) |
| [`docs/database-erd.md`](docs/database-erd.md) | Skema database & relasi |
| [`docs/ga-design.md`](docs/ga-design.md) | Desain algoritma genetika (kromosom, fitness, constraint) |
| [`docs/prd-ai-scheduling.md`](docs/prd-ai-scheduling.md) | PRD khusus komponen AI |

## Mulai kerja

```bash
# Frontend
cd app && pnpm install && pnpm dev

# Backend (perlu Docker + Supabase CLI)
cd supabase && supabase start && supabase db reset

# AI service
cd ai-service && uv sync && uv run uvicorn app.main:app --reload
```
