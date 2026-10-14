import { OnboardingRepository } from "../repositories/onboarding.repository";

export class OnboardingService {
  constructor(private readonly repo = new OnboardingRepository()) {}

  async selesaikan(event: any, tidakAda?: boolean) {
    return { success: true, data: await this.repo.rpcSelesai(event, Boolean(tidakAda)) };
  }

  async status(event: any) {
    return { success: true, data: await this.repo.status(event) };
  }
}
