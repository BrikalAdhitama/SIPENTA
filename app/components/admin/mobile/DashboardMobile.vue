<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-32 pt-[calc(env(safe-area-inset-top)+1rem)]">
    <main class="px-6 pb-6 max-w-lg mx-auto">
      
      <!-- Top Header -->
      <header class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4 cursor-pointer" @click="showProfileSheet = true">
          <!-- Profile Picture -->
          <img src="https://ui-avatars.com/api/?name=Budi+Santoso&background=0D47A1&color=fff&size=100" alt="Profile" class="w-14 h-14 rounded-full object-cover shadow-sm active:scale-95 transition-transform" />
          <div>
            <p class="text-slate-500 text-sm font-medium">Hello!</p>
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Budi Santoso</h1>
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
          <NuxtLink to="/admin/jadwal" class="text-primary-900 text-sm font-semibold flex items-center hover:underline active:scale-95 transition-transform">
            Lihat selengkapnya
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </NuxtLink>
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
          <NuxtLink to="/admin/penjadwalan" class="aspect-square rounded-[22px] bg-primary-50 border border-primary-100 shadow-sm flex flex-col items-center justify-center gap-2.5 transition-transform active:scale-95">
            <div class="w-[42px] h-[42px] rounded-full bg-white/60 flex items-center justify-center backdrop-blur-sm">
              <svg class="w-5 h-5 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span class="text-primary-900 text-[11px] font-bold text-center leading-[1.2]">Buat<br>Penjadwalan</span>
          </NuxtLink>

          <!-- Action 2: Kelola Mahasiswa -->
          <NuxtLink to="/admin/mahasiswa" class="aspect-square rounded-[22px] bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2.5 transition-transform active:scale-95">
            <div class="w-[42px] h-[42px] rounded-full bg-slate-50 border border-slate-100/50 flex items-center justify-center">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <span class="text-slate-700 text-[11px] font-semibold text-center leading-[1.2]">Kelola<br>Mahasiswa</span>
          </NuxtLink>

          <!-- Action 3: Lihat Jadwal -->
          <NuxtLink to="/admin/jadwal" class="aspect-square rounded-[22px] bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2.5 transition-transform active:scale-95">
            <div class="w-[42px] h-[42px] rounded-full bg-slate-50 border border-slate-100/50 flex items-center justify-center">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span class="text-slate-700 text-[11px] font-semibold text-center leading-[1.2]">Lihat<br>Jadwal</span>
          </NuxtLink>

        </div>
      </section>

    </main>

    <!-- Profile Bottom Sheet -->
    <div v-if="showProfileSheet" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity" @click.self="showProfileSheet = false">
      <div class="bg-white w-full rounded-t-[32px] pt-4 pb-12 animate-slide-up shadow-2xl relative flex flex-col items-center">
        <!-- Handle -->
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mb-6"></div>
        
        <!-- Header -->
        <div class="w-full px-6 flex justify-between items-center mb-8">
          <button @click="showProfileSheet = false" class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:scale-95 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h2 class="text-[17px] font-extrabold text-slate-800">Profil Admin</h2>
          <div class="w-10"></div> <!-- Spacer for centering -->
        </div>

        <!-- Avatar & Info -->
        <div class="flex flex-col items-center px-6 w-full mb-8">
          <div class="w-[88px] h-[88px] rounded-full flex items-center justify-center text-[36px] font-bold text-white shadow-lg mb-4 relative" style="background: linear-gradient(135deg, #0F3B8C 0%, #1E40AF 100%);">
            B
            <div class="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div class="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </div>
            </div>
          </div>
          <h3 class="text-xl font-extrabold text-slate-800 tracking-tight">Budi Santoso, S.Kom.</h3>
          <p class="text-[12px] font-medium text-slate-500 font-mono mt-1 mb-3">NIP. 198507232010121001</p>
          <div class="px-3 py-1 bg-blue-50 rounded-lg text-blue-600 text-xs font-bold tracking-wide mb-1.5">
            Admin Informatika
          </div>
          <p class="text-xs font-medium text-slate-500">budi.admin@kampus.ac.id</p>
        </div>

        <!-- Action Menus -->
        <div class="w-full px-6 flex flex-col gap-3">
          <button @click="showPasswordModal = true; showProfileSheet = false" class="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50 active:bg-slate-100 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <span class="text-[14px] font-bold text-slate-700">Ubah Kata Sandi</span>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          
          <button @click="showLogoutModal = true; showProfileSheet = false" class="w-full flex items-center justify-between p-4 rounded-2xl bg-[#FEF2F2] border border-red-100 active:bg-red-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </div>
              <span class="text-[14px] font-bold text-red-600">Keluar Akun</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in" @click.self="showPasswordModal = false">
      <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-zoom-in flex flex-col">
        <div class="p-5 flex justify-between items-center border-b border-slate-100">
          <h3 class="font-extrabold text-[17px] text-slate-800">Ubah Kata Sandi</h3>
          <button @click="showPasswordModal = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 active:scale-95 transition-transform">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-6 flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[12px] font-bold text-slate-700">Kata Sandi Lama</label>
            <input type="password" v-model="passForm.old" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400" placeholder="Masukkan kata sandi lama">
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12px] font-bold text-slate-700">Kata Sandi Baru</label>
            <input type="password" v-model="passForm.new" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400" placeholder="Minimal 8 karakter">
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12px] font-bold text-slate-700">Konfirmasi Kata Sandi</label>
            <input type="password" v-model="passForm.confirm" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400" placeholder="Ketik ulang kata sandi baru">
          </div>
        </div>
        <div class="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button @click="showPasswordModal = false" class="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-[13px] active:scale-95 transition-transform shadow-sm">Batal</button>
          <button @click="handleSavePassword" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-[13px] active:scale-95 transition-transform shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)]">Simpan</button>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in" @click.self="showLogoutModal = false">
      <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-zoom-in flex flex-col items-center p-6 pt-8 text-center relative">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </div>
        <h3 class="font-extrabold text-[19px] text-slate-800 mb-1.5">Keluar dari Akun?</h3>
        <p class="text-[13px] text-slate-500 font-medium mb-8 px-2">Anda harus login kembali untuk mengakses panel admin SIPENTA.</p>
        
        <div class="flex gap-3 w-full">
          <button @click="showLogoutModal = false" class="flex-1 py-3.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-[14px] active:scale-95 transition-transform">Batal</button>
          <button @click="handleLogout" class="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl text-[14px] active:scale-95 transition-transform shadow-[0_8px_16px_-6px_rgba(239,68,68,0.4)]">Ya, Keluar</button>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Nav -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const isDropdownOpen = ref(false)
const selectedFilter = ref('Semua')
const showProfileSheet = ref(false)
const showPasswordModal = ref(false)
const showLogoutModal = ref(false)

const passForm = ref({ old: '', new: '', confirm: '' })

const handleSavePassword = () => {
  if (!passForm.value.old || !passForm.value.new || !passForm.value.confirm) {
    if (window.$toast) window.$toast({ title: 'Gagal Menyimpan', message: 'Semua kolom kata sandi wajib diisi.', type: 'error' })
    return
  }
  if (passForm.value.new !== passForm.value.confirm) {
    if (window.$toast) window.$toast({ title: 'Kata Sandi Tidak Cocok', message: 'Konfirmasi kata sandi baru tidak sesuai.', type: 'error' })
    return
  }
  
  // success
  if (window.$toast) window.$toast({ title: 'Berhasil Diubah', message: 'Kata sandi Anda telah berhasil diperbarui.', type: 'success' })
  showPasswordModal.value = false
  passForm.value = { old: '', new: '', confirm: '' }
}

const handleLogout = () => {
  showLogoutModal.value = false
  if (window.$toast) window.$toast({ title: 'Berhasil Keluar', message: 'Anda telah keluar dari sesi saat ini.', type: 'success' })
}


const selectFilter = (filter) => {
  selectedFilter.value = filter
  isDropdownOpen.value = false
}

// Scroll Lock logic for Profile Sheet
watch(showProfileSheet, (val) => {
  if (typeof document !== 'undefined') {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
