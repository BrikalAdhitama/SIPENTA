<template>
  <!-- Mahasiswa Floating Pill Bottom Navigation -->
  <nav class="mobile-bottom-nav md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[400px] bg-white border border-slate-100 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-2 z-50">
    <div class="flex items-center justify-between">
      <button
        v-for="item in menuItems"
        :key="item.name"
        @click="handleNavClick(item)"
        :class="[
          'transition-all duration-300 flex items-center justify-center relative overflow-hidden',
          activeMenu === item.name
            ? 'gap-2 px-5 py-2.5 bg-[#C9E0FC] text-[#2D73FF] rounded-full'
            : 'p-2.5 text-slate-400 hover:text-slate-600'
        ]"
      >
        <span
          v-html="item.icon"
          class="flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 [&>svg]:stroke-[2px] transition-transform duration-300"
          :class="activeMenu === item.name ? 'scale-110' : ''"
        />
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

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const route = useRoute()

const activeMenu = useState('mahasiswaActiveMenu', () => 'Dashboard')

const menuItems = [
  {
    name: 'Dashboard',
    label: 'Home',
    route: '/mahasiswa/dashboard',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
  },
  {
    name: 'Jadwal',
    label: 'Jadwal',
    route: '/mahasiswa/jadwal',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
  },
  {
    name: 'Profil',
    label: 'Profil',
    route: '/mahasiswa/profil',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
  },
]

const handleNavClick = (item: { name: string; route: string }) => {
  activeMenu.value = item.name
  if (item.route) router.push(item.route)
}

const syncActiveMenu = () => {
  const matched = menuItems.find(i => i.route && route.path.startsWith(i.route))
  if (matched) activeMenu.value = matched.name
}

syncActiveMenu()
watch(() => route.path, syncActiveMenu)
</script>
