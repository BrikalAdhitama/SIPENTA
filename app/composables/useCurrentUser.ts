import type { Role } from "~/types/domain";

// SEMENTARA: pengguna tiruan sampai auth Supabase tersambung.
// Nanti diganti: useSupabaseUser() + baca tabel `profiles`.
// Bila sudah login lewat halaman login (lihat useAuth), yang dipakai akun login itu.
// Bila belum (mis. membuka URL langsung saat pengembangan), role ditebak dari awalan
// URL (/admin, /dosen, /mahasiswa) supaya sidebar tiap role tetap menampilkan akun yang sesuai.

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
