import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export class GelombangRepository {
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
    const c = this.getServiceClient();
    if (!c) throw new Error("Konfigurasi Supabase belum lengkap.");
    return c;
  }

  async list() {
    const { data, error } = await this.client().from("gelombang")
      .select("id,nama,jenis,status,tanggal_mulai,tanggal_selesai")
      .order("id", { ascending: false }).limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async create(row: Record<string, unknown>) {
    const { data, error } = await this.client().from("gelombang").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return data;
  }
}
