<template>
  <NuxtLayout>
        <NuxtPage />
  </NuxtLayout>
  <GlobalToast />
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
