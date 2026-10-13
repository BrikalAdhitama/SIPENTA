<template>
  <AdminMobileMahasiswaMobile v-if="isMobile" />
  <AdminWebMahasiswa v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
