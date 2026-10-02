<template>
  <div class="min-h-screen font-sans pb-24 relative" style="background-color: #ffffff;">
    
    <!-- Header -->
    <div class="px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-5 flex justify-between items-start">
      <div class="flex flex-col gap-1.5 w-full">
        <h1 class="text-[26px] font-extrabold tracking-tight leading-none" style="color: #0F172A;">Data Mahasiswa</h1>
        <p class="text-[12px] font-medium leading-snug" style="color: #64748B; max-width: 85%;">Kelola data mahasiswa dan informasi seminar.</p>
      </div>
      <button @click="showAddModal = true" class="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm" style="background-color: #0F3B8C; color: #ffffff;">
        <svg style="width: 22px; height: 22px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </div>

    <!-- Summary Cards Grid -->
    <div class="grid grid-cols-2 gap-3 px-6 mb-7">
      
      <!-- Card 1 -->
      <div class="rounded-[20px] p-4 flex flex-col items-start justify-center" style="background-color: #F0F6FF; height: 116px; width: 100%;">
        <div class="rounded-full bg-white flex items-center justify-center mb-3 shadow-sm shrink-0" style="width: 32px; height: 32px;">
          <svg style="width: 18px; height: 18px; color: #1976D2;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div class="flex flex-col gap-1 w-full">
          <h3 class="font-medium leading-none" style="color: #1E293B; font-size: 22px;">50</h3>
          <p class="font-medium whitespace-nowrap" style="color: #64748B; font-size: 10px;">Total Mahasiswa</p>
        </div>
      </div>
      
      <!-- Card 2 -->
      <div class="rounded-[20px] p-4 flex flex-col items-start justify-center" style="background-color: #E8F4FE; height: 116px; width: 100%;">
        <div class="rounded-full bg-white flex items-center justify-center mb-3 shadow-sm shrink-0" style="width: 32px; height: 32px;">
          <svg style="width: 18px; height: 18px; color: #1976D2;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div class="flex flex-col gap-1 w-full">
          <h3 class="font-medium leading-none" style="color: #1E293B; font-size: 22px;">25</h3>
          <p class="font-medium whitespace-nowrap" style="color: #64748B; font-size: 10px;">Sem. Proposal</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="rounded-[20px] p-4 flex flex-col items-start justify-center" style="background-color: #E8F4FE; height: 116px; width: 100%;">
        <div class="rounded-full bg-white flex items-center justify-center mb-3 shadow-sm shrink-0" style="width: 32px; height: 32px;">
          <svg style="width: 18px; height: 18px; color: #1976D2;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div class="flex flex-col gap-1 w-full">
          <h3 class="font-medium leading-none" style="color: #1E293B; font-size: 22px;">25</h3>
          <p class="font-medium whitespace-nowrap" style="color: #64748B; font-size: 10px;">Seminar Hasil</p>
        </div>
      </div>
      
      <!-- Card 4 (Red) -->
      <div class="rounded-[20px] p-4 flex flex-col items-start justify-center" style="background-color: #FEF2F2; height: 116px; width: 100%;">
        <div class="rounded-full bg-white flex items-center justify-center mb-3 shadow-sm shrink-0" style="width: 32px; height: 32px;">
          <svg style="width: 18px; height: 18px; color: #DC2626;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div class="flex flex-col gap-1 w-full">
          <h3 class="font-medium leading-none" style="color: #1E293B; font-size: 22px;">3</h3>
          <p class="font-medium whitespace-nowrap" style="color: #64748B; font-size: 10px;">Belum Lengkap</p>
        </div>
      </div>

    </div>

    <!-- Search Bar -->
    <div class="px-6 mb-6">
      <div class="relative">
        <input type="text" placeholder="Search ..." class="w-full rounded-full py-3.5 pl-5 pr-14 text-sm font-medium focus:outline-none placeholder-slate-400" style="background-color: #ffffff; border: 1px solid #F1F5F9; color: #0F172A; box-shadow: 0 4px 20px rgba(0,0,0,0.02);" />
        <button class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center active:scale-95 transition-transform text-white shadow-sm" style="background-color: #2196F3; width: 36px; height: 36px;">
          <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="px-6 flex items-center gap-2.5 mb-8">
      <div class="relative shrink-0">
        <button @click="showJenisDropdown = !showJenisDropdown" class="px-3.5 py-2.5 rounded-[14px] text-[12px] font-extrabold flex items-center gap-1.5 border transition-all active:scale-95" style="background-color: #ffffff; border-color: #E2E8F0; color: #334155; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
          {{ activeJenisFilter }}
          <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="showJenisDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div v-if="showJenisDropdown" class="absolute z-20 w-32 mt-2 bg-white border border-slate-100 rounded-[14px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-1.5 animate-zoom-in origin-top">
          <button @click="activeJenisFilter = 'Jenis'; showJenisDropdown = false" class="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors" style="color: #0F172A;">Jenis</button>
          <button @click="activeJenisFilter = 'Sempro'; showJenisDropdown = false" class="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors" style="color: #0F172A;">Sempro</button>
          <button @click="activeJenisFilter = 'Semhas'; showJenisDropdown = false" class="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors" style="color: #0F172A;">Semhas</button>
        </div>
      </div>

      <div class="relative shrink-0">
        <button @click="showStatusDropdown = !showStatusDropdown" class="px-3.5 py-2.5 rounded-[14px] text-[12px] font-extrabold flex items-center gap-1.5 border transition-all active:scale-95" style="background-color: #ffffff; border-color: #E2E8F0; color: #334155; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
          {{ activeStatusFilter }}
          <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="showStatusDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div v-if="showStatusDropdown" class="absolute z-20 w-36 mt-2 bg-white border border-slate-100 rounded-[14px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-1.5 animate-zoom-in origin-top">
          <button @click="activeStatusFilter = 'Status'; showStatusDropdown = false" class="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors" style="color: #0F172A;">Status</button>
          <button @click="activeStatusFilter = 'Valid'; showStatusDropdown = false" class="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors" style="color: #0F172A;">Valid</button>
          <button @click="activeStatusFilter = 'Belum Lengkap'; showStatusDropdown = false" class="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors" style="color: #0F172A;">Belum Lengkap</button>
        </div>
      </div>
      
      <button @click="showImportModal = true" class="ml-auto shrink-0 px-4 py-2.5 rounded-[14px] text-[12px] font-extrabold flex items-center gap-1.5 transition-transform active:scale-95" style="background-color: #F0F6FF; color: #1976D2;">
        <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
        Import
      </button>
    </div>

    <!-- Mahasiswa List -->
    <div class="px-6 flex flex-col gap-4 pb-6">
      


      <!-- Card 1 -->
      <div class="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4 relative overflow-hidden transition-all active:scale-[0.98]">
        
        <!-- Header / Profile -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3.5">
            <!-- Initials Avatar -->
            <div class="w-12 h-12 rounded-[16px] flex items-center justify-center text-sm font-extrabold shadow-sm shrink-0" style="background: linear-gradient(135deg, #1976D2 0%, #0F3B8C 100%); color: #ffffff;">
              AP
            </div>
            <div class="flex flex-col">
              <h3 class="font-extrabold text-[15px] leading-tight" style="color: #0F172A;">Andi Pratama</h3>
              <span class="text-[12px] font-semibold mt-0.5" style="color: #64748B;">11231099</span>
            </div>
          </div>
          
          <!-- Action Menu -->
          <div class="flex gap-1.5 shrink-0">
             <button @click="showEditModal = true" class="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95" style="background-color: #F8FAFC; color: #64748B;">
                <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
             </button>
             <button @click="showDeleteModal = true" class="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95" style="background-color: #FEF2F2; color: #EF4444;">
                <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>
        </div>

        <!-- Badges Row -->
        <div class="flex gap-2 items-center">
          <span class="px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border" style="background-color: #F0F6FF; color: #1976D2; border-color: #D3E3FD;">Sempro</span>
          <span class="px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border" style="background-color: #ECFDF5; color: #10B981; border-color: #D1FAE5;">Valid</span>
        </div>

        <!-- Inner Info Box -->
        <div class="rounded-[16px] p-4 flex flex-col gap-3.5" style="background-color: #F8FAFC; border: 1px dashed #E2E8F0;">
          
          <!-- Pembimbing Group -->
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest mb-2 block" style="color: #94A3B8;">Pembimbing</span>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #3B82F6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Dr. Sari Dewi</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #3B82F6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Dr. Ahmad Fauzi</span>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div class="w-full h-[1px]" style="background-color: #E2E8F0;"></div>

          <!-- Penguji Group -->
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest mb-2 block" style="color: #94A3B8;">Penguji</span>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #8B5CF6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Prof. Budi Santoso</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #8B5CF6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Dr. Dewi Lestari</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4 relative overflow-hidden transition-all active:scale-[0.98]">
        
        <!-- Header / Profile -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3.5">
            <!-- Initials Avatar -->
            <div class="w-12 h-12 rounded-[16px] flex items-center justify-center text-sm font-extrabold shadow-sm shrink-0" style="background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%); color: #ffffff;">
              RM
            </div>
            <div class="flex flex-col">
              <h3 class="font-extrabold text-[15px] leading-tight" style="color: #0F172A;">Rina Melati</h3>
              <span class="text-[12px] font-semibold mt-0.5" style="color: #64748B;">11231102</span>
            </div>
          </div>
          
          <!-- Action Menu -->
          <div class="flex gap-1.5 shrink-0">
             <button @click="showEditModal = true" class="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95" style="background-color: #F8FAFC; color: #64748B;">
                <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
             </button>
             <button @click="showDeleteModal = true" class="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95" style="background-color: #FEF2F2; color: #EF4444;">
                <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>
        </div>

        <!-- Badges Row -->
        <div class="flex gap-2 items-center">
          <span class="px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border" style="background-color: #FFF7ED; color: #EA580C; border-color: #FFEDD5;">Semhas</span>
          <span class="px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border" style="background-color: #FEF2F2; color: #EF4444; border-color: #FEE2E2;">Revisi</span>
        </div>

        <!-- Inner Info Box -->
        <div class="rounded-[16px] p-4 flex flex-col gap-3.5" style="background-color: #F8FAFC; border: 1px dashed #E2E8F0;">
          
          <!-- Pembimbing Group -->
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest mb-2 block" style="color: #94A3B8;">Pembimbing</span>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #3B82F6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Dr. Iwan Setiawan</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #3B82F6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Dr. Ratna Sari</span>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div class="w-full h-[1px]" style="background-color: #E2E8F0;"></div>

          <!-- Penguji Group -->
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest mb-2 block" style="color: #94A3B8;">Penguji</span>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #8B5CF6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Prof. Anton Wibowo</span>
              </div>
              <div class="flex items-center gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: #8B5CF6;"></div>
                <span class="text-[12px] font-bold" style="color: #334155;">Dr. Fitri Ani</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>


    <!-- Modals -->

    <!-- Modal Tambah / Edit Mahasiswa -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity" @click.self="showAddModal = false; showEditModal = false">
      <div class="bg-white w-full rounded-t-[24px] p-6 pb-8 animate-zoom-in shadow-2xl relative" style="max-height: 90vh; overflow-y: auto;">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-[18px] font-extrabold text-slate-800 mb-1">{{ showEditModal ? 'Edit Mahasiswa' : 'Tambah Mahasiswa' }}</h2>
            <p class="text-[12px] font-medium text-slate-500">Lengkapi informasi data mahasiswa</p>
          </div>
          <button @click="showAddModal = false; showEditModal = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-95 transition-transform">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-[12px] font-bold text-slate-600 mb-2">Nama Lengkap *</label>
            <input type="text" placeholder="Masukkan nama lengkap" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          <div>
            <label class="block text-[12px] font-bold text-slate-600 mb-2">NIM *</label>
            <input type="text" placeholder="Contoh: 2021001001" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="relative">
              <label class="block text-[12px] font-bold text-slate-600 mb-2">Jenis Seminar *</label>
              <div @click="showModalJenisDropdown = !showModalJenisDropdown; showModalStatusDropdown = false; showModalPem1Dropdown = false; showModalPem2Dropdown = false" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 bg-white flex justify-between items-center cursor-pointer transition-all hover:border-blue-500" :class="{'ring-2 ring-blue-100 border-blue-500': showModalJenisDropdown}">
                <span>{{ modalForm.jenis }}</span>
                <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': showModalJenisDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <div v-if="showModalJenisDropdown" class="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-zoom-in top-full">
                <div @click="modalForm.jenis = 'Proposal'; showModalJenisDropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.jenis === 'Proposal'}">Proposal</div>
                <div @click="modalForm.jenis = 'Hasil'; showModalJenisDropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.jenis === 'Hasil'}">Hasil</div>
              </div>
            </div>
            <div class="relative">
              <label class="block text-[12px] font-bold text-slate-600 mb-2">Status</label>
              <div @click="showModalStatusDropdown = !showModalStatusDropdown; showModalJenisDropdown = false; showModalPem1Dropdown = false; showModalPem2Dropdown = false" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 bg-white flex justify-between items-center cursor-pointer transition-all hover:border-blue-500" :class="{'ring-2 ring-blue-100 border-blue-500': showModalStatusDropdown}">
                <span>{{ modalForm.status }}</span>
                <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': showModalStatusDropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <div v-if="showModalStatusDropdown" class="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-zoom-in top-full">
                <div @click="modalForm.status = 'Aktif'; showModalStatusDropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.status === 'Aktif'}">Aktif</div>
                <div @click="modalForm.status = 'Non-aktif'; showModalStatusDropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.status === 'Non-aktif'}">Non-aktif</div>
              </div>
            </div>
          </div>
          <div class="relative">
            <label class="block text-[12px] font-bold text-slate-600 mb-2">Pembimbing 1 *</label>
            <div @click="showModalPem1Dropdown = !showModalPem1Dropdown; showModalJenisDropdown = false; showModalStatusDropdown = false; showModalPem2Dropdown = false" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] bg-white flex justify-between items-center cursor-pointer transition-all hover:border-blue-500" :class="[modalForm.pem1 === '-- Pilih Pembimbing 1 --' ? 'text-slate-400' : 'text-slate-800', {'ring-2 ring-blue-100 border-blue-500': showModalPem1Dropdown}]">
              <span>{{ modalForm.pem1 }}</span>
              <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': showModalPem1Dropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <div v-if="showModalPem1Dropdown" class="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-zoom-in max-h-[150px] overflow-y-auto top-full">
              <div @click="modalForm.pem1 = 'Dr. Sari Dewi'; showModalPem1Dropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors text-slate-800" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.pem1 === 'Dr. Sari Dewi'}">Dr. Sari Dewi</div>
              <div @click="modalForm.pem1 = 'Prof. Budi Santoso'; showModalPem1Dropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors text-slate-800" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.pem1 === 'Prof. Budi Santoso'}">Prof. Budi Santoso</div>
            </div>
          </div>
          <div class="relative">
            <label class="block text-[12px] font-bold text-slate-600 mb-2">Pembimbing 2 *</label>
            <div @click="showModalPem2Dropdown = !showModalPem2Dropdown; showModalJenisDropdown = false; showModalStatusDropdown = false; showModalPem1Dropdown = false" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] bg-white flex justify-between items-center cursor-pointer transition-all hover:border-blue-500" :class="[modalForm.pem2 === '-- Pilih Pembimbing 2 --' ? 'text-slate-400' : 'text-slate-800', {'ring-2 ring-blue-100 border-blue-500': showModalPem2Dropdown}]">
              <span>{{ modalForm.pem2 }}</span>
              <svg class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': showModalPem2Dropdown}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <div v-if="showModalPem2Dropdown" class="absolute z-10 w-full mb-2 bg-white rounded-xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1),0_-8px_10px_-6px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-zoom-in max-h-[150px] overflow-y-auto bottom-full">
              <div @click="modalForm.pem2 = 'Dr. Ahmad Fauzi'; showModalPem2Dropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors text-slate-800" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.pem2 === 'Dr. Ahmad Fauzi'}">Dr. Ahmad Fauzi</div>
              <div @click="modalForm.pem2 = 'Dr. Dewi Lestari'; showModalPem2Dropdown = false" class="px-4 py-3 text-[13px] hover:bg-blue-50 cursor-pointer transition-colors text-slate-800" :class="{'bg-[#E3F2FD] font-bold text-[#1976D2]': modalForm.pem2 === 'Dr. Dewi Lestari'}">Dr. Dewi Lestari</div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button @click="showAddModal = false; showEditModal = false" class="w-1/3 py-3.5 rounded-xl text-[13px] font-extrabold text-slate-600 bg-slate-100 active:scale-95 transition-transform">
            Batal
          </button>
          <button @click="showAddModal = false; showEditModal = false" class="flex-1 py-3.5 rounded-xl text-[13px] font-extrabold text-white bg-[#2196F3] shadow-[0_4px_12px_rgba(33,150,243,0.3)] active:scale-95 transition-transform">
            {{ showEditModal ? 'Simpan Perubahan' : 'Tambah Mahasiswa' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Hapus -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 transition-opacity" @click.self="showDeleteModal = false">
      <div class="bg-white w-full rounded-[24px] p-6 pb-7 animate-zoom-in shadow-2xl flex flex-col items-center text-center relative">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-5 mt-2" style="background-color: #FEF2F2; color: #DC2626;">
          <svg style="width: 28px; height: 28px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </div>
        <h2 class="text-[18px] font-extrabold text-slate-800 mb-2">Hapus Mahasiswa?</h2>
        <p class="text-[13px] font-medium text-slate-500 mb-7 leading-relaxed">
          Data <strong class="text-slate-700">Andi Pratama</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
        </p>
        <div class="flex w-full gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-3.5 rounded-xl text-[13px] font-extrabold text-slate-600 bg-slate-50 active:scale-95 transition-transform border border-slate-200">
            Batal
          </button>
          <button @click="showDeleteModal = false" class="flex-1 py-3.5 rounded-xl text-[13px] font-extrabold text-white bg-[#D32F2F] shadow-[0_4px_12px_rgba(211,47,47,0.25)] active:scale-95 transition-transform">
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Import -->
    <div v-if="showImportModal" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity" @click.self="showImportModal = false">
      <div class="bg-white w-full rounded-t-[24px] p-6 pb-8 animate-zoom-in shadow-2xl relative" style="max-height: 95vh; overflow-y: auto;">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
        <div class="flex justify-between items-start mb-6">
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background-color: #E3F2FD; color: #1976D2;">
              <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <div>
              <h2 class="text-[16px] font-extrabold text-slate-800 mb-0.5">Import Data Mahasiswa</h2>
              <p class="text-[11px] font-medium text-slate-500">Upload file Excel atau CSV</p>
            </div>
          </div>
          <button @click="showImportModal = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-95 transition-transform">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Stepper -->
        <div class="flex items-center justify-between mb-8 px-2 relative z-0">
          <div class="absolute left-6 right-6 h-[2px] bg-slate-100 top-1/2 -translate-y-1/2 -z-10"></div>
          <div class="flex items-center gap-2 bg-white px-2">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" :class="importStep >= 1 ? 'bg-[#1976D2] text-white' : 'bg-slate-100 text-slate-400'">1</div>
            <span class="text-[11px] font-bold" :class="importStep >= 1 ? 'text-[#1976D2]' : 'text-slate-400'">Upload</span>
          </div>
          <div class="flex items-center gap-2 bg-white px-2">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" :class="importStep >= 2 ? 'bg-[#1976D2] text-white' : 'bg-slate-100 text-slate-400'">2</div>
            <span class="text-[11px] font-bold" :class="importStep >= 2 ? 'text-[#1976D2]' : 'text-slate-400'">Preview</span>
          </div>
          <div class="flex items-center gap-2 bg-white px-2">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-400">3</div>
            <span class="text-[11px] font-bold text-slate-400">Selesai</span>
          </div>
        </div>
        
        <!-- Step 1: Upload -->
        <div v-if="importStep === 1" class="flex flex-col gap-4">
          <!-- Dropzone -->
          <div @click="importStep = 2" class="border-2 border-dashed border-[#90CAF9] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors" style="background-color: #F8FBFF;">
            <svg style="width: 32px; height: 32px; color: #64B5F6; margin-bottom: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p class="text-[13px] font-bold text-slate-700 mb-1">Drag & drop file di sini</p>
            <p class="text-[12px] text-[#1976D2] mb-4">atau <span class="underline">klik untuk browse</span></p>
            <div class="flex gap-2">
              <span class="px-2.5 py-1 rounded-md bg-[#E3F2FD] text-[#1565C0] text-[10px] font-bold">.xlsx</span>
              <span class="px-2.5 py-1 rounded-md bg-[#E3F2FD] text-[#1565C0] text-[10px] font-bold">.csv</span>
              <span class="px-2.5 py-1 rounded-md bg-[#E3F2FD] text-[#1565C0] text-[10px] font-bold">.xls</span>
            </div>
          </div>
          
          <!-- Template Download -->
          <div class="border border-slate-200 rounded-2xl p-4 flex items-center gap-4 mt-2">
            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
              <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </div>
            <div class="flex-1">
              <h4 class="text-[13px] font-extrabold text-slate-800 mb-0.5">Download Template</h4>
              <p class="text-[10px] text-slate-500 leading-tight">Format kolom: Nama, NIM, Jenis, Pembimbing 1, Pembimbing 2, Status</p>
            </div>
            <button class="text-[#1976D2] text-[12px] font-extrabold shrink-0">Download</button>
          </div>
        </div>

        <!-- Step 2: Preview -->
        <div v-if="importStep === 2" class="flex flex-col gap-4">
          <!-- Success Banner -->
          <div class="rounded-xl p-3 flex items-start gap-3" style="background-color: #F0FDF4; border: 1px solid #BBF7D0;">
            <svg style="width: 16px; height: 16px; color: #16A34A; margin-top: 2px; shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            <p class="text-[11.5px] text-slate-700 font-medium leading-relaxed">
              File <strong class="font-bold text-[#16A34A]">Kelompok MK Tata Kelola Teknologi Informasi - Gasal 2026_2027.xlsx</strong> berhasil dibaca — 3 baris data ditemukan
            </p>
          </div>

          <!-- Preview Table Container -->
          <div class="rounded-xl border border-slate-200 overflow-hidden mt-1">
            <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="py-2.5 px-3 text-[10px] font-bold text-slate-500">Nama</th>
                  <th class="py-2.5 px-3 text-[10px] font-bold text-slate-500">NIM</th>
                  <th class="py-2.5 px-3 text-[10px] font-bold text-slate-500">Jenis</th>
                  <th class="py-2.5 px-3 text-[10px] font-bold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr>
                  <td class="py-3 px-3">
                    <p class="text-[12px] font-bold text-slate-800">Irfan Hakim</p>
                  </td>
                  <td class="py-3 px-3 text-[11px] text-slate-500 font-mono">2022081001</td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-[6px] text-[9px] font-bold" style="background-color: #DCFCE7; color: #16A34A;">Skripsi</span>
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-[6px] text-[9px] font-bold" style="background-color: #DCFCE7; color: #16A34A;">Aktif</span>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 px-3">
                    <p class="text-[12px] font-bold text-slate-800">Jasmina Putri</p>
                  </td>
                  <td class="py-3 px-3 text-[11px] text-slate-500 font-mono">2022081002</td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-[6px] text-[9px] font-bold" style="background-color: #DCFCE7; color: #16A34A;">Skripsi</span>
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-[6px] text-[9px] font-bold" style="background-color: #DCFCE7; color: #16A34A;">Aktif</span>
                  </td>
                </tr>
                <tr>
                  <td class="py-3 px-3">
                    <p class="text-[12px] font-bold text-slate-800">Kelvin Santoso</p>
                  </td>
                  <td class="py-3 px-3 text-[11px] text-slate-500 font-mono">2021081045</td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-[6px] text-[9px] font-bold" style="background-color: #F3E8FF; color: #9333EA;">Tesis</span>
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-[6px] text-[9px] font-bold" style="background-color: #DCFCE7; color: #16A34A;">Aktif</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between mt-4">
            <button @click="importStep = 1" class="text-[12px] font-bold text-slate-500 flex items-center gap-1 active:scale-95 transition-transform">
              <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Ganti File
            </button>
            <div class="flex gap-2">
              <button @click="showImportModal = false; importStep = 1" class="px-4 py-2.5 rounded-xl text-[12px] font-extrabold text-slate-600 bg-slate-100 active:scale-95 transition-transform">
                Batal
              </button>
              <button @click="showImportModal = false; importStep = 1" class="px-4 py-2.5 rounded-xl text-[12px] font-extrabold text-white bg-[#2196F3] flex items-center gap-1.5 shadow-[0_4px_12px_rgba(33,150,243,0.3)] active:scale-95 transition-transform">
                <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                Import 3 Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import BottomNav from '~/components/BottomNav.vue'

const showJenisDropdown = ref(false)
const activeJenisFilter = ref('Jenis')

const showStatusDropdown = ref(false)
const activeStatusFilter = ref('Status')

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showImportModal = ref(false)
const importStep = ref(1) // 1: Upload, 2: Preview

// Custom Dropdowns in Modal
const showModalJenisDropdown = ref(false)
const showModalStatusDropdown = ref(false)
const showModalPem1Dropdown = ref(false)
const showModalPem2Dropdown = ref(false)

const modalForm = ref({
  jenis: 'Proposal',
  status: 'Aktif',
  pem1: '-- Pilih Pembimbing 1 --',
  pem2: '-- Pilih Pembimbing 2 --'
})

// Scroll Lock logic
watch([showAddModal, showEditModal, showDeleteModal, showImportModal], (newValues) => {
  if (typeof document !== 'undefined') {
    if (newValues.some(v => v)) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Reset dropdowns when modal closes
      showModalJenisDropdown.value = false
      showModalStatusDropdown.value = false
      showModalPem1Dropdown.value = false
      showModalPem2Dropdown.value = false
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
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
