import { createError } from "h3";
import { JadwalKuliahService } from "../../services/jadwal-kuliah.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "mahasiswa"]);

    const id = getRouterParam(event, "id");
    if (!id) throw createError({ statusCode: 400, statusMessage: "ID wajib diisi." });

    const service = new JadwalKuliahService();
    return await service.remove(id);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const message = error instanceof Error ? error.message : "Gagal menghapus jadwal kuliah.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
