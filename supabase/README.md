# supabase/ — Backend

Owner: 2 BE. Ini adalah keseluruhan "backend" SIPENTA: skema Postgres, Row Level Security, Edge Functions, dan seed.

## Isi

| Path | Isi |
|---|---|
| `config.toml` | konfigurasi project Supabase CLI |
| `migrations/*.sql` | **sumber kebenaran skema** — berurutan, tidak pernah diedit setelah merge |
| `functions/<name>/index.ts` | Edge Function (Deno). `_shared/` = util bersama |
| `seed.sql` | data dummy untuk `supabase db reset` |
| `tests/` | pgTAP / `deno test` |

## Migrasi

```
0001_core_schema.sql    enum, tabel, index, helper auth.role()/dosen_id()/mahasiswa_id()
0002_rls_policies.sql    RLS per tabel per role (lihat api-contract.md §B untuk ringkasannya)
0003_rpc_approval.sql    submit_approval(), finalisasi_jadwal(), batalkan_jadwal()
0004_triggers_notif.sql  trigger → tulis notification + panggil Edge Fn notify
```

Tambah perubahan: `supabase migration new <nama>` → tulis SQL → `supabase db reset` untuk uji lokal.

## Edge Functions

| Fungsi | Dipanggil oleh | Ringkas |
|---|---|---|
| `parse-sps` | client (admin) | baca Excel pendaftaran dari Storage → buat `mahasiswa` + `seminar` (data mhs & pembimbing sudah lengkap dari sheet; penguji diisi admin nanti) |
| `generate-schedule` | client (admin) | rakit payload → `POST {AI_URL}/solve` → tulis run+slot+approval |
| `export-schedule` | client (admin) | render xlsx/pdf → signed URL |
| `notify` | internal (trigger/RPC) | tulis `notification` **dan** kirim email (keduanya, bukan salah satu) |

Deploy: `supabase functions deploy <name>`.

## Env (`.env` — jangan commit)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # hanya untuk Edge Fn
AI_SERVICE_URL=              # URL ai-service
AI_SERVICE_KEY=              # shared secret, dikirim sbg header X-AI-Key
RESEND_API_KEY=              # WAJIB — notifikasi email (in-app + email keduanya aktif)
EMAIL_FROM=noreply@kampus.ac.id
```

## Jalankan lokal

```bash
supabase start          # Postgres + Auth + Storage + Studio via Docker
supabase db reset       # jalankan semua migrasi + seed.sql
supabase functions serve generate-schedule --env-file .env
```
