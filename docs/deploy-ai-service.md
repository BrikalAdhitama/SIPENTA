# Deploy `ai-service` — panduan langkah demi langkah

Untuk AI Engineer. Ditulis dengan asumsi **belum pernah pakai Render/Railway dan tidak jago Docker**. Kamu tidak akan menulis Dockerfile atau mengetik perintah `docker` satu pun.

TL;DR: deploy **baru perlu di Sprint S3**. Sebelum itu jalan di laptop. Deploy final = klik-klik di Render + isi 1 environment variable.

---

## 0. Kapan butuh deploy?

| Tahap | AI service jalan di mana |
|---|---|
| S0–S2 (bikin slots, fitness, engine) | **Laptop kamu** — `uv run uvicorn app.main:app --reload` |
| S3 (integrasi dengan BE), tapi belum sempat deploy | **Laptop + ngrok** (URL publik sementara, lihat §2) |
| S3 selesai & seterusnya | **Render** (permanen, lihat §3) |

Jangan buru-buru deploy. Fokus dulu ke algoritma.

---

## 1. Jalan di laptop (S0–S2)

```powershell
cd ai-service
uv sync
# buat file .env berisi 1 baris:  AI_SERVICE_KEY=dev-rahasia-bebas
uv run uvicorn app.main:app --reload --port 8000
```

Cek hidup: buka `http://localhost:8000/health` → harus muncul `{"status":"ok",...}`.
Test `/solve`: pakai `tests/` atau `curl` dengan header `X-AI-Key: dev-rahasia-bebas`.

---

## 2. Jembatan sementara buat BE test integrasi (S3, sebelum deploy)

BE perlu URL publik yang bisa dipanggil dari Supabase cloud. Kalau kamu belum deploy, pakai **ngrok** — bikin URL publik dari laptop kamu, 1 perintah, tanpa deploy.

```powershell
# sekali install
npm i -g ngrok        # atau: scoop install ngrok / choco install ngrok
ngrok config add-authtoken <token dari dashboard ngrok.com>  # daftar gratis

# setiap mau dipakai (biarkan uvicorn tetap jalan di terminal lain)
ngrok http 8000
```

ngrok kasih URL kayak `https://a1b2-xxx.ngrok-free.app`. Kasih ke BE:
- `AI_SERVICE_URL` = URL ngrok itu
- `AI_SERVICE_KEY` = isi `.env` kamu (`dev-rahasia-bebas`)

> URL ngrok **berubah tiap restart** (di plan gratis) dan mati kalau laptop kamu mati. Cuma buat test cepat, bukan permanen.

---

## 3. Deploy permanen ke Render

### 3.1 Siapkan

1. Pastikan repo SIPENTA sudah ada di GitHub dan `ai-service/` ter-commit (`Dockerfile`, `pyproject.toml`, `app/`).
2. Buat 1 secret buat header auth — jalankan salah satu:
   ```powershell
   # Git Bash / WSL:
   openssl rand -hex 32
   # PowerShell murni:
   -join ((48..57)+(97..102) | Get-Random -Count 48 | % {[char]$_})
   ```
   Simpan hasilnya, nanti dipakai 2 kali (di Render + di Supabase). Sebut saja `<AI_KEY>`.

### 3.2 Bikin service di Render

1. Buka **https://render.com** → **Get Started** → login pakai akun **GitHub**.
2. Dashboard → **New +** → **Web Service**.
3. **Connect a repository** → pilih repo SIPENTA (kalau nggak muncul, klik "Configure account" → kasih Render akses ke repo itu).
4. Isi form:
   | Field | Isi |
   |---|---|
   | **Name** | `sipenta-ai` |
   | **Region** | Singapore |
   | **Root Directory** | `ai-service` |
   | **Runtime** | `Docker` (biasanya auto-kedeteksi karena ada `Dockerfile`) |
   | **Instance Type** | `Free` |
5. Turun ke **Environment Variables** → **Add Environment Variable**:
   | Key | Value |
   |---|---|
   | `AI_SERVICE_KEY` | `<AI_KEY>` (dari langkah 3.1) |
6. Klik **Create Web Service**. Render mulai build (baca Dockerfile → install → jalan). Tunggu ±3–5 menit sampai status **Live**.
7. Di atas halaman ada URL: `https://sipenta-ai.onrender.com`. **Itu `AI_SERVICE_URL`.**
8. Cek: buka `https://sipenta-ai.onrender.com/health` → `{"status":"ok",...}`.

> **Tanpa Docker?** Di langkah 4 pilih **Runtime = `Python 3`**, lalu isi:
> - **Build Command**: `pip install uv && uv sync --frozen` (atau `pip install fastapi "uvicorn[standard]" pydantic`)
> - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
> Dockerfile diabaikan. Hasil sama.

### 3.3 Serahkan ke BE

Kasih BE 2 nilai (via chat grup / DM, jangan commit):
- `AI_SERVICE_URL` = `https://sipenta-ai.onrender.com`
- `AI_SERVICE_KEY` = `<AI_KEY>`

BE pasang di Supabase:
```bash
supabase secrets set AI_SERVICE_URL=https://sipenta-ai.onrender.com AI_SERVICE_KEY=<AI_KEY>
```

Selesai. Edge Function `generate-schedule` sekarang bisa memanggil `/solve`.

### 3.4 Update selanjutnya

Tiap kali kamu push commit ke branch `main` yang mengubah `ai-service/`, Render **auto-deploy ulang**. Nggak perlu ngapa-ngapain. Lihat progress di tab **Events** / **Logs** di dashboard Render.

---

## 4. Atasi cold start (biar generate nggak lemot)

Render Free "tidur" setelah **15 menit tanpa request**. Request pertama setelah tidur nunggu ~30–40 detik nyalain container. Solusi (pilih satu):

### 4.a Ping otomatis (gratis, recommended untuk masa dev)

1. Buka **https://cron-job.org** → daftar gratis.
2. **Create cronjob**:
   - **Title**: `keep sipenta-ai awake`
   - **URL**: `https://sipenta-ai.onrender.com/health`
   - **Schedule**: every 10 minutes (`*/10 * * * *`)
3. Save & enable.

Container di-ping tiap 10 menit → nggak pernah tidur → selalu responsif.

### 4.b Upgrade sementara buat demo (paling anti-ribet)

Beberapa hari sebelum demo: Render dashboard → service `sipenta-ai` → **Settings** → **Instance Type** → **Starter ($7/mo)** → Save. Always-on, nol cold start. Turunin lagi ke Free setelah demo (billing pro-rata).

### 4.c Pindah ke Google Cloud Run (cold start 2–5 dtk, free tier besar)

Lebih ribet (perlu setup billing GCP), tapi cold start jauh lebih cepat & scale-to-zero (bayar cuma saat dipakai). Pertimbangkan kalau Render Free terasa lambat dan nggak mau bayar. Perintah inti:
```bash
gcloud run deploy sipenta-ai --source ai-service/ --region asia-southeast2 \
  --allow-unauthenticated --set-env-vars AI_SERVICE_KEY=<AI_KEY>
```

---

## 5. Batas waktu di sisi kode (biar nggak pernah timeout)

Di `ai-service`, mesin GA dibatasi wall-clock (mis. `max_seconds=25`) dan berhenti dini begitu `V_hard=0` & stabil. Jadi kombinasinya:

```
host warm (§4)  +  GA di-cap 25 dtk  →  generate jadwal selalu < 10 dtk saat normal
Edge Function fetch timeout = 60 dtk  →  buffer aman
```

Kalau suatu gelombang benar-benar berat dan GA mentok 25 dtk, ia mengembalikan solusi terbaik-sejauh-ini + `unscheduled` — bukan error.

---

## 6. Troubleshooting

| Gejala | Penyebab & fix |
|---|---|
| Build gagal "no Dockerfile found" | **Root Directory** belum di-set `ai-service` |
| `/health` OK tapi `/solve` balas 401 | `AI_SERVICE_KEY` di Render ≠ yang di-set BE (`supabase secrets`). Samakan persis. |
| Edge Function error `UPSTREAM_ERROR ... tidak merespons` | Service lagi cold start (tunggu & retry) atau URL salah. Cek `/health` manual. |
| Request pertama tiap pagi lambat 30 dtk | Cold start — pasang ping §4.a |
| Deploy sukses tapi 502 di URL | App crash saat start. Buka tab **Logs** di Render, cari traceback Python. |
| Perubahan kode nggak ke-deploy | Render cuma auto-deploy dari branch yang di-set (default `main`). Cek Settings → Branch. |

---

## Ringkas

1. **S0–S2**: `uvicorn` di laptop. Nggak usah mikir deploy.
2. **S3 test cepat**: `ngrok http 8000`.
3. **S3 permanen**: Render → New Web Service → Root `ai-service` → env `AI_SERVICE_KEY` → Create. Dapat URL.
4. **Anti-lemot**: cron-job.org ping `/health` tiap 10 menit (gratis), atau Starter $7/bln pas demo.
5. **Serahkan** `AI_SERVICE_URL` + `AI_SERVICE_KEY` ke BE → `supabase secrets set`.
