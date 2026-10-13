export function validateSeminarPatch(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const { penguji1_id, penguji2_id, pembimbing_utama_id, pembimbing_pendamping_id, judul } = body;
  const ids = [pembimbing_utama_id, pembimbing_pendamping_id, penguji1_id, penguji2_id]
    .filter((v) => v !== undefined && v !== null);
  if (!ids.length && body.is_online === undefined && body.dijadwalkan === undefined && body.validasi === undefined && judul === undefined) {
    return { ok: false as const, message: "Tidak ada field yang diubah." };
  }
  for (const v of ids) {
    if (!Number.isInteger(Number(v)) || Number(v) <= 0) return { ok: false as const, message: "ID dosen harus bilangan positif." };
  }
  // Cek 4 dosen berbeda: penguji ≠ pembimbing, penguji1 ≠ penguji2 (bila keempat terisi).
  const keempat = [pembimbing_utama_id, pembimbing_pendamping_id, penguji1_id, penguji2_id].map(Number);
  if (keempat.every((v) => Number.isInteger(v) && v > 0) && new Set(keempat).size !== 4) {
    return { ok: false as const, message: "Keempat dosen harus orang berbeda." };
  }
  // Sepasang pembimbing wajib beda bila keduanya diisi.
  const pb = [pembimbing_utama_id, pembimbing_pendamping_id].map(Number);
  if (pb.every((v) => Number.isInteger(v) && v > 0) && pb[0] === pb[1]) {
    return { ok: false as const, message: "Pembimbing 1 dan 2 harus orang berbeda." };
  }
  if (body.validasi !== undefined && !["valid", "invalid", "duplikat"].includes(body.validasi)) {
    return { ok: false as const, message: "validasi harus valid/invalid/duplikat." };
  }
  if (judul !== undefined && !String(judul).trim()) {
    return { ok: false as const, message: "Judul tidak boleh kosong." };
  }
  for (const k of ["is_online", "dijadwalkan"] as const) {
    if (body[k] !== undefined && typeof body[k] !== "boolean") return { ok: false as const, message: `${k} harus boolean.` };
  }
  return { ok: true as const };
}

// Mahasiswa hanya boleh isi pembimbing + judul miliknya sendiri — tanpa penguji/validasi.
export function validatePembimbingSendiri(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const kunci = Object.keys(body);
  if (!kunci.length) return { ok: false as const, message: "Tidak ada field yang diubah." };
  const boleh = new Set(["pembimbing_utama_id", "pembimbing_pendamping_id", "judul"]);
  for (const k of kunci) {
    if (!boleh.has(k)) return { ok: false as const, message: "Mahasiswa hanya boleh isi pembimbing + judul." };
  }
  const { pembimbing_utama_id, pembimbing_pendamping_id, judul } = body;
  if (pembimbing_utama_id === undefined && pembimbing_pendamping_id === undefined && judul === undefined) {
    return { ok: false as const, message: "Pilih minimal satu pembimbing / judul." };
  }
  for (const v of [pembimbing_utama_id, pembimbing_pendamping_id].filter((x) => x !== undefined)) {
    if (!Number.isInteger(Number(v)) || Number(v) <= 0) return { ok: false as const, message: "ID dosen harus bilangan positif." };
  }
  if (judul !== undefined && !String(judul).trim()) {
    return { ok: false as const, message: "Judul tidak boleh kosong." };
  }
  if (
    pembimbing_utama_id !== undefined && pembimbing_pendamping_id !== undefined &&
    Number(pembimbing_utama_id) === Number(pembimbing_pendamping_id)
  ) {
    return { ok: false as const, message: "Pembimbing 1 dan 2 harus orang berbeda." };
  }
  return { ok: true as const };
}

export function validateSeminarBulk(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  const gelombangId = Number(body.gelombang_id ?? body.gelombangId);
  // CSV mentah diparse service — terima tanpa cek array.
  if (typeof body.csv === "string" && body.csv.trim().length > 0) {
    if (!Number.isInteger(gelombangId) || gelombangId <= 0) {
      return { ok: false as const, message: "gelombang_id wajib bilangan positif." };
    }
    return { ok: true as const };
  }
  const rows = body.seminar ?? body.rows ?? body.items;
  if (!Number.isInteger(gelombangId) || gelombangId <= 0) {
    return { ok: false as const, message: "gelombang_id wajib bilangan positif." };
  }
  if (!Array.isArray(rows) || !rows.length) {
    return { ok: false as const, message: "Daftar seminar minimal satu baris." };
  }
  for (const [i, r] of rows.entries()) {
    if (!r || typeof r !== "object") return { ok: false as const, message: `Baris ${i + 1} tidak valid.` };
    const nim = String(r.nim ?? "").trim();
    const nama = String(r.nama ?? r.name ?? "").trim();
    if (!nim || !nama) return { ok: false as const, message: `Baris ${i + 1}: NIM dan nama wajib diisi.` };
  }
  return { ok: true as const };
}
