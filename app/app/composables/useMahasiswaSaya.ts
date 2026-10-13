import type { JenisSeminarUI } from "~/types/domain";
import { hariMenuju, tambahHari } from "~/utils/format";

// Data halaman mahasiswa (Dashboard, Jadwal Saya, Profil Saya) — dipakai versi web (dan nanti mobile).
// SEMENTARA: data tiruan. Nanti diganti query Supabase:
//   profil   → profiles + mahasiswa (nim, nama, angkatan) + dosen pembimbing dari seminar.
//              Prodi, semester, kontak & alamat belum ada di skema — perlu kolom baru.
//   seminar  → seminar milik mahasiswa login, join schedule_slot run final + ruangan + dosen

export type StatusSeminar = "menunggu" | "terkonfirmasi" | "selesai";

export const STATUS_SEMINAR_LABEL: Record<StatusSeminar, string> = {
  menunggu: "Menunggu",
  terkonfirmasi: "Terkonfirmasi",
  selesai: "Selesai",
};

export interface SeminarSaya {
  id: number;
  jenis: JenisSeminarUI;
  judul: string;
  keterangan: string;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string;
  jamSelesai: string;
  ruangan: string;
  status: StatusSeminar;
  ketuaPenguji: string;
  catatan: string;
}

export interface ProfilMahasiswa {
  nama: string;
  inisial: string;
  nim: string;
  email: string;
  prodi: string;
  programStudi: string;
  angkatan: string;
  semester: number;
  semesterLabel: string;
  status: string;
  pembimbing1: string;
  pembimbing2: string;
  judulTA: string;
  noHp: string;
  alamat: string;
  username: string;
}

// Bagian profil yang boleh diubah mahasiswa sendiri; nama, NIM, prodi & pembimbing dikelola admin.
export type ProfilKontakInput = Pick<ProfilMahasiswa, "email" | "noHp" | "alamat">;

export function useMahasiswaSaya() {
  // state bersama (useState): hasil edit di halaman Profil ikut terlihat di halaman mahasiswa lain
  const profil = useState<ProfilMahasiswa>("mahasiswa:profil", () => ({
    nama: "Nadia Ramadhani",
    inisial: "NR",
    nim: "11111012",
    email: "11111012@student.itk.ac.id",
    prodi: "Teknik Informatika",
    programStudi: "S1 Teknik Informatika",
    angkatan: "2021",
    semester: 8,
    semesterLabel: "Ganjil 2025/2026",
    status: "Aktif",
    pembimbing1: "Dr. Sari Dewi",
    pembimbing2: "Dr. Hendra Wijaya",
    judulTA: "Analisis Sentimen Ulasan E-commerce",
    noHp: "0812-3456-7890",
    alamat: "Bandung, Jawa Barat",
    username: "nadia.ramadhani",
  }));

  // urut terbaru dulu, seperti tabel di Figma
  const seminar = ref<SeminarSaya[]>([
    {
      id: 2,
      jenis: "semhas",
      judul: "Analisis Sentimen Ulasan E-commerce",
      keterangan: "Seminar Hasil • Pembimbing utama: Dr. Sari Dewi",
      tanggal: tambahHari(13), // 13 hari lagi (sesuai Figma)
      jamMulai: "10:00",
      jamSelesai: "11:45",
      ruangan: "B203",
      status: "terkonfirmasi",
      ketuaPenguji: "Dr. Budi Santoso",
      catatan: "Bawa 3 salinan laporan hasil penelitian dan unggah slide presentasi paling lambat H-1.",
    },
    {
      id: 1,
      jenis: "sempro",
      judul: "Presentasi Seminar Proposal",
      keterangan: "Proposal penelitian telah selesai dipresentasikan",
      tanggal: tambahHari(-82),
      jamMulai: "09:00",
      jamSelesai: "10:00",
      ruangan: "B201",
      status: "selesai",
      ketuaPenguji: "Dr. Ahmad Fauzi",
      catatan: "",
    },
  ]);

  /** Seminar berikutnya yang belum selesai (hari ini atau nanti). */
  const seminarTerdekat = computed(
    () =>
      seminar.value
        .filter((s) => s.status !== "selesai" && hariMenuju(s.tanggal) >= 0)
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))[0] ?? null,
  );

  /** Seminar terbaru untuk satu jenis (sempro/semhas), atau null kalau belum ada. */
  function seminarJenis(jenis: JenisSeminarUI) {
    return computed(() => seminar.value.find((s) => s.jenis === jenis) ?? null);
  }

  /** Pesan galat bila data kontak tidak valid, `null` bila boleh disimpan. */
  function validasiProfil(input: ProfilKontakInput): string | null {
    if (!input.email.trim()) return "Email wajib diisi.";
    if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) return "Format email tidak valid.";
    const digitHp = input.noHp.replace(/\D/g, "");
    if (!/^[0-9+\-\s()]+$/.test(input.noHp.trim()) || digitHp.length < 9 || digitHp.length > 15) return "No. HP harus 9–15 digit angka.";
    if (!input.alamat.trim()) return "Alamat wajib diisi.";
    return null;
  }

  // TODO(BE): simpan ke Supabase (profiles/mahasiswa) — kolom kontak & alamat belum ada di skema.
  function ubahProfil(input: ProfilKontakInput) {
    Object.assign(profil.value, { email: input.email.trim(), noHp: input.noHp.trim(), alamat: input.alamat.trim() });
  }

  return { profil, seminar, seminarTerdekat, seminarJenis, validasiProfil, ubahProfil };
}
