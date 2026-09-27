<template>
  <span class="inline-block shrink-0 bg-current" :style="style" aria-hidden="true" />
</template>

<script setup lang="ts">
// Menampilkan berkas SVG dari Figma apa adanya (bentuknya), tapi warnanya ikut
// `currentColor` — supaya ikon menu bisa abu-abu (tidak aktif) atau biru (aktif).
const props = defineProps<{ src: string; width: number; height?: number }>();

const style = computed(() => {
  const mask = `url("${props.src}") center / 100% 100% no-repeat`;
  return {
    width: `${props.width}px`,
    height: `${props.height ?? props.width}px`,
    mask,
    WebkitMask: mask,
  };
});
</script>
