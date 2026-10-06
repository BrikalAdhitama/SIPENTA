import { MahasiswaRepository } from "../repositories/mahasiswa.repository";

export class MahasiswaService {
  constructor(private readonly repository = new MahasiswaRepository()) {}

  async list() {
    const data = await this.repository.list();

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
}
