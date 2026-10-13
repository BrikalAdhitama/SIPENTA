// Edit pembimbing milik-sendiri inline di kartu Dosen Pembimbing.
// Parsial: boleh ubah P1 saja / P2 saja / judul saja / kombinasi.
// Tersimpan via PATCH /api/seminar/[id] → muncul di Preview admin.
export function usePembimbingSaya() {
  const seminarId = ref<number | null>(null)
  const judulSeminar = ref('')
  const judulEdit = ref('')
  const daftarDosen = ref<Array<{ id: number; nama: string }>>([])
  const pembimbing1Id = ref<number | null>(null)
  const pembimbing2Id = ref<number | null>(null)
  const awal = ref<{ p1: number | null; p2: number | null; judul: string }>({ p1: null, p2: null, judul: '' })
  const sedangEdit = ref(false)
  const memuat = ref(false)
  const menyimpan = ref(false)
  const galat = ref('')
  const berhasil = ref('')

  const namaById = computed(() => Object.fromEntries(daftarDosen.value.map((d) => [d.id, d.nama])))
  const pembimbing1Nama = computed(() => (pembimbing1Id.value ? namaById.value[pembimbing1Id.value] ?? '-' : '-'))
  const pembimbing2Nama = computed(() => (pembimbing2Id.value ? namaById.value[pembimbing2Id.value] ?? '-' : '-'))
  const kembar = computed(() => Boolean(pembimbing1Id.value && pembimbing2Id.value && pembimbing1Id.value === pembimbing2Id.value))
  const p1Berubah = computed(() => pembimbing1Id.value !== awal.value.p1)
  const p2Berubah = computed(() => pembimbing2Id.value !== awal.value.p2)
  const judulBerubah = computed(() => judulEdit.value.trim() !== awal.value.judul.trim())
  const adaPerubahan = computed(() => p1Berubah.value || p2Berubah.value || judulBerubah.value)
  const judulValid = computed(() => judulEdit.value.trim().length > 0)
  const bolehSimpan = computed(() => Boolean(
    seminarId.value && sedangEdit.value && adaPerubahan.value && !kembar.value && judulValid.value && !menyimpan.value,
  ))

  function mulaiEdit() {
    galat.value = ''
    berhasil.value = ''
    sedangEdit.value = true
  }

  function batal() {
    pembimbing1Id.value = awal.value.p1
    pembimbing2Id.value = awal.value.p2
    judulEdit.value = awal.value.judul
    sedangEdit.value = false
    galat.value = ''
  }

  async function muat() {
    memuat.value = true
    galat.value = ''
    try {
      const [semRes, dosRes] = await Promise.all([
        $fetch<{ data: any[] }>('/api/seminar'),
        $fetch<{ data: any[] }>('/api/dosen?limit=200').catch(() => null),
      ])
      // /api/dosen kembalikan id string (dosen-xxx) bila tabel belum ada → buang, ambil numerik saja.
      daftarDosen.value = (dosRes?.data ?? [])
        .map((d: any) => ({ id: Number(d.id), nama: String(d.nama ?? '') }))
        .filter((d) => Number.isInteger(d.id) && d.id > 0 && d.nama)
      const row = (semRes?.data ?? [])[0]
      if (!row) {
        galat.value = 'Belum ada seminar untuk akun ini — hubungi admin.'
        return
      }
      seminarId.value = Number(row.id)
      judulSeminar.value = String(row.judul ?? '')
      judulEdit.value = String(row.judul ?? '')
      if (row.pembimbing_utama_id) {
        const id = Number(row.pembimbing_utama_id)
        pembimbing1Id.value = id
        if (String(row.pembimbing_utama_nama ?? '') && !namaById.value[id]) {
          daftarDosen.value.push({ id, nama: String(row.pembimbing_utama_nama) })
        }
      }
      if (row.pembimbing_pendamping_id) {
        const id = Number(row.pembimbing_pendamping_id)
        pembimbing2Id.value = id
        if (String(row.pembimbing_pendamping_nama ?? '') && !namaById.value[id]) {
          daftarDosen.value.push({ id, nama: String(row.pembimbing_pendamping_nama) })
        }
      }
      awal.value = { p1: pembimbing1Id.value, p2: pembimbing2Id.value, judul: judulEdit.value }
      if (!daftarDosen.value.length) galat.value = 'Daftar dosen kosong — login lalu buka ulang.'
    } catch (e: any) {
      galat.value = e?.data?.statusMessage || 'Gagal muat data. Login dulu lalu buka ulang.'
    } finally {
      memuat.value = false
    }
  }

  async function simpan() {
    galat.value = ''
    berhasil.value = ''
    if (!seminarId.value) {
      galat.value = 'Belum ada seminar untuk akun ini.'
      return
    }
    if (!adaPerubahan.value) return
    if (kembar.value) {
      galat.value = 'Pembimbing 1 dan 2 harus orang berbeda.'
      return
    }
    if (!judulValid.value) {
      galat.value = 'Judul tidak boleh kosong.'
      return
    }
    menyimpan.value = true
    try {
      // Kirim hanya field berubah — dukung P1 saja / P2 saja / judul saja.
      const body: Record<string, unknown> = {}
      if (p1Berubah.value && pembimbing1Id.value) body.pembimbing_utama_id = pembimbing1Id.value
      if (p2Berubah.value && pembimbing2Id.value) body.pembimbing_pendamping_id = pembimbing2Id.value
      if (judulBerubah.value) body.judul = judulEdit.value.trim()
      if (!Object.keys(body).length) {
        galat.value = 'Tidak ada perubahan valid — pilih dosen dulu.'
        return
      }
      const res: any = await $fetch(`/api/seminar/${seminarId.value}`, { method: 'PATCH', body })
      judulSeminar.value = String(res?.data?.judul ?? judulEdit.value.trim() ?? judulSeminar.value)
      judulEdit.value = judulSeminar.value
      awal.value = { p1: pembimbing1Id.value, p2: pembimbing2Id.value, judul: judulEdit.value }
      sedangEdit.value = false
      berhasil.value = 'Tersimpan — tampil di Preview admin.'
    } catch (e: any) {
      galat.value = e?.data?.statusMessage || 'Gagal simpan pembimbing.'
    } finally {
      menyimpan.value = false
    }
  }

  return {
    seminarId, judulSeminar, judulEdit, judulBerubah, p1Berubah, p2Berubah, adaPerubahan,
    daftarDosen, pembimbing1Id, pembimbing2Id,
    pembimbing1Nama, pembimbing2Nama, kembar, bolehSimpan,
    sedangEdit, mulaiEdit, batal,
    memuat, menyimpan, galat, berhasil, muat, simpan,
  }
}
