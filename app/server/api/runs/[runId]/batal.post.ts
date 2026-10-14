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
    const body = await readBody(event);
    return await new ApprovalService().batal(event, runId, String(body?.alasan ?? ""));
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal batalkan." });
  }
});
