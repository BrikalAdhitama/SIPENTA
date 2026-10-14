import { createError } from "h3";
import { RuanganService } from "../../services/ruangan.service";
import { validateRuanganId } from "../../validators/ruangan.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const id = getRouterParam(event, "id");
    const v = validateRuanganId(id);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: (v as any).message });
    return await new RuanganService().remove(id as string);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal hapus ruangan." });
  }
});
