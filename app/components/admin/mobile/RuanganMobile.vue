<template>
  <div class="min-h-screen font-sans pb-24 relative" style="background-color: #ffffff;">
    
    <!-- Header -->
    <div class="px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-5 flex justify-between items-start">
      <div class="flex flex-col gap-1.5 w-full">
        <h1 class="text-[26px] font-extrabold tracking-tight leading-none" style="color: #0F172A;">Manajemen<br>Ruangan</h1>
        <p class="text-[12px] font-medium leading-snug" style="color: #64748B; max-width: 85%;">Kelola daftar ruangan untuk penjadwalan seminar.</p>
      </div>
      <button @click="showAddModal = true" class="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm" style="background-color: #0F3B8C; color: #ffffff;">
        <svg style="width: 22px; height: 22px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </div>

    <!-- Summary Cards Grid -->
    <div class="grid grid-cols-2 gap-3 px-6 mb-7">
      <!-- Card 1 (Total Ruangan) -->
      <div class="rounded-[24px] p-4 flex flex-col justify-between relative overflow-hidden shadow-[0_8px_20px_rgba(15,59,140,0.15)] transition-transform active:scale-95" style="background: linear-gradient(135deg, #0F3B8C 0%, #1E40AF 100%); height: 130px;">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full border-[18px] border-white/5 pointer-events-none"></div>
        <div class="absolute -left-4 -bottom-4 w-20 h-20 rounded-full border-[10px] border-white/5 pointer-events-none"></div>
        <div class="flex justify-between items-start w-full z-10">
          <div class="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md" style="background-color: rgba(255,255,255,0.15);">
            <svg style="width: 20px; height: 20px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
          </div>
        </div>
        <div class="flex flex-col gap-0.5 z-10">
          <h3 class="font-extrabold text-white text-[28px] leading-none tracking-tight">7</h3>
          <p class="font-medium text-[11px] tracking-wide" style="color: rgba(255,255,255,0.75);">Total Ruangan</p>
        </div>
      </div>
      
      <!-- Card 2 (Seminar Aktif) -->
      <div class="rounded-[24px] p-4 flex flex-col justify-between relative overflow-hidden shadow-[0_8px_20px_rgba(15,59,140,0.15)] transition-transform active:scale-95" style="background: linear-gradient(135deg, #0F3B8C 0%, #1E40AF 100%); height: 130px;">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full border-[18px] border-white/5 pointer-events-none"></div>
        <div class="absolute -left-4 -bottom-4 w-20 h-20 rounded-full border-[10px] border-white/5 pointer-events-none"></div>
        <div class="flex justify-between items-start w-full z-10">
          <div class="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md" style="background-color: rgba(255,255,255,0.15);">
            <svg style="width: 20px; height: 20px; color: #ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        </div>
        <div class="flex flex-col gap-0.5 z-10">
          <h3 class="font-extrabold text-white text-[28px] leading-none tracking-tight">5</h3>
          <p class="font-medium text-[11px] tracking-wide" style="color: rgba(255,255,255,0.75);">Seminar Aktif</p>
        </div>
      </div>
    </div>

    <!-- Ruangan List Header -->
    <div class="px-6 flex justify-between items-end mb-4 mt-2">
      <h2 class="text-[17px] font-extrabold text-slate-800">Daftar Ruangan</h2>
      <span class="text-[11px] font-extrabold text-[#1976D2] bg-[#F0F6FF] px-2.5 py-1 rounded-lg">7 Ruangan</span>
    </div>

    <!-- Ruangan List Grid -->
    <div class="px-6 grid grid-cols-2 gap-4">
      <div v-for="n in 4" :key="n" class="rounded-[20px] p-4 flex flex-col relative bg-[#F0F6FF] border border-[#D3E3FD] h-[135px]">
        <div class="flex justify-between items-start mb-3">
          <div class="w-11 h-11 rounded-[12px] flex items-center justify-center" style="background-color: #0F3B8C; color: #ffffff;">
            <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M5 21h14M15 11v2"></path></svg>
          </div>
          <!-- Menu Dot Button -->
          <div class="relative dropdown-container">
            <button @click.stop="toggleMenu(n)" class="w-8 h-8 rounded-full flex items-center justify-center text-[#1976D2] active:bg-blue-100 transition-colors">
              <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="activeMenu === n" class="absolute top-8 right-0 bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-slate-100 py-2 w-[110px] z-10 animate-zoom-in">
              <button @click.stop="openEdit(); activeMenu = null" class="w-full px-4 py-2 text-left flex items-center gap-2.5 text-[12.5px] text-slate-700 hover:bg-slate-50 transition-colors font-semibold">
                <svg style="width: 14px; height: 14px; color: #1976D2;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Edit
              </button>
              <button @click.stop="openDelete(); activeMenu = null" class="w-full px-4 py-2 text-left flex items-center gap-2.5 text-[12.5px] text-slate-700 hover:bg-slate-50 transition-colors font-semibold">
                <svg style="width: 14px; height: 14px; color: #DC2626;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Hapus
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col gap-1 mb-3">
          <h3 class="font-extrabold text-[15.5px]" style="color: #0F3B8C;">Ruang F101</h3>
          <p class="font-medium text-[11px]" style="color: #64748B;">Lantai 1 · Gedung F</p>
        </div>
        
        <div class="w-full h-[1.5px] mt-auto" style="background-color: #BBDEFB;"></div>
      </div>
    </div>

    <!-- Modals -->

    <!-- Modal Tambah / Edit Ruangan -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity" @click.self="closeModals">
      <div class="bg-white w-full rounded-t-[24px] p-6 pb-8 animate-zoom-in shadow-2xl relative" style="max-height: 90vh; overflow-y: auto;">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
        <div class="flex justify-between items-start mb-6">
          <div class="flex gap-3 items-center">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: #E3F2FD; color: #1976D2;">
              <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <div>
              <h2 class="text-[17px] font-extrabold text-slate-800 mb-0.5">{{ showEditModal ? 'Edit Ruangan' : 'Tambah Ruangan' }}</h2>
              <p class="text-[11.5px] font-medium text-slate-500">Lengkapi informasi data ruangan</p>
            </div>
          </div>
          <button @click="closeModals" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-95 transition-transform">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-[12px] font-bold text-slate-600 mb-2">Nama Ruangan *</label>
            <input type="text" :placeholder="showEditModal ? 'Ruang F101' : 'cth. Ruang F101'" :value="showEditModal ? 'Ruang F101' : ''" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[12px] font-bold text-slate-600 mb-2">Lantai *</label>
              <input type="text" :placeholder="showEditModal ? '1' : '1'" :value="showEditModal ? '1' : ''" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label class="block text-[12px] font-bold text-slate-600 mb-2">Gedung *</label>
              <input type="text" :placeholder="showEditModal ? 'F' : 'F'" :value="showEditModal ? 'F' : ''" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button @click="closeModals" class="w-1/3 py-3.5 rounded-xl text-[13px] font-extrabold text-slate-600 bg-slate-100 active:scale-95 transition-transform">
            Batal
          </button>
          <button @click="closeModals" class="flex-1 py-3.5 rounded-xl text-[13px] font-extrabold text-white bg-[#2196F3] shadow-[0_4px_12px_rgba(33,150,243,0.3)] active:scale-95 transition-transform">
            {{ showEditModal ? 'Simpan Perubahan' : 'Tambah Ruangan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Hapus -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 transition-opacity" @click.self="closeModals">
      <div class="bg-white w-full rounded-[24px] p-6 pb-7 animate-zoom-in shadow-2xl flex flex-col items-center text-center relative">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-5 mt-2" style="background-color: #FEF2F2; color: #DC2626;">
          <svg style="width: 28px; height: 28px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </div>
        <h2 class="text-[18px] font-extrabold text-slate-800 mb-2">Hapus Ruangan?</h2>
        <p class="text-[13px] font-medium text-slate-500 mb-7 leading-relaxed">
          Data ruangan akan dihapus permanent.
        </p>
        <div class="flex w-full gap-3">
          <button @click="closeModals" class="flex-1 py-3.5 rounded-xl text-[13px] font-extrabold text-slate-600 bg-slate-50 active:scale-95 transition-transform border border-slate-200">
            Batal
          </button>
          <button @click="closeModals" class="flex-1 py-3.5 rounded-xl text-[13px] font-extrabold text-white bg-[#EF4444] shadow-[0_4px_12px_rgba(239,68,68,0.25)] active:scale-95 transition-transform">
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import BottomNav from '~/components/BottomNav.vue'

const activeMenu = ref(null)

const toggleMenu = (n) => {
  if (activeMenu.value === n) {
    activeMenu.value = null
  } else {
    activeMenu.value = n
  }
}

// Modal states
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const openEdit = () => {
  showEditModal.value = true
}

const openDelete = () => {
  showDeleteModal.value = true
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
}

// Scroll Lock logic
watch([showAddModal, showEditModal, showDeleteModal], (newValues) => {
  if (typeof document !== 'undefined') {
    if (newValues.some(v => v)) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Click outside menu listener
const closeMenuListener = (e) => {
  if (activeMenu.value !== null && !e.target.closest('.dropdown-container')) {
    activeMenu.value = null
  }
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', closeMenuListener)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.removeEventListener('click', closeMenuListener)
  }
})
</script>

<style scoped>
@keyframes zoomIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-zoom-in {
  animation: zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
