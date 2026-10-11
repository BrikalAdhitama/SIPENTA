import { RuanganRepository } from "../repositories/ruangan.repository";

export class RuanganService {
  constructor(private readonly repository = new RuanganRepository()) {}

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
      throw new Error("Ruangan tidak ditemukan.");
    }

    return {
      success: true,
      data,
    };
  }
}
