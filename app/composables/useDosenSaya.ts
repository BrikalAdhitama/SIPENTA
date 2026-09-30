import type { JenisSeminar, Peran } from "~/types/domain";

// Data halaman dosen (Dashboard, Jadwal Seminar, Jadwal Pribadi, Konfirmasi Jadwal).
// SEMENTARA: data tiruan yang mengikuti frame Figma "dashboard dosen - web".
// Nanti diganti query Supabase:
//   stats    → hitung dari seminar_dosen (peran pembimbing_* / penguji_*) + approval `pending`
//   agenda   → seminar milik dosen login (join mahasiswa + schedule_slot run final + ruangan)
//   badge    → jumlah approval `pending` untuk dosen login

export interface AgendaDosen {
  id: number;
  mahasiswa: string;
  inisial: string;
  jenis: JenisSeminar;
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

export function useDosenSaya() {
  const stats = ref<StatDosen>({
    jadwalBimbingan: 9,
    jadwalPengujian: 5,
    menungguPersetujuan: 2,
  });

  const agenda = ref<AgendaDosen[]>([
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

  const perhatian = ref("Rabu memiliki 4 kegiatan. Periksa kembali waktu dan ruangan.");

  // angka merah di menu sidebar
  const badge = computed(() => ({
    jadwalSeminar: 2,
    konfirmasi: stats.value.menungguPersetujuan,
  }));

  return { stats, agenda, perhatian, badge };
}
