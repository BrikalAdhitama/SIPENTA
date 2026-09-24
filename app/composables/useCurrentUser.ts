import type { Role } from "~/types/domain";

// SEMENTARA: pengguna tiruan sampai auth Supabase tersambung.
// Nanti diganti: useSupabaseUser() + baca tabel `profiles`.

export interface CurrentUser {
  nama: string;
  namaPanggilan: string;
  role: Role;
  roleLabel: string;
}

export function useCurrentUser() {
  const user = useState<CurrentUser>("auth:user", () => ({
    nama: "Marci Xander",
    namaPanggilan: "Marci",
    role: "admin",
    roleLabel: "Admin account",
  }));
  return { user: readonly(user) };
}
