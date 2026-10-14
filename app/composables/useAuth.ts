import type { Role } from "~/types/domain";

// Auth: login via identifier (email kampus ATAU NIM ATAU NIP) + password.
// Resolusi NIM/NIP → email dikerjakan server (POST /api/auth/login),
// FE tidak pernah tahu email orang lain. Tanpa registrasi publik.

export interface Akun {
  id: string;
  email: string;
  nama: string;
  namaPanggilan: string;
  role: Role;
  roleLabel: string;
}

export const DASHBOARD_PATH: Record<Role, string> = {
  admin: "/admin/dashboard",
  dosen: "/dosen",
  mahasiswa: "/mahasiswa/dashboard",
};

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin account",
  dosen: "Dosen",
  mahasiswa: "Mahasiswa",
};

export type HasilLogin = { ok: true; akun: Akun } | { ok: false; error: string };

function namaPanggilan(nama: string) {
  return nama.split(" ")[0] || nama;
}

export function useAuth() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const profil = useState<{ nama: string; role: Role } | null>("auth:profil", () => null);
  const memuat = useState("auth:memuat", () => false);

  const akun = computed<Akun | null>(() => {
    if (!user.value || !profil.value) return null;
    return {
      id: user.value.id,
      email: user.value.email ?? "",
      nama: profil.value.nama,
      namaPanggilan: namaPanggilan(profil.value.nama),
      role: profil.value.role,
      roleLabel: ROLE_LABEL[profil.value.role],
    };
  });

  async function muatProfil(userId: string) {
    // Sudah diisi saat login; refresh bila reload halaman.
    if (profil.value) return;
    memuat.value = true;
    try {
      const { data, error } = await client.from("profiles").select("nama, role").eq("id", userId).single();
      profil.value = error ? null : (data as { nama: string; role: Role });
    } finally {
      memuat.value = false;
    }
  }

  watch(user, (u) => {
    if (u) muatProfil(u.id);
    else profil.value = null;
  }, { immediate: true });

  // `ingat` diabaikan: sesi Supabase persist otomatis. ponytail: wire remember-me bila perlu via cookie options.
  async function login(identifier: string, password: string, _ingat = false): Promise<HasilLogin> {
    const id = identifier.trim();
    if (!id || !password) return { ok: false, error: "NIM/NIP/email dan password wajib diisi." };
    try {
      const res = await $fetch<{ success: boolean; data: {
        session: { access_token: string; refresh_token: string };
        user: { id: string; email: string };
        profile: { nama: string; role: Role };
      } }>("/api/auth/login", { method: "POST", body: { identifier: id, password } });
      await client.auth.setSession(res.data.session);
      profil.value = res.data.profile;
      return { ok: true, akun: akun.value as Akun };
    } catch (e: any) {
      const msg = e?.data?.statusMessage || e?.statusMessage || "NIM/NIP/email atau password salah.";
      return { ok: false, error: String(msg) };
    }
  }

  async function logout() {
    await client.auth.signOut();
    profil.value = null;
    return navigateTo("/login", { replace: true });
  }

  const dashboardPath = (role: Role) => DASHBOARD_PATH[role];

  return { akun, memuat, login, logout, dashboardPath };
}
