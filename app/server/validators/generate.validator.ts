export function validateGenerateBody(body: any) {
  if (!body || typeof body !== "object") return { ok: false as const, message: "Body tidak valid." };
  if (!Number.isInteger(body.gelombangId) || body.gelombangId <= 0) {
    return { ok: false as const, message: "gelombangId wajib bilangan bulat positif." };
  }
  if (body.gaParams !== undefined && (typeof body.gaParams !== "object" || Array.isArray(body.gaParams))) {
    return { ok: false as const, message: "gaParams harus objek bila diisi." };
  }
  return { ok: true as const };
}
