<template>
  <!-- Figma "dashboard Mahasiswa - web" (node 166:7135) — isinya halaman Profil Saya -->
  <div class="max-w-312.25 pt-9.75 pr-8 pb-29.25 pl-12 xl:pr-27.25">
    <header class="leading-normal">
      <h1 class="text-[29px] font-extrabold text-title">Profil Saya</h1>
      <p class="mt-2 text-sm font-medium text-meta">Informasi akun dan data akademik Anda</p>
    </header>

    <!-- Kartu identitas -->
    <section class="mt-7.25 flex items-center gap-6 rounded-[22px] border border-primary-100 bg-white px-8.25 py-7.75">
      <span
        class="flex size-22.5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(226.29deg,#90caf9_50%,#0d47a1_120.71%)] text-[30px] leading-normal font-extrabold text-white"
        aria-hidden="true"
      >
        {{ profil.inisial }}
      </span>
      <div class="min-w-0 flex-1 leading-normal">
        <p class="text-[19px] font-extrabold text-title">{{ profil.nama }}</p>
        <p class="mt-1.25 text-[13px] font-medium text-meta">NIM {{ profil.nim }} • {{ profil.email }}</p>
        <ul class="mt-2.75 flex flex-wrap gap-2">
          <li v-for="chip in chips" :key="chip" class="rounded-full bg-[#eaf1fd] px-3 py-1.25 text-xs font-semibold text-primary-500">
            {{ chip }}
          </li>
        </ul>
      </div>
      <!-- TODO: form edit profil belum ada di Figma -->
      <button
        type="button"
        class="shrink-0 rounded-full border border-primary-100 bg-white px-5.75 py-3 text-[13px] leading-normal font-bold text-title hover:bg-primary-50"
      >
        Edit Profil
      </button>
    </section>

    <!-- 4 kartu info — tinggi berbeda, rata tengah per baris seperti Figma -->
    <div class="mt-6 grid grid-cols-2 items-center gap-4">
      <section v-for="kartu in kartuInfo" :key="kartu.judul" class="rounded-[22px] bg-[#f2f6fb] py-5.5 leading-normal">
        <h2 class="pl-6 text-[13px] font-bold text-title">{{ kartu.judul }}</h2>
        <dl class="mt-4.25 px-6 text-xs">
          <div
            v-for="[label, nilai] in kartu.baris"
            :key="label"
            class="flex items-center justify-between gap-4 border-b border-primary-100 py-2.25 last:border-b-0"
          >
            <dt class="shrink-0 font-medium text-meta">{{ label }}</dt>
            <dd class="text-right font-semibold text-title">{{ nilai }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useCurrentUser();
const { profil } = useMahasiswaSaya();

const chips = computed(() => [
  profil.value.prodi,
  `Angkatan ${profil.value.angkatan}`,
  `Semester ${profil.value.semester}`,
]);

const kartuInfo = computed(() => {
  const p = profil.value;
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
        ["Pembimbing 1", p.pembimbing1],
        ["Pembimbing 2", p.pembimbing2],
        ["Judul Tugas Akhir", p.judulTA],
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
