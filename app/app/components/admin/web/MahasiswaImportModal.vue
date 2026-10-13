<template>
  <UiModalDialog
    :model-value="modelValue"
    judul="Import Data Mahasiswa"
    subjudul="Upload file Excel atau CSV"
    lebar="max-w-135"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <template #ikon><span class="flex size-10 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]"><UiIcon nama="upload" class="size-5" /></span></template>

    <!-- stepper -->
    <ol class="mb-4 flex items-center gap-3 border-t border-line-soft pt-4 text-xs" aria-label="Langkah impor">
      <template v-for="(nama, i) in LANGKAH" :key="nama">
        <li class="flex items-center gap-2" :aria-current="langkah === i + 1 ? 'step' : undefined">
          <span class="flex size-6 items-center justify-center rounded-full text-[11px] font-semibold" :class="langkah === i + 1 ? 'bg-primary-900 text-white' : 'bg-[#eef2f7] text-[#94a3b8]'">{{ i + 1 }}</span>
          <span :class="langkah === i + 1 ? 'font-semibold text-primary-900' : 'text-[#94a3b8]'">{{ nama }}</span>
        </li>
        <li v-if="i < LANGKAH.length - 1" class="h-px w-9 bg-line" aria-hidden="true" />
      </template>
    </ol>

    <!-- 1) upload -->
    <div v-if="langkah === 1" class="flex flex-col gap-3.5">
      <label
        class="flex h-56 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-6 text-center transition-colors"
        :class="seret ? 'border-primary-500 bg-primary-50' : 'border-[#d5dbe5] hover:border-primary-200 hover:bg-primary-50/40'"
        @dragover.prevent="seret = true"
        @dragleave.prevent="seret = false"
        @drop.prevent="onDrop"
      >
        <input type="file" accept=".xlsx,.xls,.csv" class="sr-only" @change="onPilih" />
        <span class="mb-2 flex size-12 items-center justify-center rounded-xl bg-[#f1f5f9] text-[#94a3b8]"><UiIcon nama="cloud-upload" class="size-6" /></span>
        <p class="text-sm font-semibold text-[#334155]">Drag &amp; drop file di sini</p>
        <p class="text-xs text-[#94a3b8]">atau <span class="font-medium text-primary-500">klik untuk browse</span></p>
        <p class="mt-2.5 flex gap-2 text-[11px] font-medium">
          <span class="inline-flex items-center gap-1 rounded-md bg-[#dcfce7] px-2 py-1 text-[#15803d]"><UiIcon nama="sheet" class="size-3" />.xlsx</span>
          <span class="inline-flex items-center gap-1 rounded-md bg-[#e0e7ff] px-2 py-1 text-[#1d4ed8]"><UiIcon nama="file" class="size-3" />.csv</span>
          <span class="inline-flex items-center gap-1 rounded-md bg-[#ffedd5] px-2 py-1 text-[#c2410c]"><UiIcon nama="sheet" class="size-3" />.xls</span>
        </p>
      </label>
      <p v-if="galat" class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">{{ galat }}</p>

      <div class="flex items-center gap-3 rounded-xl border border-line bg-[#f8fafc] px-3 py-2.5">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#d1fae5] text-[#059669]"><UiIcon nama="download" class="size-4" /></span>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-semibold text-[#334155]">Download Template</h4>
          <p class="truncate text-[10.5px] text-[#94a3b8]">Format kolom: Nama, NIM, Jenis, Pembimbing 1, Pembimbing 2, Status</p>
        </div>
        <button type="button" class="text-sm font-medium text-primary-500 hover:underline" @click="unduhTemplate">Download</button>
      </div>
    </div>

    <!-- 2) preview -->
    <div v-else-if="langkah === 2" class="flex flex-col gap-3.5">
      <p class="flex items-start gap-2 rounded-lg border border-[#a7f3d0] bg-[#ecfdf5] px-3 py-2.5 text-xs leading-relaxed text-[#047857]">
        <UiIcon nama="check-circle" class="mt-0.5 size-4 shrink-0" />
        <span>File <strong>{{ namaFile }}</strong> berhasil dibaca — {{ baris.length }} baris data ditemukan.</span>
      </p>
      <p v-if="contoh" class="rounded-lg bg-warning/10 px-3 py-2 text-[11px] leading-relaxed text-warning">
        Pembacaan file Excel menunggu Edge Function <code>parse-sps</code>. Baris di bawah adalah contoh data, bukan isi file Anda — unggah
        <strong>.csv</strong> untuk mencoba impor sungguhan.
      </p>
      <div class="max-h-64 overflow-auto rounded-xl border border-line">
        <div :class="GRID" class="sticky top-0 h-9 items-center border-b border-line-soft bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
          <span>Nama</span><span>NIM</span><span>Jenis</span><span>Pembimbing 1</span><span>Pembimbing 2</span><span>Status</span>
        </div>
        <ul>
          <li v-for="b in baris" :key="b.nim" :class="GRID" class="min-h-11 items-center border-b border-line-soft py-1.5 text-[11px] text-[#0f172a] last:border-b-0">
            <span class="pr-2 leading-tight font-medium">{{ b.nama }}</span>
            <span class="font-mono text-[#64748b]">{{ b.nim }}</span>
            <span>{{ b.jenis === "sempro" ? "Sempro" : "Semhas" }}</span>
            <span class="truncate pr-2">{{ b.pembimbing1 || "—" }}</span>
            <span class="truncate pr-2">{{ b.pembimbing2 || "—" }}</span>
            <span><span class="rounded px-1.5 py-0.5 text-[10px] font-semibold" :class="b.status === 'nonaktif' ? 'bg-line-soft text-meta' : 'bg-[#dcfce7] text-[#16a34a]'">{{ b.status === "nonaktif" ? "Non-aktif" : "Aktif" }}</span></span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 3) selesai -->
    <div v-else class="py-6 text-center">
      <span class="mx-auto flex size-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]"><UiIcon nama="check" class="size-7" /></span>
      <h3 class="mt-4 text-lg font-semibold text-[#0f172a]">Import selesai</h3>
      <p class="mt-1 text-sm text-[#64748b]">
        {{ hasil.masuk }} data berhasil ditambahkan<template v-if="hasil.dilewati > 0">, {{ hasil.dilewati }} dilewati karena NIM sudah terdaftar</template>.
      </p>
    </div>

    <template #footer>
      <template v-if="langkah === 1">
        <UiButton variant="abu" bentuk="kotak" @click="emit('update:modelValue', false)">Batal</UiButton>
      </template>
      <template v-else-if="langkah === 2">
        <button type="button" class="mr-auto flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a]" @click="reset"><UiIcon nama="arrow-left" class="size-4" /> Ganti File</button>
        <UiButton variant="abu" bentuk="kotak" @click="emit('update:modelValue', false)">Batal</UiButton>
        <UiButton variant="sky" :disabled="baris.length === 0" @click="imporSemua"><UiIcon nama="upload" class="size-4" /> Import {{ baris.length }} Data</UiButton>
      </template>
      <UiButton v-else variant="sky" @click="emit('update:modelValue', false)">Selesai</UiButton>
    </template>
  </UiModalDialog>
</template>

<script setup lang="ts">
import type { BarisImpor } from "~/composables/useAdminMahasiswa";
import type { JenisSingkat } from "~/types/domain";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const { imporBaris } = useAdminMahasiswa();
const toast = useAppToast();

const LANGKAH = ["Upload", "Preview", "Selesai"];
const GRID = "grid grid-cols-[minmax(0,1fr)_88px_58px_minmax(0,1fr)_minmax(0,1fr)_62px] gap-x-2 px-3";

const langkah = ref(1);
const seret = ref(false);
const galat = ref("");
const namaFile = ref("");
const baris = ref<BarisImpor[]>([]);
const contoh = ref(false); // true = pratinjau berisi data contoh (file Excel belum bisa dibaca di FE)
const hasil = reactive({ masuk: 0, dilewati: 0 });

// TODO(BE parse-sps): ganti dengan hasil Edge Function untuk .xlsx/.xls
const CONTOH: BarisImpor[] = [
  { nama: "Irfan Hakim", nim: "2022001001", jenis: "sempro", pembimbing1: "Prof. Budi Santoso", pembimbing2: "Dr. Dewi Lestari", status: "aktif" },
  { nama: "Jasmine Putri", nim: "2022001002", jenis: "sempro", pembimbing1: "Dr. Ahmad Fauzi", pembimbing2: "Dr. Sari Dewi", status: "aktif" },
  { nama: "Kelvin Santoso", nim: "2021001045", jenis: "semhas", pembimbing1: "Dr. Hendra Wijaya", pembimbing2: "Dr. Nurul Hidayati", status: "aktif" },
];

watch(
  () => props.modelValue,
  (buka) => {
    if (buka) reset();
  },
);

function reset() {
  langkah.value = 1;
  galat.value = "";
  namaFile.value = "";
  baris.value = [];
  contoh.value = false;
  seret.value = false;
}

const normalisasiJenis = (t: string): JenisSingkat => (/hasil|semhas/i.test(t) ? "semhas" : "sempro");

function parseCsv(teks: string): BarisImpor[] {
  const rows = teks.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
  if (rows.length < 2) return [];
  const pemisah = rows[0].includes(";") && !rows[0].includes(",") ? ";" : ",";
  const sel = (l: string) => l.split(pemisah).map((c) => c.trim().replace(/^"|"$/g, ""));
  const kepala = sel(rows[0]).map((h) => h.toLowerCase());
  const kolom = (nama: string) => kepala.findIndex((h) => h === nama);
  const iNama = kolom("nama");
  const iNim = kolom("nim");
  const iJenis = kolom("jenis");
  const iP1 = kolom("pembimbing 1");
  const iP2 = kolom("pembimbing 2");
  const iStatus = kolom("status");
  if (iNama < 0 || iNim < 0) return [];
  return rows
    .slice(1)
    .map(sel)
    .filter((c) => c[iNama] && c[iNim])
    .map((c) => ({
      nama: c[iNama],
      nim: c[iNim],
      jenis: normalisasiJenis(iJenis >= 0 ? c[iJenis] : ""),
      pembimbing1: iP1 >= 0 ? c[iP1] : "",
      pembimbing2: iP2 >= 0 ? c[iP2] : "",
      status: iStatus >= 0 && /non/i.test(c[iStatus]) ? ("nonaktif" as const) : ("aktif" as const),
    }));
}

async function proses(file: File) {
  galat.value = "";
  const ekstensi = file.name.split(".").pop()?.toLowerCase();
  if (!ekstensi || !["csv", "xlsx", "xls"].includes(ekstensi)) {
    galat.value = "Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv.";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    galat.value = "Ukuran file maksimal 10 MB.";
    return;
  }
  if (ekstensi === "csv") {
    const hasilBaca = parseCsv(await file.text());
    if (hasilBaca.length === 0) {
      galat.value = "Tidak ada data yang bisa dibaca. Pastikan baris pertama berisi kolom Nama dan NIM.";
      return;
    }
    baris.value = hasilBaca;
    contoh.value = false;
  } else {
    baris.value = CONTOH.map((b) => ({ ...b }));
    contoh.value = true;
  }
  namaFile.value = file.name;
  langkah.value = 2;
}

function onPilih(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) proses(input.files[0]);
  input.value = "";
}

function onDrop(e: DragEvent) {
  seret.value = false;
  if (e.dataTransfer?.files?.[0]) proses(e.dataTransfer.files[0]);
}

function unduhTemplate() {
  const isi = "Nama,NIM,Jenis,Pembimbing 1,Pembimbing 2,Status\nContoh Mahasiswa,11230001,Sempro,Dr. Sari Dewi,Dr. Ahmad Fauzi,Aktif\n";
  const url = URL.createObjectURL(new Blob([isi], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "template-mahasiswa.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function imporSemua() {
  const masuk = imporBaris(baris.value);
  hasil.masuk = masuk;
  hasil.dilewati = baris.value.length - masuk;
  langkah.value = 3;
  if (masuk > 0) toast.sukses("Import berhasil", `${masuk} mahasiswa ditambahkan`);
}
</script>
