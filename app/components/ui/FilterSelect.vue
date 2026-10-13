<template>
  <!-- Dropdown pill putih bergaris bayangan (filter "Status", "Jenis", "Semua Dosen", ...). Pakai <select> asli supaya aksesibel. -->
  <label class="relative inline-flex h-11 shrink-0 items-center rounded-full bg-white shadow-[0px_4px_14px_rgba(13,10,44,0.08)]">
    <select
      :value="modelValue"
      :aria-label="label"
      class="h-full cursor-pointer appearance-none rounded-full bg-transparent pr-11 pl-5 text-[15px] font-semibold text-title outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="o in opsi" :key="o.nilai" :value="o.nilai">{{ o.label }}</option>
    </select>
    <UiIcon nama="chevron-down" class="pointer-events-none absolute right-4 size-4.5 text-title" />
  </label>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; opsi: { nilai: string; label: string }[]; label: string }>();
const emit = defineEmits<{ "update:modelValue": [string] }>();
</script>
