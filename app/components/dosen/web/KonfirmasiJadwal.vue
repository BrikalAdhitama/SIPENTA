<template>
  <!-- "Konfirmasi Jadwal dosen - web" + "Tolak konfirmasi jadwal dosen - web" -->
  <div class="max-w-312.25 pt-9 pr-8 pb-16 pl-10.5 xl:pr-12">
    <header class="leading-normal">
      <h1 class="text-[28px] leading-9 font-bold text-title">Konfirmasi Jadwal</h1>
      <p class="mt-1 text-sm text-meta">Setujui atau tolak permintaan jadwal seminar mahasiswa</p>
    </header>

    <!-- Ringkasan -->
    <section class="mt-6.5 grid grid-cols-3 gap-4" aria-label="Ringkasan konfirmasi">
      <div v-for="k in ringkasan" :key="k.label" class="flex items-center gap-3.5 rounded-2xl bg-[#f1f5fb] px-5 py-4.5">
        <span class="flex size-12 shrink-0 items-center justify-center rounded-full text-white" :class="k.warna" aria-hidden="true">
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="k.ikon === 'jam'"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></template>
            <path v-else-if="k.ikon === 'cek'" d="m5 12.5 4.5 4.5L19 7.5" />
            <path v-else d="m7 7 10 10M17 7 7 17" />
          </svg>
        </span>
        <div class="leading-normal">
          <p class="text-sm text-label">{{ k.label }}</p>
          <p class="text-[22px] leading-7 font-bold text-title">{{ k.nilai }}</p>
        </div>
      </div>
    </section>

    <!-- Tab status + pencarian -->
    <div class="mt-5.5 flex items-center justify-between gap-4">
      <div class="flex gap-1 rounded-full bg-[#eef3f9] p-1" role="tablist" aria-label="Filter status">
        <button
          v-for="tab in TAB"
          :key="tab.nilai"
          type="button"
          role="tab"
          :aria-selected="filter === tab.nilai"
          class="rounded-full px-5 py-2.5 text-sm leading-5 font-medium transition-colors"
          :class="filter === tab.nilai ? 'bg-primary-900 text-white' : 'text-meta hover:text-title'"
          @click="filter = tab.nilai"
        >
          {{ tab.label }}
        </button>
      </div>
      <label class="block">
        <span class="sr-only">Cari mahasiswa</span>
        <input
          v-model="cari"
          type="search"
          placeholder="Cari nama mahasiswa..."
          class="h-10.5 w-53 rounded-full border border-line bg-white px-4 font-inter text-sm text-title outline-none placeholder:text-meta focus:border-primary-500"
        />
      </label>
    </div>

    <!-- Daftar permintaan -->
    <ul class="mt-4 flex flex-col gap-3.5">
      <li
        v-for="k in tampil"
        :key="k.id"
        class="flex items-center gap-4 rounded-2xl border border-[#e3eefb] bg-white px-6 py-4.5"
        :class="k.status === 'menunggu' ? '' : 'opacity-60'"
      >
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-500 text-[15px] leading-none font-bold text-white" aria-hidden="true">
          {{ k.inisial }}
        </span>
        <div class="min-w-0 flex-1 leading-normal">
          <div class="flex flex-wrap items-center gap-2.5">
            <p class="text-base font-bold text-title">{{ k.mahasiswa }}</p>
            <span class="rounded-full bg-primary-100 px-2.5 py-0.75 text-xs font-semibold text-primary-500">{{ JENIS_UI_LABEL[k.jenis] }}</span>
          </div>
          <p class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-meta">
            <span class="inline-flex items-center gap-1">
              <svg class="size-3.5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              {{ formatTanggalPendek(k.tanggal) }}, {{ k.jam }}
            </span>
            <span class="inline-flex items-center gap-1">
              <svg class="size-3.5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              Ruang {{ k.ruangan }}
            </span>
            <span class="inline-flex items-center gap-1">
              <svg class="size-3.5 text-primary-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 10-10-5L2 10l10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></svg>
              Peran: {{ PERAN_LABEL[k.peran] }}
            </span>
          </p>
        </div>

        <template v-if="k.status === 'menunggu'">
          <span class="rounded-full bg-[#fdf0d5] px-4 py-1.5 text-xs font-semibold text-[#e0a020]">Menunggu</span>
          <button
            type="button"
            class="h-10.5 rounded-full border border-[#f6cfd6] bg-white px-6 text-sm font-semibold text-[#e0262b] transition-colors hover:bg-[#fff5f6]"
            @click="bukaTolak(k)"
          >
            Tolak
          </button>
          <button
            type="button"
            class="h-10.5 rounded-full bg-primary-900 px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            @click="setujui(k)"
          >
            Konfirmasi
          </button>
        </template>
        <span
          v-else
          class="rounded-full px-4 py-1.5 text-xs font-semibold"
          :class="k.status === 'terkonfirmasi' ? 'bg-success/12 text-success' : 'bg-danger/12 text-[#e0262b]'"
          :title="k.status === 'ditolak' && k.alasanTolak ? `Alasan: ${k.alasanTolak}` : undefined"
        >
          {{ k.status === "terkonfirmasi" ? "Terkonfirmasi" : "Ditolak" }}
        </span>
      </li>

      <li v-if="tampil.length === 0" class="rounded-2xl border border-dashed border-line py-12 text-center text-sm text-meta">
        {{ cari || filter !== "semua" ? "Tidak ada permintaan yang cocok." : "Belum ada permintaan jadwal." }}
      </li>
    </ul>

    <!-- Dialog tolak -->
    <DosenWebModalDialog v-model="dialogTolak" label="Tolak Konfirmasi Jadwal" lebar="max-w-119.5">
      <form novalidate @submit.prevent="kirimTolak">
        <header class="flex items-start justify-between gap-4 border-b border-line-soft px-5.5 pt-5 pb-3.5">
          <div class="leading-normal">
            <h2 class="text-lg font-bold text-title">Tolak Konfirmasi Jadwal</h2>
            <p class="text-xs text-meta">Berikan Alasan menolak jadwal</p>
          </div>
          <button type="button" class="flex size-8 items-center justify-center rounded-lg text-meta hover:bg-line-soft" aria-label="Tutup" @click="dialogTolak = false">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>
        <div class="px-5.5 pt-4 pb-5">
          <label class="block">
            <span class="text-xs font-semibold text-[#334155]">Alasan <b class="text-[#e11d48]">*</b></span>
            <textarea
              ref="alasanEl"
              v-model="alasan"
              rows="4"
              placeholder="Masukkan Alasan"
              class="mt-2 block h-24.5 w-full resize-none rounded-[10px] border bg-[#f8f9fc] px-3.5 py-2.5 text-sm text-title outline-none placeholder:text-meta focus:border-primary-500"
              :class="alasanKosong ? 'border-[#e11d48]' : 'border-line'"
              @input="alasanKosong = false"
            />
          </label>
          <p v-if="alasanKosong" class="mt-1.5 text-xs text-[#e11d48]">Alasan wajib diisi.</p>
          <div class="mt-5 flex justify-end gap-3">
            <button type="button" class="h-10 rounded-[10px] bg-line-soft px-5.5 text-sm font-medium text-[#475569] hover:bg-[#e8ebf0]" @click="dialogTolak = false">Batal</button>
            <button type="submit" class="h-10 rounded-[10px] bg-[#ffd9d9] px-5.5 text-sm font-semibold text-[#e0262b] hover:bg-[#ffc9c9]">Tolak</button>
          </div>
        </div>
      </form>
    </DosenWebModalDialog>
  </div>
</template>

<script setup lang="ts">
import type { KonfirmasiItem, StatusKonfirmasi } from "~/composables/useDosenSaya";
import { JENIS_UI_LABEL, PERAN_LABEL } from "~/types/domain";
import { formatTanggalPendek } from "~/utils/format";

const { konfirmasi, jumlahKonfirmasi, konfirmasiJadwal, tolakJadwal } = useDosenSaya();

const TAB: { label: string; nilai: "semua" | StatusKonfirmasi }[] = [
  { label: "Semua", nilai: "semua" },
  { label: "Menunggu", nilai: "menunggu" },
  { label: "Terkonfirmasi", nilai: "terkonfirmasi" },
  { label: "Ditolak", nilai: "ditolak" },
];

const filter = ref<"semua" | StatusKonfirmasi>("semua");
const cari = ref("");

const ringkasan = computed(() => [
  { label: "Menunggu Konfirmasi", nilai: jumlahKonfirmasi.value.menunggu, warna: "bg-[#e0a020]", ikon: "jam" },
  { label: "Terkonfirmasi", nilai: jumlahKonfirmasi.value.terkonfirmasi, warna: "bg-[#22a55a]", ikon: "cek" },
  { label: "Ditolak", nilai: jumlahKonfirmasi.value.ditolak, warna: "bg-[#e53935]", ikon: "x" },
]);

const tampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  return konfirmasi.value
    .filter((k) => filter.value === "semua" || k.status === filter.value)
    .filter((k) => !q || k.mahasiswa.toLowerCase().includes(q));
});

function toast(type: "success" | "error", title: string, message: string) {
  (window as unknown as { $toast?: (p: object) => void }).$toast?.({ type, title, message });
}

function setujui(k: KonfirmasiItem) {
  konfirmasiJadwal(k.id);
  toast("success", "Jadwal Dikonfirmasi", `Jadwal ${k.mahasiswa} berhasil dikonfirmasi.`);
}

// ── dialog tolak ──
const dialogTolak = ref(false);
const sasaran = ref<KonfirmasiItem | null>(null);
const alasan = ref("");
const alasanKosong = ref(false);
const alasanEl = ref<HTMLTextAreaElement | null>(null);

function bukaTolak(k: KonfirmasiItem) {
  sasaran.value = k;
  alasan.value = "";
  alasanKosong.value = false;
  dialogTolak.value = true;
  nextTick(() => alasanEl.value?.focus());
}

function kirimTolak() {
  if (!alasan.value.trim()) {
    alasanKosong.value = true;
    return;
  }
  if (sasaran.value) {
    tolakJadwal(sasaran.value.id, alasan.value);
    toast("success", "Jadwal Ditolak", `Jadwal ${sasaran.value.mahasiswa} berhasil ditolak.`);
  }
  dialogTolak.value = false;
}
</script>
