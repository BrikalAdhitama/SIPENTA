import { createError } from "h3";
import { RuanganService } from "../../services/ruangan.service";
import { validateRuanganBody } from "../../validators/ruangan.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const body = await readBody(event);
    const v = validateRuanganBody(body);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    return await new RuanganService().create(body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal tambah ruangan." });
  }
});
