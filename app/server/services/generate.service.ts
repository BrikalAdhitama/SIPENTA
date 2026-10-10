import { GenerateRepository } from "../repositories/generate.repository";
import { useRuntimeConfig } from "#imports";

const potongJam = (v: unknown) => String(v ?? "").slice(0, 5);
const JENIS_KE_AI: Record<string, string> = { seminar_proposal: "sempro", seminar_hasil: "semhas" };

export class GenerateService {
  constructor(private readonly repo = new GenerateRepository()) {}

  async generate(gelombangId: number, gaParams: Record<string, unknown> | undefined, userId: string) {
    const g = await this.repo.gelombang(gelombangId);
    if (g.status !== "siap_generate") throw new Error(`Gelombang berstatus ${g.status}.`);

    const seminars: any[] = await this.repo.seminarTerjadwal(gelombangId);
    if (!seminars.length) throw new Error("Tidak ada seminar yang dijadwalkan di gelombang ini.");
    if (seminars.some((s) => s.validasi !== "valid")) {
      throw new Error("Masih ada seminar invalid/duplikat di kuota.");
    }

    const dosenIds = [...new Set(seminars.flatMap((s) => [
      s.pembimbing_utama_id, s.pembimbing_pendamping_id, s.penguji1_id, s.penguji2_id,
    ]).filter(Boolean))];
    const mhsIds = [...new Set(seminars.map((s) => s.mahasiswa_id).filter(Boolean))];

    const belum = await this.repo.belumOnboarding(dosenIds, mhsIds);
    if (belum.length > 0) throw new Error("Ada dosen/mahasiswa yang belum melengkapi jadwal.");

    const roomsRaw = await this.repo.ruanganAktif(g.ruangan_aktif?.length ? g.ruangan_aktif : undefined);
    if (!roomsRaw.length) throw new Error("Tidak ada ruangan aktif untuk gelombang ini.");

    const jadwal = await this.repo.jadwalTerkait(dosenIds, mhsIds);
    const nimMap = new Map<number, string>();
    for (const s of seminars) {
      if (s.mahasiswa_id && s.mahasiswa && !nimMap.has(s.mahasiswa_id)) nimMap.set(s.mahasiswa_id, s.mahasiswa.nim);
    }

    const cfg = await this.repo.appConfig("ga_defaults");
    const kampus = await this.repo.appConfig("jadwal_kampus");

    const payload = {
      seminar_type: JENIS_KE_AI[g.jenis] ?? g.jenis,
      session_duration_minutes: g.durasi_menit ?? (g.jenis === "seminar_hasil" ? 105 : 60),
      period: { start_date: g.tanggal_mulai, end_date: g.tanggal_selesai },
      active_days: g.hari_aktif,
      operational_hours: { start: potongJam(g.jam_operasional_mulai), end: potongJam(g.jam_operasional_selesai) },
      gap_minutes: g.jeda_menit,
      blackout_windows: (kampus?.blackout ?? []).map((b: any) => ({
        start: b.mulai, end: b.selesai, label: b.label, ...(b.hari ? { hari: b.hari } : {}),
      })),
      rooms: roomsRaw.map((r: any) => ({ id: r.kode, is_online: r.is_online })),
      seminars: seminars.map((s: any) => ({
        id: s.id, nim: s.mahasiswa?.nim ?? null, nama: s.mahasiswa?.nama ?? null,
        is_online: s.is_online,
        pembimbing_utama_id: s.pembimbing_utama_id,
        pembimbing_pendamping_id: s.pembimbing_pendamping_id,
        penguji1_id: s.penguji1_id, penguji2_id: s.penguji2_id,
      })),
      dosen_teaching_schedule: jadwal.mengajar.map((j: any) => ({
        dosen_id: j.dosen_id, hari: j.hari,
        jam_mulai: potongJam(j.jam_mulai), jam_selesai: potongJam(j.jam_selesai),
      })),
      // ponytail: DB wajibkan hari+tanggal, AI mau salah satu → kirim tanggal-only.
      dosen_waktu_pribadi: jadwal.pribadi.map((b: any) => ({
        dosen_id: b.dosen_id, tanggal: b.tanggal,
        jam_mulai: potongJam(b.jam_mulai), jam_selesai: potongJam(b.jam_selesai),
      })),
      student_class_schedule: jadwal.kuliah
        .filter((j: any) => nimMap.has(j.mahasiswa_id))
        .map((j: any) => ({
          nim: nimMap.get(j.mahasiswa_id), hari: j.hari,
          jam_mulai: potongJam(j.jam_mulai), jam_selesai: potongJam(j.jam_selesai),
        })),
      ga_params: { ...(cfg ?? {}), ...(gaParams ?? {}) },
    };

    const config = useRuntimeConfig();
    const aiUrl = config.aiServiceUrl || process.env.AI_SERVICE_URL;
    const aiKey = config.aiServiceKey || process.env.AI_SERVICE_KEY;
    if (!aiUrl || !aiKey) throw new Error("AI_SERVICE_URL/KEY belum di-set di .env Nuxt.");
    // ponytail: tanpa validasi skema di sini, andalkan 422 AI. Tambah zod bila FE butuh pesan dini.

    let ga: any;
    try {
      ga = await $fetch(`${aiUrl.replace(/\/+$/, "")}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Key": aiKey },
        body: payload,
        timeout: 60_000,
      });
    } catch (e: any) {
      throw new Error(`AI service tidak merespons: ${e?.data?.error?.message || e?.message || e}`);
    }

    const run = await this.repo.simpanRun({
      gelombang_id: gelombangId, fitness_score: ga.fitness_score, conflict_count: ga.conflict_count,
      generations_run: ga.generations_run, exec_ms: ga.execution_time_ms,
      stats: { ...(ga.stats ?? {}), peringatan: ga.stats?.peringatan ?? [] },
      unscheduled: ga.unscheduled ?? [], status: "draft", created_by: userId,
    });

    const seminarMap = new Map(seminars.map((s: any) => [s.id, s]));
    const slotRows = (ga.schedule ?? [])
      .filter((sl: any) => seminarMap.has(sl.seminar_id))
      .map((sl: any) => ({
        schedule_run_id: run.id, seminar_id: sl.seminar_id, tanggal: sl.tanggal,
        jam_mulai: sl.jam_mulai, jam_selesai: sl.jam_selesai, ruangan_kode: sl.ruangan,
        is_online: seminarMap.get(sl.seminar_id)!.is_online ?? false,
      }));
    const slots = await this.repo.simpanSlot(slotRows);
    if (slots.length > 0) {
      await this.repo.simpanApproval(slots.flatMap((sl: any) => {
        const s = seminarMap.get(sl.seminar_id)!;
        return [
          { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.pembimbing_utama_id, peran: "pembimbing_utama" },
          { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.pembimbing_pendamping_id, peran: "pembimbing_pendamping" },
          { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.penguji1_id, peran: "penguji_1" },
          { slot_id: sl.id, schedule_run_id: run.id, dosen_id: s.penguji2_id, peran: "penguji_2" },
        ];
      }));
    }
    await this.repo.tandaiDijadwalkan(gelombangId);

    return {
      success: true,
      data: {
        run_id: run.id,
        fitness_score: ga.fitness_score,
        conflict_count: ga.conflict_count,
        generations_run: ga.generations_run,
        execution_time_ms: ga.execution_time_ms,
        slot_tersimpan: slots.length,
        stats: ga.stats,
        unscheduled: ga.unscheduled,
      },
    };
  }
}
