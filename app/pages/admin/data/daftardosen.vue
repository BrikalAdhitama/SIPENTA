<script setup lang="ts">
definePageMeta({ middleware: "role", role: "admin" });

interface Dosen {
  id: number;
  nip: string;
  nama: string;
  gelar: string;
  email: string | null;
  bidang: string | null;
  status: "aktif" | "nonaktif";
}
const EMPTY: Omit<Dosen, "id"> = { nip: "", nama: "", gelar: "", email: "", bidang: "", status: "aktif" };

// PREVIEW: data dummy nanti diganti dengan query
// Supabase ke tabel `dosen` kalo backend udah siap.
const dosens = ref<Dosen[]>([
  { id: 1, nip: "198501012010121001", nama: "Ahmad Fauzi", gelar: "M.T", email: "ahmad.fauzi@itk.ac.id", bidang: "Kecerdasan Buatan", status: "aktif" },
  { id: 2, nip: "198703152012032002", nama: "Siti Rahma", gelar: "M.Kom", email: "siti.rahma@itk.ac.id", bidang: "Jaringan Komputer", status: "aktif" },
  { id: 3, nip: "197911082008011003", nama: "Budi Hartono", gelar: "M.Sc", email: "budi.hartono@itk.ac.id", bidang: "Rekayasa Perangkat Lunak", status: "nonaktif" },
]);
const jadwalCount: Record<number, number> = { 1: 5, 2: 3, 3: 0 };

const search = ref("");
const showModal = ref(false);
const editTarget = ref<Dosen | null>(null);
const form = ref<Omit<Dosen, "id">>({ ...EMPTY });
const deleteId = ref<number | null>(null);
let nextId = 4;

const filtered = computed(() =>
  dosens.value.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.value.toLowerCase()) ||
      d.nip.includes(search.value) ||
      (d.bidang ?? "").toLowerCase().includes(search.value.toLowerCase())
  )
);

function openAdd() {
  editTarget.value = null;
  form.value = { ...EMPTY };
  showModal.value = true;
}
function openEdit(d: Dosen) {
  editTarget.value = d;
  form.value = { nip: d.nip, nama: d.nama, gelar: d.gelar, email: d.email, bidang: d.bidang, status: d.status };
  showModal.value = true;
}

function handleSave() {
  if (!form.value.nama || !form.value.nip) return;
  if (editTarget.value) {
    const idx = dosens.value.findIndex((d) => d.id === editTarget.value!.id);
    dosens.value[idx] = { id: editTarget.value.id, ...form.value };
  } else {
    dosens.value.push({ id: nextId++, ...form.value });
  }
  showModal.value = false;
}

function handleDelete(id: number) {
  dosens.value = dosens.value.filter((d) => d.id !== id);
  deleteId.value = null;
}
</script>

<template>
  <div>
    <UiPageHeader title="Data Dosen" subtitle="Master data dosen yang terlibat dalam penjadwalan seminar">
      <UiButton @click="openAdd">+ Tambah Dosen</UiButton>
    </UiPageHeader>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
      <UiStatCard label="Total Dosen" :value="dosens.length" icon="users" tone="primary" />
      <UiStatCard label="Dosen Aktif" :value="dosens.filter((d) => d.status === 'aktif').length" icon="check-circle" tone="success" />
      <UiStatCard label="Total Jadwal Mengajar" :value="Object.values(jadwalCount).reduce((a, b) => a + b, 0)" icon="calendar" tone="indigo" />
    </div>

    <input
      v-model="search"
      placeholder="Cari nama, bidang, atau NIP..."
      class="w-full mb-4 px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary"
    />

    <UiTableWrap>
      <table class="w-full text-sm min-w-175">
        <thead class="bg-slate-50">
          <tr>
            <th v-for="h in ['Nama Dosen', 'NIP', 'Email', 'Bidang Keahlian', 'Jadwal Mengajar', 'Status', 'Aksi']" :key="h"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400 border-b border-slate-200">
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="7" class="px-4 py-12 text-center text-sm text-slate-400">Tidak ada dosen ditemukan</td>
          </tr>
          <tr v-for="d in filtered" :key="d.id" class="border-b border-slate-50 hover:bg-slate-50/60"
            :class="d.status === 'nonaktif' ? 'opacity-60' : ''">
            <td class="px-4 py-3">
              <div class="font-semibold text-sm">{{ d.nama }}</div>
              <div class="text-xs text-slate-400">{{ d.gelar }}</div>
            </td>
            <td class="px-4 py-3 text-xs font-mono text-slate-600">{{ d.nip }}</td>
            <td class="px-4 py-3 text-xs text-slate-600">{{ d.email }}</td>
            <td class="px-4 py-3 text-xs">{{ d.bidang }}</td>
            <td class="px-4 py-3">
              <NuxtLink to="/admin/master/jadwal-dosen" class="text-xs font-medium text-primary hover:underline">
                {{ jadwalCount[d.id] ?? 0 }} jadwal →
              </NuxtLink>
            </td>
            <td class="px-4 py-3">
              <UiBadge :type="d.status === 'aktif' ? 'success' : 'warning'" :label="d.status === 'aktif' ? 'Aktif' : 'Nonaktif'" />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button class="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-primary" @click="openEdit(d)">Edit</button>
                <button class="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600" @click="deleteId = d.id">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </UiTableWrap>

    <UiModal :open="showModal" :title="editTarget ? 'Edit Data Dosen' : 'Tambah Dosen Baru'" max-width="max-w-lg" @close="showModal = false">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1.5 text-slate-700">Nama Lengkap (tanpa gelar) *</label>
          <input v-model="form.nama" placeholder="cth. Ahmad Fauzi" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 text-slate-700">Gelar *</label>
          <input v-model="form.gelar" placeholder="cth. M.T, M.Kom" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 text-slate-700">NIP *</label>
          <input v-model="form.nip" maxlength="18" placeholder="18 digit NIP" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1.5 text-slate-700">Email</label>
          <input v-model="form.email" type="email" placeholder="nama@universitas.ac.id" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-medium mb-1.5 text-slate-700">Bidang Keahlian</label>
          <input v-model="form.bidang" placeholder="cth. Kecerdasan Buatan" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 text-slate-700">Status</label>
          <select v-model="form.status" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary">
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>
      <template #footer>
        <UiButton variant="outline" class="flex-1" @click="showModal = false">Batal</UiButton>
        <UiButton class="flex-1" :disabled="!form.nama || !form.nip" @click="handleSave">
          {{ editTarget ? "Simpan Perubahan" : "Tambah Dosen" }}
        </UiButton>
      </template>
    </UiModal>

    <UiModal :open="deleteId !== null" title="Hapus Dosen?" @close="deleteId = null">
      <p class="text-sm text-slate-500">Data dosen beserta seluruh jadwal mengajarnya akan dihapus.</p>
      <template #footer>
        <UiButton variant="outline" class="flex-1" @click="deleteId = null">Batal</UiButton>
        <UiButton variant="danger" class="flex-1" @click="handleDelete(deleteId!)">Hapus</UiButton>
      </template>
    </UiModal>
  </div>
</template>
