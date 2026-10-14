import { createError } from "h3";
import { MahasiswaService } from "../../services/mahasiswa.service";
import { validateMahasiswaBody } from "../../validators/mahasiswa.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const body = await readBody(event);
    const v = validateMahasiswaBody(body);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    return await new MahasiswaService().create(body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal tambah mahasiswa." });
  }
});
