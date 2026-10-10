import { BlokirWaktuRepository } from "../repositories/blokir-waktu.repository";

export class BlokirWaktuService {
  constructor(private readonly repository = new BlokirWaktuRepository()) {}

  async list(dosenId?: string) {
    const data = await this.repository.list(dosenId);
    return { success: true, data };
  }

  async create(input: Parameters<BlokirWaktuRepository["create"]>[0], caller: { role: string; dosenId: number | null }) {
    if (caller.role !== "admin" && String(caller.dosenId) !== String(input.dosenId)) {
      throw new Error("Hanya pemilik blokir atau admin yang boleh menambah.");
    }
    const data = await this.repository.create(input);
    return { success: true, data };
  }

  async remove(id: string) {
    await this.repository.remove(id);
    return { success: true, data: { id } };
  }
}
