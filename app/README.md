# app/ — Frontend (Nuxt 3, web + mobile)

Owner: 2 FE. **Satu codebase** — Capacitor membungkus build web yang sama jadi Android/iOS. Tidak ada project mobile terpisah. Pembagian FE-Web / FE-Mobile: lihat [`../docs/STRUCTURE.md`](../docs/STRUCTURE.md).

## Stack
Nuxt 3 (`ssr: false` → SPA) · Vue 3 · TS · **Tailwind CSS v4** (plugin `@tailwindcss/vite`, tanpa `tailwind.config.js` — konfigurasi di `assets/css/tailwind.css` lewat `@theme`, sama seperti prototype figmake) · Pinia · `@nuxtjs/supabase` · Capacitor (app, status-bar, splash-screen, keyboard, haptics, preferences, filesystem, share, browser).

## Struktur
```
components/{ui,layout,schedule,approval}/   composables/   layouts/   middleware/
pages/{login,index,admin,dosen,mahasiswa}/   stores/   types/   utils/
```
- `types/database.types.ts` — GENERATED oleh DB owner (`supabase gen types --project-id`), di-commit; anggota lain cukup `git pull`.
- `types/domain.ts` — enum & konstanta manual (peran, status, jenis).
- Guard peran: `definePageMeta({ role: 'admin' })` dibaca `middleware/role.ts`.
- **Gate onboarding**: `middleware/onboarding.global.ts` — bila `profile.role` ∈ {dosen, mahasiswa} dan `profile.onboarding_at` null, semua rute selain `/<role>/onboarding` & logout di-redirect ke sana. Dilepas setelah `rpc('selesai_onboarding')` sukses (lihat `docs/api-contract.md` AC-5).

## Perintah
```bash
npm install
cp .env.example .env             # lalu isi nilainya (lihat di bawah)
npm run dev                       # web :3000

npm run gen:types                 # hanya DB owner; anggota lain git pull database.types.ts
npm run build                     # → .output/public (web hosting & Capacitor)
npm run cap:sync                  # nuxi generate + cap sync
npm run cap:android / npm run cap:ios   # buka IDE native
```

## Env (`.env`, lihat `.env.example`)
```
NUXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co    # Settings → API → Project URL
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGci...                  # Settings → API → anon public key
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

> **`npm run dev` akan 500 kalau `.env` kosong** — module `@nuxtjs/supabase` butuh URL + key saat start.
> Kalau project Supabase tim belum dibuat dan mau kerja UI dulu, pilih salah satu:
> (a) buat project Supabase gratis sendiri (±3 menit), atau
> (b) comment sementara `"@nuxtjs/supabase"` di `nuxt.config.ts` (`modules` + blok `supabase:`).

## Catatan mobile
Deep link `sipenta://` · sesi Supabase → `@capacitor/preferences` (bukan localStorage) · ekspor file native pakai `Filesystem` + `Share` · back-button Android via `@capacitor/app`.
