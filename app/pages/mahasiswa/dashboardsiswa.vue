<script setup lang="ts">
definePageMeta({ middleware: "role", role: "mahasiswa" });
const { profile } = useAuth();

// nanti diganti sama query Supabase kalo backend siap
const hero = { jenis: "Seminar Hasil", judul: "Jadwal Anda sudah dikonfirmasi", detail: "15 September 2026, 10.00 · Ruang B203 · Penguji siap ditinjau", hariLagi: 13 };
const ringkasan = [
  { label: "Seminar Proposal", value: "Selesai", icon: "check", bg: "#16A34A" },
  { label: "Seminar Hasil", value: "Terkonfirmasi", icon: "clock", bg: "#2196F3" },
];
const pembimbing = ["Dr. Sari Dewi", "Dr. Hendra Wijaya"];
const jadwal = [
  { d: "15", bulan: "Sep 2026", jam: "10.00", judul: "Analisis Sentimen Ulasan E-commerce", sub: "Seminar Hasil • Pembimbing utama: Dr. Sari Dewi", ruang: "Ruang B203", status: "Terkonfirmasi", tone: "bg-[#D9F0DF] text-[#2E9E55]" },
  { d: "22", bulan: "Jul 2026", jam: "09.00", judul: "Presentasi Seminar Proposal", sub: "Proposal penelitian telah selesai dipresentasikan", ruang: "Ruang B201", status: "Selesai", tone: "bg-[#DDF3E2] text-[#2E9E55]" },
];
const profil = { nama: profile.value?.nama ?? "Nadia Ramadhani", nim: "11251099", prodi: "Teknik Informatika", rows: [["Status akademik", "Aktif"], ["Jenis seminar", "Semhas"], ["Ruangan", "B203"], ["Waktu", "10.00 WIB"]] };
const inisial = computed(() => profil.nama.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase());
</script>

<template>
  <div class="w-full">
    <header class="mb-10">
      <h1 class="text-4xl lg:text-5xl font-semibold text-zinc-700 leading-tight">Selamat datang, {{ profile?.nama?.split(" ")[0] }}</h1>
      <p class="text-lg text-slate-400 mt-1">Lihat jadwal seminar dan sidang Anda</p>
    </header>

    <h2 class="text-3xl font-medium text-slate-900 mb-8">Overview</h2>

    <section class="relative overflow-hidden rounded-4xl bg-linear-to-r from-[#0D47A1] via-[#1976D2] to-primary text-white px-10 py-9 flex items-center justify-between gap-6">
      <div class="relative z-10 min-w-0">
        <span class="inline-block px-4 py-1.5 rounded-full bg-white/20 text-sm font-semibold mb-4">{{ hero.jenis }}</span>
        <h3 class="text-3xl lg:text-4xl font-semibold mb-3">{{ hero.judul }}</h3>
        <p class="text-white/90">{{ hero.detail }}</p>
      </div>
      <div class="relative z-10 shrink-0 w-36 h-36 rounded-3xl bg-white/25 border border-white/30 flex flex-col items-center justify-center">
        <span class="text-6xl font-semibold leading-none">{{ hero.hariLagi }}</span>
        <span class="mt-1">hari lagi</span>
      </div>
      <div class="absolute -right-10 -top-16 w-105 h-105 rounded-full bg-white/10" />
    </section>

    <h2 class="text-2xl font-semibold text-slate-900 mt-9 mb-3">Ringkasan</h2>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="r in ringkasan" :key="r.label" class="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,.18)] p-6 flex items-center gap-5">
        <div class="w-18 h-18 rounded-2xl text-white flex items-center justify-center shrink-0" :style="{ background: r.bg }"><UiIcon :name="r.icon" :size="32" /></div>
        <div><div class="text-slate-500">{{ r.label }}</div><div class="text-3xl font-semibold text-slate-900">{{ r.value }}</div></div>
      </div>
      <div class="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,.18)] p-6 flex items-center gap-5">
        <div class="w-18 h-18 rounded-2xl bg-[#0D47A1] text-white flex items-center justify-center shrink-0"><UiIcon name="cap" :size="32" /></div>
        <div><div class="text-slate-500">Dosen Pembimbing</div><div v-for="p in pembimbing" :key="p" class="text-xl font-semibold text-slate-900 leading-snug">{{ p }}</div></div>
      </div>
    </section>

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_21.25rem] gap-8 items-start">
      <section class="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,.18)] overflow-hidden">
        <h3 class="px-8 py-6 text-2xl font-semibold text-slate-900 border-b border-slate-100">Jadwal Seminar Saya</h3>
        <div v-for="j in jadwal" :key="j.judul" class="px-8 py-6 flex items-center gap-5 border-b last:border-0 border-slate-100 flex-wrap">
          <div class="w-14 h-14 rounded-xl bg-primary-lightest text-primary text-2xl flex items-center justify-center shrink-0">{{ j.d }}</div>
          <div class="w-24 shrink-0"><div class="font-semibold text-slate-900">{{ j.bulan }}</div><div class="text-slate-400 text-sm">{{ j.jam }}</div></div>
          <div class="flex-1 min-w-50"><div class="font-semibold text-lg text-slate-900">{{ j.judul }}</div><div class="text-slate-400 text-sm">{{ j.sub }}</div></div>
          <div class="font-medium text-slate-800">{{ j.ruang }}</div>
          <span class="px-4 py-1.5 rounded-full text-sm font-medium" :class="j.tone">{{ j.status }}</span>
        </div>
      </section>

      <div class="flex flex-col gap-6">
        <section class="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,.18)] p-6">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-17 h-17 rounded-full bg-[#0D47A1] text-white text-xl font-semibold flex items-center justify-center shrink-0">{{ inisial }}</div>
            <div><div class="text-xl font-semibold text-slate-900">{{ profil.nama }}</div><div class="text-sm text-slate-500">{{ profil.nim }} • {{ profil.prodi }}</div></div>
          </div>
          <dl class="flex flex-col gap-3">
            <div v-for="[k, v] in profil.rows" :key="k" class="flex justify-between"><dt class="text-slate-400">{{ k }}</dt><dd class="font-semibold text-slate-900">{{ v }}</dd></div>
          </dl>
        </section>
        <section class="rounded-2xl bg-slate-50 p-6">
          <h3 class="font-semibold text-lg text-[#0D47A1] mb-2">Catatan</h3>
          <p class="text-slate-500 leading-relaxed">Pastikan slide, dokumen revisi, dan bukti persetujuan sudah siap sebelum jadwal seminar.</p>
        </section>
      </div>
    </div>
  </div>
</template>
