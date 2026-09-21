<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // TODO: Check actual user role here from auth state
  // For now, redirect everyone to the admin dashboard
  router.replace('/admin/dashboard')
})
</script>
