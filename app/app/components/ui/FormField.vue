<template>
  <div class="flex flex-col gap-1.5">
    <label :for="untuk" class="text-[13px] leading-normal" :class="gaya === 'a' ? 'font-semibold text-[#475569]' : 'text-[#334155]'">
      {{ label }}<span v-if="wajib" :class="gaya === 'a' ? 'text-[#ef4444]' : ''"> *</span>
    </label>
    <slot />
    <p v-if="bantuan && !galat" class="text-xs leading-normal text-meta">{{ bantuan }}</p>
    <p v-if="galat" class="text-xs leading-normal text-danger" role="alert">{{ galat }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label: string; untuk?: string; wajib?: boolean; bantuan?: string; galat?: string; gaya?: "a" | "b" }>(), { gaya: "a" });
</script>
