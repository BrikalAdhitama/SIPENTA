import { AkunRepository } from "../repositories/akun.repository";

// Admin buatkan auth.user + profiles terlink NIM/NIP.
// CSV bulk hanya buat baris mahasiswa — akun dibuat di sini, lalu login NIM jalan.
export class AkunService {
  constructor(private readonly repo = new AkunRepository()) {}

  async buat(body: { tipe: string; idKampus: string; email: string; password: string }) {
    const { tipe, idKampus, email, password } = body;
    if (tipe === "mahasiswa") {
      const mhs: any = await this.repo.cariMahasiswa(idKampus);
      if (!mhs) throw new Error(`NIM ${idKampus} belum ada di DB. Upload CSV dulu.`);
      if (await this.repo.sudahTerhubung("mahasiswa_id", mhs.id)) {
        throw new Error(`NIM ${idKampus} sudah punya akun.`);
      }
      return { success: true, data: await this.repo.buatAkun({ email, password, nama: mhs.nama, role: "mahasiswa", mahasiswa_id: mhs.id }) };
    }
    const dsn: any = await this.repo.cariDosen(idKampus);
    if (!dsn) throw new Error(`NIP ${idKampus} belum ada di DB.`);
    if (await this.repo.sudahTerhubung("dosen_id", dsn.id)) {
      throw new Error(`NIP ${idKampus} sudah punya akun.`);
    }
    return { success: true, data: await this.repo.buatAkun({ email, password, nama: dsn.nama, role: "dosen", dosen_id: dsn.id }) };
  }
}
