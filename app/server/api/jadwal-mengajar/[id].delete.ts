import { createError } from "h3";
import { JadwalMengajarService } from "../../services/jadwal-mengajar.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "dosen"]);

    const id = getRouterParam(event, "id");
    if (!id) throw createError({ statusCode: 400, statusMessage: "ID wajib diisi." });

    const service = new JadwalMengajarService();
    return await service.remove(id);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const message = error instanceof Error ? error.message : "Gagal menghapus jadwal mengajar.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
