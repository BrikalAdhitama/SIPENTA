import { RuanganRepository } from "../repositories/ruangan.repository";

export class RuanganService {
  constructor(private readonly repository = new RuanganRepository()) {}

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
      throw new Error("Ruangan tidak ditemukan.");
    }

    return {
      success: true,
      data,
    };
  }

  async create(body: { kode?: string; nama?: string; name?: string; lantai?: number | null; gedung?: string | null; is_online?: boolean }) {
    const nama = String(body.nama ?? body.name ?? "").trim();
    const kode = String(body.kode ?? nama).trim().toUpperCase().replace(/\s+/g, "-");
    const data = await this.repository.create({
      kode,
      nama,
      lantai: body.lantai ?? null,
      gedung: body.gedung ? String(body.gedung) : null,
      is_online: Boolean(body.is_online ?? false),
    });
    return { success: true, data };
  }

  async update(id: string, body: Record<string, unknown>) {
    const patch: Record<string, unknown> = {};
    if (body.kode !== undefined) patch.kode = String(body.kode).trim().toUpperCase().replace(/\s+/g, "-");
    if (body.nama !== undefined || body.name !== undefined) patch.nama = String(body.nama ?? body.name ?? "").trim();
    if (body.lantai !== undefined) patch.lantai = body.lantai === null || body.lantai === "" ? null : Number(body.lantai);
    if (body.gedung !== undefined) patch.gedung = body.gedung === null || body.gedung === "" ? null : String(body.gedung);
    if (body.is_online !== undefined) patch.is_online = Boolean(body.is_online);
    if (body.status !== undefined) patch.status = body.status;
    const data = await this.repository.update(id, patch);
    return { success: true, data };
  }

  async remove(id: string) {
    await this.repository.remove(id);
    return { success: true, data: { id } };
  }
}
