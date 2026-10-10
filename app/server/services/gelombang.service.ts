import { GelombangRepository } from "../repositories/gelombang.repository";

const JENIS_DARI_FE: Record<string, string> = { sempro: "seminar_proposal", semhas: "seminar_hasil" };

export class GelombangService {
  constructor(private readonly repo = new GelombangRepository()) {}

  async list() {
    const data = await this.repo.list();
    return { success: true, data };
  }

  async create(input: {
    nama: string; jenis: string; tanggalMulai: string; tanggalSelesai: string;
    hari: string[]; jamMulai: string; jamSelesai: string; ruangan: string[];
  }) {
    const data = await this.repo.create({
      nama: input.nama,
      jenis: JENIS_DARI_FE[input.jenis] ?? input.jenis,
      periode_label: `${input.tanggalMulai} - ${input.tanggalSelesai}`,
      tanggal_mulai: input.tanggalMulai,
      tanggal_selesai: input.tanggalSelesai,
      hari_aktif: input.hari.map((h) => h.toLowerCase()),
      jam_operasional_mulai: input.jamMulai,
      jam_operasional_selesai: input.jamSelesai,
      jeda_menit: 10,
      kuota_maks: 15,
      ruangan_aktif: input.ruangan,
      status: "siap_generate",
    });
    return { success: true, data };
  }
}
