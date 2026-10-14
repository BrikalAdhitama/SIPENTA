import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

export type RuanganRecord = {
  id: string;
  kode: string;
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
    kode: "R201",
    nama: "R.201",
    lantai: 2,
    gedung: "F",
    isOnline: false,
    tipe: "kelas",
    status: "aktif",
  },
  {
    id: "rg-002",
    kode: "LAB-MULTI",
    nama: "Lab Multimedia",
    lantai: 3,
    gedung: "F",
    isOnline: false,
    tipe: "lab",
    status: "aktif",
  },
  {
    id: "rg-003",
    kode: "AUDITORIUM",
    nama: "Auditorium",
    lantai: 1,
    gedung: "A",
    isOnline: false,
    tipe: "seminar",
    status: "aktif",
  },
  {
    id: "rg-online",
    kode: "ONLINE",
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
  kode: string;
  nama: string;
  lantai: number | null;
  gedung: string | null;
  is_online: boolean;
  status: "aktif" | "nonaktif";
}): RuanganRecord {
  return {
    id: String(row.id),
    kode: row.kode,
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

  async list(batas = 100): Promise<RuanganRecord[]> {
    const client = this.getServiceClient();

    if (!client) {
      return fallbackRuangan;
    }

    const { data, error } = await client.from("ruangan").select("*").order("nama").limit(batas);

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

  async create(row: { kode: string; nama: string; lantai?: number | null; gedung?: string | null; is_online?: boolean }) {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");
    const { data, error } = await client.from("ruangan").insert(row).select("id").single();
    if (error) {
      if ((error as any).code === "23505") throw new Error(`Kode ${row.kode} sudah dipakai.`);
      throw new Error(error.message);
    }
    return data;
  }

  async update(id: string, patch: { kode?: string; nama?: string; lantai?: number | null; gedung?: string | null; is_online?: boolean; status?: "aktif" | "nonaktif" }) {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");
    const isId = !Number.isNaN(Number(id));
    const q = client.from("ruangan").update(patch).eq(isId ? "id" : "kode", isId ? Number(id) : id);
    const { data, error } = await q.select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Ruangan tidak ditemukan.");
    return data[0];
  }

  async remove(id: string) {
    const client = this.getServiceClient();
    if (!client) throw new Error("Konfigurasi Supabase belum lengkap.");
    const isId = !Number.isNaN(Number(id));
    const q = client.from("ruangan").delete().eq(isId ? "id" : "kode", isId ? Number(id) : id);
    const { data, error } = await q.select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Ruangan tidak ditemukan.");
  }
}
