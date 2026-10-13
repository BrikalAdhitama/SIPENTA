<template>
  <!-- Admin · Penjadwalan (web): wizard 4 langkah — Figma. Versi mobile: AdminMobilePenjadwalanMobile. -->
  <div class="pt-8 pr-10 pb-12 pl-9">
    <h1 class="text-center text-[22px] font-medium text-primary-900">Langkah {{ langkah }} dari 4: {{ LANGKAH[langkah - 1] }}</h1>

    <!-- stepper -->
    <ol class="mx-auto mt-6 grid max-w-250 grid-cols-4" aria-label="Langkah penjadwalan">
      <li v-for="(nama, i) in LANGKAH" :key="nama" class="relative flex flex-col items-center gap-3" :aria-current="langkah === i + 1 ? 'step' : undefined">
        <span v-if="i < LANGKAH.length - 1" class="absolute top-5 left-1/2 h-0.5 w-full" :class="langkah > i + 1 ? 'bg-primary-900' : 'bg-[#d8dbe0]'" aria-hidden="true" />
        <span
          class="relative z-10 flex size-10 items-center justify-center rounded-full text-lg"
          :class="langkah === i + 1 ? 'bg-primary-900 text-white' : langkah > i + 1 ? 'border border-primary-900 bg-primary-100 text-primary-900' : 'border-2 border-[#d0d5dd] bg-white text-[#c4c9d1]'"
        >
          <UiIcon v-if="langkah > i + 1" nama="check" class="size-5" />
          <template v-else>{{ String(i + 1).padStart(2, "0") }}</template>
        </span>
        <span class="text-base" :class="langkah === i + 1 ? 'font-medium text-primary-900' : langkah > i + 1 ? 'text-[#0f172a]' : 'text-[#b6bcc8]'">{{ nama }}</span>
      </li>
    </ol>

    <!-- ═══════════ 1 · UPLOAD SPS ═══════════ -->
    <div v-if="langkah === 1" class="mt-9">
      <h2 class="text-2xl font-bold text-[#0f172a]">Buat Penjadwalan Baru</h2>
      <p class="mt-0.5 text-[15px] text-[#64748b]">Pilih jenis seminar lalu unggah file SPS untuk memulai.</p>

      <section :class="KARTU" class="mt-6">
        <h3 class="flex items-center gap-3 text-xl font-semibold text-[#0f172a]"><span :class="NOMOR">1</span>Pilih Jenis Seminar</h3>
        <div class="mt-4 grid grid-cols-2 gap-5" role="radiogroup" aria-label="Jenis seminar">
          <label
            v-for="j in JENIS_OPSI"
            :key="j.nilai"
            class="flex cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-3.5 transition-colors"
            :class="jenis === j.nilai ? 'border-primary-900 bg-primary-100' : 'border-line bg-[#f8fafc] hover:border-primary-200'"
          >
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg" :class="j.nilai === 'sempro' ? 'bg-sempro-soft text-sempro' : 'bg-semhas-soft text-semhas'"><UiIcon nama="file" class="size-5" /></span>
            <span class="min-w-0 flex-1">
              <span class="block text-base font-semibold text-[#334155]">{{ j.judul }}</span>
              <span class="block text-sm text-[#64748b]">Durasi {{ DURASI_SINGKAT[j.nilai] }} menit per sesi</span>
            </span>
            <input v-model="jenis" type="radio" name="jenis-seminar" :value="j.nilai" class="sr-only" />
            <span class="flex size-6 shrink-0 items-center justify-center rounded-full" :class="jenis === j.nilai ? 'bg-primary-900 text-white' : 'border-2 border-[#cbd5e1] bg-white'">
              <UiIcon v-if="jenis === j.nilai" nama="check" class="size-3.5" />
            </span>
          </label>
        </div>
      </section>

      <h3 class="mt-7 flex items-center gap-3 text-xl font-semibold text-[#0f172a]">
        <span :class="NOMOR">2</span>Upload File SPS<template v-if="jenis"> — {{ JENIS_RINGKAS[jenis] }}</template>
      </h3>
      <div class="mt-4 grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
        <div>
          <div v-if="berkas" class="flex h-64 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-primary-900 bg-primary-100 text-center">
            <span class="mb-2 flex size-14 items-center justify-center rounded-xl bg-primary-200/70 text-primary-900"><UiIcon nama="sheet" class="size-7" /></span>
            <p class="text-sm font-semibold text-primary-900">{{ berkas.nama }}</p>
            <p class="text-xs text-primary-900">{{ peserta.length }} baris data terdeteksi · {{ berkas.ukuran }}</p>
            <button type="button" class="mt-0.5 text-xs text-[#64748b] underline hover:text-primary-900" @click="hapusBerkas">Ganti file</button>
          </div>
          <template v-else>
            <label
              class="flex h-64 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-6 text-center transition-colors"
              :class="[!jenis ? 'cursor-not-allowed border-line bg-[#f8fafc] opacity-60' : 'cursor-pointer', jenis && seret ? 'border-primary-500 bg-primary-50' : jenis ? 'border-primary-900/60 hover:bg-primary-50/60' : '']"
              @dragover.prevent="jenis && (seret = true)"
              @dragleave.prevent="seret = false"
              @drop.prevent="onDrop"
            >
              <input type="file" accept=".xlsx,.xls" class="sr-only" :disabled="!jenis" @change="onPilihFile" />
              <span class="mb-2 flex size-14 items-center justify-center rounded-xl bg-[#f1f5f9] text-[#94a3b8]"><UiIcon nama="cloud-upload" class="size-7" /></span>
              <p class="text-[15px] font-semibold text-[#334155]">{{ jenis ? "Drag & drop file Excel di sini" : "Pilih jenis seminar terlebih dahulu" }}</p>
              <p v-if="jenis" class="text-sm text-[#64748b]">atau <span class="font-medium text-primary-500">klik untuk memilih file</span> (.xlsx, .xls — maks. 10 MB)</p>
            </label>
            <p v-if="galatFile" class="mt-3 rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">{{ galatFile }}</p>
          </template>
          <UiButton variant="sky" bentuk="kotak" class="mt-5 !h-12 w-full !text-base" :disabled="!jenis || !berkas" @click="ke(2)">Lanjutkan ke Preview &amp; Validasi <UiIcon nama="arrow-right" class="size-4.5" /></UiButton>
        </div>

        <aside :class="KARTU">
          <h4 class="text-lg font-semibold text-[#0f172a]">Format Data SPS</h4>
          <p class="mt-2 text-sm text-[#64748b]">Pastikan file Excel memiliki kolom berikut:</p>
          <ol class="mt-3 flex flex-col gap-2.5 text-sm text-[#334155]">
            <li v-for="(k, i) in KOLOM_SPS" :key="k" class="flex items-center gap-3"><span class="flex size-5 items-center justify-center rounded bg-primary-900 text-xs font-semibold text-white">{{ i + 1 }}</span>{{ k }}</li>
          </ol>
          <p class="mt-4 flex items-center gap-2 rounded-lg bg-primary-100 px-3 py-2 text-[13px] text-primary-900"><UiIcon nama="info" class="size-4 shrink-0" /> Penguji dipilih manual di langkah berikutnya</p>
          <div class="mt-3 flex justify-center"><UiButton variant="abu" bentuk="kotak" class="!text-primary-900" @click="unduhTemplate">Download Template Excel</UiButton></div>
        </aside>
      </div>
    </div>

    <!-- ═══════════ 2 · PREVIEW & VALIDASI ═══════════ -->
    <div v-else-if="langkah === 2" class="mt-9">
      <h2 class="text-2xl font-bold text-[#0f172a]">Preview &amp; Validasi Data</h2>
      <p class="mt-0.5 text-[15px] text-[#64748b]">Data {{ jenis ? JENIS_RINGKAS[jenis] : "" }} — periksa dan tetapkan penguji sebelum melanjutkan</p>

      <p class="mt-3 rounded-lg bg-warning/10 px-3.5 py-2 text-xs leading-relaxed text-warning">
        Pembacaan file SPS menunggu Edge Function <code>parse-sps</code>. Data di bawah adalah contoh, bukan isi file Anda.
      </p>

      <UiStatStrip class="mt-4" kapital :items="[
        { label: 'Total Data', nilai: hitung.total, ikon: 'users' },
        { label: 'Valid', nilai: hitung.valid, ikon: 'briefcase' },
        { label: 'Invalid', nilai: hitung.invalid, ikon: 'check-circle' },
        { label: 'Duplikat', nilai: hitung.duplikat, ikon: 'share' },
      ]" />

      <div v-if="hitung.invalid + hitung.duplikat > 0" class="mt-3 flex items-center gap-4 rounded-xl border border-[#fde68a] bg-[#fef9c3] px-5 py-3.5 text-[#78350f]">
        <UiIcon nama="alert" class="size-8 shrink-0" />
        <div>
          <p class="text-base font-semibold">Ditemukan {{ hitung.invalid }} data invalid dan {{ hitung.duplikat }} data duplikat</p>
          <p class="text-sm">Perbaiki data tersebut sebelum melanjutkan atau hapus data bermasalah.</p>
        </div>
      </div>
      <p class="mt-3 flex items-center gap-3.5 rounded-xl border border-[#c7d2fe] bg-[#eef2ff] px-5 py-3.5 text-sm text-[#3730a3]">
        <UiIcon nama="info" class="size-6 shrink-0" />
        <span>Pilih <strong>Penguji 1 dan Penguji 2</strong> secara manual untuk setiap mahasiswa. Penguji tidak boleh sama dengan pembimbing. Klik dropdown di kolom Penguji untuk memilih.</span>
      </p>

      <section class="mt-5 rounded-2xl border border-line bg-white px-6 pt-4 pb-2">
        <div :class="GRID_PREVIEW" class="h-12 items-center border-b border-line-soft text-sm font-medium text-black">
          <span>No</span><span>NIM</span><span>Nama Mahasiswa</span><span>Jenis</span><span>Pembimbing 1</span><span>Pembimbing 2</span><span class="text-center">Penguji 1</span><span class="text-center">Penguji 2</span><span class="text-center">Daring</span><span class="text-center">Status</span>
        </div>
        <ul>
          <li v-for="(b, i) in baris" :key="b.p.id" :class="GRID_PREVIEW" class="min-h-13 items-center border-b border-line-soft py-1.5 text-[13px] text-black last:border-b-0">
            <span>{{ i + 1 }}</span>
            <span>{{ b.p.nim }}</span>
            <span class="truncate pr-2">{{ b.p.nama }}</span>
            <span>{{ jenis ? JENIS_RINGKAS[jenis] : "" }}</span>
            <span class="truncate pr-2">{{ b.p.pembimbing1 }}</span>
            <span class="truncate pr-2">{{ b.p.pembimbing2 }}</span>
            <select v-model="b.p.penguji1" :class="SELECT_TABEL" :aria-label="`Penguji 1 ${b.p.nama}`">
              <option value="">— Pilih —</option>
              <option v-for="n in opsiPenguji(b.p, 'penguji1')" :key="n" :value="n">{{ n }}</option>
            </select>
            <select v-model="b.p.penguji2" :class="SELECT_TABEL" :aria-label="`Penguji 2 ${b.p.nama}`">
              <option value="">— Pilih —</option>
              <option v-for="n in opsiPenguji(b.p, 'penguji2')" :key="n" :value="n">{{ n }}</option>
            </select>
            <div class="flex justify-center">
              <button
                type="button"
                role="switch"
                :aria-checked="b.p.daring"
                :aria-label="`Seminar daring ${b.p.nama}`"
                class="relative h-6.5 w-14 rounded-full text-[11px] font-semibold transition-colors"
                :class="b.p.daring ? 'bg-primary-100 text-primary-900' : 'bg-primary-900 text-white'"
                @click="b.p.daring = !b.p.daring"
              >
                <span class="absolute top-1/2 -translate-y-1/2" :class="b.p.daring ? 'left-2.5' : 'right-2'">{{ b.p.daring ? "ON" : "OFF" }}</span>
                <span class="absolute top-0.75 size-5 rounded-full bg-white shadow transition-all" :class="b.p.daring ? 'right-0.75' : 'left-0.75'" />
              </button>
            </div>
            <div class="text-center" :title="b.catatan">
              <UiStatusChip :tone="b.status === 'valid' ? 'success' : b.status === 'invalid' ? 'danger' : 'warning'">{{ LABEL_VALIDASI[b.status] }}</UiStatusChip>
            </div>
          </li>
          <li v-if="baris.length === 0" class="py-12 text-center text-sm text-meta">Tidak ada data. Kembali dan unggah file lain.</li>
        </ul>
      </section>

      <div class="mt-5 flex items-center justify-between gap-4">
        <UiButton variant="secondary" bentuk="kotak" @click="ke(1)"><UiIcon nama="arrow-left" class="size-4" /> Kembali</UiButton>
        <p v-if="!siapLangkah2" class="ml-auto text-[13px] text-meta">{{ kekuranganLangkah2 }}</p>
        <UiButton variant="sky" bentuk="kotak" :disabled="!siapLangkah2" @click="ke(3)">Lanjutkan <UiIcon nama="arrow-right" class="size-4" /></UiButton>
      </div>
    </div>

    <!-- ═══════════ 3 · KONFIGURASI ═══════════ -->
    <div v-else-if="langkah === 3" class="mt-9">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-[#0f172a]">Pengaturan Penjadwalan</h2>
          <p class="mt-0.5 text-[15px] text-[#64748b]">Konfigurasi parameter untuk proses generate jadwal</p>
        </div>
        <span class="inline-flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900"><UiIcon nama="file" class="size-4" /> {{ jenis ? JENIS_RINGKAS[jenis] : "" }} — {{ durasi }} menit/sesi</span>
      </div>

      <section :class="KARTU" class="mt-5">
        <h3 class="text-base font-semibold text-[#0f172a]">Nama Jadwal</h3>
        <input v-model="config.nama" type="text" aria-label="Nama Jadwal" :placeholder="`cth. Jadwal ${jenis ? JENIS_RINGKAS[jenis] : 'Sempro'} Ganjil 2025/2026`" :class="INPUT_CLASS" class="mt-3" />
        <p class="mt-2 text-xs text-[#94a3b8]">Nama ini akan muncul di daftar jadwal setelah generate selesai.</p>
      </section>

      <div class="mt-4 grid grid-cols-[minmax(0,1fr)_280px] items-start gap-6">
        <div class="flex flex-col gap-4">
          <section :class="KARTU">
            <h3 class="text-base font-semibold text-[#0f172a]">Periode Penjadwalan</h3>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <UiFormField label="Tanggal Mulai" untuk="cfg-mulai" gaya="b"><input id="cfg-mulai" v-model="config.mulai" type="date" :class="INPUT_CLASS" /></UiFormField>
              <UiFormField label="Tanggal Selesai" untuk="cfg-selesai" gaya="b" :galat="periodeTerbalik ? 'Tanggal selesai harus sama atau setelah tanggal mulai.' : ''">
                <input id="cfg-selesai" v-model="config.selesai" type="date" :min="config.mulai || undefined" :class="INPUT_CLASS" />
              </UiFormField>
            </div>
          </section>

          <section :class="KARTU">
            <h3 class="text-base font-semibold text-[#0f172a]">Hari Pelaksanaan</h3>
            <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <label v-for="h in HARI_KERJA" :key="h" class="flex cursor-pointer items-center gap-2 text-sm text-[#334155]">
                <input type="checkbox" class="size-4 accent-primary-900" :checked="config.hari.includes(h)" @change="toggle(config.hari, h)" /> {{ HARI_LABEL[h] }}
              </label>
            </div>
          </section>

          <section :class="KARTU">
            <h3 class="text-base font-semibold text-[#0f172a]">Waktu Pelaksanaan</h3>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <UiFormField label="Jam Mulai" untuk="cfg-jam-mulai" gaya="b"><input id="cfg-jam-mulai" v-model="config.jamMulai" type="time" :class="INPUT_CLASS" /></UiFormField>
              <UiFormField label="Jam Selesai" untuk="cfg-jam-selesai" gaya="b" :galat="jamTerbalik ? 'Jam selesai harus setelah jam mulai.' : ''">
                <input id="cfg-jam-selesai" v-model="config.jamSelesai" type="time" :class="INPUT_CLASS" />
              </UiFormField>
              <UiFormField label="Jeda Antar Seminar (menit)" untuk="cfg-jeda" gaya="b"><input id="cfg-jeda" v-model.number="config.jeda" type="number" min="0" step="5" :class="INPUT_CLASS" /></UiFormField>
              <UiFormField label="Durasi per Sesi" gaya="b"><p class="flex h-11 items-center rounded-xl bg-primary-100 px-4 font-mono text-sm text-primary-900">{{ durasi }} menit</p></UiFormField>
            </div>
          </section>

          <section :class="KARTU">
            <h3 class="text-base font-semibold text-[#0f172a]">Ruangan</h3>
            <div class="mt-3 flex flex-wrap gap-2.5">
              <label
                v-for="r in opsiRuangan"
                :key="r"
                class="flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors"
                :class="config.ruangan.includes(r) ? 'border-primary-900 bg-primary-100 text-primary-900' : 'border-line bg-[#f8fafc] text-[#64748b] hover:border-primary-200'"
              >
                <input type="checkbox" class="size-4 accent-primary-900" :checked="config.ruangan.includes(r)" @change="toggle(config.ruangan, r)" /> {{ r }}
              </label>
            </div>
          </section>
        </div>

        <aside :class="KARTU" class="sticky top-6">
          <h3 class="text-sm font-semibold text-[#0f172a]">Ringkasan</h3>
          <dl class="mt-4 flex flex-col gap-3 text-sm">
            <div v-for="[label, nilai] in ringkasan" :key="label" class="flex items-center justify-between gap-4">
              <dt class="text-[#64748b]">{{ label }}</dt>
              <dd class="font-mono font-medium text-[#0f172a]">{{ nilai }}</dd>
            </div>
          </dl>
          <p v-if="slotKurang" class="mt-4 rounded-lg bg-warning/10 px-3 py-2 text-xs leading-relaxed text-warning">
            Slot tersedia ({{ slotTersedia }}) lebih sedikit dari jumlah seminar ({{ jumlahJadwal }}). Sebagian seminar tidak akan terjadwal — tambah hari, jam, atau ruangan.
          </p>
        </aside>
      </div>

      <div class="mt-5 flex items-center justify-between gap-4">
        <UiButton variant="secondary" bentuk="kotak" @click="ke(2)"><UiIcon nama="arrow-left" class="size-4" /> Kembali</UiButton>
        <p v-if="kekuranganLangkah3" class="ml-auto text-[13px] text-meta">{{ kekuranganLangkah3 }}</p>
        <UiButton variant="sky" bentuk="kotak" :disabled="!!kekuranganLangkah3" @click="ke(4)">Lanjutkan ke Generate <UiIcon nama="arrow-right" class="size-4" /></UiButton>
      </div>
    </div>

    <!-- ═══════════ 4 · GENERATE ═══════════ -->
    <div v-else class="mx-auto mt-8 max-w-xl text-center">
      <template v-if="tahap === 'awal'">
        <span class="mx-auto flex size-19 items-center justify-center rounded-2xl bg-primary-100 text-primary-900"><UiIcon nama="bolt" class="size-9" /></span>
        <h2 class="mt-6 text-[26px] font-bold text-[#0f172a]">Siap Generate Jadwal?</h2>
        <p class="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[#64748b]">Sistem akan menjalankan Genetic Algorithm untuk menghasilkan jadwal seminar yang optimal dan bebas konflik.</p>
        <dl class="mx-auto mt-7 flex max-w-lg flex-col divide-y divide-line-soft rounded-2xl border border-line bg-[#f8fafc] px-5 py-2 text-left text-sm">
          <div v-for="[label, nilai] in ringkasanFinal" :key="label" class="flex items-center justify-between gap-6 py-3">
            <dt class="text-[#64748b]">{{ label }}</dt>
            <dd class="font-semibold text-[#0f172a]">{{ nilai }}</dd>
          </div>
        </dl>
        <button type="button" class="mt-14 h-13.5 w-full max-w-lg rounded-2xl bg-linear-to-r from-primary-900 to-primary-500 text-base font-bold tracking-wide text-white shadow-md transition-opacity hover:opacity-90" @click="mulaiGenerate">GENERATE JADWAL</button>
        <button type="button" class="mx-auto mt-4 flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a]" @click="ke(3)"><UiIcon nama="arrow-left" class="size-4" /> Kembali ke Konfigurasi</button>
      </template>

      <template v-else>
        <div class="mt-14">
          <div v-if="tahap === 'jalan'" class="mx-auto size-15 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" role="status" aria-label="Memproses" />
          <span v-else class="mx-auto flex size-15 items-center justify-center rounded-full bg-[#dcfce7] text-[#059669]"><UiIcon nama="check" class="size-7" /></span>
          <h2 class="mt-5 text-xl font-bold" :class="tahap === 'selesai' ? 'text-[#059669]' : 'text-[#0f172a]'">{{ tahap === "selesai" ? "Optimization Complete!" : "Menjalankan Genetic Algorithm" }}</h2>
          <p class="mt-1 text-sm text-[#64748b]">{{ tahap === "selesai" ? "Jadwal optimal berhasil dihasilkan" : "Mohon tunggu, proses sedang berjalan..." }}</p>
          <div class="mx-auto mt-6 max-w-md text-left">
            <div class="mb-1.5 flex justify-between text-xs text-[#94a3b8]"><span>Progress</span><span>{{ progres }}%</span></div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]" role="progressbar" :aria-valuenow="progres" aria-valuemin="0" aria-valuemax="100">
              <div class="h-full rounded-full bg-linear-to-r from-primary-900 to-primary-500 transition-[width]" :style="{ width: `${progres}%` }" />
            </div>
          </div>
        </div>

        <div v-if="tahap === 'selesai'" class="mx-auto mt-12 max-w-md rounded-2xl border border-primary-200 bg-primary-100 p-4 text-left">
          <h3 class="text-sm font-bold text-primary-900">Jadwal siap disimpan</h3>
          <p class="mt-0.5 text-xs text-primary-500">“{{ config.nama }}” akan otomatis tersimpan ke daftar jadwal.</p>
          <p v-if="hasil.length < jumlahJadwal" class="mt-2 text-xs text-warning">{{ jumlahJadwal - hasil.length }} seminar belum mendapat slot (kapasitas kurang).</p>
          <UiButton variant="sky" bentuk="kotak" class="mt-3 w-full !h-12" @click="simpanDanLihat">Simpan &amp; Lihat Jadwal <UiIcon nama="arrow-right" class="size-4" /></UiButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HARI_LABEL } from "~/composables/useAdminDosen";
import type { SeminarJadwal } from "~/composables/useAdminJadwal";
import { DURASI_SINGKAT, HARI_KERJA, type HariKerja, type JenisSingkat } from "~/types/domain";
import { formatRentangTanggal } from "~/utils/format";
import { INPUT_CLASS } from "~/utils/ui";

const { aktif: dosenAktif } = useAdminDosen();
const { aktif: ruanganAktif } = useAdminRuangan();
const { tambahRun } = useAdminJadwal();
const toast = useAppToast();

const LANGKAH = ["Upload SPS", "Preview & Validasi", "Konfigurasi", "Generate"];
const KOLOM_SPS = ["NIM", "Nama Mahasiswa", "Judul", "Dosen Pembimbing"];
const KARTU = "rounded-2xl border border-line bg-white p-5";
const NOMOR = "inline-flex size-8 items-center justify-center rounded-full bg-primary-900 text-base font-semibold text-white";
const SELECT_TABEL = "h-8.5 w-full min-w-0 rounded-lg border border-[#d5dbe5] bg-white px-2 text-xs text-[#334155] outline-none focus:border-primary-500";
const GRID_PREVIEW = "grid grid-cols-[34px_92px_minmax(0,1.15fr)_66px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)_72px_84px] gap-x-3";

const JENIS_OPSI: { nilai: JenisSingkat; judul: string }[] = [
  { nilai: "sempro", judul: "Sempro — Seminar Proposal" },
  { nilai: "semhas", judul: "Semhas — Seminar Hasil" },
];
const JENIS_RINGKAS: Record<JenisSingkat, string> = { sempro: "Sempro", semhas: "Semhas" };

const langkah = ref(1);

function ke(n: number) {
  langkah.value = n;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ───────── Langkah 1 · jenis + file ─────────
interface PesertaSps {
  id: number;
  nama: string;
  nim: string;
  pembimbing1: string;
  pembimbing2: string;
  penguji1: string;
  penguji2: string;
  daring: boolean;
}

const jenis = ref<JenisSingkat | null>(null);
const berkas = ref<{ nama: string; ukuran: string } | null>(null);
const peserta = ref<PesertaSps[]>([]);
const seret = ref(false);
const galatFile = ref("");

// TODO(BE parse-sps): ganti dengan hasil Edge Function yang membaca sheet pendaftaran SPS.
const contohPeserta = (): PesertaSps[] => [
  { id: 1, nama: "Andi Pratama", nim: "11231099", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "", daring: true },
  { id: 2, nama: "Cakra Nugroho", nim: "11231107", pembimbing1: "Prof. Budi Santoso", pembimbing2: "Dr. Sari Dewi", penguji1: "", penguji2: "", daring: false },
  { id: 3, nama: "Dina Mariana", nim: "11231100", pembimbing1: "Dr. Ahmad Fauzi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "", daring: false },
  { id: 4, nama: "Andi Pratama", nim: "11231099", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "", daring: true },
  { id: 5, nama: "Gita Permata", nim: "11231118", pembimbing1: "Dr. Dewi Lestari", pembimbing2: "Dr. Iwan Setiawan", penguji1: "", penguji2: "", daring: false },
];

function ukuranTeks(byte: number) {
  return byte < 1024 * 1024 ? `${Math.max(1, Math.round(byte / 1024))} KB` : `${(byte / 1024 / 1024).toFixed(1)} MB`;
}

function terimaFile(file: File) {
  galatFile.value = "";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext !== "xlsx" && ext !== "xls") {
    galatFile.value = "Format file tidak didukung. Gunakan .xlsx atau .xls.";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    galatFile.value = "Ukuran file maksimal 10 MB.";
    return;
  }
  berkas.value = { nama: file.name, ukuran: ukuranTeks(file.size) };
  peserta.value = contohPeserta();
}

function onPilihFile(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) terimaFile(input.files[0]);
  input.value = "";
}

function onDrop(e: DragEvent) {
  seret.value = false;
  if (jenis.value && e.dataTransfer?.files?.[0]) terimaFile(e.dataTransfer.files[0]);
}

function hapusBerkas() {
  berkas.value = null;
  peserta.value = [];
}

function unduhTemplate() {
  const url = URL.createObjectURL(new Blob([`${KOLOM_SPS.map((k) => (k === "Dosen Pembimbing" ? k : k)).join(",")}\n`], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "template-sps.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.sukses("Template diunduh", "template-sps.csv");
}

// ───────── Langkah 2 · validasi + penguji ─────────
type Validasi = "valid" | "invalid" | "duplikat";
const LABEL_VALIDASI: Record<Validasi, string> = { valid: "Valid", invalid: "Invalid", duplikat: "Duplikat" };

// status diturunkan dari isi baris
const baris = computed(() =>
  peserta.value.map((p, i) => {
    let status: Validasi = "valid";
    let catatan = "";
    if (peserta.value.findIndex((x) => x.nim === p.nim) !== i) {
      status = "duplikat";
      catatan = "NIM sudah ada di baris sebelumnya";
    } else if (!p.pembimbing1 || !p.pembimbing2) {
      status = "invalid";
      catatan = "Pembimbing belum lengkap";
    } else if (p.pembimbing1 === p.pembimbing2) {
      status = "invalid";
      catatan = "Pembimbing 1 dan 2 tidak boleh sama";
    }
    return { p, status, catatan };
  }),
);

const hitung = computed(() => ({
  total: baris.value.length,
  valid: baris.value.filter((b) => b.status === "valid").length,
  invalid: baris.value.filter((b) => b.status === "invalid").length,
  duplikat: baris.value.filter((b) => b.status === "duplikat").length,
}));

// hanya baris Valid yang ikut dijadwalkan
const pesertaValid = computed(() => baris.value.filter((b) => b.status === "valid").map((b) => b.p));
const jumlahJadwal = computed(() => pesertaValid.value.length);

// penguji tidak boleh sama dengan pembimbing maupun penguji lainnya
function opsiPenguji(p: PesertaSps, field: "penguji1" | "penguji2") {
  const lain = field === "penguji1" ? p.penguji2 : p.penguji1;
  const nama = dosenAktif.value.map((d) => d.nama).filter((n) => n !== p.pembimbing1 && n !== p.pembimbing2 && n !== lain);
  return p[field] && !nama.includes(p[field]) ? [p[field], ...nama] : nama;
}

const pengujiBelumLengkap = computed(() => pesertaValid.value.filter((p) => !p.penguji1 || !p.penguji2).length);
const siapLangkah2 = computed(() => jumlahJadwal.value > 0 && pengujiBelumLengkap.value === 0);
const kekuranganLangkah2 = computed(() =>
  jumlahJadwal.value === 0 ? "Belum ada data valid untuk dijadwalkan." : `${pengujiBelumLengkap.value} mahasiswa valid belum memiliki Penguji 1 dan 2.`,
);

// ───────── Langkah 3 · konfigurasi ─────────
const config = reactive({
  nama: "",
  mulai: "",
  selesai: "",
  hari: ["senin", "selasa", "rabu", "kamis"] as HariKerja[],
  jamMulai: "",
  jamSelesai: "",
  jeda: 10,
  ruangan: [] as string[],
});

const durasi = computed(() => DURASI_SINGKAT[jenis.value ?? "sempro"]);
const jedaMenit = computed(() => (Number.isFinite(config.jeda) && config.jeda > 0 ? config.jeda : 0));
const opsiRuangan = computed(() => [...ruanganAktif.value.map((r) => r.kode), "Daring"]);

function toggle<T>(arr: T[], nilai: T) {
  const i = arr.indexOf(nilai);
  if (i === -1) arr.push(nilai);
  else arr.splice(i, 1);
}

const menit = (jam: string) => {
  const [h, m] = jam.split(":").map(Number);
  return h * 60 + m;
};
const jamTeks = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const isoTanggal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const periodeTerbalik = computed(() => !!config.mulai && !!config.selesai && config.selesai < config.mulai);
const jamTerbalik = computed(() => !!config.jamMulai && !!config.jamSelesai && config.jamSelesai <= config.jamMulai);

/** Tanggal pelaksanaan: hari dalam periode yang termasuk hari terpilih (maks. 366 hari). */
const tanggalAktif = computed(() => {
  if (!config.mulai || !config.selesai || periodeTerbalik.value) return [];
  const [y, m, d] = config.mulai.split("-").map(Number);
  const hasil: string[] = [];
  const t = new Date(y, m - 1, d);
  for (let i = 0; i < 366 && isoTanggal(t) <= config.selesai; i++, t.setDate(t.getDate() + 1)) {
    const idx = t.getDay() - 1; // 0 = Senin
    if (idx >= 0 && idx < HARI_KERJA.length && config.hari.includes(HARI_KERJA[idx])) hasil.push(isoTanggal(t));
  }
  return hasil;
});

/** Jumlah sesi per hari per ruangan: tiap sesi = durasi + jeda (jeda tidak dihitung setelah sesi terakhir). */
const slotPerHari = computed(() => {
  if (!config.jamMulai || !config.jamSelesai || jamTerbalik.value) return 0;
  return Math.floor((menit(config.jamSelesai) - menit(config.jamMulai) + jedaMenit.value) / (durasi.value + jedaMenit.value));
});
const slotTersedia = computed(() => tanggalAktif.value.length * config.ruangan.length * slotPerHari.value);
const slotKurang = computed(() => slotTersedia.value > 0 && slotTersedia.value < jumlahJadwal.value);

const periodeTeks = computed(() => (config.mulai && config.selesai && !periodeTerbalik.value ? formatRentangTanggal(config.mulai, config.selesai) : "—"));

const ringkasan = computed(() => [
  ["Total Seminar", `${jumlahJadwal.value}`],
  ["Ruangan Aktif", `${config.ruangan.length} ruangan`],
  ["Hari Aktif", `${config.hari.length} hari/minggu`],
]);

const kekuranganLangkah3 = computed(() => {
  if (!config.nama.trim()) return "Nama jadwal tidak boleh kosong.";
  if (!config.mulai || !config.selesai) return "Periode penjadwalan harus diisi lengkap.";
  if (periodeTerbalik.value) return "Tanggal selesai harus sama atau setelah tanggal mulai.";
  if (config.hari.length === 0) return "Pilih minimal satu hari pelaksanaan.";
  if (!config.jamMulai || !config.jamSelesai) return "Waktu pelaksanaan harus diisi lengkap.";
  if (jamTerbalik.value) return "Jam selesai harus setelah jam mulai.";
  if (slotPerHari.value === 0) return `Rentang jam terlalu pendek untuk satu sesi (${durasi.value} menit).`;
  if (config.ruangan.length === 0) return "Pilih minimal satu ruangan.";
  if (tanggalAktif.value.length === 0) return "Tidak ada tanggal yang cocok dengan hari yang dipilih.";
  return "";
});

// ───────── Langkah 4 · generate (SIMULASI) ─────────
// TODO(BE generate-schedule): panggil Edge Function → ai-service /solve. Sekarang: penempatan berurutan
// pada slot kosong supaya alur "Simpan & Lihat Jadwal" bisa dicoba end-to-end.
const tahap = ref<"awal" | "jalan" | "selesai">("awal");
const progres = ref(0);
const hasil = ref<SeminarJadwal[]>([]);
let timer: ReturnType<typeof setInterval> | null = null;

const ringkasanFinal = computed(() => [
  ["Total Seminar", `${jumlahJadwal.value}`],
  ["Periode", periodeTeks.value],
  ["Ruangan", `${config.ruangan.length} (${config.ruangan.join(", ")})`],
  ["Slot Tersedia", `${slotTersedia.value} slot`],
  ["Algoritma", "Genetic Algorithm"],
]);

function susunJadwal(): SeminarJadwal[] {
  const slot: { tanggal: string; jamMulai: string; jamSelesai: string; ruangan: string }[] = [];
  const langkahSesi = durasi.value + jedaMenit.value;
  for (const tanggal of tanggalAktif.value) {
    for (let t = menit(config.jamMulai); t + durasi.value <= menit(config.jamSelesai); t += langkahSesi) {
      for (const ruangan of config.ruangan) slot.push({ tanggal, jamMulai: jamTeks(t), jamSelesai: jamTeks(t + durasi.value), ruangan });
    }
  }
  const keluar: SeminarJadwal[] = [];
  pesertaValid.value.forEach((p, i) => {
    const s = slot[i];
    if (!s) return;
    keluar.push({
      id: i + 1,
      mahasiswa: p.nama,
      nim: p.nim,
      jenis: jenis.value ?? "sempro",
      tanggal: s.tanggal,
      jamMulai: s.jamMulai,
      jamSelesai: s.jamSelesai,
      ruangan: p.daring ? "Daring" : s.ruangan,
      approval: [
        { peran: "pembimbing_utama", dosen: p.pembimbing1, status: "menunggu" },
        { peran: "pembimbing_pendamping", dosen: p.pembimbing2, status: "menunggu" },
        { peran: "penguji_1", dosen: p.penguji1, status: "menunggu" },
        { peran: "penguji_2", dosen: p.penguji2, status: "menunggu" },
      ],
    });
  });
  return keluar;
}

function mulaiGenerate() {
  tahap.value = "jalan";
  progres.value = 0;
  timer = setInterval(() => {
    progres.value = Math.min(100, progres.value + Math.floor(Math.random() * 12) + 6);
    if (progres.value >= 100 && timer) {
      clearInterval(timer);
      timer = null;
      hasil.value = susunJadwal();
      setTimeout(() => (tahap.value = "selesai"), 400);
    }
  }, 350);
}

function simpanDanLihat() {
  const id = tambahRun({
    nama: config.nama.trim(),
    jenis: jenis.value ?? "sempro",
    mulai: config.mulai,
    selesai: config.selesai,
    total: jumlahJadwal.value,
    seminar: hasil.value,
  });
  toast.sukses("Jadwal disimpan", config.nama.trim());
  navigateTo({ path: "/admin/jadwal", query: { id } });
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>
