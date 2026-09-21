<template>
  <AdminMobileDashboardMobile />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'

const router = useRouter()

onMounted(() => {
  // Hanya jalankan di sisi klien (browser/aplikasi)
  if (import.meta.client) {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')

    if (!hasSeenOnboarding) {
      // Jika dibuka di aplikasi Native (Capacitor) atau layar kecil (Mobile Web)
      if (Capacitor.isNativePlatform() || window.innerWidth < 768) {
        // Arahkan ke Splash Screen dulu (nanti splash otomatis ke onboarding)
        router.push('/splash')
      }
    }
  }
})
</script>
