<script setup lang="ts">
const props = defineProps<{
  steps: string[];
  current: number; // 0-indexed
}>();
</script>

<template>
  <div class="mb-8">
    <!-- Mobile: compact dot stepper -->
    <div class="flex sm:hidden items-center justify-center gap-2 mb-3">
      <div
        v-for="(_, i) in props.steps"
        :key="i"
        class="h-2 rounded-full transition-all"
        :class="i <= props.current ? 'bg-primary' : 'bg-slate-200'"
        :style="{ width: i === props.current ? '24px' : '8px' }"
      />
    </div>
    <div class="hidden sm:block text-xs text-center font-medium mb-2 text-primary">
      Langkah {{ props.current + 1 }} dari {{ props.steps.length }}: {{ props.steps[props.current] }}
    </div>

    <!-- Desktop: full stepper -->
    <div class="hidden sm:flex items-center gap-0">
      <div v-for="(s, i) in props.steps" :key="s" class="flex items-center flex-1 last:flex-none">
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            :class="i <= props.current ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'"
          >
            <svg v-if="i < props.current" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span
            class="text-xs font-medium whitespace-nowrap"
            :class="i <= props.current ? 'text-primary' : 'text-slate-400'"
          >{{ s }}</span>
        </div>
        <div
          v-if="i < props.steps.length - 1"
          class="flex-1 h-px mx-3"
          :class="i < props.current ? 'bg-primary' : 'bg-slate-200'"
        />
      </div>
    </div>
  </div>
</template>
