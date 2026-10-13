import type { HariKerja, StatusAktif } from "~/types/domain";

// Desain mobile mengizinkan Senin–Minggu untuk jadwal mengajar (enum DB hari_kerja hanya Senin–Jumat → minta BE melebarkan bila dipakai).
export type HariMengajar = HariKerja | "sabtu" | "minggu";
export const HARI_MENGAJAR: HariMengajar[] = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];

// Data dosen + jadwal mengajar (admin). SEMENTARA: data tiruan di memori.
// Nanti diganti Supabase: tabel `dosen` (nip, nama, bidang, status) dan `jadwal_mengajar`
// (dosen_id, mata_kuliah, kelas, hari, jam_mulai, jam_selesai, ruangan).
// `gelar` & `email` ada di desain tetapi belum ada kolomnya di DB — minta BE bila memang dipakai.

export interface Dosen {
  id: number;
  nama: string; // tanpa gelar belakang, mis. "Dr. Sari Dewi"
  gelar: string; // mis. "M.Kom"
  nip: string;
  email: string;
  bidang: string;
  status: StatusAktif;
}

export type DosenInput = Omit<Dosen, "id">;

export interface JadwalMengajar {
  id: number;
  dosenId: number;
  mataKuliah: string;
  kelas: string;
  hari: HariMengajar;
  jamMulai: string; // HH:MM
  jamSelesai: string;
  ruangan: string;
}

export type JadwalMengajarInput = Omit<JadwalMengajar, "id" | "dosenId">;

export const HARI_LABEL: Record<HariMengajar, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

const SEED_DOSEN: Dosen[] = [
  { id: 1, nama: "Dr. Sari Dewi", gelar: "M.Kom", nip: "197503012005011001", email: "sari.dewi@itk.ac.id", bidang: "Kecerdasan Buatan", status: "aktif" },
  { id: 2, nama: "Dr. Ahmad Fauzi", gelar: "S.Kom., M.Kom", nip: "197808152006041002", email: "ahmad.fauzi@itk.ac.id", bidang: "Jaringan Komputer", status: "aktif" },
  { id: 3, nama: "Prof. Budi Santoso", gelar: "M.T", nip: "196912101995031003", email: "budi.santoso@itk.ac.id", bidang: "Rekayasa Perangkat Lunak", status: "aktif" },
  { id: 4, nama: "Dr. Dewi Lestari", gelar: "M.Sc", nip: "198005202008012004", email: "dewi.lestari@itk.ac.id", bidang: "Basis Data", status: "aktif" },
  { id: 5, nama: "Dr. Iwan Setiawan", gelar: "M.T", nip: "197611222003121005", email: "iwan.setiawan@itk.ac.id", bidang: "Sistem Tertanam", status: "aktif" },
  { id: 6, nama: "Dr. Ratna Sari", gelar: "M.Kom", nip: "198203142009122006", email: "ratna.sari@itk.ac.id", bidang: "Data Mining", status: "nonaktif" },
  { id: 7, nama: "Dr. Rina Wulandari", gelar: "M.T", nip: "198204102008012003", email: "rina.wulandari@itk.ac.id", bidang: "Computer Vision", status: "aktif" },
  { id: 8, nama: "Dr. Hendra Wijaya", gelar: "M.Kom", nip: "197912052005011002", email: "hendra.wijaya@itk.ac.id", bidang: "Internet of Things", status: "aktif" },
  { id: 9, nama: "Dr. Nurul Hidayati", gelar: "M.Sc", nip: "198407172010122001", email: "nurul.hidayati@itk.ac.id", bidang: "Deep Learning", status: "aktif" },
  { id: 10, nama: "Prof. Cahya Putri", gelar: "Ph.D", nip: "196805201994032001", email: "cahya.putri@itk.ac.id", bidang: "Sistem Informasi", status: "aktif" },
  { id: 11, nama: "Dr. Yusuf Maulana", gelar: "M.T", nip: "198109132007011005", email: "yusuf.maulana@itk.ac.id", bidang: "Keamanan Siber", status: "aktif" },
  { id: 12, nama: "Dr. Lestari Anggraini", gelar: "M.Kom", nip: "198510252011012002", email: "lestari.anggraini@itk.ac.id", bidang: "Rekayasa Data", status: "aktif" },
];

const SEED_JADWAL: JadwalMengajar[] = [
  { id: 1, dosenId: 1, mataKuliah: "Pemrograman Web", kelas: "A", hari: "senin", jamMulai: "07:30", jamSelesai: "10:00", ruangan: "F104" },
  { id: 2, dosenId: 1, mataKuliah: "Kecerdasan Buatan", kelas: "B", hari: "rabu", jamMulai: "10:00", jamSelesai: "12:30", ruangan: "F201" },
  { id: 3, dosenId: 1, mataKuliah: "Machine Learning", kelas: "A", hari: "kamis", jamMulai: "13:00", jamSelesai: "15:30", ruangan: "F102" },
  { id: 4, dosenId: 2, mataKuliah: "Jaringan Komputer", kelas: "A", hari: "selasa", jamMulai: "08:00", jamSelesai: "10:30", ruangan: "F101" },
  { id: 5, dosenId: 2, mataKuliah: "Keamanan Jaringan", kelas: "B", hari: "jumat", jamMulai: "09:00", jamSelesai: "11:30", ruangan: "F203" },
  { id: 6, dosenId: 3, mataKuliah: "Rekayasa Perangkat Lunak", kelas: "A", hari: "senin", jamMulai: "13:00", jamSelesai: "15:30", ruangan: "F201" },
  { id: 7, dosenId: 4, mataKuliah: "Basis Data Lanjut", kelas: "A", hari: "rabu", jamMulai: "08:00", jamSelesai: "10:30", ruangan: "F104" },
  { id: 8, dosenId: 7, mataKuliah: "Computer Vision", kelas: "A", hari: "selasa", jamMulai: "13:00", jamSelesai: "15:30", ruangan: "F203" },
  { id: 9, dosenId: 8, mataKuliah: "Sistem Tertanam", kelas: "B", hari: "kamis", jamMulai: "08:00", jamSelesai: "10:30", ruangan: "F102" },
];

/** "7:30 - 10:00" → { jamMulai: "07:30", jamSelesai: "10:00" } ; null bila format salah. */
export function parseJam(teks: string): { jamMulai: string; jamSelesai: string } | null {
  const m = teks.trim().match(/^(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const [h1, m1, h2, m2] = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (h1 > 23 || h2 > 23 || m1 > 59 || m2 > 59) return null;
  const f = (h: number, mm: number) => `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  return { jamMulai: f(h1, m1), jamSelesai: f(h2, m2) };
}

export function namaLengkap(d: Pick<Dosen, "nama" | "gelar">): string {
  return d.gelar.trim() ? `${d.nama} ${d.gelar}` : d.nama;
}

export function useAdminDosen() {
  const daftar = useState<Dosen[]>("admin:dosen", () => SEED_DOSEN.map((d) => ({ ...d })));
  const jadwal = useState<JadwalMengajar[]>("admin:dosen-jadwal", () => SEED_JADWAL.map((j) => ({ ...j })));

  const aktif = computed(() => daftar.value.filter((d) => d.status === "aktif"));
  const stats = computed(() => ({
    total: daftar.value.length,
    aktif: aktif.value.length,
    jadwalMengajar: jadwal.value.length,
    terjadwal: daftar.value.filter((d) => jadwal.value.some((j) => j.dosenId === d.id)).length,
    // jadwal valid = jam selesai setelah jam mulai (aturan CHECK di DB)
    jadwalValid: jadwal.value.filter((j) => j.jamSelesai > j.jamMulai).length,
  }));

  const jadwalDosen = (dosenId: number) => jadwal.value.filter((j) => j.dosenId === dosenId);
  const cariDosen = (id: number | null) => daftar.value.find((d) => d.id === id) ?? null;

  function validasiDosen(input: DosenInput, kecualiId?: number): string | null {
    if (!input.nama.trim()) return "Nama lengkap wajib diisi.";
    if (!input.gelar.trim()) return "Gelar wajib diisi.";
    if (!/^\d{8,20}$/.test(input.nip.trim())) return "NIP harus berupa angka (8–20 digit).";
    if (daftar.value.some((d) => d.id !== kecualiId && d.nip === input.nip.trim())) return "NIP sudah terdaftar.";
    if (input.email.trim() && !/^\S+@\S+\.\S+$/.test(input.email.trim())) return "Format email tidak valid.";
    return null;
  }

  function bersihkan(input: DosenInput): DosenInput {
    return {
      ...input,
      nama: input.nama.trim(),
      gelar: input.gelar.trim(),
      nip: input.nip.trim(),
      email: input.email.trim(),
      bidang: input.bidang.trim(),
    };
  }

  function tambahDosen(input: DosenInput) {
    const id = Math.max(0, ...daftar.value.map((d) => d.id)) + 1;
    daftar.value.push({ id, ...bersihkan(input) });
  }

  function ubahDosen(id: number, input: DosenInput) {
    const d = daftar.value.find((x) => x.id === id);
    if (d) Object.assign(d, bersihkan(input));
  }

  /** Hapus dosen beserta seluruh jadwal mengajarnya (cascade, seperti di DB). */
  function hapusDosen(id: number) {
    daftar.value = daftar.value.filter((d) => d.id !== id);
    jadwal.value = jadwal.value.filter((j) => j.dosenId !== id);
  }

  function validasiJadwal(input: JadwalMengajarInput): string | null {
    if (!input.mataKuliah.trim()) return "Mata kuliah wajib diisi.";
    if (!input.jamMulai || !input.jamSelesai) return "Jam wajib diisi. Contoh: 07:30 - 10:00";
    if (input.jamSelesai <= input.jamMulai) return "Jam selesai harus setelah jam mulai.";
    return null;
  }

  function tambahJadwal(dosenId: number, input: JadwalMengajarInput) {
    const id = Math.max(0, ...jadwal.value.map((j) => j.id)) + 1;
    jadwal.value.push({ id, dosenId, ...input, mataKuliah: input.mataKuliah.trim(), kelas: input.kelas.trim(), ruangan: input.ruangan.trim() });
  }

  function ubahJadwal(id: number, input: JadwalMengajarInput) {
    const j = jadwal.value.find((x) => x.id === id);
    if (j) Object.assign(j, input, { mataKuliah: input.mataKuliah.trim(), kelas: input.kelas.trim(), ruangan: input.ruangan.trim() });
  }

  function hapusJadwal(id: number) {
    jadwal.value = jadwal.value.filter((j) => j.id !== id);
  }

  return {
    daftar, aktif, stats, jadwal, jadwalDosen, cariDosen,
    validasiDosen, tambahDosen, ubahDosen, hapusDosen,
    validasiJadwal, tambahJadwal, ubahJadwal, hapusJadwal,
  };
}
