# Integrasi AI Service ↔ Backend Nuxt (Nitro)

Panduan untuk BE menyambungkan `app/server/` ke AI service (`ai-service/`, FastAPI). Arsitektur mengikuti [`nuxt-backend-plan.md`](nuxt-backend-plan.md): frontend memanggil `/api/*` Nuxt, Nuxt memanggil `POST {AI_SERVICE_URL}/solve`. Kontrak lengkap: [`api-contract.md`](api-contract.md) §E.

## 1. Environment (hanya di host Nuxt, jangan di client)

```
AI_SERVICE_URL=https://sipenta-ai.onrender.com     # atau http://127.0.0.1:8000 saat lokal
AI_SERVICE_KEY=<shared secret, sama dengan env AI service>
SUPABASE_SERVICE_ROLE_KEY=<service role>
```
`runtimeConfig` di `app/nuxt.config.ts` sudah menyediakan `aiServiceUrl` dan `aiServiceKey`.

## 2. Menjalankan AI service saat pengembangan

```bash
cd ai-service
python -m pytest -q                                   # 53 test
$env:AI_SERVICE_KEY = "rahasia-dev"                   # PowerShell
python -m uvicorn app.main:app --port 8000
```
Cek cepat:

| Endpoint | Gunanya untuk BE/FE |
|---|---|
| `GET /health` | service hidup (ringan, aman di-ping sering) |
| `GET /ready` | mesin GA benar-benar bisa menjadwalkan — pakai ini saat menampilkan status "AI siap" |
| `GET /version` | versi service + parameter GA default yang sedang berjalan |
| `GET /docs` | dokumentasi interaktif (coba langsung dari browser) |

Kirim header **`X-Request-Id`** dari Nuxt bila ingin menelusuri satu permintaan di log kedua layanan; AI mengembalikannya di header respons.

Contoh payload siap pakai: [`../ai-service/examples/solve-request.example.json`](../ai-service/examples/solve-request.example.json) — bentuknya sudah memakai enum DB (`seminar_proposal`) dan baris `blokir_waktu` yang mengisi `hari` + `tanggal`.

```bash
curl.exe -s -X POST http://127.0.0.1:8000/solve -H "Content-Type: application/json" ^
  -H "X-AI-Key: rahasia-dev" --data "@ai-service/examples/solve-request.example.json" -o hasil.json
```

## 3. Pemetaan tabel → payload `/solve`

| Payload | Sumber | Catatan |
|---|---|---|
| `seminar_type` | `gelombang.jenis` | `seminar_proposal` / `seminar_hasil` diterima apa adanya |
| `session_duration_minutes` | `gelombang.durasi_menit` | bila null: 60 (proposal) / 105 (hasil) |
| `period` | `gelombang.tanggal_mulai`, `tanggal_selesai` | format `YYYY-MM-DD` |
| `active_days` | `gelombang.hari_aktif` | nama hari huruf kecil |
| `operational_hours`, `gap_minutes` | `gelombang.jam_operasional_*`, `jeda_menit` | jam `HH:MM` (boleh `HH:MM:SS` dari Postgres `time`) |
| `blackout_windows` | `app_config.jadwal_kampus.blackout` | ubah kunci `mulai`/`selesai` → `start`/`end` |
| `rooms` | `ruangan` yang kodenya ada di `gelombang.ruangan_aktif` | `{ id: kode, is_online }`; sertakan 1 ruang `is_online: true` bila ada seminar daring |
| `seminars` | `seminar` dengan `validasi = 'valid'` **dan** `dijadwalkan = true` | wajib `nim` (untuk H5) dan 4 `dosen_id` |
| `dosen_teaching_schedule` | `jadwal_mengajar` milik dosen yang terlibat | pakai `hari` (berulang mingguan) |
| `dosen_waktu_pribadi` | `blokir_waktu` milik dosen yang terlibat | boleh kirim `hari` + `tanggal` sekaligus; `tanggal` yang dipakai |
| `student_class_schedule` | `jadwal_kuliah` milik mahasiswa peserta | pakai `hari`, wajib `nim` |
| `ga_params` | `app_config.ga_defaults` | opsional; `soft_weights` boleh sebagian |

Tabel kampus memakai `time` Postgres (`08:00:00`) — AI menerimanya, juga bentuk `13.30`.

## 4. Contoh endpoint Nitro

Simpan sebagai `app/server/api/penjadwalan/generate.post.ts`. Pola berlapis dibiarkan ringkas di satu berkas agar mudah dipecah ke `services/` + `repositories/` sesuai kesepakatan tim.

```ts
import { createError } from "h3";
import { serverSupabaseServiceRole } from "#supabase/server";
import { requireRole } from "../../utils/auth";

type Interval = { dosen_id?: number; nim?: string; hari?: string; tanggal?: string; jam_mulai: string; jam_selesai: string };

const jam = (t: string) => String(t).slice(0, 5);                 // "08:00:00" → "08:00"
const durasiDefault = (jenis: string) => (jenis === "seminar_hasil" ? 105 : 60);

export default defineEventHandler(async (event) => {
  const { user } = await requireRole(event, ["admin"]);
  const { gelombang_id } = await readBody<{ gelombang_id: number }>(event);
  if (!gelombang_id) throw createError({ statusCode: 400, statusMessage: "gelombang_id wajib diisi" });

  const cfg = useRuntimeConfig();
  const db = serverSupabaseServiceRole(event);

  // 1. gelombang
  const { data: g } = await db.from("gelombang").select("*").eq("id", gelombang_id).single();
  if (!g) throw createError({ statusCode: 404, statusMessage: "Gelombang tidak ditemukan" });
  if (g.status !== "siap_generate")
    throw createError({ statusCode: 409, statusMessage: `Gelombang berstatus ${g.status}` });

  // 2. seminar yang ikut dijadwalkan
  const { data: seminars } = await db
    .from("seminar")
    .select("id, mahasiswa_id, is_online, pembimbing_utama_id, pembimbing_pendamping_id, penguji1_id, penguji2_id, mahasiswa(nim, nama)")
    .eq("gelombang_id", gelombang_id)
    .eq("dijadwalkan", true)
    .eq("validasi", "valid");
  if (!seminars?.length)
    throw createError({ statusCode: 422, statusMessage: "Tidak ada seminar valid yang dijadwalkan" });

  const dosenIds = [...new Set(seminars.flatMap((s) => [
    s.pembimbing_utama_id, s.pembimbing_pendamping_id, s.penguji1_id, s.penguji2_id,
  ]))].filter(Boolean) as number[];
  const mhsIds = [...new Set(seminars.map((s) => s.mahasiswa_id))];

  // 3. constraint: jadwal mengajar (H3), waktu pribadi (H4), jadwal kuliah (H5)
  const [{ data: mengajar }, { data: pribadi }, { data: kuliah }, { data: ruangan }, { data: konfig }] =
    await Promise.all([
      db.from("jadwal_mengajar").select("dosen_id, hari, jam_mulai, jam_selesai").in("dosen_id", dosenIds),
      db.from("blokir_waktu").select("dosen_id, hari, tanggal, jam_mulai, jam_selesai").in("dosen_id", dosenIds),
      db.from("jadwal_kuliah").select("mahasiswa_id, hari, jam_mulai, jam_selesai, mahasiswa(nim)").in("mahasiswa_id", mhsIds),
      db.from("ruangan").select("kode, is_online").in("kode", g.ruangan_aktif ?? []),
      db.from("app_config").select("key, value").in("key", ["ga_defaults", "jadwal_kampus"]),
    ]);

  const byKey = Object.fromEntries((konfig ?? []).map((r) => [r.key, r.value]));
  const blackout = (byKey.jadwal_kampus?.blackout ?? []).map((b: any) => ({
    start: jam(b.mulai), end: jam(b.selesai), label: b.label, ...(b.hari ? { hari: b.hari } : {}),
  }));

  // 4. payload AI
  const payload = {
    seminar_type: g.jenis,
    session_duration_minutes: g.durasi_menit ?? durasiDefault(g.jenis),
    period: { start_date: g.tanggal_mulai, end_date: g.tanggal_selesai },
    active_days: g.hari_aktif,
    operational_hours: { start: jam(g.jam_operasional_mulai), end: jam(g.jam_operasional_selesai) },
    gap_minutes: g.jeda_menit,
    blackout_windows: blackout,
    rooms: (ruangan ?? []).map((r) => ({ id: r.kode, is_online: r.is_online })),
    seminars: seminars.map((s) => ({
      id: s.id,
      nim: (s as any).mahasiswa?.nim ?? null,
      nama: (s as any).mahasiswa?.nama ?? null,
      is_online: s.is_online,
      pembimbing_utama_id: s.pembimbing_utama_id,
      pembimbing_pendamping_id: s.pembimbing_pendamping_id,
      penguji1_id: s.penguji1_id,
      penguji2_id: s.penguji2_id,
    })),
    dosen_teaching_schedule: (mengajar ?? []).map((m): Interval => ({
      dosen_id: m.dosen_id, hari: m.hari, jam_mulai: jam(m.jam_mulai), jam_selesai: jam(m.jam_selesai),
    })),
    dosen_waktu_pribadi: (pribadi ?? []).map((b): Interval => ({
      dosen_id: b.dosen_id, hari: b.hari, tanggal: b.tanggal,
      jam_mulai: jam(b.jam_mulai), jam_selesai: jam(b.jam_selesai),
    })),
    student_class_schedule: (kuliah ?? []).map((k): Interval => ({
      nim: (k as any).mahasiswa?.nim, hari: k.hari, jam_mulai: jam(k.jam_mulai), jam_selesai: jam(k.jam_selesai),
    })),
    ga_params: byKey.ga_defaults ?? undefined,
  };

  // 5. panggil AI
  let ai: any;
  try {
    ai = await $fetch(`${cfg.aiServiceUrl}/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Key": cfg.aiServiceKey },
      body: payload,
      timeout: 60_000,
    });
  } catch (e: any) {
    const pesan = e?.data?.error?.message ?? e?.message ?? "AI service tidak merespons";
    throw createError({ statusCode: 502, statusMessage: `AI service gagal: ${pesan}` });
  }

  // 6. simpan hasil: schedule_run → schedule_slot → approval (4 per slot)
  const { data: run } = await db.from("schedule_run").insert({
    gelombang_id,
    fitness_score: ai.fitness_score,
    conflict_count: ai.conflict_count,
    generations_run: ai.generations_run,
    exec_ms: ai.execution_time_ms,
    stats: ai.stats,
    unscheduled: ai.unscheduled,
    status: "draft",
    created_by: user.id,
  }).select("id").single();

  const seminarById = new Map(seminars.map((s) => [s.id, s]));
  const { data: slots } = await db.from("schedule_slot").insert(
    ai.schedule.map((s: any) => ({
      schedule_run_id: run!.id,
      seminar_id: s.seminar_id,
      tanggal: s.tanggal,
      jam_mulai: s.jam_mulai,
      jam_selesai: s.jam_selesai,
      ruangan_kode: s.ruangan,
      is_online: seminarById.get(s.seminar_id)?.is_online ?? false,
    })),
  ).select("id, seminar_id");

  const peran = [
    ["pembimbing_utama", "pembimbing_utama_id"],
    ["pembimbing_pendamping", "pembimbing_pendamping_id"],
    ["penguji_1", "penguji1_id"],
    ["penguji_2", "penguji2_id"],
  ] as const;

  await db.from("approval").insert(
    (slots ?? []).flatMap((slot) => {
      const sem = seminarById.get(slot.seminar_id) as any;
      return peran.map(([nama, kolom]) => ({
        slot_id: slot.id,
        schedule_run_id: run!.id,
        dosen_id: sem[kolom],
        peran: nama,
        status: "menunggu",
      }));
    }),
  );

  await db.from("gelombang").update({ status: "dijadwalkan" }).eq("id", gelombang_id);

  return {
    success: true,
    data: {
      run_id: run!.id,
      fitness_score: ai.fitness_score,
      conflict_count: ai.conflict_count,
      generations_run: ai.generations_run,
      execution_time_ms: ai.execution_time_ms,
      terjadwal: ai.schedule.length,
      unscheduled: ai.unscheduled,
      peringatan: ai.stats?.peringatan ?? [],
    },
  };
});
```

## 5. Membaca respons

| Field | Arti |
|---|---|
| `conflict_count` | pelanggaran hard (H1+H2). **Wajib 0**; bila > 0 jangan ditampilkan sebagai jadwal final |
| `fitness_score` | skor kualitas 0–100 (makin besar makin baik) |
| `schedule[]` | `{ seminar_id, tanggal, jam_mulai, jam_selesai, ruangan }` |
| `unscheduled[]` | seminar tanpa slot layak + `alasan` — tampilkan ke admin |
| `stats.peringatan[]` | masalah data saat merakit payload (mis. `nim` tidak cocok). Berguna saat uji coba pertama |
| `stats.fitness_history` | nilai fitness per generasi, untuk grafik konvergensi |

## 6. Penanganan error

Bentuk error AI sama dengan Nuxt API:
```json
{ "error": { "code": "VALIDATION_FAILED", "message": "rooms tidak boleh kosong", "details": { "field": "rooms" } } }
```
`401 UNAUTHENTICATED` (key salah) · `422 VALIDATION_FAILED` (payload) · `500 INTERNAL`. Teruskan `message` ke admin — pesannya sudah berbahasa Indonesia dan menyebut field penyebabnya.

## 7. Uji tanpa deploy

Jalankan AI di laptop lalu buka ke internet bila Nuxt sudah di-deploy:
```bash
ngrok http 8000
# set AI_SERVICE_URL ke URL ngrok
```
Untuk keperluan tetap, deploy ke Render memakai blueprint [`../render.yaml`](../render.yaml): [`deploy-ai-service.md`](deploy-ai-service.md).

Setelah URL didapat, pastikan sehat sebelum menyambungkan Nuxt:

```bash
cd ai-service
python -m scripts.smoke_test --url https://sipenta-ai.onrender.com --key <rahasia>
```
