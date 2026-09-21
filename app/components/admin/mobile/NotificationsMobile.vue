<template>
  <div class="min-h-screen bg-white font-sans pb-10">
    
    <!-- Header -->
    <header class="px-6 pb-4 pt-10 sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-slate-100 shadow-sm">
      <div class="flex items-start gap-1">
        
        <!-- Back Button -->
        <button @click="router.back()" class="p-2 -ml-2 -mt-0.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 active:bg-slate-200 inline-flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <!-- Title & Subtitle Block -->
        <div class="flex flex-col flex-1">
          <h1 class="text-3xl font-extrabold text-primary-900 tracking-tight leading-none mb-2">Notifikasi</h1>
          
          <div class="flex justify-between items-center">
            <p class="text-slate-500 text-[13px] font-medium">
              Ada <span class="font-bold text-slate-800">{{ unreadCount }}</span> pesan baru
            </p>
            <button 
              v-if="unreadCount > 0"
              @click="markAllAsRead" 
              class="text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full text-[11px] font-extrabold hover:bg-primary-100 transition-colors active:scale-95 shrink-0"
            >
              Tandai semua
            </button>
          </div>
        </div>

      </div>
    </header>

    <!-- Notification List -->
    <main class="mt-4">
      <div v-for="groupName in Object.keys(groupedNotifications)" :key="groupName" class="mb-2">
        
        <!-- Divider / Group Name -->
        <h2 class="text-slate-400 text-xs font-bold px-6 py-2 sticky top-[108px] bg-white/95 backdrop-blur z-10">{{ groupName }}</h2>

        <!-- Group Items -->
        <div class="flex flex-col">
          <TransitionGroup name="list">
            <div 
              v-for="notif in groupedNotifications[groupName]" 
              :key="notif.id"
              @click="markAsRead(notif)"
              class="px-6 py-4 flex items-start gap-4 transition-all duration-300 cursor-pointer border-b border-slate-100/70 relative overflow-hidden"
              :class="[
                !notif.isRead ? 'bg-[#F4F9FF]' : 'bg-white hover:bg-slate-50 active:bg-slate-100'
              ]"
            >
              <!-- Unread Highlight Bar -->
              <div v-if="!notif.isRead" class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>

              <!-- Icon/Avatar -->
              <div 
                class="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[15px] shadow-sm"
                :style="{ backgroundColor: notif.iconBg }"
              >
                {{ notif.icon }}
              </div>
              
              <!-- Text Content -->
              <div class="flex-1 min-w-0 pt-0.5">
                <div class="flex items-center gap-2 mb-1">
                  <h3 
                    class="text-[14px] leading-tight transition-colors" 
                    :class="!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'"
                  >
                    {{ notif.title }}
                  </h3>
                  <!-- Unread Dot -->
                  <span v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary-500 shrink-0 shadow-sm animate-pulse"></span>
                </div>
                <p 
                  class="text-[12px] line-clamp-2 leading-relaxed transition-colors mt-1" 
                  :class="!notif.isRead ? 'text-slate-600 font-medium' : 'text-slate-400 font-normal'"
                >
                  {{ notif.description }}
                </p>
              </div>

              <!-- Tag and Time -->
              <div class="flex flex-col items-end gap-2 shrink-0 pt-0.5">
                <!-- Inline styled Tag -->
                <span 
                  class="px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase"
                  :style="{ color: notif.tagColor, backgroundColor: notif.tagBg }"
                >
                  {{ notif.tag }}
                </span>
                <span class="text-[10px] text-slate-400 font-semibold">{{ notif.time }}</span>
              </div>

            </div>
          </TransitionGroup>
        </div>

      </div>
      
      <!-- Empty State -->
      <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-20 opacity-50">
        <svg class="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        <p class="text-slate-500 font-medium">Belum ada notifikasi.</p>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Data Notifikasi (Hanya Sempro dan Semhas sesuai instruksi)
const notifications = ref([
  {
    id: 1,
    title: 'Jadwal Sempro Disetujui',
    description: 'Dosen A telah menyetujui jadwal Andi Pratama untuk Seminar Proposal.',
    time: '1 jam lalu',
    tag: 'Sempro',
    tagBg: '#E8F5E9',   // Light Green
    tagColor: '#2E7D32', // Dark Green
    icon: 'AP',
    iconBg: '#4CAF50',   // Green
    dateGroup: 'Hari Ini',
    isRead: false
  },
  {
    id: 2,
    title: 'Pengajuan Jadwal Baru',
    description: 'Budi Darmawan mengajukan jadwal Seminar Hasil.',
    time: '2 jam lalu',
    tag: 'Semhas',
    tagBg: '#FFF3E0',   // Light Orange
    tagColor: '#E65100', // Dark Orange
    icon: 'BD',
    iconBg: '#FF9800',   // Orange
    dateGroup: 'Hari Ini',
    isRead: false
  },
  {
    id: 3,
    title: 'Jadwal Semhas Ditolak',
    description: 'Dosen B menolak usulan jadwal Siti Aminah karena bentrok.',
    time: 'Kemarin',
    tag: 'Semhas',
    tagBg: '#FFF3E0',   // Light Orange
    tagColor: '#E65100', // Dark Orange
    icon: 'SA',
    iconBg: '#EF5350',   // Red
    dateGroup: 'Kemarin',
    isRead: true
  },
  {
    id: 4,
    title: 'Revisi Jadwal Sempro',
    description: 'Reza Pahlevi meminta perubahan jam seminar menjadi 14:00 WITA.',
    time: 'Kemarin',
    tag: 'Sempro',
    tagBg: '#E8F5E9',   // Light Green
    tagColor: '#2E7D32', // Dark Green
    icon: 'RP',
    iconBg: '#4CAF50',   // Green
    dateGroup: 'Kemarin',
    isRead: true
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length
})

const groupedNotifications = computed(() => {
  const groups = {}
  notifications.value.forEach(notif => {
    if (!groups[notif.dateGroup]) {
      groups[notif.dateGroup] = []
    }
    groups[notif.dateGroup].push(notif)
  })
  return groups
})

const markAsRead = (notif) => {
  if (!notif.isRead) {
    notif.isRead = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notif => {
    notif.isRead = true
  })
}
</script>

<style scoped>
/* Animations */
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.bounce-enter-active {
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
