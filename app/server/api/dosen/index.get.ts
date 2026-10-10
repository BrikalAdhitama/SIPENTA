import { createError } from "h3";

import { DosenService } from "../../services/dosen.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "dosen", "mahasiswa"]);

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
