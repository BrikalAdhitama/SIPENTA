import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export type BlokirWaktuRecord = {
  id: string;
  dosenId: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  keterangan: string;
  lokasi: string;
};

function mapRow(row: any): BlokirWaktuRecord {
  return {
    id: String(row.id),
    dosenId: String(row.dosen_id),
    hari: row.hari,
    tanggal: row.tanggal,
    jamMulai: row.jam_mulai,
    jamSelesai: row.jam_selesai,
    keterangan: row.keterangan,
    lokasi: row.lokasi ?? "",
  };
}

export class BlokirWaktuRepository {
  private getServiceClient() {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) return null;

    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  async list(dosenId?: string): Promise<BlokirWaktuRecord[]> {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");

    let query = client.from("blokir_waktu").select("*").order("tanggal").order("jam_mulai");
    if (dosenId) query = query.eq("dosen_id", Number(dosenId));

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
  }

  async create(input: Omit<BlokirWaktuRecord, "id">): Promise<BlokirWaktuRecord> {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");

    const { data, error } = await client
      .from("blokir_waktu")
      .insert({
        dosen_id: Number(input.dosenId),
        hari: input.hari,
        tanggal: input.tanggal,
        jam_mulai: input.jamMulai,
        jam_selesai: input.jamSelesai,
        keterangan: input.keterangan,
        lokasi: input.lokasi || null,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapRow(data);
  }

  async remove(id: string): Promise<void> {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");

    const { error } = await client.from("blokir_waktu").delete().eq("id", Number(id));
    if (error) throw new Error(error.message);
  }
}
