<template>
  <!-- TODO: versi mobile (frame "... - mobile mahasiswa") belum dibuat -->
  <UiSegeraHadir v-if="isMobile" judul="Profil Saya" />
  <MahasiswaWebProfil v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode();
</script>
