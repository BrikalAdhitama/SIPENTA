import { createError } from "h3";

import { DosenService } from "../../services/dosen.service";

export default defineEventHandler(async () => {
  try {
    const service = new DosenService();
    return await service.list();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data dosen.";

    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
