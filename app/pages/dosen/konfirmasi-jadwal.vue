<template>
  <DosenMobileKonfirmasiJadwalMobile v-if="isMobile" />
  <DosenWebKonfirmasiJadwal v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
