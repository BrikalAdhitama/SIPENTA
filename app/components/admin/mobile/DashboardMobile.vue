<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-32">
    <main class="p-6 max-w-lg mx-auto">
      
      <!-- Top Header -->
      <header class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <!-- Profile Picture (Placeholder) -->
          <img src="https://ui-avatars.com/api/?name=Marci+Xander&background=0D47A1&color=fff&size=100" alt="Profile" class="w-14 h-14 rounded-full object-cover shadow-sm" />
          <div>
            <p class="text-slate-500 text-sm font-medium">Hello!</p>
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Marci Xander</h1>
          </div>
        </div>
        <!-- Notification Bell -->
        <NuxtLink to="/admin/notifications" class="relative p-2 rounded-full bg-white shadow-sm hover:bg-slate-100 transition-colors">
          <svg class="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span class="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </NuxtLink>
      </header>



      <!-- Overview Section -->
      <section class="mb-8">
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-xl font-bold text-slate-800">Overview</h2>
        </div>

        <!-- Metric Cards Grid -->
        <div class="grid grid-cols-2 gap-4">
          
          <!-- Card 1: Total Mahasiswa -->
          <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col">
            <div class="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <p class="text-slate-500 text-xs font-medium mb-1">Total Mahasiswa</p>
            <p class="text-2xl font-extrabold text-slate-800 mb-2">155</p>
            <div class="text-[10px] text-slate-500 mt-auto">
              Semester Ganjil 2025/2026
            </div>
          </div>

          <!-- Card 2: Seminar Proposal -->
          <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col">
            <div class="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <p class="text-slate-500 text-xs font-medium mb-1">Seminar Proposal</p>
            <p class="text-2xl font-extrabold text-slate-800 mb-2">24</p>
            <div class="text-[10px] text-slate-500 mt-auto">
              Mahasiswa
            </div>
          </div>

          <!-- Card 3: Seminar Hasil -->
          <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col">
            <div class="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-slate-500 text-xs font-medium mb-1">Seminar Hasil</p>
            <p class="text-2xl font-extrabold text-slate-800 mb-2">15</p>
            <div class="text-[10px] text-slate-500 mt-auto">
              Mahasiswa
            </div>
          </div>

          <!-- Card 4: Ruangan Aktif -->
          <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col">
            <div class="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <p class="text-slate-500 text-xs font-medium mb-1">Ruangan Aktif</p>
            <p class="text-2xl font-extrabold text-slate-800 mb-2">4 <span class="text-sm font-semibold text-slate-400">/10</span></p>
            <div class="text-[10px] text-slate-500 mt-auto">
              B201-B204
            </div>
          </div>

        </div>
      </section>

      <!-- Jadwal Terbaru Section -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-slate-800">Jadwal Terbaru</h2>
          <a href="#" class="text-primary-900 text-sm font-semibold flex items-center hover:underline">
            Lihat selengkapnya
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-slate-100/50 overflow-hidden">
          <!-- List Header -->
          <div class="flex justify-between items-center p-4 px-5 border-b border-slate-100 relative">
            <h3 class="text-slate-800 font-medium">Jadwal hari ini</h3>
            
            <div class="relative">
              <button @click="isDropdownOpen = !isDropdownOpen" class="bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium py-1.5 px-3 rounded-full flex items-center transition-colors">
                {{ selectedFilter }}
                <svg class="w-4 h-4 ml-1 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20">
                <button @click="selectFilter('Semua')" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Semua</button>
                <button @click="selectFilter('Sempro')" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Sempro</button>
                <button @click="selectFilter('Semhas')" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Semhas</button>
              </div>
            </div>
          </div>

          <!-- List Items -->
          <div class="flex flex-col">
            
            <!-- Item 1 (Sempro) -->
            <div v-if="selectedFilter === 'Semua' || selectedFilter === 'Sempro'" class="p-5 border-b border-slate-50 flex items-start gap-4">
              <!-- Avatar -->
              <div class="w-12 h-12 shrink-0 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                AP
              </div>
              
              <!-- Info -->
              <div class="flex-1 pt-1">
                <h4 class="font-bold text-slate-800 text-base leading-tight">Andi Pratama</h4>
                <span class="inline-block mt-1 px-2 py-0.5 bg-pink-50 text-pink-500 text-xs font-semibold rounded-full">
                  Sempro
                </span>
              </div>

              <!-- Details (Date, Time, Room) -->
              <div class="flex flex-col gap-1.5 text-xs font-bold text-primary-900">
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span>1 September 2026</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>08:00 - 09:00</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>B201</span>
                </div>
              </div>
            </div>

            <!-- Item 2 (Semhas) -->
            <div v-if="selectedFilter === 'Semua' || selectedFilter === 'Semhas'" class="p-5 flex items-start gap-4">
              <!-- Avatar -->
              <div class="w-12 h-12 shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                BD
              </div>
              
              <!-- Info -->
              <div class="flex-1 pt-1">
                <h4 class="font-bold text-slate-800 text-base leading-tight">Budi Darmawan</h4>
                <span class="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-500 text-xs font-semibold rounded-full">
                  Semhas
                </span>
              </div>

              <!-- Details (Date, Time, Room) -->
              <div class="flex flex-col gap-1.5 text-xs font-bold text-primary-900">
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span>2 September 2026</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>10:00 - 11:30</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>B202</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Aksi Cepat Section -->
      <section class="mt-8">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Aksi Cepat</h2>
        
        <div class="grid grid-cols-3 gap-3">
          
          <!-- Action 1: Buat Penjadwalan -->
          <button class="aspect-square rounded-[22px] bg-gradient-to-br from-[#42A5F5] to-[#1565C0] shadow-[0_6px_16px_rgba(21,101,192,0.25)] flex flex-col items-center justify-center gap-2.5 p-2 transition-transform active:scale-95">
            <div class="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span class="text-white text-[11px] font-medium text-center leading-[1.25]">Buat<br>Penjadwalan</span>
          </button>

          <!-- Action 2: Upload Data SPS -->
          <button class="aspect-square rounded-[22px] bg-gradient-to-br from-[#42A5F5] to-[#1565C0] shadow-[0_6px_16px_rgba(21,101,192,0.25)] flex flex-col items-center justify-center gap-2.5 p-2 transition-transform active:scale-95">
            <div class="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5m-7 7l7-7 7 7"></path></svg>
            </div>
            <span class="text-white text-[11px] font-medium text-center leading-[1.25]">Upload<br>Data SPS</span>
          </button>

          <!-- Action 3: Lihat Jadwal -->
          <button class="aspect-square rounded-[22px] bg-gradient-to-br from-[#42A5F5] to-[#1565C0] shadow-[0_6px_16px_rgba(21,101,192,0.25)] flex flex-col items-center justify-center gap-2.5 p-2 transition-transform active:scale-95">
            <div class="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </div>
            <span class="text-white text-[11px] font-medium text-center leading-[1.25]">Lihat<br>Jadwal</span>
          </button>

        </div>
      </section>

    </main>

    <!-- Mobile Bottom Nav -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDropdownOpen = ref(false)
const selectedFilter = ref('Semua')

const selectFilter = (filter) => {
  selectedFilter.value = filter
  isDropdownOpen.value = false
}
</script>
