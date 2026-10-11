<template>
  <div class="min-h-screen font-sans pb-10" style="background:#ffffff;">

    <!-- Header -->
    <header class="mobile-safe-top px-5 pb-4 sticky top-0 z-20"
            style="background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #f1f5f9;box-shadow:0 1px 8px rgba(0,0,0,0.04);">
      <div class="flex items-start gap-1">
        <button @click="router.back()" class="p-2 -ml-2 -mt-0.5 rounded-full transition-colors active:bg-slate-100 inline-flex items-center justify-center shrink-0" style="color:#64748b;">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex flex-col flex-1">
          <h1 class="text-[26px] font-extrabold tracking-tight leading-none mb-2" style="color:#0d47a1;">Notifikasi</h1>
          <div class="flex justify-between items-center">
            <p class="text-[13px] font-medium" style="color:#64748b;">
              Ada <span class="font-extrabold" style="color:#0f172a;">{{ unreadCount }}</span> pesan baru
            </p>
            <button v-if="unreadCount>0" @click="markAllAsRead"
              class="text-[11px] font-extrabold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              style="background:#dbeafe;color:#1565C0;">
              Tandai semua
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- List -->
    <main class="mt-4">
      <div v-for="groupName in Object.keys(groupedNotifications)" :key="groupName" class="mb-2">
        <h2 class="text-[11px] font-extrabold uppercase tracking-widest px-5 py-2 sticky top-[108px] z-10"
            style="background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);color:#94a3b8;">{{ groupName }}</h2>

        <div class="flex flex-col">
          <TransitionGroup name="list">
            <div v-for="notif in groupedNotifications[groupName]" :key="notif.id"
                 @click="markAsRead(notif)"
                 class="px-5 py-4 flex items-start gap-3.5 cursor-pointer border-b relative overflow-hidden transition-all duration-200"
                 :class="!notif.isRead?'bg-[#f4f9ff]':'bg-white active:bg-slate-50'"
                 style="border-color:#f1f5f9;">
              <!-- left bar unread -->
              <div v-if="!notif.isRead" class="absolute left-0 top-0 bottom-0 w-[3px]" style="background:#1565C0;"/>
              <!-- icon/avatar -->
              <div class="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-extrabold text-[13px] shadow-sm"
                   :style="{backgroundColor:notif.iconBg}">{{ notif.icon }}</div>
              <!-- text -->
              <div class="flex-1 min-w-0 pt-0.5">
                <div class="flex items-center gap-2 mb-0.5">
                  <h3 class="text-[13px] leading-tight transition-colors"
                      :class="!notif.isRead?'font-extrabold text-slate-900':'font-semibold text-slate-700'">{{ notif.title }}</h3>
                  <span v-if="!notif.isRead" class="w-2 h-2 rounded-full shrink-0 animate-pulse" style="background:#1565C0;"/>
                </div>
                <p class="text-[11px] line-clamp-2 leading-relaxed mt-0.5"
                   :class="!notif.isRead?'text-slate-600 font-medium':'text-slate-400'">{{ notif.description }}</p>
              </div>
              <!-- right meta -->
              <div class="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider"
                      :style="{color:notif.tagColor,backgroundColor:notif.tagBg}">{{ notif.tag }}</span>
                <span class="text-[10px] font-semibold" style="color:#94a3b8;">{{ notif.time }}</span>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="notifications.length===0" class="flex flex-col items-center justify-center py-20 gap-3">
        <div class="w-16 h-16 rounded-full flex items-center justify-center" style="background:#f1f5f9;">
          <svg class="w-8 h-8" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </div>
        <p class="text-[13px] font-semibold" style="color:#94a3b8;">Belum ada notifikasi</p>
      </div>
    </main>

    <DosenBottomNav/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const notifications = ref([
  {
    id: 1,
    title: 'Konfirmasi Jadwal Diperlukan',
    description: 'Ahmad Fauzan mengajukan jadwal Sempro pada 4 Sep 2026 pukul 09.00 di ruang B201. Silakan konfirmasi.',
    time: '30 menit lalu',
    tag: 'Sempro',
    tagBg: '#fff0f5',
    tagColor: '#e91e8c',
    icon: 'AF',
    iconBg: '#ec4899',
    dateGroup: 'Hari Ini',
    isRead: false
  },
  {
    id: 2,
    title: 'Jadwal Semhas Dikonfirmasi',
    description: 'Jadwal Semhas Nadia Ramadhani pada 5 Sep 2026 telah dikonfirmasi oleh semua penguji.',
    time: '2 jam lalu',
    tag: 'Semhas',
    tagBg: '#eff3ff',
    tagColor: '#1d4ed8',
    icon: 'NR',
    iconBg: '#396aff',
    dateGroup: 'Hari Ini',
    isRead: false
  },
  {
    id: 3,
    title: 'Pengingat: Sempro Besok',
    description: 'Anda memiliki 1 jadwal Sempro besok pukul 09.00 di ruang B201 sebagai Pembimbing 1.',
    time: '5 jam lalu',
    tag: 'Pengingat',
    tagBg: '#f0fdf4',
    tagColor: '#15803d',
    icon: '!',
    iconBg: '#22c55e',
    dateGroup: 'Hari Ini',
    isRead: true
  },
  {
    id: 4,
    title: 'Jadwal Sempro Diubah',
    description: 'Admin mengubah ruangan Sempro Budi Santoso dari B201 ke B203 pada 3 Sep 2026.',
    time: 'Kemarin',
    tag: 'Sempro',
    tagBg: '#fff0f5',
    tagColor: '#e91e8c',
    icon: 'BS',
    iconBg: '#f43f5e',
    dateGroup: 'Kemarin',
    isRead: true
  },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
const groupedNotifications = computed(() => {
  const g: Record<string, typeof notifications.value> = {}
  notifications.value.forEach(n => { (g[n.dateGroup] ??= []).push(n) })
  return g
})
const markAsRead = (n: { isRead: boolean }) => { n.isRead = true }
const markAllAsRead = () => notifications.value.forEach(n => n.isRead = true)
</script>

<style scoped>
.list-enter-active,.list-leave-active,.list-move { transition: all 0.3s ease; }
.list-enter-from,.list-leave-to { opacity: 0; transform: translateX(-20px); }
</style>