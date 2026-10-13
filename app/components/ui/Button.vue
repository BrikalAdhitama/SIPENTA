<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="[GAYA[variant], ikonPlus ? 'rounded-3xl py-1.25 pr-5 pl-1.75 text-base' : [kecil ? 'h-8 px-3.5 text-xs' : 'h-10.5 px-5 text-sm font-medium', bentuk === 'pil' ? 'rounded-full' : 'rounded-xl']]"
  >
    <!-- gaya tombol utama dashboard: lingkaran putih berisi ikon plus -->
    <span v-if="ikonPlus" class="flex items-center justify-center rounded-3xl bg-white p-1.25">
      <img src="/icons/plus-circle.svg" alt="" class="size-6" />
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
type Variant = "primary" | "sky" | "abu" | "secondary" | "garis-biru" | "danger";

withDefaults(
  defineProps<{
    variant?: Variant;
    type?: "button" | "submit";
    disabled?: boolean;
    ikonPlus?: boolean;
    kecil?: boolean;
    bentuk?: "pil" | "kotak";
  }>(),
  { variant: "primary", type: "button", bentuk: "pil" },
);

const GAYA: Record<Variant, string> = {
  primary: "bg-primary-900 text-white hover:bg-primary-900/90", // biru tua: CTA header
  sky: "bg-primary-500 text-white shadow-sm hover:bg-primary-500/90", // biru muda: aksi utama di modal/wizard
  abu: "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]", // "Batal" gaya abu
  secondary: "border border-line bg-white text-[#475569] hover:bg-slate-50", // "Batal"/"Kembali" gaya garis
  "garis-biru": "border border-primary-900/70 bg-white text-primary-900 hover:bg-primary-50", // "Lihat Detail", "Import Data"
  danger: "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
};
</script>
