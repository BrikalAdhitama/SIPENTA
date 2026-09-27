<template>
  <div class="fixed top-8 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 w-full max-w-[360px] px-4 pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="pointer-events-auto flex items-center p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-md border w-full"
        :class="{
          'bg-white/95 border-emerald-100': toast.type === 'success',
          'bg-white/95 border-red-100': toast.type === 'error',
          'bg-white/95 border-blue-100': toast.type === 'info'
        }"
      >
        <!-- Icon -->
        <div class="shrink-0 mr-3 w-9 h-9 rounded-full flex items-center justify-center"
          :class="{
            'bg-emerald-50 text-emerald-500': toast.type === 'success',
            'bg-red-50 text-red-500': toast.type === 'error',
            'bg-blue-50 text-blue-500': toast.type === 'info'
          }">
          <svg v-if="toast.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          <svg v-else-if="toast.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        
        <!-- Message -->
        <div class="flex flex-col gap-0.5">
          <h4 class="text-[13px] font-extrabold text-slate-800">{{ toast.title }}</h4>
          <p class="text-[11px] font-medium text-slate-500 leading-snug">{{ toast.message }}</p>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const toasts = useState('globalToasts', () => [])

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Ensure the composable exists for usage
const showToast = (toastParams) => {
  const id = Date.now().toString()
  toasts.value.push({
    id,
    title: toastParams.title,
    message: toastParams.message,
    type: toastParams.type || 'info'
  })
  
  setTimeout(() => {
    removeToast(id)
  }, toastParams.duration || 3000)
}

// Expose globally so components can trigger without passing props
if (typeof window !== 'undefined') {
  window.$toast = showToast
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
