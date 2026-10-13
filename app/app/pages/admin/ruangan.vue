<template>
  <AdminMobileRuanganMobile v-if="isMobile" />
  <AdminWebRuangan v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
