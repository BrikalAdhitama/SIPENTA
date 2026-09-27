<template>
  <AuthMobileLogin v-if="isMobile" />
  <AuthWebLogin v-else />
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const { isMobile } = useLayoutMode();
</script>
