import type { Role } from "~/types/domain";

export interface Profile {
  id: string;
  role: Role;
  nama: string;
  dosen_id: number | null;
  mahasiswa_id: number | null;
  onboarding_at: string | null;
}

// NIM dummy. Nanti diganti.
const DEMO_ACCOUNTS: Record<string, Profile> = {
  "19811111": { id: "demo-dosen-1", role: "dosen", nama: "Dr. Ahmad Fauzi, M.T", dosen_id: 1, mahasiswa_id: null, onboarding_at: new Date().toISOString() },
  "11111011": { id: "demo-mhs-1", role: "mahasiswa", nama: "Marci", dosen_id: null, mahasiswa_id: 1, onboarding_at: new Date().toISOString() },
  "ADM001": { id: "demo-admin-1", role: "admin", nama: "Ibu Dewi", dosen_id: null, mahasiswa_id: null, onboarding_at: new Date().toISOString() },
};

const useProfileState = () => useState<Profile | null>("auth:profile", () => null);

export function useAuth() {
  const profile = useProfileState();

  const isAuthenticated = computed(() => !!profile.value);
  const role = computed<Role | null>(() => profile.value?.role ?? null);
  const needsOnboarding = computed(() => false); // dimatikan di mode preview

  async function login(nomorInduk: string, _password: string) {// belum diset nunggu backend, jadi password diabaikan
    const found = DEMO_ACCOUNTS[nomorInduk.trim()];
    if (!found) throw new Error("Nomor Induk tidak ditemukan");
    profile.value = found;
    return found;
  }

  async function logout() {
    profile.value = null;
    await navigateTo("/login");
  }

  return { profile, isAuthenticated, role, needsOnboarding, login, logout };
}
