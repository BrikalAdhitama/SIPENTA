<script setup lang="ts">
definePageMeta({ middleware: "role", role: "admin" });

interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  email: string | null;
  prodi: string | null;
  status: "aktif" | "nonaktif";
}
const EMPTY: Omit<Mahasiswa, "id"> = { nim: "", nama: "", email: "", prodi: "", status: "aktif" };

const mahasiswas = ref<Mahasiswa[]>([
  { id: 1, nim: "11201011", nama: "Andi Pratama", email: "11201011@student.itk.ac.id", prodi: "Teknik Informatika", status: "aktif" },
  { id: 2, nim: "11201012", nama: "Budi Santoso", email: "11201012@student.itk.ac.id", prodi: "Teknik Informatika", status: "aktif" },
    { id: 3, nim: "11201013", nama: "Citra Dewi", email: "11201013@student.itk.ac.id", prodi: "Teknik Informatika", status: "aktif" }
]);

const jadwalCount: Record<number, number> = { 1: 5, 2: 3, 3: 0 };

const search = ref("");
const showModal = ref(false);
const editTarget = ref<Mahasiswa | null>(null);
const form = ref<Omit<Mahasiswa, "id">>({ ...EMPTY });
const deleteId = ref<number | null>(null);
let nextId = 4;

const filtered = computed(() =>
  mahasiswas.value.filter(
    (m) =>
      m.nama.toLowerCase().includes(search.value.toLowerCase()) ||
      m.nim.includes(search.value) ||
      (m.prodi ?? "").toLowerCase().includes(search.value.toLowerCase())
  )
);

function openAdd() {
  editTarget.value = null;
  form.value = { ...EMPTY };
  showModal.value = true;
}

function openEdit(m: Mahasiswa) {
  editTarget.value = m;
  form.value = { nim: m.nim, nama: m.nama, email: m.email, prodi: m.prodi, status: m.status };
  showModal.value = true;
}

function handleSave() {
  if (!form.value.nama || !form.value.nim) return;
  if (editTarget.value) {
    const idx = mahasiswas.value.findIndex((m) => m.id === editTarget.value!.id);
    mahasiswas.value[idx] = { id: editTarget.value.id, ...form.value };
  } else {
    mahasiswas.value.push({ id: nextId++, ...form.value });
  }
  showModal.value = false;
}
</script>
