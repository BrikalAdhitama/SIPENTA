import { createClient } from "@supabase/supabase-js";

// POST /api/auth/login — publik. Terima { identifier, password }.
// identifier = email kampus ATAU NIM (mahasiswa) ATAU NIP (dosen).
// NIM/NIP dipetakan ke email di server, jadi FE tidak pernah tahu email orang lain.
// ponytail: pindah resolve ke service bila dipakai endpoint lain.

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const identifier = String(body?.identifier ?? "").trim();
  const password = String(body?.password ?? "");

  if (!identifier || !password) {
    throw createError({ statusCode: 400, statusMessage: "Identitas dan password wajib diisi." });
  }

  const config = useRuntimeConfig();
  const url = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;
  const serviceKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: "Konfigurasi Supabase belum lengkap." });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  let email = identifier;

  if (!identifier.includes("@")) {
    const [{ data: dosen }, { data: mahasiswa }] = await Promise.all([
      admin.from("dosen").select("id").eq("nip", identifier).maybeSingle(),
      admin.from("mahasiswa").select("id").eq("nim", identifier).maybeSingle(),
    ]);

    if (dosen && mahasiswa) {
      throw createError({ statusCode: 401, statusMessage: "NIM/NIP/email atau password salah." });
    }

    const ref = dosen
      ? { col: "dosen_id", id: dosen.id }
      : mahasiswa
        ? { col: "mahasiswa_id", id: mahasiswa.id }
        : null;

    if (!ref) {
      throw createError({ statusCode: 401, statusMessage: "NIM/NIP/email atau password salah." });
    }

    const { data: profil } = await admin.from("profiles").select("id").eq(ref.col, ref.id).maybeSingle();
    if (!profil) {
      throw createError({ statusCode: 401, statusMessage: "NIM/NIP/email atau password salah." });
    }

    const { data: authUser, error: authError } = await admin.auth.admin.getUserById(profil.id);
    if (authError || !authUser?.user?.email) {
      throw createError({ statusCode: 401, statusMessage: "NIM/NIP/email atau password salah." });
    }

    email = authUser.user.email;
  }

  const anon = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data, error } = await anon.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    throw createError({ statusCode: 401, statusMessage: "NIM/NIP/email atau password salah." });
  }

  const { data: profile } = await admin.from("profiles").select("nama, role").eq("id", data.user.id).single();
  if (!profile) {
    throw createError({ statusCode: 403, statusMessage: "Akun belum terhubung ke data kampus. Hubungi admin." });
  }

  return {
    success: true,
    data: {
      session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token },
      user: { id: data.user.id, email: data.user.email ?? "" },
      profile,
    },
  };
});
