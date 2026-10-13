<template>
  <!-- Dialog tengah layar untuk halaman web dosen (Tambah/Edit/Hapus Kegiatan, Tolak Konfirmasi).
       Latar buram + klik di luar / Esc menutup. Isi diatur lewat slot. -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[3px]"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="max-h-[92vh] w-full overflow-y-auto rounded-3xl bg-white shadow-[0px_20px_50px_rgba(15,23,42,0.25)]" :class="lebar">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: boolean; label: string; lebar?: string }>(), {
  lebar: "max-w-105",
});
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue) emit("update:modelValue", false);
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});

// kunci scroll halaman selama dialog terbuka
watch(
  () => props.modelValue,
  (buka) => {
    if (typeof document !== "undefined") document.body.style.overflow = buka ? "hidden" : "";
  },
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
