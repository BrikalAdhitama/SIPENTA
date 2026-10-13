<template>
  <!-- Dialog tengah layar (web admin). Dua gaya mengikuti Figma:
       gaya "a" → judul tebal + subjudul (opsional ikon), tombol rata kanan (Ruangan, Mahasiswa, Import)
       gaya "b" → judul polos, garis pemisah, tombol selebar penuh (Dosen, Jadwal Dosen)
       `polos` → tanpa header (dialog konfirmasi hapus). Untuk form: beri <form id="..."> di slot utama
       dan tombol submit di #footer memakai atribut form="..." supaya Enter tetap mengirim form. -->
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      :aria-label="judul"
      @click.self="tutup"
    >
      <div class="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_20px_50px_rgba(15,23,42,0.25)]" :class="lebar">
        <div v-if="bilahAtas" class="h-1.5 shrink-0 bg-linear-to-r from-primary-900 to-primary-200" aria-hidden="true" />
        <div v-if="pegangan" class="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" aria-hidden="true" />

        <header v-if="!polos" class="flex items-start gap-3.5 px-6 pt-5 pb-4" :class="gaya === 'b' ? 'border-b border-line' : ''">
          <span v-if="$slots.ikon" class="flex size-10 shrink-0 items-center justify-center rounded-xl"><slot name="ikon" /></span>
          <div class="min-w-0 flex-1">
            <h2 class="text-[17px] leading-snug text-[#0f172a]" :class="gaya === 'a' ? 'font-bold' : 'font-semibold'">{{ judul }}</h2>
            <p v-if="subjudul" class="mt-0.5 text-xs leading-normal text-[#94a3b8]">{{ subjudul }}</p>
          </div>
          <button
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a]"
            aria-label="Tutup"
            @click="tutup"
          >
            <UiIcon nama="x" class="size-5" />
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto" :class="polos ? 'px-6 pt-6 pb-4' : 'px-6 py-4'">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          :class="
            polos
              ? 'grid grid-cols-2 gap-3 px-6 pb-6'
              : gaya === 'a'
                ? 'flex items-center justify-end gap-3 px-6 pt-1 pb-6'
                : 'flex gap-3 border-t border-line px-6 py-4 *:flex-1'
          "
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    judul: string;
    subjudul?: string;
    lebar?: string;
    gaya?: "a" | "b";
    polos?: boolean;
    pegangan?: boolean;
    bilahAtas?: boolean;
  }>(),
  { lebar: "max-w-md", gaya: "a" },
);
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

function tutup() {
  emit("update:modelValue", false);
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue) tutup();
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});

// kunci scroll halaman selama dialog terbuka
watch(
  () => props.modelValue,
  (buka) => {
    document.body.style.overflow = buka ? "hidden" : "";
  },
);
</script>
