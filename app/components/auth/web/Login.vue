<template>
  <!-- Figma "Login (admin, dosen, mahasiswa)" (node 144:17375) -->
  <div class="grid min-h-screen grid-cols-2 bg-white font-inter">
    <!-- Kiri: form -->
    <div class="relative flex flex-col">
      <LayoutAppLogo :height="48" class="absolute top-13.75 left-14.75" />

      <div class="my-auto w-full max-w-180 pt-24 pr-10 pb-12 pl-24">
        <h1 class="text-5xl leading-none font-bold text-[#171923]">Selamat Datang</h1>
        <p class="mt-8.5 text-lg leading-normal text-[#718096]">Silahkan masuk untuk melanjutkan</p>

        <form class="mt-10 max-w-132" @submit.prevent="masuk">
          <label for="login-nim" class="block text-base leading-5 font-medium tracking-[-0.154px] text-[#718096]">NIM</label>
          <input
            id="login-nim"
            v-model="nim"
            type="text"
            inputmode="numeric"
            autocomplete="username"
            placeholder="11231099"
            required
            class="mt-3.5 h-13.75 w-full rounded-xl border border-[#cbd5e0] bg-[#f7fafc] px-3 text-base tracking-[-0.154px] text-[#4a5568] shadow-[inset_0_2px_0_0_rgba(231,235,238,0.2)] outline-none placeholder:text-[#a0aec0] focus:border-primary-900 focus:ring-2 focus:ring-primary-900/20"
          />

          <label for="login-password" class="mt-7.75 block text-base leading-5 font-medium tracking-[-0.154px] text-[#718096]">Password</label>
          <div
            class="mt-3.5 flex h-13.75 w-full items-center rounded-xl border border-[#cbd5e0] bg-[#f7fafc] shadow-[inset_0_2px_0_0_rgba(231,235,238,0.2)] focus-within:border-primary-900 focus-within:ring-2 focus-within:ring-primary-900/20"
          >
            <input
              id="login-password"
              v-model="password"
              :type="lihatPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              required
              class="h-full min-w-0 flex-1 rounded-xl bg-transparent px-3 text-base tracking-[-0.154px] text-[#4a5568] outline-none placeholder:text-[#a0aec0]"
            />
            <span class="h-10 w-px bg-[#cfd9e0]" aria-hidden="true" />
            <button
              type="button"
              class="flex h-full items-center pr-4 pl-3.25"
              :aria-label="lihatPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              :aria-pressed="lihatPassword"
              @click="lihatPassword = !lihatPassword"
            >
              <img src="/icons/eye.svg" alt="" class="size-6" :class="{ 'opacity-50': !lihatPassword }" />
            </button>
          </div>

          <div class="mt-10.25 flex items-center justify-between">
            <label class="flex cursor-pointer items-center gap-2 text-base text-[#718096]">
              <input v-model="ingatSaya" type="checkbox" class="size-4 rounded border-[#cbd5e0] accent-primary-900" />
              Remember me
            </label>
            <a href="#" class="text-base leading-normal font-medium text-[#1c4532] underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            class="mt-7.25 flex h-15 w-full items-center justify-center rounded-[20px] bg-primary-900 px-6 text-xl leading-7 font-semibold text-[#f7fafc] transition-transform hover:bg-primary-900/90 active:scale-[0.99]"
          >
            Login
          </button>
        </form>
      </div>
    </div>

    <!-- Kanan: foto kampus + overlay biru + lingkaran dekorasi -->
    <div class="relative overflow-hidden">
      <img src="/itk.jpeg" alt="" class="absolute inset-0 size-full object-cover object-[36%_50%]" />
      <img src="/images/login-overlay.svg" alt="" class="absolute inset-0 size-full" />
      <img
        src="/images/login-circle.svg"
        alt=""
        class="absolute -top-65.25 -right-84 h-[792.79px] w-[803.19px] max-w-none rotate-[26.84deg]"
      />
      <div class="absolute inset-x-0 top-[62.9%] flex flex-col items-center px-8 text-center">
        <p class="text-[40px] leading-none font-semibold text-[#f7fafc]">Atur jadwal tanpa ribet</p>
        <p class="mt-10 max-w-125 text-xl leading-[1.385] text-[#cfd9e0]">
          SIPENTA membantu menemukan jadwal yang sesuai dengan ketersediaan dosen, mahasiswa, dan ruangan.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const nim = ref("");
const password = ref("");
const lihatPassword = ref(false);
const ingatSaya = ref(false);

function masuk() {
  // TODO: login Supabase (signInWithPassword) + arahkan sesuai role dari tabel profiles
  navigateTo("/");
}
</script>
