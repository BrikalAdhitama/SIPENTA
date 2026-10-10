import { createError } from "h3";
import { ApprovalService } from "../../../services/approval.service";
import { validateApprovalId } from "../../../validators/approval.validator";
import { requireRole } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["dosen"]);
    const approvalId = Number(getRouterParam(event, "approvalId"));
    const v = validateApprovalId(approvalId);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    const body = await readBody(event);
    return await new ApprovalService().putuskan(event, approvalId, String(body?.decision ?? ""), body?.reason ? String(body.reason) : undefined);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const msg = error instanceof Error ? error.message : "Gagal submit approval.";
    const code = /FORBIDDEN|bukan/i.test(msg) ? 403 : /CONFLICT_STATE|final/i.test(msg) ? 409 : /VALIDATION|wajib/i.test(msg) ? 400 : 500;
    throw createError({ statusCode: code, statusMessage: msg });
  }
});
