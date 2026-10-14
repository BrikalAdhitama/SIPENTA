import { createError } from "h3";
import { DosenService } from "../../services/dosen.service";
import { validateDosenBody } from "../../validators/dosen.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const body = await readBody(event);
    const v = validateDosenBody(body);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    return await new DosenService().create(body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal tambah dosen." });
  }
});
