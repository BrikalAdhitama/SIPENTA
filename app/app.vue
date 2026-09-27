<template>
  <div class="min-h-screen bg-slate-100 flex justify-center items-center font-sans">
    
    <!-- DESKTOP: Tampilan pesan "Belum Tersedia" -->
    <div v-if="isDesktop" class="flex flex-col items-center justify-center text-center px-8 py-20 w-full min-h-screen bg-white">
      <div class="max-w-md mx-auto">
        <!-- Ikon HP -->
        <div class="w-24 h-24 mx-auto mb-8 rounded-[28px] bg-slate-100 flex items-center justify-center">
          <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>

        <!-- Logo / Nama Aplikasi -->
        <div class="flex items-center justify-center gap-2 mb-6">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #0F3B8C 0%, #1E40AF 100%);">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <span class="text-xl font-extrabold text-slate-800 tracking-tight">SIPENTA</span>
        </div>

        <h1 class="text-[28px] font-extrabold text-slate-800 mb-3 leading-tight">Versi Desktop<br>Belum Tersedia</h1>
        <p class="text-[15px] text-slate-500 font-medium leading-relaxed mb-8">
          Sistem SIPENTA saat ini sedang dioptimalkan untuk tampilan mobile (HP). Silakan buka aplikasi ini melalui perangkat mobile Anda atau gunakan fitur
          <span class="font-bold text-slate-700">Inspect Element (F12) &rsaquo; Responsive Design Mode</span>
          di browser Anda.
        </p>

        <!-- Langkah-langkah -->
        <div class="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100">
          <p class="text-[12px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">Cara akses via browser</p>
          <div class="flex flex-col gap-2.5">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0 mt-0.5" style="background-color: #0F3B8C;">1</div>
              <p class="text-[13px] text-slate-600 font-medium">Tekan <kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold shadow-sm">F12</kbd> untuk buka DevTools</p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0 mt-0.5" style="background-color: #0F3B8C;">2</div>
              <p class="text-[13px] text-slate-600 font-medium">Klik ikon <span class="font-bold">Toggle Device Toolbar</span> 📱</p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0 mt-0.5" style="background-color: #0F3B8C;">3</div>
              <p class="text-[13px] text-slate-600 font-medium">Pilih perangkat seperti <span class="font-bold">iPhone 14 Pro</span> atau <span class="font-bold">Galaxy S20</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE: Frame tampilan aplikasi -->
    <div v-else class="w-full max-w-[430px] h-[100dvh] sm:h-[90vh] bg-white sm:rounded-[36px] sm:shadow-2xl overflow-hidden relative sm:border-[10px] sm:border-slate-800 mx-auto flex flex-col">
      <GlobalToast />
      <div class="w-full h-full overflow-y-auto no-scrollbar relative scroll-smooth bg-white">
        <NuxtPage />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isDesktop = ref(false)

const checkDevice = () => {
  // Anggap desktop jika lebar layar >= 768px DAN bukan touch device
  const isWideScreen = window.innerWidth >= 768
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  isDesktop.value = isWideScreen && !isTouchDevice
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

html, body {
  margin: 0;
  padding: 0;
  background-color: #f1f5f9;
  font-family: 'Poppins', sans-serif;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
