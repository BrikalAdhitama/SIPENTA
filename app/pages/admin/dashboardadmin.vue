<script setup lang="ts">
definePageMeta({ middleware: "role", role: "admin" });
const { profile } = useAuth();

// data dummy. Ganti sama query Supabase kalo backend siap.
const periode = ref("30");
const filter = ref<"Semua" | "Sempro" | "Semhas">("Semua");
const stats = { mahasiswa: 155, sempro: 24, semhas: 15, ruangan: 4, ruanganTotal: 10 };
const jadwal = [
  { tgl: "25 Sep 2026", jam: "08:00 – 08:50", ruang: "B201", mhs: "Andi Pratama", jenis: "Sempro" },
  { tgl: "25 Sep 2026", jam: "08:00 – 08:50", ruang: "B201", mhs: "Andi Pratama", jenis: "Semhas" },
  { tgl: "25 Sep 2026", jam: "08:00 – 08:50", ruang: "B201", mhs: "Andi Pratama", jenis: "Sempro" },
  { tgl: "25 Sep 2026", jam: "08:00 – 08:50", ruang: "B201", mhs: "Andi Pratama", jenis: "Sempro" },
  { tgl: "25 Sep 2026", jam: "08:00 – 08:50", ruang: "B201", mhs: "Andi Pratama", jenis: "Semhas" },
];
const rows = computed(() => jadwal.filter((j) => filter.value === "Semua" || j.jenis === filter.value));
const pill = "inline-flex items-center gap-3 px-6 py-3 rounded-full text-white text-lg font-medium bg-gradient-to-b from-[#64B5F6] to-[#2196F3] shadow-[0_8px_16px_-4px_rgba(33,150,243,.45)] hover:brightness-105 transition";
</script>

<template>
  <div class="w-full">
    <header class="flex items-start justify-between gap-4 mb-14">
      <div>
        <h1 class="text-4xl lg:text-5xl font-semibold text-zinc-700 leading-tight">Selamat Datang, {{ profile?.nama }}</h1>
        <p class="text-lg text-slate-400 mt-1">Ringkasan aktivitas penjadwalan seminar</p>
      </div>
      <NuxtLink to="/admin/seminar/upload" class="hidden md:inline-flex items-center gap-3 pl-1.5 pr-6 py-1.5 rounded-full bg-navy text-white text-lg hover:bg-primary-hover transition shrink-0">
        <span class="w-11 h-11 rounded-full border-2 border-white/90 flex items-center justify-center"><UiIcon name="plus" :size="24" /></span>
        Buat Penjadwalan
      </NuxtLink>
    </header>

    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-medium text-slate-900">Overview</h2>
        <label class="relative text-slate-800">
          <select v-model="periode" class="appearance-none bg-transparent pr-7 text-lg cursor-pointer focus:outline-none">
            <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
          </select>
          <UiIcon name="chevron" :size="18" class="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </label>
      </div>
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <UiStatCard label="Total Mahasiswa" :value="stats.mahasiswa" note="Semester Ganjil 2025/2026" icon="chart" tone="#F77FA6" />
        <UiStatCard label="Seminar Proposal" :value="stats.sempro" note="Mahasiswa" trend="down" icon="briefcase" tone="#E8916E" />
        <UiStatCard label="Seminar Hasil" :value="stats.semhas" note="Mahasiswa" icon="clock" tone="#6B9FE4" />
        <UiStatCard label="Ruangan Aktif" :value="stats.ruangan" :unit="`/${stats.ruanganTotal}`" note="B201-B204" icon="layers" tone="#FDB927" />
      </div>
    </section>

    <section class="mt-10 rounded-[1.75rem] border-[1.5px] border-[#1E5BC6] bg-white p-7 lg:w-[70%] min-w-0">
      <div class="flex items-center justify-between mb-8 gap-3">
        <h3 class="text-2xl font-medium text-slate-900">Jadwal Terbaru</h3>
        <div class="flex items-center gap-8 text-lg">
          <label class="relative text-slate-600">
            <select v-model="filter" class="appearance-none bg-transparent pr-6 cursor-pointer focus:outline-none">
              <option>Semua</option><option>Sempro</option><option>Semhas</option>
            </select>
            <UiIcon name="chevron" :size="16" class="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </label>
          <NuxtLink to="/admin/jadwal" class="text-sm font-medium text-[#0D47A1] hover:underline inline-flex items-center gap-1.5">Lihat selengkapnya <UiIcon name="arrow-right" :size="16" /></NuxtLink>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-140">
          <thead>
            <tr class="text-sm font-semibold text-slate-900 uppercase border-b border-slate-200">
              <th class="pb-4 px-3">Tanggal</th><th class="pb-4 px-3 text-center">Jam</th><th class="pb-4 px-3 text-center">Ruangan</th><th class="pb-4 px-3 text-center">Mahasiswa</th><th class="pb-4 px-3 text-center">Jenis</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(j, i) in rows" :key="i" class="text-lg text-slate-800">
              <td class="py-4 px-3">{{ j.tgl }}</td>
              <td class="py-4 px-3 text-center">{{ j.jam }}</td>
              <td class="py-4 px-3 text-center"><span class="inline-block px-4 py-1 rounded-full bg-[#CFE5FA] text-[#1565C0] text-base font-medium">{{ j.ruang }}</span></td>
              <td class="py-4 px-3 text-center">{{ j.mhs }}</td>
              <td class="py-4 px-3 text-center">
                <span class="inline-block px-4 py-1.5 rounded-full text-base" :class="j.jenis === 'Sempro' ? 'bg-[#FDE7EF] text-[#F0648F]' : 'bg-[#E8EDFD] text-[#3B5BDB]'">{{ j.jenis }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mt-8 pb-6">
      <h2 class="text-3xl font-medium text-slate-900 mb-5">Aksi Cepat</h2>
      <div class="flex flex-wrap gap-6">
        <NuxtLink to="/admin/seminar/upload" :class="pill"><UiIcon name="plus" :size="22" /> Buat Penjadwalan</NuxtLink>
        <NuxtLink to="/admin/seminar/upload" :class="pill"><UiIcon name="upload" :size="22" /> Upload Data SPS</NuxtLink>
        <NuxtLink to="/admin/jadwal" :class="pill">Lihat Jadwal <UiIcon name="arrow-right" :size="22" /></NuxtLink>
      </div>
    </section>
  </div>
</template>
