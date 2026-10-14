export function validateDosenId(id: string | undefined) {
  if (!id) {
    return { ok: false, message: "ID dosen wajib diisi." };
  }

  if (typeof id !== "string") {
    return { ok: false, message: "Format ID dosen tidak valid." };
  }

  return { ok: true };
}

export function validateDosenBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const nip = String(body.nip ?? "").trim();
  const nama = String(body.nama ?? body.name ?? "").trim();
  const bidang = String(body.bidang ?? body.keahlian ?? "").trim();
  if (!nip) return { ok: false as const, message: "NIP wajib diisi." };
  if (!nama) return { ok: false as const, message: "Nama dosen wajib diisi." };
  if (!bidang) return { ok: false as const, message: "Bidang keahlian wajib diisi." };
  return { ok: true as const };
}
