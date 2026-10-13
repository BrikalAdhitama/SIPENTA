<template>
  <div class="h-screen w-full bg-white flex flex-col items-center justify-center relative">
    <!-- Logo Container -->
    <div class="flex flex-col items-center">
      <!-- You will need to replace this link with your actual logo path (e.g., '/logo-sipenta.png') once you put it in the public folder -->
      <img src="/splash.png" alt="SIPENTA Logo" class="h-24 object-contain mb-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

// layar penuh tanpa sidebar/bottom nav
definePageMeta({ layout: false })

const router = useRouter()
const { akun, dashboardPath } = useAuth()
let redirectTimer: ReturnType<typeof setTimeout> | undefined

onMounted(async () => {
  // Hide native splash screen if running in Capacitor
  if (Capacitor.isNativePlatform()) {
    try {
      await SplashScreen.hide();
    } catch (e) {
      console.log('Splash screen plugin not available or already hidden');
    }
  }

  redirectTimer = setTimeout(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true'

    if (!hasSeenOnboarding) {
      router.replace('/onboarding')
      return
    }

    router.replace(akun.value ? dashboardPath(akun.value.role) : '/login')
  }, 1400)
})

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer)
})
</script>
