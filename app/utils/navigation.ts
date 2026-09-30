// Menu sidebar web per role. Satu daftar — dipakai AppSidebar.
// (BottomNav mobile masih punya daftarnya sendiri; bisa ikut pakai ini nanti.)

export type NavIcon =
  | "dashboard"
  | "penjadwalan"
  | "mahasiswa"
  | "jadwal"
  | "jadwal-pribadi"
  | "dosen"
  | "ruangan"
  | "profil";

// Kunci lencana angka merah di sisi kanan menu (mis. jumlah jadwal yang menunggu konfirmasi).
export type BadgeKey = "jadwalSeminar" | "konfirmasi";

export interface NavItem {
  label: string;
  to: string;
  icon: NavIcon;
  badgeKey?: BadgeKey;
  /** Diisi navForPath dari badgeKey. Lencana hanya tampil bila > 0. */
  badge?: number;
}

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "dashboard" },
  { label: "Penjadwalan", to: "/admin/penjadwalan", icon: "penjadwalan" },
  { label: "Mahasiswa", to: "/admin/mahasiswa", icon: "mahasiswa" },
  { label: "Jadwal", to: "/admin/jadwal", icon: "jadwal" },
  { label: "Dosen", to: "/admin/dosen", icon: "dosen" },
  { label: "Ruangan", to: "/admin/ruangan", icon: "ruangan" },
];

export const MAHASISWA_NAV: NavItem[] = [
  { label: "Dashboard", to: "/mahasiswa/dashboard", icon: "dashboard" },
  { label: "Jadwal Saya", to: "/mahasiswa/jadwal", icon: "jadwal" },
  { label: "Profil Saya", to: "/mahasiswa/profil", icon: "profil" },
];

export const DOSEN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/dosen", icon: "dashboard" },
  { label: "Jadwal Seminar", to: "/dosen/jadwal-seminar", icon: "jadwal", badgeKey: "jadwalSeminar" },
  { label: "Jadwal Pribadi", to: "/dosen/jadwal-pribadi", icon: "jadwal-pribadi" },
  { label: "Konfirmasi Jadwal", to: "/dosen/konfirmasi-jadwal", icon: "jadwal", badgeKey: "konfirmasi" },
];

export function navForPath(path: string, badges: Partial<Record<BadgeKey, number>> = {}): NavItem[] {
  let items: NavItem[] = [];
  if (path.startsWith("/admin")) items = ADMIN_NAV;
  else if (path.startsWith("/mahasiswa")) items = MAHASISWA_NAV;
  else if (path.startsWith("/dosen")) items = DOSEN_NAV;
  return items.map((i) => (i.badgeKey ? { ...i, badge: badges[i.badgeKey] ?? 0 } : i));
}
