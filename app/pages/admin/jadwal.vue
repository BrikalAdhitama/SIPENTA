<template>
  <AdminMobileJadwalMobile v-if="isMobile" />
  <AdminWebJadwal v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
