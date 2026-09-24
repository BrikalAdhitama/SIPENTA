<template>
  <!-- Sidebar web — Figma "Dashboard admin - web" (node 113:2077) -->
  <aside class="sticky top-0 flex h-screen w-62.5 shrink-0 flex-col border-r border-[#ebebeb] bg-white pt-9 pb-13.5 shadow-[1px_0_0_#f8f8f8]">
    <NuxtLink to="/" class="ml-5.5 block w-fit">
      <LayoutAppLogo :height="50" />
    </NuxtLink>

    <nav class="mt-20.25 flex flex-col gap-1.5 px-10.25" aria-label="Menu utama">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex h-9.75 items-center gap-4.5 rounded-sm pl-2.75 font-lato text-sm font-bold transition-colors"
        :class="isActive(item.to) ? 'bg-primary-50 text-primary-600' : 'text-inactive hover:text-primary-600/70'"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <LayoutNavIcon :icon="item.icon" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="mt-auto px-5.25">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2.25">
          <!-- avatar: lingkaran kuning + siluet, dipotong lingkaran (sesuai Figma) -->
          <span class="relative size-8.75 shrink-0 overflow-hidden rounded-full">
            <img src="/icons/avatar-bg.svg" alt="" class="absolute inset-0 size-full" />
            <img src="/icons/avatar-person.svg" alt="" class="absolute -top-0.75 left-0 size-8.75 max-w-none" />
          </span>
          <div class="leading-normal">
            <p class="text-sm font-semibold text-heading">{{ user.nama }}</p>
            <p class="text-sm text-subtle">{{ user.roleLabel }}</p>
          </div>
        </div>
        <NuxtLink to="/admin/notifications" class="mt-1.5 shrink-0" aria-label="Notifikasi">
          <img src="/icons/bell.svg" alt="" class="size-6" />
        </NuxtLink>
      </div>

      <button
        type="button"
        class="mt-3.5 ml-0.75 flex items-center gap-3 text-base leading-normal font-medium text-danger hover:opacity-80"
        @click="logout"
      >
        <img src="/icons/logout.svg" alt="" class="size-6" />
        Log out
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavItem } from "~/utils/navigation";

defineProps<{ items: NavItem[] }>();

const route = useRoute();
const { user } = useCurrentUser();

const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`);

function logout() {
  // TODO: supabase.auth.signOut() setelah auth tersambung
  navigateTo("/login");
}
</script>
