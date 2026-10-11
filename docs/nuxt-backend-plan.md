# Backend Nuxt + Supabase

## Keputusan arsitektur

Nuxt 3 adalah aplikasi **full-stack** SIPENTA. Vue/Nuxt menangani antarmuka,
sedangkan Nitro (`app/server/`) menyediakan REST API dan logika bisnis.
Supabase dipakai sementara untuk PostgreSQL, Auth, Storage, dan Realtime.
AI service FastAPI hanya menghitung optimasi jadwal.

```
Web Nuxt / aplikasi Capacitor
              |
              v
Nuxt Nitro API (validasi, otorisasi, logika bisnis, integrasi)
              |
              v
Supabase PostgreSQL/Auth/Storage  <-->  FastAPI /solve
```

Frontend tidak boleh memakai `SUPABASE_SERVICE_ROLE_KEY` dan tidak boleh
memanggil FastAPI secara langsung. Untuk operasi bisnis, frontend memanggil
endpoint `/api/*` Nuxt.

## Batas tanggung jawab

| Lapisan | Tanggung jawab |
|---|---|
| `app/server/api/` | HTTP endpoint; membaca request dan mengirim response |
| `app/server/services/` | logika bisnis: generate, approval, finalisasi, impor, ekspor |
| `app/server/repositories/` | query Supabase/PostgreSQL; titik utama bila database nanti dipindahkan |
| Supabase | penyimpanan data, Auth/JWT, Storage, Realtime |
| `ai-service/` | Algoritma Genetika, `POST /solve` |

## Urutan pengerjaan MVP backend

1. **Fondasi server**: `/api/health`, environment server, dan deployment Nuxt memakai `nuxt build` (bukan static `nuxt generate`).
2. **Auth dan role guard**: ambil JWT Supabase dari request, lalu buat helper `requireUser()` dan `requireRole('admin')`.
3. **Repository**: `dosen`, `ruangan`, jadwal mengajar, blokir waktu, dan jadwal kuliah.
4. **API master data**: endpoint admin untuk CRUD data pada tahap sebelumnya.
5. **Penjadwalan**: API generate mengambil data dari repository, memanggil AI, dan menyimpan `schedule_run`, `schedule_slot`, serta approval.
6. **Approval/finalisasi**, lalu impor SPS, notifikasi, dan ekspor laporan.

## Catatan deployment

- Web Nuxt perlu host yang menjalankan Nitro, misalnya Vercel, Railway, Cloudflare Workers, atau VPS Node. `ssr: false` hanya berarti render UI di client; Nitro API tetap berjalan setelah `nuxt build`.
- APK Capacitor tidak menjalankan Nitro. Aplikasi mobile memanggil Nuxt API yang telah dideploy melalui `NUXT_PUBLIC_API_BASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY` dan `AI_SERVICE_KEY` hanya disetel pada host Nuxt; keduanya tidak boleh muncul pada file frontend atau repository Git.
