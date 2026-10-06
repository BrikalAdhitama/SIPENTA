import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export type RuanganRecord = {
  id: string;
  nama: string;
  lantai: number;
  gedung: string;
  isOnline: boolean;
  tipe: "kelas" | "lab" | "seminar";
  status: "aktif" | "maintenance";
};

const fallbackRuangan: RuanganRecord[] = [
  {
    id: "rg-001",
    nama: "R.201",
    lantai: 2,
    gedung: "F",
    isOnline: false,
    tipe: "kelas",
    status: "aktif",
  },
  {
    id: "rg-002",
    nama: "Lab Multimedia",
    lantai: 3,
    gedung: "F",
    isOnline: false,
    tipe: "lab",
    status: "aktif",
  },
  {
    id: "rg-003",
    nama: "Auditorium",
    lantai: 1,
    gedung: "A",
    isOnline: false,
    tipe: "seminar",
    status: "aktif",
  },
  {
    id: "rg-online",
    nama: "Seminar Online",
    lantai: 0,
    gedung: "",
    isOnline: true,
    tipe: "seminar",
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

function mapRuangan(row: {
  id: number;
  nama: string;
  lantai: number | null;
  gedung: string | null;
  is_online: boolean;
  status: "aktif" | "nonaktif";
}): RuanganRecord {
  return {
    id: String(row.id),
    nama: row.nama,
    lantai: Number(row.lantai ?? 0),
    gedung: row.gedung ?? "",
    isOnline: Boolean(row.is_online),
    tipe: row.is_online
      ? "seminar"
      : row.nama.toLowerCase().includes("lab")
        ? "lab"
        : "kelas",
    status: row.status === "nonaktif" ? "maintenance" : "aktif",
  };
}

export class RuanganRepository {
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

  async list(): Promise<RuanganRecord[]> {
    const client = this.getServiceClient();

    if (!client) {
      return fallbackRuangan;
    }

    const { data, error } = await client.from("ruangan").select("*").order("nama");

    if (error) {
      if (isMissingTableError(error)) {
        return fallbackRuangan;
      }

      throw new Error(error.message);
    }

    return (data ?? []).map(mapRuangan);
  }

  async findById(id: string): Promise<RuanganRecord | null> {
    const client = this.getServiceClient();

    if (!client) {
      return fallbackRuangan.find((item) => item.id === id) ?? null;
    }

    const query = client.from("ruangan").select("*");

    if (!Number.isNaN(Number(id))) {
      query.eq("id", Number(id));
    } else {
      query.eq("kode", id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      if (isMissingTableError(error)) {
        return fallbackRuangan.find((item) => item.id === id) ?? null;
      }

      if (error.code !== "PGRST116") {
        throw new Error(error.message);
      }
    }

    if (!data) {
      return null;
    }

    return mapRuangan(data);
  }
}
