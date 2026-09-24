<template>
  <!-- Kotak 30×30 seperti di Figma; ikon di tengahnya, warnanya ikut currentColor -->
  <span class="inline-flex size-7.5 shrink-0 items-center justify-center" aria-hidden="true">
    <!-- ikon "mahasiswa" di Figma tersusun dari 3 potongan SVG -->
    <span v-if="icon === 'mahasiswa'" class="relative inline-block size-5.5">
      <UiMaskIcon src="/icons/nav-mahasiswa-1.svg" :width="7.46" :height="12.86" class="absolute top-[1.15px] left-[13.37px]" />
      <UiMaskIcon src="/icons/nav-mahasiswa-2.svg" :width="7.46" :height="12.86" class="absolute top-[1.15px] left-[1.15px]" />
      <UiMaskIcon src="/icons/nav-mahasiswa-3.svg" :width="8.65" :height="12.86" class="absolute top-[7.99px] left-[6.67px]" />
    </span>
    <!-- dosen & ruangan: SVG Figma sudah termasuk latar putih 30×30 → tampil apa adanya.
         TODO: ganti dengan versi aktif dari frame "Daftar Dosen"/"Ruangan" saat halamannya dibuat. -->
    <img v-else-if="icon === 'dosen' || icon === 'ruangan'" :src="`/icons/nav-${icon}.svg`" alt="" class="size-7.5" />
    <UiMaskIcon v-else :src="`/icons/nav-${icon}.svg`" :width="SIZE[icon]" />
  </span>
</template>

<script setup lang="ts">
import type { NavIcon } from "~/utils/navigation";

defineProps<{ icon: NavIcon }>();

// ukuran asli SVG di Figma
const SIZE: Record<NavIcon, number> = {
  dashboard: 19,
  penjadwalan: 20,
  mahasiswa: 22,
  jadwal: 20,
  dosen: 30,
  ruangan: 30,
};
</script>
