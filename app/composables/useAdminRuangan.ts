import type { StatusAktif } from "~/types/domain";

// Data ruangan (admin). SEMENTARA: data tiruan di memori — perubahan hilang saat reload.
// Nanti diganti Supabase tabel `ruangan` (kode unique, nama, lantai, gedung, is_online, status).
// Form (sama seperti mobile) hanya meminta Nama, Lantai, Gedung. `kode` diturunkan dari nama
// ("Ruang F101" → "F101"); `status` tidak ada di form — ruangan baru otomatis "aktif".

export interface Ruangan {
  id: number;
  kode: string;
  nama: string;
  lantai: number;
  gedung: string;
  status: StatusAktif;
}

export type RuanganInput = Omit<Ruangan, "id" | "kode" | "status">;

const SEED: Ruangan[] = [
  { id: 1, kode: "F101", nama: "Ruang F101", lantai: 1, gedung: "F", status: "aktif" },
  { id: 2, kode: "F102", nama: "Ruang F102", lantai: 1, gedung: "F", status: "aktif" },
  { id: 3, kode: "F103", nama: "Ruang F103", lantai: 1, gedung: "F", status: "nonaktif" },
  { id: 4, kode: "F104", nama: "Ruang F104", lantai: 1, gedung: "F", status: "aktif" },
  { id: 5, kode: "F201", nama: "Ruang F201", lantai: 2, gedung: "F", status: "aktif" },
  { id: 6, kode: "F202", nama: "Ruang F202", lantai: 2, gedung: "F", status: "nonaktif" },
  { id: 7, kode: "F203", nama: "Ruang F203", lantai: 2, gedung: "F", status: "aktif" },
];

export function kodeDariNama(nama: string): string {
  return nama
    .trim()
    .replace(/^ruang(an)?\s+/i, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

export function useAdminRuangan() {
  const daftar = useState<Ruangan[]>("admin:ruangan", () => SEED.map((r) => ({ ...r })));

  const aktif = computed(() => daftar.value.filter((r) => r.status === "aktif"));
  const stats = computed(() => ({ total: daftar.value.length, aktif: aktif.value.length }));

  /** Pesan galat bila input tidak valid, `null` bila boleh disimpan. */
  function validasi(input: RuanganInput, kecualiId?: number): string | null {
    if (!input.nama.trim()) return "Nama ruangan wajib diisi.";
    if (!Number.isInteger(input.lantai) || input.lantai < 0) return "Lantai harus berupa angka bulat (0 atau lebih).";
    if (!input.gedung.trim()) return "Gedung wajib diisi.";
    const kode = kodeDariNama(input.nama);
    if (daftar.value.some((r) => r.id !== kecualiId && r.kode === kode)) return `Ruangan dengan kode ${kode} sudah ada.`;
    return null;
  }

  function tambah(input: RuanganInput) {
    const id = Math.max(0, ...daftar.value.map((r) => r.id)) + 1;
    daftar.value.push({ id, kode: kodeDariNama(input.nama), status: "aktif", ...input, nama: input.nama.trim(), gedung: input.gedung.trim() });
  }

  function ubah(id: number, input: RuanganInput) {
    const r = daftar.value.find((x) => x.id === id);
    if (r) Object.assign(r, input, { nama: input.nama.trim(), gedung: input.gedung.trim(), kode: kodeDariNama(input.nama) });
  }

  function hapus(id: number) {
    daftar.value = daftar.value.filter((r) => r.id !== id);
  }

  return { daftar, aktif, stats, validasi, tambah, ubah, hapus };
}
