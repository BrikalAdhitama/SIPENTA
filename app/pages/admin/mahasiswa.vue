<template>
  <ClientOnly>
    <div v-if="isMobile">
      <MahasiswaMobile />
    </div>
    <div v-else class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md mx-auto">
        <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        <h2 class="text-xl font-bold text-slate-800 mb-2">Versi Desktop Belum Tersedia</h2>
        <p class="text-slate-500 text-sm leading-relaxed">
          Sistem SIPENTA saat ini sedang dioptimalkan untuk tampilan mobile (HP). 
          Silakan buka aplikasi ini melalui perangkat mobile Anda atau gunakan fitur 
          <span class="font-bold text-slate-700">Inspect Element (F12) > Responsive Design Mode</span> di browser Anda.
        </p>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MahasiswaMobile from '~/components/admin/mobile/MahasiswaMobile.vue'

definePageMeta({
  layout: false // Custom layout if needed, or false to use full screen
})

const isMobile = ref(true)

const checkMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 768
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
