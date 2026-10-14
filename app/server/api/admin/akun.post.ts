import { createError } from "h3";
import { AkunService } from "../../services/akun.service";
import { validateAkunBody } from "../../validators/akun.validator";
import { requireRole } from "../../utils/auth";

// POST /api/admin/akun — admin-only. Body: { tipe: mahasiswa|dosen, nim|nip, email, password }.
// NIP/NIM wajib sudah ada di tabel kampus (dari CSV bulk) → link profiles.
export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const body = await readBody(event);
    const v = validateAkunBody(body);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    return await new AkunService().buat({
      tipe: v.tipe, idKampus: v.idKampus, email: v.email, password: v.password,
    });
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal buat akun." });
  }
});
