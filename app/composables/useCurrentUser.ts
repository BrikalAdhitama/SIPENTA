import type { Role } from "~/types/domain";

// Header/sidebar: tampilkan akun login. Belum login → tebak role dari URL
// supaya layout tiap role tetap bisa dibuka saat pengembangan.

export interface CurrentUser {
  nama: string;
  namaPanggilan: string;
  role: Role;
  roleLabel: string;
}

const PENGGUNA_TIRUAN: Record<Role, CurrentUser> = {
  admin: { nama: "Marci Xander", namaPanggilan: "Marci", role: "admin", roleLabel: "Admin account" },
  dosen: { nama: "Dr. Sari Dewi", namaPanggilan: "Sari", role: "dosen", roleLabel: "Dosen" },
  mahasiswa: { nama: "Nadia Ramadhani", namaPanggilan: "Nadia", role: "mahasiswa", roleLabel: "Mahasiswa" },
};

export function useCurrentUser() {
  const route = useRoute();
  const { akun } = useAuth();
  const user = computed<CurrentUser>(() => {
    if (akun.value) return akun.value;
    if (route.path.startsWith("/mahasiswa")) return PENGGUNA_TIRUAN.mahasiswa;
    if (route.path.startsWith("/dosen")) return PENGGUNA_TIRUAN.dosen;
    return PENGGUNA_TIRUAN.admin;
  });
  return { user };
}
