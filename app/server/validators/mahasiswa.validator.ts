export function validateMahasiswaId(id: string | undefined) {
  if (!id) {
    return { ok: false, message: "ID mahasiswa wajib diisi." };
  }

  if (typeof id !== "string") {
    return { ok: false, message: "Format ID mahasiswa tidak valid." };
  }

  return { ok: true };
}
