const BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** "2026-09-25" → "25 Sep 2026" */
export function formatTanggalPendek(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${BULAN_PENDEK[m - 1]} ${y}`;
}

/** "08:00","08:50" → "08:00 – 08:50" */
export function formatJam(mulai: string, selesai: string): string {
  return `${mulai} – ${selesai}`;
}
