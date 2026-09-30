import { DosenRepository } from "../repositories/dosen.repository";

export class DosenService {
  constructor(private readonly repository = new DosenRepository()) {}

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
      throw new Error("Dosen tidak ditemukan.");
    }

    return {
      success: true,
      data,
    };
  }
}
