<template>
  <div class="min-h-screen font-sans pb-24 relative" style="background-color: #ffffff;">
    
    <!-- Global Toast Notification -->
    <div class="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform -translate-y-full opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform -translate-y-full opacity-0">
        <div v-if="toastMessage" class="bg-red-500 text-white px-5 py-3.5 rounded-[18px] shadow-lg flex items-center gap-3 w-full max-w-sm pointer-events-auto border border-red-600">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-[13px] font-bold leading-tight">{{ toastMessage }}</span>
        </div>
      </transition>
    </div>

    <!-- Header -->
    <header class="mobile-safe-top px-6 pb-4 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shadow-sm flex items-center gap-3">
      <button @click="handleBack" class="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 active:bg-slate-200 shrink-0 inline-flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <div class="flex flex-col">
        <h1 class="text-xl font-extrabold text-primary-900 tracking-tight leading-none mb-1">Buat Penjadwalan</h1>
        <p class="text-slate-500 text-xs font-medium">Langkah {{ currentStep }} dari 4: {{ currentStep === 1 ? 'Upload SPS' : currentStep === 2 ? 'Preview & Validasi' : currentStep === 3 ? 'Konfigurasi' : 'Generate' }}</p>
      </div>
    </header>

    <main class="p-6 max-w-lg mx-auto">
      
      <!-- Stepper -->
      <div class="flex justify-between items-start mb-10 relative px-2">
        <!-- Connecting Lines -->
        <div class="absolute top-[18px] left-0 w-full px-8 flex">
          <div class="h-0.5 flex-1 mx-1 transition-colors" :class="currentStep > 1 ? 'bg-primary-900' : 'bg-slate-200'"></div>
          <div class="h-0.5 flex-1 mx-1 transition-colors" :class="currentStep > 2 ? 'bg-primary-900' : 'bg-slate-200'"></div>
          <div class="h-0.5 flex-1 mx-1 transition-colors" :class="currentStep > 3 ? 'bg-primary-900' : 'bg-slate-200'"></div>
        </div>

        <!-- Step 1 -->
        <div class="relative flex flex-col items-center gap-2 z-10 w-16">
          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-white transition-colors"
               :class="currentStep > 1 ? 'bg-white border-2 border-primary-900 text-primary-900' : 'bg-primary-900 text-white'">
            <svg v-if="currentStep > 1" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            <span v-else>01</span>
          </div>
          <span class="text-[10px] font-bold text-center leading-tight transition-colors" :class="currentStep >= 1 ? 'text-slate-800' : 'text-slate-400'">Upload SPS</span>
        </div>

        <!-- Step 2 -->
        <div class="relative flex flex-col items-center gap-2 z-10 w-16">
          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white transition-colors"
               :class="currentStep > 2 ? 'bg-white border-2 border-primary-900 text-primary-900' : currentStep === 2 ? 'bg-primary-900 text-white shadow-sm' : 'bg-white border-2 border-slate-200 text-slate-400'">
            <svg v-if="currentStep > 2" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            <span v-else>02</span>
          </div>
          <span class="text-[10px] text-center leading-tight transition-colors" :class="currentStep >= 2 ? 'text-slate-800 font-bold' : 'text-slate-400 font-semibold'">Preview & Validasi</span>
        </div>

        <!-- Step 3 -->
        <div class="relative flex flex-col items-center gap-2 z-10 w-16">
          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white transition-colors"
               :class="currentStep > 3 ? 'bg-white border-2 border-primary-900 text-primary-900' : currentStep === 3 ? 'bg-primary-900 text-white shadow-sm' : 'bg-white border-2 border-slate-200 text-slate-400'">
            <svg v-if="currentStep > 3" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            <span v-else>03</span>
          </div>
          <span class="text-[10px] text-center leading-tight transition-colors" :class="currentStep >= 3 ? 'text-primary-900 font-bold' : 'text-slate-400 font-semibold'">Konfigurasi</span>
        </div>

        <!-- Step 4 -->
        <div class="relative flex flex-col items-center gap-2 z-10 w-16">
          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white transition-colors"
               :class="currentStep === 4 ? 'bg-primary-900 text-white shadow-sm' : 'bg-white border-2 border-slate-200 text-slate-400'">
            04
          </div>
          <span class="text-[10px] text-center leading-tight transition-colors" :class="currentStep === 4 ? 'text-primary-900 font-bold' : 'text-slate-400 font-semibold'">Generate</span>
        </div>
      </div>

      <!-- STEP 1: UPLOAD SPS -->
      <div v-show="currentStep === 1" class="animate-in fade-in slide-in-from-left-4 duration-300">
        <!-- Section 1: Pilih Jenis Seminar -->
        <section class="mb-6 p-5 rounded-[24px] border border-slate-100 shadow-sm bg-white">
          <!-- Section Header -->
          <div class="flex gap-3 items-start mb-5">
            <div class="w-8 h-8 rounded-full bg-primary-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              1
            </div>
            <div class="pt-1">
              <h2 class="text-lg font-bold text-slate-800 leading-none mb-1">Pilih Jenis Seminar</h2>
              <p class="text-slate-500 text-xs font-medium leading-relaxed">Pilih jenis seminar lalu unggah file SPS untuk memulai</p>
            </div>
          </div>

          <!-- Options -->
          <div class="flex flex-col gap-3">
            <!-- Sempro -->
            <label 
              class="flex items-center justify-between p-4 rounded-[20px] border-2 cursor-pointer transition-all active:scale-[0.98]"
              :class="selectedSeminar === 'sempro' ? 'border-primary-500 bg-primary-50/50' : 'border-slate-100 hover:border-slate-200'"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 text-[15px] leading-tight mb-0.5">Sempro<br>(Seminar Proposal)</span>
                  <span class="text-xs text-slate-400 font-medium">Durasi 60 menit per sesi</span>
                </div>
              </div>
              <!-- Radio Circle -->
              <div 
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0"
                :class="selectedSeminar === 'sempro' ? 'border-primary-500 bg-primary-500' : 'border-slate-300'"
              >
                <svg v-if="selectedSeminar === 'sempro'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <input type="radio" value="sempro" v-model="selectedSeminar" class="hidden" />
            </label>

            <!-- Semhas -->
            <label 
              class="flex items-center justify-between p-4 rounded-[20px] border-2 cursor-pointer transition-all active:scale-[0.98]"
              :class="selectedSeminar === 'semhas' ? 'border-primary-500 bg-primary-50/50' : 'border-slate-100 hover:border-slate-200'"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 text-[15px] leading-tight mb-0.5">Semhas<br>(Seminar Hasil)</span>
                  <span class="text-xs text-slate-400 font-medium">Durasi 120 menit per sesi</span>
                </div>
              </div>
              <!-- Radio Circle -->
              <div 
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0"
                :class="selectedSeminar === 'semhas' ? 'border-primary-500 bg-primary-500' : 'border-slate-300'"
              >
                <svg v-if="selectedSeminar === 'semhas'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <input type="radio" value="semhas" v-model="selectedSeminar" class="hidden" />
            </label>
          </div>
        </section>

        <!-- Section 2: Upload File SPS -->
        <section class="mb-6 p-5 rounded-[24px] border border-slate-100 shadow-sm transition-colors" :class="selectedSeminar ? 'bg-white' : 'bg-slate-50/50'">
          <!-- Section Header -->
          <div class="flex gap-3 items-start mb-5" :class="!selectedSeminar && 'opacity-50'">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors" :class="selectedSeminar ? 'bg-primary-900 text-white shadow-sm' : 'bg-slate-200 text-slate-400'">
              2
            </div>
            <div class="pt-1">
              <h2 class="text-lg font-bold leading-none mb-1 transition-colors" :class="selectedSeminar ? 'text-slate-800' : 'text-slate-400'">
                Upload File SPS<span v-if="uploadedFile"> — {{ selectedSeminar === 'sempro' ? 'Sempro' : 'Semhas' }}</span>
              </h2>
              <p class="text-xs font-medium leading-relaxed transition-colors" :class="selectedSeminar ? 'text-slate-500' : 'text-slate-400'">
                {{ uploadedFile ? 'Unggah file Excel SPS mahasiswa' : (selectedSeminar ? 'Unggah data peserta seminar' : 'Selesaikan langkah 1 terlebih dahulu') }}
              </p>
            </div>
          </div>

          <div class="transition-all duration-300" :class="!selectedSeminar ? 'opacity-40 pointer-events-none' : 'opacity-100'">
            <!-- Download Template Banner -->
            <div @click="downloadTemplate" class="mb-4 p-4 rounded-[20px] bg-white border border-primary-100 flex items-center gap-4 cursor-pointer group hover:shadow-[0_4px_20px_rgba(33,150,243,0.08)] hover:border-primary-200 transition-all duration-300 active:scale-[0.98]">
              <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 group-hover:scale-105 transition-all duration-300">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-extrabold text-slate-800 text-[13px] mb-0.5 group-hover:text-primary-600 transition-colors">Unduh Template Excel</h3>
                <p class="text-slate-500 text-[11px] font-medium leading-tight">Gunakan format ini sebelum mengunggah data.</p>
              </div>
              <div class="text-primary-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>

            <!-- Dropzone -->
            <!-- ponytail: .csv manual tanpa dep; .xlsx ditolak dengan pesan jelas -->
            <input ref="fileInput" type="file" accept=".csv,text/csv" class="hidden" @change="tanganFileDipilih" />
            <div
              @click="!uploadedFile ? $refs.fileInput.click() : null"
              class="border-2 border-dashed rounded-[20px] p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-5"
              :class="uploadedFile ? 'border-primary-500 bg-primary-50/50' : 'border-slate-200 bg-slate-50 hover:bg-primary-50/30 hover:border-primary-200'"
            >
              <!-- Normal State -->
              <template v-if="!uploadedFile">
                <div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-primary-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <p class="text-slate-700 font-bold text-sm mb-1 group-hover:text-primary-900 transition-colors">Klik untuk memilih file CSV</p>
                <p class="text-slate-400 text-xs font-medium mb-4">format: nim,nama,judul,urutan</p>
                <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold tracking-wide">
                  .csv — maks. 10 MB
                </span>
              </template>
              <!-- Uploaded State -->
              <template v-else>
                <div class="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4 shadow-sm">
                  <!-- Using a solid document icon -->
                  <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                </div>
                <p class="text-primary-900 font-extrabold text-[13px] mb-1.5 px-4 leading-relaxed">{{ uploadedFile.name }}</p>
                <p class="text-primary-600 text-[11px] font-medium mb-4">{{ uploadedFile.rows }} baris data terdeteksi · {{ uploadedFile.size }}</p>
                <button @click.stop="uploadedFile = null" class="text-slate-400 text-xs font-bold hover:text-red-500 transition-colors">
                  Hapus & Ganti file
                </button>
              </template>
            </div>
          </div>

        </section>

        <!-- Action Buttons Step 1 -->
        <button 
          @click="goToStep(2)"
          class="w-full mb-8 py-3.5 px-6 rounded-[14px] font-bold text-[13px] transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          :class="uploadedFile ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-[0_8px_20px_rgba(33,150,243,0.3)]' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-sm'"
          :disabled="!uploadedFile"
        >
          Lanjutkan
          <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div> <!-- End of Step 1 -->

      <!-- STEP 2: PREVIEW & VALIDASI -->
      <div v-show="currentStep === 2" class="animate-in fade-in slide-in-from-right-4 duration-300">
        
        <!-- Header -->
        <div class="mb-6 flex items-start justify-between gap-3">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800 tracking-tight mb-1">Preview & Validasi Data</h2>
            <p class="text-slate-500 text-[13px] font-medium leading-relaxed">
              Data {{ selectedSeminar === 'sempro' ? 'Sempro' : 'Semhas' }} — periksa dan tetapkan penguji sebelum melanjutkan
            </p>
          </div>
          <button @click="segarkanStep2" class="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-600 text-[11px] font-bold hover:border-slate-300 active:scale-95">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0114 0M5 15a7 7 0 0014 0"></path></svg>
            Refresh
          </button>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <!-- Total -->
          <div class="bg-gradient-to-br from-primary-50 to-white rounded-[20px] p-4 border border-primary-100 shadow-sm relative overflow-hidden group active:scale-[0.96] transition-all cursor-pointer">
            <div class="absolute -right-6 -top-6 w-20 h-20 bg-primary-100/60 rounded-full group-active:scale-[2] transition-transform duration-500"></div>
            <div class="flex justify-between items-start mb-2 relative z-10">
              <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <span class="text-2xl font-black text-primary-900 leading-none">{{ totalTampil }}</span>
            </div>
            <span class="text-[11px] font-bold text-primary-600/80 tracking-wide relative z-10">TOTAL DATA</span>
          </div>

          <!-- Valid -->
          <div class="bg-gradient-to-br from-green-50 to-white rounded-[20px] p-4 border border-green-100 shadow-sm relative overflow-hidden group active:scale-[0.96] transition-all cursor-pointer">
            <div class="absolute -right-6 -top-6 w-20 h-20 bg-green-100/60 rounded-full group-active:scale-[2] transition-transform duration-500"></div>
            <div class="flex justify-between items-start mb-2 relative z-10">
              <div class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span class="text-2xl font-black text-green-700 leading-none">{{ validTampil }}</span>
            </div>
            <span class="text-[11px] font-bold text-green-600/80 tracking-wide relative z-10">DATA VALID</span>
          </div>

          <!-- Invalid -->
          <div class="bg-gradient-to-br from-red-50 to-white rounded-[20px] p-4 border border-red-100 shadow-sm relative overflow-hidden group active:scale-[0.96] transition-all cursor-pointer">
            <div class="absolute -right-6 -top-6 w-20 h-20 bg-red-100/60 rounded-full group-active:scale-[2] transition-transform duration-500"></div>
            <div class="flex justify-between items-start mb-2 relative z-10">
              <div class="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <span class="text-2xl font-black text-red-700 leading-none">{{ invalidTampil }}</span>
            </div>
            <span class="text-[11px] font-bold text-red-600/80 tracking-wide relative z-10">DATA INVALID</span>
          </div>

          <!-- Duplikat -->
          <div class="bg-gradient-to-br from-slate-50 to-white rounded-[20px] p-4 border border-slate-100 shadow-sm relative overflow-hidden group active:scale-[0.96] transition-all cursor-pointer">
            <div class="absolute -right-6 -top-6 w-20 h-20 bg-slate-100/80 rounded-full group-active:scale-[2] transition-transform duration-500"></div>
            <div class="flex justify-between items-start mb-2 relative z-10">
              <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
              </div>
              <span class="text-2xl font-black text-slate-700 leading-none">{{ duplikatTampil }}</span>
            </div>
            <span class="text-[11px] font-bold text-slate-500/80 tracking-wide relative z-10">DUPLIKAT</span>
          </div>
        </div>

        <!-- Alert Warnings -->
        <div v-if="invalidTampil > 0 || duplikatTampil > 0 || (!seminarAsli && tanpaAkunPratinjau > 0)" class="bg-amber-50 border border-amber-300 rounded-[20px] p-4 mb-4 flex gap-3 shadow-sm">
          <svg class="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div>
            <h4 class="text-amber-800 font-bold text-sm mb-1">Ditemukan {{ invalidTampil }} data bermasalah dan {{ duplikatTampil }} duplikat<span v-if="!seminarAsli && tanpaAkunPratinjau > 0"> · {{ tanpaAkunPratinjau }} belum punya akun</span></h4>
            <p class="text-amber-700 text-xs font-medium leading-relaxed">Samakan NIM + nama dengan data SIPENTA sebelum lanjut. Beda-nama wajib dikoreksi di CSV.</p>
          </div>
        </div>
        <div v-if="!seminarAsli && galatPratinjau" class="bg-slate-50 border border-slate-200 rounded-[20px] p-4 mb-4 flex gap-3 shadow-sm">
          <svg class="w-6 h-6 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-slate-600 text-xs font-medium leading-relaxed">{{ galatPratinjau }}</p>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-[20px] p-4 mb-6 flex gap-3 shadow-sm">
          <svg class="w-6 h-6 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-blue-800 text-xs font-medium leading-relaxed">
            Pilih <strong class="font-bold">Penguji 1 dan Penguji 2</strong> secara manual untuk setiap mahasiswa. Penguji tidak boleh sama dengan pembimbing.
          </p>
        </div>

        <!-- Data Cards: sebelum simpan = isi CSV vs DB; sesudah simpan = kartu seminar -->
        <div v-if="memuatPratinjau" class="flex flex-col gap-4" aria-busy="true">
          <div v-for="i in 3" :key="i" class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm animate-pulse">
            <div class="h-4 w-2/3 bg-slate-100 rounded mb-2"></div>
            <div class="h-3 w-1/3 bg-slate-100 rounded mb-4"></div>
            <div class="h-3 w-full bg-slate-100 rounded mb-1"></div>
            <div class="h-3 w-5/6 bg-slate-100 rounded"></div>
          </div>
        </div>
        <div v-else-if="!seminarAsli" class="flex flex-col gap-4">
          <div v-for="row in pratinjauList" :key="row.nim" class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-extrabold text-slate-800 text-base leading-none mb-1.5">{{ row.namaCsv }}</h3>
                <p class="text-slate-500 text-xs font-medium">{{ row.nim }} · {{ selectedSeminar === 'sempro' ? 'Sempro' : 'Semhas' }}</p>
              </div>
              <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold"
                    :class="row.status === 'cocok' ? 'bg-green-100 text-green-700' : row.status === 'baru' ? 'bg-blue-100 text-blue-700' : row.status === 'beda-nama' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'">
                {{ row.status === 'cocok' ? 'Valid' : row.status === 'baru' ? 'Baru' : row.status === 'beda-nama' ? 'Beda nama' : 'Belum dicek' }}
              </span>
            </div>
            <div class="space-y-1 mb-2">
              <p v-if="!row.punyaAkun" class="text-xs font-medium text-amber-600">Belum punya akun</p>
              <p v-if="row.duplikat" class="text-xs font-bold text-slate-500">NIM ganda di CSV</p>
            </div>
            <!-- Pembimbing: hanya diisi mahasiswa, admin baca saja -->
            <div class="mb-2 space-y-1">
              <p class="text-slate-600 text-xs font-medium">Pembimbing 1 : {{ row.pembimbing1 && row.pembimbing1 !== '-' ? row.pembimbing1 : '-' }}</p>
              <p class="text-slate-600 text-xs font-medium">Pembimbing 2 : {{ row.pembimbing2 && row.pembimbing2 !== '-' ? row.pembimbing2 : '-' }}</p>
              <p v-if="!pembimbingLengkap(row)" class="text-amber-600 text-[11px] font-medium">Menunggu input mahasiswa.</p>
            </div>
            <p v-if="row.judul" class="text-slate-500 text-[11px] font-medium leading-relaxed break-words mb-3">{{ row.judul }}</p>
            <!-- Penguji wajib admin -->
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 mb-1.5">Penguji 1</label>
                <div class="relative">
                  <div @click="toggleDropdown('pg1-' + row.nim)"
                       class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 min-h-[44px] cursor-pointer transition-all"
                       :class="activeDropdown === 'pg1-' + row.nim ? 'border-primary-500 ring-1 ring-primary-500 bg-white' : 'border-slate-200 bg-white hover:border-slate-300'">
                    <span class="text-xs font-medium truncate pr-2 text-slate-700">{{ row.penguji1 || 'Pilih Penguji...' }}</span>
                    <svg class="w-4 h-4 text-slate-400 shrink-0" :class="{'rotate-180': activeDropdown === 'pg1-' + row.nim}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  <div v-if="activeDropdown === 'pg1-' + row.nim" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-1.5 max-h-48 overflow-y-auto">
                    <div v-for="dosen in listDosen" :key="dosen" @click="row.penguji1 = dosen; activeDropdown = null"
                         class="px-3 py-2.5 text-xs font-medium cursor-pointer mx-1.5 rounded-xl"
                         :class="row.penguji1 === dosen ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'">
                      <span class="truncate">{{ dosen }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 mb-1.5">Penguji 2</label>
                <div class="relative">
                  <div @click="toggleDropdown('pg2-' + row.nim)"
                       class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 min-h-[44px] cursor-pointer transition-all"
                       :class="activeDropdown === 'pg2-' + row.nim ? 'border-primary-500 ring-1 ring-primary-500 bg-white' : 'border-slate-200 bg-white hover:border-slate-300'">
                    <span class="text-xs font-medium truncate pr-2 text-slate-700">{{ row.penguji2 || 'Pilih Penguji...' }}</span>
                    <svg class="w-4 h-4 text-slate-400 shrink-0" :class="{'rotate-180': activeDropdown === 'pg2-' + row.nim}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  <div v-if="activeDropdown === 'pg2-' + row.nim" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-1.5 max-h-48 overflow-y-auto">
                    <div v-for="dosen in listDosen" :key="dosen" @click="row.penguji2 = dosen; activeDropdown = null"
                         class="px-3 py-2.5 text-xs font-medium cursor-pointer mx-1.5 rounded-xl"
                         :class="row.penguji2 === dosen ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'">
                      <span class="truncate">{{ dosen }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Toggle daring -->
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1.5">Daring</label>
              <div @click="row.isDaring = !row.isDaring"
                   class="inline-flex items-center w-14 h-7 rounded-full p-1 cursor-pointer transition-colors relative"
                   :class="row.isDaring ? 'bg-primary-500' : 'bg-primary-900'">
                <div class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
                     :class="row.isDaring ? 'translate-x-7' : 'translate-x-0'"></div>
                <span class="absolute text-[10px] font-bold text-white" :class="row.isDaring ? 'left-2' : 'right-2'">{{ row.isDaring ? 'ON' : 'OFF' }}</span>
              </div>
            </div>
          </div>
          <p v-if="!pratinjauList.length" class="text-center text-slate-400 text-xs font-medium py-6">Belum ada pratinjau — unggah CSV lalu masuk Step 2.</p>
        </div>
        <div v-if="seminarAsli" class="flex flex-col gap-4">
          <!-- Student Card -->
          <div v-for="student in students" :key="student.id" class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-extrabold text-slate-800 text-base leading-none mb-1.5">{{ student.name }}</h3>
                <p class="text-slate-500 text-xs font-medium">{{ student.nim }} · {{ selectedSeminar === 'sempro' ? 'Sempro' : 'Semhas' }}</p>
              </div>
              <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold"
                    :class="student.status === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ student.status }}
              </span>
            </div>

            <!-- Detail Pembimbing: hanya diisi mahasiswa, admin baca saja -->
            <div class="mb-2 space-y-1">
              <p class="text-slate-600 text-xs font-medium">Pembimbing 1 : {{ student.pembimbing1 && student.pembimbing1 !== '-' ? student.pembimbing1 : '-' }}</p>
              <p class="text-slate-600 text-xs font-medium">Pembimbing 2 : {{ student.pembimbing2 && student.pembimbing2 !== '-' ? student.pembimbing2 : '-' }}</p>
              <p v-if="!pembimbingLengkap(student)" class="text-amber-600 text-[11px] font-medium">Menunggu input mahasiswa.</p>
              <p v-else-if="!empatDosenBeda(student)" class="text-red-600 text-[11px] font-medium">Keempat dosen harus orang berbeda.</p>
            </div>
            <p v-if="student.judul" class="text-slate-500 text-[11px] font-medium leading-relaxed break-words mb-4">{{ student.judul }}</p>

            <!-- Dropdowns Penguji -->
            <div class="grid grid-cols-2 gap-3 mb-5">
              <!-- Penguji 1 -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 mb-1.5">Penguji 1</label>
                <div class="relative">
                  <div @click="toggleDropdown('p1-' + student.id)"
                       class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 min-h-[44px] cursor-pointer transition-all"
                       :class="activeDropdown === 'p1-' + student.id ? 'border-primary-500 ring-1 ring-primary-500 bg-white' : 'border-slate-200 bg-white hover:border-slate-300'">
                    <span class="text-xs font-medium truncate pr-2 text-slate-700">
                      {{ student.penguji1 || 'Pilih Penguji...' }}
                    </span>
                    <svg class="w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0" :class="{'rotate-180': activeDropdown === 'p1-' + student.id}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  
                  <div v-if="activeDropdown === 'p1-' + student.id" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top">
                    <div v-for="dosen in listDosen" :key="dosen"
                         @click="selectPenguji(student, 'penguji1', dosen)"
                         class="px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between mx-1.5 rounded-xl"
                         :class="student.penguji1 === dosen ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'">
                      <span class="truncate">{{ dosen }}</span>
                      <svg v-if="student.penguji1 === dosen" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Penguji 2 -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 mb-1.5">Penguji 2</label>
                <div class="relative">
                  <div @click="toggleDropdown('p2-' + student.id)"
                       class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 min-h-[44px] cursor-pointer transition-all"
                       :class="activeDropdown === 'p2-' + student.id ? 'border-primary-500 ring-1 ring-primary-500 bg-white' : 'border-slate-200 bg-white hover:border-slate-300'">
                    <span class="text-xs font-medium truncate pr-2 text-slate-700">
                      {{ student.penguji2 || 'Pilih Penguji...' }}
                    </span>
                    <svg class="w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0" :class="{'rotate-180': activeDropdown === 'p2-' + student.id}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  
                  <div v-if="activeDropdown === 'p2-' + student.id" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top">
                    <div v-for="dosen in listDosen" :key="dosen"
                         @click="selectPenguji(student, 'penguji2', dosen)"
                         class="px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between mx-1.5 rounded-xl"
                         :class="student.penguji2 === dosen ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'">
                      <span class="truncate">{{ dosen }}</span>
                      <svg v-if="student.penguji2 === dosen" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toggle Daring -->
            <div>
              <label class="block text-[10px] font-bold text-slate-400 mb-1.5">Daring</label>
              <!-- Interactive Toggle Switch -->
              <div @click="toggleDaring(student)" 
                   class="inline-flex items-center w-14 h-7 rounded-full p-1 cursor-pointer transition-colors relative"
                   :class="student.isDaring ? 'bg-primary-500' : 'bg-primary-900'">
                <div class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
                     :class="student.isDaring ? 'translate-x-7' : 'translate-x-0'"></div>
                <span class="absolute text-[10px] font-bold text-white transition-all duration-300"
                      :class="student.isDaring ? 'left-2' : 'right-2'">
                  {{ student.isDaring ? 'ON' : 'OFF' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons Step 2 -->
        <div class="grid grid-cols-2 gap-3 mt-4 mb-8">
          <button @click="goToStep(1)" class="w-full justify-center bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 font-bold text-[13px] py-3.5 rounded-[14px] transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm">
            <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali
          </button>
          
          <button @click="goToStep(3)" :disabled="!bolehLanjutStep2"
                  :class="bolehLanjutStep2
                    ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-[0_8px_20px_rgba(33,150,243,0.3)]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'"
                  class="w-full justify-center font-bold text-[13px] py-3.5 rounded-[14px] transition-all active:scale-[0.98] flex items-center gap-2">
            Lanjutkan
            <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

      </div> <!-- End of Step 2 -->

      <!-- STEP 3: KONFIGURASI -->
      <div v-show="currentStep === 3" class="animate-in fade-in slide-in-from-right-4 duration-300">
        
        <!-- Header -->
        <div class="mb-6 flex justify-between items-start gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800 tracking-tight mb-1">Pengaturan Penjadwalan</h2>
            <p class="text-slate-500 text-[13px] font-medium leading-relaxed">
              Konfigurasi parameter untuk proses generate jadwal
            </p>
          </div>
          <div class="bg-blue-50 text-center px-3 py-1.5 rounded-[12px] border border-blue-100 shrink-0 shadow-sm">
            <span class="block text-primary-900 font-bold text-xs">{{ selectedSeminar === 'sempro' ? 'Sempro' : 'Semhas' }}</span>
            <span class="block text-primary-600 font-semibold text-[10px]">{{ selectedSeminar === 'sempro' ? '60 menit/sesi' : '120 menit/sesi' }}</span>
          </div>
        </div>

        <!-- 1. Nama Jadwal -->
        <div class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm mb-4">
          <h3 class="font-extrabold text-slate-800 text-sm mb-3">Nama Jadwal</h3>
          <input type="text" placeholder="cth. Jadwal Sempro Ganjil 2025/2026" 
                 class="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-800 placeholder-slate-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all mb-2" 
                 v-model="config.namaJadwal">
          <p class="text-slate-400 text-[10px] font-medium">Nama ini akan muncul di daftar jadwal setelah generate selesai.</p>
        </div>

        <!-- Overlay for closing calendar -->
        <div v-if="activeCalendar" @click="activeCalendar = null" class="fixed inset-0 z-40"></div>

        <!-- 2. Periode Penjadwalan -->
        <div class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm mb-4 relative z-50">
          <h3 class="font-extrabold text-slate-800 text-sm mb-3">Periode Penjadwalan</h3>
          <div class="grid grid-cols-2 gap-3">
            
            <!-- Tanggal Mulai -->
            <div>
              <label class="block text-slate-500 text-[11px] font-bold mb-1.5">Tanggal Mulai</label>
              <div class="relative">
                <div @click="activeCalendar = activeCalendar === 'mulai' ? null : 'mulai'" class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 cursor-pointer transition-all bg-white" :class="activeCalendar === 'mulai' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'">
                  <span class="text-[13px] font-medium" :class="config.tanggalMulai ? 'text-slate-800' : 'text-slate-400'">
                    {{ config.tanggalMulai ? formatDate(config.tanggalMulai) : 'Pilih...' }}
                  </span>
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                
                <!-- Calendar Popup -->
                <div v-if="activeCalendar === 'mulai'" class="absolute z-50 left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                  <div class="flex items-center justify-between mb-4">
                    <button @click.stop="prevMonth" class="w-8 h-8 flex items-center justify-center rounded-[10px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <span class="font-bold text-slate-800 text-sm">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
                    <button @click.stop="nextMonth" class="w-8 h-8 flex items-center justify-center rounded-[10px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                  <div class="grid grid-cols-7 mb-2">
                    <span v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day" class="text-center text-[11px] font-bold text-slate-800">
                      {{ day }}
                    </span>
                  </div>
                  <div class="grid grid-cols-7 gap-y-1">
                    <button v-for="(day, idx) in calendarDays" :key="idx" @click.stop="selectDate('mulai', day.fullDate)"
                            class="relative h-9 w-full flex items-center justify-center rounded-[10px] text-[13px] font-semibold transition-all active:scale-95 mx-auto max-w-[36px]"
                            :class="[
                              formatYMD(day.fullDate) === config.tanggalMulai 
                                ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20' 
                                : day.isCurrentMonth 
                                  ? 'text-slate-600 hover:bg-slate-100' 
                                  : 'text-slate-300'
                            ]">
                      {{ day.date }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tanggal Selesai -->
            <div>
              <label class="block text-slate-500 text-[11px] font-bold mb-1.5">Tanggal Selesai</label>
              <div class="relative">
                <div @click="activeCalendar = activeCalendar === 'selesai' ? null : 'selesai'" class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 cursor-pointer transition-all bg-white" :class="activeCalendar === 'selesai' ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'">
                  <span class="text-[13px] font-medium" :class="config.tanggalSelesai ? 'text-slate-800' : 'text-slate-400'">
                    {{ config.tanggalSelesai ? formatDate(config.tanggalSelesai) : 'Pilih...' }}
                  </span>
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                
                <!-- Calendar Popup -->
                <div v-if="activeCalendar === 'selesai'" class="absolute z-50 right-0 sm:left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-right sm:origin-top-left">
                  <div class="flex items-center justify-between mb-4">
                    <button @click.stop="prevMonth" class="w-8 h-8 flex items-center justify-center rounded-[10px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <span class="font-bold text-slate-800 text-sm">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
                    <button @click.stop="nextMonth" class="w-8 h-8 flex items-center justify-center rounded-[10px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors active:scale-95">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                  <div class="grid grid-cols-7 mb-2">
                    <span v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day" class="text-center text-[11px] font-bold text-slate-800">
                      {{ day }}
                    </span>
                  </div>
                  <div class="grid grid-cols-7 gap-y-1">
                    <button v-for="(day, idx) in calendarDays" :key="idx" @click.stop="selectDate('selesai', day.fullDate)"
                            class="relative h-9 w-full flex items-center justify-center rounded-[10px] text-[13px] font-semibold transition-all active:scale-95 mx-auto max-w-[36px]"
                            :class="[
                              formatYMD(day.fullDate) === config.tanggalSelesai 
                                ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20' 
                                : day.isCurrentMonth 
                                  ? 'text-slate-600 hover:bg-slate-100' 
                                  : 'text-slate-300'
                            ]">
                      {{ day.date }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Hari Pelaksanaan -->
        <div class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm mb-4">
          <h3 class="font-extrabold text-slate-800 text-sm mb-3">Hari Pelaksanaan</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="hari in ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']" :key="hari" 
                    @click="toggleHari(hari)"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 border"
                    :class="config.hari.includes(hari) ? 'bg-primary-900 border-primary-900 text-white shadow-md shadow-primary-900/20' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'">
              {{ hari }}
            </button>
          </div>
        </div>

        <!-- 4. Waktu Pelaksanaan -->
        <div class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm mb-4 relative z-40">
          <h3 class="font-extrabold text-slate-800 text-sm mb-3">Waktu Pelaksanaan</h3>
          <div class="grid grid-cols-2 gap-3">
            
            <!-- Jam Mulai -->
            <div>
              <label class="block text-slate-500 text-[11px] font-bold mb-1.5">Jam Mulai</label>
              <div class="relative">
                <!-- Input field -->
                <div class="relative flex items-center">
                  <input type="text" v-model="config.jamMulai" placeholder="08:00 AM"
                         @click="openTimePicker('jamMulai')"
                         @keydown.enter="activeCalendar = null"
                         class="w-full border rounded-xl pl-4 pr-10 py-3 bg-white text-[13px] font-bold text-slate-800 transition-all outline-none shadow-sm cursor-text"
                         :class="activeCalendar === 'jamMulai' ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-slate-200 hover:border-slate-300'" />
                  <button @click.stop="activeCalendar === 'jamMulai' ? activeCalendar = null : openTimePicker('jamMulai')" class="absolute right-2 p-1.5 text-slate-400 hover:text-primary-500 transition-colors rounded-lg hover:bg-slate-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </button>
                </div>
                
                <!-- Time Dropdown -->
                <div v-if="activeCalendar === 'jamMulai'" class="absolute z-50 left-0 top-[calc(100%+8px)] w-[280px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.1)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                  <div class="flex justify-between items-center mb-4 px-1">
                    <span class="font-extrabold text-slate-800 text-[15px]">Pilih Waktu</span>
                    <button @click.stop="confirmTime('jamMulai')" class="text-white font-bold text-[11px] bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95">Selesai</button>
                  </div>
                  
                  <div class="flex gap-2 h-[180px] bg-slate-50 rounded-2xl p-2.5 border border-slate-100/50">
                    <!-- Jam -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar rounded-xl px-1 relative" style="scroll-snap-type: y mandatory;">
                      <div v-for="h in 12" :key="'h'+h" @click.stop="timePickerState.hour = h.toString().padStart(2, '0')"
                           class="h-10 flex items-center justify-center text-[14px] font-extrabold rounded-xl transition-all cursor-pointer mb-1" style="scroll-snap-align: center;"
                           :class="timePickerState.hour === h.toString().padStart(2, '0') ? 'bg-white shadow-sm border border-slate-200 text-primary-600 scale-[1.05]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'">
                        {{ h.toString().padStart(2, '0') }}
                      </div>
                    </div>
                    
                    <div class="flex items-center text-slate-300 font-black pb-2">:</div>
                    
                    <!-- Menit -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar rounded-xl px-1 relative" style="scroll-snap-type: y mandatory;">
                      <div v-for="m in 60" :key="'m'+m" @click.stop="timePickerState.minute = (m-1).toString().padStart(2, '0')"
                           class="h-10 flex items-center justify-center text-[14px] font-extrabold rounded-xl transition-all cursor-pointer mb-1" style="scroll-snap-align: center;"
                           :class="timePickerState.minute === (m-1).toString().padStart(2, '0') ? 'bg-white shadow-sm border border-slate-200 text-primary-600 scale-[1.05]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'">
                        {{ (m-1).toString().padStart(2, '0') }}
                      </div>
                    </div>
                    
                    <div class="w-px bg-slate-200/60 mx-1 my-2"></div>
                    
                    <!-- AM/PM -->
                    <div class="flex-1 flex flex-col gap-2 justify-center px-1">
                      <div @click.stop="timePickerState.ampm = 'AM'" class="flex-1 flex items-center justify-center text-[13px] font-extrabold rounded-xl transition-all cursor-pointer"
                           :class="timePickerState.ampm === 'AM' ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-[1.05]' : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'">AM</div>
                      <div @click.stop="timePickerState.ampm = 'PM'" class="flex-1 flex items-center justify-center text-[13px] font-extrabold rounded-xl transition-all cursor-pointer"
                           :class="timePickerState.ampm === 'PM' ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-[1.05]' : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'">PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Jam Selesai -->
            <div>
              <label class="block text-slate-500 text-[11px] font-bold mb-1.5">Jam Selesai</label>
              <div class="relative">
                <!-- Input field -->
                <div class="relative flex items-center">
                  <input type="text" v-model="config.jamSelesai" placeholder="09:00 AM"
                         @click="openTimePicker('jamSelesai')"
                         @keydown.enter="activeCalendar = null"
                         class="w-full border rounded-xl pl-4 pr-10 py-3 bg-white text-[13px] font-bold text-slate-800 transition-all outline-none shadow-sm cursor-text"
                         :class="activeCalendar === 'jamSelesai' ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-slate-200 hover:border-slate-300'" />
                  <button @click.stop="activeCalendar === 'jamSelesai' ? activeCalendar = null : openTimePicker('jamSelesai')" class="absolute right-2 p-1.5 text-slate-400 hover:text-primary-500 transition-colors rounded-lg hover:bg-slate-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </button>
                </div>
                
                <!-- Time Dropdown -->
                <div v-if="activeCalendar === 'jamSelesai'" class="absolute z-50 right-0 top-[calc(100%+8px)] w-[280px] bg-white rounded-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.1)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div class="flex justify-between items-center mb-4 px-1">
                    <span class="font-extrabold text-slate-800 text-[15px]">Pilih Waktu</span>
                    <button @click.stop="confirmTime('jamSelesai')" class="text-white font-bold text-[11px] bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95">Selesai</button>
                  </div>
                  
                  <div class="flex gap-2 h-[180px] bg-slate-50 rounded-2xl p-2.5 border border-slate-100/50">
                    <!-- Jam -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar rounded-xl px-1 relative" style="scroll-snap-type: y mandatory;">
                      <div v-for="h in 12" :key="'h2'+h" @click.stop="timePickerState.hour = h.toString().padStart(2, '0')"
                           class="h-10 flex items-center justify-center text-[14px] font-extrabold rounded-xl transition-all cursor-pointer mb-1" style="scroll-snap-align: center;"
                           :class="timePickerState.hour === h.toString().padStart(2, '0') ? 'bg-white shadow-sm border border-slate-200 text-primary-600 scale-[1.05]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'">
                        {{ h.toString().padStart(2, '0') }}
                      </div>
                    </div>
                    
                    <div class="flex items-center text-slate-300 font-black pb-2">:</div>
                    
                    <!-- Menit -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar rounded-xl px-1 relative" style="scroll-snap-type: y mandatory;">
                      <div v-for="m in 60" :key="'m2'+m" @click.stop="timePickerState.minute = (m-1).toString().padStart(2, '0')"
                           class="h-10 flex items-center justify-center text-[14px] font-extrabold rounded-xl transition-all cursor-pointer mb-1" style="scroll-snap-align: center;"
                           :class="timePickerState.minute === (m-1).toString().padStart(2, '0') ? 'bg-white shadow-sm border border-slate-200 text-primary-600 scale-[1.05]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'">
                        {{ (m-1).toString().padStart(2, '0') }}
                      </div>
                    </div>
                    
                    <div class="w-px bg-slate-200/60 mx-1 my-2"></div>
                    
                    <!-- AM/PM -->
                    <div class="flex-1 flex flex-col gap-2 justify-center px-1">
                      <div @click.stop="timePickerState.ampm = 'AM'" class="flex-1 flex items-center justify-center text-[13px] font-extrabold rounded-xl transition-all cursor-pointer"
                           :class="timePickerState.ampm === 'AM' ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-[1.05]' : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'">AM</div>
                      <div @click.stop="timePickerState.ampm = 'PM'" class="flex-1 flex items-center justify-center text-[13px] font-extrabold rounded-xl transition-all cursor-pointer"
                           :class="timePickerState.ampm === 'PM' ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-[1.05]' : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'">PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 5. Ruangan -->
        <div class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm mb-4">
          <h3 class="font-extrabold text-slate-800 text-sm mb-3">Ruangan</h3>
          <p v-if="galatRuangan" class="text-red-500 text-[11px] font-semibold mb-2">{{ galatRuangan }}</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="ruang in daftarRuangan" :key="ruang.kode"
                    @click="toggleRuang(ruang.kode)"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 border"
                    :class="config.ruangan.includes(ruang.kode) ? 'bg-primary-900 border-primary-900 text-white shadow-md shadow-primary-900/20' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'">
              {{ ruang.kode === 'ONLINE' ? 'Daring' : ruang.kode }}
            </button>
          </div>
          <p v-if="!daftarRuangan.length && !galatRuangan" class="text-slate-400 text-[11px] font-medium mt-2">Memuat ruangan…</p>
        </div>

        <!-- 6. Ringkasan -->
        <div class="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm mb-6">
          <h3 class="font-extrabold text-slate-800 text-sm mb-4">Ringkasan</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-slate-500 text-xs font-medium">Total Seminar</span>
              <span class="text-slate-800 text-xs font-extrabold">2</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 text-xs font-medium">Ruangan Aktif</span>
              <span class="text-slate-800 text-xs font-extrabold">{{ config.ruangan.length }} ruangan</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 text-xs font-medium">Hari Aktif</span>
              <span class="text-slate-800 text-xs font-extrabold">{{ config.hari.length }} hari/minggu</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons Step 3 -->
        <div class="grid grid-cols-2 gap-3 mt-4 mb-8">
          <button @click="goToStep(2)" class="w-full justify-center bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 font-bold text-[13px] py-3.5 rounded-[14px] transition-all active:scale-[0.98] flex items-center gap-2 shadow-sm">
            <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali
          </button>
          
          <button @click="goToStep(4)" class="w-full justify-center bg-primary-500 hover:bg-primary-600 text-white font-bold text-[13px] py-3.5 rounded-[14px] shadow-[0_8px_20px_rgba(33,150,243,0.3)] transition-all active:scale-[0.98] flex items-center gap-2">
            Lanjutkan
            <svg class="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

      </div> <!-- End of Step 3 -->

      <!-- STEP 4: GENERATE -->
      <div v-show="currentStep === 4" class="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center">
        
        <!-- INITIAL STATE -->
        <div v-if="generateState === 'initial'" class="w-full flex flex-col items-center mt-2 animate-in fade-in zoom-in-95 duration-500">
          <div class="w-[72px] h-[72px] bg-[#EEF6FF] rounded-[22px] flex items-center justify-center mb-6 shadow-sm">
            <svg class="w-8 h-8 text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h2 class="text-[22px] font-extrabold text-slate-900 mb-3 text-center">Siap Generate Jadwal?</h2>
          <p class="text-slate-500 text-[13px] font-medium leading-[1.6] text-center px-4 mb-8">
            Sistem akan menjalankan Genetic Algorithm untuk menghasilkan jadwal seminar yang optimal dan bebas konflik.
          </p>

          <!-- Summary Card -->
          <div class="w-full bg-white rounded-[24px] border border-slate-100 shadow-sm mb-6 overflow-hidden">
            <div class="px-5 py-4 flex justify-between items-center border-b border-slate-50">
              <span class="text-slate-500 text-xs font-medium">Total Seminar</span>
              <span class="text-slate-800 text-xs font-extrabold">{{ uploadedFile?.rows ?? students.length }}</span>
            </div>
            <div class="px-5 py-4 flex justify-between items-center border-b border-slate-50">
              <span class="text-slate-500 text-xs font-medium">Periode</span>
              <span class="text-slate-800 text-xs font-extrabold text-right">{{ config.tanggalMulai && config.tanggalSelesai ? `${formatDate(config.tanggalMulai)} – ${formatDate(config.tanggalSelesai)}` : '-' }}</span>
            </div>
            <div class="px-5 py-4 flex justify-between items-center border-b border-slate-50">
              <span class="text-slate-500 text-xs font-medium">Ruangan</span>
              <span class="text-slate-800 text-xs font-extrabold text-right">{{ config.ruangan.length ? config.ruangan.map((r) => r === 'ONLINE' ? 'Daring' : r).join(', ') : '-' }}</span>
            </div>
            <div class="px-5 py-4 flex justify-between items-center border-b border-slate-50">
              <span class="text-slate-500 text-xs font-medium">Slot Tersedia</span>
              <span class="text-slate-800 text-xs font-extrabold">60 slot</span>
            </div>
            <div class="px-5 py-4 flex justify-between items-center">
              <span class="text-slate-500 text-xs font-medium">Algoritma</span>
              <span class="text-slate-800 text-xs font-extrabold">Genetic Algorithm</span>
            </div>
          </div>

          <!-- Alert Info -->
          <div class="w-full bg-[#F4F9FF] border border-[#E1F0FF] rounded-[16px] p-4 flex gap-3 mb-8">
            <svg class="w-[18px] h-[18px] text-[#2196F3] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p class="text-[#1976D2] text-[11px] leading-[1.6] font-medium">
              Hard constraint GA: jadwal mengajar dosen, blokir waktu dosen, dan <span class="font-bold text-[#0D47A1]">jadwal kuliah mahasiswa</span> — seminar tidak akan bentrok dengan ketiganya.
            </p>
          </div>

          <button @click="startGenerate" class="w-full justify-center bg-[#1976D2] hover:bg-blue-700 text-white font-bold tracking-wide text-[13px] py-4 rounded-[16px] shadow-[0_8px_20px_rgba(25,118,210,0.3)] transition-all active:scale-[0.98] mb-8">
            GENERATE JADWAL
          </button>
        </div>

        <!-- LOADING & SUCCESS STATE -->
        <div v-if="generateState === 'loading' || generateState === 'success'" class="w-full flex flex-col items-center mt-12 animate-in fade-in zoom-in-95 duration-500">
          
          <!-- Loading Spinner -->
          <div v-if="generateState === 'loading'" class="w-20 h-20 mb-8 relative flex items-center justify-center">
            <svg class="animate-spin w-full h-full text-blue-50" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></circle>
            </svg>
            <svg class="animate-spin w-full h-full text-[#E3F2FD] absolute left-0 top-0" style="animation-duration: 1.5s;" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></path>
            </svg>
          </div>

          <!-- Success Icon -->
          <div v-if="generateState === 'success'" class="w-[72px] h-[72px] bg-[#E8F5E9] rounded-full flex items-center justify-center mb-8 animate-in zoom-in-50 duration-500">
            <svg class="w-9 h-9 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"></path></svg>
          </div>

          <h2 class="text-[20px] font-extrabold text-center mb-3 transition-colors duration-300" 
              :class="generateState === 'success' ? 'text-[#388E3C]' : 'text-slate-900'">
            {{ generateState === 'success' ? 'Optimization Complete!' : 'Menjalankan Genetic Algorithm' }}
          </h2>
          <p class="text-slate-500 text-[13px] font-medium leading-[1.6] text-center px-4 mb-10">
            {{ generateState === 'success' ? 'Jadwal optimal berhasil dihasilkan' : 'Mohon tunggu, proses sedang berjalan...' }}
          </p>

          <!-- Progress Bar -->
          <div class="w-full bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm mb-6">
            <div class="flex justify-between items-end mb-3">
              <span class="text-slate-400 text-xs font-bold">Progress</span>
              <span class="text-slate-500 text-xs font-bold">{{ generateProgress }}%</span>
            </div>
            <div class="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div class="h-full bg-[#1565C0] rounded-full transition-all duration-300 ease-out" :style="{ width: `${generateProgress}%` }"></div>
            </div>
          </div>

          <!-- Success Action Card -->
          <div v-if="generateState === 'success'" class="w-full bg-[#EBF5FF] border border-[#D1E8FF] rounded-[24px] p-5 shadow-sm animate-in slide-in-from-bottom-8 fade-in duration-500 delay-300 fill-mode-both">
            <h3 class="font-extrabold text-[#0D47A1] text-sm mb-1.5">Jadwal siap disimpan</h3>
            <p class="text-[#1976D2] text-[11.5px] font-medium mb-6">"Jadwal Baru" akan otomatis tersimpan ke daftar jadwal.</p>
            <button @click="router.push('/admin/dashboard')" class="w-full justify-center bg-[#2196F3] hover:bg-blue-500 text-white font-bold text-[13px] py-3.5 rounded-[16px] shadow-[0_8px_20px_rgba(33,150,243,0.3)] transition-all active:scale-[0.98]">
              Simpan & Lihat Jadwal &rarr;
            </button>
          </div>
        </div>

      </div> <!-- End of Step 4 -->

    </main>



  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { App } from '@capacitor/app'

const router = useRouter()
const currentStep = ref(1)
const selectedSeminar = ref(null)
const uploadedFile = ref(null)
const activeDropdown = ref(null)

// Intercept Android hardware back button
let backHandler = null
onMounted(() => {
  muatDosen()
  muatRuanganAktif()
  backHandler = App.addListener('backButton', () => {
    if (currentStep.value > 1) {
      // Kalau di step wizard selanjutnya → kembali ke step sebelumnya
      currentStep.value--
    } else {
      App.exitApp()
    }
  })
})

onUnmounted(() => {
  backHandler?.remove()
})

// Toast Validation State
const toastMessage = ref('')
let toastTimeout = null

const showToast = (message) => {
  toastMessage.value = message
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// Step 4 State
const generateState = ref('initial')
const generateProgress = ref(0)

// gelombangId dari wizard (dibuat saat step 3 -> 4) atau seed demo
const gelombangId = ref(null)

async function pastikanGelombang() {
  if (gelombangId.value) {
    await simpanCsvKeGelombang(gelombangId.value)
    return gelombangId.value
  }
  const res = await $fetch('/api/gelombang', {
    method: 'POST',
    body: {
      nama: config.value.namaJadwal,
      jenis: selectedSeminar.value,
      tanggalMulai: config.value.tanggalMulai,
      tanggalSelesai: config.value.tanggalSelesai,
      hari: config.value.hari,
      jamMulai: konversiKe24(config.value.jamMulai),
      jamSelesai: konversiKe24(config.value.jamSelesai),
      ruangan: config.value.ruangan,
    },
  })
  gelombangId.value = res.data.id
  // CSV hanya di memori sampai sini — simpan dulu baru generate.
  // Tanpa ini generate selalu 409 "Tidak ada seminar yang dijadwalkan".
  await simpanCsvKeGelombang(res.data.id)
  return res.data.id
}

// Kirim CSV mentah ke /api/seminar bulk. Idempoten via upsert.
// NIM cocok → pakai mahasiswa_id lama → akun lama otomatis lihat seminar ini.
// Pilihan dosen di pratinjau diikutkan: nama → id via dosenIdByNama.
async function simpanCsvKeGelombang(id) {
  if (seminarAsli.value) return
  const dosenId = (nama) => dosenIdByNama.value[String(nama ?? '').trim()] ?? null
  const opsiDariPratinjau = (r) => {
    const p1 = dosenId(r.pembimbing1), p2 = dosenId(r.pembimbing2)
    const u1 = dosenId(r.penguji1), u2 = dosenId(r.penguji2)
    // '-' / kosong = belum diisi → null (bulk biarkan null → invalid).
    const o = { is_online: Boolean(r.isDaring) }
    if (p1) o.pembimbing_utama_id = p1
    if (p2) o.pembimbing_pendamping_id = p2
    if (u1) o.penguji1_id = u1
    if (u2) o.penguji2_id = u2
    return o
  }
  let body
  if (uploadedFile.value?.teks && pratinjauList.value.length) {
    const petaOpsi = new Map(pratinjauList.value.map((r) => [String(r.nim), opsiDariPratinjau(r)]))
    const rows = parseSeminarCsvKlien(uploadedFile.value.teks).map((r) => ({ ...r, ...(petaOpsi.get(String(r.nim)) ?? {}) }))
    body = { gelombang_id: id, jenis: selectedSeminar.value, seminar: rows }
  } else if (uploadedFile.value?.teks) {
    body = { gelombang_id: id, jenis: selectedSeminar.value, csv: uploadedFile.value.teks }
  } else {
    showToast('Unggah CSV dulu sebelum generate.')
    throw new Error('CSV belum diunggah.')
  }
  const res = await $fetch('/api/seminar', { method: 'POST', body })
  seminarAsli.value = true
  await muatSeminar()
  // Laporkan kaitan akun: cocok = NIM sudah ada, butuhAkun = belum punya login.
  const cocok = res?.cocok ?? 0, baru = res?.baru ?? 0
  const kurang = res?.butuhAkun ?? []
  showToast(kurang.length
    ? `${cocok} cocok, ${baru} baru. ${kurang.length} belum punya akun: ${kurang.slice(0, 3).join(', ')}${kurang.length > 3 ? '…' : ''}`
    : `${cocok} cocok, ${baru} baru — semua sudah punya akun.`)
}

// Parse CSV di klien (tanpa judul/validasi berat) — untuk gabung pilihan dosen sebelum bulk.
function parseSeminarCsvKlien(teks) {
  const baris = String(teks ?? '').split(/\r?\n/).map((b) => b.trim()).filter(Boolean)
  if (baris.length < 2) return []
  const head = baris[0].split(',').map((h) => h.trim().toLowerCase())
  const iNim = head.indexOf('nim'), iNama = head.indexOf('nama')
  const iJudul = head.indexOf('judul'), iUrutan = head.indexOf('urutan')
  if (iNim < 0 || iNama < 0) return []
  return baris.slice(1).map((b, i) => {
    const c = b.split(',').map((v) => v.trim())
    return {
      nim: c[iNim] ?? '', nama: c[iNama] ?? '',
      judul: iJudul >= 0 ? c[iJudul] : undefined,
      urutan_daftar: iUrutan >= 0 ? Number(c[iUrutan]) || i + 1 : i + 1,
    }
  }).filter((r) => r.nim && r.nama)
}

function konversiKe24(v) {
  if (!v) return v
  if (/^\d{2}:\d{2}$/.test(v)) return v
  const m = v.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!m) return v
  let h = parseInt(m[1], 10) % 12
  if (/pm/i.test(m[3])) h += 12
  return `${String(h).padStart(2, '0')}:${m[2]}`
}

const startGenerate = async () => {
  // Pra-bulk (CSV baru): jangan blokir buta — cek gate Step 2 dulu.
  // Lolos (CSV valid + penguji lengkap) → lanjut bulk otomatis di pastikanGelombang.
  if (!seminarAsli.value && uploadedFile.value?.teks) {
    if (!bolehLanjutStep2.value) {
      const msg = 'Pilih Penguji 1 + Penguji 2 untuk semua mahasiswa dulu.'
      generateState.value = 'initial'
      showToast(msg)
      currentStep.value = 2
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Lolos gate → terus ke pastikanGelombang (bulk + generate).
  }
  generateState.value = 'loading'
  generateProgress.value = 10
  const tick = setInterval(() => {
    if (generateProgress.value < 90) generateProgress.value += 5
  }, 800)
  try {
    const id = await pastikanGelombang()
    await $fetch('/api/admin/generate-schedule', {
      method: 'POST',
      body: { gelombangId: id },
    })
    generateProgress.value = 100
    clearInterval(tick)
    setTimeout(() => { generateState.value = 'success' }, 500)
  } catch (e) {
    clearInterval(tick)
    generateState.value = 'initial'
    showToast(e?.data?.statusMessage || e?.message || 'Generate gagal.')
  }
}

// Custom Calendar State
const activeCalendar = ref(null)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const calendarDays = computed(() => {
  const days = []
  let firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  firstDay = firstDay === 0 ? 6 : firstDay - 1 // Monday = 0
  
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate()
  
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: daysInPrevMonth - i, isCurrentMonth: false, fullDate: new Date(currentYear.value, currentMonth.value - 1, daysInPrevMonth - i) })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, isCurrentMonth: true, fullDate: new Date(currentYear.value, currentMonth.value, i) })
  }
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: i, isCurrentMonth: false, fullDate: new Date(currentYear.value, currentMonth.value + 1, i) })
  }
  return days
})

const formatYMD = (dateObj) => {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return `${d.getDate()} ${monthNames[d.getMonth()].substring(0,3)} ${d.getFullYear()}`
}

const selectDate = (type, fullDate) => {
  const formatted = formatYMD(fullDate)
  if (type === 'mulai') config.value.tanggalMulai = formatted
  if (type === 'selesai') config.value.tanggalSelesai = formatted
  activeCalendar.value = null
}

const timePickerState = ref({
  hour: '08',
  minute: '00',
  ampm: 'AM'
})

const openTimePicker = (type) => {
  activeCalendar.value = type
  const existing = type === 'jamMulai' ? config.value.jamMulai : config.value.jamSelesai
  if (existing && existing.includes(':')) {
    const [time, ampm] = existing.split(' ')
    const [h, m] = time.split(':')
    timePickerState.value = { hour: h, minute: m, ampm: ampm || 'AM' }
  } else {
    timePickerState.value = { hour: '08', minute: '00', ampm: 'AM' }
  }
}

const confirmTime = (type) => {
  const formatted = `${timePickerState.value.hour}:${timePickerState.value.minute} ${timePickerState.value.ampm}`
  if (type === 'jamMulai') config.value.jamMulai = formatted
  if (type === 'jamSelesai') config.value.jamSelesai = formatted
  activeCalendar.value = null
}

// Daftar dosen DB-only; kosong bila /api/dosen gagal / belum login.
const listDosen = ref([])
// peta nama -> id untuk PATCH seminar (diisi saat API sukses)
const dosenIdByNama = ref({})

async function muatDosen() {
  try {
    const res = await $fetch('/api/dosen')
    const rows = res?.data ?? []
    if (!rows.length) return // DB kosong → dropdown penguji kosong
    listDosen.value = rows.map((d) => d.nama)
    dosenIdByNama.value = Object.fromEntries(rows.map((d) => [d.nama, Number(d.id)]))
  } catch {
    // Gagal / kosong → dropdown penguji kosong; login lalu buka ulang.
  }
}

// Daftar ruangan dari DB — tanpa hardcode R101 fiktif.
const daftarRuangan = ref([])
const galatRuangan = ref('')

async function muatRuanganAktif() {
  try {
    const res = await $fetch('/api/ruangan')
    daftarRuangan.value = (res?.data ?? []).map((r) => ({ kode: r.kode ?? r.nama, nama: r.nama }))
  } catch {
    galatRuangan.value = 'Gagal muat ruangan. Login dulu lalu buka ulang.'
  }
}

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

async function simpanPengujiKeServer(student, field, dosenNama) {
  // Hanya baris asli (punya seminarId). Contoh placeholder cukup lokal.
  if (!student.seminarId) return
  const key = field === 'penguji1' ? 'penguji1_id' : 'penguji2_id'
  const dosenId = dosenIdByNama.value[dosenNama]
  if (!dosenId) return
  try {
    await $fetch(`/api/seminar/${student.seminarId}`, { method: 'PATCH', body: { [key]: dosenId } })
    // Otomatiskan validasi: 4 dosen terisi + beda → valid, selain itu invalid.
    const valid = empatDosenBeda(student)
    student.status = valid ? 'Valid' : 'Invalid'
    await $fetch(`/api/seminar/${student.seminarId}`, { method: 'PATCH', body: { validasi: valid ? 'valid' : 'invalid' } }).catch(() => {})
  } catch (e) {
    showToast(e?.data?.statusMessage || 'Gagal simpan penguji.')
  }
}

// Pembimbing diisi mahasiswa; admin hanya lihat. '-' / kosong = pending.
// Terisi = tampil nama; beda = syarat lanjut (4 dosen wajib beda orang).
function pembimbingTerisi(s) {
  const a = String(s?.pembimbing1 ?? '').trim()
  const b = String(s?.pembimbing2 ?? '').trim()
  return (a && a !== '-') && (b && b !== '-')
}
function pengujiTerisi(s) {
  return Boolean(String(s?.penguji1 ?? '').trim()) && Boolean(String(s?.penguji2 ?? '').trim())
}
function empatDosenBeda(s) {
  if (!pembimbingTerisi(s) || !pengujiTerisi(s)) return false
  return new Set([s.pembimbing1, s.pembimbing2, s.penguji1, s.penguji2]).size === 4
}
function pembimbingLengkap(s) { return pembimbingTerisi(s) }
function pengujiLengkap(s) { return pengujiTerisi(s) }

const selectPenguji = (student, field, dosen) => {
  student[field] = dosen
  activeDropdown.value = null
  simpanPengujiKeServer(student, field, dosen)
}

const config = ref({
  namaJadwal: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  hari: [],
  jamMulai: '',
  jamSelesai: '',
  ruangan: []
})

const toggleHari = (hari) => {
  const index = config.value.hari.indexOf(hari)
  if (index === -1) {
    config.value.hari.push(hari)
  } else {
    config.value.hari.splice(index, 1)
  }
}

const toggleRuang = (ruang) => {
  const index = config.value.ruangan.indexOf(ruang)
  if (index === -1) {
    config.value.ruangan.push(ruang)
  } else {
    config.value.ruangan.splice(index, 1)
  }
}

const handleBack = () => {
  if (currentStep.value > 1) {
    goToStep(currentStep.value - 1)
  } else {
    router.back()
  }
}

const goToStep = async (step) => {
  // Validate Step 1 -> 2
  if (step === 2 && currentStep.value === 1) {
    if (!selectedSeminar.value) {
      showToast('Pilih jenis seminar terlebih dahulu!')
      return
    }
    if (!uploadedFile.value) {
      showToast('Harap unggah file SPS mahasiswa terlebih dahulu!')
      return
    }
  }  
  // Validate Step 2 -> 3: NIM + nama wajib sama dengan DB sebelum lanjut.
  if (step === 3 && currentStep.value === 2 && !seminarAsli.value) {
    if (!pratinjauList.value.length) {
      showToast('Pratinjau belum dimuat — kembali lalu masuk Step 2 ulang.')
      return
    }
    if (bedaNamaPratinjau.value > 0) {
      showToast(`${bedaNamaPratinjau.value} nama beda dengan DB — koreksi CSV dulu.`)
      return
    }
    if (duplikatPratinjau.value > 0) {
      showToast(`${duplikatPratinjau.value} NIM ganda di CSV — hapus duplikat dulu.`)
      return
    }
    // Pratinjau awal (CSV baru, baris DB belum ada): kunci = CSV valid + penguji
    // lengkap. Pembimbing boleh susulan mahasiswa → hanya info, tak blokir.
    // Baris dengan pembimbing DB terbaca (NIM lama) ikut validasi 4-beda ringan.
    const kurangUji = pratinjauList.value.filter((s) => !pengujiLengkap(s)).length
    if (kurangUji > 0) {
      showToast('Pilih Penguji 1 + Penguji 2 untuk semua mahasiswa dulu.')
      return
    }
  }
  // Sesudah simpan: pembimbing (diisi mahasiswa) + penguji (dipilih admin) wajib lengkap + 4 beda.
  if (step === 3 && currentStep.value === 2 && seminarAsli.value) {
    const kurangBimbing = students.value.filter((s) => !pembimbingLengkap(s)).length
    if (kurangBimbing > 0) {
      showToast(`${kurangBimbing} mahasiswa belum isi pembimbing — minta mahasiswa lengkapi dulu.`)
      return
    }
    const kurangUji = students.value.filter((s) => !pengujiLengkap(s)).length
    if (kurangUji > 0) {
      showToast('Pilih Penguji 1 + Penguji 2 untuk semua mahasiswa dulu.')
      return
    }
    const kembar = students.value.filter((s) => !empatDosenBeda(s)).length
    if (kembar > 0) {
      showToast('Keempat dosen harus orang berbeda tiap mahasiswa.')
      return
    }
  }
  // Validate Step 3 -> 4
  if (step === 4 && currentStep.value === 3) {
    if (!config.value.namaJadwal) {
      showToast('Nama jadwal tidak boleh kosong!')
      return
    }
    if (!config.value.tanggalMulai || !config.value.tanggalSelesai) {
      showToast('Periode penjadwalan harus diisi lengkap!')
      return
    }
    if (config.value.hari.length === 0) {
      showToast('Pilih minimal satu hari pelaksanaan!')
      return
    }
    if (!config.value.jamMulai || !config.value.jamSelesai) {
      showToast('Waktu pelaksanaan harus diisi lengkap!')
      return
    }
    if (config.value.ruangan.length === 0) {
      showToast('Pilih minimal satu ruangan!')
      return
    }
  }

  currentStep.value = step
  if (step === 2) {
    if (seminarAsli.value) await muatSeminar()
    else await muatPratinjau()
  }
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// DB-only; tanpa contoh fiktif.
const students = ref([])
const seminarAsli = ref(false)

// Pratinjau CSV vs DB (read-only, sebelum simpan). Diisi saat masuk Step 2.
const pratinjauList = ref([])
const memuatPratinjau = ref(false)
const galatPratinjau = ref('')
const totalPratinjau = computed(() => pratinjauList.value.length)
const cocokPratinjau = computed(() => pratinjauList.value.filter((r) => r.status === 'cocok').length)
const baruPratinjau = computed(() => pratinjauList.value.filter((r) => r.status === 'baru').length)
const bedaNamaPratinjau = computed(() => pratinjauList.value.filter((r) => r.status === 'beda-nama').length)
const duplikatPratinjau = computed(() => pratinjauList.value.filter((r) => r.duplikat).length)
const tanpaAkunPratinjau = computed(() => pratinjauList.value.filter((r) => !r.punyaAkun).length)

// Angka metrik: sebelum simpan pakai pratinjau CSV vs DB, sesudah simpan pakai kartu seminar.
const totalTampil = computed(() => (seminarAsli.value ? students.value.length : totalPratinjau.value))
const validTampil = computed(() => (seminarAsli.value
  ? students.value.filter((s) => s.status === 'Valid').length
  : cocokPratinjau.value))
const invalidTampil = computed(() => (seminarAsli.value
  ? students.value.filter((s) => s.status === 'Invalid').length
  : bedaNamaPratinjau.value + baruPratinjau.value))
const duplikatTampil = computed(() => (seminarAsli.value
  ? students.value.filter((s) => s.status === 'Duplikat').length
  : duplikatPratinjau.value))

// Tombol Lanjutkan terkunci (abu-abu + disabled) bila syarat belum penuh.
// Pra-bulk (CSV baru): CSV valid + penguji lengkap. Pembimbing boleh susulan
// mahasiswa (CSV tak punya kolom pembimbing; baris DB belum ada) → tampil
// "Menunggu input mahasiswa", tak blokir. Pasca-bulk: + pembimbing + 4 beda.
const bolehLanjutStep2 = computed(() => {
  if (!seminarAsli.value) {
    if (!pratinjauList.value.length || bedaNamaPratinjau.value > 0 || duplikatPratinjau.value > 0) return false
    return pratinjauList.value.every((s) => pengujiLengkap(s))
  }
  if (!students.value.length) return false
  return students.value.every((s) => pembimbingLengkap(s) && pengujiLengkap(s) && empatDosenBeda(s))
})

// Parse lokal darurat — tampilkan isi CSV walau /api/pratinjau gagal (belum login/offline).
function parseLokal(teks) {
  const baris = String(teks ?? '').split(/\r?\n/).map((b) => b.trim()).filter(Boolean)
  if (baris.length < 2) return []
  const head = baris[0].split(',').map((h) => h.trim().toLowerCase())
  const iNim = head.indexOf('nim'), iNama = head.indexOf('nama'), iJudul = head.indexOf('judul')
  if (iNim < 0 || iNama < 0) return []
  const hitung = {}
  const rows = baris.slice(1).map((b, i) => {
    const c = b.split(',').map((v) => v.trim())
    const nim = c[iNim] ?? '', nama = c[iNama] ?? ''
    hitung[nim] = (hitung[nim] ?? 0) + 1
    return { nim, nama, namaCsv: nama, namaDb: null, judul: iJudul >= 0 ? c[iJudul] : '', urutan: i + 1, status: 'belum-dicek', punyaAkun: false, duplikat: false, pembimbing1: '-', pembimbing2: '-', penguji1: '', penguji2: '', isDaring: false }
  }).filter((r) => r.nim && r.nama)
  return rows.map((r) => ({ ...r, duplikat: (hitung[r.nim] ?? 0) > 1 }))
}

async function muatPratinjau(force = false) {
  if (!force && pratinjauList.value.length) return // ponytail: refresh paksa bila CSV ganti (tanganFileDipilih reset list)
  if (!uploadedFile.value?.teks || seminarAsli.value) return
  memuatPratinjau.value = true
  galatPratinjau.value = ''
  try {
    const res = await $fetch('/api/seminar/pratinjau', { method: 'POST', body: { csv: uploadedFile.value.teks } })
    pratinjauList.value = (res?.data ?? []).map((r) => ({
      ...r,
      pembimbing1: r.pembimbing1 ?? '-', pembimbing2: r.pembimbing2 ?? '-',
      penguji1: r.penguji1 ?? '', penguji2: r.penguji2 ?? '', isDaring: r.isDaring ?? r.is_online ?? false,
    }))
  } catch (e) {
    // Gagal (belum login/offline) → tetap tampilkan isi CSV lokal tanpa status DB.
    galatPratinjau.value = e?.data?.statusMessage || 'Gagal cek DB — tampil isi CSV saja.'
    pratinjauList.value = parseLokal(uploadedFile.value.teks)
  } finally {
    memuatPratinjau.value = false
  }
}

// Refresh manual Step 2: tarik ulang input mahasiswa susulan tanpa ganti CSV.
async function segarkanStep2() {
  if (seminarAsli.value) await muatSeminar(true)
  else await muatPratinjau(true)
}

function petakanSeminar(row, dosenNama) {
  return {
    id: row.id,
    seminarId: row.id, // penanda baris asli → PATCH ke server
    name: row.mahasiswa?.nama ?? `Seminar #${row.id}`,
    nim: row.mahasiswa?.nim ?? '-',
    pembimbing1: dosenNama[row.pembimbing_utama_id] ?? row.pembimbing_utama_nama ?? '-',
    pembimbing2: dosenNama[row.pembimbing_pendamping_id] ?? row.pembimbing_pendamping_nama ?? '-',
    penguji1: dosenNama[row.penguji1_id] ?? row.penguji1_nama ?? '',
    penguji2: dosenNama[row.penguji2_id] ?? row.penguji2_nama ?? '',
    judul: row.judul ?? '',
    isDaring: row.is_online ?? false,
    status: row.validasi === 'valid' ? 'Valid' : row.validasi === 'duplikat' ? 'Duplikat' : 'Invalid',
  }
}

// Dipanggil saat masuk step 2 bila gelombang sudah ada.
// force=true untuk refresh susulan input mahasiswa (guard default hemat refetch).
async function muatSeminar(force = false) {
  if (!force && seminarAsli.value && students.value.length) return // ponytail: force=true bila butuh refresh susulan mahasiswa
  if (!gelombangId.value && !force) return
  try {
    const urlSem = gelombangId.value ? `/api/seminar?gelombang_id=${gelombangId.value}` : '/api/seminar'
    const [semRes, dosRes] = await Promise.all([
      $fetch(urlSem),
      $fetch('/api/dosen').catch(() => null),
    ])
    const rows = semRes?.data ?? []
    if (!rows.length) return
    const dosenNama = {}
    for (const d of dosRes?.data ?? []) dosenNama[Number(d.id)] = d.nama
    students.value = rows.map((r) => petakanSeminar(r, dosenNama))
    seminarAsli.value = true
  } catch {
    // Gagal → biarkan students kosong; empty-state yang bicara.
  }
}

async function simpanDaringKeServer(student) {
  if (!student.seminarId) return
  try {
    await $fetch(`/api/seminar/${student.seminarId}`, { method: 'PATCH', body: { is_online: student.isDaring } })
  } catch (e) {
    student.isDaring = !student.isDaring
    showToast(e?.data?.statusMessage || 'Gagal simpan mode daring.')
  }
}

const toggleDaring = (student) => {
  student.isDaring = !student.isDaring
  simpanDaringKeServer(student)
}

const tanganFileDipilih = (e) => {
  const f = e?.target?.files?.[0]
  if (!f) return
  if (!/\.csv$/i.test(f.name)) {
    showToast('Format harus .csv — unduh template dulu.')
    e.target.value = ''
    return
  }
  if (f.size > 10 * 1024 * 1024) {
    showToast('File maksimal 10 MB.')
    e.target.value = ''
    return
  }
  const baca = new FileReader()
  baca.onload = () => {
    const teks = String(baca.result ?? '')
    const baris = teks.split(/\r?\n/).map((b) => b.trim()).filter(Boolean)
    if (baris.length < 2) {
      showToast('CSV minimal header + 1 baris data.')
      return
    }
    uploadedFile.value = {
      name: f.name,
      rows: baris.length - 1,
      size: f.size > 1024 ? `${Math.round(f.size / 1024)} KB` : `${f.size} B`,
      teks, // csv mentah → dikirim ke /api/seminar bulk
    }
    pratinjauList.value = [] // CSV ganti → guard muatPratinjau boleh fetch ulang
  }
  baca.readAsText(f)
}

const downloadTemplate = () => {
  const csv = 'nim,nama,judul,urutan\n1231099,Andi Pratama,Sistem Informasi Akademik,1\n1231100,Dina Mariana,Aplikasi Penjadwalan Seminar,2\n'
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'template-sps.csv'
  a.click()
  URL.revokeObjectURL(a.href)
  showToast('Template CSV SPS berhasil diunduh!')
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

// Add pb-safe for mobile notch padding (optional utility in CSS)
</script>

<style scoped>
/* To handle bottom notch in iOS */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
