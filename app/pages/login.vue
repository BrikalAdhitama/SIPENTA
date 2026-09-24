<script setup lang="ts">
definePageMeta({ layout: "auth" });

const nomorInduk = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const error = ref("");

const { login, role } = useAuth();

async function handleSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await login(nomorInduk.value, password.value);
    await navigateTo(role.value ? `/${role.value}` : "/");
  } catch (e: any) {
    error.value = e?.message ?? "Gagal login";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
<<<<<<< Updated upstream
  <AuthMobileLogin v-if="isMobile" />
  <AuthWebLogin v-else />
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const { isMobile } = useLayoutMode();
</script>
=======
  <div class="min-h-screen flex bg-white">
    <!-- Kiri: form -->
    <div class="w-full lg:w-[50%] flex flex-col px-6 sm:px-12 lg:px-24 py-12">
      <div class="flex items-center mb-16">
        <img src="/images/logo-sipenta.png" alt="SIPENTA" class="h-20 w-auto object-contain" />
      </div>

      <div class="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
        <h1 class="font-display text-4xl lg:text-5xl font-semibold mb-2 text-zinc-700">Selamat Datang</h1>
        <p class="text-lg text-slate-400 mb-10">Silahkan masuk untuk melanjutkan</p>

        <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-base font-medium mb-2 text-slate-700">NIM</label>
            <input
              v-model="nomorInduk"
              type="text"
              inputmode="numeric"
              required
              placeholder="cth. 11231099"
              class="w-full px-5 py-4 rounded-xl border bg-slate-50 text-lg outline-none focus:border-primary focus:bg-white transition-colors"
              :class="error ? 'border-red-300' : 'border-slate-200'"
            />
          </div>

          <div>
            <label class="block text-base font-medium mb-2 text-slate-700">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-5 py-4 pr-14 rounded-xl border bg-slate-50 text-lg outline-none focus:border-primary focus:bg-white transition-colors"
                :class="error ? 'border-red-300' : 'border-slate-200'"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <p v-if="error" class="text-sm font-medium text-red-600 -mt-1">{{ error }}</p>

          <div class="flex items-center justify-between text-base -mt-1">
            <label class="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input v-model="rememberMe" type="checkbox" class="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
              Remember me
            </label>
            <a href="#" class="text-primary font-medium hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 rounded-xl text-white text-lg font-semibold transition-colors disabled:opacity-60 mt-1"
            style="background-color:#2196F3"
            @mouseover="($event.target as HTMLElement).style.backgroundColor = '#0D47A1'"
            @mouseleave="($event.target as HTMLElement).style.backgroundColor = '#2196F3'"
          >
            {{ loading ? "Masuk..." : "Login" }}
          </button>
        </form>
      </div>
    </div>

    <!-- Kanan: panel gambar itk -->
    <div class="hidden lg:block lg:w-[50%] p-3">
      <div class="relative w-full h-full overflow-hidden bg-slate-800">
        <div
          class="absolute inset-0 bg-cover bg-center"
          style="background-image: linear-gradient(to top, rgba(13,71,161,.75) 0%, rgba(13,71,161,.35) 45%, rgba(13,71,161,.1) 100%), url('/images/kampus-itk.jpg');"
        />
        <div class="relative h-full flex flex-col justify-end px-10 sm:px-14 pb-20 sm:pb-28">
          <h2 class="font-display text-4xl xl:text-5xl font-semibold text-white mb-4 max-w-xl">Atur jadwal tanpa ribet</h2>
          <p class="text-blue-100 text-lg max-w-lg">
            SIPENTA membantu menemukan jadwal yang sesuai dengan ketersediaan dosen, mahasiswa, dan ruangan.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
>>>>>>> Stashed changes
