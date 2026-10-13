<template>
  <header class="flex items-start justify-between gap-6">
    <div class="leading-normal">
      <h1 class="text-[32px] leading-10 font-semibold text-[#0f172a]">{{ judul }}</h1>
      <p v-if="subjudul" class="mt-0.5 text-[15px] leading-normal text-[#64748b]">{{ subjudul }}</p>
    </div>
    <div v-if="$slots.default" class="flex shrink-0 items-center gap-3"><slot /></div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ judul: string; subjudul?: string }>();
</script>
