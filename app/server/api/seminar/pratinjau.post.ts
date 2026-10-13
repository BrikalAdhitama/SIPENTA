import { createError } from "h3";
import { SeminarService } from "../../services/seminar.service";
import { requireRole } from "../../utils/auth";

// POST /api/seminar/pratinjau — admin-only, read-only. Body: { csv } / { rows }.
// Kembalikan [{ nim, namaCsv, namaDb, status: cocok|baru|beda-nama, punyaAkun, duplikat }].
// Tanpa tulis ke DB. Dipakai Step 2 Preview & Validasi sebelum bulk simpan.
export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const body = await readBody(event);
    if (typeof body?.csv !== "string" && !Array.isArray(body?.rows) && !Array.isArray(body?.seminar)) {
      throw createError({ statusCode: 400, statusMessage: "Kirim csv mentah atau rows." });
    }
    return await new SeminarService().pratinjau(body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal pratinjau seminar." });
  }
});
