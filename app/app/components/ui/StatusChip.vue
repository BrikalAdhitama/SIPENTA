<template>
  <span class="inline-flex items-center rounded-[20px] px-2.5 py-1.5 text-xs leading-3 tracking-[0.12px] whitespace-nowrap" :class="GAYA[tone]">
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { ChipTone } from "~/utils/ui";

withDefaults(defineProps<{ tone?: ChipTone }>(), { tone: "neutral" });

const GAYA: Record<ChipTone, string> = {
  success: "bg-success/18 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-line-soft text-meta",
};
</script>
