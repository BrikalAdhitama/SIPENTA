<template>
  <div class="min-h-screen font-sans pb-24 relative" style="background-color: #ffffff;">
    
    <!-- Header -->
    <div class="px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-5 flex justify-between items-start gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-[20px] font-extrabold tracking-tight leading-none text-ink">Data Mahasiswa</h1>
        <p class="text-[11px] font-medium leading-snug text-muted mt-1">Kelola data mahasiswa dan informasi seminar tugas akhir.</p>
      </div>
      <button @click="showAddModal = true" class="shrink-0 min-h-[44px] px-4 rounded-xl flex items-center gap-1.5 text-[13px] font-bold bg-primary-900 text-white active:scale-95 transition-transform">
        <svg style="width: 15px; height: 15px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
        Tambah
      </button>
    </div>

    <!-- Summary Cards Grid -->
    <div class="grid grid-cols-2 gap-3 px-4 mb-5">
      <div class="rounded-2xl p-3 flex items-center gap-2.5 bg-primary-100">
        <div class="rounded-full bg-surface flex items-center justify-center shrink-0 w-10 h-10">
          <svg class="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div class="flex flex-col">
          <h3 class="font-extrabold leading-none text-primary-900 text-[20px]">{{ mahasiswaList.length }}</h3>
          <p class="font-medium text-muted mt-1 text-[11px] leading-tight">Total Mahasiswa</p>
        </div>
      </div>
      <div class="rounded-2xl p-3 flex items-center gap-2.5 bg-primary-100">
        <div class="rounded-full bg-surface flex items-center justify-center shrink-0 w-10 h-10">
          <svg class="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div class="flex flex-col">
          <h3 class="font-extrabold leading-none text-primary-900 text-[20px]">{{ jumlahSempro }}</h3>
          <p class="font-medium text-muted mt-1 text-[11px] leading-tight">Seminar Proposal</p>
        </div>
      </div>
      <div class="rounded-2xl p-3 flex items-center gap-2.5 bg-primary-100">
        <div class="rounded-full bg-surface flex items-center justify-center shrink-0 w-10 h-10">
          <svg class="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div class="flex flex-col">
          <h3 class="font-extrabold leading-none text-primary-900 text-[20px]">{{ jumlahSemhas }}</h3>
          <p class="font-medium text-muted mt-1 text-[11px] leading-tight">Seminar Hasil</p>
        </div>
      </div>
      <div class="rounded-2xl p-3 flex items-center gap-2.5 bg-primary-100">
        <div class="rounded-full bg-surface flex items-center justify-center shrink-0 w-10 h-10">
          <svg class="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div class="flex flex-col">
          <h3 class="font-extrabold leading-none text-danger text-[20px]">{{ jumlahBelumLengkap }}</h3>
          <p class="font-medium text-muted mt-1 text-[11px] leading-tight">Belum Lengkap</p>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-4 mb-3">
      <div class="relative">
        <input v-model="cariMhs" type="text" placeholder="Search ..." aria-label="Cari mahasiswa" class="w-full rounded-full py-3.5 pl-5 pr-14 text-[14px] font-medium focus:outline-none bg-surface border border-border text-ink placeholder:text-muted focus:border-primary-900 shadow-card" />
        <button aria-label="Cari" class="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center active:scale-95 transition-transform text-white bg-primary-500 w-10 h-10 min-w-[44px] min-h-[44px]">
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="px-4 flex items-center gap-2 mb-5">
      <div class="relative shrink-0">
        <button @click="showJenisDropdown = !showJenisDropdown" class="min-h-[44px] px-5 py-2 rounded-full text-[13px] font-bold flex items-center gap-1.5 bg-surface border border-border text-ink shadow-card active:scale-95 transition-all">
          {{ activeJenisFilter }}
          <svg class="w-4 h-4 transition-transform duration-200" :class="showJenisDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div v-if="showJenisDropdown" class="absolute z-20 w-32 mt-2 bg-surface border border-border rounded-xl shadow-card py-1.5 animate-zoom-in origin-top">
          <button @click="activeJenisFilter = 'Jenis'; showJenisDropdown = false" class="w-full text-left px-4 py-2.5 min-h-[44px] text-xs font-bold hover:bg-slate-50 transition-colors text-ink">Jenis</button>
          <button @click="activeJenisFilter = 'Sempro'; showJenisDropdown = false" class="w-full text-left px-4 py-2.5 min-h-[44px] text-xs font-bold hover:bg-slate-50 transition-colors text-ink">Sempro</button>
          <button @click="activeJenisFilter = 'Semhas'; showJenisDropdown = false" class="w-full text-left px-4 py-2.5 min-h-[44px] text-xs font-bold hover:bg-slate-50 transition-colors text-ink">Semhas</button>
        </div>
      </div>

      <div class="relative shrink-0">
        <button @click="showStatusDropdown = !showStatusDropdown" class="min-h-[44px] px-5 py-2 rounded-full text-[13px] font-bold flex items-center gap-1.5 bg-surface border border-border text-ink shadow-card active:scale-95 transition-all">
          {{ activeStatusFilter }}
          <svg class="w-4 h-4 transition-transform duration-200" :class="showStatusDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div v-if="showStatusDropdown" class="absolute z-20 w-36 mt-2 bg-surface border border-border rounded-xl shadow-card py-1.5 animate-zoom-in origin-top">
          <button @click="activeStatusFilter = 'Status'; showStatusDropdown = false" class="w-full text-left px-4 py-2.5 min-h-[44px] text-xs font-bold hover:bg-slate-50 transition-colors text-ink">Status</button>
          <button @click="activeStatusFilter = 'Valid'; showStatusDropdown = false" class="w-full text-left px-4 py-2.5 min-h-[44px] text-xs font-bold hover:bg-slate-50 transition-colors text-ink">Valid</button>
          <button @click="activeStatusFilter = 'Belum Lengkap'; showStatusDropdown = false" class="w-full text-left px-4 py-2.5 min-h-[44px] text-xs font-bold hover:bg-slate-50 transition-colors text-ink">Belum Lengkap</button>
        </div>
      </div>

      <button @click="showImportModal = true" class="ml-auto shrink-0 min-h-[44px] px-4 rounded-full text-[12px] font-bold flex items-center border border-primary-900 text-primary-900 bg-surface active:scale-95 transition-transform">
        Import Data
      </button>
    </div>

    <!-- Mahasiswa List — satu template untuk contoh & DB -->
    <div class="px-4 flex flex-col gap-3 pb-6">
        <div v-for="m in filteredMahasiswa" :key="m.id" class="bg-surface rounded-xl p-4 border border-border shadow-card flex flex-col gap-3 active:scale-[0.98] transition-all">
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-col min-w-0">
              <h3 class="font-bold text-[14px] leading-tight text-ink truncate">{{ m.nama }}</h3>
              <span class="text-[11px] font-medium mt-1 text-muted">{{ m.nim }}</span>
            </div>
            <div class="flex gap-1.5 shrink-0">
              <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold"
                :class="m.jenis === 'Semhas' ? 'bg-orange-50 text-orange-500' : 'bg-semhas-soft text-semhas'">{{ m.jenis }}</span>
              <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold"
                :class="m.status === 'Valid' ? 'bg-emerald-50 text-success' : 'bg-orange-50 text-orange-500'">{{ m.status }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-3">
              <span class="text-[11px] font-medium text-muted">Pembimbing 1</span>
              <span class="text-[11px] font-semibold text-ink text-right truncate max-w-[60%]">{{ m.pem1 }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-[11px] font-medium text-muted">Pembimbing 2</span>
              <span class="text-[11px] font-semibold text-ink text-right truncate max-w-[60%]">{{ m.pem2 }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-[11px] font-medium text-muted">Penguji 1</span>
              <span class="text-[11px] font-semibold text-ink text-right truncate max-w-[60%]">{{ m.peng1 }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-[11px] font-medium text-muted">Penguji 2</span>
              <span class="text-[11px] font-semibold text-ink text-right truncate max-w-[60%]">{{ m.peng2 }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="showEditModal = true" class="flex-1 min-h-[44px] rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 bg-primary-100 text-primary-900 active:scale-95 transition-transform">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Edit
            </button>
            <button @click="showDeleteModal = true" class="flex-1 min-h-[44px] rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 bg-red-50 text-red-500 active:scale-95 transition-transform">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Hapus
            </button>
          </div>
        </div>

        <div v-if="!filteredMahasiswa.length" class="text-center py-10 text-muted text-[13px] font-medium">
          Belum ada mahasiswa{{ cariMhs ? ` untuk “${cariMhs}”` : '' }}.
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BottomNav from '~/components/BottomNav.vue'

const cariMhs = ref('')
const showJenisDropdown = ref(false)
const activeJenisFilter = ref('Jenis')

const showStatusDropdown = ref(false)
const activeStatusFilter = ref('Status')

// Contoh fallback — diganti /api/mahasiswa bila tersedia.
const CONTOH_MHS = [
  { id: 'mhs-001', nama: 'Andi Pratama', nim: '11231099', initials: 'AP', jenis: 'Sempro', status: 'Valid', pem1: 'Dr. Sari Dewi', pem2: 'Dr. Ahmad Fauzi', peng1: 'Prof. Budi Santoso', peng2: 'Dr. Dewi Lestari', grad: 'linear-gradient(135deg, #1976D2 0%, #0F3B8C 100%)' },
  { id: 'mhs-002', nama: 'Rina Melati', nim: '11231102', initials: 'RM', jenis: 'Semhas', status: 'Revisi', pem1: 'Dr. Iwan Setiawan', pem2: 'Dr. Ratna Sari', peng1: 'Prof. Anton Wibowo', peng2: 'Dr. Fitri Ani', grad: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)' },
]
const mahasiswaList = ref(CONTOH_MHS.map((m) => ({ ...m })))
const mahasiswaAsli = ref(false)

function inisialMhs(nama) {
  return String(nama ?? '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '-'
}

async function muatMahasiswa() {
  try {
    const res = await $fetch('/api/seminar')
    const rows = res?.data ?? []
    if (!rows.length) return // ponytail: tetap contoh bila kosong
    mahasiswaList.value = rows.map((r) => {
      const jenisDb = String(r.gelombang?.jenis ?? r.jenis ?? '')
      return {
        id: r.id, nama: r.mahasiswa?.nama ?? '-', nim: r.mahasiswa?.nim ?? '-',
        initials: inisialMhs(r.mahasiswa?.nama),
        jenis: jenisDb.includes('hasil') ? 'Semhas' : 'Sempro',
        status: r.validasi === 'valid' ? 'Valid' : (r.validasi === 'duplikat' ? 'Duplikat' : 'Revisi'),
        pem1: r.pembimbing_utama_nama ?? '-', pem2: r.pembimbing_pendamping_nama ?? '-',
        peng1: r.penguji1_nama ?? '-', peng2: r.penguji2_nama ?? '-',
        grad: 'linear-gradient(135deg, #1976D2 0%, #0F3B8C 100%)',
      }
    })
    mahasiswaAsli.value = true
  } catch {
    // ponytail: offline / belum login → tetap contoh
  }
}

onMounted(() => {
  muatMahasiswa()
})

const filteredMahasiswa = computed(() => {
  const q = cariMhs.value.trim().toLowerCase()
  let rows = mahasiswaList.value
  if (activeJenisFilter.value !== 'Jenis') rows = rows.filter((m) => m.jenis === activeJenisFilter.value)
  if (activeStatusFilter.value !== 'Status') rows = rows.filter((m) => m.status === activeStatusFilter.value)
  if (q) rows = rows.filter((m) => `${m.nama} ${m.nim}`.toLowerCase().includes(q))
  return rows
})

// Ringkasan ikut data asli bila ada; contoh fallback tetap tampil bila DB kosong.
const jumlahSempro = computed(() => mahasiswaList.value.filter((m) => m.jenis === 'Sempro').length)
const jumlahSemhas = computed(() => mahasiswaList.value.filter((m) => m.jenis === 'Semhas').length)
const jumlahBelumLengkap = computed(() => mahasiswaList.value.filter((m) => m.status !== 'Valid').length)

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
