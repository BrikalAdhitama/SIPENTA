import { createError } from "h3";
import { ApprovalService } from "../../services/approval.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { profile } = await requireRole(event, ["dosen", "mahasiswa"]);
    return await new ApprovalService().milikSaya({
      role: (profile as any).role,
      dosenId: (profile as any).dosen_id ?? null,
      mahasiswaId: (profile as any).mahasiswa_id ?? null,
    });
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal ambil approval." });
  }
});
