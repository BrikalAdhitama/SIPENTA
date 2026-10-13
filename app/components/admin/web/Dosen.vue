<template>
  <!-- Admin · Dosen (web): tab Daftar Dosen & Jadwal Dosen. Versi mobile: AdminMobileDosenMobile. -->
  <div class="pt-7 pr-10 pb-14 pl-8">
    <div class="flex items-end justify-between gap-6">
      <div class="flex items-end" role="tablist">
        <button
          v-for="t in TAB"
          :key="t.nilai"
          type="button"
          role="tab"
          :aria-selected="tab === t.nilai"
          class="rounded-t-2xl px-6 text-center transition-colors"
          :class="tab === t.nilai ? 'h-12 bg-primary-500 text-lg font-semibold text-white shadow-[0px_4px_12px_rgba(33,150,243,0.35)]' : 'h-10 bg-[#f0f0f0] text-base text-[#bdbdbd] hover:text-[#9e9e9e]'"
          @click="gantiTab(t.nilai)"
        >
          {{ t.label }}
        </button>
      </div>
      <UiButton v-if="tab === 'daftar'" ikon-plus @click="bukaTambah">Tambah Dosen</UiButton>
    </div>

    <h1 class="mt-9 text-[32px] leading-10 font-bold text-ink">{{ tab === "daftar" ? "Data Dosen" : "Jadwal Dosen" }}</h1>

    <!--  Daftar Dosen  -->
    <template v-if="tab === 'daftar'">
      <section class="mt-7 grid max-w-262.5 grid-cols-3 gap-9">
        <UiStatCard label="Total Dosen" :nilai="stats.total"><template #ikon><UiIcon nama="user" class="size-7" /></template></UiStatCard>
        <UiStatCard label="Dosen Aktif" :nilai="stats.aktif"><template #ikon><UiIcon nama="user" class="size-7" /></template></UiStatCard>
        <UiStatCard label="Jadwal Mengajar" :nilai="stats.jadwalMengajar"><template #ikon><UiIcon nama="user" class="size-7" /></template></UiStatCard>
      </section>

      <section class="mt-8 max-w-278 rounded-2xl border border-line bg-white">
        <div class="flex items-center gap-4 px-6 pt-6 pb-4">
          <div class="w-full max-w-145"><UiSearchBox v-model="cari" placeholder="Search ..." /></div>
          <div class="ml-auto"><UiFilterSelect v-model="filterStatus" :opsi="OPSI_STATUS" label="Filter status" /></div>
        </div>

        <div class="px-6">
          <div :class="GRID_DAFTAR" class="h-12 items-center border-b border-line-soft text-[13px] font-medium text-black">
            <span class="pl-14">Nama Dosen</span><span class="text-center">NIP</span><span class="text-center">Email</span><span class="text-center">Bidang Keahlian</span><span class="text-center">Status</span><span class="text-center">Aksi</span>
          </div>
          <ul class="min-h-60">
            <li v-for="d in dosenHalaman" :key="d.id" :class="GRID_DAFTAR" class="h-12.5 items-center border-b border-line-soft text-[12.5px] text-black">
              <div class="flex min-w-0 items-center gap-3.5">
                <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0e8fb0] text-xs font-semibold text-white">{{ inisial(d.nama) }}</span>
                <span class="truncate">{{ namaLengkap(d) }}</span>
              </div>
              <span class="text-center">{{ d.nip }}</span>
              <span class="truncate text-center">{{ d.email || "—" }}</span>
              <span class="truncate text-center">{{ d.bidang || "—" }}</span>
              <span class="text-center"><UiStatusChip :tone="d.status === 'aktif' ? 'success' : 'neutral'">{{ d.status === "aktif" ? "Aktif" : "Tidak Aktif" }}</UiStatusChip></span>
              <UiRowActions :nama="d.nama" @edit="bukaUbah(d)" @hapus="mintaHapus(d)" />
            </li>
            <li v-if="dosenTampil.length === 0" class="py-14 text-center text-sm text-meta">
              {{ cari || filterStatus !== "semua" ? "Tidak ada dosen yang cocok." : "Belum ada data dosen." }}
            </li>
          </ul>
        </div>
        <UiPagination v-model="halDaftar" :total="dosenTampil.length" :ukuran="UKURAN" />
      </section>
    </template>

    <!-- ═══════ Jadwal Dosen ═══════ -->
    <template v-else>
      <UiStatStrip class="mt-7" lebar="max-w-123.5" :items="[
        { label: 'Total Jadwal', nilai: stats.jadwalMengajar, ikon: 'users' },
        { label: 'Jadwal Valid', nilai: stats.jadwalValid, ikon: 'briefcase' },
      ]" />

      <div class="mt-9 flex max-w-258 items-center gap-4">
        <div class="w-full max-w-145"><UiSearchBox v-model="cari" placeholder="Search ..." /></div>
        <div class="ml-auto flex items-center gap-3">
          <UiFilterSelect v-model="filterDosen" :opsi="OPSI_DOSEN" label="Filter dosen" />
          <UiFilterSelect v-model="filterHari" :opsi="OPSI_HARI" label="Filter hari" />
        </div>
      </div>

      <section class="mt-5 max-w-230 rounded-2xl border border-line bg-white">
        <div :class="GRID_JADWAL" class="h-12 items-center border-b border-line-soft text-[13px] font-semibold text-black">
          <span>No</span><span class="pl-14 text-center">Nama Dosen</span><span class="text-center">NIP</span><span class="text-center">Jumlah Jadwal</span><span />
        </div>
        <ul class="min-h-60">
          <li v-for="(d, i) in jadwalHalaman" :key="d.id" :class="GRID_JADWAL" class="h-16 items-center border-b border-line-soft text-[13px] text-[#334155]">
            <span class="text-[#94a3b8]">{{ (halJadwal - 1) * UKURAN + i + 1 }}</span>
            <div class="flex min-w-0 items-center gap-3">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#1e88e5] to-primary-900 text-xs font-semibold text-white">{{ inisial(d.nama) }}</span>
              <span class="truncate">{{ namaLengkap(d) }}</span>
            </div>
            <span class="text-center text-muted">{{ d.nip }}</span>
            <span class="text-center">
              <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs" :class="jumlahJadwal(d.id) > 0 ? 'bg-primary-100 text-primary-900' : 'bg-line-soft text-meta'">
                <UiIcon nama="calendar" class="size-3.5" /> {{ jumlahJadwal(d.id) }} jadwal
              </span>
            </span>
            <span class="text-right">
              <UiButton variant="garis-biru" kecil bentuk="kotak" class="h-8! px-4!" @click="bukaDetail(d.id)">Lihat Detail <UiIcon nama="chevron-right" class="size-3.5" /></UiButton>
            </span>
          </li>
          <li v-if="jadwalTampil.length === 0" class="py-14 text-center text-sm text-meta">Tidak ada dosen yang cocok.</li>
        </ul>
        <UiPagination v-model="halJadwal" :total="jadwalTampil.length" :ukuran="UKURAN" />
      </section>
    </template>

    <AdminWebDosenFormModal v-model="formTerbuka" :dosen="dosenForm" />
    <AdminWebDosenJadwalModal v-model="detailTerbuka" :dosen-id="detailId" />
    <UiConfirmDialog v-model="hapusTerbuka" judul="Hapus Dosen?" @konfirmasi="hapusTerpilih">
      Data dosen beserta seluruh jadwal mengajarnya akan dihapus.
    </UiConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { HARI_LABEL, HARI_MENGAJAR, namaLengkap, type Dosen } from "~/composables/useAdminDosen";
import { inisial } from "~/utils/format";

const { daftar, stats, jadwal, jadwalDosen, hapusDosen } = useAdminDosen();
const toast = useAppToast();

const UKURAN = 8;
const GRID_DAFTAR = "grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_minmax(0,1fr)_100px_80px] gap-x-3";
const GRID_JADWAL = "grid grid-cols-[50px_minmax(0,1.8fr)_minmax(0,1.3fr)_minmax(0,1fr)_150px] gap-x-3 px-6";

const TAB = [
  { nilai: "daftar", label: "Daftar Dosen" },
  { nilai: "jadwal", label: "Jadwal Dosen" },
] as const;
const tab = ref<"daftar" | "jadwal">("daftar");
const cari = ref("");

function gantiTab(t: "daftar" | "jadwal") {
  tab.value = t;
  cari.value = "";
}

const cocok = (d: Dosen, q: string) => !q || [d.nama, d.gelar, d.nip, d.email, d.bidang].some((t) => t.toLowerCase().includes(q));

// ── Daftar Dosen ──
const OPSI_STATUS = [
  { nilai: "semua", label: "Status" },
  { nilai: "aktif", label: "Aktif" },
  { nilai: "nonaktif", label: "Tidak Aktif" },
];
const filterStatus = ref("semua");

const dosenTampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  return daftar.value.filter((d) => (filterStatus.value === "semua" || d.status === filterStatus.value) && cocok(d, q));
});
const { halaman: halDaftar, potong: dosenHalaman } = usePaginasi(dosenTampil, UKURAN);

// ── Jadwal Dosen ──
const filterDosen = ref("semua");
const filterHari = ref("semua");
const OPSI_DOSEN = computed(() => [{ nilai: "semua", label: "Semua Dosen" }, ...daftar.value.map((d) => ({ nilai: String(d.id), label: d.nama }))]);
const OPSI_HARI = [{ nilai: "semua", label: "Semua Hari" }, ...HARI_MENGAJAR.map((h) => ({ nilai: h, label: HARI_LABEL[h] }))];
const jumlahJadwal = (id: number) => jadwalDosen(id).length;

const jadwalTampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  return daftar.value.filter(
    (d) =>
      (filterDosen.value === "semua" || String(d.id) === filterDosen.value) &&
      (filterHari.value === "semua" || jadwal.value.some((j) => j.dosenId === d.id && j.hari === filterHari.value)) &&
      cocok(d, q),
  );
});
const { halaman: halJadwal, potong: jadwalHalaman } = usePaginasi(jadwalTampil, UKURAN);

// kembali ke halaman 1 saat pencarian/filter berubah
watch([cari, filterStatus], () => (halDaftar.value = 1));
watch([cari, filterDosen, filterHari], () => (halJadwal.value = 1));

// ── dialog ──
const formTerbuka = ref(false);
const dosenForm = ref<Dosen | null>(null);
const detailTerbuka = ref(false);
const detailId = ref<number | null>(null);
const hapusTerbuka = ref(false);
const calonHapus = ref<Dosen | null>(null);

function bukaTambah() {
  dosenForm.value = null;
  formTerbuka.value = true;
}
function bukaUbah(d: Dosen) {
  dosenForm.value = d;
  formTerbuka.value = true;
}
function bukaDetail(id: number) {
  detailId.value = id;
  detailTerbuka.value = true;
}
function mintaHapus(d: Dosen) {
  calonHapus.value = d;
  hapusTerbuka.value = true;
}
function hapusTerpilih() {
  if (!calonHapus.value) return;
  hapusDosen(calonHapus.value.id);
  toast.sukses("Dosen dihapus", calonHapus.value.nama);
}
</script>
