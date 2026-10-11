<template>
  <MahasiswaMobileDashboardMobile v-if="isMobile" />
  <MahasiswaWebDashboard v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode();
</script>
