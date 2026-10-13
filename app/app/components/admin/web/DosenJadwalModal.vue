<template>
  <!-- Detail jadwal mengajar satu dosen. Sesuai Figma, tiap langkah = dialog terpisah (bukan bertumpuk):
       daftar → (tambah/edit) form → kembali ke daftar; hapus → dialog konfirmasi → kembali ke daftar. -->
  <UiModalDialog :model-value="modelValue && mode === 'daftar'" :judul="dosen ? namaLengkap(dosen) : ''" lebar="max-w-3xl" polos pegangan @update:model-value="(v) => emit('update:modelValue', v)">
    <template v-if="dosen">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-[#0f172a]">{{ namaLengkap(dosen) }}</h2>
          <p class="mt-0.5 text-sm text-primary-900">NIP · {{ dosen.nip }}</p>
        </div>
        <button type="button" class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]" aria-label="Tutup" @click="emit('update:modelValue', false)">
          <UiIcon nama="x" class="size-4.5" />
        </button>
      </div>
      <span class="mt-3 inline-block rounded-full bg-primary-100 px-3.5 py-1.5 text-[13px] text-primary-900">{{ jadwalDosen.length }} jadwal mengajar</span>

      <div class="mt-5 flex items-center justify-between gap-3 px-1">
        <h3 class="text-[15px] font-semibold text-[#0f172a]">Daftar Jadwal Mengajar</h3>
        <UiButton kecil bentuk="kotak" class="!h-9 !px-4 !text-[13px]" @click="bukaTambah"><UiIcon nama="plus" class="size-4" /> Tambah Jadwal</UiButton>
      </div>

      <div class="mt-3">
        <div :class="GRID" class="h-10 items-center border-b border-line text-xs font-semibold text-[#64748b]">
          <span>No</span><span>Mata Kuliah</span><span class="text-center">Kelas</span><span class="text-center">Hari</span><span class="text-center">Jam</span><span class="text-center">Ruangan</span><span class="text-center">Aksi</span>
        </div>
        <ul>
          <li v-for="(j, i) in jadwalDosen" :key="j.id" :class="GRID" class="h-11.5 items-center border-b border-line-soft text-[13px] text-[#0f172a]">
            <span class="text-[#94a3b8]">{{ i + 1 }}</span>
            <span class="truncate">{{ j.mataKuliah }}</span>
            <span class="text-center">{{ j.kelas || "—" }}</span>
            <span class="text-center"><span class="inline-block rounded-full px-2.5 py-0.5 text-[11px]" :class="WARNA_HARI[j.hari]">{{ HARI_LABEL[j.hari] }}</span></span>
            <span class="text-center">{{ j.jamMulai }} - {{ j.jamSelesai }}</span>
            <span class="text-center">{{ j.ruangan || "—" }}</span>
            <UiRowActions kotak :nama="`jadwal ${j.mataKuliah}`" @edit="bukaUbah(j)" @hapus="mintaHapus(j)" />
          </li>
          <li v-if="jadwalDosen.length === 0" class="py-10 text-center text-sm text-meta">Belum ada jadwal mengajar.</li>
        </ul>
      </div>
      <div class="h-3" />
    </template>
  </UiModalDialog>

  <!-- tambah / edit jadwal -->
  <UiModalDialog :model-value="modelValue && mode === 'form'" :judul="editId === null ? 'Tambah Jadwal Mengajar' : 'Edit Jadwal Mengajar'" gaya="b" lebar="max-w-lg" @update:model-value="(v) => !v && (mode = 'daftar')">
    <form id="form-jadwal-mengajar" class="flex flex-col gap-4 pt-1" novalidate @submit.prevent="simpan">
      <UiFormField label="Mata Kuliah" untuk="jm-mk" wajib gaya="b">
        <input id="jm-mk" v-model="form.mataKuliah" type="text" placeholder="cth. Pemrograman Web" :class="INPUT_CLASS" autofocus />
      </UiFormField>
      <div class="grid grid-cols-2 gap-4">
        <UiFormField label="Kelas" untuk="jm-kelas" gaya="b">
          <input id="jm-kelas" v-model="form.kelas" type="text" placeholder="A" :class="INPUT_CLASS" />
        </UiFormField>
        <UiFormField label="Hari" untuk="jm-hari" gaya="b">
          <select id="jm-hari" v-model="form.hari" :class="INPUT_CLASS">
            <option v-for="h in HARI_MENGAJAR" :key="h" :value="h">{{ HARI_LABEL[h] }}</option>
          </select>
        </UiFormField>
        <UiFormField label="Jam" untuk="jm-jam" gaya="b">
          <input id="jm-jam" v-model="form.jam" type="text" placeholder="07:30 - 10:00" :class="INPUT_CLASS" />
        </UiFormField>
        <UiFormField label="Ruangan" untuk="jm-ruangan" gaya="b">
          <input id="jm-ruangan" v-model="form.ruangan" type="text" list="daftar-kode-ruangan" placeholder="F104" :class="INPUT_CLASS" />
          <datalist id="daftar-kode-ruangan">
            <option v-for="r in ruangan" :key="r.id" :value="r.kode" />
          </datalist>
        </UiFormField>
      </div>
      <p v-if="galat" class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">{{ galat }}</p>
    </form>
    <template #footer>
      <UiButton variant="secondary" bentuk="kotak" @click="mode = 'daftar'">Batal</UiButton>
      <UiButton variant="sky" bentuk="kotak" type="submit" form="form-jadwal-mengajar">{{ editId === null ? "Tambah Jadwal" : "Simpan Perubahan" }}</UiButton>
    </template>
  </UiModalDialog>

  <!-- hapus jadwal -->
  <UiConfirmDialog :model-value="modelValue && mode === 'hapus'" judul="Hapus Jadwal?" @update:model-value="(v) => !v && (mode = 'daftar')" @konfirmasi="hapusTerpilih">
    Jadwal <strong class="text-[#334155]">{{ calonHapus?.mataKuliah }}{{ calonHapus?.kelas ? ` – Kelas ${calonHapus.kelas}` : "" }}</strong> akan dihapus permanen.
  </UiConfirmDialog>
</template>

<script setup lang="ts">
import { HARI_LABEL, HARI_MENGAJAR, namaLengkap, parseJam, type HariMengajar, type JadwalMengajar } from "~/composables/useAdminDosen";
import { INPUT_CLASS } from "~/utils/ui";

const props = defineProps<{ modelValue: boolean; dosenId: number | null }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const { cariDosen, jadwalDosen: jadwalMilik, validasiJadwal, tambahJadwal, ubahJadwal, hapusJadwal } = useAdminDosen();
const { daftar: ruangan } = useAdminRuangan();
const toast = useAppToast();

const GRID = "grid grid-cols-[40px_minmax(0,1.6fr)_70px_90px_110px_90px_80px] gap-x-2 px-1";
const WARNA_HARI: Record<HariMengajar, string> = {
  senin: "bg-[#e0f0ff] text-[#1976d2]",
  selasa: "bg-[#dcfce7] text-[#16a34a]",
  rabu: "bg-[#fff1d6] text-[#d97706]",
  kamis: "bg-[#f3e8ff] text-[#9333ea]",
  jumat: "bg-[#ccfbf1] text-[#0d9488]",
  sabtu: "bg-[#fce7f3] text-[#db2777]",
  minggu: "bg-[#fee2e2] text-[#dc2626]",
};

const dosen = computed(() => cariDosen(props.dosenId));
const jadwalDosen = computed(() => (props.dosenId === null ? [] : jadwalMilik(props.dosenId)));

const mode = ref<"daftar" | "form" | "hapus">("daftar");
const editId = ref<number | null>(null);
const calonHapus = ref<JadwalMengajar | null>(null);
const galat = ref("");

const form = reactive({ mataKuliah: "", kelas: "", hari: "senin" as HariMengajar, jam: "", ruangan: "" });

watch(
  () => props.modelValue,
  (buka) => {
    if (buka) mode.value = "daftar";
  },
);

function bukaTambah() {
  Object.assign(form, { mataKuliah: "", kelas: "", hari: "senin", jam: "", ruangan: "" });
  editId.value = null;
  galat.value = "";
  mode.value = "form";
}

function bukaUbah(j: JadwalMengajar) {
  Object.assign(form, { mataKuliah: j.mataKuliah, kelas: j.kelas, hari: j.hari, jam: `${j.jamMulai} - ${j.jamSelesai}`, ruangan: j.ruangan });
  editId.value = j.id;
  galat.value = "";
  mode.value = "form";
}

function simpan() {
  const jam = parseJam(form.jam);
  if (!jam) {
    galat.value = "Format jam tidak valid. Contoh: 07:30 - 10:00";
    return;
  }
  const input = { mataKuliah: form.mataKuliah, kelas: form.kelas, hari: form.hari, ruangan: form.ruangan, ...jam };
  const pesan = validasiJadwal(input);
  if (pesan) {
    galat.value = pesan;
    return;
  }
  if (editId.value === null) {
    if (props.dosenId !== null) tambahJadwal(props.dosenId, input);
    toast.sukses("Jadwal mengajar ditambahkan", form.mataKuliah.trim());
  } else {
    ubahJadwal(editId.value, input);
    toast.sukses("Jadwal mengajar diperbarui", form.mataKuliah.trim());
  }
  mode.value = "daftar";
}

function mintaHapus(j: JadwalMengajar) {
  calonHapus.value = j;
  mode.value = "hapus";
}

function hapusTerpilih() {
  if (calonHapus.value) {
    hapusJadwal(calonHapus.value.id);
    toast.sukses("Jadwal mengajar dihapus", calonHapus.value.mataKuliah);
  }
  mode.value = "daftar";
}
</script>
