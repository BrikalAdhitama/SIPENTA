<template>
  <!--"dashboard dosen - web" -->
  <div class="max-w-312.25 pt-9 pr-8 pb-16 pl-8 xl:pr-13.5">
    <header class="leading-normal">
      <h1 class="text-[43px] font-semibold text-heading">Selamat datang, {{ user.nama }}</h1>
      <p class="text-[15px] text-subtle">Lihat jadwal seminar dan sidang Anda</p>
    </header>

    <!-- Overview -->
    <section class="mt-4 max-w-224.5">
      <div class="flex items-center justify-between">
        <h2 class="text-[22px] leading-normal tracking-[0.22px]">Overview</h2>
        <button type="button" class="flex h-8.5 items-center gap-3 rounded-[17px] bg-white px-3.5 text-sm tracking-[0.14px]">
          Last 30 days
          <img src="/icons/chevron.svg" alt="" class="size-3.5 -rotate-90" />
        </button>
      </div>

      <div class="mt-5 grid grid-cols-3 gap-4 xl:gap-12.5">
        <div
          v-for="card in cards"
          :key="card.label"
          class="flex h-49 flex-col gap-2.5 rounded-[14px] bg-primary-100/34 pt-4.5 pr-4 pb-6 pl-4.5"
        >
          <div class="flex flex-col gap-5">
            <span class="flex w-fit items-center rounded-[26px] p-3" :style="{ backgroundColor: card.iconBg }">
              <span class="flex size-5.5 items-center justify-center">
                <img :src="card.icon" alt="" class="max-w-none" :style="{ width: `${card.iconSize[0]}px`, height: `${card.iconSize[1]}px` }" />
              </span>
            </span>
            <div class="flex flex-col gap-2.5 leading-normal whitespace-nowrap">
              <p class="text-sm text-label">{{ card.label }}</p>
              <p class="text-[28px] font-semibold text-black">{{ card.value }}</p>
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

    <div class="mt-11 grid max-w-276.25 grid-cols-[minmax(0,1fr)_319px] items-start gap-5">
      <!-- Jadwal Sempro dan Semhas -->
      <section class="rounded-3xl border border-line bg-white pt-5.5 shadow-card">
        <div class="flex items-center gap-2.5 px-5">
          <span class="h-6 w-1 shrink-0 rounded-full bg-[#2563eb]" aria-hidden="true" />
          <h2 class="flex-1 text-xl leading-normal font-bold text-title">Jadwal Sempro dan Semhas</h2>
          <span class="rounded-full bg-line-soft px-3 py-1.5 text-xs leading-normal font-semibold text-meta">
            {{ agenda.length }} agenda
          </span>
        </div>

        <ul class="mt-4 flex flex-col gap-3 px-5">
          <li
            v-for="a in agenda"
            :key="a.id"
            class="grid min-h-33.5 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 rounded-[20px] border border-line bg-white py-4 pr-5 pl-9"
          >
            <!-- mahasiswa -->
            <div class="flex items-center gap-4">
              <span class="flex size-11.75 shrink-0 items-center justify-center rounded-full bg-primary-500 text-base leading-none font-bold text-white">
                {{ a.inisial }}
              </span>
              <div class="flex min-w-0 flex-col items-center gap-2">
                <p class="truncate text-[15px] leading-normal font-bold text-title">{{ a.mahasiswa }}</p>
                <span
                  class="rounded-full px-4 py-1.25 text-sm leading-normal"
                  :class="a.jenis === 'sempro' ? 'bg-sempro-soft/50 text-sempro' : 'bg-semhas-soft text-semhas'"
                >
                  {{ a.jenis === "sempro" ? "Sempro" : "Semhas" }}
                </span>
              </div>
            </div>

            <!-- tanggal, jam, ruangan -->
            <ul class="flex flex-col gap-3.75 text-base leading-5 font-bold text-primary-900">
              <li class="flex items-center gap-4">
                <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                </svg>
                {{ formatTanggalPanjang(a.tanggal) }}
              </li>
              <li class="flex items-center gap-4">
                <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {{ a.jamMulai }} - {{ a.jamSelesai }}
              </li>
              <li class="flex items-center gap-4">
                <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {{ a.ruangan }}
              </li>
            </ul>

            <!-- peran dosen pada seminar ini -->
            <span class="rounded-full bg-primary-100 px-4 py-2 text-[13px] leading-normal font-bold text-primary-900">
              {{ perannya(a.peran) }}
            </span>
          </li>
          <li v-if="agenda.length === 0" class="py-8 text-center text-sm text-meta">Belum ada agenda seminar.</li>
        </ul>

        <div class="mt-2.5 pr-9 pb-6 text-right">
          <NuxtLink to="/dosen/jadwal-seminar" class="text-base leading-normal font-medium text-primary-500 hover:text-primary-900">
            Lihat semua →
          </NuxtLink>
        </div>
      </section>

      <!-- Perhatian -->
      <section class="rounded-3xl border border-[#e4ecfb] bg-[linear-gradient(135deg,#eef3fe_0%,#f9fbff_100%)] px-4.5 pt-5 pb-4.5">
        <h2 class="text-sm leading-5 font-bold text-primary-900">Perhatian</h2>
        <p class="mt-1.75 text-xs leading-4.5 text-meta">{{ perhatian }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Peran } from "~/types/domain";
import { formatTanggalPanjang } from "~/utils/format";

const { user } = useCurrentUser();
const { stats, agenda, perhatian } = useDosenSaya();

const cards = computed(() => [
  {
    label: "Jadwal Bimbingan",
    value: stats.value.jadwalBimbingan,
    icon: "/icons/stat-chart.svg",
    iconSize: [19.5, 21.5],
    iconBg: "#ff82ac",
    trendIcon: "/icons/trend-up.svg",
    trendUp: true,
    note: "Mahasiswa",
  },
  {
    label: "Jadwal Pengujian",
    value: stats.value.jadwalPengujian,
    icon: "/icons/stat-briefcase.svg",
    iconSize: [19.25, 19.71],
    iconBg: "#e89271",
    trendIcon: "/icons/trend-down.svg",
    trendUp: false,
    note: "Seminar",
  },
  {
    label: "Menunggu Persetujuan",
    value: stats.value.menungguPersetujuan,
    icon: "/icons/stat-clock.svg",
    iconSize: [19.71, 19.71],
    iconBg: "#70a1e5",
    trendIcon: "/icons/trend-up.svg",
    trendUp: true,
    note: "Jadwal Seminar",
  },
]);

const perannya = (p: Peran) => (p.startsWith("pembimbing") ? "Pembimbing" : "Penguji");
</script>
