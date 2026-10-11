import { createError } from "h3";

import { RuanganService } from "../../services/ruangan.service";
import { validateRuanganId } from "../../validators/ruangan.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "dosen", "mahasiswa"]);

    const id = getRouterParam(event, "id");
    const validation = validateRuanganId(id);

    if (!validation.ok) {
      throw createError({
        statusCode: 400,
        statusMessage: validation.message,
      });
    }

    const service = new RuanganService();
    return await service.getById(id as string);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Gagal mengambil detail ruangan.";

    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
