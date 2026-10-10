import { createError } from "h3";
import { BlokirWaktuService } from "../../services/blokir-waktu.service";
import { validateBlokirBody } from "../../validators/jadwal.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["admin", "dosen"]);

    const body = await readBody(event);
    const validation = validateBlokirBody(body);
    if (!validation.ok) throw createError({ statusCode: 400, statusMessage: validation.message });

    const dosenId = String(body.dosenId ?? profile.dosen_id ?? "");
    if (!dosenId) throw createError({ statusCode: 400, statusMessage: "dosenId wajib diisi." });

    const service = new BlokirWaktuService();
    return await service.create(
      {
        dosenId,
        hari: body.hari,
        tanggal: body.tanggal,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        keterangan: body.keterangan,
        lokasi: body.lokasi ?? "",
      },
      { role: profile.role, dosenId: profile.dosen_id ?? null }
    );
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const message = error instanceof Error ? error.message : "Gagal menambah blokir waktu.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
