<template>
  <!--  "Jadwal pribadi dosen - web" & "Tambah/Edit/Hapus Kegiatan dosen - web" -->
  <div class="max-w-312.25 pt-9 pr-8 pb-16 pl-8 xl:pr-12">
    <header class="flex items-start justify-between gap-4">
      <div class="leading-normal">
        <h1 class="text-[28px] leading-9 font-bold text-title">Jadwal Pribadi</h1>
        <p class="mt-0.5 text-sm text-meta">Semua jadwal mengajar semester ini</p>
      </div>
      <button
        type="button"
        class="flex h-12 shrink-0 items-center gap-3 rounded-full bg-primary-900 pr-6 pl-1.5 text-base font-medium text-white transition-opacity hover:opacity-90"
        @click="bukaTambah"
      >
        <span class="flex size-9 items-center justify-center rounded-full bg-white text-primary-900" aria-hidden="true">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
        Tambah Kegiatan
      </button>
    </header>

    <!-- Ringkasan minggu ini -->
    <section class="mt-3.5 grid grid-cols-3 gap-4" aria-label="Ringkasan minggu ini">
      <div v-for="k in ringkasan" :key="k.label" class="flex items-center gap-4 rounded-2xl bg-[#f0f4fa] px-5 py-4.5">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full text-white" :style="{ backgroundColor: k.warna }" aria-hidden="true">
          <svg class="size-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
        </span>
        <div class="leading-normal">
          <p class="text-sm text-label">{{ k.label }}</p>
          <p class="text-[26px] leading-8 font-bold text-title">{{ k.nilai }}</p>
        </div>
      </div>
    </section>

    <!-- Tab periode + pencarian -->
    <div class="mt-6 flex items-center justify-between gap-4">
      <div class="flex gap-1 rounded-full bg-[#eef3f9] p-1.5" role="tablist" aria-label="Periode jadwal">
        <button
          v-for="tab in TAB"
          :key="tab.nilai"
          type="button"
          role="tab"
          :aria-selected="periode === tab.nilai"
          class="rounded-full px-5 py-2 text-sm leading-5 font-semibold transition-colors"
          :class="periode === tab.nilai ? 'bg-primary-500 text-white' : 'text-meta hover:text-title'"
          @click="periode = tab.nilai"
        >
          {{ tab.label }}
        </button>
      </div>
      <label class="block">
        <span class="sr-only">Cari mata kuliah atau kegiatan</span>
        <input
          v-model="cari"
          type="search"
          placeholder="Cari mata kuliah / kegiatan..."
          class="h-10.5 w-64.5 rounded-full border border-line bg-white px-4 font-inter text-sm text-title outline-none placeholder:text-meta focus:border-primary-500"
        />
      </label>
    </div>

    <!-- Legenda -->
    <p class="mt-4 flex items-center gap-4 text-sm text-meta">
      <span class="inline-flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-primary-200" aria-hidden="true" />Mengajar</span>
      <span class="inline-flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-primary-900" aria-hidden="true" />Kegiatan Lain</span>
    </p>

    <!-- Daftar per hari -->
    <div v-if="kelompok.length" class="mt-4 flex flex-col gap-5">
      <section v-for="g in kelompok" :key="g.tanggal">
        <div class="flex items-center gap-2">
          <span class="size-2 rounded-full bg-primary-200" aria-hidden="true" />
          <h2 class="text-sm leading-5 font-bold text-primary-500">{{ formatHariTanggal(g.tanggal) }}</h2>
          <span class="rounded-full bg-line-soft px-2.5 py-1 text-xs leading-4 font-medium text-meta">{{ g.item.length }} agenda</span>
        </div>

        <ul class="mt-2.5 flex flex-col gap-2.5">
          <li
            v-for="k in g.item"
            :key="k.id"
            class="flex items-center gap-4 rounded-2xl px-6 py-4.5"
            :class="k.tipe === 'mengajar' ? 'border border-line bg-white' : 'bg-[#e3f0fc]'"
          >
            <div class="w-17.5 shrink-0 text-center leading-normal">
              <p class="text-base font-bold text-primary-500">{{ k.jam }}</p>
              <p class="text-xs text-meta">{{ k.durasi }} menit</p>
            </div>
            <span v-if="k.tipe === 'mengajar'" class="h-12 w-px shrink-0 bg-line" aria-hidden="true" />

            <div class="min-w-0 flex-1 leading-normal">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-base font-bold text-title">{{ k.judul }}</p>
                <span
                  class="rounded-full px-2.5 py-0.75 text-xs font-semibold"
                  :class="k.tipe === 'mengajar' ? 'bg-[#e8f1fc] text-primary-200' : 'bg-primary-200 text-primary-900'"
                >
                  {{ k.tipe === "mengajar" ? "Mengajar" : "Kegiatan Lain" }}
                </span>
              </div>
              <p class="mt-1 flex flex-wrap gap-x-8 text-sm text-meta">
                <span v-for="bagian in k.deskripsi.split(' · ')" :key="bagian">{{ bagian }}</span>
              </p>
            </div>

            <span
              class="flex min-w-17 shrink-0 flex-col items-center rounded-xl px-3 py-2 text-center text-xs leading-4.5 font-bold text-primary-500"
              :class="k.tipe === 'mengajar' ? 'bg-[#eef3f9]' : 'bg-[#eaf4fd]'"
            >
              <span>{{ pecahLokasi(k.lokasi)[0] }}</span>
              <span v-if="pecahLokasi(k.lokasi)[1]">{{ pecahLokasi(k.lokasi)[1] }}</span>
            </span>

            <div class="flex shrink-0 items-center gap-2">
              <button type="button" class="flex size-8 items-center justify-center rounded-lg text-[#475569] hover:bg-black/5" :aria-label="`Edit ${k.judul}`" @click="bukaEdit(k)">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><path d="M18.4 2.6a2 2 0 0 1 2.8 2.8L12 14.6 8 15.5l.9-4Z" /></svg>
              </button>
              <button type="button" class="flex size-8 items-center justify-center rounded-lg text-[#e53935] hover:bg-[#e53935]/10" :aria-label="`Hapus ${k.judul}`" @click="bukaHapus(k)">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6" /></svg>
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
    <p v-else class="mt-6 rounded-2xl border border-dashed border-line py-14 text-center text-sm text-meta">
      {{ cari ? "Tidak ada kegiatan yang cocok." : "Belum ada jadwal pada periode ini." }}
    </p>

    <!-- Dialog tambah / edit -->
    <DosenWebModalDialog v-model="dialogForm" :label="draft?.id === null ? 'Tambah Kegiatan' : 'Edit Kegiatan'" lebar="max-w-104.75">
      <form v-if="draft" novalidate @submit.prevent="simpan">
        <header class="flex items-center gap-3 border-b border-line-soft px-6 pt-5 pb-4">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-900 text-white" aria-hidden="true">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 12h6M9 16h4" /></svg>
          </span>
          <div class="min-w-0 flex-1 leading-normal">
            <h2 class="text-base font-bold text-title">{{ draft.id === null ? "Tambah Kegiatan" : "Edit Kegiatan" }}</h2>
            <p class="text-xs text-meta">Lengkapi informasi data Kegiatan</p>
          </div>
          <button type="button" class="flex size-8 items-center justify-center rounded-lg text-meta hover:bg-line-soft" aria-label="Tutup" @click="dialogForm = false">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <div class="grid grid-cols-2 gap-x-4.5 gap-y-3.5 px-6 pt-4 pb-6">
          <label class="col-span-2 block">
            <span :class="LABEL">Nama Kegiatan <b class="text-[#e11d48]">*</b></span>
            <input ref="namaEl" v-model="draft.judul" type="text" placeholder="Masukkan nama kegiatan" :class="[INPUT, salah.judul && SALAH]" @input="salah.judul = false" />
          </label>
          <label class="block">
            <span :class="LABEL">Waktu <b class="text-[#e11d48]">*</b></span>
            <input v-model="draft.jam" type="text" inputmode="decimal" placeholder="10.00" :class="[INPUT, salah.jam && SALAH]" @input="salah.jam = false" />
          </label>
          <label class="block">
            <span :class="LABEL">Lokasi <b class="text-[#e11d48]">*</b></span>
            <input v-model="draft.lokasi" type="text" placeholder="Nama ruangan" :class="[INPUT, salah.lokasi && SALAH]" @input="salah.lokasi = false" />
          </label>
          <label class="block">
            <span :class="LABEL">Rentang Waktu (menit) <b class="text-[#e11d48]">*</b></span>
            <input v-model.number="draft.durasi" type="number" min="1" step="1" inputmode="numeric" placeholder="60" :class="[INPUT, salah.durasi && SALAH]" @input="salah.durasi = false" />
          </label>
          <label class="block">
            <span :class="LABEL">Tanggal <b class="text-[#e11d48]">*</b></span>
            <input v-model="draft.tanggal" type="date" :class="[INPUT, salah.tanggal && SALAH]" @input="salah.tanggal = false" />
          </label>
          <label class="col-span-2 block">
            <span :class="LABEL">Deskripsi <b class="text-[#e11d48]">*</b></span>
            <input v-model="draft.deskripsi" type="text" placeholder="Tambahkan deskripsi kegiatan" :class="[INPUT, salah.deskripsi && SALAH]" @input="salah.deskripsi = false" />
          </label>
          <div class="col-span-2 mt-1.5 flex justify-end gap-3">
            <button type="button" class="h-10.5 rounded-xl bg-line-soft px-5.5 text-sm font-medium text-[#475569] hover:bg-[#e8ebf0]" @click="dialogForm = false">Batal</button>
            <button type="submit" class="h-10.5 rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white shadow-[0px_6px_14px_rgba(33,150,243,0.25)] hover:opacity-90">Simpan</button>
          </div>
        </div>
      </form>
    </DosenWebModalDialog>

    <!-- Dialog hapus -->
    <DosenWebModalDialog v-model="dialogHapus" label="Hapus Kegiatan" lebar="max-w-74.75">
      <div class="px-6 pt-6 pb-6 text-center">
        <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-[#fde3e8] text-[#d62931]" aria-hidden="true">
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6" /></svg>
        </span>
        <h2 class="mt-3.5 text-base font-bold text-title">Hapus Kegiatan?</h2>
        <p class="mt-1 text-xs leading-5 text-muted">
          Kegiatan <strong class="font-semibold text-[#334155]">{{ sasaranHapus?.judul }}</strong> akan dihapus.
        </p>
        <div class="mt-5 grid grid-cols-2 gap-3">
          <button type="button" class="h-10 rounded-xl bg-line-soft text-sm font-medium text-muted hover:bg-[#e8ebf0]" @click="dialogHapus = false">Batal</button>
          <button type="button" class="h-10 rounded-xl bg-[#c62828] text-sm font-semibold text-white hover:opacity-90" @click="konfirmasiHapus">Hapus</button>
        </div>
      </div>
    </DosenWebModalDialog>
  </div>
</template>

<script setup lang="ts">
import type { DraftKegiatan, Kegiatan } from "~/composables/useDosenSaya";
import { awalMinggu, formatHariTanggal, geserTanggal, tambahHari } from "~/utils/format";

const { kegiatan, simpanKegiatan, hapusKegiatan } = useDosenSaya();

const TAB = [
  { label: "Minggu Ini", nilai: "minggu" },
  { label: "Bulan Ini", nilai: "bulan" },
  { label: "Semua", nilai: "semua" },
] as const;

const LABEL = "block text-xs font-semibold text-[#334155]";
const INPUT =
  "mt-1.5 block h-10 w-full rounded-[10px] border border-line bg-[#f8f9fc] px-3.5 text-sm text-title outline-none placeholder:text-meta focus:border-primary-500";
const SALAH = "border-[#e11d48]!";

const periode = ref<"minggu" | "bulan" | "semua">("minggu");
const cari = ref("");

// ── data tampil ──
const hariIni = tambahHari(0);
const senin = awalMinggu(hariIni);
const minggu = computed(() => ({ dari: senin, sampai: geserTanggal(senin, 6) }));

const dalamPeriode = computed(() =>
  kegiatan.value.filter((k) => {
    if (periode.value === "minggu") return k.tanggal >= minggu.value.dari && k.tanggal <= minggu.value.sampai;
    if (periode.value === "bulan") return k.tanggal.slice(0, 7) === hariIni.slice(0, 7);
    return true;
  }),
);

const tampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  return dalamPeriode.value
    .filter((k) => !q || [k.judul, k.deskripsi, k.lokasi].some((t) => t.toLowerCase().includes(q)))
    .slice()
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.jam.localeCompare(b.jam));
});

const kelompok = computed(() => {
  const peta = new Map<string, Kegiatan[]>();
  for (const k of tampil.value) peta.set(k.tanggal, [...(peta.get(k.tanggal) ?? []), k]);
  return [...peta.entries()].map(([tanggal, item]) => ({ tanggal, item }));
});

const ringkasan = computed(() => {
  const pekan = kegiatan.value.filter((k) => k.tanggal >= minggu.value.dari && k.tanggal <= minggu.value.sampai);
  return [
    { label: "Sesi Minggu Ini", nilai: pekan.length, warna: "#70a1e5" },
    { label: "Kelas Mengajar", nilai: pekan.filter((k) => k.tipe === "mengajar").length, warna: "#2196f3" },
    { label: "Kegiatan Lain", nilai: pekan.filter((k) => k.tipe === "lain").length, warna: "#0d47a1" },
  ];
});

/** "Ruang Rapat Dekanat" → ["Ruang", "Rapat Dekanat"] (dua baris di chip, seperti Figma) */
function pecahLokasi(lokasi: string): [string, string] {
  const i = lokasi.indexOf(" ");
  return i === -1 ? [lokasi, ""] : [lokasi.slice(0, i), lokasi.slice(i + 1)];
}

function toast(type: "success" | "error", title: string, message: string) {
  (window as unknown as { $toast?: (p: object) => void }).$toast?.({ type, title, message });
}

// ── dialog tambah / edit ──
const dialogForm = ref(false);
const draft = ref<DraftKegiatan | null>(null);
const namaEl = ref<HTMLInputElement | null>(null);
const salah = reactive({ judul: false, jam: false, lokasi: false, durasi: false, tanggal: false, deskripsi: false });

function resetSalah() {
  Object.assign(salah, { judul: false, jam: false, lokasi: false, durasi: false, tanggal: false, deskripsi: false });
}

function bukaTambah() {
  draft.value = { id: null, tanggal: hariIni, jam: "", durasi: 60, judul: "", deskripsi: "", lokasi: "", tipe: "lain" };
  resetSalah();
  dialogForm.value = true;
  nextTick(() => namaEl.value?.focus());
}

function bukaEdit(k: Kegiatan) {
  draft.value = { ...k };
  resetSalah();
  dialogForm.value = true;
}

/** "9:30" / "09.30" → "09.30"; null bila bukan jam yang valid. */
function normalJam(teks: string): string | null {
  const m = teks.trim().match(/^(\d{1,2})[.:](\d{2})$/);
  if (!m) return null;
  const [j, mnt] = [Number(m[1]), Number(m[2])];
  if (j > 23 || mnt > 59) return null;
  return `${String(j).padStart(2, "0")}.${m[2]}`;
}

function simpan() {
  const d = draft.value;
  if (!d) return;
  const jam = normalJam(d.jam);
  salah.judul = !d.judul.trim();
  salah.jam = !jam;
  salah.lokasi = !d.lokasi.trim();
  salah.durasi = !Number.isInteger(d.durasi) || d.durasi < 1;
  salah.tanggal = !/^\d{4}-\d{2}-\d{2}$/.test(d.tanggal);
  salah.deskripsi = !d.deskripsi.trim();
  if (Object.values(salah).some(Boolean)) {
    toast("error", "Gagal Menyimpan", salah.jam && d.jam.trim() ? "Format waktu harus seperti 10.00." : "Lengkapi semua informasi kegiatan terlebih dahulu.");
    return;
  }
  const baru = d.id === null;
  simpanKegiatan({ ...d, jam: jam!, judul: d.judul.trim(), lokasi: d.lokasi.trim(), deskripsi: d.deskripsi.trim() });
  dialogForm.value = false;
  toast("success", baru ? "Berhasil Ditambahkan" : "Berhasil Disimpan", baru ? "Kegiatan baru berhasil ditambahkan." : "Perubahan kegiatan berhasil disimpan.");
  // pastikan kegiatan yang baru disimpan terlihat: lebarkan periode bila tanggalnya di luar periode aktif
  const tanggal = d.tanggal;
  const terlihat =
    periode.value === "semua" ||
    (periode.value === "minggu" && tanggal >= minggu.value.dari && tanggal <= minggu.value.sampai) ||
    (periode.value === "bulan" && tanggal.slice(0, 7) === hariIni.slice(0, 7));
  if (!terlihat) periode.value = "semua";
}

// ── dialog hapus ──
const dialogHapus = ref(false);
const sasaranHapus = ref<Kegiatan | null>(null);

function bukaHapus(k: Kegiatan) {
  sasaranHapus.value = k;
  dialogHapus.value = true;
}

function konfirmasiHapus() {
  if (sasaranHapus.value) {
    hapusKegiatan(sasaranHapus.value.id);
    toast("success", "Berhasil Dihapus", "Kegiatan berhasil dihapus dari jadwal pribadi.");
  }
  dialogHapus.value = false;
}
</script>
