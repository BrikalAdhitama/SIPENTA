import { createError } from "h3";

import { MahasiswaService } from "../../services/mahasiswa.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "dosen", "mahasiswa"]);

    const service = new MahasiswaService();
    return await service.list();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data mahasiswa.";

    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
