<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Splash memeriksa onboarding dan session agar alur pembukaan aplikasi konsisten.
  navigateTo('/splash', { replace: true })
})
</script>
