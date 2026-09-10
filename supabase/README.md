# supabase/ — Backend

Owner: 2 BE. Ini adalah keseluruhan "backend" SIPENTA: skema Postgres, Row Level Security, Edge Functions, dan seed.

## Mode: Cloud-only (tanpa Docker)

Tim memakai **satu project Supabase di supabase.com** yang di-share semua orang — bukan stack lokal. Konsekuensi: butuh internet, database dipakai bersama (disiplin migrasi wajib), tanpa `supabase start`.

- Supabase CLI tetap dipakai, tapi hanya command yang **tidak butuh Docker**: `link`, `db push`, `db pull`, `gen types`, `migration new`, `functions deploy`.
- **Jangan** ubah tabel lewat Table Editor / SQL Editor di dashboard — perubahan itu tidak masuk git. Selalu lewat file migrasi + PR.
- **Satu orang BE = "DB owner"** yang menjalankan `supabase db push` setelah PR di-merge. Yang lain tidak push sendiri (cegah migrasi bentrok).
- Kalau memungkinkan: 2 project — `sipenta-dev` (bebas coba-coba) + `sipenta-demo` (bersih, untuk presentasi).

## Isi

| Path | Isi |
|---|---|
| `config.toml` | konfigurasi Supabase CLI (dipakai `link` & referensi setting; bukan untuk `start`) |
| `migrations/*.sql` | **sumber kebenaran skema** — berurutan, tidak pernah diedit setelah merge |
| `functions/<name>/index.ts` | Edge Function (Deno). `_shared/` = util bersama |
| `seed.sql` | data awal — dijalankan manual ke DB cloud (lihat bawah) |
| `tests/` | pgTAP / `deno test` |

## Migrasi

```
0001_core_schema.sql    enum, tabel, index, helper auth.role()/dosen_id()/mahasiswa_id()/onboarded(), RPC selesai_onboarding()
0002_rls_policies.sql    RLS per tabel per role (lihat api-contract.md §B untuk ringkasannya)
0003_rpc_approval.sql    submit_approval(), finalisasi_jadwal(), batalkan_jadwal()
0004_triggers_notif.sql  trigger → tulis notification + panggil Edge Fn notify
```

Alur perubahan skema:
```bash
supabase migration new <nama>     # buat file kosong bernomor di migrations/
# tulis SQL-nya, commit, buka PR
# --- setelah PR di-merge, DB owner: ---
supabase db push                  # terapkan migrasi baru ke DB cloud (no Docker)
supabase gen types typescript --project-id <ref> > ../app/types/database.types.ts
# commit database.types.ts, umumkan ke channel → FE pull
```

Snapshot skema cloud yang sudah ada ke file migrasi: `supabase db pull`.
Review perubahan sebelum push: `supabase db diff --linked` *(butuh Docker — opsional; kalau tak ada Docker, review manual file migrasi di PR)*.

## Seed data

`seed.sql` dijalankan manual ke DB cloud (bukan auto seperti `db reset`):
```bash
supabase db push                          # pastikan skema terbaru
psql "$DATABASE_URL" -f seed.sql          # DATABASE_URL dari Settings → Database → Connection string
# atau tempel isi seed.sql ke SQL Editor di dashboard (sekali, di awal)
```

## Edge Functions

| Fungsi | Dipanggil oleh | Ringkas |
|---|---|---|
| `parse-sps` | client (admin) | baca Excel pendaftaran dari Storage → buat `mahasiswa` + `seminar` + bagi kuota 15 |
| `generate-schedule` | client (admin) | rakit payload → `POST {AI_URL}/solve` → tulis run+slot+approval |
| `export-schedule` | client (admin) | render xlsx/pdf → signed URL |
| `notify` | internal (trigger/RPC) | tulis `notification` **dan** kirim email (keduanya) |

```bash
supabase functions deploy generate-schedule      # bundle + upload ke cloud (no Docker)
supabase functions deploy --no-verify-jwt notify # fungsi internal
# set secret Edge Function (bukan di .env yang di-commit):
supabase secrets set AI_SERVICE_URL=... AI_SERVICE_KEY=... RESEND_API_KEY=... EMAIL_FROM=...
```

Test: hit URL cloud langsung — `https://<ref>.functions.supabase.co/generate-schedule` (curl/Postman/dari app). Tidak ada `functions serve` lokal karena butuh Docker.

## Env

Secret Edge Function di-set lewat `supabase secrets set` (bukan file). Untuk skrip lokal (gen types, psql):

```
SUPABASE_PROJECT_REF=xxxxxxxxxxxx
DATABASE_URL=postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres
```

`SUPABASE_URL` + `SUPABASE_ANON_KEY` (untuk client) ada di Settings → API pada dashboard.

## Setup pertama kali (DB owner)

```bash
npm i -g supabase          # atau brew / scoop — CLI saja, tanpa Docker Desktop
supabase login
supabase link --project-ref <ref>
supabase db push           # terapkan semua migrasi ke project cloud
# jalankan seed.sql sekali (lihat bagian Seed data)
```
