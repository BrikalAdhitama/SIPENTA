<template>
  <div v-if="isMobile" class="bg-[#f8fafc] min-h-screen">
    <AdminMobilePenjadwalanMobile />
    <BottomNav />
  </div>
  <AdminWebPenjadwalan v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
