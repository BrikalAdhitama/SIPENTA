<template>
  <!-- Figma "Jadwal Seminar dosen - web" -->
  <div class="max-w-312.25 pt-9 pr-8 pb-16 pl-10.5 xl:pr-12">
    <header class="leading-normal">
      <h1 class="text-[28px] leading-9 font-bold text-title">Jadwal Seminar</h1>
      <p class="mt-1 text-sm text-meta">Semua jadwal seminar proposal dan hasil semester ini</p>
    </header>

    <section class="mt-6.5 overflow-hidden rounded-2xl border border-line bg-white">
      <!-- Tab jenis + pencarian -->
      <div class="flex items-center justify-between gap-4 px-4.5 py-3.5">
        <div class="flex gap-1 rounded-xl bg-line-soft p-1" role="tablist" aria-label="Filter jenis seminar">
          <button
            v-for="tab in TAB"
            :key="tab.nilai"
            type="button"
            role="tab"
            :aria-selected="filter === tab.nilai"
            class="rounded-lg px-3.5 py-1.5 text-sm leading-5 transition-colors"
            :class="filter === tab.nilai ? 'bg-white font-medium text-title shadow-[0px_1px_2px_rgba(0,0,0,0.08)]' : 'text-meta hover:text-title'"
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
            placeholder="Cari nama / NIM..."
            class="h-9.5 w-62 rounded-[10px] border border-line bg-[#fafbfd] px-3 font-inter text-sm text-title outline-none placeholder:text-meta focus:border-primary-500"
          />
        </label>
      </div>

      <!-- Tabel -->
      <div class="overflow-x-auto">
        <div class="min-w-210">
          <div :class="GRID" class="h-12.5 items-center border-y border-line-soft text-[13px] font-medium text-meta">
            <span>Mahasiswa</span>
            <span class="text-center">Jenis</span>
            <span>Judul</span>
            <span>Tanggal</span>
            <span class="text-center">Waktu</span>
            <span>Ruangan</span>
            <span class="text-center">Status</span>
          </div>

          <ul>
            <li v-for="s in tampil" :key="s.id" :class="GRID" class="min-h-14.75 items-center border-b border-line-soft py-2 last:border-b-0">
              <div class="min-w-0 leading-normal">
                <p class="truncate text-[15px] font-medium text-title">{{ s.mahasiswa }}</p>
                <p class="text-xs text-meta">{{ s.nim }}</p>
              </div>
              <span class="text-center"><UiJenisChip :jenis="s.jenis" /></span>
              <p class="pr-2 text-[13.5px] leading-5 text-title">{{ s.judul }}</p>
              <p class="text-sm whitespace-nowrap text-title">{{ formatTanggalPendek(s.tanggal) }}</p>
              <p class="text-center text-sm whitespace-nowrap text-title">{{ s.jamMulai }} - {{ s.jamSelesai }}</p>
              <p class="text-sm text-title">{{ s.ruangan }}</p>
              <span class="text-center">
                <span class="inline-flex items-center rounded-full px-3.5 py-1.5 text-sm leading-5 whitespace-nowrap" :class="STATUS[s.status]">
                  {{ s.status }}
                </span>
              </span>
            </li>
          </ul>

          <p v-if="tampil.length === 0" class="py-12 text-center text-sm text-meta">
            {{ cari || filter !== "semua" ? "Tidak ada jadwal yang cocok." : "Belum ada jadwal seminar." }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { StatusSeminarDosen } from "~/composables/useDosenSaya";
import { formatTanggalPendek } from "~/utils/format";

const { seminar } = useDosenSaya();

const TAB = [
  { label: "Semua", nilai: "semua" },
  { label: "Proposal", nilai: "sempro" },
  { label: "Hasil", nilai: "semhas" },
] as const;

const GRID = "grid grid-cols-[150px_88px_minmax(0,1fr)_104px_116px_64px_136px] gap-x-3 px-5";

const STATUS: Record<StatusSeminarDosen, string> = {
  Terkonfirmasi: "bg-success/20 text-success",
  Menunggu: "bg-[#fff3b0] text-[#8a5a00]",
  "Dijadwal Ulang": "bg-danger/20 text-[#e0262b]",
};

const filter = ref<"semua" | "sempro" | "semhas">("semua");
const cari = ref("");

const tampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  return seminar.value
    .filter((s) => filter.value === "semua" || s.jenis === filter.value)
    .filter((s) => !q || s.mahasiswa.toLowerCase().includes(q) || s.nim.includes(q))
    .slice()
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.jamMulai.localeCompare(b.jamMulai));
});
</script>
