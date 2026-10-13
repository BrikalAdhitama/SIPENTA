import { createError } from "h3";
import { SeminarService } from "../../services/seminar.service";
import { validatePembimbingSendiri, validateSeminarPatch } from "../../validators/seminar.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["admin", "mahasiswa"]);
    const id = Number(getRouterParam(event, "id"));
    if (!Number.isInteger(id) || id <= 0) throw createError({ statusCode: 400, statusMessage: "ID seminar tidak valid." });
    const body = await readBody(event);
    // Mahasiswa hanya boleh isi pembimbing miliknya sendiri.
    if (profile.role === "mahasiswa") {
      if (!profile.mahasiswa_id) throw createError({ statusCode: 403, statusMessage: "Akun belum tertaut ke data mahasiswa." });
      const v = validatePembimbingSendiri(body);
      if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
      return await new SeminarService().updateMilikSendiri(id, Number(profile.mahasiswa_id), body);
    }
    const v = validateSeminarPatch(body);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    return await new SeminarService().update(id, body);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal ubah seminar." });
  }
});
