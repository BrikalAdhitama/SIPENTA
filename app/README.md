# app/ — Frontend (Nuxt 3, web + mobile)

Owner: 2 FE. **Satu codebase** — Capacitor membungkus build web yang sama jadi Android/iOS. Tidak ada project mobile terpisah. Pembagian FE-Web / FE-Mobile: lihat [`../docs/STRUCTURE.md`](../docs/STRUCTURE.md).

## Stack
Nuxt 3 (`ssr: false` → SPA) · Vue 3 · TS · Tailwind (`@nuxtjs/tailwindcss`) · Pinia · `@nuxtjs/supabase` · Capacitor (app, status-bar, splash-screen, keyboard, haptics, preferences, filesystem, share, browser).

## Struktur
```
components/{ui,layout,schedule,approval}/   composables/   layouts/   middleware/
pages/{login,index,admin,dosen,mahasiswa}/   stores/   types/   utils/
```
- `types/database.types.ts` — GENERATED (`pnpm gen:types`).
- `types/domain.ts` — enum & konstanta manual (peran, status, jenis).
- Guard peran: `definePageMeta({ role: 'admin' })` dibaca `middleware/role.ts`.
- **Gate onboarding**: `middleware/onboarding.global.ts` — bila `profile.role` ∈ {dosen, mahasiswa} dan `profile.onboarding_at` null, semua rute selain `/<role>/onboarding` & logout di-redirect ke sana. Dilepas setelah `rpc('selesai_onboarding')` sukses (lihat `docs/api-contract.md` AC-5).

## Perintah
```bash
pnpm install && pnpm dev        # web :3000
pnpm gen:types                   # regenerate types dari Supabase
pnpm build                       # → .output/public (web hosting & Capacitor)
pnpm cap:sync                     # nuxi generate + cap sync
pnpm cap:android / cap:ios        # buka IDE native
```

## Env (`.env`, lihat `.env.example`)
```
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_KEY=      # anon key, dijaga RLS
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

## Catatan mobile
Deep link `sipenta://` · sesi Supabase → `@capacitor/preferences` (bukan localStorage) · ekspor file native pakai `Filesystem` + `Share` · back-button Android via `@capacitor/app`.
