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
