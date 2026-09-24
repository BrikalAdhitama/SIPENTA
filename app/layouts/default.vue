<<<<<<< Updated upstream
<template>
  <!-- Web: sidebar + konten. Mobile: halaman mengatur tampilannya sendiri
       (komponen mobile sudah membawa BottomNav-nya). -->
  <div v-if="!isMobile" class="flex min-h-screen bg-white font-sans text-body">
    <LayoutAppSidebar :items="nav" />
    <main class="min-w-0 flex-1">
      <slot />
    </main>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { navForPath } from "~/utils/navigation";

const { isMobile } = useLayoutMode();
const route = useRoute();
const nav = computed(() => navForPath(route.path));
</script>
=======
<script setup lang="ts">
const sidebarOpen = ref(false);
const { profile } = useAuth();

const initials = computed(() =>
  (profile.value?.nama ?? "?")
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
);
</script>

<template>
  <div class="flex min-h-screen bg-white">
    <!-- Desktop sidebar -->
    <aside class="hidden md:flex flex-col w-72 min-h-screen shrink-0 sticky top-0 h-screen">
      <LayoutAppSidebar />
    </aside>

    <!-- Mobile sidebar drawer -->
    <div v-if="sidebarOpen" class="md:hidden fixed inset-0 z-40 flex">
      <div class="absolute inset-0 bg-black/50" @click="sidebarOpen = false" />
      <div class="relative w-72 max-w-[85vw] h-full flex flex-col z-50 shadow-2xl">
        <LayoutAppSidebar mobile @navigate="sidebarOpen = false" />
      </div>
    </div>

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile top bar -->
      <header class="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
        <button class="p-1.5 rounded-lg -ml-1 text-slate-700" @click="sidebarOpen = true">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="font-display font-semibold text-sm truncate flex-1">SIPENTA</span>
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 bg-primary">
          {{ initials }}
        </div>
      </header>

      <main class="flex-1 overflow-auto">
        <div class="p-4 sm:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
>>>>>>> Stashed changes
