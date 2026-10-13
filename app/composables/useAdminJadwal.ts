import type { JenisSingkat, Peran, StatusApproval } from "~/types/domain";

// Daftar hasil penjadwalan (schedule_run) + status persetujuan 4 dosen per seminar (admin).
// SEMENTARA: data tiruan di memori. Nanti diganti Supabase:
//   run      → schedule_run join gelombang
//   seminar  → schedule_slot join seminar + mahasiswa + ruangan
//   approval → tabel approval (peran, status, alasan) — 4 baris per seminar (2 pembimbing + 2 penguji)

export interface ApprovalDosen {
  peran: Peran;
  dosen: string;
  status: StatusApproval;
  alasan?: string;
}

export interface SeminarJadwal {
  id: number;
  mahasiswa: string;
  nim: string;
  jenis: JenisSingkat;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
  approval: ApprovalDosen[];
}

export interface JadwalRun {
  id: number;
  nama: string;
  jenis: JenisSingkat;
  mulai: string; // YYYY-MM-DD
  selesai: string;
  dibuat: string; // YYYY-MM-DD
  total: number; // jumlah seminar yang seharusnya dijadwalkan di gelombang ini
  seminar: SeminarJadwal[];
}

export interface RingkasanApproval {
  setuju: number;
  tolak: number;
  menunggu: number;
  label: string;
  tone: "success" | "warning" | "danger";
}

export function ringkasanApproval(s: SeminarJadwal): RingkasanApproval {
  const setuju = s.approval.filter((a) => a.status === "konfirmasi").length;
  const tolak = s.approval.filter((a) => a.status === "tolak").length;
  const menunggu = s.approval.length - setuju - tolak;
  if (tolak > 0) return { setuju, tolak, menunggu, label: `${setuju}/${s.approval.length} Ditolak`, tone: "danger" };
  if (menunggu === 0) return { setuju, tolak, menunggu, label: "Semua Disetujui", tone: "success" };
  return { setuju, tolak, menunggu, label: `${setuju}/${s.approval.length} Disetujui`, tone: "warning" };
}

export function statsRun(run: JadwalRun) {
  const r = run.seminar.map(ringkasanApproval);
  return {
    total: run.seminar.length,
    disetujui: r.filter((x) => x.tone === "success").length,
    menunggu: r.filter((x) => x.tone === "warning").length,
    ditolak: r.filter((x) => x.tone === "danger").length,
  };
}

// ── data tiruan ────────────────────────────────────────────────────────────
const S: StatusApproval[] = ["konfirmasi", "konfirmasi", "konfirmasi", "konfirmasi"];

function approval(
  [p1, p2, u1, u2]: [string, string, string, string],
  status: StatusApproval[] = S,
  alasan: Partial<Record<number, string>> = {},
): ApprovalDosen[] {
  const peran: Peran[] = ["pembimbing_utama", "pembimbing_pendamping", "penguji_1", "penguji_2"];
  return [p1, p2, u1, u2].map((dosen, i) => ({ peran: peran[i], dosen, status: status[i], alasan: alasan[i] }));
}

const T1: [string, string, string, string] = ["Dr. Sari Dewi", "Dr. Ahmad Fauzi", "Prof. Budi Santoso", "Dr. Dewi Lestari"];
const T2: [string, string, string, string] = ["Dr. Iwan Setiawan", "Dr. Ratna Sari", "Prof. Budi Santoso", "Dr. Sari Dewi"];
const T3: [string, string, string, string] = ["Dr. Dewi Lestari", "Dr. Iwan Setiawan", "Dr. Ahmad Fauzi", "Prof. Budi Santoso"];

const SEED: JadwalRun[] = [
  {
    id: 1,
    nama: "Jadwal Sempro Gel. 1 September 2026",
    jenis: "sempro",
    mulai: "2026-09-15",
    selesai: "2026-09-20",
    dibuat: "2026-08-31",
    total: 8,
    seminar: [
      { id: 101, mahasiswa: "Andi Pratama", nim: "11231099", jenis: "sempro", tanggal: "2026-09-15", jamMulai: "08:00", jamSelesai: "09:00", ruangan: "F101", approval: approval(T1) },
      { id: 102, mahasiswa: "Cakra Nugroho", nim: "11231107", jenis: "sempro", tanggal: "2026-09-15", jamMulai: "09:00", jamSelesai: "10:00", ruangan: "F101", approval: approval(T1, ["konfirmasi", "menunggu", "konfirmasi", "menunggu"]) },
      { id: 103, mahasiswa: "Dinda Rahmawati", nim: "11231110", jenis: "sempro", tanggal: "2026-09-16", jamMulai: "10:00", jamSelesai: "11:00", ruangan: "F102", approval: approval(T1, ["konfirmasi", "menunggu", "tolak", "menunggu"], { 2: "Jadwal kuliah berbenturan di jam yang sama" }) },
      { id: 104, mahasiswa: "Fajar Ramadhan", nim: "11231115", jenis: "sempro", tanggal: "2026-09-16", jamMulai: "13:00", jamSelesai: "14:00", ruangan: "F104", approval: approval(T3, ["menunggu", "menunggu", "menunggu", "menunggu"]) },
      { id: 105, mahasiswa: "Gita Permata", nim: "11231118", jenis: "sempro", tanggal: "2026-09-17", jamMulai: "08:00", jamSelesai: "09:00", ruangan: "F201", approval: approval(T3) },
      { id: 106, mahasiswa: "Intan Kurnia", nim: "11231124", jenis: "sempro", tanggal: "2026-09-18", jamMulai: "09:00", jamSelesai: "10:00", ruangan: "F101", approval: approval(T1, ["konfirmasi", "konfirmasi", "konfirmasi", "menunggu"]) },
    ],
  },
  {
    id: 2,
    nama: "Jadwal Semhas Gel. 1 September 2026",
    jenis: "semhas",
    mulai: "2026-09-22",
    selesai: "2026-09-26",
    dibuat: "2026-09-01",
    total: 3,
    seminar: [
      { id: 201, mahasiswa: "Rina Melati", nim: "11231102", jenis: "semhas", tanggal: "2026-09-22", jamMulai: "08:00", jamSelesai: "10:00", ruangan: "F102", approval: approval(T2) },
      { id: 202, mahasiswa: "Bunga Lestari", nim: "11231104", jenis: "semhas", tanggal: "2026-09-23", jamMulai: "10:00", jamSelesai: "12:00", ruangan: "F104", approval: approval(T3, ["konfirmasi", "konfirmasi", "menunggu", "menunggu"]) },
      { id: 203, mahasiswa: "Egi Firmansyah", nim: "11231113", jenis: "semhas", tanggal: "2026-09-24", jamMulai: "13:00", jamSelesai: "15:00", ruangan: "F201", approval: approval(T1, ["konfirmasi", "konfirmasi", "konfirmasi", "konfirmasi"]) },
    ],
  },
  {
    id: 3,
    nama: "Jadwal Sempro Gel. 2 Oktober 2026",
    jenis: "sempro",
    mulai: "2026-10-13",
    selesai: "2026-10-16",
    dibuat: "2026-10-05",
    total: 2,
    seminar: [
      { id: 301, mahasiswa: "Hendra Wijaya", nim: "11231121", jenis: "sempro", tanggal: "2026-10-13", jamMulai: "08:00", jamSelesai: "09:00", ruangan: "F101", approval: approval(T2, ["menunggu", "menunggu", "menunggu", "menunggu"]) },
      { id: 302, mahasiswa: "Andi Pratama", nim: "11231099", jenis: "sempro", tanggal: "2026-10-14", jamMulai: "10:00", jamSelesai: "11:00", ruangan: "F102", approval: approval(T1, ["konfirmasi", "menunggu", "menunggu", "menunggu"]) },
    ],
  },
];

export type RunBaru = Omit<JadwalRun, "id" | "dibuat">;

export function useAdminJadwal() {
  const daftar = useState<JadwalRun[]>("admin:jadwal", () => JSON.parse(JSON.stringify(SEED)));

  const cariRun = (id: number | null) => daftar.value.find((r) => r.id === id) ?? null;

  /** Simpan hasil generate sebagai jadwal baru (status approval semua "menunggu"). */
  function tambahRun(baru: RunBaru): number {
    const id = Math.max(0, ...daftar.value.map((r) => r.id)) + 1;
    const hariIni = new Date();
    const dibuat = `${hariIni.getFullYear()}-${String(hariIni.getMonth() + 1).padStart(2, "0")}-${String(hariIni.getDate()).padStart(2, "0")}`;
    daftar.value.unshift({ ...baru, id, dibuat });
    return id;
  }

  return { daftar, cariRun, tambahRun };
}
