<template>
  <div class="min-h-screen bg-white font-sans pb-28 mobile-safe-top">
    <main class="mx-auto max-w-lg px-5 pb-6">
      <header class="mb-6 pt-1">
        <h1 class="text-[26px] font-extrabold tracking-tight text-[#14213D]">Profil Saya</h1>
        <p class="mt-1 text-[13px] font-medium text-slate-500">Informasi akun dan data akademik Anda</p>
      </header>

      <section class="mb-5 rounded-[22px] border border-[#90CAF9]/45 bg-white p-5 shadow-[0_8px_24px_-12px_rgba(33,150,243,0.25)]">
        <div class="flex items-center gap-4">
          <button type="button" class="group relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#90CAF9] to-[#0D47A1] text-[27px] font-extrabold text-white shadow-md" @click="openPhotoPicker" aria-label="Ubah foto profil">
            <img v-if="profilePhoto" :src="profilePhoto" alt="Foto profil" class="h-full w-full object-cover" />
            <span v-else>{{ profil.inisial }}</span>
            <span class="absolute inset-0 flex items-center justify-center bg-[#0D47A1]/75 text-[10px] font-extrabold opacity-0 transition-opacity group-hover:opacity-100">Ubah foto</span>
          </button>
          <div class="min-w-0">
            <h2 class="truncate text-[20px] font-extrabold text-[#14213D]">{{ profil.nama }}</h2>
            <p class="mt-1 truncate text-[12px] font-medium text-slate-500">NIM {{ profil.nim }} · {{ profil.email }}</p>
          </div>
        </div>
        <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handlePhotoChange" />
        <button type="button" @click="openPhotoPicker" class="mt-5 flex h-11 w-full items-center justify-center rounded-[13px] border border-[#2196F3] text-[13px] font-extrabold text-[#0D47A1] transition-colors hover:bg-[#E3F2FD] active:scale-[0.99]">
          {{ profilePhoto ? 'Ganti Foto Profil' : 'Tambah Foto Profil' }}
        </button>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="chip in chips" :key="chip" class="rounded-full bg-[#E3F2FD] px-3 py-1.5 text-[11px] font-bold text-[#0D47A1]">{{ chip }}</span>
        </div>
      </section>

      <section v-for="section in detailSections" :key="section.title" class="mb-5 rounded-[22px] border border-[#90CAF9]/45 bg-white p-5 shadow-[0_6px_20px_-12px_rgba(33,150,243,0.2)]">
        <h2 class="mb-4 text-[18px] font-extrabold text-[#14213D]">{{ section.title }}</h2>
        <div v-for="row in section.rows" :key="row.label" class="flex items-start justify-between gap-4 border-b border-[#E3F2FD] py-3 last:border-b-0">
          <span class="text-[12px] font-medium text-slate-500">{{ row.label }}</span>
          <span class="max-w-[62%] text-right text-[12px] font-bold" :class="row.label === 'Status' ? 'text-emerald-700' : 'text-[#14213D]'">{{ row.value }}</span>
        </div>
      </section>
    </main>
    <MahasiswaBottomNav />
  </div>
</template>

<script setup lang="ts">
const { profil } = useMahasiswaSaya()
const photoInput = ref<HTMLInputElement | null>(null)
const profilePhoto = useState<string | null>('mahasiswaProfilePhoto', () => null)

const chips = computed(() => [profil.value.prodi, `Angkatan ${profil.value.angkatan}`, `Semester ${profil.value.semester}`])
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
      { label: 'Pembimbing 1', value: profil.value.pembimbing1 },
      { label: 'Pembimbing 2', value: profil.value.pembimbing2 },
      { label: 'Judul Tugas Akhir', value: profil.value.judulTA },
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
