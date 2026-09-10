# Struktur Folder & Pembagian Kerja

## Prinsip

**Satu monorepo, tiga area kerja yang terpisah bersih**: `app/` (frontend), `supabase/` (backend), `ai-service/` (AI). Tiap area punya owner, punya siklus deploy sendiri, dan berkomunikasi lewat kontrak yang didokumentasikan di [`api-contract.md`](api-contract.md) — bukan lewat import kode lintas area.

## Kenapa `app/` satu folder, bukan `frontend-web/` + `frontend-mobile/`

Dengan **Capacitor**, aplikasi mobile native adalah *bungkus* dari build web yang sama — bukan codebase terpisah. Membuat dua project Nuxt berarti dua kali kerja, dua kali bug, dua kali maintenance untuk tim kecil.

**Dua FE developer tetap punya pembagian jelas**, tapi di dalam satu codebase:

| FE Dev | Fokus |
|---|---|
| **FE-Web** | Layout desktop, layar admin yang padat tabel (wizard penjadwalan, monitor approval, finalisasi, laporan), tampilan kalender, halaman cetak/export |
| **FE-Mobile** | Konfigurasi Capacitor + plugin native (StatusBar, SplashScreen, Keyboard, Haptics, Filesystem, Share, Push), layout & gesture mobile, layar dosen & mahasiswa (approve, blokir waktu, lihat jadwal), safe-area, offline-friendly state |

Pembagian ini soft — keduanya me-review PR satu sama lain. Komponen di `components/ui/` dipakai bersama.

## Layout lengkap

```
sipenta/
│
├── app/                          # ── FRONTEND (Nuxt 3, web + mobile) ──────────────
│   ├── nuxt.config.ts            #    ssr: false (SPA) — satu build untuk web & Capacitor
│   ├── capacitor.config.ts       #    id, appName, webDir: '.output/public'
│   ├── app.vue
│   ├── assets/css/tailwind.css
│   ├── components/
│   │   ├── ui/                   #    design system: Button, Badge, Card, Modal, Stepper, DataTable…
│   │   ├── layout/               #    AppSidebar, AppTopbar, MobileNav
│   │   ├── schedule/             #    wizard step components, CalendarGrid, SlotTable, GenerateProgress
│   │   └── approval/             #    ApprovalCard, ApprovalProgressDots, DeclineDialog
│   ├── composables/
│   │   ├── useAuth.ts            #    login, session, role guard
│   │   ├── useSupabase.ts        #    typed client (from @nuxtjs/supabase)
│   │   ├── useSchedule.ts        #    wizard state, generate call, realtime slot updates
│   │   ├── useApproval.ts
│   │   └── usePlatform.ts        #    isNative(), haptics, share, file save
│   ├── layouts/                  #    default (authed shell), auth (login), blank
│   ├── middleware/
│   │   ├── auth.global.ts        #    redirect ke /login kalau belum sesi
│   │   ├── onboarding.global.ts  #    dosen/mahasiswa dgn onboarding_at null → paksa ke /<role>/onboarding
│   │   └── role.ts               #    guard per-halaman: definePageMeta({ role: 'admin' })
│   ├── pages/
│   │   ├── login.vue
│   │   ├── index.vue            #    redirect sesuai role
│   │   ├── admin/               #    dashboard, seminar/ (wizard), jadwal/ (detail + finalisasi), riwayat, laporan, master/ (dosen, ruangan, jadwal-dosen), approval-status
│   │   ├── dosen/               #    onboarding, dashboard, seminar-saya, blokir-waktu, approve
│   │   └── mahasiswa/           #    onboarding, jadwal-seminar, jadwal-kuliah
│   ├── stores/                  #    Pinia: auth, ui, wizardDraft
│   ├── types/
│   │   ├── database.types.ts    #    GENERATED: supabase gen types typescript
│   │   └── domain.ts            #    enum peran, status, jenis seminar (hand-written, dipakai lintas layar)
│   └── utils/                   #    date, time-overlap helpers, formatters
│
├── supabase/                     # ── BACKEND (Supabase project) ──────────────────
│   ├── config.toml
│   ├── migrations/               #    SQL berurutan — SATU-SATUNYA sumber kebenaran skema
│   │   ├── 0001_core_schema.sql  #    tabel, enum, index
│   │   ├── 0002_rls_policies.sql #    Row Level Security per tabel per role
│   │   ├── 0003_rpc_approval.sql #    fungsi Postgres: submit_approval(), finalisasi_jadwal(), batalkan_jadwal()
│   │   └── 0004_triggers_notif.sql
│   ├── functions/                #    Edge Functions (Deno/TypeScript)
│   │   ├── _shared/              #    cors.ts, supabaseAdmin.ts, types.ts
│   │   ├── parse-sps/            #    baca sheet pendaftaran → buat mahasiswa + seminar (+ bagi kuota)
│   │   ├── generate-schedule/    #    rakit payload, panggil ai-service, tulis hasil
│   │   ├── export-schedule/      #    render Excel/PDF → signed URL
│   │   └── notify/              #    tulis notification + kirim email via Resend (keduanya)
│   ├── seed.sql                 #    data dummy dev: dosen, ruangan, 1 gelombang contoh
│   └── tests/                   #    pgTAP / deno test
│
├── ai-service/                   # ── AI ENGINEER (Python) ────────────────────────
│   ├── pyproject.toml
│   ├── Dockerfile
│   ├── app/
│   │   ├── main.py              #    FastAPI: POST /solve, GET /health
│   │   ├── api/routes.py
│   │   ├── models/              #    pydantic: SolveRequest, SolveResponse
│   │   ├── config.py
│   │   └── ga/
│   │       ├── slots.py         #    slot kandidat (buang blackout) + reduksi domain (H3–H5)
│   │       ├── chromosome.py
│   │       ├── fitness.py       #    H1–H2 dinamis + S0–S5 soft
│   │       ├── operators.py     #    tournament, uniform crossover, reassignment mutation
│   │       └── engine.py        #    loop GA + terminasi
│   ├── tests/
│   │   └── fixtures/            #    dataset riil Genap 25/26 (anonim) untuk benchmark
│   └── notebooks/              #    eksperimen tuning bobot
│
├── docs/                         # ── DOKUMENTASI (semua) ─────────────────────────
│   ├── STRUCTURE.md
│   ├── prd.md
│   ├── api-contract.md
│   ├── database-erd.md
│   ├── ga-design.md
│   ├── prd-ai-scheduling.md
│   └── adr/                     #    Architecture Decision Records (1 file per keputusan)
│
└── figmake/                      # prototipe UI/UX (React) — REFERENSI SAJA, tidak di-build, tidak di-deploy
```

## Kepemilikan & batas

| Area | Owner | Deploy ke | Tidak boleh |
|---|---|---|---|
| `app/` | 2 FE | Cloudflare Pages / Vercel (web) + Play Store / App Store (Capacitor) | akses tabel tanpa lewat RLS; simpan secret |
| `supabase/` | 2 BE | Supabase Cloud | logika berat di client; panggil AI service dari client |
| `ai-service/` | 2 AI | Railway / Render / Fly.io (container) | akses database langsung; tahu aturan Sesi/jam kampus (dikirim sudah jadi) |

Kontrak antar area **hanya** lewat: (1) tabel + RLS Supabase, (2) Edge Function HTTP, (3) endpoint AI service. Semua didefinisikan di [`api-contract.md`](api-contract.md).

## Konvensi

- **Bahasa domain**: Indonesia untuk nama tabel/kolom/enum (`gelombang`, `blokir_waktu`, `peran`), English untuk nama teknis kode (`useSchedule`, `SolveRequest`).
- **Branch**: `main` (protected) ← PR dari `feat/<area>-<ringkas>`, mis. `feat/app-wizard-step-2`, `feat/be-rls-approval`, `feat/ai-fitness-h1`.
- **Migrasi DB**: tidak pernah edit migrasi yang sudah di-merge — selalu tambah file baru bernomor.
- **Tipe TS**: `pnpm --filter app gen:types` setelah tiap perubahan skema (regenerate `database.types.ts`).
- **Commit**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- **Env**: `.env.example` di tiap area; `.env` tidak pernah di-commit.
