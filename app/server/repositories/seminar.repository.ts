import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "#imports";

// Cache nama dosen antar request; hilang saat restart Nitro.
// ponytail: pindah ke Redis bila multi-instance.
const cacheNamaDosen = new Map<number, string>();

// Satu-satunya query seminar. Tulis penguji/is_online/validasi di sini.
// Ganti DB = ganti file ini.
export class SeminarRepository {
  private client() {
    const config = useRuntimeConfig();
    const url = config.public?.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL;
    const key = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Konfigurasi Supabase belum lengkap.");
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  async list(gelombangId?: number, batas = 100, filter?: { mahasiswaId?: number; dosenId?: number }) {
    // Join mahasiswa+gelombang; nama dosen manual agar tahan nama constraint.
    // Filter milik-sendiri: mahasiswa → eq, dosen → or 4 kolom peran.
    // Repo pakai service-role (lolos RLS) → filter di sini pengganti policy select.
    let q = this.client().from("seminar")
      .select("*, mahasiswa(nim,nama), gelombang(nama,jenis)")
      .order("urutan_daftar", { ascending: true, nullsFirst: false })
      .limit(batas);
    if (gelombangId) q = q.eq("gelombang_id", gelombangId);
    if (filter?.mahasiswaId) q = q.eq("mahasiswa_id", filter.mahasiswaId);
    if (filter?.dosenId) {
      const d = filter.dosenId;
      q = q.or(`pembimbing_utama_id.eq.${d},pembimbing_pendamping_id.eq.${d},penguji1_id.eq.${d},penguji2_id.eq.${d}`);
    }
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const ids = [...new Set(rows.flatMap((r: any) => [
      r.pembimbing_utama_id, r.pembimbing_pendamping_id, r.penguji1_id, r.penguji2_id,
    ]).filter(Boolean))] as number[];
    const kurang = ids.filter((id) => !cacheNamaDosen.has(id));
    if (kurang.length) {
      const { data: ds } = await this.client().from("dosen").select("id,nama").in("id", kurang);
      for (const d of (ds ?? [])) cacheNamaDosen.set((d as any).id, (d as any).nama);
    }
    return rows.map((r: any) => ({
      ...r,
      pembimbing_utama_nama: cacheNamaDosen.get(r.pembimbing_utama_id) ?? null,
      pembimbing_pendamping_nama: cacheNamaDosen.get(r.pembimbing_pendamping_id) ?? null,
      penguji1_nama: cacheNamaDosen.get(r.penguji1_id) ?? null,
      penguji2_nama: cacheNamaDosen.get(r.penguji2_id) ?? null,
    }));
  }

  async update(id: number, patch: Record<string, unknown>) {
    const { data, error } = await this.client().from("seminar")
      .update(patch).eq("id", id)
      .select("*, mahasiswa(nim,nama)").single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id: number) {
    const { data, error } = await this.client().from("seminar")
      .select("id,mahasiswa_id,judul,pembimbing_utama_id,pembimbing_pendamping_id,penguji1_id,penguji2_id").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data;
  }

  // Pratinjau read-only: cocokkan NIM CSV ke tabel mahasiswa + profiles + seminar.
  // Tanpa tulis. Status: cocok | baru | beda-nama. Duplikat = NIM ganda di CSV.
  // Sertakan pembimbing/penguji dari seminar DB bila sudah diisi mahasiswa (agar Preview admin terbaca).
  async pratinjau(rows: Array<Record<string, any>>) {
    const c = this.client();
    const normal = rows.map((r, i) => ({
      nim: String(r.nim ?? "").trim(),
      nama: String(r.nama ?? r.name ?? "").trim(),
      judul: String(r.judul ?? r.title ?? ""),
      urutan: Number(r.urutan_daftar ?? i + 1),
    })).filter((r) => r.nim && r.nama);
    if (!normal.length) throw new Error("Tidak ada baris valid (nim,nama wajib).");
    const hitung = new Map<string, number>();
    for (const r of normal) hitung.set(r.nim, (hitung.get(r.nim) ?? 0) + 1);
    const nims = [...hitung.keys()];
    const { data: ada, error: eAda } = await c.from("mahasiswa").select("id,nim,nama").in("nim", nims);
    if (eAda) throw new Error(eAda.message);
    const peta = new Map((ada ?? []).map((m: any) => [String(m.nim), m]));
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
    let punya = new Set<number>();
    const ids = (ada ?? []).map((m: any) => m.id).filter(Boolean);
    if (ids.length) {
      const { data: prof } = await c.from("profiles").select("mahasiswa_id").in("mahasiswa_id", ids);
      punya = new Set((prof ?? []).map((p: any) => p.mahasiswa_id).filter(Boolean));
    }
    // Ambil seminar terbaru per mahasiswa agar pembimbing yang sudah diisi
    // mahasiswa via kartu Dosen Pembimbing terbaca di Preview admin.
    const petaSeminar = new Map<number, any>();
    if (ids.length) {
      const { data: sem } = await c.from("seminar")
        .select("mahasiswa_id,judul,pembimbing_utama_id,pembimbing_pendamping_id,penguji1_id,penguji2_id,is_online")
        .in("mahasiswa_id", ids).order("id", { ascending: false });
      for (const s of (sem ?? [])) {
        if (!petaSeminar.has((s as any).mahasiswa_id)) petaSeminar.set((s as any).mahasiswa_id, s);
      }
      const idDosen = [...new Set(([...petaSeminar.values()] as any[]).flatMap((s) => [
        s.pembimbing_utama_id, s.pembimbing_pendamping_id, s.penguji1_id, s.penguji2_id,
      ]).filter(Boolean))] as number[];
      const kurang = idDosen.filter((id) => !cacheNamaDosen.has(id));
      if (kurang.length) {
        const { data: ds } = await c.from("dosen").select("id,nama").in("id", kurang);
        for (const d of (ds ?? [])) cacheNamaDosen.set((d as any).id, (d as any).nama);
      }
    }
    return normal.map((r) => {
      const db = peta.get(r.nim);
      const duplikat = (hitung.get(r.nim) ?? 0) > 1;
      if (!db) return { ...r, namaCsv: r.nama, namaDb: null, status: "baru", punyaAkun: false, duplikat };
      const sama = norm(String(db.nama)) === norm(r.nama);
      const sem = petaSeminar.get(db.id);
      const judulDb = sem?.judul ? String(sem.judul) : "";
      return {
        ...r,
        judul: r.judul || judulDb,
        namaCsv: r.nama, namaDb: db.nama,
        status: sama ? "cocok" : "beda-nama",
        punyaAkun: punya.has(db.id), duplikat,
        pembimbing1: cacheNamaDosen.get(sem?.pembimbing_utama_id) ?? null,
        pembimbing2: cacheNamaDosen.get(sem?.pembimbing_pendamping_id) ?? null,
        penguji1: cacheNamaDosen.get(sem?.penguji1_id) ?? null,
        penguji2: cacheNamaDosen.get(sem?.penguji2_id) ?? null,
        isDaring: sem?.is_online ?? false,
      };
    });
  }

  // Bulk ikutkan FK dosen Step 2 bila ada. Baris tanpa 4 dosen → invalid (wajib susulan via PATCH).
  // Baris lengkap + beda → valid langsung. Tanpa ini dosen acak 1,2,3,7 masuk DB permanen.
  async upsertBulk(gelombangId: number, jenis: string, rows: Array<Record<string, any>>) {
    const c = this.client();
    const normal = rows.map((r, i) => ({
      nim: String(r.nim ?? "").trim(),
      nama: String(r.nama ?? r.name ?? "").trim(),
      judul: String(r.judul ?? r.title ?? `Seminar ${String(r.nama ?? r.name ?? "").trim()}`),
      pembimbing_utama_id: r.pembimbing_utama_id ?? r.pembimbing1_id ?? null,
      pembimbing_pendamping_id: r.pembimbing_pendamping_id ?? r.pembimbing2_id ?? null,
      penguji1_id: r.penguji1_id ?? null,
      penguji2_id: r.penguji2_id ?? null,
      is_online: Boolean(r.is_online ?? r.isDaring ?? false),
      urutan_daftar: Number(r.urutan_daftar ?? i + 1),
      i,
    })).filter((r) => r.nim && r.nama);
    if (!normal.length) throw new Error("Tidak ada baris valid (nim,nama wajib).");
    const nims = [...new Set(normal.map((r) => r.nim))];
    const { data: ada, error: eAda } = await c.from("mahasiswa").select("id,nim").in("nim", nims);
    if (eAda) throw new Error(eAda.message);
    const peta = new Map((ada ?? []).map((m: any) => [String(m.nim), m.id]));
    const baru = nims.filter((n) => !peta.has(n)).map((n) => ({
      nim: n, nama: normal.find((r) => r.nim === n)?.nama ?? n,
    }));
    if (baru.length) {
      const { data: ins, error: eIns } = await c.from("mahasiswa").insert(baru).select("id,nim");
      if (eIns) throw new Error(eIns.message);
      for (const m of (ins ?? [])) peta.set(String((m as any).nim), (m as any).id);
    }
    const baris = normal.map((r) => {
      // Hitung valid di sini (bukan selalu invalid): 4 FK terisi + beda orang → valid.
      // Tanpa ini Generate selalu 409 walau Step 2 sudah lengkap.
      const keempat = [r.pembimbing_utama_id, r.pembimbing_pendamping_id, r.penguji1_id, r.penguji2_id].map(Number);
      const lengkapBeda = keempat.every((v) => Number.isInteger(v) && v > 0) && new Set(keempat).size === 4;
      return {
        gelombang_id: gelombangId,
        mahasiswa_id: peta.get(r.nim),
        jenis,
        judul: r.judul,
        pembimbing_utama_id: r.pembimbing_utama_id,
        pembimbing_pendamping_id: r.pembimbing_pendamping_id,
        penguji1_id: r.penguji1_id,
        penguji2_id: r.penguji2_id,
        is_online: r.is_online,
        urutan_daftar: r.urutan_daftar,
        dijadwalkan: true,
        validasi: lengkapBeda ? "valid" : "invalid",
      };
    });
    const { data: up, error: eUp } = await c.from("seminar")
      .upsert(baris, { onConflict: "gelombang_id,mahasiswa_id" }).select("id");
    if (eUp) throw new Error(eUp.message);
    // Kaitan akun: NIM cocok → mahasiswa_id dipakai ulang → akun lama (profiles.mahasiswa_id)
    // otomatis lihat seminar ini via user_mahasiswa_id(). Laporkan mana butuh akun.
    const semuaMhsId = [...new Set([...peta.values()])] as number[];
    let punya = new Set<number>();
    if (semuaMhsId.length) {
      const { data: prof } = await c.from("profiles").select("mahasiswa_id").in("mahasiswa_id", semuaMhsId);
      punya = new Set((prof ?? []).map((p: any) => p.mahasiswa_id).filter(Boolean));
    }
    const nimDariId = new Map<number, string>();
    for (const [nim, id] of peta) nimDariId.set(id as number, nim);
    const butuhAkun = semuaMhsId.filter((id) => !punya.has(id)).map((id) => nimDariId.get(id)).filter(Boolean);
    return {
      ids: (up ?? []).map((r: any) => r.id),
      cocok: (ada ?? []).length,
      baru: baru.length,
      punyaAkun: punya.size,
      butuhAkun,
    };
  }
}
