<script setup lang="ts">
definePageMeta({
  middleware: ["role"],
  meta: { role: "admin" },
});
</script>

<template>
  <div class="p-6 md:p-8">
    <PageHeader title="Penjadwalan" subtitle="Kelola jadwal seminar dan sidang mahasiswa" />

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-slate-600">Halaman penjadwalan sedang dalam pengembangan.</p>
    </div>
  </div>
</template>
