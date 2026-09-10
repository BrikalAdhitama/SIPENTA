# Rencana Sprint — SIPENTA

7 sprint, target ±1–2 minggu per sprint (PM isi tanggal). Prinsip: **tiga area kerja paralel, ketemu hanya di titik integrasi yang sudah dijadwalkan**. Kontrak antar area = [`api-contract.md`](api-contract.md) (dibekukan di S0).

Legenda area: **FE** (2 org, `app/`) · **BE** (2 org, `supabase/`) · **AI** (2 org, `ai-service/`) · **PM**.

---

## Peta ketergantungan

```
S0 Fondasi & Kontrak ──┬── BE: skema + RLS + types  ─────────────► buka jalan FE & BE lain
                       ├── FE: UI kit + auth shell   (pakai seed DB)
                       └── AI: fixtures + /solve stub (independen — tak nunggu siapa pun)

S1 Master data + Onboarding   FE↔BE (CRUD lokal)          AI: slots.py + reduksi domain
S2 Wizard (upload→preview→config)  BE: parse-sps          AI: fitness.py + Context (lock interface)
S3 GA TERINTEGRASI  ◄── titik temu AI↔BE ──►  AI: engine + deploy /solve · BE: generate-schedule
S4 Approval & Finalisasi  ◄── titik temu FE↔BE realtime ──►  AI: benchmark
S5 Multiplatform + Ekspor + Tuning
S6 Stabilisasi + Dokumen Capstone
```

**Jalur kritis**: S0-BE (skema) → S3 (integrasi GA) → S4 (approval) → demo. AI berjalan paralel penuh dari S0; FE mock-first sampai Edge Function siap.

---

## S0 — Fondasi & Kontrak

Tujuan: setiap orang bisa `login` di lingkungan lokal, kontrak dibekukan, tiga kerangka jalan.

| Area | Tugas |
|---|---|
| **BE** | Buat **project Supabase cloud** (`sipenta-dev`) · `supabase link` · migrasi `0001_core_schema.sql` (dari repo) + `0002_rls_policies.sql` + `0003_rpc_approval.sql` (stub) → `supabase db push` · jalankan `seed.sql` sekali (3 user/role, 5 dosen, 4 ruangan, 1 gelombang) · generate `app/types/database.types.ts` (`gen types --project-id`) · tentukan **DB owner** (satu-satunya yang `db push`) · CI: lint + typecheck |
| **FE** | Scaffold Nuxt (`app/` sudah ada confignya) · pasang `@nuxtjs/supabase`, `@pinia/nuxt`, `@nuxtjs/tailwindcss` · `composables/useAuth` + `middleware/auth.global.ts` + `role.ts` + `onboarding.global.ts` · `layouts/` (default authed shell, auth) · `components/ui/`: Button, Badge, Card, Modal, Stepper, DataTable, EmptyState, FormField · halaman `login.vue` + `index.vue` (redirect per role) · shell: sidebar desktop / bottom-nav mobile |
| **AI** | Scaffold FastAPI (`ai-service/` sudah ada) · `app/models/`: `SolveRequest`/`SolveResponse` **lengkap persis** [`api-contract.md`](api-contract.md) §E (termasuk `blackout_windows`, `seminars[].is_online`) · `/health` + `/solve` (return placeholder) · `scripts/build_fixture.py`: baca 3 Excel → anonimkan → `tests/fixtures/genap_2526_{sempro,semhas}_<bulan>.json`, **pecah per bulan pendaftaran jadi batch ≤ 15** · `Dockerfile` build & run |
| **PM** | Bekukan `api-contract.md` v1 (tandai "FROZEN — perubahan lewat mini-RFC") · board (kolom: Backlog / Sprint / Review / Done) · isi tanggal semua sprint · buat template PR (checklist: area, contract-impact, test) |

**Handoff akhir sprint**
- BE → project Supabase cloud ter-migrate + ter-seed, `database.types.ts` ter-commit (dokumen "cara start" di `supabase/README.md`).
- AI → fixtures ter-commit.
- FE → UI kit + alur login jalan.

**Checkpoint**: semua anggota bisa `pnpm dev` (sambung ke Supabase cloud) / `uvicorn` dan login sebagai admin/dosen/mahasiswa dengan user seed. `POST /solve` mengembalikan placeholder dari salah satu fixture.

---

## S1 — Data Master & Onboarding

Tujuan: semua data mentah non-seminar bisa diisi; gate onboarding aktif.

| Area | Tugas | Blocked by |
|---|---|---|
| **BE** | RLS final: `dosen`, `ruangan`, `jadwal_mengajar` (write: admin **atau** dosen pemilik), `blokir_waktu`, `jadwal_kuliah` (write: pemilik) · RPC `selesai_onboarding(p_tidak_ada)` · helper `auth.onboarded()` · perluas `seed.sql` (jadwal mengajar + kuliah contoh) | S0-BE |
| **FE** | Admin: layar **Data Dosen**, **Ruangan**, **Jadwal Dosen** (CRUD, pakai DataTable) · Dosen: **Onboarding — Isi Jadwal Mengajar** (+ checkbox "tidak mengajar") + **Blokir Waktu** · Mahasiswa: **Onboarding — Isi Jadwal Kuliah** (+ checkbox "tidak ada kuliah") + **Jadwal Kuliah** · aktifkan `onboarding.global.ts` (redirect paksa sampai `onboarding_at` terisi) | S0 semua |
| **AI** | `app/ga/slots.py`: `build_candidate_slots(req)` — iterasi tanggal × hari_aktif × ruangan (termasuk online) × grid `(durasi + jeda)`, **buang irisan `blackout_windows`** (hormati field `hari`, Jumat beda) · `reduce_domains(req, slots)` — `domain[i]` = slot lolos H3/H4/H5; domain kosong → `unscheduled` + alasan · util `time_overlap()`, `tanggal_ke_hari()` · unit test slots + reduksi · **laporan: ukuran `domain[i]` per fixture** (bukti reduksi bekerja) | S0-AI (fixtures) |

**Handoff**: FE↔BE — master data & onboarding end-to-end di lokal. AI — dokumen ukuran domain (masuk bab laporan).

**Checkpoint**: dosen baru login → dipaksa isi jadwal mengajar → tekan Selesai → menu terbuka. Idem mahasiswa. Admin bisa CRUD semua master data.

---

## S2 — Wizard Penjadwalan (Upload → Preview → Konfigurasi)

Tujuan: admin bisa menyiapkan gelombang sampai `status = 'siap_generate'`.

| Area | Tugas | Blocked by |
|---|---|---|
| **BE** | Edge Function **`parse-sps`**: baca Excel dari Storage → buat baris `mahasiswa` + `seminar` (pembimbing dari sheet, `urutan_daftar` dari sheet), fuzzy-match nama dosen → `dosen_id`, **bagi kuota** (≤ `kuota_maks` → `dijadwalkan=true`, sisanya `false` + catatan) · bucket Storage `sps` + `templates` (unggah template Excel resmi) · trigger validasi penguji (`penguji ≠ pembimbing`, `penguji1 ≠ penguji2`, semua `aktif`) | S0-BE |
| **FE** | Wizard `app/pages/admin/seminar/`: **Step 1** pilih jenis + upload (web `<input file>`, mobile file-picker) · **Step 2** Preview & Validasi (tabel seminar, dropdown Penguji 1 & 2, toggle `is_online`, tinjau kolom kuota `dijadwalkan/ditunda`, badge valid/invalid/duplikat) · **Step 3** Konfigurasi (tanggal, hari aktif, jam operasional, jeda, ruangan aktif, `durasi_menit` opsional) → simpan `gelombang`, set `status='siap_generate'` · komponen `Stepper` | S0-FE, S2-BE (parse-sps) |
| **AI** | `app/ga/fitness.py`: **H1** (bentrok ruangan, skip `is_online`), **H2** (bentrok dosen 4 peran), **S0–S5** · **kunci interface**: `Context` dataclass (request ter-parse & ter-index) + `evaluate(chromosome, ctx) -> FitnessBreakdown(v_hard, soft_score, detail)` — **koordinasi 2 AI, ini kontrak internal** · unit test **per constraint** (kromosom sengaja langgar tiap H/S → terdeteksi; kasus bersih → 0) | S1-AI (slots) |

**Handoff**: AI internal — `evaluate()` + `Context` dibekukan (AI-1 pakai di engine, AI-2 lanjut tuning). BE↔FE — wizard sampai `siap_generate`.

**Checkpoint**: admin upload sheet 20 pendaftar → lihat 15 `dijadwalkan` + 5 `ditunda` → pilih penguji → set periode → gelombang `siap_generate`.

---

## S3 — GA Terintegrasi  ⚡ titik temu AI ↔ BE

Tujuan: tombol Generate menghasilkan jadwal nyata dari database.

| Area | Tugas | Blocked by |
|---|---|---|
| **AI** | `app/ga/{chromosome,operators,engine}.py`: init gene dari `domain[i]` · tournament(k=3) · uniform crossover(0.8) · reassignment mutation(0.1) · elitism(2) · loop + terminasi (V_hard=0 & stabil / plateau / max gen) · `random_seed` · decode kromosom terbaik → `schedule[]` + `stats` + `unscheduled` · `/solve` **beneran jalan** di fixtures · **deploy container** (Railway/Render/Fly) → kirim BE `AI_SERVICE_URL` + `AI_SERVICE_KEY` | S2-AI (fitness) |
| **BE** | Lengkapi Edge Function **`generate-schedule`**: verifikasi admin + `status='siap_generate'` · **cek onboarding** semua dosen/mahasiswa terkait (tolak + daftar nama bila ada yang null) · baca `seminar` (`valid` & `dijadwalkan`), `jadwal_mengajar`, `blokir_waktu`, `jadwal_kuliah`, `ruangan` aktif · **ekspansi "hari + Sesi N" → jam** (`app_config.jadwal_kampus.sesi`, kolom Jumat) + susun `blackout_windows` · `POST {AI_URL}/solve` (`X-AI-Key`, timeout 60s) · tulis transaksional `schedule_run` + `schedule_slot` + `approval` (4 per slot, `pending`) · set `gelombang.status='dijadwalkan'` · panggil `notify` NT-1 | S2-BE, S3-AI (URL) |
| **FE** | Wizard **Step 4 — Generate**: layar konfirmasi → panggil Edge Fn → progres tahap (Preparing → Population → Fitness → Selection → Crossover → Mutation → Complete) · layar **Hasil** (`app/pages/admin/jadwal/[runId]`): tabel slot + tampilan **Kalender** (grid tanggal × ruangan × jam), kartu skor (fitness, conflict, waktu), daftar `unscheduled` · tombol **Simpan** (`status='tersimpan'`) · layar **Riwayat** | S2-FE |

**Handoff**: AI → `/solve` live URL + key ke BE. BE → `generate-schedule` live. FE → hasil tampil.

**Checkpoint**: admin klik Generate pada gelombang seed → jadwal nyata muncul di tabel & kalender, `conflict_count = 0`, `unscheduled` tampil bila ada · run tersimpan di Riwayat.

---

## S4 — Approval & Finalisasi  ⚡ titik temu FE ↔ BE (realtime)

Tujuan: 4 dosen approve tiap slot → admin finalisasi → mahasiswa lihat jadwal final.

| Area | Tugas | Blocked by |
|---|---|---|
| **BE** | RPC **`submit_approval`** (dosen approve/tolak/reset + alasan wajib saat tolak) · **`finalisasi_jadwal`** (gate: SEMUA slot 4/4 `approved`; else `CONFLICT_STATE` + `slot_bermasalah`; sukses → `status='final'`, `finalized_at/by`, run lain di gelombang → `dibatalkan`) · **`batalkan_jadwal`** (+ alasan) · Edge Function **`notify`** (tulis `notification` **dan** kirim email Resend, setiap event) · trigger NT-2 saat tolak, NT-3 saat finalisasi/batal · aktifkan Realtime `approval`, `schedule_run`, `notification` | S3-BE |
| **FE** | Dosen: **Approve Jadwal** (grid kartu slot miliknya, badge peran, 4 dot progres, tombol Setujui / Tolak + modal alasan + reset) · Admin: **Status Approval** (akordeon per dosen, subscribe Realtime channel `run-<id>`, progress bar keseluruhan) · di layar Jadwal: tombol **Finalisasi** (aktif hanya bila semua slot 4/4) + **Batalkan** · Mahasiswa: **Jadwal Seminar** (kartu detail + slot + progres `n/4` + status per dosen) · komponen bell **Notifikasi** (list + tandai baca, Realtime) | S3-FE, S4-BE |
| **AI** | **Benchmark** vs jadwal manual: jalankan GA per gelombang bulanan (fixture ≤15), kumpulkan metrik — `conflict_count` (H1+H2) harus 0, S0 vs baseline manual (14 sempro / 18 semhas per periode), S1 vs baseline, waktu eksekusi · grafik konvergensi awal (fitness per generasi) · `notebooks/benchmark.ipynb` | S3-AI |

**Handoff**: FE↔BE — alur approve → finalisasi end-to-end. AI → laporan benchmark v1.

**Checkpoint**: seed 1 run → 4 dosen approve semua slot (lihat progres realtime di layar admin) → admin Finalisasi → status `final` → mahasiswa & dosen lihat jadwal final → notifikasi masuk in-app **dan** email.

---

## S5 — Multiplatform, Ekspor & Tuning

Tujuan: aplikasi native jalan di device, ekspor jalan, GA di-tuning.

| Area | Tugas | Blocked by |
|---|---|---|
| **FE** | `nuxt generate` + `cap sync` · build **Android** (Studio) + **iOS** (Xcode/CI macOS) · plugin: StatusBar, SplashScreen, Keyboard, Haptics (approve/tolak), Preferences (persist sesi Supabase), Filesystem + Share (simpan file ekspor), Browser (buka signed URL) · deep link `sipenta://` (reset password) · back-button Android · polish mobile: safe-area inset, bottom-nav, transisi, empty/loading state, mode baca-saja saat offline | S4-FE |
| **BE** | Edge Function **`export-schedule`** (`run_id`, `format: xlsx\|pdf`, `view: tabel\|kalender`) → render → simpan `exports` bucket → signed URL 1 jam · Edge Function laporan (agregat `schedule_run` untuk RP-1) | S4-BE |
| **AI** | Eksperimen tuning: `soft_weights` (urutan/rasio), `population_size`, `generations`, `crossover/mutation rate` · grafik konvergensi final · uji ketahanan: gelombang padat tetap `V_hard=0`, domain kosong → `unscheduled` (bukan crash), konsistensi antar-run dengan `random_seed` tetap · rekomendasi parameter final → update `app_config.ga_defaults` (via BE) | S4-AI |

**Checkpoint**: APK + IPA terpasang di device fisik, alur penuh jalan · ekspor Excel/PDF terunduh di web dan tersimpan/terbagi di mobile · parameter GA final tercatat.

---

## S6 — Stabilisasi & Dokumen Capstone

| Area | Tugas |
|---|---|
| **Semua** | Bug bash · E2E happy path otomatis/manual: seed → onboarding → upload sheet → generate → approve 4/4 → finalisasi → lihat jadwal · rapikan `README.md` tiap area · hapus `console.log` / `TODO` yang tertinggal |
| **AI** | Bab metodologi (representasi kromosom, fitness, operator, alasan hard vs soft) + bab hasil (tabel benchmark, grafik konvergensi, hasil tuning) untuk laporan capstone · diagram pipeline 5 fase + loop GA |
| **BE** | Dump skema final (ERD ter-render) · daftar Edge Function + RPC + kebijakan RLS · catatan deploy Supabase |
| **FE** | Rangkaian screenshot alur (web + mobile) · catatan build & submit store · daftar plugin Capacitor |
| **PM** | Kompilasi laporan · slide + skrip demo · retrospektif |

**Checkpoint**: demo end-to-end mulus di depan penguji · draft laporan lengkap.

---

## Aturan anti-tabrakan

1. **Skema DB milik BE.** FE & AI tidak pernah menulis file di `supabase/migrations/` **atau ubah tabel di dashboard**. Butuh kolom baru? minta BE → BE tulis migrasi + PR → **DB owner** `supabase db push` + regenerate & commit `database.types.ts` → umumkan → FE & AI `git pull`.
2. **`api-contract.md` dibekukan setelah S0.** Perubahan bentuk request/response Edge Function atau `/solve` = **mini-RFC**: 1 paragraf di PR ("apa berubah, kenapa, area terdampak"), tag area terkait, tunggu 👍 sebelum merge.
3. **Batas folder = batas orang.** `app/` → FE, `supabase/` → BE, `ai-service/` → AI. Tidak ada import lintas folder. PR yang menyentuh > 1 folder harus di-review orang dari tiap folder.
4. **Mock-first.** FE tidak menunggu Edge Function: pakai tabel di Supabase cloud ter-seed + stub response untuk Edge Fn yang belum di-deploy. AI tidak menunggu BE: pakai JSON fixtures. Integrasi nyata hanya di S3 (AI↔BE) & S4 (FE↔BE).
5. **`ai-service` tanpa akses DB.** Semua data masuk lewat payload `/solve`. AI tidak pernah tahu Supabase URL/key.
6. **Branch**: `feat/<area>-<ringkas>` dari `main` (protected). Contoh: `feat/fe-wizard-step-2`, `feat/be-parse-sps`, `feat/ai-fitness-h1`. Squash-merge.
7. **Dokumen punya owner**: `prd.md` + `api-contract.md` + `STRUCTURE.md` + `database-erd.md` → PM/BE · `ga-design.md` + `prd-ai-scheduling.md` → AI · `sprint-plan.md` → PM. Perubahan dokumen orang lain = PR + tag owner.

## Ritual

- **Standup async harian** (channel): kemarin / hari ini / blocker.
- **Sync mingguan** (akhir sprint): demo per area + tentukan handoff sprint berikutnya + PM update board.
- **Review PR**: minimal 1 approve dari area yang sama; PR lintas-area butuh approve tiap area.
- **Definition of Done** (semua task): kode + test lolos CI + dokumen relevan diperbarui + demoable di lokal.
