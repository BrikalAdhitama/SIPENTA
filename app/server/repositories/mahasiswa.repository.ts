import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export type MahasiswaRecord = {
  id: string;
  nama: string;
  nim: string;
  email: string;
  angkatan: string;
  programStudi: string;
  status: "aktif" | "nonaktif";
};

const fallbackMahasiswa: MahasiswaRecord[] = [
  {
    id: "mhs-001",
    nama: "Andi Pratama",
    nim: "220001",
    email: "andi.pratama@student.ac.id",
    angkatan: "2022",
    programStudi: "Teknik Informatika",
    status: "aktif",
  },
  {
    id: "mhs-002",
    nama: "Rina Salsabila",
    nim: "220002",
    email: "rina.salsabila@student.ac.id",
    angkatan: "2022",
    programStudi: "Sistem Informasi",
    status: "aktif",
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

export class MahasiswaRepository {
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

  async list(): Promise<MahasiswaRecord[]> {
    const client = this.getServiceClient();

    if (!client) {
      return fallbackMahasiswa;
    }

    const { data, error } = await client.from("mahasiswa").select("*").order("nama");

    if (error) {
      if (isMissingTableError(error)) {
        return fallbackMahasiswa;
      }

      throw new Error(error.message);
    }

    return (data ?? []).map((row) => ({
      id: String(row.id),
      nama: row.nama,
      nim: row.nim ?? "",
      email: row.email ?? "",
      angkatan: String(row.angkatan ?? ""),
      programStudi: row.program_studi ?? row.programStudi ?? "",
      status: row.status === "nonaktif" ? "nonaktif" : "aktif",
    }));
  }

  async findById(id: string): Promise<MahasiswaRecord | null> {
    const client = this.getServiceClient();

    if (!client) {
      return fallbackMahasiswa.find((item) => item.id === id) ?? null;
    }

    const query = client.from("mahasiswa").select("*");

    if (!Number.isNaN(Number(id))) {
      query.eq("id", Number(id));
    } else {
      query.eq("nim", id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      if (isMissingTableError(error)) {
        return fallbackMahasiswa.find((item) => item.id === id) ?? null;
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
      nim: data.nim ?? "",
      email: data.email ?? "",
      angkatan: String(data.angkatan ?? ""),
      programStudi: data.program_studi ?? data.programStudi ?? "",
      status: data.status === "nonaktif" ? "nonaktif" : "aktif",
    };
  }
}
