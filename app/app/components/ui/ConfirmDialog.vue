<template>
  <!-- Dialog konfirmasi hapus (Figma): lingkaran merah muda + ikon tempat sampah, teks tengah, 2 tombol sama lebar -->
  <UiModalDialog :model-value="modelValue" :judul="judul" lebar="max-w-sm" polos @update:model-value="(v) => emit('update:modelValue', v)">
    <div class="flex flex-col items-center text-center">
      <span class="flex size-11 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626]"><UiIcon nama="trash" class="size-5" /></span>
      <h3 class="mt-3.5 text-base font-bold text-[#0f172a]">{{ judul }}</h3>
      <p class="mt-1.5 text-[13px] leading-relaxed text-[#64748b]"><slot /></p>
    </div>
    <template #footer>
      <UiButton variant="secondary" bentuk="kotak" @click="emit('update:modelValue', false)">Batal</UiButton>
      <UiButton variant="danger" bentuk="kotak" @click="konfirmasi">{{ labelKonfirmasi }}</UiButton>
    </template>
  </UiModalDialog>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue: boolean; judul: string; labelKonfirmasi?: string }>(), {
  labelKonfirmasi: "Hapus",
});
const emit = defineEmits<{ "update:modelValue": [boolean]; konfirmasi: [] }>();

function konfirmasi() {
  emit("konfirmasi");
  emit("update:modelValue", false);
}
</script>
