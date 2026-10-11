import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export type DosenRecord = {
  id: string;
  nama: string;
  nidn: string;
  email: string;
  status: "aktif" | "nonaktif";
  jabatan: string;
};

const fallbackDosen: DosenRecord[] = [
  {
    id: "dosen-001",
    nama: "Dr. Siti Aminah",
    nidn: "1987001",
    email: "siti.aminah@campus.ac.id",
    status: "aktif",
    jabatan: "Dosen Pembimbing",
  },
  {
    id: "dosen-002",
    nama: "Budi Santoso, M.Kom",
    nidn: "1987002",
    email: "budi.santoso@campus.ac.id",
    status: "aktif",
    jabatan: "Dosen Penguji",
  },
];

function isMissingTableError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    error.message?.toLowerCase().includes("could not find the table") ||
    error.message?.toLowerCase().includes("schema cache")
  );
}

export class DosenRepository {
  private getServiceClient() {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return null;
    }

    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  async list(): Promise<DosenRecord[]> {
    const client = this.getServiceClient();

    if (!client) {
      return fallbackDosen;
    }

    const { data, error } = await client.from("dosen").select("*").order("nama");

    if (error) {
      if (isMissingTableError(error)) {
        return fallbackDosen;
      }

      throw new Error(error.message);
    }

    return (data ?? []).map((row) => ({
      id: String(row.id),
      nama: row.nama,
      nidn: row.nip ?? "",
      email: row.email ?? "",
      status: row.status === "nonaktif" ? "nonaktif" : "aktif",
      jabatan: row.bidang ?? "Dosen",
    }));
  }

  async findById(id: string): Promise<DosenRecord | null> {
    const client = this.getServiceClient();

    if (!client) {
      return fallbackDosen.find((item) => item.id === id) ?? null;
    }

    const query = client.from("dosen").select("*");

    if (!Number.isNaN(Number(id))) {
      query.eq("id", Number(id));
    } else {
      query.eq("nip", id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      if (isMissingTableError(error)) {
        return fallbackDosen.find((item) => item.id === id) ?? null;
      }

      if (error.code !== "PGRST116") {
        throw new Error(error.message);
      }
    }

    if (!data) {
      return null;
    }

    return {
      id: String(data.id),
      nama: data.nama,
      nidn: data.nip ?? "",
      email: data.email ?? "",
      status: data.status === "nonaktif" ? "nonaktif" : "aktif",
      jabatan: data.bidang ?? "Dosen",
    };
  }
}
