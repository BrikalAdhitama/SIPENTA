<template>
  <!-- Dashboard Mobile Mahasiswa — SIPENTA -->
  <div class="mhs-dashboard min-h-screen bg-white font-sans pb-28 mobile-safe-top">
    <main class="px-5 pb-6 max-w-lg mx-auto">

      <!-- TOP HEADER -->
      <header class="flex justify-between items-center mb-6 pt-1">
        <div class="flex items-center gap-3.5">
          <div
            class="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[18px] font-extrabold text-white shadow-md select-none flex-shrink-0"
            style="background: linear-gradient(135deg, #0D47A1 0%, #1976D2 100%);"
          >
            {{ profil.inisial }}
          </div>
          <div>
            <p class="text-slate-400 text-[12px] font-semibold tracking-wide">Hello!</p>
            <h1 class="text-[20px] font-extrabold text-slate-800 leading-tight tracking-tight">{{ profil.nama }}</h1>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">Lihat jadwal seminar dan sidang Anda</p>
          </div>
        </div>
        <NuxtLink
          to="/mahasiswa/notifications"
          class="relative w-11 h-11 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 active:scale-90 transition-all duration-200 flex-shrink-0"
          aria-label="Notifikasi"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        </NuxtLink>
      </header>

      <!-- BANNER SEMINAR TERDEKAT -->
      <section v-if="terdekat" class="mb-6">
        <div
          class="relative overflow-hidden rounded-[22px] px-5 py-5 shadow-[0_12px_32px_-8px_rgba(21,101,192,0.40)]"
          style="background: linear-gradient(145deg, #0D47A1 0%, #1565C0 40%, #1E88E5 100%);"
        >
          <span class="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/8" aria-hidden="true" />
          <span class="pointer-events-none absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-white/6" aria-hidden="true" />
          <div class="relative flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide mb-2.5" style="background: rgba(255,255,255,0.2);">
                {{ JENIS_LABEL[terdekat.jenis] }}
              </span>
              <p class="text-white font-extrabold text-[17px] leading-snug mb-2">
                {{ terdekat.status === 'terkonfirmasi' ? 'Jadwal Anda sudah dikonfirmasi' : 'Menunggu konfirmasi dosen' }}
              </p>
              <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-white/80 font-medium">
                <span>{{ formatTanggalPanjang(terdekat.tanggal) }}, {{ jamTitik(terdekat.jamMulai) }}</span>
                <span>Ruang {{ terdekat.ruangan }}</span>
                <span v-if="terdekat.status === 'terkonfirmasi'">Penguji siap ditinjau</span>
              </div>
            </div>
            <div
              class="flex-shrink-0 flex flex-col items-center justify-center w-[68px] h-[68px] rounded-[16px] text-white border border-white/20"
              style="background: rgba(255,255,255,0.15); backdrop-filter: blur(4px);"
            >
              <template v-if="sisaHari > 0">
                <span class="text-[28px] font-extrabold leading-none">{{ sisaHari }}</span>
                <span class="text-[9px] text-white/80 leading-none mt-1">hari lagi</span>
              </template>
              <span v-else class="text-[12px] font-extrabold text-center leading-tight px-1">Hari ini!</span>
            </div>
          </div>
        </div>
      </section>
      <section v-else class="mb-6">
        <div class="rounded-[22px] bg-white border border-slate-100 shadow-sm px-5 py-7 text-center">
          <p class="text-slate-500 text-sm font-medium">Belum ada jadwal seminar mendatang.</p>
        </div>
      </section>

      <!-- RINGKASAN PROGRESS & PEMBIMBING -->
      <section class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-[17px] font-extrabold text-slate-800 tracking-tight">Ringkasan</h2>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9]">
              TA-2026
            </span>
          </div>
        </div>

        <!-- 2 Kolom Milestone: Seminar Proposal & Seminar Hasil -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <!-- Card 1: Seminar Proposal -->
          <div
            class="group relative overflow-hidden bg-white rounded-[22px] border border-slate-100 p-4 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-[#90CAF9] hover:shadow-[0_8px_24px_-4px_rgba(33,150,243,0.12)] flex flex-col justify-between"
          >
            <!-- Background accent soft glow -->
            <div class="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#90CAF9]/20 blur-xl group-hover:bg-[#90CAF9]/35 transition-colors" />

            <div>
              <!-- Top Row: Icon & Status Pill -->
              <div class="flex items-start gap-3 mb-3">
                <div
                  class="status-mark group/status w-[84px] h-[76px] rounded-[17px] flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover/status:scale-[1.04] shrink-0 border"
                  :class="sempro?.status === 'selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-[0_7px_16px_rgba(16,185,129,0.16)]' : 'bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9]'"
                >
                  <span class="w-9 h-9 rounded-[12px] flex items-center justify-center text-white shadow-sm"
                    :class="sempro?.status === 'selesai' ? 'bg-emerald-500' : 'bg-[#2196F3]'">
                    <svg v-if="sempro?.status === 'selesai'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                    <svg v-else class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.25" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </span>
                  <span class="text-[9px] font-extrabold leading-[1.15] tracking-[0.01em] text-center whitespace-nowrap">{{ sempro ? STATUS_SEMINAR_LABEL[sempro.status] : 'Belum' }}</span>
                </div>
              </div>

              <!-- Progress label -->
              <div class="mt-1">
                <span class="inline-block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">Tahap 1</span>
                <h3 class="text-[13.5px] font-extrabold text-slate-800 leading-snug group-hover:text-[#0D47A1] transition-colors">
                  Seminar Proposal
                </h3>
              </div>
            </div>
          </div>

          <!-- Card 2: Seminar Hasil -->
          <div
            class="group relative overflow-hidden bg-white rounded-[22px] border border-slate-100 p-4 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-[#90CAF9] hover:shadow-[0_8px_24px_-4px_rgba(33,150,243,0.12)] flex flex-col justify-between"
          >
            <!-- Background accent soft glow -->
            <div class="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#90CAF9]/20 blur-xl group-hover:bg-[#90CAF9]/35 transition-colors" />

            <div>
              <!-- Top Row: Icon & Status Pill -->
              <div class="flex items-start gap-3 mb-3">
                <div
                  class="status-mark group/status w-[84px] h-[76px] rounded-[17px] flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover/status:scale-[1.04] shrink-0 border"
                  :class="semhas?.status === 'terkonfirmasi' ? 'bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9] shadow-[0_7px_16px_rgba(33,150,243,0.14)]' : (semhas?.status === 'selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200/80')"
                >
                  <span class="w-9 h-9 rounded-[12px] flex items-center justify-center text-white shadow-sm relative"
                    :class="semhas?.status === 'terkonfirmasi' ? 'bg-[#2196F3]' : 'bg-emerald-500'">
                    <svg v-if="semhas?.status === 'terkonfirmasi'" class="w-[21px] h-[21px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" stroke-width="2.25" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m8.5 12 2.3 2.3 4.7-4.7" /></svg>
                    <svg v-else class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span class="text-[9px] font-extrabold leading-[1.15] tracking-[0.01em] text-center whitespace-nowrap">{{ semhas ? STATUS_SEMINAR_LABEL[semhas.status] : 'Belum' }}</span>
                </div>
              </div>

              <!-- Progress label -->
              <div class="mt-1">
                <span class="inline-block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">Tahap 2</span>
                <h3 class="text-[13.5px] font-extrabold text-slate-800 leading-snug group-hover:text-[#0D47A1] transition-colors">
                  Seminar Hasil
                </h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Tim Dosen Pembimbing (Wide Card) -->
        <div
          class="group relative overflow-hidden bg-white rounded-[22px] border border-slate-100 p-4 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] active:scale-[0.99] transition-all duration-200 cursor-pointer hover:border-[#90CAF9] hover:shadow-[0_8px_24px_-4px_rgba(33,150,243,0.16)]"
          @click="showDosenSheet = true"
        >
          <!-- Background decorative glow -->
          <div class="pointer-events-none absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#90CAF9]/20 blur-xl group-hover:bg-[#90CAF9]/35 transition-colors" />

          <!-- Header Dosen Pembimbing -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-[13px] bg-[#2196F3] flex items-center justify-center text-white shadow-[0_6px_14px_rgba(33,150,243,0.24)]">
                <svg class="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.25" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm13 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
              </div>
              <div>
                <h3 class="text-[13px] font-extrabold text-slate-800 leading-tight">Dosen Pembimbing</h3>
                <p class="text-[10px] text-slate-400 font-semibold">Bimbingan Tugas Akhir</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9]">
                2 Pembimbing
              </span>
              <div class="w-6 h-6 rounded-full bg-[#E3F2FD] flex items-center justify-center text-[#2196F3] group-hover:text-[#0D47A1] group-hover:translate-x-0.5 transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>

          <!-- 2 Kolom Pembimbing -->
          <div class="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-100">
            <!-- Pembimbing 1 -->
            <div class="bg-gradient-to-br from-slate-50 to-[#E3F2FD] rounded-[14px] p-2.5 flex items-center gap-2.5 border border-slate-100/80 group-hover:border-[#90CAF9] transition-colors">
              <div class="w-8 h-8 rounded-xl bg-[#2196F3] text-white font-extrabold text-[11px] flex items-center justify-center shadow-[0_4px_10px_rgba(33,150,243,0.22)] flex-shrink-0">
                {{ getInisial(profil.pembimbing1) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[9px] font-extrabold text-[#2196F3] uppercase tracking-wide leading-none mb-1">Utama</p>
                <p class="text-[11.5px] font-extrabold text-slate-800 truncate leading-tight">{{ profil.pembimbing1 }}</p>
              </div>
            </div>

            <!-- Pembimbing 2 -->
            <div class="bg-gradient-to-br from-slate-50 to-[#E3F2FD] rounded-[14px] p-2.5 flex items-center gap-2.5 border border-slate-100/80 group-hover:border-[#90CAF9] transition-colors">
              <div class="w-8 h-8 rounded-xl bg-[#0D47A1] text-white font-extrabold text-[11px] flex items-center justify-center shadow-[0_4px_10px_rgba(13,71,161,0.22)] flex-shrink-0">
                {{ getInisial(profil.pembimbing2) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[9px] font-extrabold text-[#0D47A1] uppercase tracking-wide leading-none mb-1">Pendamping</p>
                <p class="text-[11.5px] font-extrabold text-slate-800 truncate leading-tight">{{ profil.pembimbing2 }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- JADWAL SEMINAR SAYA -->
      <section class="mb-6">
        <h2 class="text-[17px] font-extrabold text-slate-800 mb-3">Jadwal Seminar Saya</h2>
        <div class="bg-white rounded-[22px] border border-slate-100 shadow-sm overflow-hidden">
          <template v-if="seminar.length > 0">
            <div
              v-for="(s, idx) in seminar"
              :key="s.id"
              class="px-5 py-4 flex items-start gap-3.5 active:bg-slate-50 transition-colors cursor-pointer"
              :class="idx < seminar.length - 1 ? 'border-b border-slate-50' : ''"
              @click="selectedSeminar = s; showDetailSheet = true"
            >
              <div class="flex-shrink-0 flex flex-col items-center justify-center w-[62px] min-h-[70px] rounded-[15px] bg-[#E3F2FD] border border-[#90CAF9]/50 py-2">
                <span class="text-[22px] font-extrabold text-[#0D47A1] leading-none">{{ tanggalKe(s.tanggal) }}</span>
                <span class="text-[10px] text-[#2196F3] font-bold leading-none mt-1.5">{{ formatBulanTahun(s.tanggal) }}</span>
                <span class="text-[10px] text-[#0D47A1] font-bold leading-none mt-2">{{ jamTitik(s.jamMulai) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-bold text-slate-800 leading-[1.25] line-clamp-2">{{ s.judul }}</p>
                <p class="text-[11px] text-slate-400 font-medium mt-1 line-clamp-2">{{ s.keterangan }}</p>
              </div>
              <div class="flex flex-col items-end gap-2 flex-shrink-0 min-w-[76px]">
                <span class="text-[11px] font-bold text-slate-600">{{ s.ruangan }}</span>
                <UiStatusSeminarChip :status="s.status" />
              </div>
            </div>
          </template>
          <div v-else class="py-8 text-center">
            <p class="text-slate-400 text-sm font-medium">Belum ada jadwal seminar.</p>
          </div>
          <div class="border-t border-slate-50 px-5 py-3.5">
            <NuxtLink to="/mahasiswa/jadwal" class="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#2196F3] active:opacity-70 transition-opacity">
              Lihat semua jadwal
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- INFO PROFIL SINGKAT -->
      <section class="mb-2">
        <div class="bg-white rounded-[22px] border border-slate-100 shadow-sm overflow-hidden">
          <div class="px-5 py-4 flex items-center gap-3.5 border-b border-slate-50">
            <div class="w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-extrabold text-white shadow-sm flex-shrink-0" style="background: linear-gradient(135deg, #0D47A1, #1976D2);">
              {{ profil.inisial }}
            </div>
            <div class="min-w-0">
              <p class="text-[14px] font-bold text-slate-800 truncate">{{ profil.nama }}</p>
              <p class="text-[11px] text-slate-400 font-medium truncate">{{ profil.nim }} · {{ profil.programStudi }}</p>
            </div>
          </div>
          <dl class="px-5 py-4 flex flex-col gap-3">
            <div v-for="[label, nilai] in infoSingkat" :key="label" class="flex items-center justify-between gap-4">
              <dt class="text-[12px] text-slate-400 font-medium flex-shrink-0">{{ label }}</dt>
              <dd class="text-[12px] font-bold text-slate-800 text-right">{{ nilai }}</dd>
            </div>
          </dl>
          <div v-if="terdekat?.catatan" class="mx-5 mb-5 p-3.5 bg-blue-50 rounded-[14px]">
            <p class="text-[11px] font-bold text-blue-700 mb-1">Catatan</p>
            <p class="text-[11px] text-blue-600 leading-relaxed">{{ terdekat.catatan }}</p>
          </div>
          <div v-else class="mx-5 mb-5 p-3.5 bg-slate-50 rounded-[14px]">
            <p class="text-[11px] font-bold text-slate-600 mb-1">Catatan</p>
            <p class="text-[11px] text-slate-500 leading-relaxed">Pastikan slide, dokumen revisi, dan bukti persetujuan sudah siap sebelum jadwal seminar.</p>
          </div>
        </div>
      </section>

    </main>

    <!-- BOTTOM SHEET DETAIL SEMINAR -->
    <Transition name="mhs-overlay">
      <div v-if="showDetailSheet && selectedSeminar" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm" @click.self="showDetailSheet = false">
        <Transition name="mhs-sheet">
          <div v-if="showDetailSheet" class="bg-white w-full max-w-lg rounded-t-[28px] pt-4 pb-10 shadow-2xl">
            <div class="flex justify-center mb-5"><div class="w-10 h-1 bg-slate-200 rounded-full" /></div>
            <div class="px-6 flex items-center justify-between mb-5">
              <h3 class="text-[17px] font-extrabold text-slate-800">Detail Seminar</h3>
              <button @click="showDetailSheet = false" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="px-6 flex flex-col gap-4">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">{{ JENIS_LABEL[selectedSeminar.jenis] }}</span>
                <UiStatusSeminarChip :status="selectedSeminar.status" />
              </div>
              <p class="text-[15px] font-bold text-slate-800 leading-snug">{{ selectedSeminar.judul }}</p>
              <div class="bg-slate-50 rounded-[16px] p-4 flex flex-col gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 font-medium">Tanggal</p>
                    <p class="text-[13px] font-bold text-slate-700">{{ formatTanggalPanjang(selectedSeminar.tanggal) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 font-medium">Waktu</p>
                    <p class="text-[13px] font-bold text-slate-700">{{ jamTitik(selectedSeminar.jamMulai) }} - {{ jamTitik(selectedSeminar.jamSelesai) }} WIB</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 font-medium">Ruangan</p>
                    <p class="text-[13px] font-bold text-slate-700">{{ selectedSeminar.ruangan }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 font-medium">Ketua Penguji</p>
                    <p class="text-[13px] font-bold text-slate-700">{{ selectedSeminar.ketuaPenguji }}</p>
                  </div>
                </div>
              </div>
              <div v-if="selectedSeminar.catatan" class="bg-amber-50 border border-amber-100 rounded-[16px] p-4">
                <p class="text-[11px] font-bold text-amber-700 mb-1.5">Catatan Penting</p>
                <p class="text-[12px] text-amber-700 leading-relaxed">{{ selectedSeminar.catatan }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- BOTTOM SHEET DETAIL DOSEN PEMBIMBING -->
    <Transition name="mhs-overlay">
      <div v-if="showDosenSheet" class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm" @click.self="showDosenSheet = false">
        <Transition name="mhs-sheet">
          <div v-if="showDosenSheet" class="bg-white w-full max-w-lg rounded-t-[28px] pt-4 pb-10 shadow-2xl">
            <div class="flex justify-center mb-5"><div class="w-10 h-1 bg-slate-200 rounded-full" /></div>
            <div class="px-6 flex items-center justify-between mb-5">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-[#E3F2FD] flex items-center justify-center text-[#2196F3]">
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.25" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm13 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                </div>
                <div>
                  <h3 class="text-[17px] font-extrabold text-slate-800">Dosen Pembimbing</h3>
                  <p class="text-[11px] text-slate-400 font-medium">Tim Pembimbing Tugas Akhir</p>
                </div>
              </div>
              <button @click="showDosenSheet = false" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div class="px-6 flex flex-col gap-3.5">
              <!-- Judul TA Singkat -->
              <div class="bg-[#E3F2FD] border border-[#90CAF9]/70 rounded-[18px] p-3.5">
                <p class="text-[10px] font-extrabold uppercase tracking-wider text-[#0D47A1] mb-1">Judul Tugas Akhir</p>
                <p class="text-[13px] font-bold text-slate-800 leading-snug">{{ profil.judulTA }}</p>
              </div>

              <!-- Pembimbing 1 Card -->
              <div class="bg-white border border-slate-100 rounded-[18px] p-4 shadow-sm flex items-start gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-[#2196F3] text-white font-extrabold text-[14px] flex items-center justify-center shadow-[0_5px_12px_rgba(33,150,243,0.22)] flex-shrink-0">
                  {{ getInisial(profil.pembimbing1) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <span class="text-[10px] font-extrabold text-[#0D47A1] bg-[#E3F2FD] border border-[#90CAF9]/70 px-2 py-0.5 rounded-full">Pembimbing Utama</span>
                    <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Aktif
                    </span>
                  </div>
                  <h4 class="text-[14px] font-extrabold text-slate-800 truncate">{{ profil.pembimbing1 }}</h4>
                  <p class="text-[11px] text-slate-400 font-medium mt-0.5">Bidang Rekayasa Perangkat Lunak & AI</p>
                </div>
              </div>

              <!-- Pembimbing 2 Card -->
              <div class="bg-white border border-slate-100 rounded-[18px] p-4 shadow-sm flex items-start gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-[#0D47A1] text-white font-extrabold text-[14px] flex items-center justify-center shadow-[0_5px_12px_rgba(13,71,161,0.22)] flex-shrink-0">
                  {{ getInisial(profil.pembimbing2) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <span class="text-[10px] font-extrabold text-[#0D47A1] bg-[#E3F2FD] border border-[#90CAF9]/70 px-2 py-0.5 rounded-full">Pembimbing Pendamping</span>
                    <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Aktif
                    </span>
                  </div>
                  <h4 class="text-[14px] font-extrabold text-slate-800 truncate">{{ profil.pembimbing2 }}</h4>
                  <p class="text-[11px] text-slate-400 font-medium mt-0.5">Bidang Data Science & NLP</p>
                </div>
              </div>

              <div class="p-3 bg-slate-50 rounded-[14px]">
                <p class="text-[11px] text-slate-500 text-center leading-relaxed">
                  Konsultasikan perkembangan penulisan dan persiapan seminar secara berkala dengan kedua dosen pembimbing.
                </p>
              </div>

              <button
                @click="showDosenSheet = false"
                class="w-full mt-1 py-3.5 rounded-[16px] bg-[#0D47A1] text-white font-extrabold text-[13px] shadow-[0_8px_18px_rgba(13,71,161,0.24)] active:scale-[0.98] transition-all hover:bg-[#2196F3]"
              >
                Tutup
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- MAHASISWA BOTTOM NAV -->
    <MahasiswaBottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { JENIS_LABEL } from '~/types/domain'
import { STATUS_SEMINAR_LABEL, type SeminarSaya } from '~/composables/useMahasiswaSaya'
import { formatTanggalPanjang, hariMenuju, jamTitik, tanggalKe, formatBulanTahun } from '~/utils/format'

const { profil, seminar, seminarTerdekat: terdekat, seminarJenis } = useMahasiswaSaya()
const sisaHari = computed(() => (terdekat.value ? hariMenuju(terdekat.value.tanggal) : 0))
const sempro = seminarJenis('sempro')
const semhas = seminarJenis('semhas')

const infoSingkat = computed(() => {
  const s = terdekat.value
  return [
    ['Status akademik', profil.value.status],
    ['Jenis seminar', s ? (s.jenis === 'sempro' ? 'Sempro' : 'Semhas') : '—'],
    ['Ruangan', s?.ruangan ?? '—'],
    ['Waktu', s ? `${jamTitik(s.jamMulai)} WIB` : '—'],
  ]
})

const showDetailSheet = ref(false)
const showDosenSheet = ref(false)
const selectedSeminar = ref<SeminarSaya | null>(null)

function getInisial(nama?: string): string {
  if (!nama) return 'DS'
  const clean = nama.replace(/^(Dr\.|Prof\.|Ir\.|Drs\.|Dra\.)\s*/i, '').trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return (parts[0]?.[0] ?? 'D').toUpperCase()
}

watch([showDetailSheet, showDosenSheet], ([v1, v2]) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = (v1 || v2) ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.mhs-overlay-enter-active, .mhs-overlay-leave-active { transition: opacity 0.25s ease; }
.mhs-overlay-enter-from, .mhs-overlay-leave-to { opacity: 0; }
.mhs-sheet-enter-active { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.mhs-sheet-leave-active { transition: transform 0.22s cubic-bezier(0.7, 0, 1, 0.6); }
.mhs-sheet-enter-from, .mhs-sheet-leave-to { transform: translateY(100%); }
.mhs-dashboard * { -webkit-tap-highlight-color: transparent; }
</style>
