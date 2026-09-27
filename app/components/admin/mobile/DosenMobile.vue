<template>
  <div class="min-h-screen font-sans pb-24 relative" style="background-color: #ffffff;">
    
    <!-- Top Header & Stats (Not sticky anymore) -->
    <div class="pt-10 pb-4">
      
      <!-- Top Tabs -->
      <div class="px-6">
        <div class="flex rounded-2xl p-1 mb-6" style="background-color: #F8FAFC; border: 1px solid #F1F5F9;">
          <button 
            @click="activeTab = 'Daftar Dosen'"
            class="flex-1 py-3 text-sm font-bold rounded-xl transition-all"
            :class="activeTab === 'Daftar Dosen' ? 'shadow-sm' : 'hover:opacity-70'"
            :style="activeTab === 'Daftar Dosen' ? 'background-color: #2196F3; color: #ffffff;' : 'color: #64748B; background-color: transparent;'">
            Daftar Dosen
          </button>
          <button 
            @click="activeTab = 'Jadwal Dosen'"
            class="flex-1 py-3 text-sm font-bold rounded-xl transition-all"
            :class="activeTab === 'Jadwal Dosen' ? 'shadow-sm' : 'hover:opacity-70'"
            :style="activeTab === 'Jadwal Dosen' ? 'background-color: #2196F3; color: #ffffff;' : 'color: #64748B; background-color: transparent;'">
            Jadwal Dosen
          </button>
        </div>
      </div>

      <!-- ============================== -->
      <!-- DAFTAR DOSEN VIEW -->
      <!-- ============================== -->
      <div v-if="activeTab === 'Daftar Dosen'" class="animate-in fade-in slide-in-from-left-4 duration-300">
        <!-- Header: Title + Add Button -->
        <div class="px-6 flex justify-between items-start mb-6">
          <div class="flex flex-col gap-1.5 w-full">
            <h1 class="text-[26px] font-extrabold tracking-tight leading-none" style="color: #0F172A;">Data Dosen</h1>
            <p class="text-[12px] font-medium leading-snug" style="color: #64748B; max-width: 85%;">Kelola data profil dosen pengajar.</p>
          </div>
          <button @click="showAddModal = true" class="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-[0_4px_12px_rgba(15,59,140,0.2)]" style="background-color: #0F3B8C; color: #ffffff;">
            <svg style="width: 22px; height: 22px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>

        <!-- Faint separator line -->
        <div class="w-full h-[1px] mb-6" style="background-color: #F1F5F9;"></div>

        <!-- Summary Cards (Identical Fixed Sizes using Inline Styles) -->
        <div class="flex gap-3 overflow-x-auto custom-scrollbar pb-2 px-6">
          <!-- Card 1 -->
          <div class="rounded-[20px] p-4 flex flex-col items-start justify-center" style="background-color: #E8F4FE; width: 112px; height: 112px; flex-shrink: 0;">
            <div class="rounded-full bg-white flex items-center justify-center mb-3 shadow-sm shrink-0" style="width: 32px; height: 32px;">
              <svg style="width: 20px; height: 20px; color: #2196F3;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <div class="flex flex-col gap-1 w-full">
              <h3 class="font-medium leading-none" style="color: #1E293B; font-size: 22px;">30</h3>
              <p class="font-medium whitespace-nowrap" style="color: #64748B; font-size: 10px;">Total Dosen</p>
            </div>
          </div>
          <!-- Card 2 -->
          <div class="rounded-[20px] p-4 flex flex-col items-start justify-center" style="background-color: #E8F4FE; width: 112px; height: 112px; flex-shrink: 0;">
            <div class="rounded-full bg-white flex items-center justify-center mb-3 shadow-sm shrink-0" style="width: 32px; height: 32px;">
              <svg style="width: 20px; height: 20px; color: #2196F3;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div class="flex flex-col gap-1 w-full">
              <h3 class="font-medium leading-none" style="color: #1E293B; font-size: 22px;">27</h3>
              <p class="font-medium whitespace-nowrap" style="color: #64748B; font-size: 10px;">Dosen Aktif</p>
            </div>
          </div>
          <!-- Card 3 -->
          <div class="rounded-[20px] p-4 flex flex-col items-start justify-center" style="background-color: #E8F4FE; width: 112px; height: 112px; flex-shrink: 0;">
            <div class="rounded-full bg-white flex items-center justify-center mb-3 shadow-sm shrink-0" style="width: 32px; height: 32px;">
              <svg style="width: 20px; height: 20px; color: #2196F3;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div class="flex flex-col gap-1 w-full">
              <h3 class="font-medium leading-none" style="color: #1E293B; font-size: 22px;">15</h3>
              <p class="font-medium whitespace-nowrap" style="color: #64748B; font-size: 10px;">Jadwal Mengajar</p>
            </div>
          </div>
        </div>

        <!-- Main Content List -->
        <main class="px-6">
          <!-- Search -->
          <div class="relative mb-5 mt-2">
            <input type="text" placeholder="Search ..." class="w-full rounded-full py-3.5 pl-5 pr-14 text-sm font-medium focus:outline-none placeholder-slate-400" style="background-color: #ffffff; border: 1px solid #F1F5F9; color: #0F172A; box-shadow: 0 4px 20px rgba(0,0,0,0.02);" />
            <button class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center active:scale-95 transition-transform text-white shadow-sm" style="background-color: #2196F3; width: 36px; height: 36px;">
              <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          </div>

          <!-- Filters -->
          <div class="flex gap-2.5 mb-6 overflow-x-auto custom-scrollbar pb-1">
            <button 
              @click="activeFilter = 'Semua'" 
              class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap border"
              :class="activeFilter === 'Semua' ? 'shadow-sm' : ''"
              :style="activeFilter === 'Semua' ? 'background-color: #0F3B8C; border-color: #0F3B8C; color: #ffffff;' : 'background-color: #ffffff; border-color: #E2E8F0; color: #64748B;'">
              Semua
            </button>
            <button 
              @click="activeFilter = 'Aktif'" 
              class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap border"
              :class="activeFilter === 'Aktif' ? 'shadow-sm' : ''"
              :style="activeFilter === 'Aktif' ? 'background-color: #0F3B8C; border-color: #0F3B8C; color: #ffffff;' : 'background-color: #ffffff; border-color: #E2E8F0; color: #64748B;'">
              Aktif
            </button>
            <button 
              @click="activeFilter = 'Tidak Aktif'" 
              class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap border"
              :class="activeFilter === 'Tidak Aktif' ? 'shadow-sm' : ''"
              :style="activeFilter === 'Tidak Aktif' ? 'background-color: #0F3B8C; border-color: #0F3B8C; color: #ffffff;' : 'background-color: #ffffff; border-color: #E2E8F0; color: #64748B;'">
              Tidak Aktif
            </button>
          </div>

          <!-- Lecturer List -->
          <div class="flex flex-col gap-4">
            
            <div v-for="dosen in filteredDosen" :key="dosen.id" 
                 class="rounded-[22px] flex flex-col active:scale-[0.98] transition-transform" 
                 style="background-color: #ffffff; border: 1px solid #E8EDF2; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); padding: 18px;">
              
              <!-- Card Header: Avatar, Name, NIP, Status -->
              <div class="flex justify-between items-start mb-3">
                <div class="flex gap-3 items-center">
                  <!-- Avatar -->
                  <div class="rounded-full text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm" style="background-color: #0F3B8C; width: 44px; height: 44px;">
                    {{ dosen.initials }}
                  </div>
                  
                  <!-- Name & NIP -->
                  <div class="flex flex-col justify-center">
                    <h3 class="font-extrabold text-[14px] leading-tight mb-1" style="color: #0F172A;">{{ dosen.name }}</h3>
                    <!-- NIP without hashtag -->
                    <span class="text-[12px] font-medium" style="color: #94A3B8;">{{ dosen.nip }}</span>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <span v-if="dosen.status === 'Aktif'" class="px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0" style="background-color: #DCFCE7; color: #16A34A;">
                  Aktif
                </span>
                <span v-else class="px-3 py-1.5 rounded-full text-[10px] font-bold shrink-0" style="background-color: #FEE2E2; color: #EF4444;">
                  Tidak Aktif
                </span>
              </div>

              <!-- Card Details: Email & Keahlian -->
              <div class="flex flex-col gap-1.5 mb-1" style="padding-left: 56px;">
                <div class="flex items-center gap-2" style="color: #94A3B8;">
                  <svg style="width: 14px; height: 14px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span class="text-[11px] font-medium">{{ dosen.email }}</span>
                </div>
                <div class="flex items-center gap-2" style="color: #94A3B8;">
                  <!-- Changed Keahlian Icon to a generic badge/tag instead of huge sparkle -->
                  <svg style="width: 14px; height: 14px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                  <span class="text-[11px] font-medium">{{ dosen.keahlian }}</span>
                </div>
              </div>

              <!-- Card Actions: Edit & Delete -->
              <div class="flex justify-end gap-2" style="padding-left: 56px;">
                <button @click="showEditModal = true" class="rounded-[10px] flex items-center justify-center active:scale-90 transition-transform" style="background-color: #F0F6FF; color: #2196F3; width: 34px; height: 34px;">
                  <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button @click="showDeleteModal = true" class="rounded-[10px] flex items-center justify-center active:scale-90 transition-transform" style="background-color: #FEF2F2; color: #EF4444; width: 34px; height: 34px;">
                  <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>

            </div>

          </div>
        </main>
      </div>

      <!-- ============================== -->
      <!-- JADWAL DOSEN VIEW -->
      <!-- ============================== -->
      <div v-else-if="activeTab === 'Jadwal Dosen'" class="animate-in fade-in slide-in-from-right-4 duration-300">
        <!-- Header -->
        <div class="px-6 flex justify-between items-start mb-6 mt-2">
          <div class="flex flex-col gap-1.5 w-full">
            <h1 class="text-[26px] font-extrabold tracking-tight leading-none" style="color: #0F172A;">Jadwal Dosen</h1>
            <p class="text-[12px] font-medium leading-snug" style="color: #64748B; max-width: 85%;">Kelola jadwal mengajar mingguan dosen.</p>
          </div>
        </div>

        <!-- Summary Card Container -->
        <div class="px-6 mb-6">
          <div class="rounded-[20px] flex overflow-hidden border shadow-[0_4px_12px_rgba(0,0,0,0.02)]" style="background-color: #ffffff; border-color: #E8EEF5;">
            <!-- Left Side -->
            <div class="flex-1 p-4 flex justify-between items-center relative">
              <div class="flex flex-col gap-1">
                <span class="font-extrabold text-[22px] leading-none" style="color: #0F172A;">15</span>
                <span class="text-[11px] font-medium mt-1" style="color: #64748B;">Total Dosen</span>
              </div>
              <div class="w-10 h-10 rounded-[14px] flex items-center justify-center" style="background-color: #F8FAFC; color: #2196F3;">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <!-- Vertical Divider -->
              <div class="absolute right-0 top-3 bottom-3 w-[1px]" style="background-color: #E8EEF5;"></div>
            </div>
            
            <!-- Right Side -->
            <div class="flex-1 p-4 flex justify-between items-center pl-5">
              <div class="flex flex-col gap-1">
                <span class="font-extrabold text-[22px] leading-none" style="color: #0F172A;">12</span>
                <span class="text-[11px] font-medium mt-1" style="color: #64748B;">Dosen Terjadwal</span>
              </div>
              <div class="w-10 h-10 rounded-[14px] flex items-center justify-center" style="background-color: #F8FAFC; color: #3B82F6;">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Search -->
        <div class="px-6 relative mb-5 mt-2">
          <input type="text" placeholder="Search ..." class="w-full rounded-full py-3.5 pl-5 pr-14 text-sm font-medium focus:outline-none placeholder-slate-400" style="background-color: #ffffff; border: 1px solid #F1F5F9; color: #0F172A; box-shadow: 0 4px 20px rgba(0,0,0,0.02);" />
          <button class="absolute right-8 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center active:scale-95 transition-transform text-white shadow-sm" style="background-color: #2196F3; width: 36px; height: 36px;">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>

        <!-- Filters (Pill Style) -->
        <div class="px-6 flex gap-2.5 mb-6 overflow-x-auto custom-scrollbar pb-1">
          <button 
            @click="activeJadwalFilter = 'Semua'" 
            class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap border"
            :class="activeJadwalFilter === 'Semua' ? 'shadow-sm' : ''"
            :style="activeJadwalFilter === 'Semua' ? 'background-color: #0F3B8C; border-color: #0F3B8C; color: #ffffff;' : 'background-color: #ffffff; border-color: #E2E8F0; color: #64748B;'">
            Semua
          </button>
          <button 
            @click="activeJadwalFilter = 'Ada Jadwal'" 
            class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap border"
            :class="activeJadwalFilter === 'Ada Jadwal' ? 'shadow-sm' : ''"
            :style="activeJadwalFilter === 'Ada Jadwal' ? 'background-color: #0F3B8C; border-color: #0F3B8C; color: #ffffff;' : 'background-color: #ffffff; border-color: #E2E8F0; color: #64748B;'">
            Ada Jadwal
          </button>
          <button 
            @click="activeJadwalFilter = 'Jadwal Kosong'" 
            class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap border"
            :class="activeJadwalFilter === 'Jadwal Kosong' ? 'shadow-sm' : ''"
            :style="activeJadwalFilter === 'Jadwal Kosong' ? 'background-color: #0F3B8C; border-color: #0F3B8C; color: #ffffff;' : 'background-color: #ffffff; border-color: #E2E8F0; color: #64748B;'">
            Jadwal Kosong
          </button>
        </div>

        <!-- Dosen Schedule List -->
        <div class="px-6 flex flex-col gap-4 pb-4">
          <div v-for="dosen in filteredDosen" :key="dosen.id" 
               class="rounded-[22px] p-5 flex flex-col active:scale-[0.98] transition-transform border"
               style="background-color: #ffffff; border-color: #F1F5F9; box-shadow: 0 4px 16px rgba(0,0,0,0.02);">
            
            <!-- Row 1: Avatar, Name, NIP -->
            <div class="flex gap-3 items-center mb-4">
              <div class="rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm" style="background-color: #1976D2; width: 44px; height: 44px;">
                {{ dosen.initials }}
              </div>
              <div class="flex flex-col justify-center">
                <h3 class="font-extrabold text-[13px] leading-tight mb-0.5" style="color: #0F172A;">{{ dosen.name }}</h3>
                <span class="text-[11px] font-medium" style="color: #94A3B8;">NIP. {{ dosen.nip }}</span>
              </div>
            </div>

            <!-- Row 2: Jadwal badge & Lihat Detail -->
            <div class="flex justify-between items-center" style="margin-left: 56px;">
              <div class="px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-[10px]" style="background-color: #E3F2FD; color: #1976D2;">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                3 jadwal
              </div>
              <button @click="selectedDosen = dosen; showDetailModal = true" class="px-4 py-2 rounded-xl text-[10px] font-bold border transition-colors hover:bg-slate-50 flex items-center gap-1 shadow-sm" style="border-color: #1976D2; color: #1976D2;">
                Lihat Detail
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div> <!-- Close .pt-10.pb-4 container -->

    <!-- Navigation -->
    <BottomNav />

    <!-- OVERLAYS & MODALS -->
    
    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 transition-opacity" style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);" @click="showAddModal = false"></div>
      <div class="relative bg-white rounded-t-[32px] w-full p-6 animate-slide-up" style="max-height: 90vh; overflow-y: auto;">
        <!-- Handle -->
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold" style="color: #0F172A;">Tambah Dosen Baru</h2>
          <button @click="showAddModal = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="showAddModal = false" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Nama Lengkap (tanpa gelar) *</label>
            <input type="text" placeholder="cth. Ahmad Fauzi" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-300" />
          </div>
          
          <div class="flex gap-4">
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-[13px] font-semibold text-slate-700">Gelar *</label>
              <input type="text" placeholder="cth. M.T, M.Kom" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-300" />
            </div>
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-[13px] font-semibold text-slate-700">NIP *</label>
              <input type="text" placeholder="18 digit NIP" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-300" />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Email</label>
            <input type="email" placeholder="nama@universitas.ac.id" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-300" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Bidang Keahlian</label>
            <input type="text" placeholder="cth. Kecerdasan Buatan" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-300" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Status</label>
            <div class="relative">
              <button type="button" @click="showAddStatusDropdown = !showAddStatusDropdown" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-slate-700 flex justify-between items-center">
                <span>{{ addStatus }}</span>
                <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="showAddStatusDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <!-- Custom Dropdown Menu -->
              <div v-if="showAddStatusDropdown" class="absolute z-10 w-full bottom-full mb-2 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-1.5 animate-zoom-in origin-bottom">
                <button type="button" @click="addStatus = 'Aktif'; showAddStatusDropdown = false" class="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between" :class="addStatus === 'Aktif' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'">
                  Aktif
                  <svg v-if="addStatus === 'Aktif'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button type="button" @click="addStatus = 'Tidak Aktif'; showAddStatusDropdown = false" class="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between" :class="addStatus === 'Tidak Aktif' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'">
                  Tidak Aktif
                  <svg v-if="addStatus === 'Tidak Aktif'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-4">
            <button type="button" @click="showAddModal = false" class="flex-1 py-3.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" class="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-transform active:scale-95 shadow-sm" style="background-color: #2196F3;">
              Tambah Dosen
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 transition-opacity" style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);" @click="showEditModal = false"></div>
      <div class="relative bg-white rounded-t-[32px] w-full p-6 animate-slide-up" style="max-height: 90vh; overflow-y: auto;">
        <!-- Handle -->
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold" style="color: #0F172A;">Edit Data Dosen</h2>
          <button @click="showEditModal = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form @submit.prevent="showEditModal = false" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Nama Lengkap (tanpa gelar) *</label>
            <input type="text" value="Dr. Sari Dewi" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700" />
          </div>
          
          <div class="flex gap-4">
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-[13px] font-semibold text-slate-700">Gelar *</label>
              <input type="text" value="M.Kom" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700" />
            </div>
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-[13px] font-semibold text-slate-700">NIP *</label>
              <input type="text" value="19750301200501001" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700" />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Email</label>
            <input type="email" value="sari.dewi@univ.ac.id" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Bidang Keahlian</label>
            <input type="text" value="Kecerdasan Buatan" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-700" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-slate-700">Status</label>
            <div class="relative">
              <button type="button" @click="showEditStatusDropdown = !showEditStatusDropdown" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-slate-700 flex justify-between items-center">
                <span>{{ editStatus }}</span>
                <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="showEditStatusDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <!-- Custom Dropdown Menu -->
              <div v-if="showEditStatusDropdown" class="absolute z-10 w-full bottom-full mb-2 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-1.5 animate-zoom-in origin-bottom">
                <button type="button" @click="editStatus = 'Aktif'; showEditStatusDropdown = false" class="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between" :class="editStatus === 'Aktif' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'">
                  Aktif
                  <svg v-if="editStatus === 'Aktif'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button type="button" @click="editStatus = 'Tidak Aktif'; showEditStatusDropdown = false" class="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between" :class="editStatus === 'Tidak Aktif' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'">
                  Tidak Aktif
                  <svg v-if="editStatus === 'Tidak Aktif'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-4">
            <button type="button" @click="showEditModal = false" class="flex-1 py-3.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" class="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-transform active:scale-95 shadow-sm" style="background-color: #2196F3;">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div class="absolute inset-0 transition-opacity" style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-[28px] w-full p-6 animate-zoom-in text-center flex flex-col items-center shadow-xl">
        
        <div class="w-14 h-14 rounded-full flex items-center justify-center mb-4" style="background-color: #FEE2E2; color: #EF4444;">
          <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </div>

        <h3 class="text-xl font-bold mb-2" style="color: #0F172A;">Hapus Dosen?</h3>
        <p class="text-sm font-medium mb-8 leading-relaxed" style="color: #64748B;">Data dosen beserta seluruh jadwal mengajarnya akan dihapus.</p>
        
        <div class="flex gap-3 w-full">
          <button @click="showDeleteModal = false" class="flex-1 py-3.5 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button @click="showDeleteModal = false" class="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-transform active:scale-95 shadow-sm" style="background-color: #D32F2F;">
            Hapus
          </button>
        </div>

      </div>
    </div>

    <!-- Jadwal Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 transition-opacity" style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);" @click="showDetailModal = false"></div>
      <div class="relative bg-white rounded-t-[32px] w-full p-6 animate-slide-up" style="max-height: 90vh; overflow-y: auto;">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-3 mt-2">
          <div class="flex flex-col pr-4">
            <h2 class="text-[17px] leading-snug font-extrabold" style="color: #0F172A;">{{ selectedDosen?.name || 'Dr. Ahmad Fauzi S.Kom., M.Kom' }}</h2>
            <span class="text-xs mt-1.5 font-medium" style="color: #1976D2;">NIP · {{ selectedDosen?.nip || '197503012005011001' }}</span>
          </div>
          <button @click="showDetailModal = false" class="rounded-[10px] w-8 h-8 shrink-0 flex items-center justify-center transition-colors active:scale-95" style="background-color: #F1F5F9; color: #64748B;">
            <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="mb-7 mt-1">
          <span class="px-3.5 py-1.5 rounded-full text-[11px] font-bold" style="background-color: #F0F6FF; color: #1976D2;">3 jadwal mengajar</span>
        </div>

        <div class="w-full h-[1px] mb-5" style="background-color: #F1F5F9;"></div>

        <div class="flex justify-between items-center mb-5">
          <h3 class="text-[13px] font-extrabold" style="color: #0F172A;">Daftar Jadwal Mengajar</h3>
          <button @click="showAddJadwalModal = true" class="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm" style="background-color: #0F3B8C; color: #ffffff;">
            <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>

        <!-- Schedule List -->
        <div class="flex flex-col gap-3 pb-4">
          
          <div v-for="i in 3" :key="i" class="relative group bg-white rounded-[22px] p-5 flex flex-col gap-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)] overflow-hidden transition-all active:scale-[0.98]" style="border: 1px solid #E8EEF5;">
            
            <!-- Accent Left Border -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5" style="background-color: #2196F3;"></div>
            
            <!-- Top Row: Title, Badge, Buttons -->
            <div class="flex justify-between items-start pl-1">
              <div>
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="px-2.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-widest uppercase" style="background-color: #F8FAFC; color: #475569; border: 1px solid #E2E8F0;">Kelas A</span>
                  <div class="flex items-center gap-1.5 text-[10px] font-bold" style="color: #2196F3;">
                    <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                    Senin
                  </div>
                </div>
                <h4 class="font-extrabold text-[15px] leading-tight" style="color: #0F172A;">Pemrograman Web</h4>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-1.5 shrink-0 mt-0.5">
                <button @click="showEditJadwalModal = true" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95" style="background-color: #F8FAFC; color: #94A3B8;">
                  <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button @click="showDeleteJadwalModal = true" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95" style="background-color: #FEF2F2; color: #EF4444;">
                  <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <!-- Bottom Row: Time and Room Box -->
            <div class="pl-1">
              <div class="flex items-center gap-3 py-2.5 px-3.5 rounded-[12px]" style="background-color: #F8FAFC; border: 1px dashed #E2E8F0;">
                <div class="flex items-center gap-1.5" style="color: #475569;">
                  <svg style="width: 14px; height: 14px; color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span class="text-[11px] font-bold">07:30 - 10:00</span>
                </div>
                
                <div class="w-[1px] h-3.5" style="background-color: #CBD5E1;"></div>
                
                <div class="flex items-center gap-1.5" style="color: #475569;">
                  <svg style="width: 14px; height: 14px; color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span class="text-[11px] font-bold">Ruang F104</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>

    <!-- Edit Jadwal Modal -->
    <div v-if="showEditJadwalModal" class="fixed inset-0 z-[60] flex flex-col justify-end">
      <div class="absolute inset-0 transition-opacity" style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);" @click="showEditJadwalModal = false"></div>
      <div class="relative bg-white rounded-t-[32px] w-full p-6 animate-slide-up">
        
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-[17px] font-extrabold" style="color: #0F172A;">Edit Jadwal Mengajar</h2>
          <button @click="showEditJadwalModal = false" class="rounded-[10px] w-8 h-8 flex items-center justify-center transition-colors active:scale-95" style="background-color: #F8FAFC; border: 1px solid #F1F5F9; color: #64748B;">
            <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="flex flex-col gap-4 mb-8">
          <div>
            <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Mata Kuliah *</label>
            <input type="text" value="Pemrograman Web" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
          </div>
          
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Kelas</label>
              <input type="text" value="A" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
            </div>
            
            <div class="flex-1 relative">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Hari *</label>
              <button @click="showEditJadwalHariDropdown = !showEditJadwalHariDropdown" class="w-full px-4 py-3 rounded-[12px] border text-sm font-medium flex justify-between items-center transition-colors focus:outline-none" style="background-color: #ffffff; border-color: #E2E8F0; color: #0F172A;">
                <span>{{ editJadwalHari }}</span>
                <svg class="w-4 h-4 transition-transform duration-200" :class="showEditJadwalHariDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div v-if="showEditJadwalHariDropdown" class="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 animate-zoom-in origin-top max-h-48 overflow-y-auto custom-scrollbar">
                <button @click="editJadwalHari = 'Senin'; showEditJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Senin</button>
                <button @click="editJadwalHari = 'Selasa'; showEditJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Selasa</button>
                <button @click="editJadwalHari = 'Rabu'; showEditJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Rabu</button>
                <button @click="editJadwalHari = 'Kamis'; showEditJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Kamis</button>
                <button @click="editJadwalHari = 'Jumat'; showEditJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Jumat</button>
                <button @click="editJadwalHari = 'Sabtu'; showEditJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Sabtu</button>
                <button @click="editJadwalHari = 'Minggu'; showEditJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Minggu</button>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Jam *</label>
              <input type="text" value="07:30 - 10:00" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
            </div>
            <div class="flex-1">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Ruangan</label>
              <input type="text" value="F104" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="showEditJadwalModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-transform active:scale-95" style="background-color: #F8FAFC; color: #475569;">Batal</button>
          <button @click="showEditJadwalModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-transform active:scale-95 shadow-sm" style="background-color: #2196F3;">Simpan Perubahan</button>
        </div>
        
      </div>
    </div>

    <!-- Tambah Jadwal Modal -->
    <div v-if="showAddJadwalModal" class="fixed inset-0 z-[60] flex flex-col justify-end">
      <div class="absolute inset-0 transition-opacity" style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);" @click="showAddJadwalModal = false"></div>
      <div class="relative bg-white rounded-t-[32px] w-full p-6 animate-slide-up">
        
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-[17px] font-extrabold" style="color: #0F172A;">Tambah Jadwal Mengajar</h2>
          <button @click="showAddJadwalModal = false" class="rounded-[10px] w-8 h-8 flex items-center justify-center transition-colors active:scale-95" style="background-color: #F8FAFC; border: 1px solid #F1F5F9; color: #64748B;">
            <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="flex flex-col gap-4 mb-8">
          <div>
            <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Mata Kuliah *</label>
            <input type="text" placeholder="cth. Pemrograman Web" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors placeholder-slate-400" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
          </div>
          
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Kelas</label>
              <input type="text" value="A" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
            </div>
            
            <div class="flex-1 relative">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Hari *</label>
              <button @click="showAddJadwalHariDropdown = !showAddJadwalHariDropdown" class="w-full px-4 py-3 rounded-[12px] border text-sm font-medium flex justify-between items-center transition-colors focus:outline-none" style="background-color: #ffffff; border-color: #E2E8F0; color: #0F172A;">
                <span>{{ addJadwalHari }}</span>
                <svg class="w-4 h-4 transition-transform duration-200" :class="showAddJadwalHariDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div v-if="showAddJadwalHariDropdown" class="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 animate-zoom-in origin-top max-h-48 overflow-y-auto custom-scrollbar">
                <button @click="addJadwalHari = 'Senin'; showAddJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Senin</button>
                <button @click="addJadwalHari = 'Selasa'; showAddJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Selasa</button>
                <button @click="addJadwalHari = 'Rabu'; showAddJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Rabu</button>
                <button @click="addJadwalHari = 'Kamis'; showAddJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Kamis</button>
                <button @click="addJadwalHari = 'Jumat'; showAddJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Jumat</button>
                <button @click="addJadwalHari = 'Sabtu'; showAddJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Sabtu</button>
                <button @click="addJadwalHari = 'Minggu'; showAddJadwalHariDropdown = false" class="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Minggu</button>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Jam *</label>
              <input type="text" placeholder="07:30 - 10:00" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors placeholder-slate-400" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
            </div>
            <div class="flex-1">
              <label class="block text-[11px] font-bold mb-1.5" style="color: #64748B;">Ruangan</label>
              <input type="text" placeholder="F104" class="w-full px-4 py-3 rounded-[12px] text-sm font-medium border focus:outline-none transition-colors placeholder-slate-400" style="border-color: #E2E8F0; color: #0F172A; background-color: #ffffff;" />
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="showAddJadwalModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-transform active:scale-95" style="background-color: #F8FAFC; color: #475569;">Batal</button>
          <button @click="showAddJadwalModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-transform active:scale-95 shadow-sm" style="background-color: #2196F3;">Tambah Jadwal</button>
        </div>
        
      </div>
    </div>

    <!-- Hapus Jadwal Modal -->
    <div v-if="showDeleteJadwalModal" class="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div class="absolute inset-0 transition-opacity" style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);" @click="showDeleteJadwalModal = false"></div>
      <div class="relative bg-white rounded-[24px] w-full p-7 flex flex-col items-center text-center animate-zoom-in">
        
        <div class="w-14 h-14 rounded-full flex items-center justify-center mb-5" style="background-color: #FEF2F2; color: #EF4444;">
          <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </div>

        <h2 class="text-base font-extrabold mb-1.5" style="color: #0F172A;">Hapus Jadwal?</h2>
        <p class="text-[13px] font-medium mb-7 leading-relaxed px-2" style="color: #64748B;">Jadwal Pemrograman Web – Kelas A akan dihapus permanen.</p>

        <div class="flex w-full gap-3">
          <button @click="showDeleteJadwalModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-sm border transition-transform active:scale-95" style="background-color: #ffffff; border-color: #E2E8F0; color: #0F172A;">Batal</button>
          <button @click="showDeleteJadwalModal = false" class="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-transform active:scale-95 shadow-sm" style="background-color: #DC2626;">Hapus</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import BottomNav from '~/components/BottomNav.vue'

const activeTab = ref('Daftar Dosen')
const activeFilter = ref('Semua')

// Modal States
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showDetailModal = ref(false)
const selectedDosen = ref(null)

const showAddJadwalModal = ref(false)
const showEditJadwalModal = ref(false)
const showDeleteJadwalModal = ref(false)

const addJadwalHari = ref('Senin')
const showAddJadwalHariDropdown = ref(false)
const editJadwalHari = ref('Senin')
const showEditJadwalHariDropdown = ref(false)

// Custom Dropdown States
const addStatus = ref('Aktif')
const showAddStatusDropdown = ref(false)
const editStatus = ref('Aktif')
const showEditStatusDropdown = ref(false)

// Jadwal Dosen States
const activeJadwalFilter = ref('Semua')

// Lock body scroll when any modal is open
watch([showAddModal, showEditModal, showDeleteModal, showDetailModal, showAddJadwalModal, showEditJadwalModal, showDeleteJadwalModal], ([add, edit, del, det, addJ, editJ, delJ]) => {
  if (add || edit || del || det || addJ || editJ || delJ) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Ensure scroll is unlocked when component unmounts
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Dummy Data exactly matching the mockup
const dosenList = ref([
  { 
    id: 1, 
    name: 'Dr. Sari Dewi S.Kom', 
    initials: 'DS', 
    nip: '19750301200501001', 
    email: 'sari.dewi@univ.ac.id', 
    keahlian: 'Kecerdasan Buatan', 
    status: 'Aktif' 
  },
  { 
    id: 2, 
    name: 'Dr. Ahmad Fauzi S.Kom., M.Kom', 
    initials: 'DA', 
    nip: '19750301200501001', 
    email: 'sari.dewi@univ.ac.id', 
    keahlian: 'Jaringan Komputer', 
    status: 'Aktif' 
  },
  { 
    id: 3, 
    name: 'Dr. Ahmad Fauzi S.Kom., M.Kom', 
    initials: 'DA', 
    nip: '19750301200501001', 
    email: 'sari.dewi@univ.ac.id', 
    keahlian: 'Jaringan Komputer', 
    status: 'Aktif' 
  }
])

const filteredDosen = computed(() => {
  if (activeFilter.value === 'Semua') {
    return dosenList.value
  }
  return dosenList.value.filter(d => d.status === activeFilter.value)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes zoomIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-zoom-in {
  animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
