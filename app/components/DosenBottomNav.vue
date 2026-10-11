<template>
  <!-- Dosen Floating Pill Bottom Navigation — identik gaya admin -->
  <nav class="mobile-bottom-nav md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[400px] bg-white border border-slate-100 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-2 z-50">
    <div class="flex items-center justify-between">
      <button
        v-for="item in menuItems"
        :key="item.name"
        @click="handleNavClick(item)"
        :class="[
          'transition-all duration-300 flex items-center justify-center relative',
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

        <!-- Badge merah (hanya muncul jika tidak aktif) -->
        <span
          v-if="item.badge && item.badge > 0 && activeMenu !== item.name"
          class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[8px] font-extrabold text-white"
          style="background:#ef4444;"
        >{{ item.badge }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const route  = useRoute()
const { badge } = useDosenSaya()

// State terpisah dari admin agar tidak bentrok
const activeMenu = useState('dosenActiveMenu', () => 'Dashboard')

const menuItems = computed(() => [
  {
    name: 'Dashboard',
    label: 'Home',
    route: '/dosen',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
  },
  {
    name: 'JadwalSeminar',
    label: 'Seminar',
    route: '/dosen/jadwal-seminar',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" stroke-linejoin="round"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"></path></svg>',
    badge: badge.value.jadwalSeminar,
  },
  {
    name: 'JadwalPribadi',
    label: 'Pribadi',
    route: '/dosen/jadwal-pribadi',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
  },
  {
    name: 'Konfirmasi',
    label: 'Konfirmasi',
    route: '/dosen/konfirmasi-jadwal',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    badge: badge.value.konfirmasi,
  },
])

const handleNavClick = (item: { name: string; route: string }) => {
  activeMenu.value = item.name
  if (item.route) router.push(item.route)
}

const syncActiveMenu = () => {
  const matched = menuItems.value.find(i =>
    i.route && (
      route.path === i.route ||
      (i.name !== 'Dashboard' && route.path.startsWith(i.route + '/'))
    )
  )
  if (matched) activeMenu.value = matched.name
}

syncActiveMenu()
watch(() => route.path, syncActiveMenu)
</script>