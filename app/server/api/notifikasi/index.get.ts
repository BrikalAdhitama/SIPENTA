import { createError } from "h3";
import { NotifikasiService } from "../../services/notifikasi.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireRole(event, ["admin", "dosen", "mahasiswa"]);
    const query = getQuery(event);
    const belum = query.belum_dibaca === "true";
    return await new NotifikasiService().list(user.id, belum || undefined);
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal ambil notifikasi." });
  }
});
