<template>
  <!-- Floating Pill Navigation -->
  <nav class="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[400px] bg-white border border-slate-100 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-2 z-50">
    <div class="flex items-center justify-between">
      <button 
        v-for="item in menuItems" 
        :key="item.name"
        @click="handleNavClick(item)"
        :class="[
          'transition-all duration-300 flex items-center justify-center relative overflow-hidden',
          activeMenu === item.name 
            ? 'gap-2 px-5 py-2.5 bg-[#C9E0FC] text-[#2D73FF] rounded-full' 
            : 'p-2.5 text-slate-400 hover:text-slate-800'
        ]"
      >
        <span 
          v-html="item.icon" 
          class="flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 [&>svg]:stroke-[2px] transition-transform duration-300"
          :class="activeMenu === item.name ? 'scale-110' : ''"
        ></span>
        
        <span 
          v-if="activeMenu === item.name" 
          class="font-semibold text-[13px] tracking-wide animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// Menggunakan state global dari Nuxt agar terhubung dengan Sidebar jika keduanya aktif di halaman
const activeMenu = useState('activeMenu', () => 'Dashboard')

const handleNavClick = (item) => {
  activeMenu.value = item.name
  if (item.route) {
    router.push(item.route)
  }
}

const menuItems = [
  {
    name: 'Dashboard',
    label: 'Home',
    route: '/admin/dashboard',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>'
  },
  {
    name: 'Mahasiswa',
    label: 'Mahasiswa',
    route: '/admin/mahasiswa',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
  },
  {
    name: 'Penjadwalan',
    label: 'Penjadwalan',
    route: '/admin/penjadwalan',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>'
  },
  {
    name: 'Jadwal',
    label: 'Jadwal',
    route: '/admin/jadwal',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
  },
  {
    name: 'Dosen',
    label: 'Dosen',
    route: '/admin/dosen',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
  },
  {
    name: 'Ruangan',
    label: 'Ruangan',
    route: '/admin/ruangan',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M5 21h14M15 11v2"></path></svg>'
  }
]

import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()

const syncActiveMenu = () => {
  const currentItem = menuItems.find(item => item.route && route.path.startsWith(item.route))
  if (currentItem) {
    activeMenu.value = currentItem.name
  }
}

// Sinkronisasi saat komponen dimuat
syncActiveMenu()

// Sinkronisasi setiap kali rute (URL) berubah
watch(() => route.path, syncActiveMenu)
</script>
