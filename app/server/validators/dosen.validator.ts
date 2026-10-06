export function validateDosenId(id: string | undefined) {
  if (!id) {
    return { ok: false, message: "ID dosen wajib diisi." };
  }

  if (typeof id !== "string") {
    return { ok: false, message: "Format ID dosen tidak valid." };
  }

  return { ok: true };
}
