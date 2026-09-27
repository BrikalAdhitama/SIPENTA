import type { JenisSeminar } from "~/types/domain";

// Data dashboard admin — dipakai versi web (dan nanti versi mobile).
// SEMENTARA: data tiruan. Nanti diganti query Supabase:
//   stats          → count(mahasiswa), count(seminar) per jenis, ruangan aktif
//   jadwalTerbaru  → schedule_slot run final terbaru, join seminar + mahasiswa

export interface JadwalRingkas {
  id: number;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
  mahasiswa: string;
  jenis: JenisSeminar;
}

export interface DashboardStats {
  totalMahasiswa: number;
  semesterLabel: string;
  sempro: number;
  semhas: number;
  ruanganAktif: number;
  ruanganTotal: number;
  ruanganLabel: string;
}

export function useAdminDashboard() {
  const stats = ref<DashboardStats>({
    totalMahasiswa: 155,
    semesterLabel: "Semester Ganjil 2025/2026",
    sempro: 24,
    semhas: 15,
    ruanganAktif: 4,
    ruanganTotal: 10,
    ruanganLabel: "B201-B204",
  });

  const jadwalTerbaru = ref<JadwalRingkas[]>([
    { id: 1, tanggal: "2026-09-25", jamMulai: "08:00", jamSelesai: "08:50", ruangan: "B201", mahasiswa: "Andi Pratama", jenis: "sempro" },
    { id: 2, tanggal: "2026-09-25", jamMulai: "09:00", jamSelesai: "10:45", ruangan: "B202", mahasiswa: "Bunga Lestari", jenis: "semhas" },
    { id: 3, tanggal: "2026-09-25", jamMulai: "10:30", jamSelesai: "11:30", ruangan: "B201", mahasiswa: "Cakra Nugroho", jenis: "sempro" },
    { id: 4, tanggal: "2026-09-26", jamMulai: "08:00", jamSelesai: "09:00", ruangan: "B203", mahasiswa: "Dinda Rahmawati", jenis: "sempro" },
    { id: 5, tanggal: "2026-09-26", jamMulai: "13:00", jamSelesai: "14:45", ruangan: "B204", mahasiswa: "Egi Firmansyah", jenis: "semhas" },
  ]);

  return { stats, jadwalTerbaru };
}
