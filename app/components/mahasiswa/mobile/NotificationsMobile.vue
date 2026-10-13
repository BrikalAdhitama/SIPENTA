<template>
  <div class="min-h-screen bg-white font-sans pb-10">
    <header class="mobile-safe-top sticky top-0 z-20 px-5 pb-4 border-b border-slate-100 bg-white/92 shadow-sm backdrop-blur-md">
      <div class="flex items-start gap-1">
        <button @click="router.back()" class="p-2 -ml-2 rounded-full text-slate-500 active:bg-slate-100" aria-label="Kembali">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" /></svg>
        </button>
        <div class="flex-1">
          <h1 class="text-[26px] font-extrabold leading-none tracking-tight text-[#0D47A1] mb-2">Notifikasi</h1>
          <div class="flex items-center justify-between gap-3">
            <p class="text-[13px] font-medium text-slate-500">Ada <span class="font-extrabold text-slate-800">{{ unreadCount }}</span> pesan baru</p>
            <button v-if="unreadCount" @click="markAllAsRead" class="rounded-full bg-[#E3F2FD] px-3 py-1.5 text-[11px] font-extrabold text-[#0D47A1] active:scale-95 transition-transform">Tandai semua</button>
          </div>
        </div>
      </div>
    </header>

    <main class="mt-4">
      <section v-for="groupName in Object.keys(groupedNotifications)" :key="groupName" class="mb-2">
        <h2 class="sticky top-[108px] z-10 px-5 py-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 bg-white/95 backdrop-blur">{{ groupName }}</h2>
        <TransitionGroup name="notification-list" tag="div">
          <button v-for="notification in groupedNotifications[groupName]" :key="notification.id" type="button" @click="markAsRead(notification)"
            class="relative flex w-full items-start gap-3.5 border-b border-slate-100 px-5 py-4 text-left transition-colors"
            :class="notification.isRead ? 'bg-white active:bg-slate-50' : 'bg-[#F4F9FF]'">
            <span v-if="!notification.isRead" class="absolute inset-y-0 left-0 w-[3px] bg-[#2196F3]" />
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white shadow-sm" :style="{ background: notification.iconBg }">{{ notification.icon }}</span>
            <span class="min-w-0 flex-1 pt-0.5">
              <span class="mb-1 flex items-center gap-2">
                <span class="text-[13px] leading-tight" :class="notification.isRead ? 'font-semibold text-slate-700' : 'font-extrabold text-slate-900'">{{ notification.title }}</span>
                <span v-if="!notification.isRead" class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#2196F3]" />
              </span>
              <span class="mt-0.5 line-clamp-2 text-[11px] leading-relaxed" :class="notification.isRead ? 'text-slate-400' : 'font-medium text-slate-600'">{{ notification.description }}</span>
            </span>
            <span class="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
              <span class="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider" :style="{ color: notification.tagColor, background: notification.tagBg }">{{ notification.tag }}</span>
              <span class="text-[10px] font-semibold text-slate-400">{{ notification.time }}</span>
            </span>
          </button>
        </TransitionGroup>
      </section>

      <div v-if="!notifications.length" class="flex flex-col items-center justify-center gap-3 py-20">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#E3F2FD] text-[#90CAF9]">
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3C7.7 6.2 6 8.4 6 11v3.2c0 .5-.2 1.1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" /></svg>
        </div>
        <p class="text-[13px] font-semibold text-slate-400">Belum ada notifikasi</p>
      </div>
    </main>

    <MahasiswaBottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const notifications = ref([
  { id: 1, title: 'Jadwal Sempro Dikonfirmasi', description: 'Jadwal Seminar Proposal Anda telah dikonfirmasi oleh dosen pembimbing.', time: '1 jam lalu', tag: 'Sempro', tagBg: '#E3F2FD', tagColor: '#0D47A1', icon: '✓', iconBg: '#2196F3', dateGroup: 'Hari Ini', isRead: false },
  { id: 2, title: 'Pengingat Jadwal Seminar', description: 'Seminar Hasil Anda akan berlangsung besok. Pastikan dokumen sudah siap.', time: '3 jam lalu', tag: 'Pengingat', tagBg: '#E8F5E9', tagColor: '#2E7D32', icon: '!', iconBg: '#43A047', dateGroup: 'Hari Ini', isRead: false },
  { id: 3, title: 'Jadwal Seminar Diperbarui', description: 'Informasi ruangan atau waktu seminar Anda telah diperbarui oleh admin.', time: 'Kemarin', tag: 'Jadwal', tagBg: '#E3F2FD', tagColor: '#0D47A1', icon: 'J', iconBg: '#0D47A1', dateGroup: 'Kemarin', isRead: true },
])

const unreadCount = computed(() => notifications.value.filter(item => !item.isRead).length)
const groupedNotifications = computed(() => {
  const groups: Record<string, typeof notifications.value> = {}
  notifications.value.forEach(item => { (groups[item.dateGroup] ??= []).push(item) })
  return groups
})
const markAsRead = (notification: { isRead: boolean }) => { notification.isRead = true }
const markAllAsRead = () => notifications.value.forEach(notification => { notification.isRead = true })
</script>

<style scoped>
.notification-list-enter-active,.notification-list-leave-active,.notification-list-move{transition:all .3s ease}
.notification-list-enter-from,.notification-list-leave-to{opacity:0;transform:translateX(-18px)}
</style>
