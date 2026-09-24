// bakal hapus file ini kalau Supabase sudah siap
function createQueryBuilder(table: string) {
  const state: any = { op: "select", single: false, count: false };
  const chain: any = {};
  ["eq", "neq", "gt", "lt", "gte", "lte", "like", "ilike", "in", "order", "limit", "match", "is"].forEach((m) => {
    chain[m] = () => chain;
  });
  chain.select = (_cols?: string, opts?: { count?: string; head?: boolean }) => {
    if (opts?.count) state.count = true;
    return chain;
  };
  chain.single = () => { state.single = true; return chain; };
  chain.insert = () => { state.op = "insert"; return chain; };
  chain.update = () => { state.op = "update"; return chain; };
  chain.delete = () => { state.op = "delete"; return chain; };
  chain.then = (resolve: any) => resolve(resolveMock(table, state));
  return chain;
}

function resolveMock(table: string, state: any) {
  if (state.op !== "select") return { data: null, error: null };
  if (table === "profiles") {
    const profile = { id: "preview-user-id", role: "admin", nama: "Preview Admin", dosen_id: null, mahasiswa_id: null, onboarding_at: new Date().toISOString() };
    return state.single ? { data: profile, error: null } : { data: [profile], error: null };
  }
  if (state.count) return { data: null, error: null, count: 0 };
  return { data: [], error: null };
}

export const useSupabaseClient = () => ({
  from: (table: string) => createQueryBuilder(table),
  auth: {
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
});