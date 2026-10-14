import { createError } from "h3";
import { ApprovalService } from "../../../services/approval.service";
import { validateRunId } from "../../../validators/approval.validator";
import { requireRole } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["admin"]);
    const runId = Number(getRouterParam(event, "runId"));
    const v = validateRunId(runId);
    if (!v.ok) throw createError({ statusCode: 400, statusMessage: v.message });
    const body = await readBody(event).catch(() => ({}));
    return await new ApprovalService().finalisasi(event, runId);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const msg = error instanceof Error ? error.message : "Gagal finalisasi.";
    const code = /CONFLICT_STATE|4\/4|belum|berstatus/i.test(msg) ? 409 : /FORBIDDEN/i.test(msg) ? 403 : 500;
    throw createError({ statusCode: code, statusMessage: msg });
  }
});
