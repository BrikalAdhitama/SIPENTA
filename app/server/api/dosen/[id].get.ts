import { createError } from "h3";

import { DosenService } from "../../services/dosen.service";
import { validateDosenId } from "../../validators/dosen.validator";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const validation = validateDosenId(id);

    if (!validation.ok) {
      throw createError({
        statusCode: 400,
        statusMessage: validation.message,
      });
    }

    const service = new DosenService();
    return await service.getById(id as string);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Gagal mengambil detail dosen.";

    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
