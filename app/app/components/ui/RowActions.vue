<template>
  <div class="flex items-center justify-center gap-2">
    <button
      type="button"
      class="flex size-7 items-center justify-center rounded-md transition-colors"
      :class="kotak ? 'bg-primary-100 text-primary-900 hover:bg-primary-200/60' : 'text-[#334155] hover:bg-slate-100'"
      :aria-label="`Edit ${nama}`"
      title="Edit"
      @click="emit('edit')"
    >
      <UiIcon nama="edit" class="size-4.5" />
    </button>
    <button
      type="button"
      class="flex size-7 items-center justify-center rounded-md transition-colors"
      :class="kotak ? 'bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]' : 'text-[#dc2626] hover:bg-[#fee2e2]'"
      :aria-label="`Hapus ${nama}`"
      title="Hapus"
      @click="emit('hapus')"
    >
      <UiIcon nama="trash" class="size-4.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ nama: string; kotak?: boolean }>();
const emit = defineEmits<{ edit: []; hapus: [] }>();
</script>
