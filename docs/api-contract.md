# API Contract — SIPENTA

Kontrak antar-area. Setiap use case dari [`prd.md`](prd.md) §7 dipetakan ke salah satu dari lima mekanisme:

| Mekanisme | Kapan dipakai | Contoh |
|---|---|---|
| **Auth SDK** | login, sesi, reset password | `supabase.auth.*` |
| **Table (PostgREST/SDK)** | CRUD sederhana, dijaga RLS | `supabase.from('dosen').select()` |
| **RPC** (fungsi Postgres) | tulis multi-baris transaksional + aturan bisnis, tanpa secret | `supabase.rpc('submit_approval', …)` |
| **Edge Function** | butuh secret, file, atau panggil layanan luar | `POST /functions/v1/generate-schedule` |
| **AI service** | dipanggil **hanya** oleh Edge Function `generate-schedule` | `POST {AI_URL}/solve` |

## Konvensi

- **Base URL Supabase**: `https://<project>.supabase.co`
  - REST tabel: `/rest/v1/<table>` · RPC: `/rest/v1/rpc/<fn>` · Edge Fn: `/functions/v1/<fn>`
- **Header wajib** (client): `apikey: <SUPABASE_ANON_KEY>`, `Authorization: Bearer <access_token>`
- **Format waktu**: tanggal `YYYY-MM-DD`, jam `HH:MM` (24 jam), timestamp ISO-8601 UTC.
- **Format error** (Edge Fn & RPC) — selalu bentuk ini:
  ```json
  { "error": { "code": "STRING_KODE", "message": "pesan manusiawi", "details": {} } }
  ```
  Kode umum: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`, `CONFLICT_STATE`, `UPSTREAM_ERROR`, `INTERNAL`.
- **Enum**
  - `role`: `admin` · `dosen` · `mahasiswa` — hanya 3. Fungsi "kaprodi" (finalisasi jadwal) dijalankan akun `admin`.
  - `jenis_seminar`: `sempro` · `semhas`
  - `peran`: `pembimbing_utama` · `pembimbing_pendamping` · `penguji_1` · `penguji_2`
  - `validasi_seminar`: `valid` · `invalid` · `duplikat`
  - `status_gelombang`: `draft` · `siap_generate` · `dijadwalkan`
  - `status_run`: `draft` · `tersimpan` · `final` · `dibatalkan` — `final` hanya setelah SEMUA slot di-ACC 4/4 dosen
  - `status_approval`: `pending` · `approved` · `declined`

---

## A. Autentikasi (Auth SDK)

### AC-1 Login
```ts
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
// data.session.access_token dipakai untuk semua request berikutnya
```

### AC-2 Ambil sesi + profil
```ts
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase
  .from('profiles').select('id, role, nama, dosen_id, mahasiswa_id, onboarding_at').eq('id', user.id).single()
```
Response `profile`:
```json
{ "id": "uuid", "role": "dosen", "nama": "Dr. Sari Dewi", "dosen_id": 12, "mahasiswa_id": null,
  "onboarding_at": null }
```

### AC-3 Logout · AC-4 Reset password
```ts
await supabase.auth.signOut()
await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${appUrl}/reset` })
```

### AC-5 Gate onboarding
`profiles.onboarding_at` (null = belum). Setelah AC-2, client cek:
- `role === 'dosen'` & `onboarding_at === null` → paksa ke `/dosen/onboarding` (isi/konfirmasi jadwal mengajar). Semua rute lain diblok (middleware) sampai selesai.
- `role === 'mahasiswa'` & `onboarding_at === null` → paksa ke `/mahasiswa/onboarding` (isi jadwal kuliah).
- `role === 'admin'` → tanpa gate.

User mengisi baris `jadwal_mengajar` / `jadwal_kuliah` (Table, RLS pemilik), lalu:
```ts
// tombol "Selesai" — RPC memvalidasi minimal 1 baris, lalu set onboarding_at
await supabase.rpc('selesai_onboarding', { p_tidak_ada: false })
// p_tidak_ada: true bila user menyatakan "tidak mengajar / tidak ada kuliah semester ini"
```
Response: `"2026-09-11T02:00:00Z"` (nilai `onboarding_at`). Error `check_violation` bila `p_tidak_ada=false` tapi belum ada baris.

---

## B. Tabel langsung (PostgREST / SDK) — dijaga RLS

Ringkasan kebijakan RLS (detail SQL di `supabase/migrations/0002_rls_policies.sql`):

| Tabel | SELECT | INSERT / UPDATE / DELETE |
|---|---|---|
| `dosen`, `ruangan` | semua role terautentikasi | `admin` |
| `jadwal_mengajar` | semua role terautentikasi | `admin` **atau** pemilik (`dosen_id = auth.dosen_id()`) |
| `blokir_waktu` | `admin`, pemilik (`dosen_id = auth.dosen_id()`) | pemilik & `admin` |
| `jadwal_kuliah` | `admin`, pemilik (`mahasiswa_id = auth.mahasiswa_id()`) | pemilik & `admin` |
| `gelombang`, `seminar` | `admin` | `admin` |
| `schedule_run` | `admin`; `dosen`/`mahasiswa` hanya run `final` | `admin` (via RPC/Edge) |
| `schedule_slot` | `admin`; `dosen` bila jadi salah satu peran; `mahasiswa` bila seminarnya | tidak langsung (via Edge Fn) |
| `approval` | `admin`; `dosen` baris miliknya; `mahasiswa` untuk seminarnya | tidak langsung (via RPC `submit_approval`) |
| `notification` | pemilik (`user_id = auth.uid()`) | update `dibaca` oleh pemilik |

### MD-1 Dosen — CRUD
```ts
// list
supabase.from('dosen').select('*').order('nama')
// create
supabase.from('dosen').insert({ nip, nama, gelar, email, bidang, status: 'aktif' })
// update / nonaktif
supabase.from('dosen').update({ status: 'nonaktif' }).eq('id', id)
```
Bentuk baris:
```json
{ "id": 12, "nip": "197503012005011001", "nama": "Sari Dewi", "gelar": "M.Kom",
  "email": "sari.dewi@kampus.ac.id", "bidang": "Rekayasa Perangkat Lunak", "status": "aktif" }
```

### MD-2 Jadwal mengajar — CRUD
```ts
supabase.from('jadwal_mengajar').select('*, dosen(nama)').eq('semester', 'gasal-2627')
supabase.from('jadwal_mengajar').insert({
  dosen_id: 12, matkul: 'Pemrograman Web', kelas: 'TI-4A',
  hari: 'senin', jam_mulai: '07:30', jam_selesai: '10:00', ruangan_kode: 'F-102', semester: 'gasal-2627'
})
```

### MD-3 Ruangan — CRUD
```json
{ "id": 4, "kode": "B-207", "nama": "Ruang B-207", "kapasitas": 30, "lantai": 2,
  "is_online": false, "status": "aktif" }
```
`is_online: true` untuk venue daring — GA melewati constraint bentrok ruangan (H1) untuk slot ini.

### DS-2 Blokir waktu — CRUD (pemilik)
```ts
supabase.from('blokir_waktu').insert({
  dosen_id: myDosenId, hari: 'jumat', jam_mulai: '11:30', jam_selesai: '13:00', keterangan: 'Rapat jurusan'
})
```
> Boleh berbasis `hari` (berulang mingguan) **atau** `tanggal` (sekali). Isi salah satu.

### MS-1 Jadwal kuliah mahasiswa — CRUD (pemilik)
```ts
supabase.from('jadwal_kuliah').insert({
  mahasiswa_id: myMhsId, matkul: 'Kecerdasan Buatan', kelas: 'TI-4A',
  hari: 'senin', jam_mulai: '08:00', jam_selesai: '09:40', ruangan_kode: 'R202', dosen_nama: 'Dr. Ahmad Fauzi'
})
```

### DS-1 / DS-3 / MS-2 — baca
```ts
// DS-1 jadwal mengajar sendiri
supabase.from('jadwal_mengajar').select('*').eq('dosen_id', myDosenId)
// DS-3 seminar tempat saya jadi pembimbing/penguji
supabase.from('seminar').select('*, gelombang(nama, jenis)')
  .or(`pembimbing_utama_id.eq.${d},pembimbing_pendamping_id.eq.${d},penguji1_id.eq.${d},penguji2_id.eq.${d}`)
// MS-2 seminar saya + slot + approval
supabase.from('seminar')
  .select('*, schedule_slot(*, approval(*, dosen(nama)))')
  .eq('mahasiswa_id', myMhsId).single()
```

### SC-9 Riwayat run · SC-6 slot hasil
```ts
supabase.from('schedule_run').select('*').eq('gelombang_id', g).order('created_at', { ascending: false })
supabase.from('schedule_slot').select('*, seminar(nama, judul), approval(*)').eq('run_id', runId)
```

### AP-1 Slot yang butuh persetujuan saya (Dosen)
```ts
supabase.from('approval')
  .select('*, schedule_slot(*, seminar(nama, judul), run:schedule_run(nama, status))')
  .eq('dosen_id', myDosenId)
  .eq('schedule_slot.run.status', 'tersimpan')
```

### AP-5 Monitor approval (Admin) + Realtime
```ts
// snapshot
supabase.from('approval').select('*, dosen(nama), schedule_slot(*, seminar(nama))')
  .eq('schedule_slot.run_id', runId)
// realtime
supabase.channel(`run-${runId}`)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'approval',
       filter: `run_id=eq.${runId}` }, handleChange)
  .subscribe()
```

### NT-4 Notifikasi
```ts
supabase.from('notification').select('*').eq('user_id', uid).order('created_at', { ascending: false })
supabase.from('notification').update({ dibaca: true }).eq('id', id)
```

---

## C. RPC (fungsi Postgres) — `supabase.rpc(name, args)`

Semua RPC: `SECURITY DEFINER`, cek role & kepemilikan di dalam fungsi, jalan dalam satu transaksi.

### AP-2 / AP-3 / AP-4 `submit_approval`
```ts
supabase.rpc('submit_approval', {
  p_approval_id: 88,
  p_decision: 'declined',            // 'approved' | 'declined' | 'pending'
  p_reason: 'Saya ada agenda lain di jam tersebut'   // wajib bila 'declined'
})
```
Response:
```json
{ "approval_id": 88, "status": "declined", "slot_id": 12,
  "slot_progress": { "approved": 2, "declined": 1, "pending": 1 } }
```
Aturan: pemanggil harus `dosen` pemilik baris `approval`. `p_reason` wajib & non-kosong bila `declined`. Menolak → trigger `NT-2` (notifikasi admin). Tidak bisa diubah bila `schedule_run.status` sudah `final` → `CONFLICT_STATE`.

### AP-6 `finalisasi_jadwal`
```ts
supabase.rpc('finalisasi_jadwal', { p_run_id: 5 })
```
Response:
```json
{ "run_id": 5, "status": "final", "ringkasan": { "slot": 26, "approved": 104 } }
```
Aturan: pemanggil `admin`. `schedule_run.status` harus `tersimpan`. **Semua slot wajib sudah di-ACC 4 dari 4 dosen** (2 pembimbing + 2 penguji) — kalau masih ada approval `pending` atau `declined` di slot manapun → `CONFLICT_STATE` dengan `details.slot_bermasalah`. Bila lolos: set `status = 'final'`, isi `finalized_at`/`finalized_by`, run lain di gelombang yang sama jadi `dibatalkan`, kirim `NT-3` ke semua dosen + mahasiswa terkait. Jadwal `final` inilah yang terlihat mahasiswa & dosen.

### AP-7 `batalkan_jadwal`
```ts
supabase.rpc('batalkan_jadwal', { p_run_id: 5, p_alasan: 'Ada perubahan ketersediaan ruangan' })
```
Response: `{ "run_id": 5, "status": "dibatalkan" }`
Aturan: pemanggil `admin`. Dipakai bila ada slot yang ditolak dosen & admin memilih generate ulang, atau membatalkan jadwal yang sudah `final` karena kondisi berubah. `p_alasan` wajib. `NT` ke pihak terkait bila run sebelumnya sudah `final`.

---

## D. Edge Functions — `POST /functions/v1/<fn>`

Header: `Authorization: Bearer <access_token>` (fungsi memverifikasi role). Body & response JSON.

### SC-1 (bagian file) Upload SPS
Client mengunggah file dulu ke Storage, lalu memanggil parse:
```ts
const path = `sps/${gelombangId}/${Date.now()}-${file.name}`
await supabase.storage.from('sps').upload(path, file)
```

### SC-2 `parse-sps`
```
POST /functions/v1/parse-sps
```
Request:
```json
{ "gelombang_id": 7, "file_path": "sps/7/1699-Data_SPS.xlsx" }
```
Response `200`:
```json
{
  "gelombang_id": 7,
  "summary": { "total": 20, "valid": 18, "invalid": 1, "duplikat": 1, "dijadwalkan": 15, "ditunda": 5 },
  "seminars": [
    {
      "row": 1, "urutan_daftar": 1,
      "nim": "11221023", "nama": "Hylmi Wahyudi",
      "jenis": "sempro", "jenis_ta": "proyek",
      "judul": "Implementasi Dual-Homing dan Load Balancing pada Metro Ethernet",
      "pembimbing_utama": { "matched_dosen_id": 4, "raw": "Darmansyah, S.Si., M.T.I" },
      "pembimbing_pendamping": { "matched_dosen_id": 5, "raw": "Rizky Amelia, S.Si., M.Han." },
      "penguji1": null, "penguji2": null,
      "dijadwalkan": true, "validasi": "valid", "catatan": null
    },
    {
      "row": 17, "urutan_daftar": 16,
      "nim": "11221088", "nama": "Contoh Mahasiswa",
      "dijadwalkan": false, "validasi": "valid",
      "catatan": "melebihi kuota bulan ini, ditunda ke gelombang berikutnya"
    },
    {
      "row": 8, "nim": "11221019", "nama": "Azhari Rambe",
      "validasi": "invalid", "catatan": "Pembimbing pendamping tidak ditemukan di data dosen: 'Nur F. Azhar'"
    }
  ]
}
```
Data mahasiswa & kedua pembimbing **sudah lengkap** di sheet pendaftaran (prodi: mahasiswa wajib dapat persetujuan pembimbing sebelum mendaftar) — Edge Function tinggal membacanya. Efek samping: buat baris `mahasiswa` (dari NIM+nama di sheet, tidak perlu di-input admin lebih dulu) + upsert baris `seminar` (pembimbing utama & pendamping terisi, penguji `null`, `urutan_daftar` dari kolom waktu daftar di sheet, `validasi` sesuai hasil cek). Nama dosen dicocokkan fuzzy → `matched_dosen_id` (null bila ragu → baris jadi `invalid`, admin perbaiki manual).

**Aturan kuota** (prodi: maks 15 mahasiswa/bulan): setelah semua baris terbaca, urutkan menurut `urutan_daftar`. Baris ke-1..`gelombang.kuota_maks` → `dijadwalkan = true`. Sisanya → `dijadwalkan = false`, `catatan = "melebihi kuota bulan ini, ditunda ke gelombang berikutnya"`. `summary` menyertakan `dijadwalkan` & `ditunda`. Admin bisa override manual (mis. bila ada yang mengundurkan diri) lewat `seminar` update.

### SC-3 (tetapkan penguji + mode online) — via tabel
Setelah admin memilih **Penguji 1 & 2** (manual) dan menandai seminar yang **online** di UI preview:
```ts
supabase.from('seminar').update({
  penguji1_id: 9, penguji2_id: 2,
  is_online: true,          // ditetapkan admin — GA jadwalkan waktunya, venue = online
  validasi: 'valid'
}).eq('id', seminarId)
```
Aturan validasi di trigger DB: penguji ≠ pembimbing; penguji1 ≠ penguji2; keempat id ada & `status='aktif'`.

### SC-4 (konfigurasi) — via tabel
```ts
supabase.from('gelombang').update({
  tanggal_mulai: '2026-06-01', tanggal_selesai: '2026-06-30',
  hari_aktif: ['senin','selasa','rabu','kamis','jumat'],
  jam_operasional_mulai: '08:00', jam_operasional_selesai: '17:00',
  jeda_menit: 15, ruangan_aktif: ['B-207','B-201'],
  status: 'siap_generate'
}).eq('id', 7)
```

### SC-5 `generate-schedule`
```
POST /functions/v1/generate-schedule
```
Request:
```json
{ "gelombang_id": 7, "ga_params": { "population_size": 100, "generations": 500 } }
```
`ga_params` opsional (default dari `app_config`). 

Yang dilakukan Edge Function:
1. Verifikasi pemanggil `admin` & `gelombang.status = 'siap_generate'`.
2. **Cek onboarding**: setiap dosen (4 peran) & setiap mahasiswa yang terlibat di gelombang harus `profiles.onboarding_at IS NOT NULL`. Bila ada yang belum → `VALIDATION_FAILED` dengan `details.belum_onboarding: [{nama, role}]` (jadwal mereka belum lengkap, generate ditolak).
3. Baca `seminar` (`validasi = valid` **dan** `dijadwalkan = true` — yang ditunda kuota tidak ikut), `jadwal_mengajar`, `blokir_waktu`, `jadwal_kuliah`, `ruangan` (yang `ruangan_aktif`).
4. **Ekspansi**: "hari + Sesi N" → rentang jam (`app_config.jadwal_kampus.sesi`, kolom Jumat bila hari Jumat); nama → `dosen_id`. Susun `blackout_windows` dari `app_config.jadwal_kampus.blackout`.
5. Rakit payload GA (lihat §E) dan `POST {AI_URL}/solve` dengan header `X-AI-Key`.
6. Tulis transaksional: 1 baris `schedule_run` + N `schedule_slot` + 4N `approval` (status `pending`).
7. Kembalikan ringkasan.

Response `200`:
```json
{
  "run_id": 31,
  "fitness_score": 96.2,
  "conflict_count": 0,
  "generations_run": 214,
  "execution_time_ms": 1180,
  "stats": {
    "dosen_menguji_lebih_dari_1_topik_per_hari": 1,
    "dosen_dengan_lebih_dari_1_keterlibatan_per_hari": 3
  },
  "unscheduled": [
    { "seminar_id": 40, "nama": "Dewi Purnamasari",
      "alasan": "Tidak ada slot tersisa: Dr. Bima mengajar Sen–Kam & blokir Jumat pagi" }
  ]
}
```
Error khusus: `VALIDATION_FAILED` (masih ada seminar `invalid`), `UPSTREAM_ERROR` (AI service gagal / timeout), `CONFLICT_STATE` (gelombang bukan `siap_generate`).

### SC-7 (simpan / buang run) — via tabel
```ts
supabase.from('schedule_run').update({ status: 'tersimpan', nama: 'Jadwal Semhas Juni 2026' }).eq('id', 31)
supabase.from('schedule_run').delete().eq('id', 31)   // SC-10, cascade ke slot & approval
```

### SC-11 / RP-2 `export-schedule`
```
POST /functions/v1/export-schedule
```
Request:
```json
{ "run_id": 31, "format": "pdf", "view": "tabel" }   // format: 'xlsx' | 'pdf'  · view: 'tabel' | 'kalender'
```
Response:
```json
{ "file_url": "https://<project>.supabase.co/storage/v1/object/sign/exports/run-31.pdf?token=…",
  "expires_at": "2026-06-11T10:00:00Z" }
```
Mobile: buka `file_url` via `@capacitor/browser` atau simpan via `@capacitor/filesystem` + `@capacitor/share`.

### NT-1..3 `notify` (dipanggil internal oleh RPC/Edge, bukan client)
```json
{ "template": "jadwal_final",
  "run_id": 31,
  "recipients": ["all_dosen_in_run", "all_mahasiswa_in_run", "admin_owner"] }
```
Untuk **setiap** penerima: tulis baris `notification` **dan** kirim email (via `RESEND_API_KEY`). Notifikasi in-app dan email keduanya aktif — bukan salah satu. Template: `slot_ditetapkan` (NT-1), `slot_ditolak` (NT-2, ke admin), `jadwal_final` / `jadwal_dibatalkan` (NT-3).

---

## E. AI Service — `POST {AI_URL}/solve`

Dipanggil **hanya** oleh Edge Function `generate-schedule`. Auth: header `X-AI-Key: <shared secret>`. Sinkron untuk MVP (timeout 60 dtk). Detail algoritma & constraint: [`ga-design.md`](ga-design.md).

### `GET /health`
```json
{ "status": "ok", "version": "0.1.0" }
```

### `POST /solve`
Request:
```json
{
  "seminar_type": "semhas",
  "session_duration_minutes": 105,
  "period": { "start_date": "2026-06-01", "end_date": "2026-06-30" },
  "active_days": ["senin","selasa","rabu","kamis","jumat"],
  "operational_hours": { "start": "08:00", "end": "17:30" },
  "gap_minutes": 15,
  "blackout_windows": [
    { "start": "12:00", "end": "13:00", "label": "Sholat Dzuhur", "hari": ["senin","selasa","rabu","kamis"] },
    { "start": "11:00", "end": "13:00", "label": "Sholat Jumat",  "hari": ["jumat"] },
    { "start": "15:00", "end": "16:00", "label": "Sholat Ashar" }
  ],
  "rooms": [
    { "id": "B-207", "is_online": false },
    { "id": "B-201", "is_online": false }
  ],
  "seminars": [
    { "id": 12, "nim": "11221023", "nama": "Hylmi Wahyudi",
      "is_online": false,
      "pembimbing_utama_id": 4, "pembimbing_pendamping_id": 5,
      "penguji1_id": 9, "penguji2_id": 2 }
  ],
  "dosen_teaching_schedule": [
    { "dosen_id": 4, "hari": "senin", "jam_mulai": "13:00", "jam_selesai": "15:30" }
  ],
  "dosen_blocked_time": [
    { "dosen_id": 4, "hari": "jumat", "jam_mulai": "11:30", "jam_selesai": "13:00" }
  ],
  "student_class_schedule": [
    { "nim": "11221023", "hari": "senin", "jam_mulai": "07:30", "jam_selesai": "10:00" }
  ],
  "ga_params": {
    "population_size": 100, "generations": 500,
    "crossover_rate": 0.8, "mutation_rate": 0.1, "elitism_count": 2,
    "soft_weights": { "s0_menguji_lebih_dari_1_per_hari": 10, "s1_total_peran_lebih_dari_1_per_hari": 5 }
  }
}
```
Catatan:
- `session_duration_minutes` = `gelombang.durasi_menit` bila di-set, else default jenis (sempro 60, semhas 105).
- `seminars` hanya berisi yang `dijadwalkan = true` (≤ `kuota_maks`). Yang ditunda kuota tidak dikirim ke AI.
- Semua jadwal mengajar & kuliah dikirim **sudah dalam rentang jam** dan **sudah pakai `dosen_id`** — Edge Function yang mengonversi (mis. "Rabu Sesi 3" → "Rabu 13:00–15:30"). AI service tidak tahu aturan Sesi kampus atau varian penulisan nama.
- `blackout_windows` = waktu yang **tidak boleh dipakai seminar** (sholat Dzuhur/Jumat/Ashar). Tiap entry boleh punya `hari` (daftar hari berlakunya; tanpa `hari` = semua hari aktif). AI membuang slot yang beririsan saat generate slot kandidat — sama tier dengan `operational_hours` & `active_days`. Jumat berbeda: blackout 11.00–13.00 (bukan 12.00–13.00).
- `seminars[].is_online` **ditetapkan admin** di langkah preview (SC-3), bukan diputuskan AI. Untuk seminar `is_online: true`, AI menjadwalkan **waktunya** tetapi venue dikunci ke "online" (tak konsumsi ruangan fisik, H1 dilewati).

Response `200`:
```json
{
  "status": "success",
  "fitness_score": 96.2,
  "conflict_count": 0,
  "generations_run": 214,
  "execution_time_ms": 1180,
  "stats": {
    "dosen_menguji_lebih_dari_1_topik_per_hari": 1,
    "dosen_dengan_lebih_dari_1_keterlibatan_per_hari": 3,
    "rata_rata_sidang_per_dosen": 3.4
  },
  "schedule": [
    { "seminar_id": 12, "tanggal": "2026-06-08",
      "jam_mulai": "10:00", "jam_selesai": "11:45", "ruangan": "B-207" }
  ],
  "unscheduled": [
    { "seminar_id": 40, "alasan": "domain kosong setelah H3–H5" }
  ]
}
```
Response `422` bila payload tak valid (mis. `rooms` kosong, tanggal_selesai < tanggal_mulai):
```json
{ "error": { "code": "VALIDATION_FAILED", "message": "rooms tidak boleh kosong", "details": { "field": "rooms" } } }
```

---

## F. Peta Use Case → Kontrak

| Use case | Mekanisme | Endpoint / operasi |
|---|---|---|
| AC-1..4 | Auth SDK | `auth.signInWithPassword` / `getUser` / `signOut` / `resetPasswordForEmail` |
| AC-5 | RPC + Table | isi `jadwal_mengajar`/`jadwal_kuliah` lalu `rpc('selesai_onboarding')` → set `profiles.onboarding_at` |
| MD-1..3 | Table | `dosen`, `jadwal_mengajar`, `ruangan` (data dosen di-input manual admin) |
| DS-1 | Table | `jadwal_mengajar` (filter `dosen_id`) |
| DS-2 | Table | `blokir_waktu` (RLS pemilik) |
| DS-3 | Table | `seminar` (filter `or` 4 kolom peran) |
| MS-1 | Table | `jadwal_kuliah` (RLS pemilik) |
| MS-2 | Table | `seminar` + join `schedule_slot`, `approval` |
| SC-1 | Storage + Table | `storage.upload` (sheet pendaftaran) + `gelombang` insert |
| SC-2 | Edge Fn | `parse-sps` (buat `mahasiswa` + `seminar`, pembimbing dari sheet) |
| SC-3 | Table | `seminar` update (penguji 1&2 manual + tandai `is_online`) |
| SC-4 | Table | `gelombang` update (konfigurasi) |
| SC-5 | Edge Fn → AI | `generate-schedule` → `POST /solve` |
| SC-6 | Table | `schedule_slot` select |
| SC-7 | Table | `schedule_run` update `status` |
| SC-8 | Edge Fn | `generate-schedule` (ulang) |
| SC-9 | Table | `schedule_run` select |
| SC-10 | Table | `schedule_run` delete (cascade) |
| SC-11 | Edge Fn | `export-schedule` |
| AP-1 | Table | `approval` select (filter `dosen_id`) |
| AP-2..4 | RPC | `submit_approval` |
| AP-5 | Table + Realtime | `approval` select + channel |
| AP-6 | RPC | `finalisasi_jadwal` (admin; gate: semua slot 4/4 ACC) |
| AP-7 | RPC | `batalkan_jadwal` (admin) |
| RP-1 | Table | agregat `schedule_run` (atau view `laporan`) |
| RP-2 | Edge Fn | `export-schedule` (format laporan) |
| NT-1..3 | Edge Fn (internal) | `notify` — in-app + email keduanya |
| NT-4 | Table | `notification` select / update `dibaca` |
