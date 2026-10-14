import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

// Satu-satunya tulis akun. Admin buat auth.user + profiles terlink NIM/NIP.
// Ganti DB = ganti file ini.
export class AkunRepository {
  private client() {
    const config = useRuntimeConfig();
    const url = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const key = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Konfigurasi Supabase belum lengkap.");
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  async cariMahasiswa(nim: string) {
    const { data, error } = await this.client().from("mahasiswa")
      .select("id,nim,nama").eq("nim", nim).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async cariDosen(nip: string) {
    const { data, error } = await this.client().from("dosen")
      .select("id,nip,nama").eq("nip", nip).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async sudahTerhubung(kolom: "mahasiswa_id" | "dosen_id", id: number) {
    const { data, error } = await this.client().from("profiles")
      .select("id").eq(kolom, id).maybeSingle();
    if (error) throw new Error(error.message);
    return !!data;
  }

  async buatAkun(input: { email: string; password: string; nama: string; role: string; mahasiswa_id?: number; dosen_id?: number }) {
    const c = this.client();
    const { data, error } = await c.auth.admin.createUser({
      email: input.email, password: input.password, email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const uid = data.user?.id;
    if (!uid) throw new Error("Gagal buat user auth.");
    const { error: eProf } = await c.from("profiles").insert({
      id: uid, role: input.role, nama: input.nama,
      mahasiswa_id: input.mahasiswa_id ?? null,
      dosen_id: input.dosen_id ?? null,
    });
    if (eProf) {
      await c.auth.admin.deleteUser(uid);
      throw new Error(eProf.message);
    }
    return { id: uid, email: input.email, role: input.role };
  }
}
