<template>
  <!-- Figma "Dashboard admin - web" (node 113:2077). Lebar konten desain: 1120px. -->
  <div class="max-w-312.25 pt-6.75 pr-8 pb-8 pl-8.25 xl:pr-24">
    <!-- Sapaan + tombol utama -->
    <header class="flex items-start justify-between gap-6">
      <div class="leading-normal">
        <h1 class="text-[43px] font-semibold text-heading">Selamat Datang, {{ user.namaPanggilan }}</h1>
        <p class="text-[15px] text-subtle">Ringkasan aktivitas penjadwalan seminar</p>
      </div>
      <NuxtLink
        to="/admin/penjadwalan"
        class="mt-4.5 flex shrink-0 items-center gap-2.5 rounded-3xl bg-primary-900 py-1.25 pr-5 pl-1.75 text-base leading-normal text-white hover:bg-primary-900/90"
      >
        <span class="flex items-center justify-center rounded-3xl bg-white p-1.25">
          <img src="/icons/plus-circle.svg" alt="" class="size-6" />
        </span>
        Buat Penjadwalan
      </NuxtLink>
    </header>

    <!-- Overview -->
    <section class="mt-13.75">
      <div class="flex items-center justify-between">
        <h2 class="text-[22px] leading-normal tracking-[0.22px]">Overview</h2>
        <button type="button" class="flex h-8.5 items-center gap-3 rounded-[17px] bg-white px-3.5 text-sm tracking-[0.14px]">
          Last 30 days
          <img src="/icons/chevron.svg" alt="" class="size-3.5 -rotate-90" />
        </button>
      </div>

      <div class="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div
          v-for="card in cards"
          :key="card.label"
          class="flex h-49 flex-col gap-2.5 rounded-[14px] bg-primary-100/34 pt-4.5 pr-10.75 pb-6 pl-4.5"
        >
          <div class="flex flex-col gap-5">
            <span class="flex w-fit items-center rounded-[26px] p-3" :style="{ backgroundColor: card.iconBg }">
              <span class="flex size-5.5 items-center justify-center">
                <img :src="card.icon" alt="" class="max-w-none" :style="{ width: `${card.iconSize[0]}px`, height: `${card.iconSize[1]}px` }" />
              </span>
            </span>
            <div class="flex flex-col gap-2.5 leading-normal whitespace-nowrap">
              <p class="text-sm text-label">{{ card.label }}</p>
              <p class="text-[28px] font-semibold text-black">
                {{ card.value }}<span v-if="card.suffix" class="ml-1.5 text-base font-normal tracking-[0.64px] text-body">{{ card.suffix }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <span class="flex size-3.5 shrink-0 items-center justify-center">
              <img
                :src="card.trendIcon"
                alt=""
                class="h-[7.96px] w-[10.79px] max-w-none"
                :class="card.trendUp ? '-rotate-45' : 'rotate-45'"
              />
            </span>
            <p class="text-[10px] leading-normal">{{ card.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Jadwal Terbaru -->
    <section class="mt-7 min-h-87.25 w-full max-w-168 rounded-[14px] border border-primary-900 px-4.5 pt-4.5 pb-2.5">
      <div class="flex items-center">
        <h2 class="flex-1 text-base leading-normal tracking-[0.16px]">Jadwal Terbaru</h2>

        <div class="relative">
          <button
            type="button"
            class="flex h-8.5 items-center gap-2.5 rounded-[17px] bg-white px-3.5 text-sm tracking-[0.14px]"
            :aria-expanded="filterOpen"
            @click="filterOpen = !filterOpen"
          >
            {{ filterLabel }}
            <img src="/icons/chevron.svg" alt="" class="size-3.5 transition-transform" :class="filterOpen ? 'rotate-90' : '-rotate-90'" />
          </button>
          <div
            v-if="filterOpen"
            class="absolute right-0 z-10 mt-1 w-32 rounded-xl border border-border bg-white py-1 text-sm shadow-lg"
          >
            <button
              v-for="opt in FILTERS"
              :key="opt.value"
              type="button"
              class="block w-full px-4 py-2 text-left hover:bg-primary-50"
              :class="{ 'font-medium text-primary-900': filter === opt.value }"
              @click="pilihFilter(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <NuxtLink to="/admin/jadwal" class="ml-8 font-inter text-xs leading-4 font-medium text-primary-900 hover:underline">
          Lihat selengkapnya →
        </NuxtLink>
      </div>

      <div class="mt-4.5 px-1.75 text-sm">
        <div :class="GRID" class="tracking-[0.14px]">
          <span>TANGGAL</span>
          <span class="text-center">JAM</span>
          <span class="text-center">RUANGAN</span>
          <span class="text-center">MAHASISWA</span>
          <span class="text-center">JENIS</span>
        </div>
        <img src="/icons/table-divider.svg" alt="" class="my-2.5 h-px w-full" />

        <ul class="flex flex-col gap-4.5">
          <li v-for="j in jadwalTampil" :key="j.id" :class="GRID" class="h-6.5 items-center whitespace-nowrap">
            <span>{{ formatTanggalPendek(j.tanggal) }}</span>
            <span class="text-center">{{ formatJam(j.jamMulai, j.jamSelesai) }}</span>
            <span class="text-center"><UiRuanganChip :kode="j.ruangan" /></span>
            <span class="truncate text-center">{{ j.mahasiswa }}</span>
            <span class="text-center"><UiJenisChip :jenis="j.jenis" /></span>
          </li>
          <li v-if="jadwalTampil.length === 0" class="py-6 text-center text-subtle">Belum ada jadwal.</li>
        </ul>
      </div>
    </section>

    <!-- Aksi Cepat -->
    <section class="mt-2.25 ml-1">
      <h2 class="text-[22px] leading-normal font-medium">Aksi Cepat</h2>
      <div class="mt-3 flex flex-wrap gap-7.5">
        <NuxtLink
          v-for="aksi in AKSI"
          :key="aksi.label"
          :to="aksi.to"
          class="flex h-9 w-45.75 items-center gap-1.5 rounded-[20px] bg-[linear-gradient(-62.86deg,#2196f3_44.33%,#90caf9_98.56%)] px-2.25 font-mulish text-base font-semibold text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-transform active:scale-95"
          :class="{ 'flex-row-reverse pr-5.25': aksi.iconRight }"
        >
          <img :src="aksi.icon" alt="" class="size-5 shrink-0" :class="aksi.iconClass" />
          <span class="flex-1 text-center">{{ aksi.label }}</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { JenisSeminar } from "~/types/domain";
import { formatJam, formatTanggalPendek } from "~/utils/format";

const { user } = useCurrentUser();
const { stats, jadwalTerbaru } = useAdminDashboard();

// kolom tabel — posisi tengah tiap kolom mengikuti Figma
const GRID = "grid grid-cols-[134px_109px_125px_131px_1fr]";

const cards = computed(() => [
  {
    label: "Total Mahasiswa",
    value: stats.value.totalMahasiswa,
    icon: "/icons/stat-chart.svg",
    iconSize: [19.5, 21.5],
    iconBg: "#ff82ac",
    trendIcon: "/icons/trend-up.svg",
    trendUp: true,
    note: stats.value.semesterLabel,
  },
  {
    label: "Seminar Proposal",
    value: stats.value.sempro,
    icon: "/icons/stat-briefcase.svg",
    iconSize: [19.25, 19.71],
    iconBg: "#e89271",
    trendIcon: "/icons/trend-down.svg",
    trendUp: false,
    note: "Mahasiswa",
  },
  {
    label: "Seminar Hasil",
    value: stats.value.semhas,
    icon: "/icons/stat-clock.svg",
    iconSize: [19.71, 19.71],
    iconBg: "#70a1e5",
    trendIcon: "/icons/trend-up.svg",
    trendUp: true,
    note: "Mahasiswa",
  },
  {
    label: "Ruangan Aktif",
    value: stats.value.ruanganAktif,
    suffix: `/${stats.value.ruanganTotal}`,
    icon: "/icons/stat-layer.svg",
    iconSize: [17.88, 18.47],
    iconBg: "#ffbb38",
    trendIcon: "/icons/trend-up-2.svg",
    trendUp: true,
    note: stats.value.ruanganLabel,
  },
]);

type Filter = "semua" | JenisSeminar;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "sempro", label: "Sempro" },
  { value: "semhas", label: "Semhas" },
];
const filter = ref<Filter>("semua");
const filterOpen = ref(false);
const filterLabel = computed(() => FILTERS.find((f) => f.value === filter.value)!.label);
const jadwalTampil = computed(() =>
  filter.value === "semua" ? jadwalTerbaru.value : jadwalTerbaru.value.filter((j) => j.jenis === filter.value),
);
function pilihFilter(v: Filter) {
  filter.value = v;
  filterOpen.value = false;
}

const AKSI = [
  { label: "Buat Penjadwalan", to: "/admin/penjadwalan", icon: "/icons/qa-plus.svg" },
  { label: "Upload Data SPS", to: "/admin/penjadwalan", icon: "/icons/qa-arrow-up.svg", iconClass: "-rotate-90" },
  { label: "Lihat Jadwal", to: "/admin/jadwal", icon: "/icons/qa-arrow.svg", iconRight: true },
];
</script>
