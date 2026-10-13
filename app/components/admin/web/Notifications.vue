<template>
  <!-- Admin · Notifikasi (web). Versi mobile: AdminMobileNotificationsMobile. -->
  <div class="max-w-312.25 pt-9 pr-8 pb-14 pl-8 xl:pr-24">
    <UiPageHeader
      judul="Notifikasi"
      :subjudul="belumDibaca > 0 ? `Ada ${belumDibaca} pesan baru` : 'Semua notifikasi sudah dibaca'"
    >
      <UiButton v-if="belumDibaca > 0" variant="secondary" @click="tandaiSemua">Tandai semua dibaca</UiButton>
    </UiPageHeader>

    <div class="mt-7 max-w-3xl">
      <section v-for="g in berkelompok" :key="g.nama" class="mb-6">
        <h2 class="mb-2 text-xs font-semibold tracking-wide text-meta uppercase">{{ g.nama }}</h2>
        <ul class="overflow-hidden rounded-[14px] border border-line bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)]">
          <li v-for="n in g.item" :key="n.id" class="border-b border-line-soft last:border-b-0">
            <button
              type="button"
              class="relative flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-primary-50/60"
              :class="n.dibaca ? 'bg-white' : 'bg-primary-50'"
              @click="tandaiDibaca(n.id)"
            >
              <span v-if="!n.dibaca" class="absolute inset-y-0 left-0 w-1 bg-primary-500" aria-hidden="true" />
              <span class="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" :class="WARNA[n.warna]">{{ n.inisial }}</span>
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="text-sm" :class="n.dibaca ? 'font-medium text-title' : 'font-semibold text-title'">{{ n.judul }}</span>
                  <span v-if="!n.dibaca" class="size-2 rounded-full bg-primary-500" aria-label="Belum dibaca" />
                </span>
                <span class="mt-0.5 block text-[13px] leading-relaxed text-meta">{{ n.deskripsi }}</span>
                <span class="mt-2 flex items-center gap-3">
                  <UiJenisChip :jenis="n.jenis" />
                  <span class="text-xs text-meta">{{ n.waktu }}</span>
                </span>
              </span>
            </button>
          </li>
        </ul>
      </section>

      <p v-if="berkelompok.length === 0" class="rounded-[14px] border border-dashed border-line py-14 text-center text-sm text-meta">
        Belum ada notifikasi.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { belumDibaca, berkelompok, tandaiDibaca, tandaiSemua } = useAdminNotifications();

const WARNA = { success: "bg-success", warning: "bg-[#ff9800]", danger: "bg-danger" } as const;
</script>
