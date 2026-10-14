import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

// Satu-satunya query notification. Tulis via trigger DB (definer).
// Ganti DB = ganti file ini.
export class NotifikasiRepository {
  private serviceClient() {
    const config = useRuntimeConfig();
    const url = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const key = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Konfigurasi Supabase belum lengkap.");
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  async list(userId: string, belumDibaca?: boolean) {
    let q = this.serviceClient().from("notification").select("*")
      .eq("user_id", userId).order("created_at", { ascending: false }).limit(30);
    if (belumDibaca) q = q.eq("dibaca", false);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async hitungBelumDibaca(userId: string) {
    const { count, error } = await this.serviceClient().from("notification")
      .select("id", { count: "exact", head: true }).eq("user_id", userId).eq("dibaca", false);
    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  async tandaiDibaca(userId: string, id: number) {
    const { data, error } = await this.serviceClient().from("notification")
      .update({ dibaca: true }).eq("id", id).eq("user_id", userId).select("id,dibaca").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Notifikasi tidak ditemukan.");
    return data;
  }

  async tandaiSemuaDibaca(userId: string) {
    const { error } = await this.serviceClient().from("notification")
      .update({ dibaca: true }).eq("user_id", userId).eq("dibaca", false);
    if (error) throw new Error(error.message);
    return { dibaca_semua: true };
  }
}
