<template>
  <DosenMobileJadwalSeminarMobile v-if="isMobile" />
  <DosenWebJadwalSeminar v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
