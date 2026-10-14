import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";
import { serverSupabaseClient } from "#supabase/server";

// Satu-satunya query approval/run/slot. Ganti DB = ganti file ini.
// Read pakai service-role (role dicek di service). Tulis via RPC user-client
// supaya auth.uid() di dalam fungsi tetap terisi.
export class ApprovalRepository {
  private serviceClient() {
    const config = useRuntimeConfig();
    const url = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const key = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Konfigurasi Supabase belum lengkap.");
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  async listRuns(gelombangId?: number, batas = 20) {
    let q = this.serviceClient().from("schedule_run")
      .select("*, gelombang(nama,jenis)")
      .order("created_at", { ascending: false }).limit(batas);
    if (gelombangId) q = q.eq("gelombang_id", gelombangId);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    const runs = data ?? [];
    // hitung slot per run; schedule_run tak punya kolom slot_tersimpan.
    const ids = runs.map((r: any) => r.id);
    let hitung: Record<number, number> = {};
    let tgls: Record<number, string[]> = {};
    if (ids.length) {
      const { data: slots } = await this.serviceClient()
        .from("schedule_slot").select("schedule_run_id,tanggal").in("schedule_run_id", ids);
      for (const s of (slots ?? [])) {
        const k = (s as any).schedule_run_id;
        hitung[k] = (hitung[k] ?? 0) + 1;
        if ((s as any).tanggal) (tgls[k] ??= []).push(String((s as any).tanggal));
      }
    }
    return runs.map((r: any) => ({ ...r, slot_tersimpan: hitung[r.id] ?? 0, slot_tanggal: tgls[r.id] ?? [] }));
  }

  async listSlots(runId: number, batas = 100) {
    const { data, error } = await this.serviceClient()
      .from("schedule_slot")
      .select("*, seminar(id,judul,mahasiswa(nim,nama)), approval(*, dosen(nama))")
      .eq("schedule_run_id", runId)
      .order("tanggal")
      .order("jam_mulai")
      .limit(batas);
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async approvalsForDosen(dosenId: number) {
    const { data, error } = await this.serviceClient()
      .from("approval")
      .select("*, schedule_slot(*, seminar(judul,mahasiswa(nim,nama)), schedule_run(id,status,gelombang_id))")
      .eq("dosen_id", dosenId)
      .order("id");
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async approvalsForRun(runId: number) {
    const { data, error } = await this.serviceClient()
      .from("approval")
      .select("*, dosen(nama), schedule_slot(*, seminar(judul))")
      .eq("schedule_run_id", runId)
      .order("id");
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async approvalsForMahasiswa(mahasiswaId: number) {
    const c = this.serviceClient();
    const { data: seminars, error: e1 } = await c.from("seminar").select("id").eq("mahasiswa_id", mahasiswaId);
    if (e1) throw new Error(e1.message);
    const semIds = (seminars ?? []).map((s: any) => s.id);
    if (!semIds.length) return [];
    const { data: slots, error: e2 } = await c.from("schedule_slot").select("id").in("seminar_id", semIds);
    if (e2) throw new Error(e2.message);
    const slotIds = (slots ?? []).map((s: any) => s.id);
    if (!slotIds.length) return [];
    const { data, error } = await c
      .from("approval")
      .select("*, dosen(nama), schedule_slot(*, seminar(judul), schedule_run(id,status))")
      .in("slot_id", slotIds)
      .order("id");
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async simpanRun(runId: number) {
    const c = this.serviceClient();
    const { data: run, error: e1 } = await c.from("schedule_run").select("id,status").eq("id", runId).maybeSingle();
    if (e1) throw new Error(e1.message);
    if (!run) throw new Error("Run tidak ditemukan.");
    if ((run as any).status !== "draft") throw new Error(`Run berstatus ${(run as any).status}, harus draft dulu.`);
    const { data, error } = await c.from("schedule_run").update({ status: "tersimpan" }).eq("id", runId).select("id,status").single();
    if (error) throw new Error(error.message);
    return data;
  }

  async rpcSubmit(event: any, approvalId: number, decision: string, reason?: string) {
    const userClient: any = await serverSupabaseClient(event);
    const { data, error } = await userClient.rpc("submit_approval", {
      p_approval_id: approvalId, p_decision: decision, p_reason: reason ?? null,
    });
    if (error) throw new Error(error.message);
    return data;
  }

  async rpcFinalisasi(event: any, runId: number) {
    const userClient: any = await serverSupabaseClient(event);
    const { data, error } = await userClient.rpc("finalisasi_jadwal", { p_run_id: runId });
    if (error) throw new Error(error.message);
    return data;
  }

  async rpcBatal(event: any, runId: number, alasan: string) {
    const userClient: any = await serverSupabaseClient(event);
    const { data, error } = await userClient.rpc("batalkan_jadwal", { p_run_id: runId, p_alasan: alasan });
    if (error) throw new Error(error.message);
    return data;
  }
}
