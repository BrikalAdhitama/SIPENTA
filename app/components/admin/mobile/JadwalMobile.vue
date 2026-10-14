<template>
  <div class="min-h-screen font-sans pb-24 relative" style="background-color: #ffffff;">
    
    <!-- LIST VIEW -->
    <div v-if="!selectedJadwal" class="animate-in fade-in slide-in-from-left-4 duration-300">
      
      <header class="mobile-safe-top px-6 pb-4 sticky top-0 z-30" style="background-color: #ffffff;">
        <h1 class="text-[26px] font-extrabold tracking-tight leading-tight mb-1" style="color: #0F172A;">Daftar Jadwal</h1>
        <p class="text-[13px] font-medium" style="color: #64748B;">Semua hasil penjadwalan yang telah dibuat</p>
      </header>

      <main class="px-6 pt-4">
        <!-- Search Bar -->
        <div class="relative mb-5">
          <input v-model="cariJadwal" type="text" placeholder="Search ..." class="w-full rounded-full py-4 pl-6 pr-16 text-[15px] font-medium focus:outline-none transition-all bg-slate-50 text-ink placeholder:text-slate-400 focus:ring-2 focus:ring-primary-100" />
          <button class="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-transform active:scale-95 bg-primary-500 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>

        <!-- Filter Pills -->
        <div class="flex gap-2.5 mb-6 overflow-x-auto custom-scrollbar pb-1">
          <button @click="activeFilter = 'Semua'" class="px-6 py-2.5 min-h-[44px] rounded-full font-semibold text-[14px] transition-all whitespace-nowrap border" :class="activeFilter === 'Semua' ? 'bg-primary-900 border-primary-900 text-white' : 'bg-surface border-border text-muted'">Semua</button>
          <button @click="activeFilter = 'Sempro'" class="px-6 py-2.5 min-h-[44px] rounded-full font-semibold text-[14px] transition-all whitespace-nowrap border" :class="activeFilter === 'Sempro' ? 'bg-primary-900 border-primary-900 text-white' : 'bg-surface border-border text-muted'">Sempro</button>
          <button @click="activeFilter = 'Semhas'" class="px-6 py-2.5 min-h-[44px] rounded-full font-semibold text-[14px] transition-all whitespace-nowrap border" :class="activeFilter === 'Semhas' ? 'bg-primary-900 border-primary-900 text-white' : 'bg-surface border-border text-muted'">Semhas</button>
        </div>

        <!-- Cards List -->
        <div class="flex flex-col gap-4">
          <div v-for="jadwal in filteredJadwals" :key="jadwal.id"
                @click="openDetail(jadwal)"
                class="bg-surface rounded-[20px] p-4 flex gap-3.5 active:scale-[0.98] transition-all duration-200 cursor-pointer group border border-primary-900 shadow-card">

            <!-- Icon Box -->
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-primary-100 text-primary-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12h6M9 15h4"></path>
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-bold text-[15px] text-ink leading-snug group-hover:text-primary-900 transition-colors">{{ jadwal.title }}</h3>
                <svg class="w-5 h-5 shrink-0 text-slate-300 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <p class="text-[13px] font-medium text-primary-900 mt-0.5">{{ jadwal.date }}</p>

              <div class="flex items-end justify-between mt-2.5">
                <span class="px-3.5 py-1 rounded-full text-[12px] font-medium"
                      :class="jadwal.type === 'Sempro' ? 'bg-sempro-soft text-sempro' : 'bg-semhas-soft text-semhas'">
                  {{ jadwal.type }}
                </span>
                <div class="text-right leading-none">
                  <span class="font-extrabold text-[20px] text-ink">{{ jadwal.scheduled }}/{{ jadwal.total }}</span>
                  <p class="text-[11px] font-medium text-muted mt-1">Terjadwal</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!filteredJadwals.length" class="text-center py-10 text-muted text-[13px] font-medium">
            Belum ada jadwal{{ cariJadwal ? ` untuk “${cariJadwal}”` : '' }}.
          </div>
        </div>

      </main>

      <!-- Bottom Nav -->
      <BottomNav />
    </div>

    <!-- DETAIL VIEW -->
    <div v-else class="animate-in fade-in slide-in-from-right-4 duration-300 min-h-screen" style="background-color: #ffffff;">
      
      <header class="mobile-safe-top px-6 pb-4 sticky top-0 z-30 border-b shadow-sm bg-white/90 backdrop-blur-md" style="border-color: #F8FAFC;">
        <button @click="selectedJadwal = null" class="flex items-center gap-1.5 font-bold text-[13px] mb-5 hover:opacity-70 transition-opacity active:scale-95 origin-left text-primary-900">
          <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          Semua Jadwal
        </button>
        <h1 class="text-[22px] font-extrabold tracking-tight leading-snug mb-1" style="color: #0F172A;">{{ selectedJadwal.title.split(' Gel.')[0] }} — {{ selectedJadwal.details?.period || '-' }}</h1>
        <p class="text-[12px] font-medium" style="color: #64748B;">
          Periode {{ selectedJadwal.details?.period || '-' }} &middot; Dibuat {{ selectedJadwal.details?.created || selectedJadwal.dibuat || '-' }} &middot;
        </p>
      </header>

      <main class="p-6 pt-5">
        <!-- Summary Cards (Grid, no scroll) -->
        <div class="grid grid-cols-3 gap-3 mb-8">
          <!-- Card 1: Total -->
          <div class="rounded-[22px] p-3 flex flex-col items-center text-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 active:scale-95 group" style="background-color: #ffffff; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
            <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full transition-transform duration-500 group-hover:scale-150" style="background-color: #F0F9FF; opacity: 0.6;"></div>
            
            <div class="w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style="background-color: #E0F2FE; color: #0284C7;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            
            <div class="relative z-10 mt-auto flex flex-col items-center w-full">
              <div class="font-extrabold text-[24px] leading-none mb-1.5" style="color: #0F172A;">{{ selectedJadwal.details?.totalSeminar || 25 }}</div>
              <div class="text-[10px] font-bold leading-tight" style="color: #64748B;">Total<br>Seminar</div>
            </div>
          </div>

          <!-- Card 2: Disetujui -->
          <div class="rounded-[22px] p-3 flex flex-col items-center text-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 active:scale-95 group" style="background-color: #ffffff; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
            <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full transition-transform duration-500 group-hover:scale-150" style="background-color: #ECFDF5; opacity: 0.6;"></div>
            
            <div class="w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style="background-color: #D1FAE5; color: #059669;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            
            <div class="relative z-10 mt-auto flex flex-col items-center w-full">
              <div class="font-extrabold text-[24px] leading-none mb-1.5" style="color: #0F172A;">{{ selectedJadwal.details?.disetujui || 2 }}</div>
              <div class="text-[10px] font-bold leading-tight" style="color: #64748B;">Disetujui</div>
            </div>
          </div>

          <!-- Card 3: Menunggu -->
          <div class="rounded-[22px] p-3 flex flex-col items-center text-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 active:scale-95 group" style="background-color: #ffffff; border: 1px solid #F1F5F9; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
            <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full transition-transform duration-500 group-hover:scale-150" style="background-color: #FFFBEB; opacity: 0.6;"></div>
            
            <div class="w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" style="background-color: #FEF3C7; color: #D97706;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            
            <div class="relative z-10 mt-auto flex flex-col items-center w-full">
              <div class="font-extrabold text-[24px] leading-none mb-1.5" style="color: #0F172A;">{{ selectedJadwal.details?.menunggu || 4 }}</div>
              <div class="text-[10px] font-bold leading-tight" style="color: #64748B;">Menunggu<br>Konfirmasi</div>
            </div>
          </div>
        </div>

        <h2 class="text-[16px] font-extrabold mb-4 tracking-tight" style="color: #0F172A;">Jadwal Seminar Proposal</h2>

        <!-- Detail Cards List -->
        <div class="flex flex-col gap-4">
          <div v-for="(seminar, idx) in (selectedJadwal.details?.seminars || mockSeminars)" :key="idx" 
               @click="selectedStudent = seminar"
               class="rounded-2xl p-5 shadow-sm border cursor-pointer transition-transform active:scale-[0.98]" style="background-color: #ffffff; border-color: #E2E8F0;">
            
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-extrabold text-[15px]" style="color: #0F172A;">{{ seminar.name }}</h3>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide" :style="seminar.statusStyle">
                {{ seminar.status }}
              </span>
            </div>
            
            <p class="text-[12px] font-medium mb-4" style="color: #64748B;">{{ seminar.date }} &middot; {{ seminar.time }}</p>
            
            <div class="flex items-center gap-4 text-[12px] font-medium mb-6" style="color: #64748B;">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" style="color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                {{ seminar.room }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" style="color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                {{ seminar.lecturer }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="text-[11px] font-bold" style="color: #94A3B8;">Progress Persetujuan</span>
                <span class="text-[11px] font-bold" :style="{ color: seminar.progressValue === seminar.progressMax ? '#388E3C' : seminar.progressValue <= 1 ? '#D32F2F' : '#F57F17' }">
                  {{ seminar.progressText }}
                </span>
              </div>
              <div class="w-full h-1.5 rounded-full overflow-hidden" style="background-color: #F1F5F9;">
                <div class="h-full rounded-full transition-all duration-500" 
                     :style="{ width: `${(seminar.progressValue / seminar.progressMax) * 100}%`, backgroundColor: seminar.progressValue === seminar.progressMax ? '#4CAF50' : seminar.progressValue <= 1 ? '#EF5350' : '#FFB300' }"></div>
              </div>
            </div>

          </div>
        </div>

      </main>

      <div class="h-24"></div> <!-- padding bottom -->
    </div>

    <!-- Student Detail Bottom Sheet Modal -->
    <div v-if="selectedStudent" class="fixed inset-0 z-[100] flex flex-col justify-end">
      <!-- Backdrop -->
      <div class="absolute inset-0 transition-opacity duration-300" style="background-color: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);" @click="selectedStudent = null"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full rounded-t-[32px] p-6 pb-10 transition-transform duration-300 transform translate-y-0 shadow-2xl h-auto max-h-[90vh] overflow-y-auto" style="background-color: #ffffff;">
        <!-- Drag Handle -->
        <div class="w-12 h-1.5 rounded-full mx-auto mb-6" style="background-color: #E2E8F0;"></div>
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-5">
          <div>
            <h2 class="font-extrabold text-[22px] leading-tight mb-2.5" style="color: #0F172A;">{{ selectedStudent.name }}</h2>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-md text-[11px] font-bold border" style="background-color: #F0F6FF; color: #1976D2; border-color: #D3E3FD;">{{ selectedStudent.type || 'Sempro' }}</span>
              <span class="px-3 py-1 rounded-md text-[11px] font-bold" :style="selectedStudent.statusStyle">{{ selectedStudent.status }}</span>
            </div>
          </div>
          <button @click="selectedStudent = null" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-90" style="background-color: #F8FAFC; color: #64748B;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <!-- Info Boxes (Date, Time, Room) -->
        <div class="flex flex-wrap gap-2 mb-6">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg border" style="border-color: #F1F5F9; color: #475569;">
            <svg class="w-4 h-4" style="color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span class="text-[12px] font-medium">{{ selectedStudent.date }}</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg border" style="border-color: #F1F5F9; color: #475569;">
            <svg class="w-4 h-4" style="color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-[12px] font-medium">{{ selectedStudent.time }}</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg border" style="border-color: #F1F5F9; color: #475569;">
            <svg class="w-4 h-4" style="color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <span class="text-[12px] font-medium">{{ selectedStudent.room }}</span>
          </div>
        </div>

        <!-- Progress -->
        <div class="mb-6">
          <div class="flex justify-between items-end mb-2.5">
            <span class="text-[12px] font-medium" style="color: #64748B;">Progress Persetujuan</span>
            <span class="text-[12px] font-bold" :style="{ color: selectedStudent.progressValue === selectedStudent.progressMax ? '#10B981' : selectedStudent.progressValue <= 1 ? '#EF4444' : '#F59E0B' }">
              {{ selectedStudent.progressText }}
            </span>
          </div>
          <div class="w-full h-2 rounded-full overflow-hidden" style="background-color: #E2E8F0;">
            <div class="h-full rounded-full transition-all duration-700 ease-out" 
                 :style="{ width: `${(selectedStudent.progressValue / selectedStudent.progressMax) * 100}%`, backgroundColor: selectedStudent.progressValue === selectedStudent.progressMax ? '#10B981' : selectedStudent.progressValue <= 1 ? '#EF4444' : '#F59E0B' }"></div>
          </div>
        </div>

        <!-- Dosen Grid -->
        <div class="grid grid-cols-2 gap-3" v-if="selectedStudent.dosens">
          <div v-for="(dosen, dIdx) in selectedStudent.dosens" :key="dIdx"
               class="rounded-[20px] p-4 flex flex-col relative overflow-hidden border"
               :style="{
                 backgroundColor: dosen.theme === 'green' ? '#F0FDF4' : dosen.theme === 'yellow' ? '#FFFBEB' : '#FEF2F2',
                 borderColor: dosen.theme === 'green' ? '#BBF7D0' : dosen.theme === 'yellow' ? '#FEF08A' : '#FECACA'
               }">
            
            <!-- Status Dot (Top Right) -->
            <div class="absolute right-4 top-4 w-2 h-2 rounded-full" 
                 :style="{ backgroundColor: dosen.theme === 'green' ? '#22C55E' : dosen.theme === 'yellow' ? '#F59E0B' : '#EF4444' }"></div>
            
            <!-- Role -->
            <div class="text-[9px] font-bold tracking-wider uppercase mb-1.5" 
                 :style="{ color: dosen.theme === 'green' ? '#64748B' : dosen.theme === 'yellow' ? '#64748B' : '#64748B' }">
              {{ dosen.role }}
            </div>
            
            <!-- Name -->
            <div class="font-extrabold text-[13px] mb-3 leading-tight" style="color: #0F172A;">
              {{ dosen.name }}
            </div>
            
            <!-- Badge & Error Container -->
            <div class="mt-3 flex flex-col items-start gap-2">
              <!-- Badge -->
              <span class="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold"
                    :style="{ 
                      backgroundColor: dosen.theme === 'green' ? '#DCFCE7' : dosen.theme === 'yellow' ? '#FEF9C3' : '#FEE2E2',
                      color: dosen.theme === 'green' ? '#15803D' : dosen.theme === 'yellow' ? '#B45309' : '#B91C1C'
                    }">
                {{ dosen.status }}
              </span>
              
              <!-- Error Message (If Any) -->
              <div v-if="dosen.error" class="flex items-start gap-1.5 w-full">
                <svg style="width: 14px; height: 14px; flex-shrink: 0; color: #EF4444; margin-top: 1px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span class="text-[9px] font-medium leading-[1.3]" style="color: #EF4444;">
                  {{ dosen.error }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BottomNav from '~/components/BottomNav.vue'
import { App } from '@capacitor/app'

const activeFilter = ref('Semua')
const cariJadwal = ref('')
const selectedJadwal = ref(null)
const selectedStudent = ref(null)

// Intercept Android hardware back button
let backHandler = null
function fmtTgl(iso) {
  const d = new Date(String(iso ?? ''))
  if (Number.isNaN(d.getTime())) return String(iso ?? '-')
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}
function fmtRentang(tgls) {
  const bersih = [...tgls].filter(Boolean).sort()
  if (!bersih.length) return '-'
  if (bersih.length === 1) return fmtTgl(bersih[0])
  const a = new Date(bersih[0]); const b = new Date(bersih[bersih.length - 1])
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return `${bersih[0]} – ${bersih[bersih.length - 1]}`
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()} – ${fmtTgl(b)}`
  }
  return `${fmtTgl(a)} – ${fmtTgl(b)}`
}
function fmtBulanTahun(iso) {
  const d = new Date(String(iso ?? ''))
  if (Number.isNaN(d.getTime())) return String(iso ?? '-')
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(d)
}
function fmtPeriode(tgls) {
  const bersih = [...tgls].filter(Boolean).sort()
  if (!bersih.length) return '-'
  const a = fmtBulanTahun(bersih[0]); const b = fmtBulanTahun(bersih[bersih.length - 1])
  return a === b ? a : `${a} – ${b}`
}
async function muatJadwal() {
  try {
    const res = await $fetch('/api/runs')
    const rows = res?.data ?? []
    if (!rows.length) return // ponytail: tetap contoh bila kosong
    jadwals.value = rows.slice(0, 10).map((r) => {
      const j = String(r.gelombang?.jenis ?? '').toLowerCase()
      const type = j.includes('hasil') || j === 'semhas' ? 'Semhas' : 'Sempro'
      const dibuat = r.created_at ? fmtTgl(String(r.created_at).slice(0, 10)) : '-'
      const tgls = Array.isArray(r.slot_tanggal) ? r.slot_tanggal : []
      return {
        id: r.id,
        runId: r.id,
        title: r.nama ?? `Jadwal ${r.gelombang?.nama ?? (r.gelombang_id ? `Gel. ${r.gelombang_id}` : `#${r.id}`)}`,
        date: tgls.length ? fmtRentang(tgls) : dibuat,
        dibuat,
        type,
        scheduled: r.slot_tersimpan ?? 0,
        total: r.slot_tersimpan ?? 0,
        details: null, // dimuat saat openDetail via /api/runs/[id]/slots
      }
    })
  } catch {
    // ponytail: offline / belum login → tetap contoh
  }
}

async function muatDetail(jadwal) {
  try {
    const res = await $fetch(`/api/runs/${jadwal.runId ?? jadwal.id}/slots`)
    const slots = res?.data ?? []
    if (!slots.length) return
    const seminars = slots.map((s) => {
      const ap = s.approval ?? []
      const ok = ap.filter((a) => a.status === 'konfirmasi').length
      const tot = ap.length || 4
      return {
        name: s.seminar?.mahasiswa?.nama ?? s.seminar?.judul ?? 'Seminar',
        type: jadwal.type,
        date: s.tanggal ?? '-', time: `${String(s.jam_mulai ?? '').slice(0, 5)} – ${String(s.jam_selesai ?? '').slice(0, 5)}`,
        room: s.is_online ? 'Online' : (s.ruangan_kode ?? '-'),
        lecturer: ap[0]?.dosen?.nama ?? '-',
        progressText: `${ok} dari ${tot} dosen`, progressValue: ok, progressMax: tot,
        status: ok === tot ? 'Semua Disetujui' : `${ok}/${tot} Disetujui`,
        statusStyle: ok === tot ? 'background-color: #E8F5E9; color: #2E7D32;' : 'background-color: #FFF8E1; color: #F57F17;',
        dosens: ap.map((a) => ({
          role: String(a.peran ?? '').replace('_', ' ').toUpperCase(),
          name: a.dosen?.nama ?? '-', status: a.status === 'konfirmasi' ? 'Disetujui' : (a.status === 'tolak' ? 'Ditolak' : 'Menunggu'),
          error: a.status === 'tolak' ? (a.alasan ?? 'Ditolak') : null,
          theme: a.status === 'konfirmasi' ? 'green' : (a.status === 'tolak' ? 'red' : 'yellow'),
        })),
      }
    })
    const disetujui = seminars.filter((x) => x.progressValue === x.progressMax).length
    const daftarTgl = slots.map((s) => String(s.tanggal ?? ''))
    const rentang = fmtRentang(daftarTgl)
    jadwal.date = rentang // ponytail: list ikut tanggal slot asli
    jadwal.details = {
      period: fmtPeriode(daftarTgl), created: jadwal.dibuat ?? jadwal.date,
      totalSeminar: seminars.length, disetujui, menunggu: seminars.length - disetujui,
      seminars,
    }
  } catch {
    // ponytail: gagal muat detail → tetap mockSeminars
  }
}
onMounted(() => {
  muatJadwal()
  backHandler = App.addListener('backButton', () => {
    if (selectedStudent.value) {
      // Kalau modal student buka → tutup dulu
      selectedStudent.value = null
    } else if (selectedJadwal.value) {
      // Kalau di halaman detail jadwal → kembali ke list
      selectedJadwal.value = null
    } else {
      // Kalau sudah di list → back normal (keluar halaman)
      App.exitApp()
    }
  })
})

onUnmounted(() => {
  backHandler?.remove()
})

// Lock body scroll when student detail modal is open
watch(selectedStudent, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Ensure scroll is unlocked when component unmounts
onUnmounted(() => {
  document.body.style.overflow = ''
})

const mockSeminars = [
  {
    name: 'Andi Pratama',
    type: 'Sempro',
    date: '1 Sep 2026',
    time: '08:00 – 09:00',
    room: 'B201',
    lecturer: 'Dr. Sari Dewi',
    progressText: '4 dari 4 dosen',
    progressValue: 4,
    progressMax: 4,
    status: 'Semua Disetujui',
    statusStyle: 'background-color: #E8F5E9; color: #2E7D32;',
    dosens: [
      { role: 'PEMBIMBING 1', name: 'Dr. Sari Dewi', status: 'Disetujui', error: null, theme: 'green' },
      { role: 'PEMBIMBING 2', name: 'Dr. Ahmad Fauzi', status: 'Disetujui', error: null, theme: 'green' },
      { role: 'PENGUJI 1', name: 'Dr. Budi Santoso', status: 'Disetujui', error: null, theme: 'green' },
      { role: 'PENGUJI 2', name: 'Dr. Cahya Putri', status: 'Disetujui', error: null, theme: 'green' }
    ]
  },
  {
    name: 'Andi Pratama',
    type: 'Sempro',
    date: '1 Sep 2026',
    time: '09:00 – 10:00',
    room: 'B201',
    lecturer: 'Dr. Sari Dewi',
    progressText: '2 dari 4 dosen',
    progressValue: 2,
    progressMax: 4,
    status: '2/4 Disetujui',
    statusStyle: 'background-color: #FFF8E1; color: #F57F17;',
    dosens: [
      { role: 'PEMBIMBING 1', name: 'Dr. Sari Dewi', status: 'Disetujui', error: null, theme: 'green' },
      { role: 'PEMBIMBING 2', name: 'Dr. Ahmad Fauzi', status: 'Menunggu', error: null, theme: 'yellow' },
      { role: 'PENGUJI 1', name: 'Dr. Budi Santoso', status: 'Disetujui', error: null, theme: 'green' },
      { role: 'PENGUJI 2', name: 'Dr. Cahya Putri', status: 'Menunggu', error: null, theme: 'yellow' }
    ]
  },
  {
    name: 'Andi Pratama',
    type: 'Sempro',
    date: '1 Sep 2026',
    time: '10:00 – 11:00',
    room: 'B201',
    lecturer: 'Dr. Sari Dewi',
    progressText: '1 dari 4 dosen',
    progressValue: 1,
    progressMax: 4,
    status: '1/4 Ditolak',
    statusStyle: 'background-color: #FFEBEE; color: #C62828;',
    dosens: [
      { role: 'PEMBIMBING 1', name: 'Dr. Sari Dewi', status: 'Disetujui', error: null, theme: 'green' },
      { role: 'PEMBIMBING 2', name: 'Dr. Ahmad Fauzi', status: 'Menunggu', error: null, theme: 'yellow' },
      { role: 'PENGUJI 1', name: 'Dr. Budi Santoso', status: 'Ditolak', error: 'Jadwal kuliah berbenturan di jam yang sama', theme: 'red' },
      { role: 'PENGUJI 2', name: 'Dr. Cahya Putri', status: 'Menunggu', error: null, theme: 'yellow' }
    ]
  }
]

const jadwals = ref([
  {
    id: 1,
    title: 'Jadwal Sempro Gel. 1 September 2026',
    date: '15 – 20 September 2026',
    type: 'Sempro',
    scheduled: 25,
    total: 25,
    details: {
      period: 'Sep 2025',
      created: '31 Agu 2026',
      totalSeminar: 25,
      disetujui: 2,
      menunggu: 4,
      seminars: mockSeminars
    }
  },
  {
    id: 2,
    title: 'Jadwal Sempro Gel. 1 September 2026',
    date: '15 – 20 September 2026',
    type: 'Sempro',
    scheduled: 25,
    total: 25
  },
  {
    id: 3,
    title: 'Jadwal Semhas Gel. 1 September 2026',
    date: '15 – 20 September 2026',
    type: 'Semhas',
    scheduled: 25,
    total: 25
  }
])

const filteredJadwals = computed(() => {
  const q = cariJadwal.value.trim().toLowerCase()
  const rows = activeFilter.value === 'Semua' ? jadwals.value : jadwals.value.filter(j => j.type === activeFilter.value)
  if (!q) return rows
  return rows.filter(j => `${j.title} ${j.date} ${j.type}`.toLowerCase().includes(q))
})

const openDetail = async (jadwal) => {
  selectedJadwal.value = jadwal
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (!jadwal.details && (jadwal.runId ?? jadwal.id)) await muatDetail(jadwal)
}
</script>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
