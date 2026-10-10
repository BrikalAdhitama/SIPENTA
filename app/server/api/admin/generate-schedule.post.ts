import { createError } from "h3";
import { GenerateService } from "../../services/generate.service";
import { validateGenerateBody } from "../../validators/generate.validator";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireRole(event, ["admin"]);

    const body = await readBody(event);
    const validation = validateGenerateBody(body);
    if (!validation.ok) throw createError({ statusCode: 400, statusMessage: validation.message });

    const service = new GenerateService();
    return await service.generate(body.gelombangId, body.gaParams, user.id);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const message = error instanceof Error ? error.message : "Gagal generate jadwal.";
    const code = message.includes("AI service") || message.includes("AI_SERVICE")
      ? 502
      : message.includes("berstatus") || message.includes("belum")
        ? 409
        : 500;
    throw createError({ statusCode: code, statusMessage: message });
  }
});
