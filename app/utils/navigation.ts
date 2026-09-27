// Menu sidebar web per role. Satu daftar — dipakai AppSidebar.
// (BottomNav mobile masih punya daftarnya sendiri; bisa ikut pakai ini nanti.)

export type NavIcon = "dashboard" | "penjadwalan" | "mahasiswa" | "jadwal" | "dosen" | "ruangan" | "profil";

export interface NavItem {
  label: string;
  to: string;
  icon: NavIcon;
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

export function navForPath(path: string): NavItem[] {
  if (path.startsWith("/admin")) return ADMIN_NAV;
  if (path.startsWith("/mahasiswa")) return MAHASISWA_NAV;
  return [];
}
