import type { Role } from "~/types/domain";

// SEMENTARA: login tiruan berbasis NIM/ID — belum tersambung ke Supabase.
// Nanti diganti: supabase.auth.signInWithPassword() + baca role dari tabel `profiles`.
// Cara ganti: cukup ubah isi `login()` dan `logout()` di bawah; halaman lain tetap
// memakai `useAuth()` / `useCurrentUser()` seperti sekarang.

export interface Akun {
  nim: string;
  nama: string;
  namaPanggilan: string;
  role: Role;
  roleLabel: string;
}

export const AKUN_TIRUAN: Record<string, Akun> = {
  "000123": { nim: "000123", nama: "Marci Xander", namaPanggilan: "Marci", role: "admin", roleLabel: "Admin account" },
  "1920123456": { nim: "1920123456", nama: "Dr. Sari Dewi", namaPanggilan: "Sari", role: "dosen", roleLabel: "Dosen" },
  "11111012": { nim: "11111012", nama: "Nadia Ramadhani", namaPanggilan: "Nadia", role: "mahasiswa", roleLabel: "Mahasiswa" },
};

export const DASHBOARD_PATH: Record<Role, string> = {
  admin: "/admin/dashboard",
  dosen: "/dosen",
  mahasiswa: "/mahasiswa/dashboard",
};

const COOKIE = "sipenta-nim";
const SATU_BULAN = 60 * 60 * 24 * 30;

export type HasilLogin = { ok: true; akun: Akun } | { ok: false; error: string };

export function useAuth() {
  // state dibaca dari cookie sekali (saat app dibuka), lalu dipakai bersama semua komponen
  const nim = useState<string | null>("auth:nim", () => useCookie<string | null>(COOKIE).value ?? null);
  const akun = computed<Akun | null>(() => (nim.value ? (AKUN_TIRUAN[nim.value] ?? null) : null));

  /** `ingat` = Remember me → sesi bertahan 30 hari; kalau tidak, hilang saat browser ditutup. */
  function login(input: string, ingat = false): HasilLogin {
    const id = input.trim();
    const dapat = AKUN_TIRUAN[id];
    if (!dapat) return { ok: false, error: "NIM tidak terdaftar." };
    nim.value = id;
    useCookie<string | null>(COOKIE, { sameSite: "lax", maxAge: ingat ? SATU_BULAN : undefined }).value = id;
    return { ok: true, akun: dapat };
  }

  function logout() {
    nim.value = null;
    useCookie<string | null>(COOKIE).value = null;
    return navigateTo("/login", { replace: true });
  }

  const dashboardPath = (role: Role) => DASHBOARD_PATH[role];

  return { akun, login, logout, dashboardPath };
}
