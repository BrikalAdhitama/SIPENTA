<template>
  <div class="min-h-screen bg-white font-sans pb-24 relative">
    
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
    <header class="px-6 pb-4 pt-10 sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shadow-sm flex items-center gap-3">
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
            <div 
              @click="!uploadedFile ? handleUploadMock() : null"
              class="border-2 border-dashed rounded-[20px] p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-5"
              :class="uploadedFile ? 'border-primary-500 bg-primary-50/50' : 'border-slate-200 bg-slate-50 hover:bg-primary-50/30 hover:border-primary-200'"
            >
              <!-- Normal State -->
              <template v-if="!uploadedFile">
                <div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-primary-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <p class="text-slate-700 font-bold text-sm mb-1 group-hover:text-primary-900 transition-colors">Drag & drop file Excel di sini</p>
                <p class="text-slate-400 text-xs font-medium mb-4">atau klik untuk memilih file</p>
                <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold tracking-wide">
                  .xlsx, .xls — maks. 10 MB
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
        <div class="mb-6">
          <h2 class="text-xl font-extrabold text-slate-800 tracking-tight mb-1">Preview & Validasi Data</h2>
          <p class="text-slate-500 text-[13px] font-medium leading-relaxed">
            Data {{ selectedSeminar === 'sempro' ? 'Sempro' : 'Semhas' }} — periksa dan tetapkan penguji sebelum melanjutkan
          </p>
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
              <span class="text-2xl font-black text-primary-900 leading-none">2</span>
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
              <span class="text-2xl font-black text-green-700 leading-none">1</span>
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
              <span class="text-2xl font-black text-red-700 leading-none">1</span>
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
              <span class="text-2xl font-black text-slate-700 leading-none">0</span>
            </div>
            <span class="text-[11px] font-bold text-slate-500/80 tracking-wide relative z-10">DUPLIKAT</span>
          </div>
        </div>

        <!-- Alert Warnings -->
        <div class="bg-amber-50 border border-amber-300 rounded-[20px] p-4 mb-4 flex gap-3 shadow-sm">
          <svg class="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div>
            <h4 class="text-amber-800 font-bold text-sm mb-1">Ditemukan 1 data invalid dan 0 data duplikat</h4>
            <p class="text-amber-700 text-xs font-medium leading-relaxed">Perbaiki data tersebut sebelum melanjutkan atau hapus data bermasalah.</p>
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-[20px] p-4 mb-6 flex gap-3 shadow-sm">
          <svg class="w-6 h-6 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-blue-800 text-xs font-medium leading-relaxed">
            Pilih <strong class="font-bold">Penguji 1 dan Penguji 2</strong> secara manual untuk setiap mahasiswa. Penguji tidak boleh sama dengan pembimbing.
          </p>
        </div>

        <!-- Data Cards -->
        <div class="flex flex-col gap-4">
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

            <!-- Detail Pembimbing -->
            <div class="mb-5 space-y-1">
              <p class="text-slate-600 text-xs font-medium">Pembimbing 1 : {{ student.pembimbing1 }}</p>
              <p class="text-slate-600 text-xs font-medium">Pembimbing 2 : {{ student.pembimbing2 }}</p>
            </div>

            <!-- Dropdowns Penguji -->
            <div class="grid grid-cols-2 gap-3 mb-5">
              <!-- Penguji 1 -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 mb-1.5">Penguji 1</label>
                <div class="relative">
                  <div @click="toggleDropdown('p1-' + student.id)"
                       class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 cursor-pointer transition-all"
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
                       class="w-full flex items-center justify-between border rounded-xl px-3 py-2.5 cursor-pointer transition-all"
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
          
          <button @click="goToStep(3)" class="w-full justify-center bg-primary-500 hover:bg-primary-600 text-white font-bold text-[13px] py-3.5 rounded-[14px] shadow-[0_8px_20px_rgba(33,150,243,0.3)] transition-all active:scale-[0.98] flex items-center gap-2">
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
          <div class="flex flex-wrap gap-2">
            <button v-for="ruang in ['R101', 'R102', 'R103', 'R104', 'Daring']" :key="ruang" 
                    @click="toggleRuang(ruang)"
                    class="px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 border"
                    :class="config.ruangan.includes(ruang) ? 'bg-primary-900 border-primary-900 text-white shadow-md shadow-primary-900/20' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'">
              {{ ruang }}
            </button>
          </div>
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
              <span class="text-slate-800 text-xs font-extrabold">6</span>
            </div>
            <div class="px-5 py-4 flex justify-between items-center border-b border-slate-50">
              <span class="text-slate-500 text-xs font-medium">Periode</span>
              <span class="text-slate-800 text-xs font-extrabold text-right">1 – 5 September 2025</span>
            </div>
            <div class="px-5 py-4 flex justify-between items-center border-b border-slate-50">
              <span class="text-slate-500 text-xs font-medium">Ruangan</span>
              <span class="text-slate-800 text-xs font-extrabold text-right">R101, R102, R103</span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(1)
const selectedSeminar = ref(null)
const uploadedFile = ref(null)
const activeDropdown = ref(null)

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

const startGenerate = () => {
  generateState.value = 'loading'
  generateProgress.value = 0
  
  const interval = setInterval(() => {
    generateProgress.value += Math.floor(Math.random() * 15) + 5
    if (generateProgress.value >= 100) {
      generateProgress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        generateState.value = 'success'
      }, 500)
    }
  }, 400)
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

const listDosen = ref([
  'Dr. Budi Santoso',
  'Dr. Sari Dewi, M.Kor',
  'Prof. Dr. Ir. H. Ahmad',
  'Rina Mulyati, M.T.',
  'Hendra Saputra, Ph.D'
])

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const selectPenguji = (student, field, dosen) => {
  student[field] = dosen
  activeDropdown.value = null
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

const goToStep = (step) => {
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
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const students = ref([
  { id: 1, name: 'Andi Pratama', nim: '1231099', pembimbing1: 'Dr. Budi Santoso', pembimbing2: 'Dr. Budi Santoso', penguji1: 'Dr. Sari Dewi, M.Kor', penguji2: 'Dr. Sari Dewi, M.Kor', isDaring: false, status: 'Valid' },
  { id: 2, name: 'Dina Mariana', nim: '1231100', pembimbing1: 'Dr. Andi Pratama', pembimbing2: 'Dr. Andi Pratama', penguji1: 'Dr. Sari Dewi, M.Kor', penguji2: 'Dr. Sari Dewi, M.Kor', isDaring: false, status: 'Valid' }
])

const toggleDaring = (student) => {
  student.isDaring = !student.isDaring
}

const handleUploadMock = () => {
  uploadedFile.value = {
    name: 'Kelompok MK Tata Kelola Teknologi Informasi - Gasal 2026_2027.xlsx',
    rows: 1,
    size: '7 KB'
  }
}

const downloadTemplate = () => {
  // Dalam implementasi nyata, ini akan men-download file Excel (.xlsx) 
  // berisi baris header: NIM, Nama Mahasiswa, Judul, Dosen Pembimbing
  showToast('Template Excel SPS berhasil diunduh!')
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
