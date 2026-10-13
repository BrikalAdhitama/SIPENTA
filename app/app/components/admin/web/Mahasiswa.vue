<template>
  <!-- Admin · Mahasiswa (web) — Figma. Versi mobile: AdminMobileMahasiswaMobile. -->
  <div class="pt-8 pr-10 pb-14 pl-8">
    <UiPageHeader judul="Data Mahasiswa" subjudul="Kelola data mahasiswa dan informasi seminar tugas akhir.">
      <UiButton ikon-plus @click="bukaTambah">Tambah Mahasiswa</UiButton>
    </UiPageHeader>

    <section class="mt-6 grid grid-cols-4 gap-4">
      <UiStatCard label="Total Mahasiswa" :nilai="stats.total"><template #ikon><UiIcon nama="users" class="size-7" /></template></UiStatCard>
      <UiStatCard label="Seminar Proposal" :nilai="stats.sempro"><template #ikon><UiIcon nama="users" class="size-7" /></template></UiStatCard>
      <UiStatCard label="Seminar Hasil" :nilai="stats.semhas"><template #ikon><UiIcon nama="users" class="size-7" /></template></UiStatCard>
      <UiStatCard label="Data Belum Lengkap" :nilai="stats.belumLengkap"><template #ikon><UiIcon nama="users" class="size-7" /></template></UiStatCard>
    </section>

    <section class="mt-6 rounded-2xl border border-line bg-white">
      <div class="flex flex-wrap items-center gap-3 px-6 pt-6 pb-4">
        <div class="w-full max-w-130"><UiSearchBox v-model="cari" placeholder="Search ..." /></div>
        <div class="ml-auto flex items-center gap-3">
          <UiFilterSelect v-model="filterJenis" :opsi="OPSI_JENIS" label="Filter jenis seminar" />
          <UiFilterSelect v-model="filterStatus" :opsi="OPSI_STATUS" label="Filter status validasi" />
          <UiButton variant="garis-biru" @click="importTerbuka = true">Import Data</UiButton>
        </div>
      </div>

      <div class="px-6">
        <div :class="GRID" class="h-12 items-center border-b border-line-soft text-[13px] font-semibold text-black">
          <span>Mahasiswa</span><span>NIM</span><span>Jenis</span><span>Pembimbing 1</span><span>Pembimbing 2</span><span>Penguji 1</span><span>Penguji 2</span><span>Status</span><span class="text-center">Aksi</span>
        </div>
        <ul class="min-h-60">
          <li v-for="m in halamanData" :key="m.id" :class="GRID" class="min-h-12.5 items-center border-b border-line-soft py-1.5 text-[12px] text-black">
            <span class="truncate pr-2">{{ m.nama }}</span>
            <span>{{ m.nim }}</span>
            <span><UiJenisChip :jenis="m.jenis" /></span>
            <span class="truncate pr-2">{{ m.pembimbing1 || "—" }}</span>
            <span class="truncate pr-2">{{ m.pembimbing2 || "—" }}</span>
            <select :value="m.penguji1" :class="SELECT_TABEL" :aria-label="`Penguji 1 ${m.nama}`" @change="setPenguji(m.id, 'penguji1', ($event.target as HTMLSelectElement).value)">
              <option value="">— Pilih —</option>
              <option v-for="n in opsiPenguji(m, 'penguji1')" :key="n" :value="n">{{ n }}</option>
            </select>
            <select :value="m.penguji2" :class="SELECT_TABEL" :aria-label="`Penguji 2 ${m.nama}`" @change="setPenguji(m.id, 'penguji2', ($event.target as HTMLSelectElement).value)">
              <option value="">— Pilih —</option>
              <option v-for="n in opsiPenguji(m, 'penguji2')" :key="n" :value="n">{{ n }}</option>
            </select>
            <span><UiStatusChip :tone="TONE[m.validasi]">{{ VALIDASI_LABEL[m.validasi] }}</UiStatusChip></span>
            <UiRowActions :nama="m.nama" @edit="bukaUbah(m)" @hapus="mintaHapus(m)" />
          </li>
          <li v-if="tampil.length === 0" class="py-14 text-center text-sm text-meta">
            {{ adaFilter ? "Tidak ada mahasiswa yang cocok." : "Belum ada data mahasiswa. Tambahkan manual atau gunakan Import Data." }}
          </li>
        </ul>
      </div>
      <UiPagination v-model="halaman" :total="tampil.length" :ukuran="UKURAN" />
    </section>

    <AdminWebMahasiswaFormModal v-model="formTerbuka" :mahasiswa="mahasiswaForm" />
    <AdminWebMahasiswaImportModal v-model="importTerbuka" />
    <UiConfirmDialog v-model="hapusTerbuka" judul="Hapus Mahasiswa?" @konfirmasi="hapusTerpilih">
      Data <strong class="text-[#334155]">{{ calonHapus?.nama }}</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
    </UiConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { VALIDASI_LABEL, type MahasiswaAdmin, type StatusValidasi } from "~/composables/useAdminMahasiswa";
import type { ChipTone } from "~/utils/ui";

const { daftar, stats, hapus, setPenguji } = useAdminMahasiswa();
const { aktif: dosenAktif } = useAdminDosen();
const toast = useAppToast();

const UKURAN = 8;
// kolom: Mahasiswa · NIM · Jenis · Pembimbing 1 · Pembimbing 2 · Penguji 1 · Penguji 2 · Status · Aksi
const GRID = "grid grid-cols-[minmax(0,1.15fr)_84px_82px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1.25fr)_112px_76px] gap-x-3";
const SELECT_TABEL = "h-8 w-full min-w-0 rounded-lg border border-[#d5dbe5] bg-white px-2 text-[11px] text-[#334155] outline-none focus:border-primary-500";
const TONE: Record<StatusValidasi, ChipTone> = { valid: "success", duplikat: "warning", belum_lengkap: "danger" };

const OPSI_JENIS = [
  { nilai: "semua", label: "Jenis" },
  { nilai: "sempro", label: "Sempro" },
  { nilai: "semhas", label: "Semhas" },
];
const OPSI_STATUS = [
  { nilai: "semua", label: "Status" },
  { nilai: "valid", label: "Valid" },
  { nilai: "duplikat", label: "Duplikat" },
  { nilai: "belum_lengkap", label: "Belum Lengkap" },
];

const cari = ref("");
const filterJenis = ref("semua");
const filterStatus = ref("semua");
const adaFilter = computed(() => !!cari.value.trim() || filterJenis.value !== "semua" || filterStatus.value !== "semua");

const tampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  return daftar.value.filter(
    (m) =>
      (filterJenis.value === "semua" || m.jenis === filterJenis.value) &&
      (filterStatus.value === "semua" || m.validasi === filterStatus.value) &&
      (!q || m.nama.toLowerCase().includes(q) || m.nim.includes(q)),
  );
});
const { halaman, potong: halamanData } = usePaginasi(tampil, UKURAN);
watch([cari, filterJenis, filterStatus], () => (halaman.value = 1));

// penguji tidak boleh sama dengan pembimbing maupun penguji lainnya
function opsiPenguji(m: MahasiswaAdmin, kolom: "penguji1" | "penguji2") {
  const lain = kolom === "penguji1" ? m.penguji2 : m.penguji1;
  const nama = dosenAktif.value.map((d) => d.nama).filter((n) => n !== m.pembimbing1 && n !== m.pembimbing2 && n !== lain);
  return m[kolom] && !nama.includes(m[kolom]) ? [m[kolom], ...nama] : nama;
}

const formTerbuka = ref(false);
const mahasiswaForm = ref<MahasiswaAdmin | null>(null);
const importTerbuka = ref(false);
const hapusTerbuka = ref(false);
const calonHapus = ref<MahasiswaAdmin | null>(null);

function bukaTambah() {
  mahasiswaForm.value = null;
  formTerbuka.value = true;
}
function bukaUbah(m: MahasiswaAdmin) {
  mahasiswaForm.value = m;
  formTerbuka.value = true;
}
function mintaHapus(m: MahasiswaAdmin) {
  calonHapus.value = m;
  hapusTerbuka.value = true;
}
function hapusTerpilih() {
  if (!calonHapus.value) return;
  hapus(calonHapus.value.id);
  toast.sukses("Mahasiswa dihapus", calonHapus.value.nama);
}
</script>
