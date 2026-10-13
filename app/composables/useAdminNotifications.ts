import type { JenisSingkat } from "~/types/domain";

// Notifikasi admin. SEMENTARA: data tiruan di memori.
// Nanti diganti tabel `notification` + Realtime (lihat 0004_triggers_notif.sql).

export type KelompokNotif = "Hari Ini" | "Kemarin";

export interface NotifAdmin {
  id: number;
  judul: string;
  deskripsi: string;
  waktu: string;
  jenis: JenisSingkat;
  inisial: string;
  warna: "success" | "warning" | "danger";
  kelompok: KelompokNotif;
  dibaca: boolean;
}

const SEED: NotifAdmin[] = [
  { id: 1, judul: "Jadwal Sempro Disetujui", deskripsi: "Dr. Sari Dewi telah menyetujui jadwal Andi Pratama untuk Seminar Proposal.", waktu: "1 jam lalu", jenis: "sempro", inisial: "AP", warna: "success", kelompok: "Hari Ini", dibaca: false },
  { id: 2, judul: "Pengajuan Jadwal Baru", deskripsi: "Budi Darmawan mengajukan jadwal Seminar Hasil.", waktu: "2 jam lalu", jenis: "semhas", inisial: "BD", warna: "warning", kelompok: "Hari Ini", dibaca: false },
  { id: 3, judul: "Jadwal Semhas Ditolak", deskripsi: "Prof. Budi Santoso menolak usulan jadwal Siti Aminah karena bentrok.", waktu: "Kemarin", jenis: "semhas", inisial: "SA", warna: "danger", kelompok: "Kemarin", dibaca: true },
  { id: 4, judul: "Revisi Jadwal Sempro", deskripsi: "Reza Pahlevi meminta perubahan jam seminar menjadi 14:00 WITA.", waktu: "Kemarin", jenis: "sempro", inisial: "RP", warna: "success", kelompok: "Kemarin", dibaca: true },
];

export function useAdminNotifications() {
  const daftar = useState<NotifAdmin[]>("admin:notifikasi", () => SEED.map((n) => ({ ...n })));

  const belumDibaca = computed(() => daftar.value.filter((n) => !n.dibaca).length);

  const berkelompok = computed(() => {
    const urutan: KelompokNotif[] = ["Hari Ini", "Kemarin"];
    return urutan
      .map((nama) => ({ nama, item: daftar.value.filter((n) => n.kelompok === nama) }))
      .filter((g) => g.item.length > 0);
  });

  function tandaiDibaca(id: number) {
    const n = daftar.value.find((x) => x.id === id);
    if (n) n.dibaca = true;
  }

  function tandaiSemua() {
    daftar.value.forEach((n) => (n.dibaca = true));
  }

  return { daftar, belumDibaca, berkelompok, tandaiDibaca, tandaiSemua };
}
