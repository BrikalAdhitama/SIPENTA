<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const { akun, dashboardPath } = useAuth()

onMounted(() => {
  // sudah login → dashboard sesuai role; belum → halaman splash (nanti ke onboarding lalu login)
  navigateTo(akun.value ? dashboardPath(akun.value.role) : '/splash', { replace: true })
})
</script>
