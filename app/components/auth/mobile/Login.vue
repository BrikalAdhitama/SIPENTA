<template>
  <div class="min-h-screen bg-white relative overflow-hidden flex flex-col justify-center px-8">
    
    <!-- Abstract Background Decor - Top Left -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 z-0"></div>
    <div class="absolute top-0 -left-10 w-72 h-72 border border-primary-200/30 rounded-full z-0"></div>

    <!-- Abstract Background Decor - Bottom Left -->
    <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 z-0"></div>
    <!-- Simple geometric lines simulation using CSS -->
    <div class="absolute bottom-10 -left-10 w-48 h-px bg-primary-200/40 rotate-45 z-0"></div>
    <div class="absolute bottom-20 -left-5 w-64 h-px bg-primary-200/40 rotate-[35deg] z-0"></div>


    <!-- Main Content -->
    <div class="z-10 w-full max-w-md mx-auto flex flex-col pt-10">
      
      <!-- Headings -->
      <h1 class="text-4xl font-extrabold text-primary-900 text-center mb-4">
        Selamat Datang
      </h1>
      <p class="text-xl font-bold text-slate-800 text-center mb-12 leading-snug">
        Welcome back you've <br> been missed!
      </p>

      <!-- Form Inputs -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
        
        <!-- Email Input -->
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            class="w-full bg-primary-100 border-2 border-primary-900 text-slate-800 placeholder-slate-500 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Password" 
            class="w-full bg-primary-100 border-2 border-transparent text-slate-800 placeholder-slate-500 rounded-xl px-5 py-4 focus:outline-none focus:border-primary-200 transition-all font-medium pr-12"
            required
          />
          <!-- Eye Icon Toggle -->
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-900 focus:outline-none"
          >
            <!-- Eye Slash SVG (Hidden) -->
            <svg v-if="!showPassword" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
            </svg>
            <!-- Eye SVG (Visible) -->
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
        </div>

        <!-- Forgot Password -->
        <div class="flex justify-end mt-1">
          <a href="#" class="text-primary-900 font-bold text-sm hover:underline">
            Forgot your password?
          </a>
        </div>

        <!-- Login Button -->
        <button 
          type="submit" 
          class="w-full bg-primary-900 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform transform active:scale-95 mt-6 text-lg"
        >
          Login
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)

const handleLogin = () => {
  // TODO: Implement actual login logic here
  // For now, redirect to the dashboard
  router.push('/')
}
</script>
