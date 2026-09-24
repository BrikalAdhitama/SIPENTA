<script setup lang="ts">
definePageMeta({ middleware: "role", role: "mahasiswa" });

// nanti diganti sama query Supabase kalo backend siap
const seminar = {
  judul: "Sistem Informasi Penjadwalan Seminar Tugas Akhir Menggunakan Genetic Algorithm",
  jenis: "Sempro" as const,
  nim: "11221071",
  pembimbing: "Dr. Ahmad Fauzi, M.T",
  penguji1: "Siti Rahma, M.Kom",
  penguji2: "Budi Hartono, M.Sc",
  statusData: "valid" as "valid" | "perlu_perbaikan",
};

const jadwal = {
  ada: true,
  tanggal: "12 Okt 2026",
  jam: "09:00 - 10:00",
  ruangan: "R101",
  approvals: [
    { role: "Pembimbing", nama: "Dr. Ahmad Fauzi, M.T", status: "approved" as const },
    { role: "Penguji 1", nama: "Siti Rahma, M.Kom", status: "approved" as const },
    { role: "Penguji 2", nama: "Budi Hartono, M.Sc", status: "pending" as const },
    { role: "Admin", nama: "Admin Prodi", status: "pending" as const },
  ] as { role: string; nama: string; status: "approved" | "declined" | "pending" }[],
};

const nApproved = computed(() => jadwal.approvals.filter((a) => a.status === "approved").length);
const overallStatus = computed(() => {
  if (jadwal.approvals.some((a) => a.status === "declined")) return { label: "Ada Penolakan", color: "#DC2626", bg: "#FEE2E2" };
  if (nApproved.value === jadwal.approvals.length) return { label: "Semua Disetujui", color: "#059669", bg: "#DCFCE7" };
  return { label: `${nApproved.value}/${jadwal.approvals.length} Disetujui`, color: "#92400E", bg: "#FEF9C3" };
});

function statusBadge(status: "approved" | "declined" | "pending") {
  if (status === "approved") return { bg: "#DCFCE7", text: "#059669", dot: "#059669", label: "Disetujui" };
  if (status === "declined") return { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444", label: "Ditolak" };
  return { bg: "#F1F5F9", text: "#64748B", dot: "#F59E0B", label: "Menunggu" };
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiPageHeader title="Jadwal Seminar Saya" subtitle="Detail seminar dan slot jadwal yang ditetapkan" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <!-- Detail seminar -->
      <div class="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-display font-bold text-sm">Detail Seminar</h3>
          <UiBadge :type="seminar.jenis === 'Sempro' ? 'info' : 'success'" :label="seminar.jenis" />
        </div>
        <div class="p-5">
          <p class="font-semibold text-base mb-5 leading-snug text-slate-900">{{ seminar.judul }}</p>
          <div class="flex flex-col gap-3">
            <div v-for="[k, v] in [['NIM', seminar.nim], ['Pembimbing', seminar.pembimbing], ['Penguji 1', seminar.penguji1], ['Penguji 2', seminar.penguji2]]" :key="k" class="flex items-start gap-3">
              <span class="w-24 shrink-0 text-xs font-semibold pt-0.5 text-slate-400">{{ k }}</span>
              <span class="text-sm text-slate-700">{{ v }}</span>
            </div>
          </div>
          <div class="mt-5 pt-4 border-t border-slate-100">
            <UiBadge :type="seminar.statusData === 'valid' ? 'success' : 'error'" :label="seminar.statusData === 'valid' ? 'Data Valid' : 'Perlu Perbaikan'" />
          </div>
        </div>
      </div>

      <!-- Slot jadwal & approval -->
      <div v-if="jadwal.ada" class="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 class="font-display font-bold text-sm">Slot Jadwal Seminar</h3>
          <span class="text-xs font-semibold px-3 py-1 rounded-full" :style="{ background: overallStatus.bg, color: overallStatus.color }">
            {{ overallStatus.label }}
          </span>
        </div>

        <div class="p-4 grid grid-cols-3 gap-3 border-b border-slate-100">
          <div v-for="[k, v] in [['Tanggal', jadwal.tanggal], ['Jam', jadwal.jam], ['Ruangan', jadwal.ruangan]]" :key="k"
            class="rounded-xl p-3 text-center border border-slate-200 bg-slate-50">
            <div class="text-xs mb-1 font-medium text-slate-400">{{ k }}</div>
            <div class="font-bold text-xs font-mono text-slate-900">{{ v }}</div>
          </div>
        </div>

        <div class="px-5 py-3 border-b border-slate-100">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-medium text-slate-500">Progress Persetujuan</span>
            <span class="text-xs font-semibold" :style="{ color: overallStatus.color }">{{ nApproved }}/{{ jadwal.approvals.length }}</span>
          </div>
          <div class="h-2 rounded-full overflow-hidden bg-slate-200">
            <div class="h-full rounded-full transition-all" :style="{ width: `${(nApproved / jadwal.approvals.length) * 100}%`, background: overallStatus.color }" />
          </div>
        </div>

        <div class="divide-y divide-slate-50">
          <div v-for="a in jadwal.approvals" :key="a.role" class="px-5 py-3.5 flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: statusBadge(a.status).dot }" />
            <div class="flex-1 min-w-0">
              <div class="text-xs font-semibold text-slate-400">{{ a.role }}</div>
              <div class="text-sm font-medium truncate text-slate-900">{{ a.nama }}</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" :style="{ background: statusBadge(a.status).bg, color: statusBadge(a.status).text }">
              {{ statusBadge(a.status).label }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="rounded-xl border p-8 text-center" style="background:#FFFBEB; border-color:#FDE68A">
        <p class="font-semibold text-sm mb-1" style="color:#D97706">Jadwal belum ditetapkan</p>
        <p class="text-xs" style="color:#92400E">Admin akademik akan menginformasikan jadwal seminar Anda</p>
      </div>
    </div>
  </div>
</template>
