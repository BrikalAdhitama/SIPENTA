<template>
  <DosenMobileDashboardMobile v-if="isMobile" />
  <DosenWebDashboard v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode();
</script>
