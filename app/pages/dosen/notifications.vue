<template>
  <DosenMobileNotificationsMobile v-if="isMobile" />
  <!-- Web: bisa tambahkan komponen web jika perlu -->
  <div v-else class="p-8 text-center text-slate-500">Halaman Notifikasi Dosen (Web)</div>
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>