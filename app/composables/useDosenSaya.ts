import type { JenisSeminarUI, Peran } from "~/types/domain";
import { awalMinggu, geserTanggal, tambahHari } from "~/utils/format";

// Data halaman dosen (Dashboard, Jadwal Seminar, Jadwal Pribadi, Konfirmasi Jadwal).
// SEMENTARA: data tiruan yang mengikuti frame Figma "... dosen - web".
// Nanti diganti query Supabase:
//   stats       → hitung dari seminar_dosen (peran pembimbing_* / penguji_*) + approval `menunggu`
//   agenda      → seminar milik dosen login (join mahasiswa + schedule_slot run final + ruangan)
//   seminar     → sama seperti agenda, tapi semua seminar semester ini + status approval dosen
//   konfirmasi  → tabel `approval` milik dosen login; konfirmasi()/tolak() → RPC di 0003_rpc_approval.sql
//   kegiatan    → jadwal_mengajar + blokir_waktu milik dosen login (tambah/ubah/hapus = insert/update/delete)
// State disimpan lewat useState supaya badge sidebar (layouts/default.vue) ikut berubah
// begitu dosen mengonfirmasi/menolak jadwal di halaman Konfirmasi.

export interface AgendaDosen {
  id: number;
  mahasiswa: string;
  inisial: string;
  jenis: JenisSeminarUI;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
  peran: Peran;
}

export interface StatDosen {
  jadwalBimbingan: number;
  jadwalPengujian: number;
  menungguPersetujuan: number;
}

// ── Jadwal Seminar ────────────────────────────────────────────────────────────
export type StatusSeminarDosen = "Terkonfirmasi" | "Menunggu" | "Dijadwal Ulang";

export interface SeminarDosen {
  id: number;
  mahasiswa: string;
  nim: string;
  jenis: JenisSeminarUI;
  judul: string;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string; // "09.00"
  jamSelesai: string;
  ruangan: string;
  status: StatusSeminarDosen;
}

// ── Konfirmasi Jadwal ─────────────────────────────────────────────────────────
export type StatusKonfirmasi = "menunggu" | "terkonfirmasi" | "ditolak";

export interface KonfirmasiItem {
  id: number;
  mahasiswa: string;
  inisial: string;
  jenis: JenisSeminarUI;
  tanggal: string; // YYYY-MM-DD
  jam: string; // "13.00"
  ruangan: string;
  peran: Peran;
  status: StatusKonfirmasi;
  alasanTolak?: string;
}

// ── Jadwal Pribadi ────────────────────────────────────────────────────────────
export type TipeKegiatan = "mengajar" | "lain";

export interface Kegiatan {
  id: number;
  tanggal: string; // YYYY-MM-DD
  jam: string; // "08.00"
  durasi: number; // menit
  judul: string;
  deskripsi: string; // mengajar: "Kelas A · 2 SKS"
  lokasi: string;
  tipe: TipeKegiatan;
}

export type DraftKegiatan = Omit<Kegiatan, "id"> & { id: number | null };

function inisialDari(nama: string) {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]!.toUpperCase())
    .join("");
}

export function useDosenSaya() {
  const agenda = useState<AgendaDosen[]>("dosen:agenda", () => [
    {
      id: 1,
      mahasiswa: "Andi Pratama",
      inisial: "AP",
      jenis: "sempro",
      tanggal: "2026-09-01",
      jamMulai: "08:00",
      jamSelesai: "09:00",
      ruangan: "B201",
      peran: "pembimbing_utama",
    },
    {
      id: 2,
      mahasiswa: "Andi Pratama",
      inisial: "AP",
      jenis: "sempro",
      tanggal: "2026-09-01",
      jamMulai: "08:00",
      jamSelesai: "09:00",
      ruangan: "B201",
      peran: "pembimbing_utama",
    },
  ]);

  const seminar = useState<SeminarDosen[]>("dosen:seminar", () => [
    { id: 1, mahasiswa: "Ahmad Fauzan", nim: "11201103", jenis: "sempro", judul: "Sistem Rekomendasi Skripsi Berbasis ML", tanggal: "2026-09-04", jamMulai: "09.00", jamSelesai: "10.00", ruangan: "B201", status: "Terkonfirmasi" },
    { id: 2, mahasiswa: "Nadia Ramadhani", nim: "11251099", jenis: "semhas", judul: "Analisis Sentimen Ulasan E-commerce", tanggal: "2026-09-05", jamMulai: "13.00", jamSelesai: "15.00", ruangan: "B203", status: "Menunggu" },
    { id: 3, mahasiswa: "Bagas Prasetyo", nim: "11231077", jenis: "sempro", judul: "Optimasi Rute Pengiriman Logistik", tanggal: "2026-09-06", jamMulai: "10.30", jamSelesai: "11.30", ruangan: "B204", status: "Terkonfirmasi" },
    { id: 4, mahasiswa: "Clara Wijaya", nim: "11201003", jenis: "semhas", judul: "Deteksi Objek pada Citra Satelit", tanggal: "2026-09-08", jamMulai: "08.30", jamSelesai: "10.30", ruangan: "B202", status: "Dijadwal Ulang" },
    { id: 5, mahasiswa: "Rian Saputra", nim: "11211101", jenis: "sempro", judul: "Prediksi Harga Saham dengan LSTM", tanggal: "2026-09-09", jamMulai: "14.00", jamSelesai: "15.00", ruangan: "B201", status: "Menunggu" },
  ]);

  const konfirmasi = useState<KonfirmasiItem[]>("dosen:konfirmasi", () => [
    { id: 1, mahasiswa: "Nadia Ramadhani", inisial: "NR", jenis: "semhas", tanggal: "2026-09-05", jam: "13.00", ruangan: "B203", peran: "penguji_1", status: "menunggu" },
    { id: 2, mahasiswa: "Rian Saputra", inisial: "RS", jenis: "sempro", tanggal: "2026-09-09", jam: "14.00", ruangan: "B201", peran: "pembimbing_utama", status: "menunggu" },
    { id: 3, mahasiswa: "Dinda Amelia", inisial: "DA", jenis: "semhas", tanggal: "2026-09-11", jam: "10.00", ruangan: "B204", peran: "penguji_2", status: "menunggu" },
    { id: 4, mahasiswa: "Ahmad Fauzan", inisial: "AF", jenis: "sempro", tanggal: "2026-09-04", jam: "09.00", ruangan: "B201", peran: "pembimbing_utama", status: "terkonfirmasi" },
    { id: 5, mahasiswa: "Clara Wijaya", inisial: "CW", jenis: "semhas", tanggal: "2026-09-08", jam: "08.30", ruangan: "B202", peran: "pembimbing_pendamping", status: "ditolak" },
  ]);

  // Jadwal pribadi memakai tanggal relatif terhadap minggu berjalan, supaya filter
  // "Minggu Ini" / "Bulan Ini" selalu punya isi (di Figma: Senin–Rabu satu minggu).
  const kegiatan = useState<Kegiatan[]>("dosen:kegiatan", () => {
    const senin = awalMinggu(tambahHari(0));
    const hari = (n: number) => geserTanggal(senin, n);
    return [
      { id: 1, tanggal: hari(0), jam: "08.00", durasi: 100, judul: "Pemrograman Web", deskripsi: "Kelas A · 2 SKS", lokasi: "Ruang E204", tipe: "mengajar" },
      { id: 2, tanggal: hari(0), jam: "13.00", durasi: 90, judul: "Rapat Koordinasi Program Studi", deskripsi: "Evaluasi kurikulum semester ganjil", lokasi: "Ruang Rapat Dekanat", tipe: "lain" },
      { id: 3, tanggal: hari(1), jam: "10.00", durasi: 140, judul: "Basis Data Lanjut", deskripsi: "Kelas B · 3 SKS", lokasi: "Lab Smartcity", tipe: "mengajar" },
      { id: 4, tanggal: hari(2), jam: "09.00", durasi: 180, judul: "Workshop Kurikulum Merdeka", deskripsi: "Diselenggarakan oleh Fakultas", lokasi: "Audit Ged A", tipe: "lain" },
      { id: 5, tanggal: hari(2), jam: "13.00", durasi: 150, judul: "Kecerdasan Buatan", deskripsi: "Kelas A · 3 SKS", lokasi: "Ruang E201", tipe: "mengajar" },
      { id: 6, tanggal: hari(3), jam: "08.00", durasi: 100, judul: "Struktur Data", deskripsi: "Kelas C · 2 SKS", lokasi: "Lab Komputer", tipe: "mengajar" },
      { id: 7, tanggal: hari(9), jam: "10.00", durasi: 140, judul: "Kuliah Tamu", deskripsi: "Diselenggarakan oleh Himpunan", lokasi: "Audit Ged A", tipe: "lain" },
    ];
  });

  // Angka kumulatif semester sebelum daftar di atas (Figma: Terkonfirmasi 18, Ditolak 2).
  const RIWAYAT = { terkonfirmasi: 17, ditolak: 1 };

  const jumlahKonfirmasi = computed(() => ({
    menunggu: konfirmasi.value.filter((k) => k.status === "menunggu").length,
    terkonfirmasi: RIWAYAT.terkonfirmasi + konfirmasi.value.filter((k) => k.status === "terkonfirmasi").length,
    ditolak: RIWAYAT.ditolak + konfirmasi.value.filter((k) => k.status === "ditolak").length,
  }));

  const stats = computed<StatDosen>(() => ({
    jadwalBimbingan: 9,
    jadwalPengujian: 5,
    menungguPersetujuan: jumlahKonfirmasi.value.menunggu,
  }));

  const perhatian = ref("Rabu memiliki 4 kegiatan. Periksa kembali waktu dan ruangan.");

  // angka merah di menu sidebar
  const badge = computed(() => ({
    jadwalSeminar: seminar.value.filter((s) => s.status === "Menunggu").length,
    konfirmasi: jumlahKonfirmasi.value.menunggu,
  }));

  // ── aksi Konfirmasi Jadwal ──
  function konfirmasiJadwal(id: number) {
    const item = konfirmasi.value.find((k) => k.id === id);
    if (!item || item.status !== "menunggu") return;
    item.status = "terkonfirmasi";
  }

  function tolakJadwal(id: number, alasan: string) {
    const item = konfirmasi.value.find((k) => k.id === id);
    if (!item || item.status !== "menunggu") return;
    item.status = "ditolak";
    item.alasanTolak = alasan.trim();
  }

  // ── aksi Jadwal Pribadi ──
  function simpanKegiatan(draft: DraftKegiatan) {
    if (draft.id === null) {
      const idBaru = Math.max(0, ...kegiatan.value.map((k) => k.id)) + 1;
      kegiatan.value.push({ ...draft, id: idBaru });
      return;
    }
    const i = kegiatan.value.findIndex((k) => k.id === draft.id);
    if (i !== -1) kegiatan.value[i] = { ...draft, id: draft.id };
  }

  function hapusKegiatan(id: number) {
    kegiatan.value = kegiatan.value.filter((k) => k.id !== id);
  }

  return {
    stats,
    agenda,
    perhatian,
    badge,
    seminar,
    konfirmasi,
    jumlahKonfirmasi,
    kegiatan,
    konfirmasiJadwal,
    tolakJadwal,
    simpanKegiatan,
    hapusKegiatan,
    inisialDari,
  };
}
