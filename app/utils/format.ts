const BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function pecahTanggal(iso: string): [number, number, number] {
  const [y, m, d] = iso.split("-").map(Number);
  return [y, m, d];
}

/** "2026-09-25" → "25 Sep 2026" */
export function formatTanggalPendek(iso: string): string {
  const [y, m, d] = pecahTanggal(iso);
  return `${d} ${BULAN_PENDEK[m - 1]} ${y}`;
}

/** "2026-09-25" → "25 September 2026" */
export function formatTanggalPanjang(iso: string): string {
  const [y, m, d] = pecahTanggal(iso);
  return `${d} ${BULAN_PANJANG[m - 1]} ${y}`;
}

/** "2026-09-25" → "25 Sep" */
export function formatTanggalBulan(iso: string): string {
  const [, m, d] = pecahTanggal(iso);
  return `${d} ${BULAN_PENDEK[m - 1]}`;
}

/** "2026-09-25" → "Sep 2026" */
export function formatBulanTahun(iso: string): string {
  const [y, m] = pecahTanggal(iso);
  return `${BULAN_PENDEK[m - 1]} ${y}`;
}

/** "2026-09-25" → 25 */
export function tanggalKe(iso: string): number {
  return pecahTanggal(iso)[2];
}

/** "2026-09-25" → "Jumat" */
export function namaHari(iso: string): string {
  const [y, m, d] = pecahTanggal(iso);
  return HARI[new Date(y, m - 1, d).getDay()];
}

/** Selisih hari kalender dari hari ini ke `iso` (0 = hari ini, negatif = sudah lewat). */
export function hariMenuju(iso: string, dari: Date = new Date()): number {
  const [y, m, d] = pecahTanggal(iso);
  const target = Date.UTC(y, m - 1, d);
  const hariIni = Date.UTC(dari.getFullYear(), dari.getMonth(), dari.getDate());
  return Math.round((target - hariIni) / 86_400_000);
}

/** "08:00","08:50" → "08:00 – 08:50" */
export function formatJam(mulai: string, selesai: string): string {
  return `${mulai} – ${selesai}`;
}

/** "08:00" → "08.00" (gaya penulisan jam di frame mahasiswa) */
export function jamTitik(jam: string): string {
  return jam.replace(":", ".");
}
