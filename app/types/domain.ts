// Enum & konstanta domain — dipakai lintas layar. Selaras dengan enum Postgres (0001_core_schema.sql).

// Hanya 3 role. Fungsi "kaprodi" (finalisasi jadwal, laporan) dijalankan akun admin.
export const ROLES = ["admin", "dosen", "mahasiswa"] as const;
export type Role = (typeof ROLES)[number];

export const JENIS_SEMINAR = ["sempro", "semhas"] as const;
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

export const STATUS_APPROVAL = ["pending", "approved", "declined"] as const;
export type StatusApproval = (typeof STATUS_APPROVAL)[number];

export const DURASI_MENIT: Record<JenisSeminar, number> = { sempro: 60, semhas: 105 };

export const JENIS_LABEL: Record<JenisSeminar, string> = {
  sempro: "Seminar Proposal",
  semhas: "Seminar Hasil",
};

export const PERAN_LABEL: Record<Peran, string> = {
  pembimbing_utama: "Pembimbing 1",
  pembimbing_pendamping: "Pembimbing 2",
  penguji_1: "Penguji 1",
  penguji_2: "Penguji 2",
};
