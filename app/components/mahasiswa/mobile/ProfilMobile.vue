<template>
  <div class="min-h-screen bg-bg font-sans pb-28 mobile-safe-top">
    <main class="mx-auto max-w-lg px-5 pb-6 pb-safe">
      <header class="mb-6 pt-1">
        <h1 class="text-[26px] font-extrabold tracking-tight text-ink">Profil Saya</h1>
        <p class="mt-1 text-[13px] font-medium text-muted">Informasi akun dan data akademik Anda</p>
      </header>

      <section class="mb-5 rounded-xl border border-border bg-surface p-5">
        <div class="flex items-center gap-4">
          <button type="button" class="group relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-full bg-accent text-[27px] font-extrabold text-white" @click="openPhotoPicker" aria-label="Ubah foto profil">
            <img v-if="profilePhoto" :src="profilePhoto" alt="Foto profil" class="h-full w-full object-cover" />
            <span v-else>{{ profil.inisial }}</span>
            <span class="absolute inset-0 flex items-center justify-center bg-accent-strong/75 text-[10px] font-extrabold opacity-0 transition-opacity group-hover:opacity-100">Ubah foto</span>
          </button>
          <div class="min-w-0">
            <h2 class="truncate text-[20px] font-extrabold text-ink">{{ profil.nama }}</h2>
            <p class="mt-1 truncate text-[12px] font-medium text-muted">NIM {{ profil.nim }} · {{ profil.email }}</p>
          </div>
        </div>
        <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handlePhotoChange" />
        <button type="button" @click="openPhotoPicker" class="mt-5 flex h-11 min-h-[44px] w-full items-center justify-center rounded-xl border border-border text-[13px] font-extrabold text-accent transition-colors hover:bg-bg active:scale-[0.99]">
          {{ profilePhoto ? 'Ganti Foto Profil' : 'Tambah Foto Profil' }}
        </button>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="chip in chips" :key="chip" class="rounded-full border border-border bg-bg px-3 py-1.5 text-[11px] font-bold text-muted">{{ chip }}</span>
        </div>
      </section>

      <section v-for="section in detailSections" :key="section.title" class="mb-5 rounded-xl border border-border bg-surface p-5">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-[18px] font-extrabold text-ink">{{ section.title }}</h2>
          <button
            v-if="section.title === 'Dosen Pembimbing' && !pb.sedangEdit.value"
            type="button" @click="pb.mulaiEdit()" aria-label="Ubah pembimbing"
            class="flex h-11 min-h-[44px] w-11 items-center justify-center rounded-[13px] border border-border bg-surface text-muted transition-colors hover:text-accent active:scale-[0.98]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125M18 14v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h9" /></svg>
          </button>
        </div>
        <!-- Edit inline khusus kartu pembimbing -->
        <template v-if="section.title === 'Dosen Pembimbing' && pb.sedangEdit.value">
          <div v-if="pb.memuat.value" class="animate-pulse space-y-2" aria-busy="true">
            <div class="h-11 rounded-[13px] bg-slate-100"></div>
            <div class="h-11 rounded-[13px] bg-slate-100"></div>
          </div>
          <div v-else class="space-y-3">
            <label class="block">
              <span class="mb-1.5 block text-[11px] font-bold text-muted">Pembimbing 1</span>
              <select v-model.number="pb.pembimbing1Id.value" class="h-11 min-h-[44px] w-full rounded-[13px] border border-border bg-surface px-3 text-[13px] font-semibold text-ink">
                <option :value="null">Pilih dosen…</option>
                <option v-for="d in pb.daftarDosen.value" :key="d.id" :value="d.id">{{ d.nama }}</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-1.5 block text-[11px] font-bold text-muted">Pembimbing 2</span>
              <select v-model.number="pb.pembimbing2Id.value" class="h-11 min-h-[44px] w-full rounded-[13px] border border-border bg-surface px-3 text-[13px] font-semibold text-ink">
                <option :value="null">Pilih dosen…</option>
                <option v-for="d in pb.daftarDosen.value" :key="d.id" :value="d.id">{{ d.nama }}</option>
              </select>
            </label>
            <label class="block">
              <span class="mb-1.5 block text-[11px] font-bold text-muted">Judul Tugas Akhir</span>
              <input v-model="pb.judulEdit.value" type="text" placeholder="Tulis judul lengkap…" class="h-11 min-h-[44px] w-full rounded-[13px] border border-border bg-surface px-3 text-[13px] font-semibold text-ink" />
            </label>
          </div>
          <p v-if="pb.kembar.value" class="mt-2 text-[12px] font-semibold text-red-600">Pembimbing 1 dan 2 harus orang berbeda.</p>
          <p v-if="pb.galat.value" class="mt-2 text-[12px] font-semibold text-red-600">{{ pb.galat.value }}</p>
          <p v-if="pb.berhasil.value" class="mt-2 text-[12px] font-semibold text-emerald-700">{{ pb.berhasil.value }}</p>
          <div class="mt-3 flex gap-2">
            <button
              type="button" @click="pb.batal()"
              class="flex h-11 min-h-[44px] flex-1 items-center justify-center rounded-[13px] border border-border bg-surface text-[13px] font-extrabold text-ink active:scale-[0.99]"
            >
              Batal
            </button>
            <button
              v-if="pb.adaPerubahan.value"
              type="button" :disabled="!pb.bolehSimpan.value" @click="pb.simpan()"
              class="flex h-11 min-h-[44px] flex-1 items-center justify-center rounded-[13px] text-[13px] font-extrabold transition-all active:scale-[0.99]"
              :class="pb.bolehSimpan.value ? 'bg-accent text-white' : 'cursor-not-allowed bg-slate-200 text-slate-400'"
            >
              {{ pb.menyimpan.value ? 'Menyimpan…' : 'Simpan' }}
            </button>
          </div>
        </template>
        <template v-else>
          <div v-for="row in section.rows" :key="row.label" class="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
            <span class="text-[12px] font-medium text-muted">{{ row.label }}</span>
            <span class="max-w-[62%] text-right text-[12px] font-bold" :class="row.label === 'Status' ? 'text-emerald-700' : 'text-ink'">{{ row.value }}</span>
          </div>
          <p v-if="section.title === 'Dosen Pembimbing' && pb.berhasil.value" class="mt-2 text-[12px] font-semibold text-emerald-700">{{ pb.berhasil.value }}</p>
          <p v-if="section.title === 'Dosen Pembimbing' && pb.galat.value" class="mt-2 text-[12px] font-semibold text-red-600">{{ pb.galat.value }}</p>
        </template>
      </section>
    </main>
    <MahasiswaBottomNav />
  </div>
</template>

<script setup lang="ts">
const { profil } = useMahasiswaSaya()
const pb = usePembimbingSaya()
onMounted(() => { pb.muat() })
const photoInput = ref<HTMLInputElement | null>(null)
const profilePhoto = useState<string | null>('mahasiswaProfilePhoto', () => null)

const chips = computed(() => [profil.value.prodi, `Angkatan ${profil.value.angkatan}`, `Semester ${profil.value.semester}`])
const judulTampil = computed(() => pb.judulSeminar.value || '-')
const detailSections = computed(() => [
  {
    title: 'Data Akademik',
    rows: [
      { label: 'Program Studi', value: profil.value.programStudi },
      { label: 'Angkatan', value: profil.value.angkatan },
      { label: 'Semester Aktif', value: `${profil.value.semester} (${profil.value.semesterLabel})` },
      { label: 'Status', value: profil.value.status },
    ],
  },
  {
    title: 'Dosen Pembimbing',
    rows: [
      { label: 'Pembimbing 1', value: pb.pembimbing1Id.value ? pb.pembimbing1Nama.value : '-' },
      { label: 'Pembimbing 2', value: pb.pembimbing2Id.value ? pb.pembimbing2Nama.value : '-' },
      { label: 'Judul Tugas Akhir', value: judulTampil.value },
    ],
  },
  {
    title: 'Kontak',
    rows: [
      { label: 'Email', value: profil.value.email },
      { label: 'No. HP', value: profil.value.noHp },
      { label: 'Alamat', value: profil.value.alamat },
    ],
  },
])

const openPhotoPicker = () => photoInput.value?.click()

const handlePhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    window.alert('Ukuran foto maksimal 2 MB.')
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') return
    profilePhoto.value = reader.result
    localStorage.setItem('mahasiswaProfilePhoto', reader.result)
  }
  reader.readAsDataURL(file)
}

onMounted(() => {
  profilePhoto.value = localStorage.getItem('mahasiswaProfilePhoto')
})
</script>
