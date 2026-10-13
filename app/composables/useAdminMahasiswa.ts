import type { JenisSingkat, StatusAktif } from "~/types/domain";

// Data mahasiswa peserta seminar (admin). SEMENTARA: data tiruan di memori.
// Nanti diganti Supabase: `mahasiswa` (nim, nama, angkatan) + `seminar` (jenis, pembimbing_*_id,
// penguji1_id, penguji2_id, validasi). Impor file SPS = Edge Function `parse-sps` (BE).

// Dua status terpisah:
//  - `status`   : Aktif / Non-aktif → dipilih di form tambah/ubah
//  - `validasi` : Valid / Duplikat / Belum Lengkap → lencana di tabel (Valid bila kedua pembimbing terisi;
//                 "Duplikat" ditetapkan sistem/impor)
export type StatusValidasi = "valid" | "duplikat" | "belum_lengkap";

export interface MahasiswaAdmin {
  id: number;
  nama: string;
  nim: string;
  jenis: JenisSingkat;
  status: StatusAktif;
  validasi: StatusValidasi;
  pembimbing1: string;
  pembimbing2: string;
  penguji1: string;
  penguji2: string;
}

export type MahasiswaInput = Pick<MahasiswaAdmin, "nama" | "nim" | "jenis" | "status" | "pembimbing1" | "pembimbing2">;

export const VALIDASI_LABEL: Record<StatusValidasi, string> = {
  valid: "Valid",
  duplikat: "Duplikat",
  belum_lengkap: "Belum Lengkap",
};

const SEED: MahasiswaAdmin[] = [
  { id: 1, nama: "Andi Pratama", nim: "11231099", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "Prof. Budi Santoso", penguji2: "Dr. Dewi Lestari" },
  { id: 2, nama: "Rina Melati", nim: "11231102", jenis: "semhas", status: "aktif", validasi: "duplikat", pembimbing1: "Dr. Iwan Setiawan", pembimbing2: "Dr. Ratna Sari", penguji1: "Prof. Budi Santoso", penguji2: "Dr. Sari Dewi" },
  { id: 3, nama: "Bunga Lestari", nim: "11231104", jenis: "semhas", status: "aktif", validasi: "valid", pembimbing1: "Dr. Dewi Lestari", pembimbing2: "Dr. Iwan Setiawan", penguji1: "Dr. Ahmad Fauzi", penguji2: "Prof. Budi Santoso" },
  { id: 4, nama: "Cakra Nugroho", nim: "11231107", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Prof. Budi Santoso", pembimbing2: "Dr. Sari Dewi", penguji1: "Dr. Iwan Setiawan", penguji2: "Dr. Dewi Lestari" },
  { id: 5, nama: "Dinda Rahmawati", nim: "11231110", jenis: "sempro", status: "aktif", validasi: "belum_lengkap", pembimbing1: "Dr. Ahmad Fauzi", pembimbing2: "", penguji1: "", penguji2: "" },
  { id: 6, nama: "Egi Firmansyah", nim: "11231113", jenis: "semhas", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Prof. Budi Santoso", penguji1: "Dr. Dewi Lestari", penguji2: "Dr. Ahmad Fauzi" },
  { id: 7, nama: "Fajar Ramadhan", nim: "11231115", jenis: "sempro", status: "nonaktif", validasi: "belum_lengkap", pembimbing1: "", pembimbing2: "", penguji1: "", penguji2: "" },
  { id: 8, nama: "Gita Permata", nim: "11231118", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Dewi Lestari", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "Dr. Sari Dewi", penguji2: "Dr. Iwan Setiawan" },
  { id: 9, nama: "Hendra Wijaya", nim: "11231121", jenis: "semhas", status: "aktif", validasi: "valid", pembimbing1: "Prof. Budi Santoso", pembimbing2: "Dr. Iwan Setiawan", penguji1: "Dr. Sari Dewi", penguji2: "Dr. Ahmad Fauzi" },
  { id: 10, nama: "Intan Kurnia", nim: "11231124", jenis: "sempro", status: "aktif", validasi: "belum_lengkap", pembimbing1: "Dr. Sari Dewi", pembimbing2: "", penguji1: "", penguji2: "" },
  { id: 11, nama: "Joko Susilo", nim: "11231126", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 12, nama: "Kartika Sari", nim: "11231128", jenis: "semhas", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 13, nama: "Lukman Hakim", nim: "11231130", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 14, nama: "Maya Anggraini", nim: "11231132", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 15, nama: "Nanda Prakoso", nim: "11231134", jenis: "semhas", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 16, nama: "Olivia Putri", nim: "11231136", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 17, nama: "Putra Mahendra", nim: "11231138", jenis: "semhas", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 18, nama: "Qori Amalia", nim: "11231140", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 19, nama: "Raka Saputra", nim: "11231142", jenis: "semhas", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
  { id: 20, nama: "Sinta Dewi", nim: "11231144", jenis: "sempro", status: "aktif", validasi: "valid", pembimbing1: "Dr. Sari Dewi", pembimbing2: "Dr. Ahmad Fauzi", penguji1: "", penguji2: "" },
];

/** Baris hasil baca file SPS (pratinjau impor). */
export interface BarisImpor {
  nama: string;
  nim: string;
  jenis: JenisSingkat;
  pembimbing1?: string;
  pembimbing2?: string;
  status?: StatusAktif;
}

const hitungValidasi = (p1: string, p2: string): StatusValidasi => (p1 && p2 ? "valid" : "belum_lengkap");

export function useAdminMahasiswa() {
  const daftar = useState<MahasiswaAdmin[]>("admin:mahasiswa", () => SEED.map((m) => ({ ...m })));

  const stats = computed(() => ({
    total: daftar.value.length,
    sempro: daftar.value.filter((m) => m.jenis === "sempro").length,
    semhas: daftar.value.filter((m) => m.jenis === "semhas").length,
    belumLengkap: daftar.value.filter((m) => m.validasi === "belum_lengkap").length,
  }));

  function validasi(input: MahasiswaInput, kecualiId?: number): string | null {
    if (!input.nama.trim()) return "Nama lengkap wajib diisi.";
    if (!/^\d{6,15}$/.test(input.nim.trim())) return "NIM harus berupa angka (6–15 digit).";
    if (daftar.value.some((m) => m.id !== kecualiId && m.nim === input.nim.trim())) return "NIM sudah terdaftar.";
    if (!input.pembimbing1) return "Pembimbing 1 wajib dipilih.";
    if (!input.pembimbing2) return "Pembimbing 2 wajib dipilih.";
    if (input.pembimbing1 === input.pembimbing2) return "Pembimbing 1 dan Pembimbing 2 tidak boleh sama.";
    return null;
  }

  function tambah(input: MahasiswaInput) {
    const id = Math.max(0, ...daftar.value.map((m) => m.id)) + 1;
    daftar.value.unshift({ id, ...input, nama: input.nama.trim(), nim: input.nim.trim(), validasi: hitungValidasi(input.pembimbing1, input.pembimbing2), penguji1: "", penguji2: "" });
  }

  function ubah(id: number, input: MahasiswaInput) {
    const m = daftar.value.find((x) => x.id === id);
    if (m) Object.assign(m, input, { nama: input.nama.trim(), nim: input.nim.trim(), validasi: hitungValidasi(input.pembimbing1, input.pembimbing2) });
  }

  function hapus(id: number) {
    daftar.value = daftar.value.filter((m) => m.id !== id);
  }

  function setPenguji(id: number, kolom: "penguji1" | "penguji2", nama: string) {
    const m = daftar.value.find((x) => x.id === id);
    if (m) m[kolom] = nama;
  }

  /** Tambahkan hasil impor; NIM yang sudah ada dilewati. Mengembalikan jumlah yang masuk. */
  function imporBaris(baris: BarisImpor[]): number {
    let masuk = 0;
    for (const b of baris) {
      if (daftar.value.some((m) => m.nim === b.nim)) continue;
      const id = Math.max(0, ...daftar.value.map((m) => m.id)) + 1;
      const pembimbing1 = b.pembimbing1 ?? "";
      const pembimbing2 = b.pembimbing2 ?? "";
      daftar.value.unshift({
        id, nama: b.nama, nim: b.nim, jenis: b.jenis,
        status: b.status ?? "aktif",
        validasi: hitungValidasi(pembimbing1, pembimbing2),
        pembimbing1, pembimbing2, penguji1: "", penguji2: "",
      });
      masuk++;
    }
    return masuk;
  }

  return { daftar, stats, validasi, tambah, ubah, hapus, setPenguji, imporBaris };
}
