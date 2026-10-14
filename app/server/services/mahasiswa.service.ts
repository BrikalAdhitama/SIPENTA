import { MahasiswaRepository } from "../repositories/mahasiswa.repository";

export class MahasiswaService {
  constructor(private readonly repository = new MahasiswaRepository()) {}

  async list(batas = 100) {
    const data = await this.repository.list(batas);

    return {
      success: true,
      data,
    };
  }

  async getById(id: string) {
    const data = await this.repository.findById(id);

    if (!data) {
      throw new Error("Mahasiswa tidak ditemukan.");
    }

    return {
      success: true,
      data,
    };
  }

  async create(body: { nim: string; nama?: string; name?: string; angkatan?: string }) {
    const data = await this.repository.create({
      nim: String(body.nim).trim(),
      nama: String(body.nama ?? body.name ?? "").trim(),
      angkatan: body.angkatan ? String(body.angkatan).trim() : undefined,
    });
    return { success: true, data };
  }
}
