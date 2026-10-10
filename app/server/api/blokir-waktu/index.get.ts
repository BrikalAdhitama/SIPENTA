import { createError } from "h3";
import { BlokirWaktuService } from "../../services/blokir-waktu.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["admin", "dosen"]);

    const query = getQuery(event);
    const dosenId =
      typeof query.dosen_id === "string" ? query.dosen_id : String(profile.dosen_id ?? "");

    const service = new BlokirWaktuService();
    return await service.list(dosenId || undefined);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil blokir waktu.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
