# Architecture Decision Records (ADR)

Satu file per keputusan arsitektur penting. Format singkat:

```
# ADR-000N: Judul keputusan

- **Tanggal**: YYYY-MM-DD
- **Status**: diterima | diganti oleh ADR-XXXX
- **Konteks**: kenapa keputusan ini perlu diambil
- **Keputusan**: apa yang diputuskan
- **Konsekuensi**: dampak positif & negatif, hal yang jadi lebih sulit
```

## Keputusan yang sudah diambil (ringkas — bikin file penuh bila perlu detail)

| # | Keputusan | Alasan singkat |
|---|---|---|
| 1 | **Satu codebase Nuxt** untuk web + mobile (Capacitor), bukan 2 project FE | Tim kecil, Capacitor cuma bungkus build web yang sama |
| 2 | **Supabase cloud-only, tanpa Docker** untuk BE | Laptop terbatas; cukup untuk capstone; migrasi tetap versioned via `db push` |
| 3 | **`ai-service` microservice terpisah** (Python/FastAPI), dipanggil hanya oleh Edge Function | Bahasa beda, deploy beda, kontrak jelas via `/solve` |
| 4 | **Hard constraint = bentrok waktu saja** (H1–H5); "1 dosen 1 topik/hari" jadi soft (S0) | Konsistensi definisi + hindari GA gagal total pada gelombang padat — lihat `ga-design.md` |
| 5 | **Jadwal "final" butuh 4/4 ACC** tiap slot; fungsi kaprodi = akun admin | Sesuai keputusan tim 2026-09-10 |
| 6 | **Tailwind v4** via `@tailwindcss/vite` (tanpa `tailwind.config.js`) | Sama dengan prototype figmake, lebih simpel |
| 7 | **npm** sebagai package manager `app/` | Preferensi tim |
