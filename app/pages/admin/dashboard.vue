<template>
  <AdminMobileDashboardMobile v-if="isMobile" />
  <AdminWebDashboard v-else />
</template>

<script setup>
const { isMobile } = useLayoutMode()
</script>
