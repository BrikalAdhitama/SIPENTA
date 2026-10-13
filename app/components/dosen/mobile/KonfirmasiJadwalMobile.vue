<template>
  <div class="min-h-screen bg-white pb-32 font-sans">
    <header class="mobile-safe-top px-5 pb-6">
      <h1 class="page-title">Konfirmasi Jadwal</h1>
      <p class="page-subtitle">Setujui atau tolak permintaan jadwal seminar mahasiswa</p>
    </header>

    <main class="px-4">
      <section class="summary-grid" aria-label="Ringkasan konfirmasi">
        <div v-for="stat in summary" :key="stat.label" class="summary-card" :class="stat.tone">
          <div class="summary-icon" :class="stat.tone" v-html="stat.icon" />
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </section>

      <div class="list-heading">
        <h2>Permintaan Jadwal</h2>
      </div>
      <div class="status-tabs" role="tablist" aria-label="Filter status jadwal">
        <button v-for="tab in tabs" :key="tab.value" type="button" role="tab" :aria-selected="filter === tab.value" :class="{ active: filter === tab.value }" @click="filter = tab.value">
          {{ tab.label }}
        </button>
      </div>

      <section v-if="filteredSchedules.length" class="schedule-list">
        <article v-for="item in filteredSchedules" :key="item.id" class="confirmation-card">
          <div class="card-top">
            <div class="student-avatar">{{ item.initials }}</div>
            <div class="student-main">
              <div class="student-heading">
                <h2>{{ item.student }}</h2>
                <span class="seminar-badge" :class="item.kind">{{ item.kind === 'hasil' ? 'Seminar Hasil' : 'Seminar Proposal' }}</span>
              </div>
              <div class="meta-row">
                <span><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>{{ item.date }}, {{ item.time }}</span>
                <span><svg viewBox="0 0 24 24"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/></svg>{{ item.room }}</span>
              </div>
              <span class="role-row"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3"/><path d="M5 21a7 7 0 0114 0"/></svg>{{ item.role }}</span>
            </div>
          </div>
          <div class="card-actions" :class="{ resolved: item.status !== 'pending' }">
            <template v-if="item.status === 'pending'">
              <span class="status-badge pending">{{ statusLabel(item.status) }}</span>
              <button class="reject-button" @click="openReject(item)">Tolak</button>
              <button class="confirm-button" @click="confirmSchedule(item)">Konfirmasi</button>
            </template>
            <span v-else class="status-badge" :class="item.status">{{ statusLabel(item.status) }}</span>
          </div>
        </article>
      </section>
      <div v-else class="empty-state">
        <div class="empty-icon"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"/><path d="M8 10h8M8 14h5"/></svg></div>
        <h2>Tidak ada jadwal {{ filter === 'all' ? '' : statusLabel(filter).toLowerCase() }}</h2>
        <p v-if="filter !== 'all'">Coba tampilkan semua jadwal untuk melihat permintaan lainnya.</p>
        <p v-else>Belum ada permintaan jadwal yang tersedia.</p>
        <button v-if="filter !== 'all' && schedules.length" type="button" class="empty-reset" @click="filter = 'all'">Tampilkan semua jadwal</button>
      </div>
    </main>

    <Transition name="dialog">
      <div v-if="rejecting" class="backdrop fixed inset-0 z-[100] flex items-center justify-center px-5" @click.self="rejecting = null">
        <div class="reject-dialog">
          <div class="dialog-heading"><div><h2>Tolak Konfirmasi Jadwal</h2><p>Berikan alasan menolak jadwal</p></div><button class="dialog-close" @click="rejecting = null">×</button></div>
          <label class="reason-field"><span>Alasan <b>*</b></span><textarea v-model="rejectReason" placeholder="Masukkan alasan penolakan" /></label>
          <div class="dialog-actions"><button class="cancel-button" @click="rejecting = null">Batal</button><button class="reject-confirm" @click="rejectSchedule">Tolak</button></div>
        </div>
      </div>
    </Transition>
    <DosenBottomNav />
  </div>
</template>

<script setup lang="ts">
type Status = 'pending' | 'confirmed' | 'rejected'
interface Confirmation { id: number; student: string; initials: string; kind: 'proposal' | 'hasil'; date: string; time: string; room: string; role: string; status: Status }
const filter = ref<'all' | Status>('all')
const rejecting = ref<Confirmation | null>(null)
const rejectReason = ref('')
const schedules = ref<Confirmation[]>([
  { id: 1, student: 'Nadia Ramadhani', initials: 'NR', kind: 'hasil', date: '5 Sep 2026', time: '13.00', room: 'Ruang B203', role: 'Peran: Penguji 1', status: 'pending' },
  { id: 2, student: 'Rian Saputra', initials: 'RS', kind: 'proposal', date: '9 Sep 2026', time: '14.00', room: 'Ruang B201', role: 'Peran: Pembimbing 1', status: 'pending' },
  { id: 3, student: 'Dinda Amelia', initials: 'DA', kind: 'hasil', date: '11 Sep 2026', time: '10.00', room: 'Ruang B204', role: 'Peran: Penguji 2', status: 'pending' },
  { id: 4, student: 'Ahmad Fauzan', initials: 'AF', kind: 'proposal', date: '4 Sep 2026', time: '09.00', room: 'Ruang B201', role: 'Peran: Pembimbing 1', status: 'confirmed' },
])
const filteredSchedules = computed(() => filter.value === 'all' ? schedules.value : schedules.value.filter(item => item.status === filter.value))
const tabs = [{ label: 'Semua', value: 'all' }, { label: 'Menunggu', value: 'pending' }, { label: 'Terkonfirmasi', value: 'confirmed' }, { label: 'Ditolak', value: 'rejected' }] as const
const summary = computed(() => [
  { label: 'Menunggu', value: schedules.value.filter(i => i.status === 'pending').length, tone: 'waiting', icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="8"/><path stroke-linecap="round" d="M12 8v4l3 2"/></svg>' },
  { label: 'Terkonfirmasi', value: schedules.value.filter(i => i.status === 'confirmed').length, tone: 'confirmed', icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6"/></svg>' },
  { label: 'Ditolak', value: schedules.value.filter(i => i.status === 'rejected').length, tone: 'rejected', icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" d="m7 7 10 10M17 7 7 17"/></svg>' },
])
const statusLabel = (status: Status) => status === 'pending' ? 'Menunggu' : status === 'confirmed' ? 'Terkonfirmasi' : 'Ditolak'
const confirmSchedule = (item: Confirmation) => {
  item.status = 'confirmed'
  window.$toast?.({ title: 'Jadwal Dikonfirmasi', message: `Jadwal ${item.student} berhasil dikonfirmasi.`, type: 'success' })
}
const openReject = (item: Confirmation) => { rejecting.value = item; rejectReason.value = '' }
const rejectSchedule = () => {
  if (!rejectReason.value.trim()) {
    window.$toast?.({ title: 'Alasan Diperlukan', message: 'Masukkan alasan sebelum menolak jadwal.', type: 'error' })
    return
  }
  if (rejecting.value) {
    rejecting.value.status = 'rejected'
    window.$toast?.({ title: 'Jadwal Ditolak', message: `Jadwal ${rejecting.value.student} berhasil ditolak.`, type: 'success' })
  }
  rejecting.value = null
}
watch(rejecting, value => { if (typeof document !== 'undefined') document.body.style.overflow = value ? 'hidden' : '' })
onUnmounted(() => { if (typeof document !== 'undefined') document.body.style.overflow = '' })
</script>

<style scoped>
.page-title{color:#0f172a;font-size:26px;font-weight:800;letter-spacing:-.04em}.page-subtitle{margin-top:8px;color:#7b8aa1;font-size:13px;line-height:1.45}.summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.summary-card{display:block;width:100%;min-width:0;min-height:154px;padding:15px 8px 14px;text-align:center;border:1px solid transparent;border-radius:22px;background:#f8fafc;box-shadow:0 7px 18px rgba(15,23,42,.07),0 1px 3px rgba(15,23,42,.04);transition:transform .2s ease,box-shadow .2s ease}.summary-card.waiting{border-color:#f6d27c;background:#fff7df}.summary-card.confirmed{border-color:#9bd7b2;background:#e8f7ed}.summary-card.rejected{border-color:#f1a6ad;background:#fff0f1}.summary-card:active{transform:translateY(-2px) scale(.985)}.summary-icon{display:flex;width:40px;height:40px;margin:auto;align-items:center;justify-content:center;border-radius:999px;background:#e4a817;box-shadow:0 4px 10px rgba(228,168,23,.22)}.summary-icon :deep(svg){width:23px;height:23px}.summary-card.confirmed .summary-icon{background:#36a269;box-shadow:0 4px 10px rgba(54,162,105,.22)}.summary-icon.rejected{background:#d62931;box-shadow:0 4px 10px rgba(214,41,49,.22)}.summary-card strong{display:block;margin-top:15px;color:#334155;font-size:24px;line-height:1;font-weight:800}.summary-card.waiting strong{color:#9a6a00}.summary-card.confirmed strong{color:#267a39}.summary-card.rejected strong{color:#c32837}.summary-card span:last-child{display:block;min-height:28px;margin-top:14px;color:#9a6a00;font-size:11px;font-weight:650;line-height:1.25}.summary-card.confirmed span:last-child{color:#267a39}.summary-card.rejected span:last-child{color:#c32837}.list-heading{margin:22px 0 11px}.list-heading h2{color:#17233b;font-size:15px;font-weight:800}.status-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;margin-bottom:16px;padding:4px;border:1px solid #edf2f7;border-radius:999px;background:#f4f7fb}.status-tabs button{min-height:38px;border-radius:999px;color:#8b95a7;font-size:10px;font-weight:600;transition:background .2s ease,color .2s ease,box-shadow .2s ease,transform .2s ease}.status-tabs button.active{background:#2196f3;color:#fff;box-shadow:0 5px 12px rgba(33,150,243,.18)}.status-tabs button:active{transform:scale(.97)}.empty-reset{margin-top:16px;min-height:38px;padding:0 15px;border:1px solid #90caf9;border-radius:12px;background:#e3f2fd;color:#1565c0;font-size:11px;font-weight:700;transition:transform .2s ease,background .2s ease}.empty-reset:active{transform:scale(.96)}.schedule-list{display:flex;flex-direction:column;gap:14px}.confirmation-card{padding:16px;border:1px solid #e4edf6;border-radius:21px;background:#fff;box-shadow:0 8px 22px rgba(15,71,161,.08);transition:transform .2s ease,box-shadow .2s ease}.confirmation-card:active{transform:scale(.985)}.card-top{display:flex;gap:12px}.student-avatar{display:flex;width:48px;height:48px;flex-shrink:0;align-items:center;justify-content:center;border-radius:999px;background:#0d47a1;color:#fff;font-size:14px;font-weight:800}.student-main{min-width:0;flex:1}.student-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.student-heading h2{min-width:0;color:#1e293b;font-size:15px;font-weight:750;line-height:1.3}.seminar-badge,.status-badge{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;padding:0 10px;font-size:9px;font-weight:700;line-height:1;white-space:nowrap}.seminar-badge{background:#e3f2fd;color:#0d47a1}.seminar-badge.hasil{background:#e8defc;color:#5b21b6}.seminar-badge.proposal{background:#dbeafe;color:#1d4ed8}.meta-row{display:flex;flex-wrap:wrap;gap:7px 12px;margin-top:10px;color:#71829c;font-size:11px;font-weight:500}.meta-row span,.role-row{display:flex;align-items:center;gap:5px}.meta-row svg,.role-row svg{width:14px;height:14px;fill:none;stroke:#2196f3;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.role-row{margin-top:8px;color:#71829c;font-size:11px}.card-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:center;gap:8px;margin-top:20px}.card-actions.resolved{display:flex;justify-content:flex-end}.card-actions > .status-badge,.card-actions > button{width:100%;min-width:0}.card-actions .status-badge,.card-actions > button{min-height:37px;font-family:inherit;font-size:11px;font-weight:700;line-height:1}.card-actions.resolved > .status-badge{width:auto;min-width:120px}.status-badge.pending{background:#fff0c2;color:#9a6a00}.status-badge.confirmed{background:#dff3e6;color:#267a39}.status-badge.rejected{background:#ffe3e5;color:#c32837}.reject-button,.confirm-button{padding:0 8px;border-radius:11px;transition:transform .2s ease,box-shadow .2s ease}.reject-button{background:#fde5eb;color:#c32837}.confirm-button{background:#2196f3;color:#fff;box-shadow:0 5px 12px rgba(33,150,243,.2)}.reject-button:active,.confirm-button:active{transform:scale(.96)}.resolved-label{color:#71829c;font-size:10px;font-weight:600}.empty-state{padding:60px 20px;text-align:center}.empty-icon{display:flex;width:58px;height:58px;margin:auto;align-items:center;justify-content:center;border-radius:18px;background:#e3f2fd;color:#2196f3}.empty-icon svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.empty-state h2{margin-top:14px;color:#1e293b;font-size:15px;font-weight:800}.empty-state p{margin-top:5px;color:#94a3b8;font-size:12px}.empty-reset{margin-top:16px;min-height:38px;padding:0 15px;border:1px solid #90caf9;border-radius:12px;background:#e3f2fd;color:#1565c0;font-size:11px;font-weight:700;transition:transform .2s ease,background .2s ease}.empty-reset:hover{background:#d8edfc}.backdrop{background:rgba(15,23,42,.4);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}.reject-dialog{width:min(100%,420px);padding:24px 20px 20px;border-radius:25px;background:#fff;box-shadow:0 20px 48px rgba(15,23,42,.2)}.dialog-heading{display:flex;justify-content:space-between;gap:12px}.dialog-heading h2{color:#17233b;font-size:20px;font-weight:800}.dialog-heading p{margin-top:6px;color:#71829c;font-size:13px}.dialog-close{width:32px;height:32px;border-radius:10px;background:#f1f5f9;color:#71829c;font-size:23px}.reason-field{display:flex;flex-direction:column;gap:7px;margin-top:22px}.reason-field span{color:#71829c;font-size:14px;font-weight:600}.reason-field b{color:#d62931}.reason-field textarea{min-height:130px;padding:13px 14px;border:1px solid #dce6f1;border-radius:14px;resize:vertical;color:#27364d;font-size:14px;outline:none}.reason-field textarea:focus{border-color:#2196f3;box-shadow:0 0 0 3px #e3f2fd}.dialog-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}.dialog-actions button{min-height:48px;border-radius:14px;font-size:14px;font-weight:750}.cancel-button{background:#eef3f8;color:#71829c}.reject-confirm{background:#fde5eb;color:#c32837}.dialog-enter-active,.dialog-leave-active{transition:opacity .2s ease}.dialog-enter-from,.dialog-leave-to{opacity:0}@media (hover:hover) and (pointer:fine){.summary-card:hover,.confirmation-card:hover{transform:translateY(-3px);box-shadow:0 14px 28px rgba(15,71,161,.13)}}@media (max-width:350px){.summary-card{min-height:146px;padding:13px 4px}.summary-card strong{margin-top:13px;font-size:22px}.summary-card span:last-child{margin-top:12px;font-size:10px}.list-heading h2{font-size:14px}.list-heading button{font-size:9px;padding-inline:8px}.student-heading{display:block}.seminar-badge{margin-top:6px}.card-actions{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.card-actions.resolved{display:flex}.card-actions .status-badge{margin-right:0}.card-actions > button{padding-inline:4px;font-size:10px}}
</style>
