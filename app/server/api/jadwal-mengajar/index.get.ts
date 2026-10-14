import { createError } from "h3";
import { JadwalMengajarService } from "../../services/jadwal-mengajar.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "dosen", "mahasiswa"]);

    const query = getQuery(event);
    const dosenId = typeof query.dosen_id === "string" ? query.dosen_id : undefined;
    const lim = Math.min(Math.max(Number(query.limit) || 200, 1), 500);

    const service = new JadwalMengajarService();
    return await service.list(dosenId, lim);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil jadwal mengajar.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
