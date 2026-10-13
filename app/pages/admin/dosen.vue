<template>
  <AdminMobileDosenMobile v-if="isMobile" />
  <AdminWebDosen v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
