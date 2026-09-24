<script setup lang="ts">
withDefaults(defineProps<{
  label: string; value: string | number; unit?: string; note?: string;
  icon: string; tone: string; trend?: "up" | "down";
}>(), { trend: "up" });
</script>

<template>
  <div class="rounded-3xl bg-tile p-6 flex flex-col">
    <div class="w-12 h-12 rounded-full flex items-center justify-center text-white mb-6" :style="{ background: tone }">
      <UiIcon :name="icon" :size="24" />
    </div>
    <div class="text-slate-500 mb-3">{{ label }}</div>
    <div class="text-4xl font-semibold text-slate-900 mb-5">{{ value }}<span v-if="unit" class="text-xl font-normal ml-1.5">{{ unit }}</span></div>
    <div v-if="note" class="flex items-center gap-2 text-xs text-slate-800">
      <UiIcon :name="trend === 'up' ? 'up-right' : 'down-right'" :size="16" :class="trend === 'up' ? 'text-emerald-600' : 'text-red-500'" />
      {{ note }}
    </div>
  </div>
</template>
