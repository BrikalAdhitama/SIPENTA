export function validateRuanganId(id: string | undefined) {
  if (!id) {
    return { ok: false, message: "ID ruangan wajib diisi." };
  }

  if (typeof id !== "string") {
    return { ok: false, message: "Format ID ruangan tidak valid." };
  }

  return { ok: true };
}
