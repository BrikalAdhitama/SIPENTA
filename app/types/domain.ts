// Enum & konstanta domain — dipakai lintas layar. Selaras dengan enum Postgres (0001_core_schema.sql).

import type { P } from "vue-router/dist/router-CWoNjPRp.mjs";
import type { JenisSingkat } from "~/app/types/domain";

// Hanya 3 role. Fungsi "kaprodi" (finalisasi jadwal, laporan) dijalankan akun admin.
export const ROLES = ["admin", "dosen", "mahasiswa"] as const;
export type Role = (typeof ROLES)[number];

export const JENIS_SEMINAR = ["seminar_proposal", "seminar_hasil"] as const;
export type JenisSeminar = (typeof JENIS_SEMINAR)[number];

// Kode jenis seminar di lapisan tampilan (data tiruan & chip). Berbeda dari enum Postgres di atas:
// 'sempro' = seminar_proposal, 'semhas' = seminar_hasil. Dipakai halaman mahasiswa & dosen.
export type JenisSeminarUI = "sempro" | "semhas";
export const JENIS_UI_LABEL: Record<JenisSeminarUI, string> = {
  sempro: "Seminar Proposal",
  semhas: "Seminar Hasil",
};
export const JENIS_UI_SINGKAT: Record<JenisSeminarUI, string> = { sempro: "Sempro", semhas: "Semhas" };
export const JENIS_SINGKAT: Partial<Record<JenisSingkat, string>> = { sempro: "sempro", semhas: "semhas" };

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
