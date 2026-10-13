<template>
  <label class="flex h-10 w-full items-center gap-4 rounded-[30px] bg-white px-2 shadow-[0px_4px_12px_0px_rgba(13,10,44,0.06)]">
    <span class="sr-only">{{ placeholder }}</span>
    <input
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      class="min-w-0 flex-1 bg-transparent px-2.5 text-base text-title outline-none placeholder:text-[#abb7c2]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span class="flex size-8.75 shrink-0 items-center justify-center rounded-[25px] bg-linear-to-b from-primary-500 to-primary-200" aria-hidden="true">
      <img src="/icons/search.svg" alt="" class="size-6" />
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue: string; placeholder?: string }>(), { placeholder: "Search ..." });
const emit = defineEmits<{ "update:modelValue": [string] }>();
</script>
