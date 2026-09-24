<template>
  <!-- Figma "Jadwal Mahasiswa - web" (node 165:6934) -->
  <div class="max-w-312.25 pt-9 pr-8 pb-14 pl-8 xl:pr-24">
    <header>
      <h1 class="text-[43px] leading-[50.74px] font-semibold tracking-[-0.6px] text-heading">Jadwal Saya</h1>
      <p class="mt-0.75 text-[15px] leading-[22.5px] text-subtle">
        Pantau jadwal seminar, status konfirmasi, dan detail ruangan Anda
      </p>
    </header>

    <!-- Overview -->
    <section class="mt-7">
      <h2 class="py-1 text-[22px] leading-[26.4px] font-medium tracking-[0.22px] text-body">Overview</h2>
      <div class="mt-5 flex flex-wrap gap-7.5">
        <div v-for="kartu in overview" :key="kartu.label" class="flex h-37 w-67 flex-col rounded-[14px] bg-primary-100/34 p-4.5">
          <span class="flex h-8.5 w-11.5 items-center justify-center rounded-[23px]" :class="kartu.ikonBg">
            <img :src="kartu.ikon" alt="" class="size-5.5" />
          </span>
          <p class="text-sm leading-5.25 text-label">{{ kartu.label }}</p>
          <p class="text-[28px] leading-10.5 font-semibold text-body">{{ kartu.nilai }}</p>
          <p class="mt-auto flex items-center gap-1.25 text-[10px] leading-3.75 text-body">
            <img src="/icons/trend-up-green.svg" alt="" class="size-3" />
            {{ kartu.catatan }}
          </p>
        </div>
      </div>
    </section>

    <div class="mt-7 grid grid-cols-[minmax(0,1fr)_328px] items-start gap-5.5">
      <!-- Tabel jadwal -->
      <section class="overflow-hidden rounded-[14px] border border-line bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)]">
        <div class="flex h-18 items-center border-b border-line px-5">
          <label class="flex h-10 w-full max-w-156.75 items-center gap-4 rounded-[30px] bg-white px-2 shadow-[0px_4px_12px_0px_rgba(13,10,44,0.06)]">
            <span class="sr-only">Cari jadwal</span>
            <input
              v-model="cari"
              type="search"
              placeholder="Search ..."
              class="min-w-0 flex-1 bg-transparent px-2.5 text-lg text-title outline-none placeholder:text-[#abb7c2]"
            />
            <span class="flex size-8.75 shrink-0 items-center justify-center rounded-[25px] bg-linear-to-b from-primary-500 to-primary-200" aria-hidden="true">
              <img src="/icons/search.svg" alt="" class="size-6" />
            </span>
          </label>
        </div>

        <div class="min-h-80.25">
          <div :class="GRID" class="h-10.25 items-center border-b border-line-soft text-xs leading-4.5 font-semibold text-meta">
            <span>Tanggal</span>
            <span class="text-center">Jenis</span>
            <span class="text-center">Waktu</span>
            <span>Ruangan</span>
            <span>Status</span>
          </div>
          <ul>
            <li v-for="s in seminarTampil" :key="s.id" :class="GRID" class="h-17.5 items-center border-b border-line-soft text-[13.5px] text-title">
              <div class="flex flex-col gap-px">
                <p class="leading-4.5 font-medium whitespace-nowrap">{{ formatTanggalPendek(s.tanggal) }}</p>
                <p class="text-xs leading-4 text-meta">{{ namaHari(s.tanggal) }}</p>
              </div>
              <span class="text-center"><UiJenisChip :jenis="s.jenis" /></span>
              <p class="text-center leading-[20.25px] whitespace-nowrap">{{ jamTitik(s.jamMulai) }} - {{ jamTitik(s.jamSelesai) }} WIB</p>
              <p class="leading-[20.25px]">{{ s.ruangan }}</p>
              <span><UiStatusSeminarChip :status="s.status" /></span>
            </li>
            <li v-if="seminarTampil.length === 0" class="py-10 text-center text-sm text-meta">
              {{ cari ? "Tidak ada jadwal yang cocok." : "Belum ada jadwal seminar." }}
            </li>
          </ul>
        </div>
      </section>

      <div class="flex flex-col gap-4">
        <!-- Jadwal Terdekat -->
        <section class="flex flex-col gap-3.5 rounded-[14px] bg-primary-100/34 p-4.5">
          <h2 class="text-base leading-6 font-semibold text-body">Jadwal Terdekat</h2>
          <div v-if="terdekat" class="flex flex-col gap-5.5 rounded-xl border border-line bg-white p-3.75">
            <div class="flex items-center justify-between gap-3">
              <span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-[21px] leading-[31.5px] font-extrabold text-primary-500">
                {{ tanggalKe(terdekat.tanggal) }}
              </span>
              <div class="text-right">
                <p class="text-[13px] leading-[19.5px] font-bold text-title">{{ JENIS_LABEL[terdekat.jenis] }}</p>
                <p class="mt-1 text-xs leading-4.5 text-meta">{{ namaHari(terdekat.tanggal) }}, {{ jamTitik(terdekat.jamMulai) }} WIB</p>
              </div>
            </div>
            <dl class="flex flex-col gap-2.5 text-[12.5px] leading-[18.75px]">
              <div v-for="[label, nilai] in infoTerdekat" :key="label" class="flex items-start justify-between gap-4">
                <dt class="text-meta">{{ label }}</dt>
                <dd class="text-right font-semibold text-title">{{ nilai }}</dd>
              </div>
            </dl>
          </div>
          <p v-else class="rounded-xl border border-line bg-white p-3.75 text-center text-xs leading-4.5 text-meta">
            Belum ada jadwal mendatang.
          </p>
        </section>

        <!-- Catatan -->
        <section v-if="terdekat?.catatan" class="flex flex-col gap-1.75 rounded-[14px] border border-line bg-white px-4.25 pt-4.75 pb-4.25">
          <h2 class="text-sm leading-5.25 font-bold text-primary-500">Catatan</h2>
          <p class="text-xs leading-4.5 text-meta">{{ terdekat.catatan }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { JENIS_LABEL } from "~/types/domain";
import { STATUS_SEMINAR_LABEL, type SeminarSaya } from "~/composables/useMahasiswaSaya";
import {
  formatTanggalBulan,
  formatTanggalPendek,
  hariMenuju,
  jamTitik,
  namaHari,
  tanggalKe,
} from "~/utils/format";

const { profil, seminar, seminarTerdekat: terdekat, seminarJenis } = useMahasiswaSaya();

// kolom tabel: Tanggal · Jenis · Waktu · Ruangan · Status (Jenis & Waktu rata tengah seperti Figma)
const GRID = "grid grid-cols-[120px_110px_minmax(0,1fr)_90px_118px] gap-x-4.5 px-5";

const sempro = seminarJenis("sempro");
const semhas = seminarJenis("semhas");

function kartuOverview(label: string, ikon: string, ikonBg: string, s: SeminarSaya | null) {
  if (!s) return { label, ikon, ikonBg, nilai: "—", catatan: "Belum dijadwalkan" };
  if (s.status === "selesai") {
    return { label, ikon, ikonBg, nilai: STATUS_SEMINAR_LABEL.selesai, catatan: formatTanggalPendek(s.tanggal) };
  }
  const sisa = hariMenuju(s.tanggal);
  return {
    label,
    ikon,
    ikonBg,
    nilai: formatTanggalBulan(s.tanggal),
    catatan: sisa > 0 ? `${sisa} hari lagi` : sisa === 0 ? "Hari ini" : formatTanggalPendek(s.tanggal),
  };
}

const overview = computed(() => [
  kartuOverview("Seminar Proposal", "/icons/stat-presentation.svg", "bg-sempro", sempro.value),
  kartuOverview("Seminar Hasil", "/icons/stat-clock-outline.svg", "bg-[#e79170]", semhas.value),
]);

const cari = ref("");
const seminarTampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  if (!q) return seminar.value;
  return seminar.value.filter((s) =>
    [
      formatTanggalPendek(s.tanggal),
      namaHari(s.tanggal),
      s.jenis === "sempro" ? "Sempro" : "Semhas",
      JENIS_LABEL[s.jenis],
      s.ruangan,
      STATUS_SEMINAR_LABEL[s.status],
    ].some((teks) => teks.toLowerCase().includes(q)),
  );
});

const infoTerdekat = computed(() =>
  terdekat.value
    ? [
        ["Ruangan", terdekat.value.ruangan],
        ["Ketua penguji", terdekat.value.ketuaPenguji],
        ["Pembimbing", profil.value.pembimbing1],
      ]
    : [],
);
</script>
