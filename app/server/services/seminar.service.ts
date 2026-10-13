import { SeminarRepository } from "../repositories/seminar.repository";

const BOLEH_TULIS = ["penguji1_id", "penguji2_id", "pembimbing_utama_id", "pembimbing_pendamping_id", "is_online", "dijadwalkan", "validasi", "judul"] as const;

const JENIS_DARI_FE: Record<string, string> = { sempro: "seminar_proposal", semhas: "seminar_hasil" };

// Parse CSV manual tanpa dep baru. Header wajib: nim,nama (opsional: judul,urutan).
// ponytail: dukung .xlsx via lib SheetJS bila prodi minta Excel beneran.
export function parseSeminarCsv(teks: string) {
  const baris = String(teks ?? "").split(/\r?\n/).map((b) => b.trim()).filter(Boolean);
  if (baris.length < 2) throw new Error("CSV minimal header + 1 baris data.");
  const head = baris[0].split(",").map((h) => h.trim().toLowerCase());
  const iNim = head.indexOf("nim");
  const iNama = head.indexOf("nama");
  if (iNim < 0 || iNama < 0) throw new Error("Header CSV wajib memuat nim,nama.");
  const iJudul = head.indexOf("judul");
  const iUrutan = head.indexOf("urutan");
  return baris.slice(1).map((b, i) => {
    const c = b.split(",").map((v) => v.trim());
    return {
      nim: c[iNim] ?? "",
      nama: c[iNama] ?? "",
      judul: iJudul >= 0 ? c[iJudul] : undefined,
      urutan_daftar: iUrutan >= 0 ? Number(c[iUrutan]) || i + 1 : i + 1,
    };
  });
}

export class SeminarService {
  constructor(private readonly repo = new SeminarRepository()) {}

  async list(gelombangId?: number, batas = 100, filter?: { mahasiswaId?: number; dosenId?: number }) {
    return { success: true, data: await this.repo.list(gelombangId, batas, filter) };
  }

  async update(id: number, body: Record<string, unknown>) {
    const row: any = await this.repo.findById(id);
    const gabung = {
      pembimbing_utama_id: body.pembimbing_utama_id ?? row?.pembimbing_utama_id,
      pembimbing_pendamping_id: body.pembimbing_pendamping_id ?? row?.pembimbing_pendamping_id,
      penguji1_id: body.penguji1_id ?? row?.penguji1_id,
      penguji2_id: body.penguji2_id ?? row?.penguji2_id,
    };
    const pb = [gabung.pembimbing_utama_id, gabung.pembimbing_pendamping_id].map(Number);
    if (pb.every((v) => Number.isInteger(v) && v > 0) && pb[0] === pb[1]) {
      throw new Error("Pembimbing 1 dan 2 harus orang berbeda.");
    }
    const keempat = [gabung.pembimbing_utama_id, gabung.pembimbing_pendamping_id, gabung.penguji1_id, gabung.penguji2_id].map(Number);
    if (keempat.every((v) => Number.isInteger(v) && v > 0) && new Set(keempat).size !== 4) {
      throw new Error("Keempat dosen harus orang berbeda.");
    }
    const patch: Record<string, unknown> = {};
    for (const k of BOLEH_TULIS) {
      if (body[k] !== undefined) patch[k] = body[k];
    }
    return { success: true, data: await this.repo.update(id, patch) };
  }

  // Mahasiswa isi pembimbing miliknya sendiri. Bukan admin: kunci kepemilikan di sini
  // karena repo pakai service-role (lolos RLS).
  async updateMilikSendiri(id: number, mahasiswaId: number, body: Record<string, unknown>) {
    const row: any = await this.repo.findById(id);
    if (!row) throw new Error("Seminar tidak ditemukan.");
    if (Number(row.mahasiswa_id) !== Number(mahasiswaId)) throw new Error("Bukan seminar milik Anda.");
    const p1 = body.pembimbing_utama_id ?? row?.pembimbing_utama_id;
    const p2 = body.pembimbing_pendamping_id ?? row?.pembimbing_pendamping_id;
    if (Number.isInteger(Number(p1)) && Number(p1) > 0 && Number(p1) === Number(p2)) {
      throw new Error("Pembimbing 1 dan 2 harus orang berbeda.");
    }
    const patch: Record<string, unknown> = {};
    for (const k of ["pembimbing_utama_id", "pembimbing_pendamping_id", "judul"] as const) {
      if (body[k] !== undefined) patch[k] = k === "judul" ? String(body[k]).trim() : body[k];
    }
    return { success: true, data: await this.repo.update(id, patch) };
  }

  async pratinjau(body: { csv?: string; rows?: Array<Record<string, any>>; seminar?: Array<Record<string, any>> }) {
    const rows = body.seminar ?? body.rows ?? (body.csv ? parseSeminarCsv(body.csv) : []);
    if (!rows.length) throw new Error("Tidak ada baris untuk dipratinjau.");
    return { success: true, data: await this.repo.pratinjau(rows) };
  }

  async createBulk(body: { gelombang_id?: number; gelombangId?: number; jenis?: string; seminar?: Array<Record<string, any>>; rows?: Array<Record<string, any>>; csv?: string }) {
    const gelombangId = Number(body.gelombang_id ?? body.gelombangId);
    const rows = body.seminar ?? body.rows ?? (body.csv ? parseSeminarCsv(body.csv) : []);
    const jenis = JENIS_DARI_FE[String(body.jenis ?? "")] ?? String(body.jenis ?? "seminar_proposal");
    const hasil = await this.repo.upsertBulk(gelombangId, jenis, rows);
    // hasil: { ids, cocok, baru, punyaAkun, butuhAkun } — NIM cocok pakai mahasiswa_id lama,
    // jadi akun lama otomatis lihat seminar ini. butuhAkun = NIM tanpa profiles.
    return { success: true, data: hasil.ids, tersimpan: hasil.ids.length, ...hasil };
  }
}
