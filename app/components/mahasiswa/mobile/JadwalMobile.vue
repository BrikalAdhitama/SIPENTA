<template>
  <div class="min-h-screen bg-white font-sans pb-28 mobile-safe-top">
    <main class="mx-auto max-w-lg px-5 pb-6">
      <header class="mb-6 pt-1">
        <div>
          <h1 class="text-[24px] font-extrabold leading-tight tracking-tight text-[#14213D]">Jadwal Saya</h1>
          <p class="mt-1 text-[12px] font-medium leading-relaxed text-slate-500">Pantau jadwal seminar, status konfirmasi, dan detail ruangan Anda</p>
        </div>
      </header>

      <section class="mb-7 grid grid-cols-2 gap-3">
        <div v-for="item in milestoneCards" :key="item.label" class="rounded-[20px] border border-[#90CAF9]/50 bg-white px-3 py-4 text-center shadow-[0_5px_18px_-8px_rgba(33,150,243,0.18)]">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[16px]" :class="item.tone">
            <svg v-if="item.icon === 'document'" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path stroke-linecap="round" d="M14 3v5h4M9 13h6M9 17h4" /></svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><circle cx="12" cy="12" r="8.5" /><path stroke-linecap="round" d="M12 7v5l3 2" /></svg>
          </div>
          <p class="text-[12px] font-semibold text-slate-500">{{ item.label }}</p>
          <p class="mt-1 text-[18px] font-extrabold text-[#14213D]">{{ item.status }}</p>
          <p class="mt-1 text-[12px] font-semibold text-[#2196F3]">{{ item.date }}</p>
        </div>
      </section>

      <div v-if="showSearch" class="relative mb-7">
        <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="7" /><path stroke-linecap="round" d="m20 20-4-4" /></svg>
        <input v-model="searchQuery" type="search" placeholder="Cari jadwal seminar..." class="h-14 w-full rounded-full border-0 bg-white pl-12 pr-5 text-[14px] font-medium text-slate-700 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.25)] outline-none ring-1 ring-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-[#90CAF9]" />
      </div>

      <section class="space-y-3">
        <div v-for="item in filteredSeminar" :key="item.id" class="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_4px_18px_-8px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-10px_rgba(33,150,243,0.28)]">
          <span class="absolute inset-y-0 left-0 w-1" :class="item.jenis === 'sempro' ? 'bg-[#90CAF9]' : 'bg-[#FDBA74]'" aria-hidden="true" />
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[12px] font-medium text-slate-500">{{ formatTanggalPanjang(item.tanggal) }}</p>
              <h2 class="mt-2 text-[16px] font-extrabold leading-snug text-[#14213D]">{{ item.judul }}</h2>
            </div>
            <span class="relative shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-extrabold" :class="jenisClass(item.jenis)">{{ item.jenis === 'sempro' ? 'Sempro' : 'Semhas' }}</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium text-slate-600">
            <span class="inline-flex items-center gap-1.5"><svg class="h-4 w-4 text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><circle cx="12" cy="12" r="8.5" /><path stroke-linecap="round" d="M12 7v5l3 2" /></svg>{{ jamTitik(item.jamMulai) }}–{{ jamTitik(item.jamSelesai) }} WIB</span>
            <span class="inline-flex items-center gap-1.5"><svg class="h-4 w-4 text-[#0D47A1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M19 10c0 4.5-7 10-7 10s-7-5.5-7-10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></svg>{{ item.ruangan }}</span>
          </div>
          <div class="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div class="min-w-0 space-y-1 text-[10px] font-medium leading-relaxed text-slate-500">
              <p class="truncate">Pembimbing 1: {{ item.pembimbing1 }}</p>
              <p class="truncate">Pembimbing 2: {{ item.pembimbing2 }}</p>
              <p class="truncate">Penguji 1: {{ item.penguji1 }}</p>
              <p class="truncate">Penguji 2: {{ item.penguji2 }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-1.5">
              <span class="rounded-full px-3 py-1.5 text-[10px] font-extrabold" :class="statusClass(item.status)">{{ STATUS_SEMINAR_LABEL[item.status] }}</span>
            </div>
          </div>
          <div v-if="item.catatan" class="mt-3 rounded-[13px] bg-[#F5F9FF] px-3 py-2.5">
            <p class="text-[10px] font-extrabold text-[#2196F3]">Catatan</p>
            <p class="mt-1 text-[11px] leading-relaxed text-slate-500">{{ item.catatan }}</p>
          </div>
        </div>
        <div v-if="!filteredSeminar.length" class="rounded-[20px] bg-white px-5 py-12 text-center shadow-sm">
          <p class="text-sm font-semibold text-slate-400">Jadwal tidak ditemukan.</p>
        </div>
      </section>

    </main>
    <MahasiswaBottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { JENIS_LABEL } from '~/types/domain'
import { STATUS_SEMINAR_LABEL, type StatusSeminar } from '~/composables/useMahasiswaSaya'
import { formatTanggalPanjang, jamTitik } from '~/utils/format'

const { seminar, seminarJenis } = useMahasiswaSaya()
const searchQuery = ref('')
const sempro = seminarJenis('sempro')
const semhas = seminarJenis('semhas')
const showSearch = computed(() => seminar.value.length > 4)
const filteredSeminar = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return seminar.value
  return seminar.value.filter(item => `${item.judul} ${item.ruangan} ${JENIS_LABEL[item.jenis]} ${item.status}`.toLowerCase().includes(query))
})
const milestoneCards = computed(() => [
  { label: 'Seminar Proposal', status: sempro.value ? STATUS_SEMINAR_LABEL[sempro.value.status] : 'Belum', date: sempro.value ? formatTanggalPanjang(sempro.value.tanggal) : 'Belum dijadwalkan', icon: 'document', tone: 'bg-[#E3F2FD] text-[#2196F3]' },
  { label: 'Seminar Hasil', status: semhas.value ? STATUS_SEMINAR_LABEL[semhas.value.status] : 'Belum', date: semhas.value ? formatTanggalPanjang(semhas.value.tanggal) : 'Belum dijadwalkan', icon: 'clock', tone: 'bg-[#E3F2FD] text-[#0D47A1]' },
])
const statusClass = (status: StatusSeminar) => status === 'selesai' ? 'bg-emerald-50 text-emerald-700' : status === 'terkonfirmasi' ? 'bg-[#E3F2FD] text-[#0D47A1]' : 'bg-amber-50 text-amber-700'
const jenisClass = (jenis: string) => jenis === 'sempro'
  ? 'border-[#90CAF9] bg-[#F0F6FF] text-[#1976D2]'
  : 'border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]'
</script>
