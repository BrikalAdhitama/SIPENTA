<template>
  <UiModalDialog
    :model-value="modelValue"
    :judul="dosen ? 'Edit Data Dosen' : 'Tambah Dosen Baru'"
    gaya="b"
    lebar="max-w-xl"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <form id="form-dosen" class="flex flex-col gap-4 pt-1" novalidate @submit.prevent="simpan">
      <UiFormField label="Nama Lengkap (tanpa gelar)" untuk="ds-nama" wajib gaya="b">
        <input id="ds-nama" v-model="form.nama" type="text" placeholder="cth. Ahmad Fauzi" :class="INPUT_CLASS" autofocus />
      </UiFormField>
      <div class="grid grid-cols-2 gap-4">
        <UiFormField label="Gelar" untuk="ds-gelar" wajib gaya="b">
          <input id="ds-gelar" v-model="form.gelar" type="text" placeholder="cth. M.T, M.Kom, Ph.D" :class="INPUT_CLASS" />
        </UiFormField>
        <UiFormField label="NIP" untuk="ds-nip" wajib gaya="b">
          <input id="ds-nip" v-model="form.nip" type="text" inputmode="numeric" placeholder="18 digit NIP" :class="INPUT_CLASS" />
        </UiFormField>
      </div>
      <UiFormField label="Email" untuk="ds-email" gaya="b">
        <input id="ds-email" v-model="form.email" type="email" placeholder="nama@universitas.ac.id" :class="INPUT_CLASS" />
      </UiFormField>
      <UiFormField label="Bidang Keahlian" untuk="ds-bidang" gaya="b">
        <input id="ds-bidang" v-model="form.bidang" type="text" placeholder="cth. Kecerdasan Buatan" :class="INPUT_CLASS" />
      </UiFormField>
      <UiFormField label="Status" untuk="ds-status" gaya="b" class="w-1/2 pr-2">
        <select id="ds-status" v-model="form.status" :class="INPUT_CLASS">
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Tidak Aktif</option>
        </select>
      </UiFormField>
      <p v-if="galat" class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">{{ galat }}</p>
    </form>
    <template #footer>
      <UiButton variant="secondary" bentuk="kotak" @click="emit('update:modelValue', false)">Batal</UiButton>
      <UiButton variant="sky" bentuk="kotak" type="submit" form="form-dosen">{{ dosen ? "Simpan Perubahan" : "Tambah Dosen" }}</UiButton>
    </template>
  </UiModalDialog>
</template>

<script setup lang="ts">
import type { Dosen, DosenInput } from "~/composables/useAdminDosen";
import { INPUT_CLASS } from "~/utils/ui";

const props = defineProps<{ modelValue: boolean; dosen: Dosen | null }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const { validasiDosen, tambahDosen, ubahDosen } = useAdminDosen();
const toast = useAppToast();

const KOSONG: DosenInput = { nama: "", gelar: "", nip: "", email: "", bidang: "", status: "aktif" };
const form = reactive<DosenInput>({ ...KOSONG });
const galat = ref("");

// isi ulang form setiap dialog dibuka
watch(
  () => props.modelValue,
  (buka) => {
    if (!buka) return;
    const { id: _id, ...nilai } = props.dosen ?? { id: 0, ...KOSONG };
    Object.assign(form, nilai);
    galat.value = "";
  },
  { immediate: true },
);

function simpan() {
  const pesan = validasiDosen(form, props.dosen?.id);
  if (pesan) {
    galat.value = pesan;
    return;
  }
  if (props.dosen) {
    ubahDosen(props.dosen.id, form);
    toast.sukses("Data dosen diperbarui", form.nama.trim());
  } else {
    tambahDosen(form);
    toast.sukses("Dosen ditambahkan", form.nama.trim());
  }
  emit("update:modelValue", false);
}
</script>
