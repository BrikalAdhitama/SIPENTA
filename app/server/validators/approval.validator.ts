export function validateRunId(id: unknown) {
  if (!Number.isInteger(id) || (id as number) <= 0) return { ok: false as const, message: "run_id wajib bilangan bulat positif." };
  return { ok: true as const };
}

export function validateApprovalId(id: unknown) {
  if (!Number.isInteger(id) || (id as number) <= 0) return { ok: false as const, message: "approval_id wajib bilangan bulat positif." };
  return { ok: true as const };
}
