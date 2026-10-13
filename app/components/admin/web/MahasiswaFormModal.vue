<template>
  <UiModalDialog
    :model-value="modelValue"
    :judul="mahasiswa ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'"
    subjudul="Lengkapi informasi data mahasiswa"
    lebar="max-w-lg"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <form id="form-mahasiswa" class="flex flex-col gap-4" novalidate @submit.prevent="simpan">
      <div class="flex flex-col gap-4">
        <UiFormField label="Nama Lengkap" untuk="mh-nama" wajib>
          <input id="mh-nama" v-model="form.nama" type="text" placeholder="Masukkan nama lengkap" :class="INPUT_ABU" autofocus />
        </UiFormField>
        <UiFormField label="NIM" untuk="mh-nim" wajib>
          <input id="mh-nim" v-model="form.nim" type="text" inputmode="numeric" placeholder="Contoh: 2021001001" :class="INPUT_ABU" />
        </UiFormField>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <UiFormField label="Jenis Seminar" untuk="mh-jenis" wajib>
          <select id="mh-jenis" v-model="form.jenis" :class="INPUT_ABU">
            <option value="sempro">Sempro</option>
            <option value="semhas">Semhas</option>
          </select>
        </UiFormField>
        <UiFormField label="Status" untuk="mh-status">
          <select id="mh-status" v-model="form.status" :class="INPUT_ABU">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non-aktif</option>
          </select>
        </UiFormField>
      </div>
      <div class="flex flex-col gap-4">
        <UiFormField label="Pembimbing 1" untuk="mh-pem1" wajib>
          <select id="mh-pem1" v-model="form.pembimbing1" :class="INPUT_ABU">
            <option value="" disabled>-- Pilih Pembimbing 1 --</option>
            <option v-for="n in opsiDosen" :key="n" :value="n">{{ n }}</option>
          </select>
        </UiFormField>
        <UiFormField label="Pembimbing 2" untuk="mh-pem2" wajib>
          <select id="mh-pem2" v-model="form.pembimbing2" :class="INPUT_ABU">
            <option value="" disabled>-- Pilih Pembimbing 2 --</option>
            <option v-for="n in opsiDosen" :key="n" :value="n">{{ n }}</option>
          </select>
        </UiFormField>
      </div>
      <p v-if="galat" class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">{{ galat }}</p>
    </form>
    <template #footer>
      <UiButton variant="abu" bentuk="kotak" @click="emit('update:modelValue', false)">Batal</UiButton>
      <UiButton variant="sky" type="submit" form="form-mahasiswa">{{ mahasiswa ? "Simpan Perubahan" : "Tambah Mahasiswa" }}</UiButton>
    </template>
  </UiModalDialog>
</template>

<script setup lang="ts">
import type { MahasiswaAdmin, MahasiswaInput } from "~/composables/useAdminMahasiswa";
import { INPUT_ABU } from "~/utils/ui";

const props = defineProps<{ modelValue: boolean; mahasiswa: MahasiswaAdmin | null }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const { validasi, tambah, ubah } = useAdminMahasiswa();
const { aktif: dosenAktif } = useAdminDosen();
const toast = useAppToast();

const KOSONG: MahasiswaInput = { nama: "", nim: "", jenis: "sempro", status: "aktif", pembimbing1: "", pembimbing2: "" };
const form = reactive<MahasiswaInput>({ ...KOSONG });
const galat = ref("");

// pilihan pembimbing = dosen aktif; pembimbing lama (mis. dosen nonaktif) tetap muncul saat edit
const opsiDosen = computed(() => {
  const nama = new Set(dosenAktif.value.map((d) => d.nama));
  for (const n of [form.pembimbing1, form.pembimbing2]) if (n) nama.add(n);
  return [...nama];
});

watch(
  () => props.modelValue,
  (buka) => {
    if (!buka) return;
    const m = props.mahasiswa;
    Object.assign(
      form,
      m ? { nama: m.nama, nim: m.nim, jenis: m.jenis, status: m.status, pembimbing1: m.pembimbing1, pembimbing2: m.pembimbing2 } : KOSONG,
    );
    galat.value = "";
  },
  { immediate: true },
);

function simpan() {
  const pesan = validasi(form, props.mahasiswa?.id);
  if (pesan) {
    galat.value = pesan;
    return;
  }
  if (props.mahasiswa) {
    ubah(props.mahasiswa.id, form);
    toast.sukses("Data mahasiswa diperbarui", form.nama.trim());
  } else {
    tambah(form);
    toast.sukses("Mahasiswa ditambahkan", form.nama.trim());
  }
  emit("update:modelValue", false);
}
</script>
