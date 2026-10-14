import { NotifikasiRepository } from "../repositories/notifikasi.repository";

export class NotifikasiService {
  constructor(private readonly repo = new NotifikasiRepository()) {}

  async list(userId: string, belumDibaca?: boolean) {
    return { success: true, data: await this.repo.list(userId, belumDibaca) };
  }

  async badge(userId: string) {
    return { success: true, data: { belum_dibaca: await this.repo.hitungBelumDibaca(userId) } };
  }

  async baca(userId: string, id: number) {
    return { success: true, data: await this.repo.tandaiDibaca(userId, id) };
  }

  async bacaSemua(userId: string) {
    return { success: true, data: await this.repo.tandaiSemuaDibaca(userId) };
  }
}
