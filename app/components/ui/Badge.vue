<script setup lang="ts">
type BadgeType = "success" | "warning" | "error" | "info" | "duplikat";

const props = defineProps<{
  type: BadgeType;
  label: string;
}>();

const styles: Record<BadgeType, string> = {
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  duplikat: "bg-amber-200 text-amber-900",
};
</script>

<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
    :class="styles[props.type]"
  >
    {{ props.label }}
  </span>
</template>
