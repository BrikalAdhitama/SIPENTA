<template>
  <DosenMobileJadwalPribadiMobile v-if="isMobile" />
  <DosenWebJadwalPribadi v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
