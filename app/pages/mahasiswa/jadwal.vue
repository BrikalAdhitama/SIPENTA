<template>
  <MahasiswaMobileJadwalMobile v-if="isMobile" />
  <MahasiswaWebJadwal v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode();
</script>
