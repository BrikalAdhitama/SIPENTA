<template>
  <!-- Figma "dashboard Mahasiswa - web" (node 164:6728) -->
  <div class="max-w-312.25 pt-9 pr-8 pb-16 pl-8 xl:pr-13.5">
    <header class="leading-normal">
      <h1 class="text-[43px] font-semibold text-heading">Selamat datang, {{ user.namaPanggilan }}</h1>
      <p class="text-[15px] text-subtle">Lihat jadwal seminar dan sidang Anda</p>
    </header>

    <h2 class="mt-10.5 text-[22px] leading-normal tracking-[0.22px] text-body">Overview</h2>

    <!-- Banner seminar terdekat -->
    <section
      v-if="terdekat"
      class="relative mt-12 flex h-37 items-center justify-between gap-6 overflow-hidden rounded-[18px] bg-[linear-gradient(172.7deg,#0d47a1_14.645%,#2196f3_85.355%)] px-8 shadow-card"
    >
      <span class="pointer-events-none absolute -top-23 -right-20 size-65 rounded-full bg-white/12" aria-hidden="true" />

      <div class="relative min-w-0">
        <span class="inline-block rounded-full bg-white/18 px-3 py-1.5 text-xs leading-3 font-bold text-white">
          {{ JENIS_LABEL[terdekat.jenis] }}
        </span>
        <p class="mt-2.25 text-2xl leading-8 font-extrabold text-white">
          {{ terdekat.status === "terkonfirmasi" ? "Jadwal Anda sudah dikonfirmasi" : "Menunggu konfirmasi dosen" }}
        </p>
        <p class="mt-2.25 flex flex-wrap gap-x-6 text-[13px] leading-4.5 font-medium text-white/90">
          <span>{{ formatTanggalPanjang(terdekat.tanggal) }}, {{ jamTitik(terdekat.jamMulai) }}</span>
          <span>Ruang {{ terdekat.ruangan }}</span>
          <span v-if="terdekat.status === 'terkonfirmasi'">Penguji siap ditinjau</span>
        </p>
      </div>

      <div class="relative flex w-28.5 shrink-0 flex-col items-center gap-1 rounded-2xl border border-white/22 bg-white/15 py-4 text-center text-white">
        <template v-if="sisaHari > 0">
          <span class="text-[34px] leading-8.5 font-extrabold">{{ sisaHari }}</span>
          <span class="text-xs leading-4.5 text-white/86">hari lagi</span>
        </template>
        <span v-else class="py-2 text-lg leading-6 font-extrabold">Hari ini</span>
      </div>
    </section>
    <section v-else class="mt-12 rounded-[18px] border border-line bg-white px-8 py-10 text-center text-meta shadow-card">
      Belum ada jadwal seminar mendatang.
    </section>

    <!-- Ringkasan -->
    <section class="mt-7">
      <h2 class="text-lg leading-6 font-bold text-title">Ringkasan</h2>
      <div class="grid grid-cols-3 gap-4.5">
        <div
          v-for="kartu in ringkasan"
          :key="kartu.label"
          class="flex min-h-26.75 items-center gap-4 rounded-2xl border border-line bg-white py-5 pr-5.5 pl-5.75 shadow-card"
        >
          <span class="flex size-13 shrink-0 items-center justify-center rounded-2xl text-[23px] text-white" :class="kartu.ikonBg" aria-hidden="true">
            {{ kartu.ikon }}
          </span>
          <div class="flex min-w-0 flex-col gap-0.75">
            <p class="text-[13px] leading-4.5 font-medium text-meta">{{ kartu.label }}</p>
            <p v-for="nilai in kartu.nilai" :key="nilai" class="font-extrabold text-title" :class="kartu.nilai.length > 1 ? 'text-base leading-5.5' : 'text-[22px] leading-6.75'">
              {{ nilai }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="mt-7 grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
      <!-- Jadwal Seminar Saya -->
      <section class="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div class="flex h-16 items-center border-b border-line px-5">
          <h2 class="text-[17px] leading-5.5 font-bold text-ink">Jadwal Seminar Saya</h2>
        </div>
        <ul class="py-1.5">
          <li v-for="s in seminar" :key="s.id" :class="BARIS" class="h-20 items-center border-b border-line-soft px-5">
            <div class="flex items-center gap-3">
              <span class="flex size-10.5 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-inter text-base leading-4 text-primary-500">
                {{ tanggalKe(s.tanggal) }}
              </span>
              <div>
                <p class="text-[13px] leading-4.5 font-bold text-title">{{ formatBulanTahun(s.tanggal) }}</p>
                <p class="text-xs leading-4 text-meta">{{ jamTitik(s.jamMulai) }}</p>
              </div>
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm leading-5 font-semibold text-title">{{ s.judul }}</p>
              <p class="mt-1 truncate text-xs leading-4.25 text-meta">{{ s.keterangan }}</p>
            </div>
            <p class="text-[13px] leading-4.5 font-medium text-title">Ruang {{ s.ruangan }}</p>
            <span><UiStatusSeminarChip :status="s.status" /></span>
          </li>
          <li v-if="seminar.length === 0" class="py-8 text-center text-sm text-meta">Belum ada jadwal seminar.</li>
        </ul>
      </section>

      <div class="flex flex-col gap-4.5">
        <!-- Kartu profil singkat -->
        <section class="flex flex-col gap-4.5 rounded-2xl border border-line bg-white p-5.75 shadow-card">
          <div class="flex items-center gap-3.5">
            <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-900 text-[15px] leading-3.75 font-extrabold text-white">
              {{ profil.inisial }}
            </span>
            <div class="min-w-0">
              <p class="truncate text-[15px] leading-5 font-bold text-title">{{ profil.nama }}</p>
              <p class="truncate text-xs leading-4 text-meta">{{ profil.nim }} • {{ profil.prodi }}</p>
            </div>
          </div>
          <dl class="flex flex-col gap-3 text-[12.5px] leading-4.5">
            <div v-for="[label, nilai] in infoSingkat" :key="label" class="flex items-start justify-between gap-4">
              <dt class="font-medium text-meta">{{ label }}</dt>
              <dd class="text-right font-bold text-title">{{ nilai }}</dd>
            </div>
          </dl>
        </section>

        <section class="flex flex-col gap-1.75 bg-[#fafcff] px-4.5 pb-4.5">
          <h2 class="text-sm leading-5 font-bold text-primary-900">Catatan</h2>
          <p class="text-xs leading-4.5 text-meta">
            Pastikan slide, dokumen revisi, dan bukti persetujuan sudah siap sebelum jadwal seminar.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { JENIS_LABEL } from "~/types/domain";
import { STATUS_SEMINAR_LABEL, type SeminarSaya } from "~/composables/useMahasiswaSaya";
import {
  formatBulanTahun,
  formatTanggalPanjang,
  hariMenuju,
  jamTitik,
  tanggalKe,
} from "~/utils/format";

const { user } = useCurrentUser();
const { profil, seminar, seminarTerdekat: terdekat, seminarJenis } = useMahasiswaSaya();

// kolom tabel "Jadwal Seminar Saya" — lebar mengikuti Figma
const BARIS = "grid grid-cols-[130px_minmax(0,1fr)_124px_110px] gap-x-4.5";

const sisaHari = computed(() => (terdekat.value ? hariMenuju(terdekat.value.tanggal) : 0));

const sempro = seminarJenis("sempro");
const semhas = seminarJenis("semhas");

// ikon kartu ringkasan mengikuti status (Figma: ✓ hijau = selesai, ⌚ biru = terjadwal)
function kartuSeminar(label: string, s: SeminarSaya | null) {
  if (!s) return { label, nilai: ["Belum dijadwalkan"], ikon: "⌚", ikonBg: "bg-inactive" };
  if (s.status === "selesai") return { label, nilai: [STATUS_SEMINAR_LABEL.selesai], ikon: "✓", ikonBg: "bg-success" };
  return {
    label,
    nilai: [STATUS_SEMINAR_LABEL[s.status]],
    ikon: "⌚",
    ikonBg: s.status === "menunggu" ? "bg-warning" : "bg-primary-500",
  };
}

const ringkasan = computed(() => [
  kartuSeminar("Seminar Proposal", sempro.value),
  kartuSeminar("Seminar Hasil", semhas.value),
  {
    label: "Dosen Pembimbing",
    nilai: [profil.value.pembimbing1, profil.value.pembimbing2],
    ikon: "🎓",
    ikonBg: "bg-primary-900",
  },
]);

const infoSingkat = computed(() => {
  const s = terdekat.value;
  return [
    ["Status akademik", profil.value.status],
    ["Jenis seminar", s ? (s.jenis === "sempro" ? "Sempro" : "Semhas") : "—"],
    ["Ruangan", s?.ruangan ?? "—"],
    ["Waktu", s ? `${jamTitik(s.jamMulai)} WIB` : "—"],
  ];
});
</script>
