<template>
  <div class="dosen-db min-h-screen font-sans pb-32" style="background:#ffffff;">
    <div class="mobile-safe-top">

      <!-- ═══════════════════════════════════════
           HEADER
      ═══════════════════════════════════════ -->
      <header class="px-5 mb-7 flex justify-between items-center gap-3">
        <!-- Profile -->
        <button class="min-w-0 flex-1 flex items-center gap-3 active:opacity-70 transition-opacity text-left" @click="showProfileSheet=true">
          <!-- avatar: foto jika ada, inisial jika belum -->
          <div class="w-[50px] h-[50px] rounded-full shrink-0 shadow-md flex items-center justify-center text-white font-bold text-[16px] relative overflow-hidden"
               :style="profilePhoto ? '' : 'background:linear-gradient(135deg,#1565C0 0%,#42A5F5 100%);'">
            <img v-if="profilePhoto" :src="profilePhoto" alt="Foto profil" class="w-full h-full object-cover"/>
            <span v-else>{{ userInitials }}</span>
          </div>
          <div class="min-w-0 text-left">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="greeting-mark" aria-label="Greeting">Hello!</span>
            </div>
            <h1 class="truncate text-[16px] font-extrabold leading-tight tracking-tight" style="color:#0f172a;">{{ user.nama }}</h1>
            <p class="truncate text-[10px] font-medium mt-0.5" style="color:#94a3b8;">Lihat jadwal seminar dan sidang Anda</p>
          </div>
        </button>

        <!-- Bell -->
        <NuxtLink to="/dosen/notifications"
          class="relative w-10 h-10 rounded-[14px] flex items-center justify-center transition-all active:scale-90"
          style="background:#ffffff;box-shadow:0 2px 10px rgba(0,0,0,0.08);border:1px solid #f1f5f9;">
          <svg class="w-[19px] h-[19px]" fill="none" stroke="#334155" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span v-if="badge.konfirmasi>0" class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[8px] font-extrabold text-white" style="background:#ef4444;">{{ badge.konfirmasi }}</span>
        </NuxtLink>
      </header>

      <!-- ═══════════════════════════════════════
           OVERVIEW — 3 cards, clean & modern
      ═══════════════════════════════════════ -->
      <section class="px-5 mb-7">
        <h2 class="text-[11px] font-extrabold uppercase tracking-[0.12em] mb-3.5" style="color:#94a3b8;">Overview</h2>

        <div class="grid grid-cols-3 gap-2.5">

          <!-- Card 1: Agenda Hari Ini -->
          <button class="ov-card rounded-[20px] p-3.5 flex flex-col items-center text-center" style="background:#E3F2FD;border:1px solid #90CAF9;" aria-label="Lihat agenda hari ini" @click="goTo('/dosen/jadwal-pribadi')">
            <div class="w-10 h-10 rounded-[14px] flex items-center justify-center mb-2.5" style="background:#ffffff;box-shadow:0 4px 12px rgba(33,150,243,0.16);">
              <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h2M14 14h2M8 18h2"/>
              </svg>
            </div>
            <p class="text-[24px] font-extrabold leading-none mb-1" style="color:#0D47A1;">{{ agenda.length }}</p>
            <p class="ov-label" style="color:#1565C0;">Agenda<br>Hari Ini</p>
          </button>

          <!-- Card 2: Seminar Mendatang -->
          <button class="ov-card rounded-[20px] p-3.5 flex flex-col items-center text-center" style="background:#E3F2FD;border:1px solid #90CAF9;" aria-label="Lihat seminar mendatang" @click="goTo('/dosen/jadwal-seminar')">
            <div class="w-10 h-10 rounded-[14px] flex items-center justify-center mb-2.5" style="background:#ffffff;box-shadow:0 4px 12px rgba(33,150,243,0.16);">
              <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#1976D2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-[24px] font-extrabold leading-none mb-1" style="color:#0D47A1;">{{ stats.jadwalPengujian }}</p>
            <p class="ov-label" style="color:#1565C0;">Seminar<br>Mendatang</p>
          </button>

          <!-- Card 3: Perlu Tindakan -->
          <button class="ov-card rounded-[20px] p-3.5 flex flex-col items-center text-center" style="background:#E3F2FD;border:1px solid #90CAF9;" aria-label="Lihat jadwal yang perlu dikonfirmasi" @click="goTo('/dosen/konfirmasi-jadwal')">
            <div class="w-10 h-10 rounded-[14px] flex items-center justify-center mb-2.5" style="background:#ffffff;box-shadow:0 4px 12px rgba(33,150,243,0.16);">
              <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#2196F3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3l9 4.5v5.5c0 4.5-3.8 7.5-9 8.8-5.2-1.3-9-4.3-9-8.8V7.5L12 3z"/><path d="M12 8v4M12 15h.01"/>
              </svg>
            </div>
            <p class="text-[24px] font-extrabold leading-none mb-1" style="color:#0D47A1;">{{ badge.konfirmasi }}</p>
            <p class="ov-label" style="color:#1565C0;">Perlu<br>Tindakan</p>
          </button>

        </div>
      </section>

      <!-- ═══════════════════════════════════════
           JADWAL SEMPRO & SEMHAS
      ═══════════════════════════════════════ -->
      <section class="px-5 mb-5">
        <div class="flex items-center justify-between mb-3.5">
          <div class="flex items-center gap-2">
            <span class="w-[3px] h-[18px] rounded-full" style="background:#1565C0;"/>
            <h2 class="text-[14px] font-extrabold" style="color:#0f172a;">Jadwal Sempro dan Semhas</h2>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold" style="background:#dbeafe;color:#1d4ed8;">{{ agenda.length }} agenda</span>
        </div>

        <div class="flex flex-col gap-2.5">
          <div v-for="item in agendaPreview" :key="item.id"
               class="agenda-card rounded-[20px] p-4"
               style="background:#ffffff;border:1px solid #f1f5f9;box-shadow:0 1px 12px rgba(0,0,0,0.04);">
            <div class="flex items-start gap-3">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-extrabold text-[13px]"
                   :style="{background:avatarColor(item.inisial)}">{{ item.inisial }}</div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <h3 class="font-extrabold text-[13px] leading-tight" style="color:#0f172a;">{{ item.mahasiswa }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0"
                        :class="item.jenis==='sempro'?'bg-[#fff0f5] text-[#e91e8c]':'bg-[#eff3ff] text-[#1d4ed8]'">
                    {{ item.jenis==='sempro'?'Sempro':'Semhas' }}
                  </span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 shrink-0" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <span class="text-[10px] font-bold" style="color:#1565C0;">{{ formatTanggal(item.tanggal) }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3 h-3 shrink-0" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
                      <span class="text-[10px] font-bold" style="color:#1565C0;">{{ item.jamMulai }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <svg class="w-3 h-3 shrink-0" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span class="text-[10px] font-bold" style="color:#1565C0;">{{ item.ruangan }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Role badge -->
              <span class="px-2.5 py-1 rounded-full text-[9px] font-extrabold shrink-0 mt-0.5" style="background:#dbeafe;color:#1d4ed8;">
                {{ peranLabel(item.peran) }}
              </span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="agenda.length===0" class="rounded-[20px] p-8 flex flex-col items-center gap-3 text-center" style="background:#ffffff;border:1px solid #f1f5f9;">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background:#f1f5f9;">
              <svg class="w-6 h-6" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
            <p class="text-[12px] font-bold" style="color:#0f172a;">Belum ada agenda seminar</p>
          </div>
        </div>

        <!-- Lihat semua — simple style seperti referensi -->
        <div v-if="agenda.length>0" class="mt-4 pt-3.5" style="border-top:1px solid #f1f5f9;">
          <NuxtLink to="/dosen/jadwal-seminar"
            class="flex items-center gap-1.5 active:opacity-60 transition-opacity">
            <span class="text-[13px] font-bold" style="color:#1565C0;">Lihat semua →</span>
          </NuxtLink>
        </div>
      </section>

      <!-- ═══════════════════════════════════════
           PERHATIAN  — clean, modern card
      ═══════════════════════════════════════ -->
      <section v-if="perhatian" class="px-5 mb-5">
        <div class="perhatian-card rounded-[20px] p-4 flex items-center gap-3"
             style="background:#ffffff;border:1px solid #dbeafe;box-shadow:0 1px 12px rgba(21,101,192,0.06);">
          <!-- icon block -->
          <div class="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
               style="background:linear-gradient(135deg,#1565C0 0%,#42A5F5 100%);">
            <svg class="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <!-- text -->
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-extrabold mb-0.5" style="color:#1565C0;">Perhatian</p>
            <p class="text-[11px] leading-relaxed" style="color:#64748b;">{{ perhatian }}</p>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════
           AKSI CEPAT
      ═══════════════════════════════════════ -->
      <section class="px-5 mb-6">
        <h2 class="text-[11px] font-extrabold uppercase tracking-[0.12em] mb-3.5" style="color:#94a3b8;">Aksi Cepat</h2>
        <!-- 3 cards — all identical white style, consistent -->
        <div class="grid grid-cols-3 gap-2.5">

          <!-- Jadwal Seminar -->
          <NuxtLink to="/dosen/jadwal-seminar"
            class="qa-card flex flex-col items-center gap-2 py-4 rounded-[20px] active:scale-95 transition-all"
            style="background:#ffffff;border:1px solid #f1f5f9;box-shadow:0 1px 12px rgba(0,0,0,0.05);">
            <div class="w-9 h-9 rounded-[12px] flex items-center justify-center" style="background:#dbeafe;">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="#1565C0" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
            <span class="text-[10px] font-extrabold text-center leading-tight" style="color:#334155;">Jadwal<br>Seminar</span>
          </NuxtLink>

          <!-- Jadwal Pribadi -->
          <NuxtLink to="/dosen/jadwal-pribadi"
            class="qa-card flex flex-col items-center gap-2 py-4 rounded-[20px] active:scale-95 transition-all"
            style="background:#ffffff;border:1px solid #f1f5f9;box-shadow:0 1px 12px rgba(0,0,0,0.05);">
            <div class="w-9 h-9 rounded-[12px] flex items-center justify-center" style="background:#f0f7ff;">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="#1565C0" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <span class="text-[10px] font-extrabold text-center leading-tight" style="color:#334155;">Jadwal<br>Pribadi</span>
          </NuxtLink>

          <!-- Konfirmasi Jadwal -->
          <NuxtLink to="/dosen/konfirmasi-jadwal"
            class="qa-card flex flex-col items-center gap-2 py-4 rounded-[20px] active:scale-95 transition-all relative"
            style="background:#ffffff;border:1px solid #f1f5f9;box-shadow:0 1px 12px rgba(0,0,0,0.05);">
            <span v-if="badge.konfirmasi>0"
              class="absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[8px] font-extrabold text-white"
              style="background:#ef4444;">{{ badge.konfirmasi }}</span>
            <div class="w-9 h-9 rounded-[12px] flex items-center justify-center" style="background:#fff4e5;">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="#e89271" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span class="text-[10px] font-extrabold text-center leading-tight" style="color:#334155;">Konfirmasi<br>Jadwal</span>
          </NuxtLink>

        </div>
      </section>

    </div>

    <!-- ═══════════════════════════════════════
         PROFILE BOTTOM SHEET
    ═══════════════════════════════════════ -->
    <Transition name="bd">
      <div v-if="showProfileSheet" class="fixed inset-0 z-[100] flex items-end" style="background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);" @click.self="showProfileSheet=false">
        <Transition name="su">
          <div v-if="showProfileSheet" class="bg-white w-full rounded-t-[30px] pt-4 pb-10 flex flex-col items-center" style="box-shadow:0 -8px 40px rgba(0,0,0,0.12);">
            <div class="w-10 h-1.5 rounded-full mb-5" style="background:#e2e8f0;"/>
            <!-- header -->
            <div class="w-full px-5 flex justify-between items-center mb-6">
              <button class="w-9 h-9 rounded-full flex items-center justify-center active:scale-90" style="background:#f1f5f9;" @click="showProfileSheet=false">
                <svg class="w-[18px] h-[18px]" fill="none" stroke="#475569" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <h2 class="text-[15px] font-extrabold" style="color:#0f172a;">Profil Dosen</h2>
              <div class="w-9"/>
            </div>
            <!-- hidden file input -->
            <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handlePhotoPick"/>

            <!-- avatar — klik untuk ubah foto -->
            <div class="flex flex-col items-center px-5 w-full mb-6">
              <button class="relative mb-3 active:scale-95 transition-transform" @click="pickPhoto">
                <!-- foto atau inisial -->
                <div class="w-[80px] h-[80px] rounded-full flex items-center justify-center text-white font-extrabold text-[26px] shadow-lg overflow-hidden"
                     :style="profilePhoto ? '' : 'background:linear-gradient(135deg,#1565C0 0%,#42A5F5 100%);'">
                  <img v-if="profilePhoto" :src="profilePhoto" alt="Foto profil" class="w-full h-full object-cover"/>
                  <span v-else>{{ userInitials }}</span>
                </div>
                <!-- camera overlay badge -->
                <div class="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                     style="background:#1565C0;">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="white" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </button>
              <p class="text-[10px] font-semibold mb-3" style="color:#94a3b8;">Ketuk untuk ubah foto</p>
              <h3 class="text-[17px] font-extrabold" style="color:#0f172a;">{{ user.nama }}</h3>
              <p class="text-[10px] font-mono mt-0.5 mb-2.5" style="color:#64748b;">NIP. 198507232010121001</p>
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-[10px] font-extrabold" style="background:#dbeafe;color:#1d4ed8;">{{ user.roleLabel }}</span>
                <span class="px-3 py-1 rounded-full text-[10px] font-extrabold" style="background:#f0fdf4;color:#15803d;">Aktif</span>
              </div>
            </div>
            <!-- dosen-specific info row -->
            <div class="w-full px-5 mb-4">
              <div class="rounded-[18px] p-3.5 flex items-center gap-3" style="background:#f8fafc;border:1px solid #f1f5f9;">
                <div class="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style="background:#dbeafe;">
                  <svg class="w-4 h-4" fill="none" stroke="#1565C0" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div>
                  <p class="text-[9px] font-bold" style="color:#94a3b8;">Program Studi</p>
                  <p class="text-[12px] font-extrabold" style="color:#0f172a;">Teknik Informatika</p>
                </div>
              </div>
            </div>
            <!-- actions -->
            <div class="w-full px-5 flex flex-col gap-2.5">
              <button class="w-full flex items-center justify-between p-4 rounded-[18px] active:opacity-70"
                      style="background:#f8fafc;border:1px solid #f1f5f9;"
                      @click="showPasswordModal=true;showProfileSheet=false">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-[12px] flex items-center justify-center" style="background:white;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                    <svg class="w-4 h-4" fill="none" stroke="#475569" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <span class="text-[13px] font-extrabold" style="color:#334155;">Ubah Kata Sandi</span>
                </div>
                <svg class="w-4 h-4" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <button class="w-full flex items-center justify-between p-4 rounded-[18px] active:opacity-70"
                      style="background:#fff5f5;border:1px solid #fee2e2;"
                      @click="showLogoutModal=true;showProfileSheet=false">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-[12px] flex items-center justify-center" style="background:white;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
                    <svg class="w-4 h-4" fill="none" stroke="#ef4444" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  </div>
                  <span class="text-[13px] font-extrabold" style="color:#dc2626;">Keluar Akun</span>
                </div>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- PASSWORD MODAL -->
    <Transition name="mf">
      <div v-if="showPasswordModal" class="fixed inset-0 z-[110] flex items-center justify-center p-5"
           style="background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);" @click.self="showPasswordModal=false">
        <Transition name="mz">
          <div v-if="showPasswordModal" class="bg-white rounded-[24px] w-full shadow-2xl overflow-hidden" style="max-width:360px;">
            <div class="p-5 flex justify-between items-center" style="border-bottom:1px solid #f1f5f9;">
              <h3 class="text-[15px] font-extrabold" style="color:#0f172a;">Ubah Kata Sandi</h3>
              <button class="w-8 h-8 rounded-full flex items-center justify-center active:scale-90" style="background:#f1f5f9;" @click="showPasswordModal=false">
                <svg class="w-4 h-4" fill="none" stroke="#475569" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-5 flex flex-col gap-3.5">
              <div class="flex flex-col gap-1.5"><label class="text-[11px] font-extrabold" style="color:#64748b;">Kata Sandi Lama</label><input v-model="passForm.old" type="password" class="w-full rounded-[14px] px-4 py-3 text-[13px] font-medium outline-none" style="background:#f8fafc;border:1.5px solid #e2e8f0;color:#0f172a;" placeholder="Masukkan kata sandi lama"/></div>
              <div class="flex flex-col gap-1.5"><label class="text-[11px] font-extrabold" style="color:#64748b;">Kata Sandi Baru</label><input v-model="passForm.new" type="password" class="w-full rounded-[14px] px-4 py-3 text-[13px] font-medium outline-none" style="background:#f8fafc;border:1.5px solid #e2e8f0;color:#0f172a;" placeholder="Minimal 8 karakter"/></div>
              <div class="flex flex-col gap-1.5"><label class="text-[11px] font-extrabold" style="color:#64748b;">Konfirmasi Kata Sandi</label><input v-model="passForm.confirm" type="password" class="w-full rounded-[14px] px-4 py-3 text-[13px] font-medium outline-none" style="background:#f8fafc;border:1.5px solid #e2e8f0;color:#0f172a;" placeholder="Ketik ulang kata sandi baru"/></div>
            </div>
            <div class="px-5 pb-5 flex gap-3">
              <button class="flex-1 py-3 rounded-[14px] text-[13px] font-extrabold active:scale-95 transition-transform" style="background:#f1f5f9;color:#64748b;" @click="showPasswordModal=false">Batal</button>
              <button class="flex-1 py-3 rounded-[14px] text-[13px] font-extrabold text-white active:scale-95 transition-transform" style="background:linear-gradient(135deg,#1565C0 0%,#42A5F5 100%);box-shadow:0 6px 16px rgba(21,101,192,0.28);" @click="handleSavePassword">Simpan</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- LOGOUT MODAL -->
    <Transition name="mf">
      <div v-if="showLogoutModal" class="fixed inset-0 z-[110] flex items-center justify-center p-5"
           style="background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);" @click.self="showLogoutModal=false">
        <Transition name="mz">
          <div v-if="showLogoutModal" class="bg-white rounded-[24px] w-full p-6 pt-8 text-center shadow-2xl" style="max-width:320px;">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style="background:#fff5f5;">
              <svg class="w-6 h-6" fill="none" stroke="#ef4444" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </div>
            <h3 class="text-[17px] font-extrabold mb-1.5" style="color:#0f172a;">Keluar dari Akun?</h3>
            <p class="text-[12px] leading-relaxed mb-6" style="color:#64748b;">Anda harus login kembali untuk mengakses SIPENTA.</p>
            <div class="flex gap-3">
              <button class="flex-1 py-3.5 rounded-[14px] text-[13px] font-extrabold active:scale-95 transition-transform" style="background:#f1f5f9;color:#64748b;" @click="showLogoutModal=false">Batal</button>
              <button class="flex-1 py-3.5 rounded-[14px] text-[13px] font-extrabold text-white active:scale-95 transition-transform" style="background:#ef4444;box-shadow:0 6px 16px rgba(239,68,68,0.28);" @click="handleLogout">Ya, Keluar</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <DosenBottomNav/>
  </div>
</template>

<script setup lang="ts">
import type { Peran } from '~/types/domain'

const { user } = useCurrentUser()
const { logout } = useAuth()
const { stats, agenda, perhatian, badge } = useDosenSaya()
const goTo = (path: string) => navigateTo(path)

const userInitials = computed(() =>
  user.value.nama.split(' ').filter(w => /[A-Za-z]/.test(w)).slice(0,2).map(w=>w[0].toUpperCase()).join('')
)
const agendaPreview = computed(() => agenda.value.slice(0,2))

const avatarColors = [
  'linear-gradient(135deg,#1565C0,#42A5F5)',
  'linear-gradient(135deg,#6a3de8,#a78bfa)',
  'linear-gradient(135deg,#0f766e,#34d399)',
  'linear-gradient(135deg,#b45309,#fbbf24)',
  'linear-gradient(135deg,#be123c,#fb7185)',
]
const avatarColor = (s: string) => avatarColors[(s.charCodeAt(0)+(s.charCodeAt(1)??0))%avatarColors.length]
const peranLabel = (p: Peran) => p.startsWith('pembimbing') ? 'Pembimbing 1' : 'Penguji 1'
const formatTanggal = (d: string) => {
  if (!d) return ''
  const [y,m,dd] = d.split('-').map(Number)
  return `${dd} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][m-1]} ${y}`
}

const showProfileSheet  = ref(false)
const showPasswordModal = ref(false)
const showLogoutModal   = ref(false)
const passForm = ref({ old:'', new:'', confirm:'' })

// ── Foto Profil ───────────────────────────────────
const STORAGE_KEY = 'dosen_profile_photo'
const profilePhoto = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)

if (typeof localStorage !== 'undefined') {
  profilePhoto.value = localStorage.getItem(STORAGE_KEY) ?? ''
}

const pickPhoto = () => fileInputRef.value?.click()

const handlePhotoPick = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    window.$toast?.({ title: 'File terlalu besar', message: 'Ukuran foto maksimal 5 MB.', type: 'error' })
    return
  }
  const reader = new FileReader()
  reader.onload = (ev) => {
    const result = ev.target?.result as string
    profilePhoto.value = result
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, result)
    window.$toast?.({ title: 'Foto diperbarui', message: 'Foto profil berhasil diubah.', type: 'success' })
  }
  reader.readAsDataURL(file)
}

watch([showProfileSheet, showPasswordModal, showLogoutModal], ([profileOpen, passwordOpen, logoutOpen]) => {
  if (typeof document !== 'undefined') document.body.style.overflow = profileOpen || passwordOpen || logoutOpen ? 'hidden' : ''
})
onUnmounted(() => { if (typeof document!=='undefined') document.body.style.overflow='' })

const handleSavePassword = () => {
  if (!passForm.value.old||!passForm.value.new||!passForm.value.confirm) { window.$toast?.({title:'Gagal',message:'Semua kolom wajib diisi.',type:'error'}); return }
  if (passForm.value.new!==passForm.value.confirm) { window.$toast?.({title:'Tidak Cocok',message:'Konfirmasi kata sandi tidak sesuai.',type:'error'}); return }
  window.$toast?.({title:'Berhasil',message:'Kata sandi diperbarui.',type:'success'})
  showPasswordModal.value=false; passForm.value={old:'',new:'',confirm:''}
}
const handleLogout = () => {
  showLogoutModal.value = false
  window.$toast?.({ title: 'Berhasil Keluar', message: 'Anda telah keluar.', type: 'success' })
  return logout()
}
</script>

<style scoped>
.dosen-db {
  background:#f8fafc;
  -webkit-overflow-scrolling:touch;
  min-height:100dvh;
}
.ov-card {
  border-radius:22px;
  box-shadow:0 5px 16px rgba(13,71,161,0.07);
  animation:card-in .5s cubic-bezier(.22,1,.36,1) both;
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease,filter .2s ease;
}
.ov-label {
  display:block;
  width:100%;
  min-height:24px;
  font-size:9.5px;
  font-weight:600;
  line-height:1.15;
  text-align:center;
}
.greeting-mark {
  display:inline-block;
  color:#2196F3;
  font-size:11px;
  font-weight:800;
  letter-spacing:.02em;
  animation:greeting-in .45s ease-out .2s both;
}
@keyframes greeting-in {
  from { opacity:0; transform:translateY(3px); }
  to { opacity:1; transform:translateY(0); }
}
.ov-card:nth-child(2) { animation-delay:.08s; }
.ov-card:nth-child(3) { animation-delay:.16s; }
.ov-card:active { transform:translateY(2px) scale(.96); filter:brightness(.98); }
@media (hover:hover) and (pointer:fine) {
  .ov-card:hover {
    transform:translateY(-4px);
    box-shadow:0 12px 24px rgba(13,71,161,0.14);
  }
}
.ov-card:focus-visible { outline:3px solid rgba(33,150,243,.3); outline-offset:3px; }
@keyframes card-in {
  from { opacity:0; transform:translateY(10px) scale(.97); }
  to { opacity:1; transform:translateY(0) scale(1); }
}
.agenda-card { transition:transform .15s cubic-bezier(.34,1.56,.64,1); }
.agenda-card:active { transform:scale(.98); }
.qa-card { transition:transform .15s cubic-bezier(.34,1.56,.64,1); }

/* Sheet */
.bd-enter-active,.bd-leave-active{transition:opacity .28s ease}
.bd-enter-from,.bd-leave-to{opacity:0}
.su-enter-active{transition:transform .35s cubic-bezier(.16,1,.3,1)}
.su-leave-active{transition:transform .25s ease-in}
.su-enter-from,.su-leave-to{transform:translateY(100%)}

/* Modal */
.mf-enter-active,.mf-leave-active{transition:opacity .22s ease}
.mf-enter-from,.mf-leave-to{opacity:0}
.mz-enter-active{transition:transform .28s cubic-bezier(.34,1.56,.64,1),opacity .22s ease}
.mz-leave-active{transition:transform .18s ease-in,opacity .18s ease}
.mz-enter-from,.mz-leave-to{transform:scale(.88);opacity:0}
</style>