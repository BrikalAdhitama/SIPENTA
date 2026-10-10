import { createError } from "h3";
import { GelombangService } from "../../services/gelombang.service";
import { validateGelombangBody } from "../../validators/gelombang.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const body = await readBody(event);
    const v = validateGelombangBody(body);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    const service = new GelombangService();
    return await service.create(body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal simpan gelombang." });
  }
});
