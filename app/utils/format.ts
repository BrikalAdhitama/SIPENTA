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

/** Tanggal ISO (YYYY-MM-DD, zona waktu lokal) dari objek Date. */
export function isoDari(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Hari ini + `n` hari (negatif = lampau) sebagai ISO. Dipakai data tiruan agar selalu relevan. */
export function tambahHari(n: number, dari: Date = new Date()): string {
  const d = new Date(dari.getFullYear(), dari.getMonth(), dari.getDate() + n);
  return isoDari(d);
}

/** Senin pada minggu `iso` (minggu Senin–Minggu) sebagai ISO. */
export function awalMinggu(iso: string): string {
  const [y, m, d] = pecahTanggal(iso);
  const dt = new Date(y, m - 1, d);
  const geser = (dt.getDay() + 6) % 7; // Senin = 0
  return isoDari(new Date(y, m - 1, d - geser));
}

/** "2026-09-25" → "Jumat, 25 September 2026" */
export function formatHariTanggal(iso: string): string {
  return `${namaHari(iso)}, ${formatTanggalPanjang(iso)}`;
}

/** `iso` digeser `n` hari (negatif = mundur) sebagai ISO. */
export function geserTanggal(iso: string, n: number): string {
  const [y, m, d] = pecahTanggal(iso);
  return isoDari(new Date(y, m - 1, d + n));
}

/** Format rentang tanggal, misal "2026-09-25" + "2026-09-27" → "25 Sep 2026 – 27 Sep 2026" */
export function formatRentangTanggal(mulai: string, selesai: string, pemisah = " – "): string {
  return `${formatTanggalPendek(mulai)}${pemisah}${formatTanggalPendek(selesai)}`;
}
/** Ambil inisial dari nama lengkap. */
export function inisial(nama: string): string {
  return nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((kata) => kata[0]?.toUpperCase() ?? "")
    .join("");
}