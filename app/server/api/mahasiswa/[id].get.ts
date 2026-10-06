import { createError } from "h3";

import { MahasiswaService } from "../../services/mahasiswa.service";
import { validateMahasiswaId } from "../../validators/mahasiswa.validator";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const validation = validateMahasiswaId(id);

    if (!validation.ok) {
      throw createError({
        statusCode: 400,
        statusMessage: validation.message,
      });
    }

    const service = new MahasiswaService();
    return await service.getById(id as string);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Gagal mengambil detail mahasiswa.";

    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
