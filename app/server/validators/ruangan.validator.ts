export function validateRuanganId(id: string | undefined) {
  if (!id) {
    return { ok: false, message: "ID ruangan wajib diisi." };
  }

  if (typeof id !== "string") {
    return { ok: false, message: "Format ID ruangan tidak valid." };
  }

  return { ok: true };
}

export function validateRuanganBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const kode = String(body.kode ?? body.nama ?? body.name ?? "").trim().toUpperCase().replace(/\s+/g, "-");
  const nama = String(body.nama ?? body.name ?? "").trim();
  if (!nama) return { ok: false as const, message: "Nama ruangan wajib diisi." };
  return { ok: true as const, kode };
}
