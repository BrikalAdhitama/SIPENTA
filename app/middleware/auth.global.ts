export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return

  const publicRoutes = ['/splash', '/onboarding', '/login']
  const isProtectedRoute = ['/admin', '/dosen', '/mahasiswa'].some(prefix =>
    to.path === prefix || to.path.startsWith(`${prefix}/`)
  )
  const { akun, dashboardPath } = useAuth()

  if (akun.value && (to.path === '/login' || to.path === '/onboarding')) {
    return navigateTo(dashboardPath(akun.value.role), { replace: true })
  }

  if (!isProtectedRoute || publicRoutes.includes(to.path)) return

  if (!akun.value) {
    return navigateTo('/splash', { replace: true })
  }

  const rolePrefix = `/${akun.value.role}`
  if (!to.path.startsWith(rolePrefix)) {
    return navigateTo(dashboardPath(akun.value.role), { replace: true })
  }
})
