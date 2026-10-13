<template>
  <div class="min-h-screen font-sans pb-32" style="background:#ffffff;">

    <!-- ═══════════════════════════════════════
         PAGE HEADER
    ═══════════════════════════════════════ -->
    <header class="mobile-safe-top px-5 pb-4 border-b"
            style="background:#ffffff;border-color:#eef4fb;">

      <!-- Title -->
      <div class="mb-4">
        <h1 class="text-[24px] font-extrabold tracking-tight leading-none mb-1" style="color:#0f172a;">Jadwal Seminar</h1>
        <p class="text-[12px] font-medium" style="color:#94a3b8;">Semua jadwal seminar proposal dan hasil semester ini</p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2 mb-4">
        <button
          v-for="tab in tabs" :key="tab.value"
          @click="activeFilter = tab.value"
          class="px-4 py-2 rounded-full text-[13px] font-bold transition-all active:scale-95"
          :style="activeFilter === tab.value
            ? 'background:#1565C0;color:#ffffff;box-shadow:0 4px 12px rgba(21,101,192,0.25);'
            : 'background:#f1f5f9;color:#64748b;'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Search Bar -->
      <div class="flex items-center gap-2.5">
        <div class="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-[14px]" style="background:#f8fafc;border:1.5px solid #e2e8f0;">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search jadwal..."
            class="flex-1 bg-transparent text-[13px] font-medium outline-none placeholder-slate-300"
            style="color:#0f172a;"
          />
          <button v-if="searchQuery" @click="searchQuery=''" class="w-4 h-4 flex items-center justify-center active:scale-90">
            <svg class="w-3.5 h-3.5" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <button class="filter-button relative w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                aria-label="Buka filter tambahan" @click="showFilters = true">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M7 12h10m-7 6h4"/>
          </svg>
          <span v-if="hasExtraFilter" class="filter-indicator" />
        </button>
      </div>
    </header>

    <!-- ═══════════════════════════════════════
         LIST JADWAL
    ═══════════════════════════════════════ -->
    <main class="px-5">

      <div v-if="activeChips.length" class="active-filters flex flex-wrap gap-2 pt-3">
        <button v-for="chip in activeChips" :key="chip.key" class="filter-chip" @click="clearChip(chip.key)">
          {{ chip.label }}
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <!-- Result count -->
      <div class="result-summary flex items-center justify-between" :class="activeChips.length ? 'pt-3 pb-4' : 'py-4'">
        <p class="flex items-center gap-2 text-[11px] font-semibold" style="color:#94a3b8;">
          <span class="result-dot" aria-hidden="true"></span>
          <span>Menampilkan</span>
          <strong style="color:#0f172a;">{{ filteredJadwal.length }}</strong>
          <span>jadwal</span>
        </p>
        <span class="result-caption">Agenda seminar</span>
      </div>

      <!-- List items -->
      <TransitionGroup name="list" tag="div">
        <div
          v-for="(item, idx) in filteredJadwal"
          :key="item.id"
          class="jadwal-item relative mb-4 rounded-[22px] p-5 cursor-pointer"
          @click="openDetail(item)"
        >
          <span class="absolute left-0 top-6 bottom-6 w-1 rounded-r-full" :style="item.jenis === 'sempro' ? 'background:#2196F3;' : 'background:#90CAF9;'"/>
          <!-- Row 1: Name + Type badge -->
          <div class="flex items-start justify-between gap-4 mb-1.5">
            <h3 class="text-[16px] font-extrabold leading-snug" style="color:#0f172a;">{{ item.mahasiswa }}</h3>
            <span
              class="shrink-0 px-3 py-1 rounded-full text-[10px] font-extrabold"
              :style="item.jenis === 'sempro'
                ? 'background:#fff0f5;color:#e91e8c;'
                : 'background:#fff3e0;color:#e65100;'"
            >{{ item.jenis === 'sempro' ? 'Sempro' : 'Semhas' }}</span>
          </div>

          <!-- Row 2: NIM + Status badge -->
          <div class="flex items-center justify-between gap-3 mb-4">
            <p class="text-[12px] font-semibold" style="color:#94a3b8;">{{ item.nim }}</p>
          </div>

          <!-- Judul -->
          <p class="text-[14px] font-semibold mb-[18px] leading-relaxed" style="color:#334155;">{{ item.judul }}</p>

          <!-- Row 3: Meta (date, time, room) + Role badge -->
          <div class="pt-4 flex flex-col gap-3 border-t" style="border-color:#eef2f7;">
            <div class="min-w-0 flex items-center gap-x-4 gap-y-2.5 flex-wrap">
              <!-- Date -->
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <span class="text-[11px] font-bold whitespace-nowrap" style="color:#64748b;">{{ formatTanggal(item.tanggal) }}</span>
              </div>
              <!-- Time -->
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/>
                </svg>
                <span class="text-[11px] font-bold whitespace-nowrap" style="color:#64748b;">{{ item.jamMulai }} - {{ item.jamSelesai }}</span>
              </div>
              <!-- Room -->
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-[11px] font-bold whitespace-nowrap" style="color:#64748b;">{{ item.ruangan }}</span>
              </div>
            </div>
            <div class="jadwal-badges flex items-center justify-start gap-2 flex-wrap">
              <span
                class="jadwal-badge shrink-0 px-3 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap"
                :style="statusStyle(item.status)"
              >{{ item.status }}</span>
              <span
                class="jadwal-badge shrink-0 px-3 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap"
                :style="peranStyle(item.peran)"
              >{{ peranLabel(item.peran) }}</span>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty state -->
      <div v-if="filteredJadwal.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="w-16 h-16 rounded-full flex items-center justify-center" style="background:#f1f5f9;">
          <svg class="w-8 h-8" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </div>
        <p class="text-[14px] font-extrabold" style="color:#0f172a;">Tidak ada jadwal</p>
        <p class="text-[12px]" style="color:#94a3b8;">Coba ubah filter atau kata kunci pencarian</p>
      </div>

    </main>

    <Transition name="sheet">
      <div v-if="showFilters" class="sheet-backdrop fixed inset-0 z-[90] flex items-end" @click.self="showFilters = false">
        <div class="filter-sheet w-full rounded-t-[28px] bg-white px-5 pb-8 pt-4">
          <div class="mx-auto mb-5 h-1.5 w-10 rounded-full bg-slate-200" />
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-[17px] font-extrabold text-slate-900">Filter Jadwal</h2>
              <p class="mt-1 text-[11px] font-medium text-slate-400">Pilih peran atau status yang ingin dilihat</p>
            </div>
            <button class="filter-close" aria-label="Tutup filter" @click="showFilters = false">×</button>
          </div>
          <div class="mt-5">
            <p class="filter-heading">Peran dosen</p>
            <div class="filter-options">
              <button v-for="option in roleOptions" :key="option.value" :class="{ selected: draftRoleFilter === option.value }" @click="draftRoleFilter = option.value">{{ option.label }}</button>
            </div>
          </div>
          <div class="mt-5">
            <p class="filter-heading">Status</p>
            <div class="filter-options">
              <button v-for="option in statusOptions" :key="option.value" :class="{ selected: draftStatusFilter === option.value }" @click="draftStatusFilter = option.value">{{ option.label }}</button>
            </div>
          </div>
          <button class="apply-filter mt-6" @click="applyFilters">Terapkan Filter</button>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════
         DETAIL BOTTOM SHEET
    ═══════════════════════════════════════ -->
    <Transition name="bd">
      <div v-if="selectedItem" class="sheet-backdrop fixed inset-0 z-[100] flex items-end"
           style="background:rgba(15,23,42,0.4);backdrop-filter:blur(5px);"
           @click.self="selectedItem=null">
        <Transition name="su">
          <div v-if="selectedItem" class="bg-white w-full rounded-t-[28px] pt-4 pb-safe flex flex-col"
               style="max-height:88vh;overflow-y:auto;box-shadow:0 -8px 40px rgba(0,0,0,0.12);">

            <!-- Handle -->
            <div class="w-10 h-1.5 rounded-full mx-auto mb-5" style="background:#e2e8f0;"/>

            <!-- Sheet header -->
            <div class="px-5 flex justify-between items-center mb-5">
              <h2 class="text-[16px] font-extrabold" style="color:#0f172a;">Detail Jadwal</h2>
              <button class="w-8 h-8 rounded-full flex items-center justify-center active:scale-90"
                      style="background:#f1f5f9;" @click="selectedItem=null">
                <svg class="w-4 h-4" fill="none" stroke="#475569" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Student info -->
            <div class="px-5 mb-5">
              <div class="rounded-[20px] p-4 flex items-center gap-4"
                   style="background:#f8fafc;border:1px solid #f1f5f9;">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-[15px] shrink-0"
                     :style="{background: selectedItem.jenis==='sempro'?'linear-gradient(135deg,#e91e8c,#f48fb1)':'linear-gradient(135deg,#1565C0,#42A5F5)'}">
                  {{ selectedItem.inisial }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-[15px] font-extrabold truncate" style="color:#0f172a;">{{ selectedItem.mahasiswa }}</h3>
                  <p class="text-[11px] font-semibold" style="color:#94a3b8;">{{ selectedItem.nim }}</p>
                  <p class="text-[12px] font-semibold mt-0.5 leading-snug" style="color:#475569;">{{ selectedItem.judul }}</p>
                </div>
              </div>
            </div>

            <!-- Badges row -->
            <div class="px-5 flex items-center gap-2 mb-5 flex-wrap">
              <span class="px-3 py-1 rounded-full text-[11px] font-extrabold"
                    :style="selectedItem.jenis==='sempro'?'background:#fff0f5;color:#e91e8c;':'background:#fff3e0;color:#e65100;'">
                {{ selectedItem.jenis==='sempro'?'Seminar Proposal':'Seminar Hasil' }}
              </span>
              <span class="px-3 py-1 rounded-full text-[11px] font-extrabold" :style="statusStyle(selectedItem.status)">
                {{ selectedItem.status }}
              </span>
              <span class="px-3 py-1 rounded-full text-[11px] font-extrabold" :style="peranStyle(selectedItem.peran)">
                {{ peranLabel(selectedItem.peran) }}
              </span>
            </div>

            <!-- Schedule details -->
            <div class="px-5 mb-5">
              <div class="rounded-[20px] overflow-hidden" style="border:1px solid #f1f5f9;">
                <div class="flex items-center gap-3 p-4" style="border-bottom:1px solid #f1f5f9;">
                  <div class="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style="background:#dbeafe;">
                    <svg class="w-4 h-4" fill="none" stroke="#1565C0" viewBox="0 0 24 24" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold" style="color:#94a3b8;">Tanggal</p>
                    <p class="text-[13px] font-extrabold" style="color:#0f172a;">{{ formatTanggalPanjang(selectedItem.tanggal) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-4" style="border-bottom:1px solid #f1f5f9;">
                  <div class="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style="background:#f0f7ff;">
                    <svg class="w-4 h-4" fill="none" stroke="#1565C0" viewBox="0 0 24 24" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold" style="color:#94a3b8;">Waktu</p>
                    <p class="text-[13px] font-extrabold" style="color:#0f172a;">{{ selectedItem.jamMulai }} – {{ selectedItem.jamSelesai }} WITA</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 p-4">
                  <div class="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style="background:#f0fdf4;">
                    <svg class="w-4 h-4" fill="none" stroke="#15803d" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold" style="color:#94a3b8;">Ruangan</p>
                    <p class="text-[13px] font-extrabold" style="color:#0f172a;">{{ selectedItem.ruangan }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Close button -->
            <div class="px-5 pb-4">
              <button class="w-full py-3.5 rounded-[16px] text-[14px] font-extrabold text-white active:scale-[0.98] transition-transform"
                      style="background:linear-gradient(135deg,#1565C0 0%,#42A5F5 100%);box-shadow:0 6px 16px rgba(21,101,192,0.28);"
                      @click="selectedItem=null">
                Tutup
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>

    <DosenBottomNav/>
  </div>
</template>

<script setup lang="ts">
import type { Peran } from '~/types/domain'

// ── types ──────────────────────────────────────────
interface JadwalItem {
  id: number
  mahasiswa: string
  inisial: string
  nim: string
  jenis: 'sempro' | 'semhas'
  judul: string
  tanggal: string
  jamMulai: string
  jamSelesai: string
  ruangan: string
  peran: Peran
  status: 'Terkonfirmasi' | 'Menunggu' | 'Dijadwal Ulang'
}

// ── data (mock — nanti dari Supabase) ──────────────
const jadwalList = ref<JadwalItem[]>([
  {
    id: 1, mahasiswa: 'Ahmad Fauzan', inisial: 'AF', nim: '11201103',
    jenis: 'sempro', judul: 'Sistem Rekomendasi Skripsi Berbasis ML',
    tanggal: '2026-09-04', jamMulai: '09.00', jamSelesai: '10.00',
    ruangan: 'B201', peran: 'pembimbing_utama', status: 'Terkonfirmasi'
  },
  {
    id: 2, mahasiswa: 'Nadia Ramadhani', inisial: 'NR', nim: '11251099',
    jenis: 'semhas', judul: 'Analisis Sentimen Ulasan E-commerce',
    tanggal: '2026-09-05', jamMulai: '13.00', jamSelesai: '15.00',
    ruangan: 'B203', peran: 'penguji_1', status: 'Menunggu'
  },
  {
    id: 3, mahasiswa: 'Bagas Prasetyo', inisial: 'BP', nim: '11231077',
    jenis: 'sempro', judul: 'Optimasi Rute Pengiriman Logistik',
    tanggal: '2026-09-06', jamMulai: '10.30', jamSelesai: '11.30',
    ruangan: 'B204', peran: 'pembimbing_pendamping', status: 'Terkonfirmasi'
  },
  {
    id: 4, mahasiswa: 'Clara Wijaya', inisial: 'CW', nim: '11201003',
    jenis: 'semhas', judul: 'Deteksi Objek pada Citra Satelit',
    tanggal: '2026-09-08', jamMulai: '08.30', jamSelesai: '10.30',
    ruangan: 'B202', peran: 'penguji_2', status: 'Dijadwal Ulang'
  },
  {
    id: 5, mahasiswa: 'Rizky Hidayat', inisial: 'RH', nim: '11241056',
    jenis: 'sempro', judul: 'Prediksi Harga Saham dengan LSTM',
    tanggal: '2026-09-10', jamMulai: '09.00', jamSelesai: '10.00',
    ruangan: 'B201', peran: 'pembimbing_utama', status: 'Terkonfirmasi'
  },
  {
    id: 6, mahasiswa: 'Siti Aminah', inisial: 'SA', nim: '11211088',
    jenis: 'semhas', judul: 'Klasifikasi Penyakit Daun Tanaman',
    tanggal: '2026-09-12', jamMulai: '13.00', jamSelesai: '15.00',
    ruangan: 'B205', peran: 'penguji_1', status: 'Menunggu'
  },
])

// ── filter & search ───────────────────────────────
const tabs = [
  { label: 'Semua', value: 'semua' },
  { label: 'Proposal', value: 'sempro' },
  { label: 'Hasil', value: 'semhas' },
]
const activeFilter = ref<'semua' | 'sempro' | 'semhas'>('semua')
const searchQuery   = ref('')
type RoleFilter = 'semua' | 'pembimbing' | 'penguji'
type StatusFilter = 'semua' | 'perlu'
const roleFilter = ref<RoleFilter>('semua')
const statusFilter = ref<StatusFilter>('semua')
const draftRoleFilter = ref<RoleFilter>('semua')
const draftStatusFilter = ref<StatusFilter>('semua')
const showFilters = ref(false)
const roleOptions = [
  { label: 'Semua', value: 'semua' as RoleFilter },
  { label: 'Pembimbing', value: 'pembimbing' as RoleFilter },
  { label: 'Penguji', value: 'penguji' as RoleFilter },
]
const statusOptions = [
  { label: 'Semua Status', value: 'semua' as StatusFilter },
  { label: 'Perlu Konfirmasi', value: 'perlu' as StatusFilter },
]

const filteredJadwal = computed(() => {
  let list = jadwalList.value
  if (activeFilter.value !== 'semua') list = list.filter(j => j.jenis === activeFilter.value)
  if (roleFilter.value !== 'semua') {
    list = list.filter(j => roleFilter.value === 'pembimbing'
      ? j.peran.startsWith('pembimbing')
      : j.peran.startsWith('penguji'))
  }
  if (statusFilter.value === 'perlu') list = list.filter(j => j.status === 'Menunggu')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(j =>
      j.mahasiswa.toLowerCase().includes(q) ||
      j.nim.includes(q) ||
      j.judul.toLowerCase().includes(q)
    )
  }
  return list
})

const hasExtraFilter = computed(() => roleFilter.value !== 'semua' || statusFilter.value !== 'semua')
const activeChips = computed(() => {
  const chips: { key: 'role' | 'status'; label: string }[] = []
  if (roleFilter.value !== 'semua') chips.push({ key: 'role', label: roleFilter.value === 'pembimbing' ? 'Pembimbing' : 'Penguji' })
  if (statusFilter.value === 'perlu') chips.push({ key: 'status', label: 'Perlu Konfirmasi' })
  return chips
})
const applyFilters = () => {
  roleFilter.value = draftRoleFilter.value
  statusFilter.value = draftStatusFilter.value
  showFilters.value = false
}
const clearChip = (key: 'role' | 'status') => {
  if (key === 'role') roleFilter.value = draftRoleFilter.value = 'semua'
  else statusFilter.value = draftStatusFilter.value = 'semua'
}

// ── detail sheet ──────────────────────────────────
const selectedItem = ref<JadwalItem | null>(null)
const openDetail = (item: JadwalItem) => { selectedItem.value = item }

watch([showFilters, selectedItem], ([filtersOpen, detailOpen]) => {
  if (typeof document !== 'undefined') document.body.style.overflow = filtersOpen || detailOpen ? 'hidden' : ''
})
onUnmounted(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

// ── helpers ───────────────────────────────────────
const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const formatTanggal = (d: string) => {
  if (!d) return ''
  const [y, m, dd] = d.split('-').map(Number)
  return `${dd} ${BULAN[m-1]} ${y}`
}
const formatTanggalPanjang = (d: string) => {
  if (!d) return ''
  const [y, m, dd] = d.split('-').map(Number)
  const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
  const date = new Date(y, m-1, dd)
  return `${hari[date.getDay()]}, ${dd} ${BULAN[m-1]} ${y}`
}

const peranLabel = (p: Peran) => ({
  pembimbing_utama: 'Pembimbing 1',
  pembimbing_pendamping: 'Pembimbing 2',
  penguji_1: 'Penguji 1',
  penguji_2: 'Penguji 2',
}[p] ?? p)

const peranStyle = (p: Peran) => p.startsWith('pembimbing')
  ? 'background:#dbeafe;color:#1d4ed8;'
  : 'background:#ede9fe;color:#7c3aed;'

const statusStyle = (s: string) => ({
  'Terkonfirmasi': 'background:#dcfce7;color:#15803d;',
  'Menunggu':      'background:#fff7ed;color:#c2410c;',
  'Dijadwal Ulang':'background:#fdf2f8;color:#db2777;',
}[s] ?? 'background:#f1f5f9;color:#475569;')
</script>

<style scoped>
.jadwal-item {
  background:#ffffff;
  border:1px solid #edf3f9;
  box-shadow:0 6px 20px rgba(15,71,161,0.06);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease,background .2s ease;
}
.jadwal-item:active {
  transform:scale(.985);
  background:#f8fbff;
  box-shadow:0 3px 10px rgba(15,71,161,0.06);
}
.jadwal-badge {
  transition:transform .2s ease, filter .2s ease;
}
.jadwal-item:active .jadwal-badge {
  transform:translateY(1px);
  filter:saturate(.92);
}
.result-summary {
  border-bottom:1px solid #f1f5f9;
}
.filter-button {
  color:#0D47A1;
  background:#E3F2FD;
  border:1px solid #90CAF9;
  box-shadow:0 5px 14px rgba(33,150,243,.16);
}
.sheet-backdrop {
  background:rgba(15,23,42,.4);
  backdrop-filter:blur(5px);
  -webkit-backdrop-filter:blur(5px);
}
.filter-indicator {
  position:absolute;
  top:7px;
  right:7px;
  width:6px;
  height:6px;
  border:1.5px solid #E3F2FD;
  border-radius:999px;
  background:#0D47A1;
}
.filter-chip {
  display:flex;
  align-items:center;
  gap:6px;
  padding:6px 9px;
  border:1px solid #90CAF9;
  border-radius:999px;
  background:#E3F2FD;
  color:#0D47A1;
  font-size:10px;
  font-weight:800;
  transition:transform .2s ease,background .2s ease;
}
.filter-chip span { font-size:15px; font-weight:500; line-height:10px; }
.filter-chip:active { transform:scale(.95); background:#d3eafd; }
.filter-sheet { max-height:88vh; overflow-y:auto; overscroll-behavior:contain; box-shadow:0 -12px 36px rgba(15,23,42,.16); }
.filter-close {
  display:flex;
  width:32px;
  height:32px;
  align-items:center;
  justify-content:center;
  border-radius:999px;
  background:#f1f5f9;
  color:#64748b;
  font-size:23px;
  line-height:1;
}
.filter-heading {
  margin-bottom:10px;
  color:#334155;
  font-size:11px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.06em;
}
.filter-options { display:flex; flex-wrap:wrap; gap:8px; }
.filter-options button {
  min-height:36px;
  padding:0 13px;
  border:1px solid #e2e8f0;
  border-radius:999px;
  background:#f8fafc;
  color:#64748b;
  font-size:12px;
  font-weight:700;
  transition:all .2s ease;
}
.filter-options button.selected {
  border-color:#2196F3;
  background:#2196F3;
  color:white;
  box-shadow:0 5px 12px rgba(33,150,243,.2);
}
.filter-options button:active { transform:scale(.96); }
.apply-filter {
  width:100%;
  min-height:46px;
  border-radius:14px;
  background:#1565C0;
  color:white;
  font-size:13px;
  font-weight:800;
  box-shadow:0 7px 16px rgba(21,101,192,.22);
  transition:transform .2s ease,filter .2s ease;
}
.apply-filter:active { transform:scale(.98); filter:brightness(.96); }
.sheet-enter-active,.sheet-leave-active { transition:opacity .25s ease; }
.sheet-enter-from,.sheet-leave-to { opacity:0; }
.sheet-enter-active .filter-sheet,.sheet-leave-active .filter-sheet { transition:transform .3s cubic-bezier(.16,1,.3,1); }
.sheet-enter-from .filter-sheet,.sheet-leave-to .filter-sheet { transform:translateY(100%); }
.result-dot {
  width:6px;
  height:6px;
  border-radius:999px;
  background:#2196f3;
  box-shadow:0 0 0 4px #e3f2fd;
}
.result-caption {
  color:#c0cad6;
  font-size:10px;
  font-weight:700;
  letter-spacing:.02em;
}
@media (hover:hover) and (pointer:fine) {
  .jadwal-item:hover {
    transform:translateY(-3px);
    border-color:#90CAF9;
    box-shadow:0 12px 26px rgba(15,71,161,0.1);
  }
  .jadwal-item:hover .jadwal-badge {
    transform:translateY(-1px);
  }
}

/* List transition */
.list-enter-active, .list-leave-active { transition: all 0.25s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-8px); }

/* Sheet */
.bd-enter-active,.bd-leave-active { transition: opacity 0.28s ease; }
.bd-enter-from,.bd-leave-to { opacity: 0; }
.su-enter-active { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
.su-leave-active { transition: transform 0.25s ease-in; }
.su-enter-from,.su-leave-to { transform: translateY(100%); }
</style>