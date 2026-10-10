import { ApprovalRepository } from "../repositories/approval.repository";

const KEPUTUSAN = ["konfirmasi", "tolak", "menunggu"] as const;

export class ApprovalService {
  constructor(private readonly repo = new ApprovalRepository()) {}

  async runs(gelombangId?: number) {
    return { success: true, data: await this.repo.listRuns(gelombangId) };
  }

  async slots(runId: number) {
    return { success: true, data: await this.repo.listSlots(runId) };
  }

  async milikSaya(caller: { role: string; dosenId: number | null; mahasiswaId: number | null }) {
    if (caller.role === "dosen" && caller.dosenId) {
      return { success: true, data: await this.repo.approvalsForDosen(caller.dosenId) };
    }
    if (caller.role === "mahasiswa" && caller.mahasiswaId) {
      return { success: true, data: await this.repo.approvalsForMahasiswa(caller.mahasiswaId) };
    }
    return { success: true, data: [] };
  }

  async monitor(runId: number) {
    const rows: any[] = await this.repo.approvalsForRun(runId);
    const total = rows.length;
    const konfirmasi = rows.filter((r) => r.status === "konfirmasi").length;
    const bySlot: Record<number, { slot_id: number; konfirmasi: number; tolak: number; menunggu: number }> = {};
    for (const r of rows) {
      const b = (bySlot[r.slot_id] ??= { slot_id: r.slot_id, konfirmasi: 0, tolak: 0, menunggu: 0 });
      if (r.status === "konfirmasi") b.konfirmasi++;
      else if (r.status === "tolak") b.tolak++;
      else b.menunggu++;
    }
    return { success: true, data: { total, konfirmasi, slots: Object.values(bySlot), rows } };
  }

  async simpan(runId: number) {
    return { success: true, data: await this.repo.simpanRun(runId) };
  }

  async putuskan(event: any, approvalId: number, decision: string, reason?: string) {
    if (!KEPUTUSAN.includes(decision as any)) throw new Error("p_decision harus konfirmasi|tolak|menunggu.");
    if (decision === "tolak" && !reason?.trim()) throw new Error("p_reason wajib bila menolak.");
    return { success: true, data: await this.repo.rpcSubmit(event, approvalId, decision, reason) };
  }

  async finalisasi(event: any, runId: number) {
    return { success: true, data: await this.repo.rpcFinalisasi(event, runId) };
  }

  async batal(event: any, runId: number, alasan: string) {
    if (!alasan?.trim()) throw new Error("p_alasan wajib diisi.");
    return { success: true, data: await this.repo.rpcBatal(event, runId, alasan) };
  }
}
