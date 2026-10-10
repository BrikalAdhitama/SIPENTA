export function validateGelombangBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const { nama, jenis, tanggalMulai, tanggalSelesai, hari, jamMulai, jamSelesai, ruangan } = body;
  if (!nama || typeof nama !== "string") return { ok: false as const, message: "nama wajib diisi." };
  if (!["sempro", "semhas", "seminar_proposal", "seminar_hasil"].includes(jenis)) {
    return { ok: false as const, message: "jenis harus sempro/semhas." };
  }
  if (!tanggalMulai || !tanggalSelesai || tanggalSelesai < tanggalMulai) {
    return { ok: false as const, message: "periode tanggal tidak valid." };
  }
  if (!Array.isArray(hari) || !hari.length) return { ok: false as const, message: "hari minimal satu." };
  if (!jamMulai || !jamSelesai) return { ok: false as const, message: "jam operasional wajib diisi." };
  if (!Array.isArray(ruangan) || !ruangan.length) return { ok: false as const, message: "ruangan minimal satu." };
  return { ok: true as const };
}
