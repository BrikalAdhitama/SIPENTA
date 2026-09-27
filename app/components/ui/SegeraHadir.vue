<template>
  <div class="px-8.25 pt-6.75">
    <h1 class="text-[43px] leading-normal font-semibold text-heading">{{ judul }}</h1>
    <p class="text-[15px] leading-normal text-subtle">Halaman ini sedang dibuat berdasarkan desain Figma.</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ judul: string }>();
</script>
