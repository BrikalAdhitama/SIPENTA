<script setup lang="ts">
import { definePageMeta, ref, useAuth } from "#imports";

definePageMeta({ middleware: "role", role: "dosen" });
const { profile } = useAuth();

// nanti diganti sama query Supabase kalo backend siap
const periode = ref("30");
const stats = { bimbingan: 9, pengujian: 5, menunggu: 2 };
const agenda = [
  { nama: "Andi Pratama", jenis: "Sempro", tgl: "1 September 2026", jam: "08:00 - 09:00", ruang: "B201", peran: "Pembimbing" },
  { nama: "Andi Pratama", jenis: "Sempro", tgl: "1 September 2026", jam: "08:00 - 09:00", ruang: "B201", peran: "Pembimbing" },
];
const inisial = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("");
</script>

<template>
  <div class="w-full">
    <header class="mb-10">
      <h1 class="text-4xl lg:text-5xl font-semibold text-zinc-700 leading-tight">Selamat datang, {{ profile?.nama }}</h1>
      <p class="text-lg text-slate-400 mt-1">Lihat jadwal seminar dan sidang Anda</p>
    </header>

    <section>
      <div class="flex items-center justify-between mb-6 lg:w-[80%]">
        <h2 class="text-3xl font-medium text-slate-900">Overview</h2>
        <label class="relative text-slate-800">
          <select v-model="periode" class="appearance-none bg-transparent pr-7 text-lg cursor-pointer focus:outline-none">
            <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
          </select>
          <UiIcon name="chevron" :size="18" class="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </label>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:w-[80%]">
        <UiStatCard label="Jadwal Bimbingan" :value="stats.bimbingan" note="Mahasiswa" icon="chart" tone="#F77FA6" />
        <UiStatCard label="Jadwal Pengujian" :value="stats.pengujian" note="Seminar" trend="down" icon="briefcase" tone="#E8916E" />
        <UiStatCard label="Menunggu Persetujuan" :value="stats.menunggu" note="Jadwal Seminar" icon="clock" tone="#6B9FE4" />
      </div>
    </section>

    <div class="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-8 items-start">
      <section class="rounded-4xl bg-white p-7 shadow-[0_20px_50px_-20px_rgba(15,23,42,.18)] border border-slate-100">
        <div class="flex items-center gap-3 mb-6">
          <span class="w-1.5 h-7 rounded-full bg-blue-600" />
          <h3 class="text-2xl font-semibold text-slate-900 flex-1">Jadwal Sempro dan Semhas</h3>
          <span class="text-sm font-medium text-slate-500 bg-slate-100 rounded-full px-4 py-2">{{ agenda.length }} agenda</span>
        </div>
        <div class="flex flex-col gap-5">
          <article v-for="(a, i) in agenda" :key="i" class="rounded-3xl border border-slate-200 p-6 grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_auto] items-center gap-5">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-primary text-white text-xl font-semibold flex items-center justify-center shrink-0">{{ inisial(a.nama) }}</div>
              <div>
                <div class="font-semibold text-lg text-slate-900">{{ a.nama }}</div>
                <span class="inline-block mt-2 px-4 py-1.5 rounded-full text-base" :class="a.jenis === 'Sempro' ? 'bg-[#FDE7EF] text-[#F0648F]' : 'bg-[#E8EDFD] text-[#3B5BDB]'">{{ a.jenis }}</span>
              </div>
            </div>
            <ul class="flex flex-col gap-3 text-[#0D47A1] font-semibold text-lg">
              <li class="flex items-center gap-3"><UiIcon name="calendar" :size="26" class="text-slate-600" /> {{ a.tgl }}</li>
              <li class="flex items-center gap-3"><UiIcon name="clock" :size="26" class="text-slate-600" /> {{ a.jam }}</li>
              <li class="flex items-center gap-3"><UiIcon name="pin" :size="26" class="text-slate-600" /> {{ a.ruang }}</li>
            </ul>
            <span class="justify-self-start sm:justify-self-end px-5 py-2.5 rounded-full bg-primary-lightest text-[#0D47A1] font-semibold text-sm">{{ a.peran }}</span>
          </article>
        </div>
        <div class="text-right mt-6 pr-6">
          <NuxtLink to="/dosen/seminar-saya" class="text-lg text-[#1976D2] hover:underline">Lihat semua →</NuxtLink>
        </div>
      </section>

      <aside class="rounded-3xl bg-linear-to-br from-[#EEF3FE] to-white border border-[#E1EAFB] p-6">
        <h3 class="font-semibold text-lg text-[#0D47A1] mb-2">Perhatian</h3>
        <p class="text-slate-500 leading-relaxed">Rabu memiliki 4 kegiatan. Periksa kembali waktu dan ruangan.</p>
      </aside>
    </div>
  </div>
</template>
