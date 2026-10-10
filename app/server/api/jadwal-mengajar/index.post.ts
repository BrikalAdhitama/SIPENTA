import { createError } from "h3";
import { JadwalMengajarService } from "../../services/jadwal-mengajar.service";
import { validateJadwalBody } from "../../validators/jadwal.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["admin", "dosen"]);

    const body = await readBody(event);
    const validation = validateJadwalBody(body);
    if (!validation.ok) throw createError({ statusCode: 400, statusMessage: validation.message });

    const dosenId = String(body.dosenId ?? profile.dosen_id ?? "");
    if (!dosenId) throw createError({ statusCode: 400, statusMessage: "dosenId wajib diisi." });

    const service = new JadwalMengajarService();
    return await service.create(
      {
        dosenId,
        mataKuliah: body.mataKuliah,
        kelas: body.kelas,
        hari: body.hari,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        ruangan: body.ruangan,
      },
      { role: profile.role, dosenId: profile.dosen_id ?? null }
    );
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const message = error instanceof Error ? error.message : "Gagal menambah jadwal mengajar.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
