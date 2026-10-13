import { createError } from "h3";
import { SeminarService } from "../../services/seminar.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["admin", "dosen", "mahasiswa"]);
    const query = getQuery(event);
    const g = query.gelombang_id ? Number(query.gelombang_id) : undefined;
    if (query.gelombang_id && (!Number.isInteger(g) || (g as number) <= 0)) {
      throw createError({ statusCode: 400, statusMessage: "gelombang_id tidak valid." });
    }
    const lim = Math.min(Math.max(Number(query.limit) || 100, 1), 200);
    // Milik-sendiri: mahasiswa → seminarnya saja, dosen → yang ia uji/bimbing.
    // Admin → semua. Repo service-role lolos RLS, filter di sini pengganti policy.
    const filter = profile.role === "mahasiswa" && profile.mahasiswa_id
      ? { mahasiswaId: Number(profile.mahasiswa_id) }
      : profile.role === "dosen" && profile.dosen_id
        ? { dosenId: Number(profile.dosen_id) }
        : undefined;
    return await new SeminarService().list(g, lim, filter);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal ambil seminar." });
  }
});
