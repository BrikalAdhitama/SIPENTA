// hapus file ini kalau Supabase sudah siap
export const useSupabaseUser = () =>
  useState("mock-supabase-user", () => ({ id: "preview-user-id", email: "preview@sipenta.local" }));
