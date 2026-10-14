import { createError } from "h3";
import { ApprovalService } from "../../services/approval.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "dosen", "mahasiswa"]);
    const query = getQuery(event);
    const gelombangId = typeof query.gelombang_id === "string" ? Number(query.gelombang_id) : undefined;
    const lim = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    return await new ApprovalService().runs(gelombangId, lim);
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal ambil run." });
  }
});
