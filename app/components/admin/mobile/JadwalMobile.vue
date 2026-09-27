<template>
  <div class="min-h-screen font-sans pb-24 relative" style="background-color: #ffffff;">
    
    <!-- LIST VIEW -->
    <div v-if="!selectedJadwal" class="animate-in fade-in slide-in-from-left-4 duration-300">
      
      <header class="px-6 pt-10 pb-4 sticky top-0 z-30" style="background-color: #ffffff;">
        <h1 class="text-[26px] font-extrabold tracking-tight leading-tight mb-1" style="color: #0F172A;">Daftar Jadwal</h1>
        <p class="text-[13px] font-medium" style="color: #64748B;">Semua hasil penjadwalan yang telah dibuat</p>
      </header>

      <main class="px-6">
        <!-- Search Bar -->
        <div class="relative mb-6">
          <input type="text" placeholder="Search ..." class="w-full border rounded-full py-3.5 pl-5 pr-14 text-sm font-medium focus:outline-none transition-all" style="background-color: #ffffff; border-color: #F1F5F9; color: #0F172A; box-shadow: 0 4px 20px rgba(0,0,0,0.03);" />
          <button class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm bg-primary-500 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>

        <!-- Filter Pills -->
        <div class="flex gap-2.5 mb-6 overflow-x-auto custom-scrollbar pb-1">
          <button @click="activeFilter = 'Semua'" class="px-5 py-2.5 rounded-[14px] font-bold text-[13px] transition-all whitespace-nowrap border" :class="activeFilter === 'Semua' ? 'bg-primary-900 border-primary-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'">Semua</button>
          <button @click="activeFilter = 'Sempro'" class="px-5 py-2.5 rounded-[14px] font-bold text-[13px] transition-all whitespace-nowrap border" :class="activeFilter === 'Sempro' ? 'bg-primary-900 border-primary-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'">Sempro</button>
          <button @click="activeFilter = 'Semhas'" class="px-5 py-2.5 rounded-[14px] font-bold text-[13px] transition-all whitespace-nowrap border" :class="activeFilter === 'Semhas' ? 'bg-primary-900 border-primary-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'">Semhas</button>
        </div>

        <!-- Cards List -->
        <div class="flex flex-col gap-3">
          <div v-for="jadwal in filteredJadwals" :key="jadwal.id" 
               @click="openDetail(jadwal)"
               class="rounded-2xl overflow-hidden active:scale-[0.98] transition-all duration-200 cursor-pointer group flex"
               style="background-color: #ffffff; border: 1px solid #EEF2F7; box-shadow: 0 2px 12px rgba(15,23,42,0.04);">
            
            <!-- Left Accent Bar -->
            <div class="w-1.5 shrink-0 rounded-l-2xl transition-all duration-300"
                 :style="jadwal.type === 'Sempro' ? 'background: linear-gradient(180deg, #F48FB1, #E91E63);' : 'background: linear-gradient(180deg, #90CAF9, #1565C0);'">
            </div>

            <!-- Main Content -->
            <div class="flex-1 p-4">
              <!-- Row 1: Icon + Title + Arrow -->
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: #F0F6FF;">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style="color: #1976D2;">
                    <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
                  </svg>
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-extrabold text-[13.5px] leading-snug" style="color: #0F172A;">{{ jadwal.title }}</p>
                  <p class="text-[11px] font-semibold mt-0.5" style="color: #64748B;">{{ jadwal.date }}</p>
                </div>

                <svg class="w-4 h-4 shrink-0 mt-1 transition-all duration-200 group-hover:translate-x-0.5" style="color: #CBD5E1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>

              <!-- Row 2: Badge + Count -->
              <div class="flex items-center justify-between">
                <span v-if="jadwal.type === 'Sempro'" 
                      class="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold"
                      style="background-color: #FCE4EC; color: #C2185B;">
                  Sempro
                </span>
                <span v-else
                      class="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold"
                      style="background-color: #E3F2FD; color: #1565C0;">
                  Semhas
                </span>

                <div class="flex items-baseline gap-1">
                  <span class="font-black text-[16px]" style="color: #0F172A; letter-spacing: -0.5px;">
                    {{ jadwal.scheduled }}<span style="color: #CBD5E1;">/</span>{{ jadwal.total }}
                  </span>
                  <span class="text-[10px] font-semibold" style="color: #94A3B8;">Terjadwal</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>

      <!-- Bottom Nav -->
      <BottomNav />
    </div>

    <!-- DETAIL VIEW -->
    <div v-else class="animate-in fade-in slide-in-from-right-4 duration-300 min-h-screen" style="background-color: #ffffff;">
      
      <header class="px-6 pt-10 pb-4 sticky top-0 z-30 border-b shadow-sm" style="background-color: #ffffff; border-color: #F8FAFC;">
        <button @click="selectedJadwal = null" class="flex items-center gap-1.5 font-bold text-[13px] mb-5 hover:opacity-70 transition-opacity active:scale-95 origin-left text-primary-900">
          <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          Semua Jadwal
        </button>
        <h1 class="text-[22px] font-extrabold tracking-tight leading-snug mb-1" style="color: #0F172A;">{{ selectedJadwal.title.split(' Gel.')[0] }} — Sep 2026</h1>
        <p class="text-[12px] font-medium" style="color: #64748B;">
          Periode {{ selectedJadwal.details?.period || 'Sep 2025' }} &middot; Dibuat {{ selectedJadwal.details?.created || '31 Agu 2026' }} &middot;
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
import { ref, computed, watch, onUnmounted } from 'vue'
import BottomNav from '~/components/BottomNav.vue'

const activeFilter = ref('Semua')
const selectedJadwal = ref(null)
const selectedStudent = ref(null)

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
  if (activeFilter.value === 'Semua') return jadwals.value
  return jadwals.value.filter(j => j.type === activeFilter.value)
})

const openDetail = (jadwal) => {
  selectedJadwal.value = jadwal
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
