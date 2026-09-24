<template>
  <span class="inline-flex items-start rounded-[20px] bg-primary-200/50 px-2 py-1.25 font-inter text-xs leading-4 font-medium text-primary-900">
    {{ kode }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ kode: string }>();
</script>
