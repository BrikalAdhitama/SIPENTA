// Edge Function: generate-schedule
// POST /functions/v1/generate-schedule
// Alur: verifikasi admin → baca data gelombang → ekspansi Sesi→jam & nama→id →
//       POST {AI_URL}/solve → tulis schedule_run + schedule_slot + approval → ringkasan.
//
// Ini KERANGKA. Isi TODO sesuai api-contract.md §D (SC-5) dan §E.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, jsonError, jsonOk } from "../_shared/http.ts";

const AI_URL = Deno.env.get("AI_SERVICE_URL")!;
const AI_KEY = Deno.env.get("AI_SERVICE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonError("VALIDATION_FAILED", "gunakan POST", 405);

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

  // 2. baca gelombang + pastikan status siap_generate
  const { data: g } = await admin.from("gelombang").select("*").eq("id", gelombang_id).single();
  if (!g) return jsonError("NOT_FOUND", "gelombang tidak ditemukan", 404);
  if (g.status !== "siap_generate")
    return jsonError("CONFLICT_STATE", `gelombang berstatus ${g.status}`, 409);

  // 3. baca seminar (semua harus valid), jadwal mengajar, blokir, jadwal kuliah, ruangan aktif
  const { data: seminars } = await admin.from("seminar").select("*").eq("gelombang_id", gelombang_id);
  if (seminars!.some((s) => s.validasi !== "valid"))
    return jsonError("VALIDATION_FAILED", "masih ada seminar invalid/duplikat", 422);

  // TODO: ambil jadwal_mengajar, blokir_waktu, jadwal_kuliah untuk dosen & mhs terkait
  // TODO: ekspansi Sesi → rentang jam (bila kampus pakai sistem Sesi); nama dosen → dosen_id
  // TODO: filter ruangan sesuai g.ruangan_aktif

  const durasi = g.jenis === "semhas" ? 105 : 60;
  const { data: cfg } = await admin.from("app_config").select("value").eq("key", "ga_defaults").single();

  const payload = {
    seminar_type: g.jenis,
    session_duration_minutes: durasi,
    period: { start_date: g.tanggal_mulai, end_date: g.tanggal_selesai },
    active_days: g.hari_aktif,
    operational_hours: { start: g.jam_operasional_mulai, end: g.jam_operasional_selesai },
    gap_minutes: g.jeda_menit,
    rooms: [], // TODO
    seminars: seminars!.map((s) => ({
      id: s.id, nim: null, nama: null,
      is_online: s.is_online, // ditetapkan admin — GA jadwalkan waktunya, venue = online
      pembimbing_utama_id: s.pembimbing_utama_id,
      pembimbing_pendamping_id: s.pembimbing_pendamping_id,
      penguji1_id: s.penguji1_id, penguji2_id: s.penguji2_id,
    })),
    dosen_teaching_schedule: [], // TODO
    dosen_blocked_time: [], // TODO
    student_class_schedule: [], // TODO
    ga_params: { ...cfg!.value, ...(ga_params ?? {}) },
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
    if (!res.ok) return jsonError("UPSTREAM_ERROR", `AI service ${res.status}`, 502);
    ga = await res.json();
  } catch (e) {
    return jsonError("UPSTREAM_ERROR", `AI service tidak merespons: ${e}`, 502);
  }

  // 5. tulis hasil (idealnya lewat 1 RPC transaksional insert_schedule_run(...))
  const { data: run } = await admin.from("schedule_run").insert({
    gelombang_id, fitness_score: ga.fitness_score, conflict_count: ga.conflict_count,
    generations_run: ga.generations_run, exec_ms: ga.execution_time_ms,
    stats: ga.stats, unscheduled: ga.unscheduled, status: "draft", created_by: user.id,
  }).select("id").single();

  // TODO: batch insert schedule_slot dari ga.schedule; lalu 4 approval per slot (peran + dosen_id dari seminar)
  // TODO: set gelombang.status = 'dijadwalkan'
  // TODO: panggil notify (NT-1) untuk dosen yang dapat slot

  return jsonOk({
    run_id: run!.id,
    fitness_score: ga.fitness_score,
    conflict_count: ga.conflict_count,
    generations_run: ga.generations_run,
    execution_time_ms: ga.execution_time_ms,
    stats: ga.stats,
    unscheduled: ga.unscheduled,
  });
});
