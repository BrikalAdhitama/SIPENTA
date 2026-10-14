const HARI = ["senin", "selasa", "rabu", "kamis", "jumat"];

export function validateJadwalBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  if (!body.mataKuliah || !body.kelas || !body.ruangan) {
    return { ok: false as const, message: "mataKuliah, kelas, ruangan wajib diisi." };
  }
  if (!HARI.includes(body.hari)) return { ok: false as const, message: "hari harus senin-jumat." };
  if (!body.jamMulai || !body.jamSelesai || body.jamSelesai <= body.jamMulai) {
    return { ok: false as const, message: "jamSelesai harus lebih besar dari jamMulai." };
  }
  return { ok: true as const };
}

export function validateBlokirBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  if (!HARI.includes(body.hari)) return { ok: false as const, message: "hari harus senin-jumat." };
  if (!body.tanggal || !body.jamMulai || !body.jamSelesai || body.jamSelesai <= body.jamMulai) {
    return { ok: false as const, message: "tanggal dan rentang jam wajib valid." };
  }
  if (!body.keterangan) return { ok: false as const, message: "keterangan wajib diisi." };
  return { ok: true as const };
}
