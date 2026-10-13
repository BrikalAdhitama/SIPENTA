<template>
  <!-- Admin · Jadwal (web) — Figma: daftar kartu → detail (?id=) → popup persetujuan 4 dosen. Versi mobile: AdminMobileJadwalMobile. -->
  <div class="pt-8 pr-10 pb-14 pl-9">
    <!-- ═══════ DETAIL ═══════ -->
    <template v-if="run">
      <NuxtLink to="/admin/jadwal" class="inline-flex items-center gap-2 text-[17px] text-[#334155] hover:text-primary-900">
        <UiIcon nama="arrow-left" class="size-4.5" /> Semua Jadwal
      </NuxtLink>
      <h1 class="mt-7 text-[32px] leading-10 font-bold text-[#0f172a]">Jadwal {{ JENIS_RINGKAS[run.jenis] }} - {{ formatBulanTahun(run.mulai) }}</h1>
      <p class="mt-2 flex flex-wrap items-center text-[15px] text-[#64748b]">
        <span class="pr-3">Periode {{ formatBulanTahun(run.mulai) }}</span>
        <span class="border-l border-line px-3">Dibuat {{ formatTanggalPendek(run.dibuat) }}</span>
        <span class="border-l border-line pl-3">Tersimpan ✓</span>
      </p>

      <section class="mt-7 grid max-w-262 grid-cols-3 gap-5">
        <UiStatCard label="Total Seminar" :nilai="ringkas.total"><template #ikon><UiIcon nama="percent" class="size-7 text-primary-500" /></template></UiStatCard>
        <UiStatCard label="Disetujui" :nilai="ringkas.disetujui"><template #ikon><UiIcon nama="percent" class="size-7 text-primary-500" /></template></UiStatCard>
        <UiStatCard label="Menunggu Konfirmasi" :nilai="ringkas.menunggu"><template #ikon><UiIcon nama="percent" class="size-7 text-primary-500" /></template></UiStatCard>
      </section>

      <section class="mt-6 rounded-2xl border border-line bg-white">
        <div class="flex items-center justify-between gap-4 px-6 pt-6 pb-4">
          <h2 class="text-[22px] font-medium text-[#0f172a]">Jadwal Seminar {{ run.jenis === "sempro" ? "Proposal" : "Hasil" }}</h2>
          <div class="w-full max-w-100"><UiSearchBox v-model="cariSeminar" placeholder="Search ..." /></div>
        </div>
        <div class="px-6">
          <div :class="GRID_DETAIL" class="h-12 items-center border-b border-line-soft text-[13px] font-medium text-black">
            <span>Tanggal</span><span class="text-center">Jam</span><span class="text-center">Ruangan</span><span class="text-center">Mahasiswa</span><span class="text-center">Pembimbing 1</span><span class="text-center">Pembimbing 2</span><span class="text-center">Penguji 1</span><span class="text-center">Penguji 2</span><span class="text-center">Status</span>
          </div>
          <ul class="min-h-48">
            <li v-for="s in seminarHalaman" :key="s.id">
              <button type="button" :class="GRID_DETAIL" class="h-12.5 w-full items-center border-b border-line-soft text-left text-[12.5px] text-black transition-colors hover:bg-primary-50/70" @click="seminarDipilih = s">
                <span>{{ formatTanggalPendek(s.tanggal) }}</span>
                <span class="text-center">{{ s.jamMulai }} - {{ s.jamSelesai }}</span>
                <span class="text-center">{{ s.ruangan }}</span>
                <span class="truncate text-center">{{ s.mahasiswa }}</span>
                <span class="truncate text-center">{{ dosenDi(s, "pembimbing_utama") }}</span>
                <span class="truncate text-center">{{ dosenDi(s, "pembimbing_pendamping") }}</span>
                <span class="truncate text-center">{{ dosenDi(s, "penguji_1") }}</span>
                <span class="truncate text-center">{{ dosenDi(s, "penguji_2") }}</span>
                <span class="text-center"><span class="inline-block min-w-11 rounded-full px-2.5 py-1.5 text-[13px]" :class="PILL_STATUS[ringkasanApproval(s).tone]">{{ ringkasanApproval(s).setuju }}/{{ s.approval.length }}</span></span>
              </button>
            </li>
            <li v-if="seminarTampil.length === 0" class="py-14 text-center text-sm text-meta">Tidak ada seminar yang cocok.</li>
          </ul>
        </div>
        <UiPagination v-model="halSeminar" :total="seminarTampil.length" :ukuran="UKURAN" />
      </section>

      <!-- rincian persetujuan 4 dosen -->
      <UiModalDialog v-model="detailTerbuka" :judul="seminarDipilih?.mahasiswa ?? ''" lebar="max-w-120" polos bilah-atas>
        <template v-if="seminarDipilih">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-xl font-bold text-[#0f172a]">{{ seminarDipilih.mahasiswa }}</h2>
              <div class="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                <span class="rounded-full bg-[#dbeafe] px-3 py-1.5 text-[#1e40af]">{{ JENIS_RINGKAS[seminarDipilih.jenis] }}</span>
                <span class="rounded-full px-3 py-1.5" :class="CHIP_RINGKAS[ringkasan.tone]">{{ ringkasan.label }}</span>
              </div>
            </div>
            <button type="button" class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]" aria-label="Tutup" @click="detailTerbuka = false">
              <UiIcon nama="x" class="size-4.5" />
            </button>
          </div>

          <p class="mt-3.5 flex flex-wrap gap-2 text-xs text-[#334155]">
            <span class="rounded-lg border border-line bg-[#f8fafc] px-2.5 py-1.5">📅 {{ formatTanggalPendek(seminarDipilih.tanggal).replace(/^(\d) /, "0$1 ") }}</span>
            <span class="rounded-lg border border-line bg-[#f8fafc] px-2.5 py-1.5">🕘 {{ formatJam(seminarDipilih.jamMulai, seminarDipilih.jamSelesai) }}</span>
            <span class="rounded-lg border border-line bg-[#f8fafc] px-2.5 py-1.5">🚪 {{ seminarDipilih.ruangan }}</span>
          </p>

          <div class="mt-4">
            <div class="mb-1.5 flex items-center justify-between text-xs">
              <span class="text-[#64748b]">Progress Persetujuan</span>
              <span class="font-bold" :class="TEKS_RINGKAS[ringkasan.tone]">{{ ringkasan.setuju }} dari {{ seminarDipilih.approval.length }} dosen</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]" role="progressbar" :aria-valuenow="ringkasan.setuju" aria-valuemin="0" :aria-valuemax="seminarDipilih.approval.length">
              <div class="h-full rounded-full" :class="BAR_RINGKAS[ringkasan.tone]" :style="{ width: `${(ringkasan.setuju / seminarDipilih.approval.length) * 100}%` }" />
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 items-start gap-3">
            <div v-for="a in seminarDipilih.approval" :key="a.peran" class="rounded-xl border p-3.5" :class="KARTU_APPROVAL[a.status]">
              <div class="flex items-center justify-between">
                <p class="text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">{{ LABEL_PERAN[a.peran] }}</p>
                <span class="size-2 rounded-full" :class="TITIK_APPROVAL[a.status]" />
              </div>
              <p class="mt-1.5 text-sm font-bold text-[#0f172a]">{{ a.dosen }}</p>
              <span class="mt-2 inline-block rounded-md px-2 py-0.5 text-xs font-semibold" :class="CHIP_APPROVAL[a.status]">{{ LABEL_APPROVAL[a.status] }}</span>
              <p v-if="a.alasan" class="mt-2 flex items-start gap-1.5 text-xs leading-snug text-[#b91c1c]"><UiIcon nama="alert" class="mt-px size-3.5 shrink-0" /> {{ a.alasan }}</p>
            </div>
          </div>
          <div class="h-2" />
        </template>
      </UiModalDialog>
    </template>

    <!-- ═══════ ID TIDAK DITEMUKAN ═══════ -->
    <template v-else-if="runId !== null">
      <UiPageHeader judul="Jadwal tidak ditemukan" subjudul="Jadwal yang Anda buka mungkin sudah dihapus atau tautannya keliru." />
      <NuxtLink to="/admin/jadwal" class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-900 hover:underline"><UiIcon nama="arrow-left" class="size-4" /> Kembali ke Daftar Jadwal</NuxtLink>
    </template>

    <!-- ═══════ DAFTAR ═══════ -->
    <template v-else>
      <UiPageHeader judul="Daftar Jadwal" subjudul="Semua hasil penjadwalan yang telah dibuat">
        <div class="w-80"><UiSearchBox v-model="cari" placeholder="Search ..." /></div>
        <UiFilterSelect v-model="filterJenis" :opsi="OPSI_JENIS" label="Filter jenis seminar" />
      </UiPageHeader>

      <ul class="mt-9 flex flex-col gap-4">
        <li v-for="r in runTampil" :key="r.id">
          <NuxtLink
            :to="{ path: '/admin/jadwal', query: { id: r.id } }"
            class="grid grid-cols-[minmax(0,2fr)_120px_130px_minmax(0,1.5fr)] items-center gap-x-4 rounded-2xl border border-primary-900 bg-white px-4 py-3.5 shadow-[0px_4px_10px_rgba(13,71,161,0.15)] transition-shadow hover:shadow-[0px_6px_16px_rgba(13,71,161,0.25)]"
          >
            <span class="flex min-w-0 items-center gap-4">
              <span class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-900"><UiIcon nama="calendar" class="size-7" /></span>
              <span class="min-w-0 leading-snug">
                <span class="block truncate text-[17px] text-[#1a1d29]">{{ r.nama }}</span>
                <span class="block text-sm text-[#6b84c4]">{{ formatRentangTanggal(r.mulai, r.selesai, " - ") }}</span>
              </span>
            </span>
            <span class="text-center"><UiJenisChip :jenis="r.jenis" /></span>
            <span class="text-center leading-snug">
              <span class="block text-[17px] text-[#333]">{{ r.seminar.length }}/{{ r.total }}</span>
              <span class="block text-sm text-[#777]">Terjadwal</span>
            </span>
            <span class="text-right"><span class="inline-flex h-8 items-center rounded-full border border-primary-900/60 px-3.5 text-xs text-primary-900">View Details</span></span>
          </NuxtLink>
        </li>
      </ul>
      <p v-if="runTampil.length === 0" class="mt-16 text-center text-sm text-meta">
        {{ cari || filterJenis !== "semua" ? "Tidak ada jadwal yang cocok." : "Belum ada jadwal. Buat lewat menu Penjadwalan." }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ringkasanApproval, statsRun, type SeminarJadwal } from "~/composables/useAdminJadwal";
import type { JenisSingkat, Peran, StatusApproval } from "~/types/domain";
import { formatBulanTahun, formatJam, formatRentangTanggal, formatTanggalPendek } from "~/utils/format";

const route = useRoute();
const { daftar, cariRun } = useAdminJadwal();

const UKURAN = 8;
const JENIS_RINGKAS: Record<JenisSingkat, string> = { sempro: "Sempro", semhas: "Semhas" };
const GRID_DETAIL = "grid grid-cols-[88px_100px_74px_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_66px] gap-x-2";
const PILL_STATUS = { success: "bg-[#d1fae5] text-[#15803d]", warning: "bg-[#fef3c7] text-[#92400e]", danger: "bg-[#fecaca] text-[#dc2626]" } as const;

// id jadwal dari URL: /admin/jadwal?id=2
const runId = computed(() => {
  const q = Array.isArray(route.query.id) ? route.query.id[0] : route.query.id;
  return q ? Number(q) : null;
});
const run = computed(() => cariRun(runId.value));

// ── daftar ──
const OPSI_JENIS = [
  { nilai: "semua", label: "Jenis" },
  { nilai: "sempro", label: "Sempro" },
  { nilai: "semhas", label: "Semhas" },
];
const cari = ref("");
const filterJenis = ref("semua");

const runTampil = computed(() => {
  const q = cari.value.trim().toLowerCase();
  return daftar.value.filter((r) => (filterJenis.value === "semua" || r.jenis === filterJenis.value) && (!q || r.nama.toLowerCase().includes(q)));
});

// ── detail ──
const ringkas = computed(() => (run.value ? statsRun(run.value) : { total: 0, disetujui: 0, menunggu: 0, ditolak: 0 }));
const cariSeminar = ref("");
const dosenDi = (s: SeminarJadwal, peran: Peran) => s.approval.find((a) => a.peran === peran)?.dosen ?? "—";

const seminarTampil = computed(() => {
  const q = cariSeminar.value.trim().toLowerCase();
  return (run.value?.seminar ?? []).filter(
    (s) => !q || [s.mahasiswa, s.nim, s.ruangan, ...s.approval.map((a) => a.dosen)].some((t) => t.toLowerCase().includes(q)),
  );
});
const { halaman: halSeminar, potong: seminarHalaman } = usePaginasi(seminarTampil, UKURAN);
watch(cariSeminar, () => (halSeminar.value = 1));

// ganti jadwal (id berubah) → reset pencarian, halaman & dialog
watch(runId, () => {
  cariSeminar.value = "";
  halSeminar.value = 1;
  seminarDipilih.value = null;
});

const seminarDipilih = ref<SeminarJadwal | null>(null);
const detailTerbuka = computed({
  get: () => seminarDipilih.value !== null,
  set: (buka) => {
    if (!buka) seminarDipilih.value = null;
  },
});
const ringkasan = computed(() => (seminarDipilih.value ? ringkasanApproval(seminarDipilih.value) : { setuju: 0, tolak: 0, menunggu: 0, label: "", tone: "warning" as const }));

const LABEL_PERAN: Record<Peran, string> = { pembimbing_utama: "Pembimbing 1", pembimbing_pendamping: "Pembimbing 2", penguji_1: "Penguji 1", penguji_2: "Penguji 2" };
const LABEL_APPROVAL: Record<StatusApproval, string> = { menunggu: "Menunggu", konfirmasi: "Disetujui", tolak: "Ditolak" };
const KARTU_APPROVAL: Record<StatusApproval, string> = {
  menunggu: "border-[#f5c36b] bg-[#fff7e6]",
  konfirmasi: "border-[#a7f3d0] bg-[#ecfdf3]",
  tolak: "border-[#fecaca] bg-[#fff1f1]",
};
const TITIK_APPROVAL: Record<StatusApproval, string> = { menunggu: "bg-[#f59e0b]", konfirmasi: "bg-[#059669]", tolak: "bg-[#ef4444]" };
const CHIP_APPROVAL: Record<StatusApproval, string> = { menunggu: "bg-[#fef3c7] text-[#92400e]", konfirmasi: "bg-[#d1fae5] text-[#059669]", tolak: "bg-[#fee2e2] text-[#dc2626]" };
const CHIP_RINGKAS = { success: "bg-[#d1fae5] text-[#059669]", warning: "bg-[#fff3e0] text-[#b45309]", danger: "bg-[#fee2e2] text-[#dc2626]" } as const;
const TEKS_RINGKAS = { success: "text-[#059669]", warning: "text-[#b45309]", danger: "text-[#dc2626]" } as const;
const BAR_RINGKAS = { success: "bg-[#059669]", warning: "bg-[#e0a82e]", danger: "bg-[#dc2626]" } as const;
</script>
