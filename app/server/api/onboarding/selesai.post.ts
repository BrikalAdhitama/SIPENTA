import { createError } from "h3";
import { OnboardingService } from "../../services/onboarding.service";
import { requireRole } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireRole(event, ["dosen", "mahasiswa"]);
    const body = await readBody(event).catch(() => ({}));
    const tidakAda = body?.tidak_ada === true || body?.tidakAda === true;
    return await new OnboardingService().selesaikan(event, tidakAda);
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    const msg = error instanceof Error ? error.message : "Gagal selesaikan onboarding.";
    const code = /belum diisi/i.test(msg) ? 400 : 500;
    throw createError({ statusCode: code, statusMessage: msg });
  }
});
