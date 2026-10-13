<template>
  <AdminMobileNotificationsMobile v-if="isMobile" />
  <AdminWebNotifications v-else />
</template>

<script setup lang="ts">
const { isMobile } = useLayoutMode()
</script>
