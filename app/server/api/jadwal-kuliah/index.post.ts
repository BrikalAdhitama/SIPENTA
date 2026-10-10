import { createError } from "h3";
import { JadwalKuliahService } from "../../services/jadwal-kuliah.service";
import { validateJadwalBody } from "../../validators/jadwal.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["admin", "mahasiswa"]);

    const body = await readBody(event);
    const validation = validateJadwalBody(body);
    if (!validation.ok) throw createError({ statusCode: 400, statusMessage: validation.message });

    const mahasiswaId = String(body.mahasiswaId ?? profile.mahasiswa_id ?? "");
    if (!mahasiswaId) throw createError({ statusCode: 400, statusMessage: "mahasiswaId wajib diisi." });

    const service = new JadwalKuliahService();
    return await service.create(
      {
        mahasiswaId,
        mataKuliah: body.mataKuliah,
        kelas: body.kelas,
        hari: body.hari,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        ruangan: body.ruangan,
      },
      { role: profile.role, mahasiswaId: profile.mahasiswa_id ?? null }
    );
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const message = error instanceof Error ? error.message : "Gagal menambah jadwal kuliah.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
