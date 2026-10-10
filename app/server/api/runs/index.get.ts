import { createError } from "h3";
import { ApprovalService } from "../../services/approval.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin", "dosen", "mahasiswa"]);
    const query = getQuery(event);
    const gelombangId = typeof query.gelombang_id === "string" ? Number(query.gelombang_id) : undefined;
    return await new ApprovalService().runs(gelombangId);
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal ambil run." });
  }
});
