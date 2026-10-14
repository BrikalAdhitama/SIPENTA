import { createError } from "h3";
import { NotifikasiService } from "../../../services/notifikasi.service";
import { requireRole } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireRole(event, ["admin", "dosen", "mahasiswa"]);
    const id = Number(getRouterParam(event, "id"));
    if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: "ID notifikasi tidak valid." });
    return await new NotifikasiService().baca(user.id, id);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal tandai dibaca." });
  }
});
