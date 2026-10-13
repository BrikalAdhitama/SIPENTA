import { createError } from "h3";
import { SeminarService } from "../../services/seminar.service";
import { validateSeminarBulk } from "../../validators/seminar.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const body = await readBody(event);
    const v = validateSeminarBulk(body);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    return await new SeminarService().createBulk(body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal tambah seminar." });
  }
});
