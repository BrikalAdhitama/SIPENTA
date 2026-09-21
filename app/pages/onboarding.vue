<template>
  <!-- Main Container: Full screen, background image with an overlay -->
  <div class="h-screen w-full relative overflow-hidden flex flex-col justify-between">
    
    <!-- Background Image -->
    <div 
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/itk.jpeg');"
    ></div>

    <!-- Blue Overlay (0D47A1 with 30% opacity) -->
    <div class="absolute inset-0 z-0 bg-primary-900/30"></div>

    <!-- Content Container (Logo + Text) aligned closer to the bottom -->
    <div class="z-10 flex-1 flex flex-col items-center justify-end px-6 pb-4">
      
      <!-- Icon/Logo -->
      <img src="/logo.png" alt="SIPENTA Logo" class="w-24 h-24 object-contain mb-3" onerror="this.style.display='none';" />

      <!-- Heading -->
      <h1 class="text-white text-5xl font-bold text-center leading-tight mb-2 tracking-tight">
        Welcome <br> to SIPENTA
      </h1>

      <!-- Subtitle -->
      <p class="text-slate-200 text-lg font-normal text-center">
        Jadwalkan seminar tanpa ribet
      </p>
    </div>

    <!-- Bottom Action Button -->
    <div class="z-10 p-6 pb-12 w-full">
      <button 
        @click="goToHome"
        class="w-full bg-primary-500 hover:bg-primary-900 text-white font-semibold py-4 rounded-2xl shadow-lg transition-transform transform active:scale-95 text-lg"
      >
        Get Started
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  // Save to localStorage so we don't show onboarding again
  if (import.meta.client) {
    localStorage.setItem('hasSeenOnboarding', 'true')
  }
  
  // Navigate to login page
  router.push('/login')
}
</script>
