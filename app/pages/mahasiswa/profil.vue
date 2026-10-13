<template>
  <MahasiswaMobileProfilMobile v-if="isMobile" />
  <MahasiswaWebProfil v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode();
</script>
