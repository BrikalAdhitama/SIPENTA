import { JadwalKuliahRepository } from "../repositories/jadwal-kuliah.repository";

export class JadwalKuliahService {
  constructor(private readonly repository = new JadwalKuliahRepository()) {}

  async list(mahasiswaId?: string) {
    const data = await this.repository.list(mahasiswaId);
    return { success: true, data };
  }

  async create(input: Parameters<JadwalKuliahRepository["create"]>[0], caller: { role: string; mahasiswaId: number | null }) {
    if (caller.role !== "admin" && String(caller.mahasiswaId) !== String(input.mahasiswaId)) {
      throw new Error("Hanya pemilik jadwal atau admin yang boleh menambah.");
    }
    const data = await this.repository.create(input);
    return { success: true, data };
  }

  async remove(id: string) {
    await this.repository.remove(id);
    return { success: true, data: { id } };
  }
}
