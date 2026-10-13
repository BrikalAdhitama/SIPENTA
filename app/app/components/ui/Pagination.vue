<template>
  <div class="flex items-center justify-between gap-4 px-6 py-4 text-[13px]">
    <p class="text-[#a0a5b1]">Showing data {{ dari }} to {{ sampai }} of {{ total }} entries</p>
    <nav class="flex items-center gap-1.5" aria-label="Halaman">
      <button type="button" :class="TOMBOL" :disabled="modelValue <= 1" aria-label="Sebelumnya" @click="ke(modelValue - 1)">
        <UiIcon nama="chevron-left" class="size-3.5" />
      </button>
      <template v-for="(p, i) in daftar" :key="i">
        <span v-if="p === '…'" class="px-1 text-[#a0a5b1]">…</span>
        <button
          v-else
          type="button"
          :class="[TOMBOL, p === modelValue ? '!bg-primary-900 !text-white' : '']"
          :aria-current="p === modelValue ? 'page' : undefined"
          @click="ke(p as number)"
        >
          {{ p }}
        </button>
      </template>
      <button type="button" :class="TOMBOL" :disabled="modelValue >= jumlahHalaman" aria-label="Berikutnya" @click="ke(modelValue + 1)">
        <UiIcon nama="chevron-right" class="size-3.5" />
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: number; total: number; ukuran: number }>();
const emit = defineEmits<{ "update:modelValue": [number] }>();

const TOMBOL = "flex size-7 items-center justify-center rounded-md bg-line-soft text-[13px] text-title hover:bg-primary-100 disabled:opacity-40 disabled:hover:bg-line-soft";

const jumlahHalaman = computed(() => Math.max(1, Math.ceil(props.total / props.ukuran)));
const dari = computed(() => (props.total === 0 ? 0 : (props.modelValue - 1) * props.ukuran + 1));
const sampai = computed(() => Math.min(props.total, props.modelValue * props.ukuran));

const daftar = computed<(number | "…")[]>(() => {
  const n = jumlahHalaman.value;
  const p = props.modelValue;
  if (n <= 6) return Array.from({ length: n }, (_, i) => i + 1);
  if (p <= 3) return [1, 2, 3, 4, "…", n];
  if (p >= n - 2) return [1, "…", n - 3, n - 2, n - 1, n];
  return [1, "…", p - 1, p, p + 1, "…", n];
});

function ke(n: number) {
  emit("update:modelValue", Math.min(jumlahHalaman.value, Math.max(1, n)));
}
</script>
