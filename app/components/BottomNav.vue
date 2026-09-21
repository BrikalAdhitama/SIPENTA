<template>
  <nav class="md:hidden fixed bottom-0 left-0 w-full bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-4 sm:px-6 pt-4 pb-8 z-50">
    <div class="flex items-center justify-between">
      <button 
        v-for="item in menuItems" 
        :key="item.name"
        @click="activeMenu = item.name"
        :class="[
          'transition-all duration-300 flex items-center justify-center',
          activeMenu === item.name 
            ? 'gap-2 px-4 py-2.5 bg-[#C9E0FC] text-[#2D73FF] rounded-full' 
            : 'p-2 text-gray-400 hover:text-gray-800'
        ]"
      >
        <span 
          v-html="item.icon" 
          class="flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 [&>svg]:stroke-2"
        ></span>
        <span v-if="activeMenu === item.name" class="font-semibold text-[14px] whitespace-nowrap">
          {{ item.label }}
        </span>
      </button>
    </div>
    
    <!-- iOS Home Indicator Area -->
    <div class="flex justify-center mt-6">
      <div class="w-1/3 h-1.5 bg-gray-300 rounded-full"></div>
    </div>
  </nav>
</template>

<script setup>
// Menggunakan state global dari Nuxt agar terhubung dengan Sidebar jika keduanya aktif di halaman
const activeMenu = useState('activeMenu', () => 'Dashboard')

const menuItems = [
  {
    name: 'Dashboard',
    label: 'Home',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>'
  },
  {
    name: 'Mahasiswa',
    label: 'Mahasiswa',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
  },
  {
    name: 'Penjadwalan',
    label: 'Penjadwalan',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>'
  },
  {
    name: 'Jadwal',
    label: 'Jadwal',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
  },
  {
    name: 'Dosen',
    label: 'Dosen',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
  },
  {
    name: 'Ruangan',
    label: 'Ruangan',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>'
  }
]
</script>
