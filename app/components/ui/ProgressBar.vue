<template>
  <div
    class="h-1.5 w-full overflow-hidden rounded-full bg-line-soft"
    role="progressbar"
    :aria-valuenow="nilai"
    aria-valuemin="0"
    :aria-valuemax="maks"
  >
    <div class="h-full rounded-full transition-[width]" :class="WARNA[tone]" :style="{ width: `${persen}%` }" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ nilai: number; maks: number; tone?: "primary" | "success" | "warning" | "danger" }>(), {
  tone: "primary",
});

const WARNA = { primary: "bg-primary-500", success: "bg-success", warning: "bg-warning", danger: "bg-danger" };
const persen = computed(() => (props.maks > 0 ? Math.min(100, Math.round((props.nilai / props.maks) * 100)) : 0));
</script>
