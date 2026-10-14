import { createError } from "h3";
import { OnboardingService } from "../../services/onboarding.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["dosen", "mahasiswa"]);
    return await new OnboardingService().status(event);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 500, statusMessage: error instanceof Error ? error.message : "Gagal cek onboarding." });
  }
});
