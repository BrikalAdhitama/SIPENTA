<template>
  <!-- Admin · Ruangan (web) — kartu per ruangan, menu ⋯ → Edit / Hapus (Figma). Versi mobile: AdminMobileRuanganMobile. -->
  <div class="pt-8 pr-10 pb-14 pl-9">
    <UiPageHeader judul="Manajemen Ruangan" subjudul="Kelola daftar ruangan untuk penjadwalan seminar.">
      <UiButton ikon-plus @click="bukaTambah">Tambah Ruangan</UiButton>
    </UiPageHeader>

    <ul class="mt-9 grid grid-cols-2 gap-x-8 gap-y-7 xl:grid-cols-4">
      <li v-for="r in daftar" :key="r.id" class="relative flex min-h-44 flex-col rounded-2xl bg-primary-100 px-5 pt-5 pb-4">
        <div class="flex items-start justify-between">
          <span class="flex size-10 items-center justify-center rounded-xl bg-primary-900 text-white"><UiIcon nama="building" class="size-5" /></span>
          <button
            type="button"
            class="-mt-1 -mr-2 flex size-8 items-center justify-center rounded-lg text-[#0f172a] hover:bg-white/60"
            :aria-label="`Menu ${r.nama}`"
            :aria-expanded="menuId === r.id"
            @click.stop="menuId = menuId === r.id ? null : r.id"
          >
            <UiIcon nama="dots" class="size-5" />
          </button>
        </div>

        <h2 class="mt-3 text-2xl leading-tight font-semibold text-primary-900">{{ r.nama }}</h2>
        <p class="mt-1 text-[15px] text-black">Lantai {{ r.lantai }} · Gedung {{ r.gedung }}</p>
        <span class="mt-2.5 block h-px w-[82%] bg-primary-900/70" aria-hidden="true" />

        <div v-if="menuId === r.id" class="absolute top-12 right-3 z-10 w-32 overflow-hidden rounded-xl bg-white py-1 shadow-[0px_8px_24px_rgba(15,23,42,0.15)]" @click.stop>
          <button type="button" class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#334155] hover:bg-slate-50" @click="bukaUbah(r)">
            <UiIcon nama="edit" class="size-4 text-primary-900" /> Edit
          </button>
          <button type="button" class="flex w-full items-center gap-2.5 border-t border-line-soft px-4 py-2.5 text-sm text-[#334155] hover:bg-slate-50" @click="mintaHapus(r)">
            <UiIcon nama="trash" class="size-4 text-[#dc2626]" /> Hapus
          </button>
        </div>
      </li>
    </ul>
    <p v-if="daftar.length === 0" class="mt-14 text-center text-sm text-meta">Belum ada ruangan. Klik “Tambah Ruangan” untuk memulai.</p>

    <UiModalDialog v-model="formTerbuka" :judul="editId === null ? 'Tambah Ruangan' : 'Edit Ruangan'" subjudul="Lengkapi informasi data ruangan" lebar="max-w-md">
      <template #ikon><span class="flex size-10 items-center justify-center rounded-xl bg-primary-900 text-white"><UiIcon nama="building" class="size-5" /></span></template>
      <form id="form-ruangan" class="flex flex-col gap-4" novalidate @submit.prevent="simpan">
        <UiFormField label="Nama Ruangan" untuk="rg-nama" wajib>
          <input id="rg-nama" v-model="form.nama" type="text" placeholder="cth. Ruang F101" :class="INPUT_ABU" autofocus />
        </UiFormField>
        <div class="grid grid-cols-2 gap-4">
          <UiFormField label="Lantai" untuk="rg-lantai" wajib>
            <input id="rg-lantai" v-model="form.lantai" type="number" min="0" step="1" placeholder="1" :class="INPUT_ABU" />
          </UiFormField>
          <UiFormField label="Gedung" untuk="rg-gedung" wajib>
            <input id="rg-gedung" v-model="form.gedung" type="text" placeholder="F" :class="INPUT_ABU" />
          </UiFormField>
        </div>
        <p v-if="galat" class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">{{ galat }}</p>
      </form>
      <template #footer>
        <UiButton variant="abu" bentuk="kotak" @click="formTerbuka = false">Batal</UiButton>
        <UiButton variant="sky" type="submit" form="form-ruangan">{{ editId === null ? "Tambah Ruangan" : "Simpan Perubahan" }}</UiButton>
      </template>
    </UiModalDialog>

    <UiConfirmDialog v-model="hapusTerbuka" judul="Hapus Ruangan?" @konfirmasi="hapusTerpilih">
      Data ruangan <strong class="text-[#334155]">{{ calonHapus?.nama }}</strong> akan dihapus permanen.
    </UiConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import type { Ruangan } from "~/composables/useAdminRuangan";
import { INPUT_ABU } from "~/utils/ui";

const { daftar, validasi, tambah, ubah, hapus } = useAdminRuangan();
const toast = useAppToast();

// ── menu ⋯ per kartu (tutup saat klik di luar) ──
const menuId = ref<number | null>(null);
const tutupMenu = () => (menuId.value = null);
onMounted(() => window.addEventListener("click", tutupMenu));
onBeforeUnmount(() => window.removeEventListener("click", tutupMenu));

// ── form tambah / ubah ──
const formTerbuka = ref(false);
const editId = ref<number | null>(null);
const galat = ref("");
const form = reactive({ nama: "", lantai: "" as number | string, gedung: "" });

function bukaTambah() {
  Object.assign(form, { nama: "", lantai: "", gedung: "" });
  editId.value = null;
  galat.value = "";
  formTerbuka.value = true;
}

function bukaUbah(r: Ruangan) {
  Object.assign(form, { nama: r.nama, lantai: r.lantai, gedung: r.gedung });
  editId.value = r.id;
  galat.value = "";
  menuId.value = null;
  formTerbuka.value = true;
}

function simpan() {
  const input = {
    nama: form.nama,
    lantai: form.lantai === "" ? Number.NaN : Number(form.lantai),
    gedung: form.gedung,
  };
  const pesan = validasi(input, editId.value ?? undefined);
  if (pesan) {
    galat.value = pesan;
    return;
  }
  if (editId.value === null) {
    tambah(input);
    toast.sukses("Ruangan ditambahkan", input.nama.trim());
  } else {
    ubah(editId.value, input);
    toast.sukses("Perubahan disimpan", input.nama.trim());
  }
  formTerbuka.value = false;
}

// ── hapus ──
const hapusTerbuka = ref(false);
const calonHapus = ref<Ruangan | null>(null);

function mintaHapus(r: Ruangan) {
  calonHapus.value = r;
  menuId.value = null;
  hapusTerbuka.value = true;
}

function hapusTerpilih() {
  if (!calonHapus.value) return;
  hapus(calonHapus.value.id);
  toast.sukses("Ruangan dihapus", calonHapus.value.nama);
}
</script>
