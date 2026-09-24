<template>
  <!-- TODO: versi mobile (frame "... - mobile mahasiswa") belum dibuat -->
  <UiSegeraHadir v-if="isMobile" judul="Jadwal Saya" />
  <MahasiswaWebJadwal v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode();
</script>
