<template>
  <!-- Ringkasan bersekat dalam satu kartu (Jadwal Dosen, Preview & Validasi): angka + label, ikon di kanan atas -->
  <div class="flex overflow-hidden rounded-2xl border border-line bg-white" :class="lebar">
    <div v-for="(it, i) in items" :key="it.label" class="relative flex-1 px-5 pt-4 pb-4" :class="i > 0 ? 'border-l border-line' : ''">
      <span class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-xl bg-white text-primary-500 shadow-[0px_2px_8px_rgba(15,23,42,0.1)]">
        <UiIcon :nama="it.ikon" class="size-4.5" />
      </span>
      <p class="text-[28px] leading-none font-semibold text-black">{{ it.nilai }}</p>
      <p class="mt-3 text-[15px] text-title" :class="kapital ? 'uppercase' : ''">{{ it.label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ items: { label: string; nilai: number | string; ikon: string }[]; kapital?: boolean; lebar?: string }>(), {
  lebar: "",
});
</script>
