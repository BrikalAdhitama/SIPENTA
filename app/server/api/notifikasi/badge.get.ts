import { createError } from "h3";
import { NotifikasiService } from "../../services/notifikasi.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireRole(event, ["admin", "dosen", "mahasiswa"]);
    return await new NotifikasiService().badge(user.id);
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal hitung notifikasi." });
  }
});
