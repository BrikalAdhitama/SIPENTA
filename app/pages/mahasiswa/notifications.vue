<template>
  <MahasiswaMobileNotificationsMobile v-if="isMobile" />
  <div v-else class="p-8 text-center text-slate-500">Halaman Notifikasi Mahasiswa (Web)</div>
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
