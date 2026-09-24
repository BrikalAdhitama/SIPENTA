<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
    <div>
      <h1 class="font-display text-xl sm:text-2xl font-bold text-slate-900">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm mt-1 text-slate-500">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="flex items-center gap-2 flex-wrap">
      <slot />
    </div>
  </div>
</template>
