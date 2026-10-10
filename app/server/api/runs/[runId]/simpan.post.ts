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
    return await new ApprovalService().simpan(runId);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const msg = error instanceof Error ? error.message : "Gagal simpan run.";
    throw createError({ statusCode: msg.includes("berstatus") ? 409 : 500, statusMessage: msg });
  }
});
