<<<<<<< Updated upstream
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
=======
<script setup lang="ts">
import type { Role } from "~/types/domain";

defineProps<{ mobile?: boolean }>();
const emit = defineEmits<{ navigate: [] }>();

const route = useRoute();
const { profile, role, logout } = useAuth();

type Nav = { label: string; to: string; icon: string; badge?: number };
const navByRole: Record<Role, Nav[]> = {
  admin: [
    { label: "Dashboard", to: "/admin", icon: "dashboard" },
    { label: "Penjadwalan", to: "/admin/seminar/upload", icon: "plus" },
    { label: "Mahasiswa", to: "/admin/master/mahasiswa", icon: "users" },
    { label: "Jadwal", to: "/admin/jadwal", icon: "calendar" },
    { label: "Dosen", to: "/admin/master/dosen", icon: "user" },
    { label: "Ruangan", to: "/admin/master/ruangan", icon: "building" },
  ],
  dosen: [
    { label: "Dashboard", to: "/dosen", icon: "dashboard" },
    { label: "Jadwal Seminar", to: "/dosen/seminar-saya", icon: "calendar", badge: 2 },
    { label: "Jadwal Pribadi", to: "/dosen/blokir-waktu", icon: "clipboard" },
    { label: "Konfirmasi Jadwal", to: "/dosen/approve", icon: "calendar", badge: 2 },
  ],
  mahasiswa: [
    { label: "Dashboard", to: "/mahasiswa", icon: "dashboard" },
    { label: "Jadwal Saya", to: "/mahasiswa/jadwal", icon: "calendar" },
    { label: "Profil Saya", to: "/mahasiswa/profil", icon: "user" },
  ],
};
const items = computed(() => navByRole[role.value ?? "admin"] ?? []);
const roleLabel = computed(() => ({ admin: "Admin account", dosen: "Dosen account", mahasiswa: "Mahasiswa account" }[role.value ?? "admin"]));
const firstName = computed(() => (profile.value?.nama ?? "").split(" ")[0]);

const ROOTS = ["/admin", "/dosen", "/mahasiswa"];
const isActive = (to: string) => route.path === to || (!ROOTS.includes(to) && route.path.startsWith(to + "/"));
</script>

<template>
  <div class="flex flex-col h-full bg-white border-r border-slate-200/70">
    <div class="px-8 pt-8 pb-10">
      <img src="/images/logo-sipenta.png" alt="SIPENTA" class="h-12 w-auto" />
    </div>

    <nav class="flex-1 px-6 flex flex-col gap-3 overflow-y-auto">
      <NuxtLink
        v-for="item in items" :key="item.to" :to="item.to" @click="emit('navigate')"
        class="flex items-center gap-5 px-5 py-3.5 rounded-lg text-[0.9375rem] font-medium transition-colors"
        :class="isActive(item.to) ? 'bg-primary-lightest text-[#1976D2]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'"
      >
        <UiIcon :name="item.icon" :size="24" />
        <span class="flex-1">{{ item.label }}</span>
        <span v-if="item.badge" class="min-w-6 h-6 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">{{ item.badge }}</span>
      </NuxtLink>
    </nav>

    <div class="px-6 pb-8 pt-4">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-11 h-11 rounded-full bg-amber-400 flex items-end justify-center overflow-hidden shrink-0" :title="profile?.nama">
          <svg viewBox="0 0 24 24" class="w-8 h-8" aria-hidden="true"><circle cx="12" cy="8" r="4.2" fill="#fff" /><path d="M3 24c0-5 4-8 9-8s9 3 9 8z" fill="#0284C7" /></svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-slate-700 truncate">{{ firstName }}</div>
          <div class="text-sm text-slate-400 truncate">{{ roleLabel }}</div>
        </div>
        <button class="relative text-slate-300 hover:text-slate-500" aria-label="Notifikasi">
          <UiIcon name="bell" :size="22" />
          <span class="absolute -top-0.5 right-0 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white" />
        </button>
      </div>
      <button class="flex items-center gap-4 px-2 text-[0.9375rem] font-medium text-red-500 hover:text-red-600" @click="logout">
        <UiIcon name="logout" :size="24" /> Log out
      </button>
    </div>
  </div>
</template>
>>>>>>> Stashed changes
