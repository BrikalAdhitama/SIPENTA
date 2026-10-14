import { DosenRepository } from "../repositories/dosen.repository";

export class DosenService {
  constructor(private readonly repository = new DosenRepository()) {}

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
      throw new Error("Dosen tidak ditemukan.");
    }

    return {
      success: true,
      data,
    };
  }

  async create(body: { nip: string; nama?: string; name?: string; bidang?: string; keahlian?: string }) {
    const data = await this.repository.create({
      nip: String(body.nip).trim(),
      nama: String(body.nama ?? body.name ?? "").trim(),
      bidang: String(body.bidang ?? body.keahlian ?? "").trim(),
    });
    return { success: true, data };
  }
}
