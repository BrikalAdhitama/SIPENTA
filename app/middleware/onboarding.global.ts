//Nunggu Supabase siap, middleware ini di-comment dulu biar ga nge-redirect ke halaman onboarding terus.
export default defineNuxtRouteMiddleware(async (to) => {/* 
  const user = useSupabaseUser();
  if (!user.value) return; // not logged in — let the supabase module's redirect handle it

  const { profile, fetchProfile, role, needsOnboarding } = useAuth();
  if (!profile.value) await fetchProfile();
  if (!profile.value) return; // profile fetch failed — avoid infinite redirect loop

  if (needsOnboarding.value) {
    const onboardingPath = `/${role.value}/onboarding`;
    if (to.path !== onboardingPath && to.path !== "/login") {
      return navigateTo(onboardingPath);
    }
  } */
});
