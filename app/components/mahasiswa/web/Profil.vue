<template>
  <!-- Figma "dashboard Mahasiswa - web" (node 166:7135) — isinya halaman Profil Saya -->
  <div class="max-w-312.25 pt-9.75 pr-8 pb-29.25 pl-12 xl:pr-27.25">
    <header class="leading-normal">
      <h1 class="text-[29px] font-extrabold text-ink">Profil Saya</h1>
      <p class="mt-2 text-sm font-medium text-muted">Informasi akun dan data akademik Anda</p>
    </header>

    <!-- Kartu identitas -->
    <section class="mt-7.25 flex items-center gap-6 rounded-xl border border-border bg-surface px-8.25 py-7.75">
      <span
        class="flex size-22.5 shrink-0 items-center justify-center rounded-full bg-accent text-[30px] leading-normal font-extrabold text-white"
        aria-hidden="true"
      >
        {{ profil.inisial }}
      </span>
      <div class="min-w-0 flex-1 leading-normal">
        <p class="text-[19px] font-extrabold text-ink">{{ profil.nama }}</p>
        <p class="mt-1.25 text-[13px] font-medium text-muted">NIM {{ profil.nim }} • {{ profil.email }}</p>
        <ul class="mt-2.75 flex flex-wrap gap-2">
          <li v-for="chip in chips" :key="chip" class="rounded-full border border-border bg-bg px-3 py-1.25 text-xs font-semibold text-muted">
            {{ chip }}
          </li>
        </ul>
      </div>
      <!-- TODO: form edit profil belum ada di Figma -->
      <button
        type="button"
        class="shrink-0 rounded-full border border-border bg-surface px-5.75 py-3 text-[13px] leading-normal font-bold text-ink hover:bg-bg"
      >
        Edit Profil
      </button>
    </section>

    <!-- 4 kartu info — tinggi berbeda, rata tengah per baris seperti Figma -->
    <div class="mt-6 grid grid-cols-2 items-start gap-4">
      <section v-for="kartu in kartuInfo" :key="kartu.judul" class="rounded-xl bg-surface py-5.5 leading-normal border border-border">
        <div class="flex items-center justify-between gap-3 pl-6 pr-4">
          <h2 class="text-[13px] font-bold text-ink">{{ kartu.judul }}</h2>
          <button
            v-if="kartu.judul === 'Dosen Pembimbing' && !pb.sedangEdit.value"
            type="button" @click="pb.mulaiEdit()" aria-label="Ubah pembimbing"
            class="flex h-11 min-h-[44px] w-11 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-bg hover:text-accent"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125M18 14v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h9" /></svg>
          </button>
        </div>
        <!-- Mode edit inline khusus kartu pembimbing -->
        <div v-if="kartu.judul === 'Dosen Pembimbing' && pb.sedangEdit.value" class="mt-4 px-6">
          <div v-if="pb.memuat.value" class="animate-pulse space-y-2" aria-busy="true">
            <div class="h-11 rounded-xl bg-slate-100"></div>
            <div class="h-11 rounded-xl bg-slate-100"></div>
          </div>
          <div v-else class="space-y-3">
            <label class="block">
              <span class="mb-1.5 block text-[11px] font-bold text-muted">Pembimbing 1</span>
              <select v-model.number="pb.pembimbing1Id.value" class="h-11 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-ink">
                <option :value="null">Pilih dosen…</option>
                <option v-for="d in pb.daftarDosen.value" :key="d.id" :value="d.id">{{ d.nama }}</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-1.5 block text-[11px] font-bold text-muted">Pembimbing 2</span>
              <select v-model.number="pb.pembimbing2Id.value" class="h-11 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-ink">
                <option :value="null">Pilih dosen…</option>
                <option v-for="d in pb.daftarDosen.value" :key="d.id" :value="d.id">{{ d.nama }}</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-1.5 block text-[11px] font-bold text-muted">Judul Tugas Akhir</span>
              <input v-model="pb.judulEdit.value" type="text" placeholder="Tulis judul lengkap…" class="h-11 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-ink" />
            </label>
          </div>
          <p v-if="pb.kembar.value" class="mt-2 text-xs font-semibold text-red-600">Pembimbing 1 dan 2 harus orang berbeda.</p>
          <p v-if="pb.galat.value" class="mt-2 text-xs font-semibold text-red-600">{{ pb.galat.value }}</p>
          <p v-if="pb.berhasil.value" class="mt-2 text-xs font-semibold text-emerald-700">{{ pb.berhasil.value }}</p>
          <div class="mt-3 flex gap-2">
            <button
              type="button" @click="pb.batal()"
              class="h-11 min-h-[44px] rounded-xl border border-border bg-surface px-5 text-[13px] font-bold text-ink transition-all active:scale-[0.98]"
            >
              Batal
            </button>
            <button
              v-if="pb.adaPerubahan.value"
              type="button" @click="pb.simpan()" :disabled="!pb.bolehSimpan.value"
              class="h-11 min-h-[44px] rounded-xl px-5 text-[13px] font-bold text-white transition-all active:scale-[0.98]"
              :class="pb.bolehSimpan.value ? 'bg-accent hover:bg-accent-strong' : 'cursor-not-allowed bg-slate-200 text-slate-400'"
            >
              {{ pb.menyimpan.value ? 'Menyimpan…' : 'Simpan' }}
            </button>
          </div>
        </div>
        <dl v-else class="mt-4.25 px-6 text-xs">
          <div
            v-for="[label, nilai] in kartu.baris"
            :key="label"
            class="flex items-center justify-between gap-4 border-b border-border py-2.25 last:border-b-0"
          >
            <dt class="shrink-0 font-medium text-muted">{{ label }}</dt>
            <dd class="text-right font-semibold text-ink">{{ nilai }}</dd>
          </div>
        </dl>
        <p v-if="kartu.judul === 'Dosen Pembimbing' && pb.berhasil.value && !pb.sedangEdit.value" class="mt-2 px-6 text-xs font-semibold text-emerald-700">{{ pb.berhasil.value }}</p>
        <p v-if="kartu.judul === 'Dosen Pembimbing' && pb.galat.value && !pb.sedangEdit.value" class="mt-2 px-6 text-xs font-semibold text-red-600">{{ pb.galat.value }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useCurrentUser();
const { profil } = useMahasiswaSaya();
const pb = usePembimbingSaya();
onMounted(() => { pb.muat(); });

const chips = computed(() => [
  profil.value.prodi,
  `Angkatan ${profil.value.angkatan}`,
  `Semester ${profil.value.semester}`,
]);

const kartuInfo = computed(() => {
  const p = profil.value;
  const judulTampil = pb.judulSeminar.value || (pb.sedangEdit.value ? pb.judulEdit.value : '-') || '-';
  return [
    {
      judul: "Data Akademik",
      baris: [
        ["Program Studi", p.programStudi],
        ["Angkatan", p.angkatan],
        ["Semester Aktif", `${p.semester} (${p.semesterLabel})`],
        ["Status", p.status],
      ],
    },
    {
      judul: "Dosen Pembimbing",
      baris: [
        ["Pembimbing 1", pb.pembimbing1Id.value ? pb.pembimbing1Nama.value : "-"],
        ["Pembimbing 2", pb.pembimbing2Id.value ? pb.pembimbing2Nama.value : "-"],
        ["Judul Tugas Akhir", judulTampil],
      ],
    },
    {
      judul: "Kontak",
      baris: [
        ["Email", p.email],
        ["No. HP", p.noHp],
        ["Alamat", p.alamat],
      ],
    },
    {
      judul: "Akun",
      baris: [
        ["Username", p.username],
        ["Role", user.value.roleLabel],
        ["Kata Sandi", "••••••••"],
      ],
    },
  ];
});
</script>
