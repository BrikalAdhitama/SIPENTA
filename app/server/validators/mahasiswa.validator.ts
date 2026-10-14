export function validateMahasiswaId(id: string | undefined) {
  if (!id) {
    return { ok: false, message: "ID mahasiswa wajib diisi." };
  }

  if (typeof id !== "string") {
    return { ok: false, message: "Format ID mahasiswa tidak valid." };
  }

  return { ok: true };
}

export function validateMahasiswaBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const nim = String(body.nim ?? "").trim();
  const nama = String(body.nama ?? body.name ?? "").trim();
  if (!nim) return { ok: false as const, message: "NIM wajib diisi." };
  if (!nama) return { ok: false as const, message: "Nama mahasiswa wajib diisi." };
  return { ok: true as const };
}
