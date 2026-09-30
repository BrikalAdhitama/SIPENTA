<template>
  <!-- TODO: versi mobile (frame "... - mobile dosen") belum dibuat -->
  <UiSegeraHadir v-if="isMobile" judul="Dashboard" />
  <DosenWebDashboard v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode();
</script>
