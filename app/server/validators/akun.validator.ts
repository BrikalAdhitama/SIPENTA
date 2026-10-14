export function validateAkunBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const tipe = String(body.tipe ?? body.role ?? "").trim();
  if (!["mahasiswa", "dosen"].includes(tipe)) {
    return { ok: false as const, message: "tipe harus mahasiswa/dosen." };
  }
  const idKampus = String(body.nim ?? body.nip ?? body.identifier ?? "").trim();
  if (!idKampus) return { ok: false as const, message: "NIM/NIP wajib diisi." };
  const email = String(body.email ?? "").trim();
  if (!email.includes("@")) return { ok: false as const, message: "email tidak valid." };
  const password = String(body.password ?? "");
  if (password.length < 6) return { ok: false as const, message: "password minimal 6 karakter." };
  return { ok: true as const, tipe, idKampus, email, password };
}
