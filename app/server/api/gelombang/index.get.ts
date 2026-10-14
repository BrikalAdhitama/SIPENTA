import { createError } from "h3";
import { GelombangService } from "../../services/gelombang.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const service = new GelombangService();
    return await service.list();
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal ambil gelombang." });
  }
});
