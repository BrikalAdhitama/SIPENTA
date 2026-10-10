import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

// Satu-satunya tempat query generate. Service-role hanya server.
// Ganti DB nanti = ganti file ini saja.

// ponytail: pindah ke 1 RPC transaksional bila run+slot+approval perlu atomik penuh.
export class GenerateRepository {
  private getServiceClient() {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) return null;
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  private client() {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");
    return client;
  }

  async gelombang(id: number) {
    const { data, error } = await this.client().from("gelombang").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Gelombang tidak ditemukan.");
    return data;
  }

  async seminarTerjadwal(gelombangId: number) {
    const { data, error } = await this.client()
      .from("seminar").select("*, mahasiswa(nim,nama)")
      .eq("gelombang_id", gelombangId).eq("dijadwalkan", true);
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async belumOnboarding(dosenIds: number[], mhsIds: number[]) {
    if (!dosenIds.length && !mhsIds.length) return [];
    const or: string[] = [];
    if (dosenIds.length) or.push(`dosen_id.in.(${dosenIds.join(",")})`);
    if (mhsIds.length) or.push(`mahasiswa_id.in.(${mhsIds.join(",")})`);
    const { data, error } = await this.client().from("profiles")
      .select("nama, role").is("onboarding_at", null).or(or.join(","));
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async ruanganAktif(kode?: string[]) {
    let q = this.client().from("ruangan").select("kode,is_online").eq("status", "aktif");
    if (kode?.length) q = q.in("kode", kode);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async jadwalTerkait(dosenIds: number[], mhsIds: number[]) {
    const c = this.client();
    const [jm, blokir, jk] = await Promise.all([
      c.from("jadwal_mengajar").select("dosen_id,hari,jam_mulai,jam_selesai").in("dosen_id", dosenIds),
      c.from("blokir_waktu").select("dosen_id,tanggal,jam_mulai,jam_selesai").in("dosen_id", dosenIds),
      c.from("jadwal_kuliah").select("mahasiswa_id,hari,jam_mulai,jam_selesai").in("mahasiswa_id", mhsIds),
    ]);
    const err = jm.error || blokir.error || jk.error;
    if (err) throw new Error(err.message);
    return { mengajar: jm.data ?? [], pribadi: blokir.data ?? [], kuliah: jk.data ?? [] };
  }

  async appConfig(key: string) {
    const { data, error } = await this.client().from("app_config").select("value").eq("key", key).single();
    if (error) throw new Error(error.message);
    return data?.value;
  }

  async simpanRun(row: Record<string, unknown>) {
    const { data, error } = await this.client().from("schedule_run").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return data;
  }

  async simpanSlot(rows: Record<string, unknown>[]) {
    if (!rows.length) return [];
    const { data, error } = await this.client().from("schedule_slot").insert(rows).select("id,seminar_id");
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async simpanApproval(rows: Record<string, unknown>[]) {
    const { error } = await this.client().from("approval").insert(rows);
    if (error) throw new Error(error.message);
  }

  async tandaiDijadwalkan(gelombangId: number) {
    const { error } = await this.client().from("gelombang").update({ status: "dijadwalkan" }).eq("id", gelombangId);
    if (error) throw new Error(error.message);
  }
}
