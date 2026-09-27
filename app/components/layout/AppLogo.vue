<template>
  <!-- Logo = ikon (logo.png, dicerminkan) + tulisan "sipenta". Kedua PNG dari Figma
       berukuran 2500×2500 dengan banyak ruang kosong, jadi dipotong persis seperti di Figma. -->
  <div class="flex items-start" :style="{ gap: `${height * 0.18}px` }" role="img" aria-label="SIPENTA">
    <div
      class="relative shrink-0 -scale-x-100 overflow-hidden"
      :style="{ width: `${height * 0.792}px`, aspectRatio: '997 / 1125', marginTop: `${height * 0.04}px` }"
    >
      <img
        src="/logo.png"
        alt=""
        class="absolute max-w-none"
        style="height: 222.22%; left: -75.71%; top: -60.65%; width: 250.75%"
      />
    </div>
    <div class="relative shrink-0 overflow-hidden" :style="{ height: `${height}px`, aspectRatio: '1561 / 448' }">
      <img
        src="/brand/logo-wordmark.png"
        alt=""
        class="absolute max-w-none"
        style="height: 558.04%; left: -29.85%; top: -223.44%; width: 160.15%"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ height?: number }>(), { height: 50 });
</script>
