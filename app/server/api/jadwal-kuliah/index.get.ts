import { createError } from "h3";
import { JadwalKuliahService } from "../../services/jadwal-kuliah.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["admin", "dosen", "mahasiswa"]);

    const query = getQuery(event);
    const mahasiswaId =
      typeof query.mahasiswa_id === "string"
        ? query.mahasiswa_id
        : profile.role === "mahasiswa"
          ? String(profile.mahasiswa_id ?? "")
          : undefined;

    const service = new JadwalKuliahService();
    return await service.list(mahasiswaId || undefined);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil jadwal kuliah.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
