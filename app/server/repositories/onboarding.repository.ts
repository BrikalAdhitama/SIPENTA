import { serverSupabaseClient } from "#supabase/server";

// Satu-satunya pemanggil RPC selesai_onboarding. Pakai user-client agar auth.uid() terisi.
// Ganti DB = ganti file ini.
export class OnboardingRepository {
  async rpcSelesai(event: any, tidakAda: boolean) {
    const userClient: any = await serverSupabaseClient(event);
    const { data, error } = await userClient.rpc("selesai_onboarding", { p_tidak_ada: tidakAda });
    if (error) throw new Error(error.message);
    return data;
  }

  async status(event: any) {
    const userClient: any = await serverSupabaseClient(event);
    const { data, error } = await userClient.from("profiles").select("role, onboarding_at").single();
    if (error) throw new Error(error.message);
    return data;
  }
}
