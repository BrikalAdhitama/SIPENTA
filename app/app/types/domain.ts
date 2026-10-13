// Enum & konstanta domain — dipakai lintas layar. Selaras dengan enum Postgres (0001_core_schema.sql).

// Hanya 3 role. Fungsi "kaprodi" (finalisasi jadwal, laporan) dijalankan akun admin.
export const ROLES = ["admin", "dosen", "mahasiswa"] as const;
export type Role = (typeof ROLES)[number];

export const JENIS_SEMINAR = ["seminar_proposal", "seminar_hasil"] as const;
export type JenisSeminar = (typeof JENIS_SEMINAR)[number];

export const PERAN = [
  "pembimbing_utama",
  "pembimbing_pendamping",
  "penguji_1",
  "penguji_2",
] as const;
export type Peran = (typeof PERAN)[number];

// 'final' hanya tercapai setelah SETIAP slot di-ACC 4/4 dosen (2 pembimbing + 2 penguji)
export const STATUS_RUN = ["draft", "tersimpan", "final", "dibatalkan"] as const;
export type StatusRun = (typeof STATUS_RUN)[number];

export const STATUS_APPROVAL = ["menunggu", "konfirmasi", "tolak"] as const;
export type StatusApproval = (typeof STATUS_APPROVAL)[number];

export const DURASI_MENIT: Record<JenisSeminar, number> = { seminar_proposal: 60, seminar_hasil: 105 };

export const JENIS_LABEL: Record<JenisSeminar, string> = {
  seminar_proposal: "Seminar Proposal",
  seminar_hasil: "Seminar Hasil",
};

export const PERAN_LABEL: Record<Peran, string> = {
  pembimbing_utama: "Pembimbing 1",
  pembimbing_pendamping: "Pembimbing 2",
  penguji_1: "Penguji 1",
  penguji_2: "Penguji 2",
};

// Selaras enum Postgres 0001_core_schema.sql (tabel/kolom tetap sumber kebenaran).
export const STATUS_GELOMBANG = ["draft", "siap_generate", "dijadwalkan"] as const;
export type StatusGelombang = (typeof STATUS_GELOMBANG)[number];

export const VALIDASI_SEMINAR = ["valid", "invalid", "duplikat"] as const;
export type ValidasiSeminar = (typeof VALIDASI_SEMINAR)[number];

export const STATUS_AKTIF = ["aktif", "nonaktif"] as const;
export type StatusAktif = (typeof STATUS_AKTIF)[number];

export const HARI_KERJA = ["senin", "selasa", "rabu", "kamis", "jumat"] as const;
export type HariKerja = (typeof HARI_KERJA)[number];

// Bentuk singkat jenis seminar yang dipakai UI (chip, tabel, filter): 'sempro' | 'semhas'.
// (JenisSeminar di atas = nilai enum Postgres; yang ini = tampilan.)
export type JenisSingkat = "sempro" | "semhas";

export const JENIS_SINGKAT_LABEL: Record<JenisSingkat, string> = {
  sempro: "Seminar Proposal",
  semhas: "Seminar Hasil",
};

// Durasi default per jenis (menit) untuk UI — mengikuti desain mobile (Sempro 60, Semhas 120).
// NB: DURASI_MENIT di atas (Semhas 105) dipakai BE/DB; samakan keduanya bila sudah diputuskan.
export const DURASI_SINGKAT: Record<JenisSingkat, number> = { sempro: 60, semhas: 120 };
