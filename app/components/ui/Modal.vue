<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    maxWidth?: string; // tailwind max-w-* class
  }>(),
  { maxWidth: "max-w-md" }
);
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
    style="background: rgba(15, 23, 42, 0.55)"
    @click.self="emit('close')"
  >
    <div class="rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white w-full" :class="props.maxWidth">
      <div v-if="props.title" class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 class="font-display font-bold text-base">{{ props.title }}</h3>
        <button class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100" @click="emit('close')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="px-5 py-4">
        <slot />
      </div>
      <div v-if="$slots.footer" class="px-5 py-4 border-t border-slate-200 flex gap-3">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
