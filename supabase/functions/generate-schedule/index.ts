// Edge Function: generate-schedule
// POST /functions/v1/generate-schedule
// Alur: verifikasi admin → baca gelombang+seminar+3 jadwal+ruangan →
//       POST {AI_URL}/solve → tulis schedule_run + slot + approval → ringkasan.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, jsonError, jsonOk } from "../_shared/http.ts";

const AI_URL = Deno.env.get("AI_SERVICE_URL")!;
const AI_KEY = Deno.env.get("AI_SERVICE_KEY")!;
const potongJam = (v: unknown) => String(v ?? "").slice(0, 5);
const JENIS_KE_AI: Record<string, string> = { seminar_proposal: "sempro", seminar_hasil: "semhas" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonError("VALIDATION_FAILED", "gunakan POST", 405);
  if (!AI_URL || !AI_KEY) return jsonError("UPSTREAM_ERROR", "AI_SERVICE_URL/KEY belum di-set (supabase secrets)", 502);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
  );

  // 1. verifikasi pemanggil admin
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return jsonError("UNAUTHENTICATED", "sesi tidak valid", 401);
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return jsonError("FORBIDDEN", "hanya admin", 403);

  const { gelombang_id, ga_params } = await req.json();
  if (!gelombang_id) return jsonError("VALIDATION_FAILED", "gelombang_id wajib diisi", 400);

  // 2. baca gelombang + pastikan siap_generate
  const { data: g } = await admin.from("gelombang").select("*").eq("id", gelombang_id).single();
  if (!g) return jsonError("NOT_FOUND", "gelombang tidak ditemukan", 404);
  if (g.status !== "siap_generate")
    return jsonError("CONFLICT_STATE", `gelombang berstatus ${g.status}`, 409);

  // 3. seminar + nim/nama mahasiswa
  const { data: seminars } = await admin.from("seminar").select("*, mahasiswa(nim,nama)")
    .eq("gelombang_id", gelombang_id).eq("dijadwalkan", true);
  if (!seminars || seminars.length === 0)
    return jsonError("VALIDATION_FAILED", "tidak ada seminar yang dijadwalkan di gelombang ini", 422);
  if (seminars.some((s) => s.validasi !== "valid"))
    return jsonError("VALIDATION_FAILED", "masih ada seminar invalid/duplikat di kuota", 422);

  const dosenIds = [...new Set(seminars.flatMap((s) => [
    s.pembimbing_utama_id, s.pembimbing_pendamping_id, s.penguji1_id, s.penguji2_id,
  ]).filter(Boolean))];
  const mhsIds = [...new Set(seminars.map((s) => s.mahasiswa_id).filter(Boolean))];

  // 3b. gate onboarding
  const { data: belum } = await admin.from("profiles")
    .select("nama, role")
    .is("onboarding_at", null)
    .or(`dosen_id.in.(${dosenIds.join(",")}),mahasiswa_id.in.(${mhsIds.join(",")})`);
  if (belum && belum.length > 0)
    return jsonError("VALIDATION_FAILED", "ada dosen/mahasiswa yang belum melengkapi jadwal", 422, {
      belum_onboarding: belum,
    });

  // 3c. ruangan + 3 jadwal (paralel)
  const ruanganQ = g.ruangan_aktif?.length
    ? admin.from("ruangan").select("kode,is_online").eq("status", "aktif").in("kode", g.ruangan_aktif)
    : admin.from("ruangan").select("kode,is_online").eq("status", "aktif");
  const [ruanganR, jmR, blokirR, jkR] = await Promise.all([
    ruanganQ,
    admin.from("jadwal_mengajar").select("dosen_id,hari,jam_mulai,jam_selesai").in("dosen_id", dosenIds),
    admin.from("blokir_waktu").select("dosen_id,tanggal,jam_mulai,jam_selesai").in("dosen_id", dosenIds),
    admin.from("jadwal_kuliah").select("mahasiswa_id,hari,jam_mulai,jam_selesai").in("mahasiswa_id", mhsIds),
  ]);
  const rooms = (ruanganR.data ?? []).map((r) => ({ id: r.kode, is_online: r.is_online }));
  if (rooms.length === 0) return jsonError("VALIDATION_FAILED", "tidak ada ruangan aktif untuk gelombang ini", 422);

  const nimMap = new Map<number, string>();
  for (const s of seminars) {
    const mid = s.mahasiswa_id;
    if (mid && s.mahasiswa && !nimMap.has(mid)) nimMap.set(mid, s.mahasiswa.nim);
  }

  const durasi = g.durasi_menit ?? (g.jenis === "seminar_hasil" ? 105 : 60);
  const { data: cfg } = await admin.from("app_config").select("value").eq("key", "ga_defaults").single();
  const { data: kampus } = await admin.from("app_config").select("value").eq("key", "jadwal_kampus").single();
  const blackout = (kampus?.value?.blackout ?? []).map(
    (b: { mulai: string; selesai: string; label: string; hari?: string[] }) =>
      ({ start: b.mulai, end: b.selesai, label: b.label, ...(b.hari ? { hari: b.hari } : {}) }),
  );

  const payload = {
    seminar_type: JENIS_KE_AI[g.jenis] ?? g.jenis,
    session_duration_minutes: durasi,
    period: { start_date: g.tanggal_mulai, end_date: g.tanggal_selesai },
    active_days: g.hari_aktif,
    operational_hours: { start: potongJam(g.jam_operasional_mulai), end: potongJam(g.jam_operasional_selesai) },
    gap_minutes: g.jeda_menit,
    blackout_windows: blackout,
    rooms,
    seminars: seminars.map((s) => ({
      id: s.id, nim: s.mahasiswa?.nim ?? null, nama: s.mahasiswa?.nama ?? null,
      is_online: s.is_online,
      pembimbing_utama_id: s.pembimbing_utama_id,
      pembimbing_pendamping_id: s.pembimbing_pendamping_id,
      penguji1_id: s.penguji1_id, penguji2_id: s.penguji2_id,
    })),
    dosen_teaching_schedule: (jmR.data ?? []).map((j) => ({
      dosen_id: j.dosen_id, hari: j.hari,
      jam_mulai: potongJam(j.jam_mulai), jam_selesai: potongJam(j.jam_selesai),
    })),
    // ponytail: DB wajibkan hari+tanggal, AI mau salah satu → kirim tanggal-only. Longgarin constraint bila perlu hari-only.
    dosen_waktu_pribadi: (blokirR.data ?? []).map((b) => ({
      dosen_id: b.dosen_id, tanggal: b.tanggal,
      jam_mulai: potongJam(b.jam_mulai), jam_selesai: potongJam(b.jam_selesai),
    })),
    student_class_schedule: (jkR.data ?? [])
      .filter((j) => nimMap.has(j.mahasiswa_id))
      .map((j) => ({
        nim: nimMap.get(j.mahasiswa_id), hari: j.hari,
        jam_mulai: potongJam(j.jam_mulai), jam_selesai: potongJam(j.jam_selesai),
      })),
    ga_params: { ...(cfg?.value ?? {}), ...(ga_params ?? {}) },
  };

  // 4. panggil AI service
  let ga;
  try {
    const res = await fetch(`${AI_URL}/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Key": AI_KEY },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
    });
    ga = await res.json();
    if (!res.ok) return jsonError("UPSTREAM_ERROR", ga?.error?.message ?? `AI service ${res.status}`, 502, ga);
  } catch (e) {
    return jsonError("UPSTREAM_ERROR", `AI service tidak merespons: ${e}`, 502);
  }

  // 5. tulis run + slot + approval (4/slot) + tandai gelombang
  const { data: run, error: runErr } = await admin.from("schedule_run").insert({
    gelombang_id, fitness_score: ga.fitness_score, conflict_count: ga.conflict_count,
    generations_run: ga.generations_run, exec_ms: ga.execution_time_ms,
    stats: { ...(ga.stats ?? {}), peringatan: ga.stats?.peringatan ?? [] },
    unscheduled: ga.unscheduled ?? [], status: "draft", created_by: user.id,
  }).select("id").single();
  if (runErr || !run) return jsonError("INTERNAL", `gagal simpan run: ${runErr?.message}`, 500);

  const jadwal: Array<{ seminar_id: number; tanggal: string; jam_mulai: string; jam_selesai: string; ruangan: string }> = ga.schedule ?? [];
  const seminarMap = new Map(seminars.map((s) => [s.id, s]));
  const slotRows = jadwal
    .filter((sl) => seminarMap.has(sl.seminar_id))
    .map((sl) => ({
      schedule_run_id: run.id, seminar_id: sl.seminar_id, tanggal: sl.tanggal,
      jam_mulai: sl.jam_mulai, jam_selesai: sl.jam_selesai, ruangan_kode: sl.ruangan,
      is_online: seminarMap.get(sl.seminar_id)!.is_online ?? false,
    }));
  let slotIds: Array<{ id: number; seminar_id: number }> = [];
  if (slotRows.length > 0) {
    const { data: slots, error: slotErr } = await admin.from("schedule_slot").insert(slotRows).select("id,seminar_id");
    if (slotErr) return jsonError("INTERNAL", `run ${run.id} tersimpan, slot gagal: ${slotErr.message}`, 500, { run_id: run.id });
    slotIds = slots ?? [];
    const approvals = slotIds.flatMap((sl) => {
      const s = seminarMap.get(sl.seminar_id)!;
      return [
        { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.pembimbing_utama_id, peran: "pembimbing_utama" },
        { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.pembimbing_pendamping_id, peran: "pembimbing_pendamping" },
        { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.penguji1_id, peran: "penguji_1" },
        { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.penguji2_id, peran: "penguji_2" },
      ];
    });
    const { error: apprErr } = await admin.from("approval").insert(approvals);
    if (apprErr) return jsonError("INTERNAL", `run ${run.id} tersimpan, approval gagal: ${apprErr.message}`, 500, { run_id: run.id });
  }
  await admin.from("gelombang").update({ status: "dijadwalkan" }).eq("id", gelombang_id);

  return jsonOk({
    run_id: run.id,
    fitness_score: ga.fitness_score,
    conflict_count: ga.conflict_count,
    generations_run: ga.generations_run,
    execution_time_ms: ga.execution_time_ms,
    slot_tersimpan: slotIds.length,
    stats: ga.stats,
    unscheduled: ga.unscheduled,
  });
});
