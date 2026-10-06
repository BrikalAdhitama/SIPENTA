import { createError } from "h3";

import { MahasiswaService } from "../../services/mahasiswa.service";

export default defineEventHandler(async () => {
  try {
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
