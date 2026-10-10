import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export type JadwalMengajarRecord = {
  id: string;
  dosenId: string;
  mataKuliah: string;
  kelas: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
};

function mapRow(row: any): JadwalMengajarRecord {
  return {
    id: String(row.id),
    dosenId: String(row.dosen_id),
    mataKuliah: row.mata_kuliah,
    kelas: row.kelas,
    hari: row.hari,
    jamMulai: row.jam_mulai,
    jamSelesai: row.jam_selesai,
    ruangan: row.ruangan,
  };
}

export class JadwalMengajarRepository {
  private getServiceClient() {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) return null;

    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  async list(dosenId?: string): Promise<JadwalMengajarRecord[]> {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");

    let query = client.from("jadwal_mengajar").select("*").order("hari").order("jam_mulai");
    if (dosenId) query = query.eq("dosen_id", Number(dosenId));

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
  }

  async create(input: Omit<JadwalMengajarRecord, "id">): Promise<JadwalMengajarRecord> {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");

    const { data, error } = await client
      .from("jadwal_mengajar")
      .insert({
        dosen_id: Number(input.dosenId),
        mata_kuliah: input.mataKuliah,
        kelas: input.kelas,
        hari: input.hari,
        jam_mulai: input.jamMulai,
        jam_selesai: input.jamSelesai,
        ruangan: input.ruangan,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapRow(data);
  }

  async remove(id: string): Promise<void> {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");

    const { error } = await client.from("jadwal_mengajar").delete().eq("id", Number(id));
    if (error) throw new Error(error.message);
  }
}
