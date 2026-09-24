<script setup lang="ts">
type Variant = "primary" | "outline" | "danger" | "ghost";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    disabled?: boolean;
    type?: "button" | "submit";
  }>(),
  { variant: "primary", disabled: false, type: "button" }
);

const base =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-500 hover:bg-slate-100",
};
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="[base, variants[props.variant]]">
    <slot />
  </button>
</template>
