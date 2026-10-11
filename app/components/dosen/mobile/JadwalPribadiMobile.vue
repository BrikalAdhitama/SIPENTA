<template>
  <div class="min-h-screen bg-white font-sans pb-32">
    <header class="mobile-safe-top px-5 pb-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="text-[24px] font-extrabold tracking-tight leading-none text-[#0f172a]">Jadwal Pribadi</h1>
          <p class="mt-2 text-[12px] font-medium text-slate-400">Semua jadwal mengajar semester ini</p>
        </div>
        <button class="add-button" aria-label="Tambah jadwal" title="Tambah jadwal" @click="openAdd">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.8"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </header>

    <main class="px-4">
      <section class="grid grid-cols-3 gap-2.5" aria-label="Ringkasan jadwal">
        <button v-for="stat in stats" :key="stat.label" type="button" class="summary-card" :class="{ active: activeSummary === stat.key }"
          :aria-label="`Tampilkan ${stat.label.toLowerCase()}`" @click="activeSummary = stat.key">
          <div class="summary-icon" v-html="stat.icon" />
          <strong class="mt-3 block text-[23px] leading-none text-[#0D47A1]">{{ stat.value }}</strong>
          <p class="summary-label">{{ stat.label }}</p>
        </button>
      </section>

      <div class="period-tabs mt-5">
        <button v-for="tab in periods" :key="tab.value" :class="{ active: period === tab.value }" @click="period = tab.value">
          {{ tab.label }}
        </button>
      </div>

      <section v-if="groupedSchedules.length" class="mt-5 space-y-5">
        <div v-for="group in groupedSchedules" :key="group.date">
          <div class="mb-2 flex items-center gap-2">
            <span class="date-dot" />
            <h2 class="text-[14px] font-extrabold text-[#1253a2]">{{ group.label }}</h2>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">{{ group.items.length }} agenda</span>
          </div>

          <article v-for="item in group.items" :key="item.id" class="schedule-card mb-3 last:mb-0" :class="item.type === 'mengajar' ? 'teaching' : 'other'">
            <div class="schedule-time">
              <strong>{{ item.time }}</strong>
              <span>{{ item.duration }} menit</span>
            </div>
            <div class="schedule-main">
              <div class="schedule-heading">
                <h3 class="schedule-title">{{ item.title }}</h3>
                <div class="action-row">
                  <button class="edit-action" aria-label="Edit jadwal" @click="openEdit(item)">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1-1-4L16.5 3.5z"/></svg>
                  </button>
                  <button class="delete-action" aria-label="Hapus jadwal" @click="removeSchedule(item.id)">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>
                  </button>
                </div>
              </div>
              <span class="type-badge" :class="item.type">{{ item.type === 'mengajar' ? 'Mengajar' : 'Kegiatan Lain' }}</span>
              <p class="schedule-description">{{ item.description }}</p>
              <span class="room-location" :title="item.room">
                <svg class="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/></svg>
                <span>{{ item.room }}</span>
              </span>
            </div>
          </article>
        </div>
      </section>

      <div v-else class="empty-state">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f2fd] text-[#2196f3]">
          <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <p class="mt-3 text-sm font-extrabold text-slate-800">Belum ada jadwal</p>
        <p class="mt-1 text-xs text-slate-400">Tambahkan agenda untuk mengatur jadwal pribadi.</p>
      </div>
    </main>

    <Transition name="sheet">
      <div v-if="editing" class="sheet-backdrop fixed inset-0 z-[80] flex items-end p-0" @click.self="editing = null">
        <div class="form-sheet w-full rounded-t-[28px] bg-white px-5 pb-8 pt-3 shadow-2xl">
          <div class="mx-auto mb-5 h-1.5 w-10 rounded-full bg-slate-200" />
          <div class="form-heading">
            <div class="form-title-icon">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path stroke-linecap="round" d="M8 3v4M16 3v4M4 10h16"/></svg>
            </div>
            <div class="min-w-0 flex-1">
              <h2>{{ editing.id ? 'Edit Kegiatan' : 'Tambah Kegiatan' }}</h2>
              <p>Lengkapi informasi data kegiatan</p>
            </div>
            <button class="close-button" aria-label="Tutup" @click="editing = null">×</button>
          </div>
          <div class="form-fields">
            <label class="form-field full"><span>Nama Kegiatan <b>*</b></span><input v-model="editing.title" class="form-input" placeholder="Masukkan nama kegiatan" /></label>
            <label class="form-field"><span>Waktu <b>*</b></span><input v-model="editing.time" class="form-input" inputmode="decimal" placeholder="08.00 - 10.00" @input="syncDurationFromTime" /></label>
            <label class="form-field"><span>Lokasi <b>*</b></span><input v-model="editing.room" class="form-input" placeholder="Nama ruangan" /></label>
            <label class="form-field"><span>Rentang Waktu (menit) <b>*</b></span><input v-model.number="editing.duration" type="number" min="1" step="1" inputmode="numeric" class="form-input" placeholder="60" /></label>
            <label class="form-field"><span>Tanggal <b>*</b></span><input v-model="editing.date" type="date" class="form-input date-input" /></label>
            <label class="form-field full"><span>Deskripsi <b>*</b></span><textarea v-model="editing.description" class="form-input form-textarea" placeholder="Tambahkan deskripsi kegiatan" /></label>
          </div>
          <div class="form-actions"><button class="cancel-button" @click="editing = null">Batal</button><button class="save-button" @click="saveSchedule">Simpan</button></div>
        </div>
      </div>
    </Transition>

    <Transition name="dialog">
      <div v-if="deleting" class="sheet-backdrop fixed inset-0 z-[100] flex items-center justify-center px-5" @click.self="deleting = null">
        <div class="delete-dialog">
          <div class="delete-icon"><svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-3V7M9 7V4h6v3"/></svg></div>
          <h2>Hapus Kegiatan?</h2>
          <p>Kegiatan <strong>{{ deleting.title }}</strong> akan dihapus.</p>
          <div class="form-actions"><button class="cancel-button" @click="deleting = null">Batal</button><button class="delete-confirm-button" @click="confirmDelete">Hapus</button></div>
        </div>
      </div>
    </Transition>

    <DosenBottomNav />
  </div>
</template>

<script setup lang="ts">
type ScheduleType = 'mengajar' | 'other'
interface Schedule {
  id: number
  date: string
  time: string
  duration: number
  title: string
  description: string
  room: string
  type: ScheduleType
}

const periods = [
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Semua', value: 'all' },
]
const period = ref('week')
const activeSummary = ref<'all' | 'mengajar' | 'other'>('all')
const editing = ref<Schedule | null>(null)
const deleting = ref<Schedule | null>(null)
const schedules = ref<Schedule[]>([
  { id: 1, date: '2026-09-07', time: '08.00', duration: 100, title: 'Pemrograman Web', description: 'Kelas A · 2 SKS', room: 'Ruang E204', type: 'mengajar' },
  { id: 2, date: '2026-09-07', time: '13.00', duration: 90, title: 'Rapat Koordinasi Program Studi', description: 'Evaluasi kurikulum semester ganjil', room: 'Ruang Rapat Dekanat', type: 'other' },
  { id: 3, date: '2026-09-08', time: '10.00', duration: 140, title: 'Basis Data Lanjut', description: 'Kelas B · 3 SKS', room: 'Lab Smartcity', type: 'mengajar' },
  { id: 4, date: '2026-09-09', time: '09.00', duration: 180, title: 'Workshop Kurikulum Merdeka', description: 'Diselenggarakan oleh Fakultas', room: 'Audit Gedung A', type: 'other' },
])

const stats = computed(() => [
  { key: 'all' as const, label: 'Total Agenda', value: schedules.value.length, icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2"><rect x="4" y="5" width="16" height="15" rx="2"/><path stroke-linecap="round" d="M8 3v4M16 3v4M4 10h16"/></svg>' },
  { key: 'mengajar' as const, label: 'Jadwal Mengajar', value: schedules.value.filter(item => item.type === 'mengajar').length, icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19V9m5 10V5m5 14v-7m5 7V3M3 21h18"/></svg>' },
  { key: 'other' as const, label: 'Kegiatan Lain', value: schedules.value.filter(item => item.type === 'other').length, icon: '<svg fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5h14v14H5zM8 9h8M8 13h5"/></svg>' },
])

const visibleSchedules = computed(() => {
  const source = activeSummary.value === 'all'
    ? schedules.value
    : schedules.value.filter(item => item.type === activeSummary.value)
  if (period.value === 'all') return source
  const start = new Date('2026-09-07T00:00:00')
  const end = period.value === 'week'
    ? new Date('2026-09-13T23:59:59')
    : new Date('2026-09-30T23:59:59')
  return source.filter(item => {
    const date = new Date(`${item.date}T00:00:00`)
    return date >= start && date <= end
  })
})

const groupedSchedules = computed(() => {
  const groups = new Map<string, Schedule[]>()
  visibleSchedules.value.forEach(item => {
    if (!groups.has(item.date)) groups.set(item.date, [])
    groups.get(item.date)!.push(item)
  })
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) => ({
    date, items, label: new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T00:00:00`)),
  }))
})

const openAdd = () => { editing.value = { id: 0, date: '2026-09-10', time: '', duration: 60, title: '', description: '', room: '', type: 'mengajar' } }
const openEdit = (item: Schedule) => { editing.value = { ...item } }
const syncDurationFromTime = () => {
  if (!editing.value) return
  const matches = editing.value.time.match(/(\d{1,2})[.:](\d{2})\s*[-–]\s*(\d{1,2})[.:](\d{2})/)
  if (!matches) return
  const start = Number(matches[1]) * 60 + Number(matches[2])
  const end = Number(matches[3]) * 60 + Number(matches[4])
  const duration = end - start
  if (duration > 0) editing.value.duration = duration
}
const saveSchedule = () => {
  if (!editing.value?.title.trim() || !editing.value.room.trim() || !editing.value.description.trim() || !editing.value.date || !editing.value.time.trim() || !editing.value.duration || editing.value.duration < 1) {
    window.$toast?.({ title: 'Gagal Menyimpan', message: 'Lengkapi semua informasi kegiatan terlebih dahulu.', type: 'error' })
    return
  }
  if (editing.value.id) schedules.value = schedules.value.map(item => item.id === editing.value!.id ? { ...editing.value! } : item)
  else schedules.value.push({ ...editing.value, id: Date.now() })
  window.$toast?.({ title: editing.value.id ? 'Berhasil Disimpan' : 'Berhasil Ditambahkan', message: editing.value.id ? 'Perubahan kegiatan berhasil disimpan.' : 'Kegiatan baru berhasil ditambahkan.', type: 'success' })
  editing.value = null
}
const removeSchedule = (id: number) => {
  deleting.value = schedules.value.find(item => item.id === id) || null
}
const confirmDelete = () => {
  if (!deleting.value) return
  schedules.value = schedules.value.filter(item => item.id !== deleting.value!.id)
  window.$toast?.({ title: 'Berhasil Dihapus', message: 'Kegiatan berhasil dihapus dari jadwal pribadi.', type: 'success' })
  deleting.value = null
}

watch([editing, deleting], ([editingValue, deletingValue]) => {
  if (typeof document !== 'undefined') document.body.style.overflow = editingValue || deletingValue ? 'hidden' : ''
})
onUnmounted(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<style scoped>
.add-button,.save-button { display:flex; align-items:center; justify-content:center; gap:7px; background:#1558ad; color:white; font-weight:800; transition:transform .2s ease,box-shadow .2s ease; }
.form-sheet { max-height:92vh !important; }
.form-heading { display:flex; align-items:center; gap:12px; }.form-title-icon { display:flex; width:52px; height:52px; flex-shrink:0; align-items:center; justify-content:center; border-radius:16px; background:#e3f2fd; color:#0d47a1; }.form-heading h2 { color:#17233b; font-size:22px; font-weight:800; line-height:1.1; }.form-heading p { margin-top:5px; color:#71829c; font-size:13px; font-weight:500; }.form-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; margin-top:24px; }.form-field { display:flex; min-width:0; flex-direction:column; gap:7px; }.form-field.full { grid-column:1 / -1; }.form-field > span { color:#71829c; font-size:14px; font-weight:600; }.form-field b { color:#d33b47; font-weight:700; }.form-input { min-height:52px; padding:13px 14px; border:1px solid #dce6f1; border-radius:14px; background:#fff; color:#27364d; font-size:14px; font-weight:400; outline:none; }.form-input:focus { border-color:#2196f3; box-shadow:0 0 0 3px #e3f2fd; }.date-input { color-scheme:light; }.form-textarea { min-height:118px; resize:vertical; }.form-actions { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:24px 14px 0; }.form-actions button { min-height:54px; border-radius:16px; font-size:16px; font-weight:700; transition:transform .2s ease,box-shadow .2s ease; }.cancel-button { background:#eef3f8; color:#71829c; }.save-button { min-height:54px; border-radius:16px; background:#2196f3; box-shadow:0 8px 18px rgba(33,150,243,.22); }.form-actions button:active { transform:scale(.97); }.delete-dialog { width:min(100%,360px); padding:28px 22px 22px; border-radius:28px; background:#fff; text-align:center; box-shadow:0 20px 48px rgba(15,23,42,.2); }.delete-icon { display:flex; width:92px; height:92px; margin:0 auto 22px; align-items:center; justify-content:center; border-radius:999px; background:#fde5eb; color:#d62931; }.delete-dialog h2 { color:#17233b; font-size:23px; font-weight:800; }.delete-dialog p { margin:10px auto 0; color:#71829c; font-size:14px; line-height:1.5; }.delete-dialog p strong { color:#5c6d85; }.delete-confirm-button { background:#d62931; color:white; box-shadow:0 8px 18px rgba(214,41,49,.2); }.dialog-enter-active,.dialog-leave-active { transition:opacity .2s ease; }.dialog-enter-from,.dialog-leave-to { opacity:0; }
.sheet-backdrop { background:rgba(15,23,42,.4); backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); }
.sheet-backdrop > div { max-height:88vh; overflow-y:auto; overscroll-behavior:contain; }
.add-button { width:44px; height:44px; border-radius:15px; box-shadow:0 7px 16px rgba(21,88,173,.2); }
.add-button:active,.save-button:active,.period-tabs button:active { transform:scale(.96); }
.add-button:hover { box-shadow:0 10px 22px rgba(21,88,173,.3); }
.summary-card { min-width:0; min-height:150px; padding:15px 8px 14px; text-align:center; border:1px solid #90CAF9; border-radius:22px; background:#E3F2FD; box-shadow:0 8px 22px rgba(13,71,161,.1),0 1px 3px rgba(13,71,161,.05); transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease; }
.summary-card.active { border-color:#2196F3; background:#d8edfc; box-shadow:0 10px 24px rgba(33,150,243,.18),0 1px 3px rgba(13,71,161,.06); }
.summary-card:active { transform:translateY(-2px) scale(.98); box-shadow:0 10px 24px rgba(15,71,161,.1); }
.summary-icon { display:flex; width:40px; height:40px; margin:auto; align-items:center; justify-content:center; border-radius:999px; background:#2196F3; box-shadow:0 4px 10px rgba(33,150,243,.24); }
.summary-icon :deep(svg) { width:23px; height:23px; }
.summary-label { min-height:30px; margin-top:10px; color:#1565C0; font-size:10px; font-weight:800; line-height:1.25; }
.period-tabs { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; padding:7px; border-radius:999px; background:#f1f6fc; }
.period-tabs button { min-height:43px; border-radius:999px; color:#8b95a7; font-size:13px; font-weight:800; transition:all .25s ease; }
.period-tabs button.active { background:#2196f3; color:white; box-shadow:0 7px 15px rgba(33,150,243,.22); }
.date-dot { display:inline-block; width:9px; height:9px; border-radius:999px; background:#1558ad; }
.schedule-card { position:relative; display:grid; grid-template-columns:66px minmax(0,1fr); gap:14px; overflow:hidden; padding:16px 13px 15px 16px; border:1px solid #e4edf6; border-radius:20px; background:#ffffff; box-shadow:0 8px 22px rgba(15,71,161,.08),0 1px 3px rgba(15,23,42,.04); transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease; }
.schedule-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:5px; background:#1558ad; }.schedule-card.teaching::before { background:#8bc9f7; }
.schedule-card:active { transform:scale(.985); }.schedule-time { padding-top:4px; }.schedule-time strong { display:block; color:#1253a2; font-size:19px; font-weight:900; letter-spacing:-.02em; }.schedule-time > span { display:block; margin-top:6px; color:#9aa9bb; font-size:10px; font-weight:600; line-height:1.25; }
.schedule-main { min-width:0; display:flex; flex-direction:column; }.schedule-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; min-width:0; }.schedule-title { min-width:0; margin:0; color:#1e293b; font-size:15px; font-weight:800; line-height:1.35; }.schedule-description { margin:9px 0 0; color:#94a3b8; font-size:12px; font-weight:500; line-height:1.45; }
.type-badge { display:inline-flex; width:max-content; max-width:100%; align-items:center; align-self:flex-start; margin-top:9px; border-radius:999px; padding:4px 8px; font-size:9px; font-weight:800; line-height:1.2; white-space:nowrap; }.type-badge.mengajar { background:#e3f2fd; color:#0d47a1; }.type-badge.other { background:#0d47a1; color:#ffffff; }
.schedule-footer { grid-column:1 / -1; display:flex; align-items:center; justify-content:space-between; gap:8px; min-width:0; }.room-location { display:flex; min-width:0; max-width:100%; align-items:center; gap:5px; margin-top:8px; color:#6f8ba8; font-size:11px; font-weight:700; line-height:1.25; }.room-location > span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }.location-icon { width:14px; height:14px; flex-shrink:0; color:#2196f3; }.schedule-actions { display:flex; flex-shrink:0; align-items:center; gap:7px; }.action-row { display:flex; flex-shrink:0; gap:6px; }.action-row button,.close-button { display:flex; align-items:center; justify-content:center; }.action-row button { width:34px; height:34px; border-radius:10px; transition:transform .2s ease,box-shadow .2s ease; }.action-row button:active { transform:scale(.88); }.edit-action { background:#e1f1fd; color:#1253a2; }.delete-action { background:#fde6ec; color:#dc3545; }
.empty-state { padding:56px 20px; text-align:center; }.close-button { width:32px; height:32px; border-radius:999px; background:#f1f5f9; color:#64748b; font-size:24px; line-height:1; }.form-input { width:100%; border:1px solid #e2e8f0; border-radius:13px; padding:12px 14px; color:#0f172a; font-size:13px; outline:none; }.form-input:focus { border-color:#2196f3; box-shadow:0 0 0 3px #e3f2fd; }.save-button { width:100%; margin-top:4px; min-height:48px; border-radius:14px; }.sheet-enter-active,.sheet-leave-active { transition:opacity .25s ease; }.sheet-enter-from,.sheet-leave-to { opacity:0; }.sheet-enter-active > div,.sheet-leave-active > div { transition:transform .3s ease; }.sheet-enter-from > div,.sheet-leave-to > div { transform:translateY(100%); }
@media (hover:hover) and (pointer:fine) { .summary-card:hover,.schedule-card:hover { transform:translateY(-3px); border-color:#b9dcf5; box-shadow:0 14px 28px rgba(15,71,161,.14),0 2px 5px rgba(15,23,42,.04); }.action-row button:hover { box-shadow:0 4px 10px rgba(15,71,161,.12); } }
@media (max-width:350px) { .summary-card { min-height:142px; padding-inline:4px; }.summary-label { font-size:9px; }.schedule-card { grid-template-columns:58px minmax(0,1fr); gap:12px 9px; padding-right:9px; }.schedule-time strong { font-size:17px; }.schedule-title { font-size:14px; }.type-badge { padding-inline:7px; font-size:8px; }.schedule-description { font-size:11px; }.action-row button { width:32px; height:32px; }.form-sheet { padding-inline:16px; }.form-heading h2 { font-size:21px; }.form-fields { grid-template-columns:1fr; gap:14px; }.form-field.full { grid-column:auto; }.form-actions { gap:10px; margin-inline:0; }.form-actions button { font-size:14px; } }
</style>
