<template>
  <!-- Kartu ringkasan Figma: latar biru muda, lingkaran putih berisi ikon di kiri, angka + label di kanan -->
  <div class="flex min-w-0 items-center gap-4 rounded-2xl bg-primary-100 px-5 py-6">
    <span class="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-primary-600"><slot name="ikon" /></span>
    <div class="min-w-0 leading-tight">
      <p class="text-[32px] font-medium text-[#1a1a1a]">{{ nilai }}</p>
      <p class="mt-1 text-[17px] text-label">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; nilai: number | string }>();
</script>
