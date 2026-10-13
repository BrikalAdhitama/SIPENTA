import { createError } from "h3";

import { DosenService } from "../../services/dosen.service";

export default defineEventHandler(async () => {
  try {
    const service = new DosenService();
    const lim = Math.min(Math.max(Number(getQuery(event).limit) || 100, 1), 200);
    return await service.list(lim);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data dosen.";

    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
