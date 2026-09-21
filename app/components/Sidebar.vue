<template>
  <aside class="w-72 h-screen bg-white rounded-l-[40px] flex flex-col px-6 py-10 shadow-[0_0_40px_rgba(0,0,0,0.05)] border-r border-gray-100">
    
    <!-- Header / Logo -->
    <div class="flex items-center gap-3 mb-10 px-2">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D73FF] to-[#1A56DB] flex items-center justify-center text-white shadow-md relative overflow-hidden shrink-0">
        <svg class="w-5 h-5 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <div class="absolute bottom-1 right-1 bg-white rounded-full p-[2px]">
           <svg class="w-2.5 h-2.5 text-[#1A56DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
           </svg>
        </div>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight text-[#1447b8] lowercase">sipenta</h1>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1">
      <button 
        v-for="item in menuItems" 
        :key="item.name"
        @click="activeMenu = item.name"
        :class="[
          'w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors',
          activeMenu === item.name 
            ? 'bg-[#f0f5ff] text-[#2D73FF] font-semibold' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        ]"
      >
        <span 
          v-html="item.icon" 
          class="flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 [&>svg]:stroke-2"
        ></span>
        {{ item.name }}
      </button>
    </nav>

    <!-- Footer Profile & Logout -->
    <div class="mt-auto pt-6 flex flex-col gap-6">
      <div class="flex items-center justify-between px-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#FFB82E] flex items-center justify-center text-white overflow-hidden shadow-sm shrink-0">
            <svg class="w-8 h-8 mt-3 text-yellow-100" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="flex flex-col text-left">
            <span class="text-[15px] font-bold text-gray-800 leading-tight">Andrew</span>
            <span class="text-[13px] text-gray-400 font-medium">Admin account</span>
          </div>
        </div>
        
        <button class="relative p-1 text-gray-300 hover:text-gray-500 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
          </svg>
          <span class="absolute top-[3px] right-[4px] w-2.5 h-2.5 bg-[#FF4747] rounded-full border-2 border-white"></span>
        </button>
      </div>

      <button class="flex items-center gap-3 px-2 py-2 text-[#FF4747] hover:bg-red-50 rounded-lg transition-colors font-semibold text-sm">
        <svg class="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Log out
      </button>
    </div>
  </aside>
</template>

<script setup>
// Menggunakan state global yang sama dengan BottomNav
const activeMenu = useState('activeMenu', () => 'Dashboard')

const menuItems = [
  {
    name: 'Dashboard',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>'
  },
  {
    name: 'Penjadwalan',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>'
  },
  {
    name: 'Mahasiswa',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
  },
  {
    name: 'Jadwal',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
  },
  {
    name: 'Dosen',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
  },
  {
    name: 'Ruangan',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>'
  }
]
</script>
