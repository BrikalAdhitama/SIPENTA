import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "login"
  | "dashboard"
  | "upload"
  | "preview"
  | "config"
  | "generate"
  | "results"
  | "calendar"
  | "history"
  | "rooms"
  | "jadwal-dosen"
  | "data-dosen"
  | "jadwal"
  | "settings" // kept for type compat but not navigable
  | "dosen-seminar"
  | "dosen-blokir"
  | "dosen-approve"
  | "mhs-jadwal"
  | "mhs-kuliah"
  | "kaprodi-laporan"
  | "kaprodi-approve";

type UserRole = "admin" | "dosen" | "mahasiswa";
interface CurrentUser { role: UserRole; id: number; nama: string; initials: string; subtitle: string; }

type SeminarType = "Sempro" | "Semhas";

interface SeminarData {
  id: number; nim: string; nama: string; jenis: SeminarType; judul: string;
  pembimbing: string; penguji1: string; penguji2: string; status: "valid" | "invalid" | "duplikat";
}
type ApprovalStatus = "pending" | "approved" | "declined";
type DosenRole = "Pembimbing 1" | "Pembimbing 2" | "Penguji 1" | "Penguji 2";
interface DosenApproval { nama: string; role: DosenRole; status: ApprovalStatus; declineReason?: string; }
interface ScheduleResult {
  id: number; tanggal: string; jam: string; ruangan: string; mahasiswa: string; jenis: SeminarType;
  pembimbing1: string; pembimbing2: string; penguji1: string; penguji2: string;
  approvals: DosenApproval[];
}
function slotStatus(s: ScheduleResult): ApprovalStatus {
  if (s.approvals.some(a => a.status === "declined")) return "declined";
  if (s.approvals.every(a => a.status === "approved")) return "approved";
  return "pending";
}
interface HistoryItem {
  id: number; nama: string; jenis: SeminarType; tanggalGenerate: string; periode: string;
  jumlahSeminar: number; fitnessScore: number; conflict: number; status: "Tersimpan" | "Draft";
}
interface JadwalKuliahMhs {
  id: number; nim: string; matkul: string; kelas: string; hari: string;
  jamMulai: string; jamSelesai: string; ruangan: string; dosen: string;
}

interface Dosen {
  id: number;
  nip: string;
  nama: string;
  gelar: string;
  email: string;
  bidang: string;
  status: "Aktif" | "Nonaktif";
}
interface JadwalDosen {
  id: number; dosenId: number; matkul: string; kelas: string; hari: string;
  jamMulai: string; jamSelesai: string; ruangan: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const SAMPLE_SEMINARS: SeminarData[] = [
  { id:1, nim:"2021001", nama:"Andi Pratama",    jenis:"Sempro", judul:"Implementasi CNN untuk Deteksi Penyakit Tanaman",          pembimbing:"Dr. Sari Dewi, M.Kom", penguji1:"Dr. Budi Santoso",     penguji2:"Dr. Cahya Putri",   status:"valid" },
  { id:2, nim:"2021002", nama:"Budi Setiawan",   jenis:"Semhas", judul:"Sistem Rekomendasi Berbasis Collaborative Filtering",      pembimbing:"Dr. Ahmad Fauzi",      penguji1:"Dr. Sari Dewi, M.Kom", penguji2:"Dr. Eko Prasetyo",  status:"valid" },
  { id:3, nim:"2021003", nama:"Cahya Ningrum",   jenis:"Sempro", judul:"Optimasi Jaringan Saraf Tiruan dengan Algoritma Genetika", pembimbing:"Dr. Budi Santoso",     penguji1:"Dr. Ahmad Fauzi",      penguji2:"Dr. Sari Dewi, M.Kom", status:"valid" },
  { id:4, nim:"2021004", nama:"Dian Pertiwi",    jenis:"Semhas", judul:"Analisis Sentimen Media Sosial Menggunakan BERT",          pembimbing:"Dr. Cahya Putri",      penguji1:"Dr. Eko Prasetyo",     penguji2:"Dr. Budi Santoso", status:"valid" },
  { id:5, nim:"2021005", nama:"Eko Wahyudi",     jenis:"Sempro", judul:"Deteksi Anomali pada Data IoT",                           pembimbing:"Dr. Eko Prasetyo",     penguji1:"Dr. Cahya Putri",      penguji2:"Dr. Ahmad Fauzi", status:"invalid" },
  { id:6, nim:"2021006", nama:"Fitri Handayani", jenis:"Semhas", judul:"Klasifikasi Citra Satelit dengan Transfer Learning",      pembimbing:"Dr. Sari Dewi, M.Kom", penguji1:"Dr. Budi Santoso",     penguji2:"Dr. Cahya Putri", status:"valid" },
  { id:7, nim:"2021007", nama:"Galih Kusuma",    jenis:"Sempro", judul:"Sistem Keamanan Berbasis Face Recognition",               pembimbing:"Dr. Ahmad Fauzi",      penguji1:"Dr. Sari Dewi, M.Kom", penguji2:"Dr. Eko Prasetyo", status:"valid" },
  { id:8, nim:"2021008", nama:"Heni Marlina",    jenis:"Semhas", judul:"Prediksi Cuaca dengan LSTM Neural Network",               pembimbing:"Dr. Budi Santoso",     penguji1:"Dr. Ahmad Fauzi",      penguji2:"Dr. Sari Dewi, M.Kom", status:"duplikat" },
];

function makeApprovals(p1: string, p2: string, q1: string, q2: string, statuses: [ApprovalStatus, ApprovalStatus, ApprovalStatus, ApprovalStatus], reasons?: [string?,string?,string?,string?]): DosenApproval[] {
  const roles: DosenRole[] = ["Pembimbing 1","Pembimbing 2","Penguji 1","Penguji 2"];
  return [p1,p2,q1,q2].map((nama,i) => ({ nama, role:roles[i], status:statuses[i], ...(reasons?.[i] ? {declineReason:reasons[i]} : {}) }));
}

const SAMPLE_SCHEDULE: ScheduleResult[] = [
  { id:1, tanggal:"01 Sep 2025", jam:"08:00 – 08:50", ruangan:"R101", mahasiswa:"Andi Pratama",    jenis:"Sempro", pembimbing1:"Dr. Sari Dewi",    pembimbing2:"Dr. Ahmad Fauzi",  penguji1:"Dr. Budi Santoso",  penguji2:"Dr. Cahya Putri",   approvals: makeApprovals("Dr. Sari Dewi","Dr. Ahmad Fauzi","Dr. Budi Santoso","Dr. Cahya Putri",   ["approved","approved","approved","approved"]) },
  { id:2, tanggal:"01 Sep 2025", jam:"08:00 – 10:00", ruangan:"R102", mahasiswa:"Budi Setiawan",   jenis:"Semhas", pembimbing1:"Dr. Ahmad Fauzi",  pembimbing2:"Dr. Cahya Putri",  penguji1:"Dr. Sari Dewi",     penguji2:"Dr. Eko Prasetyo",  approvals: makeApprovals("Dr. Ahmad Fauzi","Dr. Cahya Putri","Dr. Sari Dewi","Dr. Eko Prasetyo",   ["approved","pending","approved","pending"]) },
  { id:3, tanggal:"01 Sep 2025", jam:"09:00 – 09:50", ruangan:"R101", mahasiswa:"Cahya Ningrum",   jenis:"Sempro", pembimbing1:"Dr. Budi Santoso", pembimbing2:"Dr. Eko Prasetyo", penguji1:"Dr. Ahmad Fauzi",   penguji2:"Dr. Sari Dewi",     approvals: makeApprovals("Dr. Budi Santoso","Dr. Eko Prasetyo","Dr. Ahmad Fauzi","Dr. Sari Dewi",   ["approved","pending","pending","approved"]) },
  { id:4, tanggal:"01 Sep 2025", jam:"10:00 – 12:00", ruangan:"R102", mahasiswa:"Dian Pertiwi",    jenis:"Semhas", pembimbing1:"Dr. Cahya Putri",  pembimbing2:"Dr. Sari Dewi",    penguji1:"Dr. Eko Prasetyo",  penguji2:"Dr. Budi Santoso",  approvals: makeApprovals("Dr. Cahya Putri","Dr. Sari Dewi","Dr. Eko Prasetyo","Dr. Budi Santoso",   ["approved","approved","declined","approved"],[undefined,undefined,"Jadwal kuliah berbenturan di jam yang sama"]) },
  { id:5, tanggal:"02 Sep 2025", jam:"08:00 – 10:00", ruangan:"R101", mahasiswa:"Fitri Handayani", jenis:"Semhas", pembimbing1:"Dr. Sari Dewi",    pembimbing2:"Dr. Budi Santoso", penguji1:"Dr. Ahmad Fauzi",   penguji2:"Dr. Cahya Putri",   approvals: makeApprovals("Dr. Sari Dewi","Dr. Budi Santoso","Dr. Ahmad Fauzi","Dr. Cahya Putri",   ["pending","pending","pending","pending"]) },
  { id:6, tanggal:"02 Sep 2025", jam:"08:00 – 08:50", ruangan:"R102", mahasiswa:"Galih Kusuma",    jenis:"Sempro", pembimbing1:"Dr. Ahmad Fauzi",  pembimbing2:"Dr. Eko Prasetyo", penguji1:"Dr. Sari Dewi",     penguji2:"Dr. Budi Santoso",  approvals: makeApprovals("Dr. Ahmad Fauzi","Dr. Eko Prasetyo","Dr. Sari Dewi","Dr. Budi Santoso",   ["approved","approved","approved","approved"]) },
];
const SAMPLE_HISTORY: HistoryItem[] = [
  { id:1, nama:"Jadwal Sempro Sep 2025",    jenis:"Sempro", tanggalGenerate:"15 Agu 2025", periode:"1–5 Sep 2025",   jumlahSeminar:25, fitnessScore:98.4, conflict:0, status:"Tersimpan" },
  { id:2, nama:"Jadwal Semhas Agu 2025",    jenis:"Semhas", tanggalGenerate:"10 Agu 2025", periode:"25–29 Agu 2025", jumlahSeminar:18, fitnessScore:94.7, conflict:2, status:"Tersimpan" },
  { id:3, nama:"Jadwal Sempro Agu 2025 #2", jenis:"Sempro", tanggalGenerate:"05 Agu 2025", periode:"18–22 Agu 2025", jumlahSeminar:22, fitnessScore:91.2, conflict:4, status:"Draft" },
];
const INITIAL_DOSEN: Dosen[] = [
  { id:1, nip:"197503012005011001", nama:"Dr. Sari Dewi",   gelar:"M.Kom", email:"sari.dewi@univ.ac.id",    bidang:"Rekayasa Perangkat Lunak", status:"Aktif" },
  { id:2, nip:"198001152006041002", nama:"Dr. Ahmad Fauzi", gelar:"M.T",   email:"ahmad.fauzi@univ.ac.id",  bidang:"Kecerdasan Buatan",        status:"Aktif" },
  { id:3, nip:"197811202004012003", nama:"Dr. Budi Santoso",gelar:"M.Cs",  email:"budi.santoso@univ.ac.id", bidang:"Algoritma & Komputasi",    status:"Aktif" },
  { id:4, nip:"198505102008012004", nama:"Dr. Cahya Putri", gelar:"M.T",   email:"cahya.putri@univ.ac.id",  bidang:"Jaringan & Keamanan",      status:"Aktif" },
  { id:5, nip:"198209302007011005", nama:"Dr. Eko Prasetyo",gelar:"M.Kom", email:"eko.prasetyo@univ.ac.id", bidang:"Sistem Operasi & Embedded",status:"Aktif" },
];
const INITIAL_JADWAL_DOSEN: JadwalDosen[] = [
  { id:1, dosenId:1, matkul:"Pemrograman Web",          kelas:"TI-4A", hari:"Senin",  jamMulai:"08:00", jamSelesai:"09:40", ruangan:"Lab 1" },
  { id:2, dosenId:1, matkul:"Basis Data Lanjut",        kelas:"TI-3B", hari:"Rabu",   jamMulai:"10:00", jamSelesai:"11:40", ruangan:"R201" },
  { id:3, dosenId:2, matkul:"Machine Learning",         kelas:"TI-4B", hari:"Selasa", jamMulai:"08:00", jamSelesai:"09:40", ruangan:"R202" },
  { id:4, dosenId:2, matkul:"Kecerdasan Buatan",        kelas:"TI-3A", hari:"Kamis",  jamMulai:"13:00", jamSelesai:"14:40", ruangan:"R101" },
  { id:5, dosenId:3, matkul:"Algoritma & Pemrograman",  kelas:"TI-2A", hari:"Senin",  jamMulai:"10:00", jamSelesai:"11:40", ruangan:"R102" },
  { id:6, dosenId:3, matkul:"Struktur Data",            kelas:"TI-2B", hari:"Rabu",   jamMulai:"08:00", jamSelesai:"09:40", ruangan:"R103" },
  { id:7, dosenId:4, matkul:"Jaringan Komputer",        kelas:"TI-3C", hari:"Jumat",  jamMulai:"08:00", jamSelesai:"09:40", ruangan:"R201" },
  { id:8, dosenId:5, matkul:"Sistem Operasi",           kelas:"TI-2C", hari:"Selasa", jamMulai:"13:00", jamSelesai:"14:40", ruangan:"R102" },
];
const DEMO_USERS: (CurrentUser & { password: string })[] = [
  { role:"admin",     id:0, nama:"Admin Akademik",  initials:"AA", subtitle:"Administrator",     password:"admin" },
  { role:"dosen",     id:1, nama:"Dr. Sari Dewi",   initials:"SD", subtitle:"Dosen / Pembimbing", password:"dosen" },
  { role:"mahasiswa", id:1, nama:"Andi Pratama",    initials:"AP", subtitle:"Mahasiswa · 2021001", password:"mhs" },
];

const SAMPLE_JADWAL_MHS: JadwalKuliahMhs[] = [
  { id:1, nim:"2021001", matkul:"Kecerdasan Buatan",       kelas:"TI-4A", hari:"Senin",  jamMulai:"08:00", jamSelesai:"09:40", ruangan:"R202", dosen:"Dr. Ahmad Fauzi" },
  { id:2, nim:"2021001", matkul:"Pemrograman Web",          kelas:"TI-4A", hari:"Senin",  jamMulai:"10:00", jamSelesai:"11:40", ruangan:"Lab 1", dosen:"Dr. Sari Dewi" },
  { id:3, nim:"2021001", matkul:"Rekayasa Perangkat Lunak", kelas:"TI-4A", hari:"Selasa", jamMulai:"08:00", jamSelesai:"09:40", ruangan:"R101", dosen:"Dr. Cahya Putri" },
  { id:4, nim:"2021001", matkul:"Basis Data Lanjut",        kelas:"TI-4A", hari:"Rabu",   jamMulai:"10:00", jamSelesai:"11:40", ruangan:"R201", dosen:"Dr. Sari Dewi" },
  { id:5, nim:"2021001", matkul:"Jaringan Komputer",        kelas:"TI-4A", hari:"Kamis",  jamMulai:"13:00", jamSelesai:"14:40", ruangan:"R103", dosen:"Dr. Eko Prasetyo" },
  { id:6, nim:"2021001", matkul:"Sistem Operasi",           kelas:"TI-4A", hari:"Jumat",  jamMulai:"08:00", jamSelesai:"09:40", ruangan:"R102", dosen:"Dr. Budi Santoso" },
];
const EMPTY_JADWAL_MHS: Omit<JadwalKuliahMhs,"id"|"nim"> = { matkul:"", kelas:"", hari:"Senin", jamMulai:"08:00", jamSelesai:"09:40", ruangan:"", dosen:"" };

const HARI_OPTIONS = ["Senin","Selasa","Rabu","Kamis","Jumat"];
const EMPTY_JADWAL: Omit<JadwalDosen,"id"> = { dosenId:0, matkul:"", kelas:"", hari:"Senin", jamMulai:"08:00", jamSelesai:"09:40", ruangan:"" };
const EMPTY_DOSEN: Omit<Dosen,"id"> = { nip:"", nama:"", gelar:"", email:"", bidang:"", status:"Aktif" };

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  dashboard:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>,
  plus:         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  data:         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  calendar:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  history:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  room:         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
  settings:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></svg>,
  logout:       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  check:        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>,
  warning:      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  excel:        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  print:        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>,
  refresh:      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  save:         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>,
  chevronRight: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>,
  teacher:      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>,
  trash:        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  edit2:        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  filter:       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>,
  users:        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  mail:         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  menu:         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  close:        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  dna:          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 3c.621 4.5 4.5 6 4.5 9s-3.879 4.5-4.5 9M19.5 3c-.621 4.5-4.5 6-4.5 9s3.879 4.5 4.5 9M9 6h6M8 12h8M9 18h6"/></svg>,
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function getNavItems(role: UserRole): { label: string; page: Page; icon: React.ReactNode }[] {
  switch (role) {
    case "admin": return [
      { label:"Dashboard",       page:"dashboard",        icon:Icon.dashboard },
      { label:"Buat Jadwal",     page:"upload",           icon:Icon.plus },
      { label:"Data Seminar",    page:"preview",          icon:Icon.data },
      { label:"Jadwal",          page:"jadwal",           icon:Icon.calendar },
      { label:"Data Dosen",      page:"data-dosen",       icon:Icon.users },
      { label:"Jadwal Dosen",    page:"jadwal-dosen",     icon:Icon.teacher },
      { label:"Ruangan",         page:"rooms",            icon:Icon.room },
    ];
    case "dosen": return [
      { label:"Dashboard",       page:"dashboard",     icon:Icon.dashboard },
      { label:"Seminar Saya",    page:"dosen-seminar", icon:Icon.data },
      { label:"Blokir Waktu",    page:"dosen-blokir",  icon:Icon.calendar },
      { label:"Approve Jadwal",  page:"dosen-approve", icon:Icon.check },
    ];
    case "mahasiswa": return [
      { label:"Jadwal Seminar",  page:"mhs-jadwal",    icon:Icon.calendar },
      { label:"Jadwal Kuliah",   page:"mhs-kuliah",    icon:Icon.teacher },
    ];
    default: return [{ label:"Dashboard", page:"dashboard", icon:Icon.dashboard }];
  }
}

function SidebarContent({ current, currentUser, onNavigate }: { current: Page; currentUser: CurrentUser | null; onNavigate: (p: Page) => void }) {
  if (!currentUser) return null;
  const navItems = getNavItems(currentUser.role);
  return (
    <div className="flex flex-col h-full" style={{ background: "#0F172A" }}>
      <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#4338CA" }}>{Icon.dna}</div>
          <div>
            <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "DM Sans" }}>Seminar</div>
            <div className="text-xs font-medium" style={{ color: "#94A3B8" }}>Scheduler</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ label, page, icon }) => {
          const active = current === page || (page === "upload" && ["upload","preview","config","generate"].includes(current));
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
              style={{ background: active ? "rgba(67,56,202,0.35)" : "transparent", color: active ? "#C7D2FE" : "#94A3B8" }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "#E2E8F0"; }}}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#94A3B8"; }}}
            >
              <span style={{ color: active ? "#818CF8" : "inherit" }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ background: "#4338CA" }}>{currentUser.initials}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{currentUser.nama}</div>
            <div className="text-xs truncate" style={{ color: "#64748B" }}>{currentUser.subtitle}</div>
          </div>
        </div>
        <button
          onClick={() => onNavigate("login")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: "#64748B" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "#EF4444"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#64748B"; }}
        >
          {Icon.logout} Logout
        </button>
      </div>
    </div>
  );
}

// ─── Reusable primitives ──────────────────────────────────────────────────────
function Badge({ type, label }: { type: "success"|"warning"|"error"|"info"|"duplikat"; label: string }) {
  const s = { success:{bg:"#DCFCE7",color:"#166534"}, warning:{bg:"#FEF9C3",color:"#854D0E"}, error:{bg:"#FEE2E2",color:"#991B1B"}, info:{bg:"#DBEAFE",color:"#1E40AF"}, duplikat:{bg:"#FDE68A",color:"#92400E"} }[type];
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>{label}</span>;
}

function StatCard({ label, value, sub, color }: { label: string; value: string|number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border p-4 sm:p-5" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
      <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>{label}</div>
      <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: "DM Sans", color: color || "#0F172A" }}>{value}</div>
      {sub && <div className="text-xs" style={{ color: "#94A3B8" }}>{sub}</div>}
    </div>
  );
}

function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "DM Sans", color: "#0F172A" }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: "#64748B" }}>{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mb-8">
      {/* Mobile: compact dot stepper */}
      <div className="flex sm:hidden items-center justify-center gap-2 mb-3">
        {steps.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ background: i <= current ? "#4338CA" : "#E2E8F0", width: i === current ? 24 : 8 }} />
        ))}
      </div>
      <div className="hidden sm:block text-xs text-center font-medium mb-2" style={{ color: "#4338CA" }}>
        Langkah {current + 1} dari {steps.length}: {steps[current]}
      </div>
      {/* Desktop: full stepper */}
      <div className="hidden sm:flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{ background: i <= current ? "#4338CA" : "#E2E8F0", color: i <= current ? "#fff" : "#94A3B8" }}>
                {i < current ? Icon.check : i + 1}
              </div>
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: i === current ? "#4338CA" : i < current ? "#4338CA" : "#94A3B8" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px mx-3" style={{ background: i < current ? "#4338CA" : "#E2E8F0" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Scrollable table wrapper
function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border overflow-x-auto" style={{ background: "#fff", borderColor: "#E2E8F0" }}>{children}</div>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (user: CurrentUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doLogin = (usr: string, pwd: string) => {
    const found = DEMO_USERS.find(u => u.role === usr && u.password === pwd);
    if (!found) { setError("Username atau password salah"); return; }
    setError("");
    setLoading(true);
    const { password: _pw, ...user } = found;
    setTimeout(() => { setLoading(false); onLogin(user); }, 600);
  };

  const handleSubmit = () => doLogin(username, password);
  const quickLogin = (u: typeof DEMO_USERS[0]) => {
    const { password: _pw, ...user } = u;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(user); }, 400);
  };

  const roleAccent: Record<string, string> = { admin:"#4338CA", dosen:"#0891B2", mahasiswa:"#7C3AED" };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      <div className="hidden lg:flex w-[46%] flex-col justify-between p-12" style={{ background: "#0F172A" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#4338CA" }}>{Icon.dna}</div>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "DM Sans" }}>Seminar Scheduler</span>
        </div>
        <div>
          <blockquote className="text-3xl font-bold leading-tight mb-4" style={{ fontFamily: "DM Sans", color: "#E2E8F0" }}>
            Penjadwalan seminar yang cerdas, otomatis, dan bebas konflik.
          </blockquote>
          <p className="text-sm" style={{ color: "#64748B" }}>Didukung Genetic Algorithm untuk menghasilkan jadwal optimal dalam hitungan detik.</p>
          <div className="flex gap-6 mt-10">
            {[["25+","Seminar/Periode"],["99%","Akurasi Jadwal"],["< 5s","Waktu Generate"]].map(([v,l]) => (
              <div key={l}><div className="text-2xl font-bold text-white" style={{ fontFamily: "DM Sans" }}>{v}</div><div className="text-xs" style={{ color: "#475569" }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div className="text-xs" style={{ color: "#334155" }}>© 2025 Seminar Scheduler · Sistem Akademik Terintegrasi</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#4338CA" }}>{Icon.dna}</div>
            <span className="font-bold text-base" style={{ fontFamily: "DM Sans" }}>Seminar Scheduler</span>
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "DM Sans" }}>Selamat datang</h2>
          <p className="text-sm mb-8" style={{ color: "#64748B" }}>Masuk dengan akun Anda</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Username / Role</label>
              <input value={username} onChange={e => { setUsername(e.target.value); setError(""); }} placeholder="admin / dosen / mhs"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all" style={{ borderColor: error ? "#FCA5A5" : "#E2E8F0", background: "#fff" }}
                onFocus={e => e.target.style.borderColor = "#4338CA"} onBlur={e => e.target.style.borderColor = error ? "#FCA5A5" : "#E2E8F0"}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Password</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all" style={{ borderColor: error ? "#FCA5A5" : "#E2E8F0", background: "#fff" }}
                onFocus={e => e.target.style.borderColor = "#4338CA"} onBlur={e => e.target.style.borderColor = error ? "#FCA5A5" : "#E2E8F0"}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            {error && <p className="text-xs font-medium" style={{ color: "#DC2626" }}>{error}</p>}
            <button onClick={handleSubmit} disabled={loading} className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all mt-1"
              style={{ background: loading ? "#6366F1" : "#4338CA" }}>
              {loading ? "Masuk..." : "Login"}
            </button>
          </div>

          {/* Demo Akun section */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
              <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>Demo Akun</span>
              <div className="flex-1 h-px" style={{ background: "#E2E8F0" }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map(u => (
                <button key={u.role} onClick={() => quickLogin(u)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all"
                  style={{ borderColor: "#E2E8F0", background: "#fff" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = roleAccent[u.role]; (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: roleAccent[u.role] }}>{u.initials}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: "#0F172A" }}>{u.nama}</div>
                    <div className="text-xs truncate" style={{ color: "#94A3B8" }}>{u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ currentUser, history, onNavigate }: { currentUser: CurrentUser; history: HistoryItem[]; onNavigate: (p: Page) => void }) {
  // Dosen dashboard
  if (currentUser.role === "dosen") {
    const mySchedule = SAMPLE_SCHEDULE.filter(s =>
      s.approvals.some(a => a.nama.includes("Sari Dewi"))
    );
    return (
      <div>
        <PageHeader title={`Selamat datang, ${currentUser.nama}`} subtitle="Panel dosen — seminar dan jadwal mengajar Anda" />
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <StatCard label="Seminar Pembimbing" value={String(mySchedule.filter(s=>s.approvals.some(a=>a.nama.includes("Sari Dewi")&&a.role.startsWith("Pembimbing"))).length)} color="#0891B2" />
          <StatCard label="Seminar Penguji" value={String(mySchedule.filter(s=>s.approvals.some(a=>a.nama.includes("Sari Dewi")&&a.role.startsWith("Penguji"))).length)} color="#0891B2" />
          <StatCard label="Perlu Disetujui" value={String(mySchedule.filter(s=>s.approvals.some(a=>a.nama.includes("Sari Dewi")&&a.status==="pending")).length)} color="#D97706" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 rounded-xl border" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="px-4 py-4 border-b flex items-center justify-between" style={{ borderColor:"#E2E8F0" }}>
              <h3 className="font-semibold text-sm" style={{ fontFamily:"DM Sans" }}>Seminar Terlibat</h3>
              <button className="text-xs font-medium" style={{ color:"#0891B2" }} onClick={() => onNavigate("dosen-seminar")}>Lihat semua →</button>
            </div>
            <div className="divide-y" style={{ borderColor:"#F8FAFC" }}>
              {mySchedule.slice(0,4).map((s,i) => (
                <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm">{s.mahasiswa}</div>
                    <div className="text-xs mt-0.5" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{s.tanggal} · {s.jam} · {s.ruangan}</div>
                  </div>
                  <Badge type={s.jenis === "Sempro" ? "info" : "success"} label={s.jenis} />
                </div>
              ))}
              {mySchedule.length === 0 && <p className="px-4 py-6 text-sm text-center" style={{ color:"#94A3B8" }}>Belum ada seminar</p>}
            </div>
          </div>
          <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-3" style={{ fontFamily:"DM Sans" }}>Aksi Cepat</h3>
            <div className="flex flex-col gap-2">
              {([{label:"Seminar Saya",page:"dosen-seminar"},{label:"Blokir Waktu",page:"dosen-blokir"},{label:"Approve Jadwal",page:"dosen-approve"}] as {label:string;page:Page}[]).map(({label,page}) => (
                <button key={page} onClick={() => onNavigate(page)} className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all"
                  style={{ background:"#F0F9FF", color:"#0891B2" }}
                  onMouseEnter={e => (e.currentTarget.style.background="#E0F2FE")}
                  onMouseLeave={e => (e.currentTarget.style.background="#F0F9FF")}>
                  {label}{Icon.chevronRight}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mahasiswa → no separate dashboard, already redirected to mhs-jadwal at login
  if (currentUser.role === "mahasiswa") {
    onNavigate("mhs-jadwal");
    return null;
  }

  // Admin dashboard (default)
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Ringkasan aktivitas penjadwalan seminar">
        <button onClick={() => onNavigate("upload")} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
          style={{ background: "#4338CA" }} onMouseEnter={e => (e.currentTarget.style.background="#3730A3")} onMouseLeave={e => (e.currentTarget.style.background="#4338CA")}>
          {Icon.plus} Buat Penjadwalan
        </button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Seminar" value="43" sub="Semester Ganjil 2025" />
        <StatCard label="Sempro" value="24" sub="Proposal" color="#4338CA" />
        <StatCard label="Semhas" value="19" sub="Hasil" color="#0891B2" />
        <StatCard label="Ruangan Aktif" value="4" sub="R101–R104" color="#059669" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 rounded-xl border" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
          <div className="px-4 sm:px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
            <h3 className="font-semibold text-sm" style={{ fontFamily: "DM Sans" }}>Jadwal Terbaru</h3>
            <button className="text-xs font-medium" style={{ color: "#4338CA" }} onClick={() => onNavigate("results")}>Lihat semua →</button>
          </div>
          {/* Mobile: card list */}
          <div className="sm:hidden divide-y" style={{ borderColor: "#F8FAFC" }}>
            {SAMPLE_SCHEDULE.slice(0,4).map((s,i) => (
              <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-sm">{s.mahasiswa}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#94A3B8", fontFamily: "JetBrains Mono" }}>{s.tanggal} · {s.jam}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium mr-1" style={{ background: "#EEF2FF", color: "#4338CA" }}>{s.ruangan}</span>
                  </div>
                </div>
                <Badge type={s.jenis === "Sempro" ? "info" : "success"} label={s.jenis} />
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom:"1px solid #F1F5F9" }}>
                {["Tanggal","Jam","Ruangan","Mahasiswa","Jenis"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color: "#94A3B8" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {SAMPLE_SCHEDULE.slice(0,4).map((s,i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}
                    onMouseEnter={e => (e.currentTarget.style.background="#FAFAFA")}
                    onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                    <td className="px-5 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{s.tanggal}</td>
                    <td className="px-5 py-3 text-xs" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{s.jam}</td>
                    <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background:"#EEF2FF", color:"#4338CA" }}>{s.ruangan}</span></td>
                    <td className="px-5 py-3 text-xs font-medium">{s.mahasiswa}</td>
                    <td className="px-5 py-3"><Badge type={s.jenis === "Sempro" ? "info" : "success"} label={s.jenis} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border p-4 sm:p-5" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "DM Sans" }}>Status Penjadwalan</h3>
            <div className="flex flex-col gap-2.5">
              {[{label:"Periode Sep 2025",status:"Tersimpan" as const,score:"98.4%"},{label:"Periode Agu 2025",status:"Tersimpan" as const,score:"94.7%"},{label:"Periode Agu 2025 (2)",status:"Draft" as const,score:"91.2%"}].map((item,i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "#F1F5F9" }}>
                  <div><div className="text-xs font-medium">{item.label}</div><div className="text-xs mt-0.5" style={{ color:"#94A3B8" }}>Fitness: {item.score}</div></div>
                  <Badge type={item.status === "Tersimpan" ? "success" : "warning"} label={item.status} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-4 sm:p-5" style={{ background: "#fff", borderColor: "#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "DM Sans" }}>Aksi Cepat</h3>
            <div className="flex flex-col gap-2">
              {[{label:"Upload Data SPS",page:"upload" as Page},{label:"Lihat Jadwal",page:"jadwal" as Page},{label:"Kelola Ruangan",page:"rooms" as Page}].map(({label,page}) => (
                <button key={page} onClick={() => onNavigate(page)} className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all"
                  style={{ background:"#F8FAFC", color:"#374151" }}
                  onMouseEnter={e => (e.currentTarget.style.background="#EEF2FF")}
                  onMouseLeave={e => (e.currentTarget.style.background="#F8FAFC")}>
                  {label}{Icon.chevronRight}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UPLOAD SPS ───────────────────────────────────────────────────────────────
interface UploadPageProps { seminarType: SeminarType|null; setSeminarType: React.Dispatch<React.SetStateAction<SeminarType|null>>; onNext:()=>void; }
function UploadPage({ seminarType, setSeminarType, onNext }: UploadPageProps) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<string|null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const simulate = () => { setUploading(true); setTimeout(() => { setUploading(false); setDone(true); }, 1500); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); setFile("Data_SPS.xlsx"); simulate(); };
  const handleClick = () => { setFile("Data_SPS.xlsx"); simulate(); };

  return (
    <div>
      <Stepper steps={["Upload SPS","Preview & Validasi","Konfigurasi","Generate"]} current={0} />
      <PageHeader title="Buat Penjadwalan Baru" subtitle="Pilih jenis seminar lalu unggah file SPS untuk memulai" />

      {/* Step 1: pilih jenis seminar */}
      <div className="rounded-xl border p-4 sm:p-5 mb-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background:"#4338CA" }}>1</span>
          <h3 className="font-semibold text-sm" style={{ fontFamily:"DM Sans" }}>Pilih Jenis Seminar</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            { type:"Sempro" as SeminarType, label:"Seminar Proposal", sub:"Durasi 60 menit per sesi", color:"#4338CA", bg:"#EEF2FF", border:"#C7D2FE", dotBg:"#DBEAFE" },
            { type:"Semhas" as SeminarType, label:"Seminar Hasil", sub:"Durasi 120 menit per sesi", color:"#059669", bg:"#ECFDF5", border:"#A7F3D0", dotBg:"#D1FAE5" },
          ]).map(opt=>{
            const sel = seminarType===opt.type;
            return (
              <button key={opt.type} onClick={()=>setSeminarType(opt.type)}
                className="flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
                style={{ borderColor:sel?opt.color:"#E2E8F0", background:sel?opt.bg:"#FAFAFA" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:opt.dotBg }}>
                  <svg className="w-5 h-5" fill="none" stroke={opt.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color:sel?opt.color:"#374151", fontFamily:"DM Sans" }}>{opt.type} — {opt.label}</div>
                  <div className="text-xs mt-0.5" style={{ color:sel?opt.color:"#94A3B8" }}>{opt.sub}</div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor:sel?opt.color:"#CBD5E1", background:sel?opt.color:"transparent" }}>
                  {sel && <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: upload file */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: seminarType?"#4338CA":"#CBD5E1" }}>2</span>
        <h3 className="font-semibold text-sm" style={{ fontFamily:"DM Sans", color: seminarType?"#0F172A":"#94A3B8" }}>Upload File SPS {seminarType?`— ${seminarType}`:""}</h3>
      </div>
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 transition-all ${!seminarType?"opacity-50 pointer-events-none":""}`}>
        <div className="lg:col-span-2">
          <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop}
            onClick={!file?handleClick:undefined}
            className="rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center py-12 sm:py-16"
            style={{ borderColor:dragging?"#4338CA":done?"#059669":"#CBD5E1", background:dragging?"#EEF2FF":done?"#F0FDF4":"#FAFAFA" }}>
            {!file && !uploading && (<>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background:"#EEF2FF" }}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#4338CA" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <p className="font-semibold text-sm mb-1 text-center" style={{ fontFamily:"DM Sans" }}>Drag & drop file Excel di sini</p>
              <p className="text-xs mb-4" style={{ color:"#94A3B8" }}>atau klik untuk memilih file</p>
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background:"#EEF2FF", color:"#4338CA" }}>.xlsx, .xls — maks. 10 MB</span>
            </>)}
            {uploading && (<div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor:"#4338CA", borderTopColor:"transparent" }} />
              <p className="text-sm font-medium" style={{ color:"#4338CA" }}>Memproses file...</p>
            </div>)}
            {done && !uploading && (<>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background:"#DCFCE7" }}>
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#059669" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <p className="font-semibold text-sm mb-1 text-green-700 text-center px-4" style={{ fontFamily:"DM Sans" }}>{file}</p>
              <p className="text-xs mb-2" style={{ color:"#059669" }}>8 baris data terdeteksi · 48 KB</p>
              <button onClick={e=>{e.stopPropagation();setFile(null);setDone(false);}} className="text-xs underline" style={{ color:"#94A3B8" }}>Ganti file</button>
            </>)}
          </div>
          {done && (
            <button onClick={onNext} className="mt-4 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
              style={{ background:"#4338CA" }} onMouseEnter={e=>(e.currentTarget.style.background="#3730A3")} onMouseLeave={e=>(e.currentTarget.style.background="#4338CA")}>
              Lanjutkan ke Preview & Validasi →
            </button>
          )}
        </div>
        <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          <h3 className="font-semibold text-sm mb-3" style={{ fontFamily:"DM Sans" }}>Format Data SPS</h3>
          <p className="text-xs mb-3" style={{ color:"#64748B" }}>Pastikan file Excel memiliki kolom berikut:</p>
          <div className="flex flex-col gap-2">
            {["NIM","Nama Mahasiswa","Judul","Dosen Pembimbing"].map((col,i) => (
              <div key={col} className="flex items-center gap-2.5 text-xs">
                <span className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0" style={{ background:"#4338CA", fontSize:10 }}>{i+1}</span>
                <span style={{ color:"#374151" }}>{col}</span>
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2.5 text-xs px-2 py-1.5 rounded-lg" style={{ background:"#EEF2FF" }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#4338CA" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span style={{ color:"#4338CA" }}>Penguji dipilih manual di langkah berikutnya</span>
            </div>
          </div>
          <button className="mt-4 w-full py-2 rounded-lg text-xs font-medium transition-all" style={{ background:"#F8FAFC", color:"#4338CA", border:"1px solid #E2E8F0" }}>
            Download Template Excel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PREVIEW & VALIDASI ───────────────────────────────────────────────────────
interface PreviewPageProps {
  dosens: Dosen[];
  seminars: SeminarData[];
  setSeminars: React.Dispatch<React.SetStateAction<SeminarData[]>>;
  seminarType: SeminarType|null;
  onNext: ()=>void;
  onBack: ()=>void;
}
function PreviewPage({ dosens, seminars, setSeminars, seminarType, onNext, onBack }: PreviewPageProps) {
  const [editingId, setEditingId] = useState<number|null>(null);
  const valid = seminars.filter(s=>s.status==="valid").length;
  const invalid = seminars.filter(s=>s.status==="invalid").length;
  const duplikat = seminars.filter(s=>s.status==="duplikat").length;
  const setPenguji = (id: number, field: "penguji1"|"penguji2", val: string) =>
    setSeminars(ss=>ss.map(s=>s.id===id?{...s,[field]:val}:s));
  const dosenOptions = dosens.filter(d=>d.status==="Aktif");

  return (
    <div>
      <Stepper steps={["Upload SPS","Preview & Validasi","Konfigurasi","Generate"]} current={1} />
      <PageHeader title="Preview & Validasi Data" subtitle={`Data ${seminarType??""} — periksa dan tetapkan penguji sebelum melanjutkan`}>
        {seminarType && (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold" style={{
            background: seminarType==="Sempro"?"#EEF2FF":"#ECFDF5",
            color: seminarType==="Sempro"?"#4338CA":"#059669",
          }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {seminarType==="Sempro"?"60 menit":"120 menit"}/sesi
          </span>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard label="Total Data" value={seminars.length} />
        <StatCard label="Valid" value={valid} color="#059669" />
        <StatCard label="Invalid" value={invalid} color="#DC2626" />
        <StatCard label="Duplikat" value={duplikat} color="#D97706" />
      </div>

      {(invalid > 0 || duplikat > 0) && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-5" style={{ background:"#FEF9C3", border:"1px solid #FDE047" }}>
          <span style={{ color:"#854D0E" }}>{Icon.warning}</span>
          <div>
            <p className="text-sm font-medium" style={{ color:"#854D0E" }}>Ditemukan {invalid} data invalid dan {duplikat} data duplikat</p>
            <p className="text-xs mt-0.5" style={{ color:"#A16207" }}>Perbaiki data tersebut sebelum melanjutkan atau hapus data bermasalah.</p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 p-4 rounded-xl mb-5" style={{ background:"#EEF2FF", border:"1px solid #C7D2FE" }}>
        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="#4338CA" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p className="text-xs" style={{ color:"#3730A3" }}>Pilih <strong>Penguji 1 dan Penguji 2</strong> secara manual untuk setiap mahasiswa. Penguji tidak boleh sama dengan pembimbing. Klik dropdown di kolom Penguji untuk memilih.</p>
      </div>

      {/* Mobile: card list */}
      <div className="sm:hidden flex flex-col gap-3 mb-5">
        {seminars.map(s => (
          <div key={s.id} className="rounded-xl border p-4" style={{ background:s.status==="invalid"?"#FFF5F5":s.status==="duplikat"?"#FFFBEB":"#fff", borderColor:"#E2E8F0" }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-sm">{s.nama}</div>
                <div className="text-xs mt-0.5" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{s.nim}</div>
              </div>
              <div className="flex gap-1.5">
                <Badge type={s.jenis==="Sempro"?"info":"success"} label={s.jenis} />
                {s.status==="valid" && <Badge type="success" label="Valid" />}
                {s.status==="invalid" && <Badge type="error" label="Invalid" />}
                {s.status==="duplikat" && <Badge type="duplikat" label="Duplikat" />}
              </div>
            </div>
            <div className="text-xs mb-2" style={{ color:"#64748B" }}>
              <span className="font-medium">Pembimbing:</span> {s.pembimbing}
            </div>
            <div className="flex flex-col gap-1.5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color:"#374151" }}>Penguji 1</label>
                <select value={s.penguji1} onChange={e=>setPenguji(s.id,"penguji1",e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border text-xs outline-none" style={{ borderColor:"#E2E8F0" }}>
                  <option value="">— Pilih Penguji 1 —</option>
                  {dosenOptions.map(d=><option key={d.id} value={`${d.nama}, ${d.gelar}`}>{d.nama}, {d.gelar}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color:"#374151" }}>Penguji 2</label>
                <select value={s.penguji2} onChange={e=>setPenguji(s.id,"penguji2",e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border text-xs outline-none" style={{ borderColor:"#E2E8F0" }}>
                  <option value="">— Pilih Penguji 2 —</option>
                  {dosenOptions.map(d=><option key={d.id} value={`${d.nama}, ${d.gelar}`}>{d.nama}, {d.gelar}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <TableWrap>
        <table className="hidden sm:table w-full text-sm min-w-[860px]">
          <thead style={{ background:"#F8FAFC" }}>
            <tr>{["No","NIM","Nama Mahasiswa","Jenis","Pembimbing","Penguji 1","Penguji 2","Status"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {seminars.map((s,i) => (
              <tr key={s.id} style={{ borderBottom:"1px solid #F8FAFC", background:s.status!=="valid"?(s.status==="invalid"?"#FFF5F5":"#FFFBEB"):undefined }}>
                <td className="px-4 py-3 text-xs" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{i+1}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono" }}>{s.nim}</td>
                <td className="px-4 py-3 text-xs font-medium">{s.nama}</td>
                <td className="px-4 py-3"><Badge type={s.jenis==="Sempro"?"info":"success"} label={s.jenis} /></td>
                <td className="px-4 py-3 text-xs" style={{ color:"#64748B" }}>{s.pembimbing}</td>
                <td className="px-4 py-2">
                  <select value={s.penguji1} onChange={e=>setPenguji(s.id,"penguji1",e.target.value)}
                    className="px-2 py-1.5 rounded-lg border text-xs outline-none w-full min-w-[150px]"
                    style={{ borderColor: s.penguji1?"#E2E8F0":"#FCA5A5", background: s.penguji1?"#fff":"#FFF5F5" }}>
                    <option value="">— Pilih —</option>
                    {dosenOptions.map(d=><option key={d.id} value={`${d.nama}, ${d.gelar}`}>{d.nama}, {d.gelar}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select value={s.penguji2} onChange={e=>setPenguji(s.id,"penguji2",e.target.value)}
                    className="px-2 py-1.5 rounded-lg border text-xs outline-none w-full min-w-[150px]"
                    style={{ borderColor: s.penguji2?"#E2E8F0":"#FCA5A5", background: s.penguji2?"#fff":"#FFF5F5" }}>
                    <option value="">— Pilih —</option>
                    {dosenOptions.map(d=><option key={d.id} value={`${d.nama}, ${d.gelar}`}>{d.nama}, {d.gelar}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {s.status==="valid" && <Badge type="success" label="Valid" />}
                  {s.status==="invalid" && <Badge type="error" label="Invalid" />}
                  {s.status==="duplikat" && <Badge type="duplikat" label="Duplikat" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <div className="flex items-center justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>← Kembali</button>
        <button onClick={onNext} className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background:"#4338CA" }}>Lanjutkan →</button>
      </div>
    </div>
  );
}

// ─── KONFIGURASI ──────────────────────────────────────────────────────────────
interface ConfigPageProps { seminarType: SeminarType|null; namaJadwal: string; setNamaJadwal:(v:string)=>void; onNext:()=>void; onBack:()=>void; }
function ConfigPage({ seminarType, namaJadwal, setNamaJadwal, onNext, onBack }: ConfigPageProps) {
  const [days, setDays] = useState({senin:true,selasa:true,rabu:true,kamis:true,jumat:false});
  const [rooms, setRooms] = useState({R101:true,R102:true,R103:true,R104:false});
  const [startDate, setStartDate] = useState("2025-09-01");
  const [endDate, setEndDate] = useState("2025-09-05");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [gap, setGap] = useState("10");

  const activeDays = Object.values(days).filter(Boolean).length;
  const activeRooms = Object.values(rooms).filter(Boolean).length;
  // Sempro=60 min, Semhas=120 min — use smaller slot unit so both fit
  const slotsPerDay = Math.floor((16*60-8*60)/(60+parseInt(gap)));
  const totalSlots = activeDays*activeRooms*slotsPerDay*5;
  const enough = totalSlots >= 6;

  const inp = "w-full px-3 py-2 rounded-lg border text-sm outline-none";
  const inpS = { borderColor:"#E2E8F0" };
  const fo = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor="#4338CA";
  const bl = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor="#E2E8F0";

  return (
    <div>
      <Stepper steps={["Upload SPS","Preview & Validasi","Konfigurasi","Generate"]} current={2} />
      <PageHeader title="Pengaturan Penjadwalan" subtitle="Konfigurasi parameter untuk proses generate jadwal">
        {seminarType && (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold" style={{
            background: seminarType==="Sempro"?"#EEF2FF":"#ECFDF5",
            color: seminarType==="Sempro"?"#4338CA":"#059669",
          }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            {seminarType} — {seminarType==="Sempro"?"60 menit":"120 menit"}/sesi
          </span>
        )}
      </PageHeader>

      {/* Nama jadwal */}
      <div className="rounded-xl border p-4 sm:p-5 mb-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
        <h3 className="font-semibold text-sm mb-3" style={{ fontFamily:"DM Sans" }}>Nama Jadwal</h3>
        <input value={namaJadwal} onChange={e=>setNamaJadwal(e.target.value)}
          placeholder={`cth. Jadwal ${seminarType??"Seminar"} Ganjil 2025/2026`}
          className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
          style={{ borderColor:"#E2E8F0" }}
          onFocus={e=>e.target.style.borderColor="#4338CA"}
          onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
        <p className="text-xs mt-1.5" style={{ color:"#94A3B8" }}>Nama ini akan muncul di daftar jadwal setelah generate selesai.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
          <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily:"DM Sans" }}>Periode Penjadwalan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Tanggal Mulai</label>
                <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className={inp} style={inpS} onFocus={fo} onBlur={bl} /></div>
              <div><label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Tanggal Selesai</label>
                <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className={inp} style={inpS} onFocus={fo} onBlur={bl} /></div>
            </div>
          </div>

          <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily:"DM Sans" }}>Hari Pelaksanaan</h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {(Object.keys(days) as (keyof typeof days)[]).map(day => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={days[day]} onChange={e=>setDays(d=>({...d,[day]:e.target.checked}))} style={{ accentColor:"#4338CA", width:16, height:16 }} />
                  <span className="text-sm capitalize" style={{ color:"#374151" }}>{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily:"DM Sans" }}>Waktu Pelaksanaan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Jam Mulai</label>
                <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} className={inp} style={inpS} /></div>
              <div><label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Jam Selesai</label>
                <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} className={inp} style={inpS} /></div>
              <div><label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Jeda Antar Seminar (menit)</label>
                <input type="number" value={gap} onChange={e=>setGap(e.target.value)} className={inp} style={inpS} min="0" max="60" /></div>
              <div className="flex flex-col justify-end">
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Durasi per Sesi</label>
                <div className="px-3 py-2 rounded-lg border text-sm font-semibold" style={{
                  borderColor: seminarType==="Sempro"?"#C7D2FE":seminarType==="Semhas"?"#A7F3D0":"#E2E8F0",
                  background: seminarType==="Sempro"?"#EEF2FF":seminarType==="Semhas"?"#ECFDF5":"#F8FAFC",
                  color: seminarType==="Sempro"?"#4338CA":seminarType==="Semhas"?"#059669":"#94A3B8",
                  fontFamily:"JetBrains Mono",
                }}>
                  {seminarType==="Sempro"?"60 menit":seminarType==="Semhas"?"120 menit":"— pilih tipe"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily:"DM Sans" }}>Ruangan</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(Object.keys(rooms) as (keyof typeof rooms)[]).map(room => (
                <label key={room} className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all"
                  style={{ borderColor:rooms[room]?"#4338CA":"#E2E8F0", background:rooms[room]?"#EEF2FF":"#F8FAFC" }}>
                  <input type="checkbox" checked={rooms[room]} onChange={e=>setRooms(r=>({...r,[room]:e.target.checked}))} style={{ accentColor:"#4338CA", width:14, height:14 }} />
                  <span className="text-sm font-medium" style={{ color:rooms[room]?"#4338CA":"#374151" }}>{room}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily:"DM Sans" }}>Ringkasan</h3>
            <div className="flex flex-col gap-3">
              {[{label:"Total Seminar",value:"6"},{label:"Ruangan Aktif",value:`${activeRooms} ruangan`},{label:"Hari Aktif",value:`${activeDays} hari/minggu`},{label:"Slot/Hari/Ruangan",value:`${slotsPerDay} slot`},{label:"Total Slot",value:totalSlots.toString()}].map(({label,value})=>(
                <div key={label} className="flex items-center justify-between text-sm">
                  <span style={{ color:"#64748B" }}>{label}</span>
                  <span className="font-semibold" style={{ fontFamily:"JetBrains Mono", fontSize:13 }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor:"#F1F5F9" }}>
              <div className={`flex items-center gap-2 p-3 rounded-lg ${enough?"bg-green-50":"bg-red-50"}`}>
                <span style={{ color:enough?"#059669":"#DC2626" }}>{enough?Icon.check:Icon.warning}</span>
                <span className="text-xs font-medium" style={{ color:enough?"#059669":"#DC2626" }}>Kapasitas {enough?"mencukupi":"tidak mencukupi"}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-semibold text-sm mb-1" style={{ fontFamily:"DM Sans" }}>Parameter Algoritma</h3>
            <p className="text-xs mb-3" style={{ color:"#94A3B8" }}>Genetic Algorithm</p>
            <div className="flex flex-col gap-3">
              {[{label:"Populasi",value:"100"},{label:"Generasi",value:"500"},{label:"Crossover Rate",value:"0.8"},{label:"Mutation Rate",value:"0.1"}].map(({label,value})=>(
                <div key={label} className="flex items-center justify-between text-xs">
                  <span style={{ color:"#64748B" }}>{label}</span>
                  <span className="font-medium px-2 py-0.5 rounded" style={{ fontFamily:"JetBrains Mono", background:"#F1F5F9", color:"#334155" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <button onClick={onBack} className="px-5 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>← Kembali</button>
        <button onClick={onNext} className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background:"#4338CA" }}>Lanjutkan ke Generate →</button>
      </div>
    </div>
  );
}

// ─── GENERATE ─────────────────────────────────────────────────────────────────
function GeneratePage({ namaJadwal, onDone }: { namaJadwal:string; onDone:()=>void }) {
  const [phase, setPhase] = useState<"confirm"|"running"|"done">("confirm");
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const gaSteps = [
    {label:"Preparing Data",desc:"Memuat dan memvalidasi data seminar..."},
    {label:"Generate Population",desc:"Membuat 100 kromosom populasi awal..."},
    {label:"Fitness Evaluation",desc:"Menghitung nilai fitness setiap kromosom..."},
    {label:"Selection",desc:"Tournament selection — memilih kromosom terbaik..."},
    {label:"Crossover",desc:"Single-point crossover pada pasangan kromosom..."},
    {label:"Mutation",desc:"Menerapkan mutasi acak untuk diversitas..."},
    {label:"Optimization Complete",desc:"Solusi optimal ditemukan! Fitness: 98.4"},
  ];
  useEffect(() => {
    if (phase !== "running") return;
    if (step >= gaSteps.length) { setPhase("done"); return; }
    const t1 = setTimeout(() => setStep(s=>s+1), 600);
    const t2 = setInterval(() => setProgress(p=>Math.min(p+2,100)), 40);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, [phase, step]);

  if (phase === "confirm") return (
    <div>
      <Stepper steps={["Upload SPS","Preview & Validasi","Konfigurasi","Generate"]} current={3} />
      <div className="max-w-lg mx-auto text-center pt-4 sm:pt-8 px-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background:"#EEF2FF" }}>
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="#4338CA" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontFamily:"DM Sans" }}>Siap Generate Jadwal?</h2>
        <p className="text-sm mb-6 sm:mb-8" style={{ color:"#64748B" }}>Sistem akan menjalankan Genetic Algorithm untuk menghasilkan jadwal seminar yang optimal dan bebas konflik.</p>
        <div className="rounded-xl border p-4 sm:p-5 text-left mb-6 sm:mb-8" style={{ borderColor:"#E2E8F0", background:"#F8FAFC" }}>
          {[["Total Seminar","6"],["Periode","1 – 5 September 2025"],["Ruangan","3 (R101, R102, R103)"],["Slot Tersedia","60 slot"],["Algoritma","Genetic Algorithm"],["Estimasi Waktu","< 5 detik"]].map(([k,v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor:"#E2E8F0" }}>
              <span className="text-sm" style={{ color:"#64748B" }}>{k}</span>
              <span className="text-sm font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 rounded-xl px-4 py-3 mb-5 text-xs text-left" style={{ background:"#EEF2FF", color:"#4338CA" }}>
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Hard constraint GA: jadwal mengajar dosen, blokir waktu dosen, dan <strong>jadwal kuliah mahasiswa</strong> — seminar tidak akan bentrok dengan ketiganya.</span>
        </div>
        <button onClick={()=>{setPhase("running");setStep(0);setProgress(0);}} className="w-full py-4 rounded-xl text-white text-base font-bold transition-all"
          style={{ background:"linear-gradient(135deg,#4338CA,#6366F1)" }}>
          ⚡ GENERATE JADWAL
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Stepper steps={["Upload SPS","Preview & Validasi","Konfigurasi","Generate"]} current={3} />
      <div className="max-w-lg mx-auto pt-4 sm:pt-8 px-2">
        <div className="text-center mb-6 sm:mb-8">
          {phase === "running" ? (<>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor:"#4338CA", borderTopColor:"transparent" }} />
            <h2 className="text-lg sm:text-xl font-bold" style={{ fontFamily:"DM Sans" }}>Menjalankan Genetic Algorithm</h2>
            <p className="text-sm mt-1" style={{ color:"#64748B" }}>Mohon tunggu, proses sedang berjalan...</p>
          </>) : (<>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:"#DCFCE7" }}>
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="#059669" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold" style={{ fontFamily:"DM Sans", color:"#059669" }}>Optimization Complete!</h2>
            <p className="text-sm mt-1" style={{ color:"#64748B" }}>Jadwal optimal berhasil dihasilkan</p>
          </>)}
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1.5" style={{ color:"#94A3B8" }}>
            <span>Progress</span><span style={{ fontFamily:"JetBrains Mono" }}>{Math.min(progress,100)}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background:"#E2E8F0" }}>
            <div className="h-full rounded-full transition-all" style={{ width:`${Math.min(progress,100)}%`, background:"linear-gradient(90deg,#4338CA,#6366F1)" }} />
          </div>
        </div>
        <div className="rounded-xl border overflow-hidden" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          {gaSteps.map((s,i) => {
            const done = i < step; const active = i === step-1 && phase==="running";
            return (
              <div key={i} className="flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-3.5 border-b last:border-0"
                style={{ borderColor:"#F1F5F9", background:active?"#EEF2FF":undefined }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background:done||active?"#4338CA":"#E2E8F0" }}>
                  {done ? <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    : active ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    : <div className="w-2 h-2 rounded-full" style={{ background:"#CBD5E1" }} />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color:done||active?"#0F172A":"#94A3B8" }}>{s.label}</div>
                  {(done||active) && <div className="text-xs mt-0.5" style={{ color:"#64748B" }}>{s.desc}</div>}
                </div>
                {done && <span className="text-xs font-medium" style={{ color:"#059669", fontFamily:"JetBrains Mono" }}>✓</span>}
              </div>
            );
          })}
        </div>
        {phase === "done" && (
          <div className="mt-6 rounded-xl border p-4" style={{ background:"#F0FDF4", borderColor:"#A7F3D0" }}>
            <div className="text-sm font-semibold mb-0.5" style={{ color:"#065F46" }}>Jadwal siap disimpan</div>
            <div className="text-xs mb-3" style={{ color:"#059669" }}>"{namaJadwal || "Jadwal Baru"}" akan otomatis tersimpan ke daftar jadwal.</div>
            <button onClick={onDone} className="w-full py-3 rounded-xl text-white font-semibold text-sm" style={{ background:"#4338CA" }}>
              Simpan & Lihat Jadwal →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JADWAL (list + detail combined) ──────────────────────────────────────────
interface JadwalPageProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  initialSelected?: number | null;
  schedule?: ScheduleResult[];
}
function DownloadDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>
        {Icon.excel} Unduh <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && <>
        <div className="fixed inset-0 z-30" onClick={()=>setOpen(false)} />
        <div className="absolute right-0 mt-1.5 w-40 rounded-xl border shadow-lg z-40 overflow-hidden" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          <button onClick={()=>setOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-all"
            onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFC")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="#059669" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span style={{ color:"#374151" }}>Download Excel</span>
          </button>
          <div style={{ height:1, background:"#F1F5F9" }} />
          <button onClick={()=>setOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-all"
            onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFC")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="#DC2626" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span style={{ color:"#374151" }}>Download PDF</span>
          </button>
        </div>
      </>}
    </div>
  );
}
function JadwalPage({ history, setHistory, initialSelected, schedule = SAMPLE_SCHEDULE }: JadwalPageProps) {
  const [selectedId, setSelectedId] = useState<number|null>(initialSelected??null);
  const [detailSlot, setDetailSlot] = useState<ScheduleResult|null>(null);
  const selected = history.find(h=>h.id===selectedId)??null;

  if (selected) {
    return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={()=>setSelectedId(null)} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-all"
          style={{ borderColor:"#E2E8F0", color:"#374151" }}
          onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFC")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
          ← Semua Jadwal
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <Badge type={selected.jenis==="Sempro"?"info":"success"} label={selected.jenis} />
          <span className="font-bold text-sm truncate" style={{ fontFamily:"DM Sans" }}>{selected.nama}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DownloadDropdown />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-5">
        {[{label:"Total Seminar",value:selected.jumlahSeminar.toString(),color:"#0F172A"},{label:"Fitness Score",value:`${selected.fitnessScore}%`,color:"#4338CA"},{label:"Konflik",value:selected.conflict.toString(),color:selected.conflict===0?"#059669":"#DC2626"},{label:"Periode",value:selected.periode,color:"#0F172A"},{label:"Dibuat",value:selected.tanggalGenerate,color:"#64748B"},{label:"Status",value:selected.status,color:"#059669"}].map(({label,value,color})=>(
          <div key={label} className="rounded-xl border p-3 sm:p-4" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="font-bold mb-0.5 truncate" style={{ fontFamily:"JetBrains Mono", color, fontSize:15 }}>{value}</div>
            <div className="text-xs leading-tight" style={{ color:"#94A3B8" }}>{label}</div>
          </div>
        ))}
      </div>

      <TableWrap>
            <table className="w-full text-sm min-w-[700px]">
              <thead style={{ background:"#F8FAFC" }}>
                <tr>{["Tanggal","Jam","Ruangan","Mahasiswa","Jenis","Pembimbing 1","Pembimbing 2","Penguji 1","Penguji 2","Status"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {schedule.map((s,i)=>{
                  const st = slotStatus(s);
                  const sc = st==="approved" ? { bg:"#DCFCE7", text:"#059669" } : st==="declined" ? { bg:"#FEE2E2", text:"#DC2626" } : { bg:"#FEF9C3", text:"#92400E" };
                  const approved = s.approvals.filter(a=>a.status==="approved").length;
                  const isActive = detailSlot?.id === s.id;
                  return (
                    <tr key={i} onClick={()=>setDetailSlot(isActive ? null : s)} className="cursor-pointer"
                      style={{ borderBottom:"1px solid #F8FAFC", background: isActive ? "#F0F4FF" : "transparent" }}
                      onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background="#FAFAFA"; }}
                      onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}>
                      <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{s.tanggal}</td>
                      <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{s.jam}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background:"#EEF2FF", color:"#4338CA" }}>{s.ruangan}</span></td>
                      <td className="px-4 py-3 text-xs font-medium">{s.mahasiswa}</td>
                      <td className="px-4 py-3"><Badge type={s.jenis==="Sempro"?"info":"success"} label={s.jenis} /></td>
                      {[s.pembimbing1, s.pembimbing2, s.penguji1, s.penguji2].map((nama, ri) => {
                        const a = s.approvals[ri];
                        const dot = a?.status==="approved" ? "#059669" : a?.status==="declined" ? "#EF4444" : "#F59E0B";
                        return (
                          <td key={ri} className="px-4 py-3 text-xs" style={{ color:"#374151" }}>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background:dot }} />
                              {nama}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background:sc.bg, color:sc.text }}>{approved}/4</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
      </TableWrap>

      {/* Detail modal */}
      {detailSlot && (()=>{
        const st = slotStatus(detailSlot);
        const nApproved = detailSlot.approvals.filter(a=>a.status==="approved").length;
        const headerAccent = st==="approved" ? "#059669" : st==="declined" ? "#DC2626" : "#4338CA";
        const stLabel = st==="approved" ? "Semua Disetujui" : st==="declined" ? "Ada Penolakan" : `${nApproved}/4 Disetujui`;
        const stBadge = st==="approved" ? { bg:"#DCFCE7", text:"#059669" } : st==="declined" ? { bg:"#FEE2E2", text:"#DC2626" } : { bg:"#EEF2FF", text:"#4338CA" };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(15,23,42,0.55)" }} onClick={()=>setDetailSlot(null)}>
            <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ background:"#fff" }} onClick={e=>e.stopPropagation()}>

              {/* Colored accent bar */}
              <div className="h-1.5" style={{ background:`linear-gradient(90deg, ${headerAccent}, ${headerAccent}88)` }} />

              {/* Header */}
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg leading-tight truncate" style={{ fontFamily:"DM Sans", color:"#0F172A" }}>{detailSlot.mahasiswa}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge type={detailSlot.jenis==="Sempro"?"info":"success"} label={detailSlot.jenis} />
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:stBadge.bg, color:stBadge.text }}>{stLabel}</span>
                    </div>
                  </div>
                  <button onClick={()=>setDetailSlot(null)} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color:"#94A3B8", background:"#F1F5F9" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="#E2E8F0";}} onMouseLeave={e=>{e.currentTarget.style.background="#F1F5F9";}}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                {/* Time-place chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {([
                    { icon:"📅", val:detailSlot.tanggal },
                    { icon:"🕐", val:detailSlot.jam },
                    { icon:"🚪", val:detailSlot.ruangan },
                  ]).map(c=>(
                    <span key={c.val} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", color:"#374151", fontFamily:"JetBrains Mono" }}>
                      {c.icon} {c.val}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color:"#64748B" }}>Progress Persetujuan</span>
                    <span className="text-xs font-bold" style={{ color:headerAccent }}>{nApproved} dari 4 dosen</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:"#E2E8F0" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width:`${(nApproved/4)*100}%`, background:headerAccent }} />
                  </div>
                </div>
              </div>

              {/* 4 approval cards in 2x2 grid */}
              <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                {detailSlot.approvals.map(a => {
                  const cfg = a.status==="approved"
                    ? { dot:"#059669", bg:"#F0FDF4", border:"#BBF7D0", badge_bg:"#DCFCE7", badge_text:"#059669", label:"Disetujui" }
                    : a.status==="declined"
                    ? { dot:"#EF4444", bg:"#FFF5F5", border:"#FECACA", badge_bg:"#FEE2E2", badge_text:"#DC2626", label:"Ditolak" }
                    : { dot:"#F59E0B", bg:"#FAFAFA", border:"#E2E8F0", badge_bg:"#FEF9C3", badge_text:"#92400E", label:"Menunggu" };
                  return (
                    <div key={a.role} className="rounded-xl p-3.5 border" style={{ background:cfg.bg, borderColor:cfg.border }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color:"#94A3B8" }}>{a.role}</span>
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:cfg.dot }} />
                      </div>
                      <p className="text-sm font-semibold leading-tight mb-2" style={{ color:"#0F172A" }}>{a.nama}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background:cfg.badge_bg, color:cfg.badge_text }}>{cfg.label}</span>
                      {a.status==="declined" && a.declineReason && (
                        <div className="mt-2 text-xs leading-snug" style={{ color:"#991B1B" }}>⚠ {a.declineReason}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );};

  return (
    <div>
      <PageHeader title="Daftar Jadwal" subtitle="Semua jadwal seminar yang telah digenerate dan disimpan" />

      {history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background:"#F1F5F9" }}>{Icon.calendar}</div>
          <p className="text-sm font-medium" style={{ color:"#374151" }}>Belum ada jadwal</p>
          <p className="text-xs mt-1" style={{ color:"#94A3B8" }}>Generate jadwal baru untuk memulai</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {history.map(h=>(
          <div key={h.id}
            className="rounded-xl border p-4 sm:p-5 transition-all"
            style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>setSelectedId(h.id)}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm" style={{ fontFamily:"DM Sans" }}>{h.nama}</span>
                  <Badge type={h.jenis==="Sempro"?"info":"success"} label={h.jenis} />
                  <Badge type={h.status==="Tersimpan"?"success":"warning"} label={h.status} />
                </div>
                <div className="text-xs" style={{ color:"#94A3B8" }}>{h.tanggalGenerate} · {h.periode}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold" style={{ fontFamily:"JetBrains Mono", color:h.fitnessScore>=95?"#059669":"#D97706" }}>{h.fitnessScore}%</div>
                  <div className="text-xs" style={{ color:"#94A3B8" }}>fitness</div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold" style={{ fontFamily:"JetBrains Mono", color:h.conflict===0?"#059669":"#DC2626" }}>{h.conflict}</div>
                  <div className="text-xs" style={{ color:"#94A3B8" }}>konflik</div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold" style={{ fontFamily:"JetBrains Mono" }}>{h.jumlahSeminar}</div>
                  <div className="text-xs" style={{ color:"#94A3B8" }}>seminar</div>
                </div>
                <button
                  onClick={e=>{ e.stopPropagation(); setHistory(prev=>prev.filter(x=>x.id!==h.id)); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{ color:"#94A3B8", background:"transparent" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#FEE2E2";e.currentTarget.style.color="#DC2626";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#94A3B8";}}
                  title="Hapus jadwal">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
                <div className="cursor-pointer" onClick={()=>setSelectedId(h.id)}>
                  <svg className="w-5 h-5" fill="none" stroke="#94A3B8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
            <div className="sm:hidden flex items-center gap-4 mt-3 text-xs cursor-pointer" style={{ color:"#64748B" }} onClick={()=>setSelectedId(h.id)}>
              <span style={{ fontFamily:"JetBrains Mono", color:h.fitnessScore>=95?"#059669":"#D97706" }}>{h.fitnessScore}% fitness</span>
              <span style={{ color:h.conflict===0?"#059669":"#DC2626" }}>{h.conflict} konflik</span>
              <span>{h.jumlahSeminar} seminar</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESULTS (kept for compat, not used in nav) ───────────────────────────────
interface ResultsPageProps { seminarType: SeminarType|null; onSave:(nama:string)=>void; onNavigate:(p:Page)=>void; }
function ResultsPage({ seminarType, onSave, onNavigate }: ResultsPageProps) {
  const [view, setView] = useState<"table"|"calendar">("table");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState(`Jadwal ${seminarType??"Seminar"} ${new Date().toLocaleDateString("id-ID",{month:"short",year:"numeric"})}`);

  return (
    <div>
      <PageHeader title="Hasil Jadwal" subtitle="Jadwal seminar yang dihasilkan oleh Genetic Algorithm">
        <button onClick={()=>onNavigate("generate")} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>
          {Icon.refresh} <span className="hidden sm:inline">Generate Ulang</span><span className="sm:hidden">Ulang</span>
        </button>
        <button onClick={()=>setShowSaveModal(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>
          {Icon.save} Simpan
        </button>
      </PageHeader>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-5">
        {[{label:"Total Seminar",value:"6",color:"#0F172A"},{label:"Fitness Score",value:"98.4",color:"#4338CA"},{label:"Total Conflict",value:"0",color:"#059669"},{label:"Lecturer Conflict",value:"0",color:"#059669"},{label:"Room Conflict",value:"0",color:"#059669"},{label:"Proc. Time",value:"3.2s",color:"#0891B2"}].map(({label,value,color})=>(
          <div key={label} className="rounded-xl border p-3 sm:p-4 text-center" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="font-bold mb-0.5" style={{ fontFamily:"JetBrains Mono", color, fontSize:18 }}>{value}</div>
            <div className="text-xs leading-tight" style={{ color:"#94A3B8" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold self-start" style={{ background:"#DCFCE7", color:"#166534" }}>
          {Icon.check} No Conflict
        </span>
        <div className="flex items-center gap-1 border rounded-lg p-1" style={{ borderColor:"#E2E8F0" }}>
          <button onClick={()=>setView("table")} className="px-3 py-1.5 rounded-md text-xs font-medium transition-all" style={{ background:view==="table"?"#4338CA":"transparent", color:view==="table"?"#fff":"#64748B" }}>Tabel</button>
          <button onClick={()=>setView("calendar")} className="px-3 py-1.5 rounded-md text-xs font-medium transition-all" style={{ background:view==="calendar"?"#4338CA":"transparent", color:view==="calendar"?"#fff":"#64748B" }}>Kalender</button>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          {[{l:"Excel",ic:Icon.excel},{l:"PDF",ic:Icon.excel},{l:"Print",ic:Icon.print}].map(({l,ic})=>(
            <button key={l} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>{ic}{l}</button>
          ))}
        </div>
      </div>

      {view==="table" ? (
        <TableWrap>
          <table className="w-full text-sm min-w-[700px]">
            <thead style={{ background:"#F8FAFC" }}>
              <tr>{["Tanggal","Jam","Ruangan","Mahasiswa","Jenis","Pembimbing 1","Pembimbing 2","Penguji 1","Penguji 2"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {SAMPLE_SCHEDULE.map((s,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="#FAFAFA")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{s.tanggal}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{s.jam}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background:"#EEF2FF", color:"#4338CA" }}>{s.ruangan}</span></td>
                  <td className="px-4 py-3 text-xs font-medium">{s.mahasiswa}</td>
                  <td className="px-4 py-3"><Badge type={s.jenis==="Sempro"?"info":"success"} label={s.jenis} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748B" }}>{s.pembimbing1}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748B" }}>{s.pembimbing2}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748B" }}>{s.penguji1}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748B" }}>{s.penguji2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      ) : <CalendarView />}

      {showSaveModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background:"rgba(15,23,42,0.5)" }}>
          <div className="rounded-2xl border p-6 sm:p-8 w-full max-w-sm" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily:"DM Sans" }}>Simpan Jadwal</h3>
            <p className="text-sm mb-5" style={{ color:"#64748B" }}>Jadwal akan disimpan ke riwayat dan dapat dibuka kembali kapan saja.</p>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Nama Jadwal</label>
              <input type="text" value={saveName} onChange={e=>setSaveName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor:"#E2E8F0" }}
                onFocus={e=>e.target.style.borderColor="#4338CA"}
                onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
            </div>
            {seminarType && (
              <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg" style={{ background: seminarType==="Sempro"?"#EEF2FF":"#ECFDF5" }}>
                <Badge type={seminarType==="Sempro"?"info":"success"} label={seminarType} />
                <span className="text-xs" style={{ color: seminarType==="Sempro"?"#4338CA":"#059669" }}>
                  {seminarType==="Sempro"?"60 menit":"120 menit"} · 6 seminar
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={()=>setShowSaveModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={()=>{ if(saveName.trim()) onSave(saveName.trim()); }} disabled={!saveName.trim()}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold"
                style={{ background:saveName.trim()?"#4338CA":"#A5B4FC" }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR VIEW ────────────────────────────────────────────────────────────
function CalendarView() {
  const days = ["01 Sep","02 Sep","03 Sep","04 Sep","05 Sep"];
  const rms = ["R101","R102","R103"];
  const timeSlots = ["08:00","09:00","10:00","11:00","13:00","14:00"];
  const scheduled: Record<string,{mahasiswa:string;jenis:SeminarType;pembimbing:string}> = {
    "01 Sep-08:00-R101":{mahasiswa:"Andi Pratama",jenis:"Sempro",pembimbing:"Dr. Sari Dewi"},
    "01 Sep-08:00-R102":{mahasiswa:"Budi Setiawan",jenis:"Semhas",pembimbing:"Dr. Ahmad Fauzi"},
    "01 Sep-09:00-R101":{mahasiswa:"Cahya Ningrum",jenis:"Sempro",pembimbing:"Dr. Budi Santoso"},
    "01 Sep-09:00-R102":{mahasiswa:"Dian Pertiwi",jenis:"Semhas",pembimbing:"Dr. Cahya Putri"},
    "02 Sep-08:00-R101":{mahasiswa:"Fitri Handayani",jenis:"Semhas",pembimbing:"Dr. Sari Dewi"},
    "02 Sep-08:00-R102":{mahasiswa:"Galih Kusuma",jenis:"Sempro",pembimbing:"Dr. Ahmad Fauzi"},
  };
  return (
    <div className="rounded-xl border overflow-x-auto" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
      <table className="text-xs border-collapse" style={{ minWidth:700 }}>
        <thead>
          <tr style={{ background:"#F8FAFC" }}>
            <th className="px-4 py-3 text-left font-medium sticky left-0 z-10" style={{ color:"#94A3B8", background:"#F8FAFC", borderRight:"1px solid #E2E8F0", minWidth:70 }}>Waktu</th>
            {days.map(d=><th key={d} colSpan={3} className="px-3 py-3 text-center font-semibold" style={{ color:"#374151", borderLeft:"2px solid #E2E8F0" }}>{d}</th>)}
          </tr>
          <tr style={{ background:"#FAFAFA" }}>
            <th className="sticky left-0 z-10" style={{ background:"#FAFAFA", borderRight:"1px solid #E2E8F0" }} />
            {days.map(d=>rms.map(r=>(
              <th key={`${d}-${r}`} className="px-2 py-2 text-center font-medium" style={{ color:"#94A3B8", borderLeft:r==="R101"?"2px solid #E2E8F0":"1px solid #F1F5F9" }}>
                <span className="px-1.5 py-0.5 rounded" style={{ background:"#EEF2FF", color:"#4338CA" }}>{r}</span>
              </th>
            )))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time=>(
            <tr key={time} style={{ borderTop:"1px solid #F1F5F9" }}>
              <td className="px-4 py-2 font-medium sticky left-0 z-10" style={{ fontFamily:"JetBrains Mono", color:"#64748B", background:"#FAFAFA", borderRight:"1px solid #E2E8F0" }}>{time}</td>
              {days.map(d=>rms.map(r=>{
                const key=`${d}-${time}-${r}`; const item=scheduled[key];
                return (
                  <td key={key} className="px-1.5 py-1.5 align-top" style={{ borderLeft:r==="R101"?"2px solid #E2E8F0":"1px solid #F1F5F9", minWidth:100 }}>
                    {item ? (
                      <div className="rounded-lg p-1.5" style={{ background:item.jenis==="Sempro"?"#DBEAFE":"#DCFCE7", border:`1px solid ${item.jenis==="Sempro"?"#BFDBFE":"#BBF7D0"}` }}>
                        <div className="font-semibold leading-tight" style={{ color:item.jenis==="Sempro"?"#1E40AF":"#166534" }}>{item.mahasiswa}</div>
                        <div style={{ color:item.jenis==="Sempro"?"#3B82F6":"#22C55E", fontSize:10 }}>{item.jenis}</div>
                        <div className="mt-0.5" style={{ color:"#64748B", fontSize:10 }}>{item.pembimbing}</div>
                      </div>
                    ) : <div className="h-10 rounded-lg" style={{ background:"#F8FAFC" }} />}
                  </td>
                );
              }))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
interface HistoryPageProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  onNavigate: (p:Page)=>void;
}
function HistoryPage({ history, setHistory, onNavigate }: HistoryPageProps) {
  const [previewItem, setPreviewItem] = useState<HistoryItem|null>(null);
  const handleDelete = (id: number) => setHistory(h=>h.filter(x=>x.id!==id));
  return (
    <div>
      <PageHeader title="Riwayat Penjadwalan" subtitle="Daftar semua jadwal yang pernah dibuat" />

      {history.length===0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background:"#F1F5F9" }}>{Icon.history}</div>
          <p className="text-sm font-medium" style={{ color:"#374151" }}>Belum ada riwayat</p>
          <p className="text-xs mt-1" style={{ color:"#94A3B8" }}>Jadwal yang disimpan akan muncul di sini</p>
        </div>
      )}

      {/* Mobile: cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {history.map(h=>(
          <div key={h.id} className="rounded-xl border p-4" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="font-semibold text-sm leading-tight">{h.nama}</div>
              <Badge type={h.status==="Tersimpan"?"success":"warning"} label={h.status} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge type={h.jenis==="Sempro"?"info":"success"} label={h.jenis} />
              <span className="text-xs" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{h.tanggalGenerate}</span>
            </div>
            <div className="flex items-center gap-4 text-xs mb-3" style={{ color:"#64748B" }}>
              <span>{h.jumlahSeminar} seminar</span>
              <span>{h.conflict===0?<span style={{color:"#059669"}}>✓ 0 konflik</span>:<span style={{color:"#DC2626"}}>{h.conflict} konflik</span>}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"#E2E8F0" }}>
                <div className="h-full rounded-full" style={{ width:`${h.fitnessScore}%`, background:h.fitnessScore>=95?"#059669":"#D97706" }} />
              </div>
              <span className="text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:h.fitnessScore>=95?"#059669":"#D97706" }}>{h.fitnessScore}%</span>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setPreviewItem(h)} className="flex-1 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-1" style={{ borderColor:"#E2E8F0", color:"#4338CA" }}>
                {Icon.data} Preview
              </button>
              <button onClick={()=>handleDelete(h.id)} className="py-2 px-3 rounded-lg border" style={{ borderColor:"#FEE2E2", color:"#DC2626" }}>{Icon.trash}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <TableWrap>
        <table className="hidden sm:table w-full text-sm">
          <thead style={{ background:"#F8FAFC" }}>
            <tr>{["Nama Jadwal","Jenis","Tanggal Dibuat","Periode","Seminar","Fitness","Konflik","Status","Aksi"].map(h=>(
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {history.map(h=>(
              <tr key={h.id} style={{ borderBottom:"1px solid #F8FAFC" }}
                onMouseEnter={e=>(e.currentTarget.style.background="#FAFAFA")}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                <td className="px-4 py-3 text-sm font-semibold">{h.nama}</td>
                <td className="px-4 py-3"><Badge type={h.jenis==="Sempro"?"info":"success"} label={h.jenis} /></td>
                <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono", color:"#64748B" }}>{h.tanggalGenerate}</td>
                <td className="px-4 py-3 text-xs">{h.periode}</td>
                <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono" }}>{h.jumlahSeminar}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"#E2E8F0", maxWidth:60 }}>
                      <div className="h-full rounded-full" style={{ width:`${h.fitnessScore}%`, background:h.fitnessScore>=95?"#059669":"#D97706" }} />
                    </div>
                    <span className="text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:h.fitnessScore>=95?"#059669":"#D97706" }}>{h.fitnessScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {h.conflict===0?<span className="flex items-center gap-1 text-xs font-medium" style={{color:"#059669"}}>{Icon.check} 0</span>
                    :<span className="text-xs font-medium" style={{color:"#DC2626"}}>{h.conflict} konflik</span>}
                </td>
                <td className="px-4 py-3"><Badge type={h.status==="Tersimpan"?"success":"warning"} label={h.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setPreviewItem(h)} className="text-xs font-medium flex items-center gap-1" style={{color:"#4338CA"}}>{Icon.data} Preview</button>
                    <button onClick={()=>handleDelete(h.id)} className="p-1.5 rounded-lg" style={{color:"#94A3B8"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="#DC2626";(e.currentTarget as HTMLElement).style.background="#FEE2E2";}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="#94A3B8";(e.currentTarget as HTMLElement).style.background="transparent";}}>{Icon.trash}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      {/* Preview modal */}
      {previewItem && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4" style={{background:"rgba(15,23,42,0.55)"}}>
          <div className="rounded-t-2xl sm:rounded-2xl border w-full sm:max-w-2xl flex flex-col" style={{background:"#fff",borderColor:"#E2E8F0",maxHeight:"85vh"}}>
            <div className="px-5 py-4 border-b flex items-start justify-between gap-3 shrink-0" style={{borderColor:"#E2E8F0"}}>
              <div>
                <div className="font-bold text-base leading-tight" style={{fontFamily:"DM Sans"}}>{previewItem.nama}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge type={previewItem.jenis==="Sempro"?"info":"success"} label={previewItem.jenis} />
                  <span className="text-xs" style={{color:"#94A3B8"}}>{previewItem.periode} · {previewItem.jumlahSeminar} seminar</span>
                </div>
              </div>
              <button onClick={()=>setPreviewItem(null)} className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{color:"#94A3B8"}}>{Icon.close}</button>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-xs min-w-[560px]">
                <thead style={{background:"#F8FAFC",position:"sticky",top:0}}>
                  <tr>{["Tanggal","Jam","Ruangan","Mahasiswa","Pembimbing 1","Pembimbing 2","Penguji 1","Penguji 2"].map(h=>(
                    <th key={h} className="px-4 py-3 text-left font-medium uppercase tracking-wide" style={{color:"#94A3B8",borderBottom:"1px solid #E2E8F0"}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {SAMPLE_SCHEDULE.map((s,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #F8FAFC"}}>
                      <td className="px-4 py-3" style={{fontFamily:"JetBrains Mono",color:"#475569"}}>{s.tanggal}</td>
                      <td className="px-4 py-3" style={{fontFamily:"JetBrains Mono",color:"#475569"}}>{s.jam}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded font-medium" style={{background:"#EEF2FF",color:"#4338CA"}}>{s.ruangan}</span></td>
                      <td className="px-4 py-3 font-medium">{s.mahasiswa}</td>
                      <td className="px-4 py-3" style={{color:"#64748B"}}>{s.pembimbing1}</td>
                      <td className="px-4 py-3" style={{color:"#64748B"}}>{s.pembimbing2}</td>
                      <td className="px-4 py-3" style={{color:"#64748B"}}>{s.penguji1}</td>
                      <td className="px-4 py-3" style={{color:"#64748B"}}>{s.penguji2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t flex gap-3 shrink-0" style={{borderColor:"#E2E8F0"}}>
              <button onClick={()=>setPreviewItem(null)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{borderColor:"#E2E8F0",color:"#374151"}}>Tutup</button>
              <button onClick={()=>{setPreviewItem(null);onNavigate("results");}} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold" style={{background:"#4338CA"}}>Buka Penuh →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOMS ────────────────────────────────────────────────────────────────────
function RoomsPage() {
  const rooms = [{id:"R101",name:"Ruang 101",kapasitas:30,lantai:1,status:"Aktif",seminarsToday:2},{id:"R102",name:"Ruang 102",kapasitas:25,lantai:1,status:"Aktif",seminarsToday:2},{id:"R103",name:"Ruang 103",kapasitas:30,lantai:2,status:"Aktif",seminarsToday:0},{id:"R104",name:"Ruang 104",kapasitas:20,lantai:2,status:"Nonaktif",seminarsToday:0}];
  return (
    <div>
      <PageHeader title="Manajemen Ruangan" subtitle="Kelola daftar ruangan untuk penjadwalan seminar">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>{Icon.plus} Tambah Ruangan</button>
      </PageHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map(r=>(
          <div key={r.id} className="rounded-xl border p-5" style={{ background:"#fff", borderColor:"#E2E8F0", opacity:r.status==="Nonaktif"?0.7:1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"#EEF2FF" }}>{Icon.room}</div>
              <Badge type={r.status==="Aktif"?"success":"warning"} label={r.status} />
            </div>
            <div className="font-bold text-lg mb-0.5" style={{ fontFamily:"DM Sans" }}>{r.name}</div>
            <div className="text-xs mb-3" style={{ color:"#64748B" }}>Lantai {r.lantai} · Kapasitas {r.kapasitas} kursi</div>
            <div className="text-xs py-2 border-t flex items-center justify-between" style={{ borderColor:"#F1F5F9", color:"#94A3B8" }}>
              <span>Seminar hari ini</span>
              <span className="font-semibold" style={{ fontFamily:"JetBrains Mono", color:"#374151" }}>{r.seminarsToday}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── JADWAL DOSEN ─────────────────────────────────────────────────────────────
interface JadwalDosenPageProps {
  dosens: Dosen[];
  jadwals: JadwalDosen[];
  setJadwals: React.Dispatch<React.SetStateAction<JadwalDosen[]>>;
}
function JadwalDosenPage({ dosens, jadwals, setJadwals }: JadwalDosenPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<JadwalDosen|null>(null);
  const [form, setForm] = useState<Omit<JadwalDosen,"id">>(EMPTY_JADWAL);
  const [filterDosenId, setFilterDosenId] = useState("");
  const [filterHari, setFilterHari] = useState("");
  const [deleteId, setDeleteId] = useState<number|null>(null);
  const nextId = useRef(INITIAL_JADWAL_DOSEN.length+1);

  const dosenName = (id: number) => { const d = dosens.find(x=>x.id===id); return d ? `${d.nama}, ${d.gelar}` : "—"; };
  const openAdd = () => { setEditTarget(null); setForm(EMPTY_JADWAL); setShowModal(true); };
  const openEdit = (j: JadwalDosen) => { setEditTarget(j); setForm({dosenId:j.dosenId,matkul:j.matkul,kelas:j.kelas,hari:j.hari,jamMulai:j.jamMulai,jamSelesai:j.jamSelesai,ruangan:j.ruangan}); setShowModal(true); };
  const handleSave = () => {
    if (!form.dosenId||!form.matkul||!form.jamMulai||!form.jamSelesai) return;
    if (editTarget) setJadwals(js=>js.map(j=>j.id===editTarget.id?{...form,id:editTarget.id}:j));
    else setJadwals(js=>[...js,{...form,id:nextId.current++}]);
    setShowModal(false);
  };
  const handleDelete = (id: number) => { setJadwals(js=>js.filter(j=>j.id!==id)); setDeleteId(null); };
  const filtered = jadwals.filter(j=>(!filterDosenId||j.dosenId===parseInt(filterDosenId))&&(!filterHari||j.hari===filterHari));
  const hasConflict = (j: JadwalDosen) => jadwals.some(o=>o.id!==j.id&&o.dosenId===j.dosenId&&o.hari===j.hari&&j.jamMulai<o.jamSelesai&&j.jamSelesai>o.jamMulai);
  const dosenSummary = dosens.map(d=>({id:d.id,nama:d.nama,total:jadwals.filter(j=>j.dosenId===d.id).length,conflict:jadwals.filter(j=>j.dosenId===d.id&&hasConflict(j)).length}));

  const inp = "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all";
  const inpS = { borderColor:"#E2E8F0", background:"#fff" };
  const fo = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => e.target.style.borderColor="#4338CA";
  const bl = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => e.target.style.borderColor="#E2E8F0";

  const potentialConflict = form.dosenId&&form.hari&&form.jamMulai&&form.jamSelesai
    ? jadwals.find(j=>j.id!==editTarget?.id&&j.dosenId===form.dosenId&&j.hari===form.hari&&form.jamMulai<j.jamSelesai&&form.jamSelesai>j.jamMulai)
    : null;

  const hariColor = (h: string) => ({Senin:{bg:"#EEF2FF",c:"#4338CA"},Selasa:{bg:"#FDF4FF",c:"#7C3AED"},Rabu:{bg:"#ECFDF5",c:"#059669"},Kamis:{bg:"#FFF7ED",c:"#D97706"},Jumat:{bg:"#FFF1F2",c:"#E11D48"}} as any)[h] || {bg:"#F1F5F9",c:"#475569"};

  return (
    <div>
      <PageHeader title="Jadwal Mengajar Dosen" subtitle="Input jadwal kuliah dosen sebagai constraint penjadwalan seminar">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>
          {Icon.plus} Tambah Jadwal
        </button>
      </PageHeader>

      <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ background:"#EEF2FF", border:"1px solid #C7D2FE" }}>
        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="#4338CA" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p className="text-xs" style={{ color:"#3730A3" }}>Jadwal mengajar dosen digunakan sebagai <strong>constraint hard</strong> dalam Genetic Algorithm — sistem tidak akan menjadwalkan dosen sebagai pembimbing atau penguji saat jam mengajarnya.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {dosenSummary.map(d=>(
          <div key={d.nama} className="rounded-xl border p-3 sm:p-4" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="flex items-start justify-between mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"#EEF2FF" }}>
                <span className="text-xs font-bold" style={{ color:"#4338CA" }}>{d.nama.replace("Dr. ","").charAt(0)}</span>
              </div>
              {d.conflict>0 && <Badge type="error" label={`${d.conflict}`} />}
            </div>
            <div className="text-xs font-semibold leading-tight truncate" title={d.nama}>{d.nama.replace(", M.Kom","").replace("Dr. ","")}</div>
            <div className="text-xs mt-0.5" style={{ color:"#94A3B8" }}>{d.total} jadwal</div>
          </div>
        ))}
        <div className="rounded-xl border p-3 sm:p-4" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background:"#F0FDF4" }}>
            <span style={{ color:"#059669" }}>{Icon.check}</span>
          </div>
          <div className="text-xl font-bold" style={{ fontFamily:"JetBrains Mono" }}>{jadwals.length}</div>
          <div className="text-xs" style={{ color:"#94A3B8" }}>Total jadwal</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color:"#64748B" }}>{Icon.filter} Filter:</div>
        <select value={filterDosenId} onChange={e=>setFilterDosenId(e.target.value)} className="px-3 py-1.5 rounded-lg border text-xs outline-none" style={{ borderColor:"#E2E8F0" }}>
          <option value="">Semua Dosen</option>{dosens.map(d=><option key={d.id} value={d.id}>{d.nama}</option>)}
        </select>
        <select value={filterHari} onChange={e=>setFilterHari(e.target.value)} className="px-3 py-1.5 rounded-lg border text-xs outline-none" style={{ borderColor:"#E2E8F0" }}>
          <option value="">Semua Hari</option>{HARI_OPTIONS.map(h=><option key={h} value={h}>{h}</option>)}
        </select>
        {(filterDosenId||filterHari) && <button onClick={()=>{setFilterDosenId("");setFilterHari("");}} className="text-xs" style={{ color:"#4338CA" }}>Reset ×</button>}
        <span className="ml-auto text-xs" style={{ color:"#94A3B8" }}>{filtered.length}/{jadwals.length}</span>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.length===0 && <p className="text-sm text-center py-8" style={{ color:"#94A3B8" }}>Tidak ada jadwal ditemukan</p>}
        {filtered.map(j=>{
          const conflict=hasConflict(j); const hc=hariColor(j.hari);
          return (
            <div key={j.id} className="rounded-xl border p-4" style={{ background:conflict?"#FFF5F5":"#fff", borderColor:"#E2E8F0" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold text-sm">{j.matkul}</div>
                  <div className="text-xs mt-0.5" style={{ color:"#64748B" }}>{dosenName(j.dosenId).split(",")[0]}</div>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background:hc.bg, color:hc.c }}>{j.hari}</span>
                  <Badge type={conflict?"error":"success"} label={conflict?"Bentrok":"OK"} />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs mb-3" style={{ color:"#64748B" }}>
                <span className="font-medium" style={{ fontFamily:"JetBrains Mono" }}>{j.jamMulai} – {j.jamSelesai}</span>
                <span>{j.kelas}</span>
                <span>{j.ruangan}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>openEdit(j)} className="flex-1 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1" style={{ borderColor:"#E2E8F0", color:"#4338CA" }}>{Icon.edit2} Edit</button>
                <button onClick={()=>setDeleteId(j.id)} className="flex-1 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1" style={{ borderColor:"#FEE2E2", color:"#DC2626" }}>{Icon.trash} Hapus</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <TableWrap>
        <table className="hidden sm:table w-full text-sm min-w-[800px]">
          <thead style={{ background:"#F8FAFC" }}>
            <tr>{["No","Dosen","Mata Kuliah","Kelas","Hari","Jam Mulai","Jam Selesai","Ruangan","Status","Aksi"].map(h=>(
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.length===0 && <tr><td colSpan={10} className="px-4 py-12 text-center text-sm" style={{ color:"#94A3B8" }}>Tidak ada jadwal ditemukan</td></tr>}
            {filtered.map((j,i)=>{
              const conflict=hasConflict(j); const hc=hariColor(j.hari);
              return (
                <tr key={j.id} style={{ borderBottom:"1px solid #F8FAFC", background:conflict?"#FFF5F5":undefined }}
                  onMouseEnter={e=>{if(!conflict)(e.currentTarget as HTMLElement).style.background="#FAFAFA";}}
                  onMouseLeave={e=>{if(!conflict)(e.currentTarget as HTMLElement).style.background="transparent";}}>
                  <td className="px-4 py-3 text-xs" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{i+1}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-semibold">{dosenName(j.dosenId).split(",")[0]}</div>
                    <div className="text-xs" style={{ color:"#94A3B8" }}>{dosenName(j.dosenId).split(",")[1]?.trim()}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{j.matkul}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background:"#F1F5F9", color:"#475569" }}>{j.kelas}</span></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background:hc.bg, color:hc.c }}>{j.hari}</span></td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:"#374151" }}>{j.jamMulai}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:"#374151" }}>{j.jamSelesai}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:"#64748B" }}>{j.ruangan}</td>
                  <td className="px-4 py-3"><Badge type={conflict?"error":"success"} label={conflict?"Bentrok":"OK"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>openEdit(j)} className="p-1.5 rounded-lg transition-all" style={{ color:"#64748B" }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#EEF2FF";(e.currentTarget as HTMLElement).style.color="#4338CA";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="#64748B";}}>{Icon.edit2}</button>
                      <button onClick={()=>setDeleteId(j.id)} className="p-1.5 rounded-lg transition-all" style={{ color:"#64748B" }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#FEE2E2";(e.currentTarget as HTMLElement).style.color="#DC2626";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="#64748B";}}>{Icon.trash}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4" style={{ background:"rgba(15,23,42,0.55)" }}>
          <div className="rounded-t-2xl sm:rounded-2xl border w-full sm:max-w-md" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor:"#E2E8F0" }}>
              <h3 className="font-bold text-base" style={{ fontFamily:"DM Sans" }}>{editTarget?"Edit Jadwal Mengajar":"Tambah Jadwal Mengajar"}</h3>
              <button onClick={()=>setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ color:"#94A3B8" }}>{Icon.close}</button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight:"70vh" }}>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Dosen *</label>
                <select value={form.dosenId||""} onChange={e=>setForm(f=>({...f,dosenId:parseInt(e.target.value)||0}))} className={inp} style={inpS} onFocus={fo} onBlur={bl}>
                  <option value="">Pilih dosen...</option>{dosens.map(d=><option key={d.id} value={d.id}>{d.nama}, {d.gelar}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Mata Kuliah *</label>
                <input value={form.matkul} onChange={e=>setForm(f=>({...f,matkul:e.target.value}))} placeholder="cth. Pemrograman Web" className={inp} style={inpS} onFocus={fo} onBlur={bl} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Kelas</label>
                <input value={form.kelas} onChange={e=>setForm(f=>({...f,kelas:e.target.value}))} placeholder="cth. TI-4A" className={inp} style={inpS} onFocus={fo} onBlur={bl} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Hari *</label>
                  <select value={form.hari} onChange={e=>setForm(f=>({...f,hari:e.target.value}))} className={inp} style={inpS} onFocus={fo} onBlur={bl}>
                    {HARI_OPTIONS.map(h=><option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Jam Mulai *</label>
                  <input type="time" value={form.jamMulai} onChange={e=>setForm(f=>({...f,jamMulai:e.target.value}))} className={inp} style={inpS} onFocus={fo} onBlur={bl} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Jam Selesai *</label>
                  <input type="time" value={form.jamSelesai} onChange={e=>setForm(f=>({...f,jamSelesai:e.target.value}))} className={inp} style={inpS} onFocus={fo} onBlur={bl} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Ruangan / Kelas</label>
                <input value={form.ruangan} onChange={e=>setForm(f=>({...f,ruangan:e.target.value}))} placeholder="cth. Lab 1, R201" className={inp} style={inpS} onFocus={fo} onBlur={bl} />
              </div>
              {potentialConflict && (
                <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background:"#FEF2F2", border:"1px solid #FECACA" }}>
                  <span className="shrink-0 mt-0.5" style={{ color:"#DC2626" }}>{Icon.warning}</span>
                  <div className="text-xs" style={{ color:"#991B1B" }}>
                    <strong>Peringatan bentrok:</strong> {dosenName(form.dosenId).split(",")[0]} sudah mengajar {potentialConflict.matkul} ({potentialConflict.kelas}) pada {potentialConflict.hari} {potentialConflict.jamMulai}–{potentialConflict.jamSelesai}.
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t flex gap-3" style={{ borderColor:"#E2E8F0" }}>
              <button onClick={()=>setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={handleSave} disabled={!form.dosenId||!form.matkul} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold"
                style={{ background:(!form.dosenId||!form.matkul)?"#A5B4FC":"#4338CA" }}>
                {editTarget?"Simpan Perubahan":"Tambah Jadwal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId!==null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background:"rgba(15,23,42,0.55)" }}>
          <div className="rounded-2xl border p-6 sm:p-7 w-full max-w-sm text-center" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:"#FEE2E2" }}><span style={{ color:"#DC2626" }}>{Icon.trash}</span></div>
            <h3 className="font-bold text-base mb-1" style={{ fontFamily:"DM Sans" }}>Hapus Jadwal?</h3>
            <p className="text-sm mb-6" style={{ color:"#64748B" }}>Jadwal mengajar ini akan dihapus dan tidak dapat dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteId(null)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={()=>handleDelete(deleteId!)} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background:"#DC2626" }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

// ─── DATA DOSEN PAGE ──────────────────────────────────────────────────────────
interface DataDosenPageProps {
  dosens: Dosen[];
  setDosens: React.Dispatch<React.SetStateAction<Dosen[]>>;
  jadwals: JadwalDosen[];
  onNavigate: (p: Page) => void;
}

function DataDosenPage({ dosens, setDosens, jadwals, onNavigate }: DataDosenPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Dosen | null>(null);
  const [form, setForm] = useState<Omit<Dosen, "id">>(EMPTY_DOSEN);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const nextId = useRef(INITIAL_DOSEN.length + 1);

  const openAdd = () => { setEditTarget(null); setForm(EMPTY_DOSEN); setShowModal(true); };
  const openEdit = (d: Dosen) => { setEditTarget(d); setForm({ nip:d.nip, nama:d.nama, gelar:d.gelar, email:d.email, bidang:d.bidang, status:d.status }); setShowModal(true); };
  const handleSave = () => {
    if (!form.nama || !form.nip) return;
    if (editTarget) setDosens(ds => ds.map(d => d.id === editTarget.id ? { ...form, id: editTarget.id } : d));
    else setDosens(ds => [...ds, { ...form, id: nextId.current++ }]);
    setShowModal(false);
  };
  const handleDelete = (id: number) => { setDosens(ds => ds.filter(d => d.id !== id)); setDeleteId(null); };

  const filtered = dosens.filter(d =>
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.bidang.toLowerCase().includes(search.toLowerCase()) ||
    d.nip.includes(search)
  );

  const countJadwal = (dosenId: number) => jadwals.filter(j => j.dosenId === dosenId).length;

  const inp = "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all";
  const inpS = { borderColor: "#E2E8F0", background: "#fff" };
  const fo = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => e.target.style.borderColor = "#4338CA";
  const bl = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => e.target.style.borderColor = "#E2E8F0";

  const initials = (nama: string) => nama.replace("Dr. ","").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  const avatarColors = ["#4338CA","#0891B2","#059669","#D97706","#DC2626","#7C3AED"];

  return (
    <div>
      <PageHeader title="Data Dosen" subtitle="Master data dosen yang terlibat dalam penjadwalan seminar">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>
          {Icon.plus} Tambah Dosen
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <StatCard label="Total Dosen" value={dosens.length} />
        <StatCard label="Dosen Aktif" value={dosens.filter(d=>d.status==="Aktif").length} color="#059669" />
        <StatCard label="Total Jadwal Mengajar" value={jadwals.length} color="#4338CA" />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#94A3B8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, bidang, atau NIP..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor:"#E2E8F0", background:"#fff" }}
          onFocus={e => e.target.style.borderColor="#4338CA"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.map((d, i) => (
          <div key={d.id} className="rounded-xl border p-4" style={{ background:"#fff", borderColor:"#E2E8F0", opacity:d.status==="Nonaktif"?0.7:1 }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: avatarColors[i % avatarColors.length] }}>{initials(d.nama)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{d.nama}, {d.gelar}</div>
                <div className="text-xs mt-0.5" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{d.nip}</div>
                <div className="text-xs mt-0.5" style={{ color:"#64748B" }}>{d.bidang}</div>
              </div>
              <Badge type={d.status==="Aktif"?"success":"warning"} label={d.status} />
            </div>
            <div className="flex items-center gap-2 text-xs mb-3" style={{ color:"#64748B" }}>
              {Icon.mail}<span className="truncate">{d.email}</span>
            </div>
            <div className="flex items-center justify-between mb-3 py-2 border-t" style={{ borderColor:"#F1F5F9" }}>
              <span className="text-xs" style={{ color:"#64748B" }}>Jadwal mengajar</span>
              <button onClick={() => onNavigate("jadwal-dosen")} className="text-xs font-semibold" style={{ color:"#4338CA" }}>{countJadwal(d.id)} jadwal →</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(d)} className="flex-1 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1" style={{ borderColor:"#E2E8F0", color:"#4338CA" }}>{Icon.edit2} Edit</button>
              <button onClick={() => setDeleteId(d.id)} className="flex-1 py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1" style={{ borderColor:"#FEE2E2", color:"#DC2626" }}>{Icon.trash} Hapus</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center py-10 text-sm" style={{ color:"#94A3B8" }}>Tidak ada dosen ditemukan</p>}
      </div>

      {/* Desktop: table */}
      <TableWrap>
        <table className="hidden sm:table w-full text-sm min-w-[700px]">
          <thead style={{ background:"#F8FAFC" }}>
            <tr>{["","Nama Dosen","NIP","Email","Bidang Keahlian","Jadwal Mengajar","Status","Aksi"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color:"#94A3B8" }}>Tidak ada dosen ditemukan</td></tr>}
            {filtered.map((d, i) => (
              <tr key={d.id} style={{ borderBottom:"1px solid #F8FAFC", opacity:d.status==="Nonaktif"?0.65:1 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background="#FAFAFA"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background="transparent"}>
                <td className="px-4 py-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: avatarColors[i % avatarColors.length] }}>{initials(d.nama)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-sm">{d.nama}</div>
                  <div className="text-xs mt-0.5" style={{ color:"#94A3B8" }}>{d.gelar}</div>
                </td>
                <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{d.nip}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color:"#64748B" }}>
                    {Icon.mail} {d.email}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color:"#374151" }}>{d.bidang}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onNavigate("jadwal-dosen")} className="flex items-center gap-1 text-xs font-medium transition-all" style={{ color:"#4338CA" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration="underline"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration="none"}>
                    {countJadwal(d.id)} jadwal →
                  </button>
                </td>
                <td className="px-4 py-3"><Badge type={d.status==="Aktif"?"success":"warning"} label={d.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg transition-all" style={{ color:"#64748B" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#EEF2FF"; (e.currentTarget as HTMLElement).style.color="#4338CA"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="#64748B"; }}>{Icon.edit2}</button>
                    <button onClick={() => setDeleteId(d.id)} className="p-1.5 rounded-lg transition-all" style={{ color:"#64748B" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#FEE2E2"; (e.currentTarget as HTMLElement).style.color="#DC2626"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="#64748B"; }}>{Icon.trash}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4" style={{ background:"rgba(15,23,42,0.55)" }}>
          <div className="rounded-t-2xl sm:rounded-2xl border w-full sm:max-w-lg" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor:"#E2E8F0" }}>
              <h3 className="font-bold text-base" style={{ fontFamily:"DM Sans" }}>{editTarget ? "Edit Data Dosen" : "Tambah Dosen Baru"}</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color:"#94A3B8" }}>{Icon.close}</button>
            </div>
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto" style={{ maxHeight:"70vh" }}>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Nama Lengkap (tanpa gelar) *</label>
                <input value={form.nama} onChange={e => setForm(f => ({...f, nama:e.target.value}))} placeholder="cth. Ahmad Fauzi" className={inp} style={inpS} onFocus={fo} onBlur={bl} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Gelar *</label>
                <input value={form.gelar} onChange={e => setForm(f => ({...f, gelar:e.target.value}))} placeholder="cth. M.T, M.Kom, Ph.D" className={inp} style={inpS} onFocus={fo} onBlur={bl} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>NIP *</label>
                <input value={form.nip} onChange={e => setForm(f => ({...f, nip:e.target.value}))} placeholder="18 digit NIP" className={inp} style={inpS} onFocus={fo} onBlur={bl} maxLength={18} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} placeholder="nama@universitas.ac.id" className={inp} style={inpS} onFocus={fo} onBlur={bl} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Bidang Keahlian</label>
                <input value={form.bidang} onChange={e => setForm(f => ({...f, bidang:e.target.value}))} placeholder="cth. Kecerdasan Buatan" className={inp} style={inpS} onFocus={fo} onBlur={bl} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({...f, status:e.target.value as "Aktif"|"Nonaktif"}))} className={inp} style={inpS} onFocus={fo} onBlur={bl}>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex gap-3" style={{ borderColor:"#E2E8F0" }}>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={handleSave} disabled={!form.nama || !form.nip} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold"
                style={{ background:(!form.nama||!form.nip)?"#A5B4FC":"#4338CA" }}>
                {editTarget ? "Simpan Perubahan" : "Tambah Dosen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background:"rgba(15,23,42,0.55)" }}>
          <div className="rounded-2xl border p-6 sm:p-7 w-full max-w-sm text-center" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:"#FEE2E2" }}><span style={{ color:"#DC2626" }}>{Icon.trash}</span></div>
            <h3 className="font-bold text-base mb-1" style={{ fontFamily:"DM Sans" }}>Hapus Dosen?</h3>
            <p className="text-sm mb-6" style={{ color:"#64748B" }}>Data dosen beserta seluruh jadwal mengajarnya akan dihapus.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={() => handleDelete(deleteId!)} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background:"#DC2626" }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DOSEN SEMINAR PAGE ───────────────────────────────────────────────────────
function DosenSeminarPage({ currentUser, dosens }: { currentUser: CurrentUser; dosens: Dosen[] }) {
  const dosen = dosens.find(d => d.id === currentUser.id);
  const dosenName = dosen ? dosen.nama : currentUser.nama;
  const asPembimbing = SAMPLE_SEMINARS.filter(s => s.pembimbing.includes(dosenName.replace("Dr. ","")));
  const asPenguji = SAMPLE_SEMINARS.filter(s =>
    (s.penguji1.includes(dosenName.replace("Dr. ","")) || s.penguji2.includes(dosenName.replace("Dr. ",""))) &&
    !s.pembimbing.includes(dosenName.replace("Dr. ",""))
  );
  const getSchedule = (nama: string) => SAMPLE_SCHEDULE.find(s => s.mahasiswa === nama);

  const SeminarList = ({ items, label }: { items: SeminarData[]; label: string }) => (
    <div className="rounded-xl border" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
      <div className="px-4 py-3 border-b" style={{ borderColor:"#E2E8F0" }}>
        <h3 className="font-semibold text-sm" style={{ fontFamily:"DM Sans" }}>{label} <span className="text-xs font-normal ml-1" style={{ color:"#94A3B8" }}>({items.length})</span></h3>
      </div>
      {items.length === 0 && <p className="px-4 py-6 text-sm text-center" style={{ color:"#94A3B8" }}>Tidak ada seminar</p>}
      {/* Mobile cards */}
      <div className="sm:hidden divide-y" style={{ borderColor:"#F1F5F9" }}>
        {items.map(s => {
          const sch = getSchedule(s.nama);
          return (
            <div key={s.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-medium text-sm">{s.nama}</div>
                <Badge type={s.jenis === "Sempro" ? "info" : "success"} label={s.jenis} />
              </div>
              <p className="text-xs mb-1" style={{ color:"#64748B" }}>{s.judul}</p>
              {sch && <div className="text-xs" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{sch.tanggal} · {sch.jam} · {sch.ruangan}</div>}
              {!sch && <div className="text-xs" style={{ color:"#D97706" }}>Jadwal belum ditetapkan</div>}
            </div>
          );
        })}
      </div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead style={{ background:"#F8FAFC" }}>
            <tr>{["Mahasiswa","Jenis","Judul","Tanggal","Jam","Ruangan"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {items.map(s => {
              const sch = getSchedule(s.nama);
              return (
                <tr key={s.id} style={{ borderBottom:"1px solid #F8FAFC" }}
                  onMouseEnter={e => (e.currentTarget.style.background="#FAFAFA")}
                  onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                  <td className="px-4 py-3 text-xs font-medium">{s.nama}</td>
                  <td className="px-4 py-3"><Badge type={s.jenis === "Sempro" ? "info" : "success"} label={s.jenis} /></td>
                  <td className="px-4 py-3 text-xs max-w-[200px] truncate" style={{ color:"#64748B" }}>{s.judul}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{sch ? sch.tanggal : "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono", color:"#475569" }}>{sch ? sch.jam : "—"}</td>
                  <td className="px-4 py-3">{sch ? <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background:"#EEF2FF", color:"#4338CA" }}>{sch.ruangan}</span> : <span className="text-xs" style={{ color:"#D97706" }}>Belum</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Seminar Saya" subtitle={`Seminar sebagai pembimbing dan penguji — ${dosenName}`} />
      <div className="flex flex-col gap-5">
        <SeminarList items={asPembimbing} label="Sebagai Pembimbing" />
        <SeminarList items={asPenguji} label="Sebagai Penguji" />
      </div>
    </div>
  );
}

// ─── DOSEN BLOKIR PAGE ────────────────────────────────────────────────────────
interface BlokirItem { id: number; hari: string; jamMulai: string; jamSelesai: string; keterangan: string; }
function DosenBlokirPage({ currentUser, dosens, jadwals, setJadwals }: {
  currentUser: CurrentUser;
  dosens: Dosen[];
  jadwals: JadwalDosen[];
  setJadwals: React.Dispatch<React.SetStateAction<JadwalDosen[]>>;
}) {
  const [tab, setTab] = useState<"jadwal"|"blokir">("jadwal");
  const [blokirList, setBlokirList] = useState<BlokirItem[]>([
    { id:1, hari:"Senin", jamMulai:"12:00", jamSelesai:"13:00", keterangan:"Rapat jurusan" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<BlokirItem,"id">>({ hari:"Senin", jamMulai:"08:00", jamSelesai:"09:00", keterangan:"" });
  const nextId = useRef(10);
  const myJadwals = jadwals.filter(j => j.dosenId === currentUser.id);

  const hariColor = (h: string) => ({Senin:{bg:"#EEF2FF",c:"#4338CA"},Selasa:{bg:"#FDF4FF",c:"#7C3AED"},Rabu:{bg:"#ECFDF5",c:"#059669"},Kamis:{bg:"#FFF7ED",c:"#D97706"},Jumat:{bg:"#FFF1F2",c:"#E11D48"}} as Record<string,{bg:string;c:string}>)[h] || {bg:"#F1F5F9",c:"#475569"};

  const addBlokir = () => {
    if (!form.jamMulai || !form.jamSelesai) return;
    setBlokirList(l => [...l, { ...form, id: nextId.current++ }]);
    setShowModal(false);
    setForm({ hari:"Senin", jamMulai:"08:00", jamSelesai:"09:00", keterangan:"" });
  };

  return (
    <div>
      <PageHeader title="Jadwal & Blokir Waktu" subtitle="Lihat jadwal mengajar dan kelola waktu blokir Anda" />
      <div className="flex items-center gap-1 border rounded-lg p-1 mb-5 self-start w-fit" style={{ borderColor:"#E2E8F0" }}>
        <button onClick={() => setTab("jadwal")} className="px-4 py-2 rounded-md text-sm font-medium transition-all"
          style={{ background:tab==="jadwal"?"#4338CA":"transparent", color:tab==="jadwal"?"#fff":"#64748B" }}>Jadwal Mengajar</button>
        <button onClick={() => setTab("blokir")} className="px-4 py-2 rounded-md text-sm font-medium transition-all"
          style={{ background:tab==="blokir"?"#4338CA":"transparent", color:tab==="blokir"?"#fff":"#64748B" }}>Blokir Waktu</button>
      </div>

      {tab === "jadwal" && (
        <div className="rounded-xl border" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          {myJadwals.length === 0 && <p className="px-4 py-10 text-center text-sm" style={{ color:"#94A3B8" }}>Belum ada jadwal mengajar</p>}
          <div className="divide-y" style={{ borderColor:"#F1F5F9" }}>
            {myJadwals.map(j => {
              const hc = hariColor(j.hari);
              return (
                <div key={j.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{j.matkul}</div>
                    <div className="text-xs mt-0.5" style={{ color:"#64748B" }}>{j.kelas} · {j.ruangan}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background:hc.bg, color:hc.c }}>{j.hari}</span>
                    <span className="text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:"#374151" }}>{j.jamMulai}–{j.jamSelesai}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "blokir" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color:"#64748B" }}>Waktu blokir tidak akan dijadwalkan seminar</p>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>
              {Icon.plus} Tambah Blokir
            </button>
          </div>
          <div className="rounded-xl border" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            {blokirList.length === 0 && <p className="px-4 py-10 text-center text-sm" style={{ color:"#94A3B8" }}>Belum ada blokir waktu</p>}
            <div className="divide-y" style={{ borderColor:"#F1F5F9" }}>
              {blokirList.map(b => {
                const hc = hariColor(b.hari);
                return (
                  <div key={b.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{b.keterangan || "Blokir Waktu"}</div>
                      <div className="text-xs mt-0.5" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{b.hari} · {b.jamMulai}–{b.jamSelesai}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background:hc.bg, color:hc.c }}>{b.hari}</span>
                      <button onClick={() => setBlokirList(l => l.filter(x => x.id !== b.id))} className="p-1.5 rounded-lg" style={{ color:"#94A3B8" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#FEE2E2"; (e.currentTarget as HTMLElement).style.color="#DC2626"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="#94A3B8"; }}>{Icon.trash}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background:"rgba(15,23,42,0.55)" }}>
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-bold text-base mb-4" style={{ fontFamily:"DM Sans" }}>Tambah Blokir Waktu</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Hari</label>
                <select value={form.hari} onChange={e => setForm(f => ({...f,hari:e.target.value}))} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor:"#E2E8F0" }}>
                  {HARI_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Jam Mulai</label>
                  <input type="time" value={form.jamMulai} onChange={e => setForm(f => ({...f,jamMulai:e.target.value}))} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor:"#E2E8F0" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Jam Selesai</label>
                  <input type="time" value={form.jamSelesai} onChange={e => setForm(f => ({...f,jamSelesai:e.target.value}))} className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor:"#E2E8F0" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:"#374151" }}>Keterangan</label>
                <input value={form.keterangan} onChange={e => setForm(f => ({...f,keterangan:e.target.value}))} placeholder="cth. Rapat jurusan" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor:"#E2E8F0" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={addBlokir} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background:"#4338CA" }}>Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DOSEN APPROVE PAGE ───────────────────────────────────────────────────────
function DosenApprovePage({ currentUser, schedule, setSchedule }: {
  currentUser: CurrentUser;
  schedule: ScheduleResult[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleResult[]>>;
}) {
  const dosenNama = currentUser.nama;
  // slots where this dosen has an entry in approvals
  const mySlots = schedule.filter(s => s.approvals.some(a => a.nama === dosenNama));

  const [declineModal, setDeclineModal] = useState<number|null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const updateApproval = (slotId: number, status: ApprovalStatus, reason?: string) =>
    setSchedule(prev => prev.map(s => s.id !== slotId ? s : {
      ...s, approvals: s.approvals.map(a => a.nama === dosenNama ? { ...a, status, ...(reason ? {declineReason:reason} : {declineReason:undefined}) } : a)
    }));

  const counts = {
    pending:  mySlots.filter(s=>s.approvals.find(a=>a.nama===dosenNama)?.status==="pending").length,
    approved: mySlots.filter(s=>s.approvals.find(a=>a.nama===dosenNama)?.status==="approved").length,
    declined: mySlots.filter(s=>s.approvals.find(a=>a.nama===dosenNama)?.status==="declined").length,
  };

  return (
    <div>
      <PageHeader title="Approve Jadwal Seminar" subtitle="Setujui atau tolak slot jadwal yang ditetapkan untuk Anda" />

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {([
          { label:"Menunggu",  value:counts.pending,  color:"#D97706", bg:"#FFFBEB", border:"#FDE68A" },
          { label:"Disetujui", value:counts.approved, color:"#059669", bg:"#F0FDF4", border:"#BBF7D0" },
          { label:"Ditolak",   value:counts.declined, color:"#DC2626", bg:"#FFF5F5", border:"#FECACA" },
        ] as {label:string;value:number;color:string;bg:string;border:string}[]).map(c=>(
          <div key={c.label} className="rounded-xl p-4 border" style={{ background:c.bg, borderColor:c.border }}>
            <p className="text-3xl font-bold mb-1" style={{ color:c.color, fontFamily:"DM Sans" }}>{c.value}</p>
            <p className="text-xs font-medium" style={{ color:c.color }}>{c.label}</p>
          </div>
        ))}
      </div>

      {mySlots.length === 0 && (
        <div className="rounded-xl border p-12 text-center" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background:"#F1F5F9" }}>{Icon.calendar}</div>
          <p className="font-medium text-sm mb-1" style={{ color:"#374151" }}>Tidak ada jadwal</p>
          <p className="text-xs" style={{ color:"#94A3B8" }}>Belum ada slot jadwal yang ditetapkan untuk Anda</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mySlots.map(slot => {
          const myApproval = slot.approvals.find(a => a.nama === dosenNama)!;
          const stCfg = myApproval.status === "approved"
            ? { bg:"#DCFCE7", text:"#059669", label:"Disetujui", accent:"#059669" }
            : myApproval.status === "declined"
            ? { bg:"#FEE2E2", text:"#DC2626", label:"Ditolak",   accent:"#DC2626" }
            : { bg:"#FEF9C3", text:"#92400E", label:"Menunggu",  accent:"#D97706" };
          return (
            <div key={slot.id} className="rounded-xl border overflow-hidden" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
              {/* Accent top bar */}
              <div className="h-1" style={{ background:stCfg.accent }} />

              <div className="p-5">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color:"#0F172A" }}>{slot.mahasiswa}</span>
                      <Badge type={slot.jenis === "Sempro" ? "info" : "success"} label={slot.jenis} />
                    </div>
                    <div className="text-xs" style={{ color:"#64748B", fontFamily:"JetBrains Mono" }}>{slot.tanggal} · {slot.jam} · {slot.ruangan}</div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ background:stCfg.bg, color:stCfg.text }}>{stCfg.label}</span>
                </div>

                {/* Role badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mb-3" style={{ background:"#EEF2FF", color:"#4338CA" }}>
                  Peran Anda: {myApproval.role}
                </div>

                {/* 4 dosen progress dots */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {slot.approvals.map(a => {
                    const isMine = a.nama === dosenNama;
                    const dot = a.status==="approved" ? "#059669" : a.status==="declined" ? "#EF4444" : "#F59E0B";
                    const rowBg = isMine ? "#F0F4FF" : "#F8FAFC";
                    const rowBorder = isMine ? "#C7D2FE" : "#E2E8F0";
                    return (
                      <div key={a.role} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs" style={{ background:rowBg, border:`1px solid ${rowBorder}` }}>
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background:dot }} />
                        <div className="min-w-0">
                          <div className="font-medium truncate" style={{ color:isMine?"#4338CA":"#374151" }}>{a.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {myApproval.status === "declined" && myApproval.declineReason && (
                  <div className="px-3 py-2 rounded-lg text-xs mb-3" style={{ background:"#FEE2E2", color:"#991B1B" }}>
                    ⚠ {myApproval.declineReason}
                  </div>
                )}

                {/* Actions */}
                {myApproval.status === "pending" ? (
                  <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor:"#F1F5F9" }}>
                    <button onClick={() => updateApproval(slot.id, "approved")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white text-xs font-semibold" style={{ background:"#059669" }}>
                      {Icon.check} Setujui
                    </button>
                    <button onClick={() => { setDeclineModal(slot.id); setDeclineReason(""); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white text-xs font-semibold" style={{ background:"#DC2626" }}>
                      ✕ Tolak
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor:"#F1F5F9" }}>
                    <button onClick={() => updateApproval(slot.id, "pending")} className="text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor:"#E2E8F0", color:"#64748B" }}>
                      Reset ke Menunggu
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decline modal */}
      {declineModal !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background:"rgba(15,23,42,0.5)" }}>
          <div className="rounded-2xl p-6 w-full max-w-sm" style={{ background:"#fff" }}>
            <h3 className="font-bold text-base mb-1" style={{ fontFamily:"DM Sans" }}>Tolak Jadwal</h3>
            <p className="text-xs mb-4" style={{ color:"#64748B" }}>Berikan alasan penolakan agar admin dapat menjadwalkan ulang</p>
            <textarea
              value={declineReason}
              onChange={e => setDeclineReason(e.target.value)}
              placeholder="cth. Saya ada acara lain di jam tersebut..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none outline-none mb-4"
              style={{ borderColor:"#E2E8F0" }}
            />
            <div className="flex gap-2">
              <button onClick={() => setDeclineModal(null)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={() => { updateApproval(declineModal!, "declined", declineReason.trim() || "Tidak ada alasan"); setDeclineModal(null); setDeclineReason(""); }} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background:"#DC2626" }}>Tolak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAHASISWA JADWAL PAGE ────────────────────────────────────────────────────
function MahasiswaJadwalPage({ currentUser, schedule }: { currentUser: CurrentUser; schedule: ScheduleResult[] }) {
  const nim = "2021001";
  const mySeminar = SAMPLE_SEMINARS.find(s => s.nim === nim);
  const mySchedule = mySeminar ? schedule.find(s => s.mahasiswa === mySeminar.nama) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Jadwal Seminar Saya" subtitle="Detail seminar dan slot jadwal yang ditetapkan" />
      {mySeminar ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

          {/* Left: seminar info */}
          <div className="rounded-xl border overflow-hidden" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor:"#F1F5F9" }}>
              <h3 className="font-bold text-sm" style={{ fontFamily:"DM Sans", color:"#0F172A" }}>Detail Seminar</h3>
              <Badge type={mySeminar.jenis === "Sempro" ? "info" : "success"} label={mySeminar.jenis} />
            </div>
            <div className="p-5">
              <p className="font-semibold text-base mb-5 leading-snug" style={{ color:"#0F172A" }}>{mySeminar.judul}</p>
              <div className="flex flex-col gap-3">
                {([
                  ["NIM", mySeminar.nim],
                  ["Pembimbing", mySeminar.pembimbing],
                  ["Penguji 1", mySeminar.penguji1],
                  ["Penguji 2", mySeminar.penguji2],
                ] as [string,string][]).map(([k,v]) => (
                  <div key={k} className="flex items-start gap-3">
                    <span className="w-24 shrink-0 text-xs font-semibold pt-0.5" style={{ color:"#94A3B8" }}>{k}</span>
                    <span className="text-sm" style={{ color:"#374151" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t" style={{ borderColor:"#F1F5F9" }}>
                <Badge type={mySeminar.status === "valid" ? "success" : "error"} label={mySeminar.status === "valid" ? "Data Valid" : "Perlu Perbaikan"} />
              </div>
            </div>
          </div>

          {/* Right: schedule slot + approval */}
          {mySchedule ? (() => {
            const st = slotStatus(mySchedule);
            const nApproved = mySchedule.approvals.filter(a=>a.status==="approved").length;
            const stLabel = st==="approved" ? "Semua Disetujui" : st==="declined" ? "Ada Penolakan" : `${nApproved}/4 Disetujui`;
            const stColor = st==="approved" ? { bg:"#DCFCE7", text:"#059669", accent:"#059669" }
              : st==="declined" ? { bg:"#FEE2E2", text:"#DC2626", accent:"#DC2626" }
              : { bg:"#FEF9C3", text:"#92400E", accent:"#D97706" };
            return (
              <div className="rounded-xl border overflow-hidden" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
                {/* Status header */}
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ background:"#F8FAFC", borderColor:"#F1F5F9" }}>
                  <h3 className="font-bold text-sm" style={{ fontFamily:"DM Sans", color:"#0F172A" }}>Slot Jadwal Seminar</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background:stColor.bg, color:stColor.text }}>{stLabel}</span>
                </div>

                {/* Time-place tiles */}
                <div className="p-4 grid grid-cols-3 gap-3 border-b" style={{ borderColor:"#F1F5F9" }}>
                  {([["Tanggal", mySchedule.tanggal], ["Jam", mySchedule.jam], ["Ruangan", mySchedule.ruangan]] as [string,string][]).map(([k,v]) => (
                    <div key={k} className="rounded-xl p-3 text-center border" style={{ background:"#F8FAFC", borderColor:"#E2E8F0" }}>
                      <div className="text-xs mb-1 font-medium" style={{ color:"#94A3B8" }}>{k}</div>
                      <div className="font-bold text-xs" style={{ fontFamily:"JetBrains Mono", color:"#0F172A" }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Approval progress bar */}
                <div className="px-5 py-3 border-b" style={{ borderColor:"#F1F5F9" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color:"#64748B" }}>Progress Persetujuan</span>
                    <span className="text-xs font-semibold" style={{ color:stColor.accent }}>{nApproved}/4</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:"#E2E8F0" }}>
                    <div className="h-full rounded-full transition-all" style={{ width:`${(nApproved/4)*100}%`, background:stColor.accent }} />
                  </div>
                </div>

                {/* 4 dosen rows */}
                <div className="divide-y" style={{ borderColor:"#F8FAFC" }}>
                  {mySchedule.approvals.map(a => {
                    const dot = a.status==="approved" ? "#059669" : a.status==="declined" ? "#EF4444" : "#F59E0B";
                    const badge = a.status==="approved" ? { bg:"#DCFCE7", text:"#059669", label:"Disetujui" }
                      : a.status==="declined" ? { bg:"#FEE2E2", text:"#DC2626", label:"Ditolak" }
                      : { bg:"#F1F5F9", text:"#64748B", label:"Menunggu" };
                    return (
                      <div key={a.role} className="px-5 py-3.5 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:dot }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color:"#94A3B8" }}>{a.role}</div>
                          <div className="text-sm font-medium truncate" style={{ color:"#0F172A" }}>{a.nama}</div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background:badge.bg, color:badge.text }}>{badge.label}</span>
                      </div>
                    );
                  })}
                </div>

                {mySchedule.approvals.some(a=>a.status==="declined") && (
                  <div className="mx-5 mb-4 px-3 py-2 rounded-lg text-xs" style={{ background:"#FEE2E2", color:"#991B1B" }}>
                    ⚠ {mySchedule.approvals.filter(a=>a.status==="declined").map(a=>`${a.role}: ${a.declineReason||"Ditolak"}`).join(" · ")}
                  </div>
                )}
              </div>
            );
          })() : (
            <div className="rounded-xl border p-8 text-center" style={{ background:"#FFFBEB", borderColor:"#FDE68A" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background:"#FEF3C7" }}>{Icon.calendar}</div>
              <p className="font-semibold text-sm mb-1" style={{ color:"#D97706" }}>Jadwal belum ditetapkan</p>
              <p className="text-xs" style={{ color:"#92400E" }}>Admin akademik akan menginformasikan jadwal seminar Anda</p>
            </div>
          )}
        </div>
      ) : <p className="text-sm" style={{ color:"#94A3B8" }}>Data seminar tidak ditemukan</p>}
    </div>
  );
}

function MahasiswaKuliahPage({ currentUser, jadwalMhs, setJadwalMhs }: {
  currentUser: CurrentUser;
  jadwalMhs: JadwalKuliahMhs[];
  setJadwalMhs: React.Dispatch<React.SetStateAction<JadwalKuliahMhs[]>>;
}) {
  const nim = "2021001";
  const myKuliah = jadwalMhs.filter(j => j.nim === nim);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Omit<JadwalKuliahMhs,"id"|"nim">>(EMPTY_JADWAL_MHS);
  const nextId = useRef(SAMPLE_JADWAL_MHS.length + 1);

  const handleAdd = () => {
    if (!form.matkul.trim() || !form.ruangan.trim()) return;
    setJadwalMhs(prev => [...prev, { id: nextId.current++, nim, ...form }]);
    setForm(EMPTY_JADWAL_MHS);
    setShowAdd(false);
  };
  const handleDelete = (id: number) => setJadwalMhs(prev => prev.filter(j => j.id !== id));

  return (
    <div>
      <PageHeader title="Jadwal Kuliah Semester Ini" subtitle="Digunakan sebagai hard constraint GA — seminar tidak bentrok dengan jam kuliah">
        <button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>
          {Icon.plus} Tambah
        </button>
      </PageHeader>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg mb-4 text-xs font-medium" style={{ background:"#EEF2FF", color:"#4338CA" }}>
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {myKuliah.length} mata kuliah terdaftar sebagai hard constraint GA
      </div>

      {showAdd && (
        <div className="rounded-xl border p-4 mb-4 max-w-2xl" style={{ background:"#F8FAFC", borderColor:"#E2E8F0" }}>
          <h4 className="font-semibold text-sm mb-3" style={{ fontFamily:"DM Sans" }}>Tambah Jadwal Kuliah</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2 sm:col-span-3">
              <label className="text-xs font-medium block mb-1" style={{ color:"#374151" }}>Mata Kuliah</label>
              <input value={form.matkul} onChange={e=>setForm(f=>({...f,matkul:e.target.value}))} placeholder="Nama mata kuliah" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor:"#E2E8F0" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color:"#374151" }}>Kelas</label>
              <input value={form.kelas} onChange={e=>setForm(f=>({...f,kelas:e.target.value}))} placeholder="TI-4A" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor:"#E2E8F0" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color:"#374151" }}>Hari</label>
              <select value={form.hari} onChange={e=>setForm(f=>({...f,hari:e.target.value}))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor:"#E2E8F0" }}>
                {HARI_OPTIONS.map(h=><option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color:"#374151" }}>Ruangan</label>
              <input value={form.ruangan} onChange={e=>setForm(f=>({...f,ruangan:e.target.value}))} placeholder="R101" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor:"#E2E8F0" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color:"#374151" }}>Jam Mulai</label>
              <input type="time" value={form.jamMulai} onChange={e=>setForm(f=>({...f,jamMulai:e.target.value}))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor:"#E2E8F0" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color:"#374151" }}>Jam Selesai</label>
              <input type="time" value={form.jamSelesai} onChange={e=>setForm(f=>({...f,jamSelesai:e.target.value}))} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor:"#E2E8F0" }} />
            </div>
            <div className="col-span-2 sm:col-span-3">
              <label className="text-xs font-medium block mb-1" style={{ color:"#374151" }}>Dosen</label>
              <input value={form.dosen} onChange={e=>setForm(f=>({...f,dosen:e.target.value}))} placeholder="Nama dosen pengampu" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor:"#E2E8F0" }} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>Simpan</button>
            <button onClick={()=>{setShowAdd(false);setForm(EMPTY_JADWAL_MHS);}} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {myKuliah.map(j => (
          <div key={j.id} className="rounded-xl border p-4" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-sm" style={{ color:"#0F172A" }}>{j.matkul}</p>
              <button onClick={()=>handleDelete(j.id)} className="text-xs px-2 py-1 rounded" style={{ color:"#EF4444", background:"#FEF2F2" }}>Hapus</button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color:"#64748B" }}>
              <span>{j.hari} {j.jamMulai}–{j.jamSelesai}</span>
              <span>{j.ruangan}</span>
              <span>{j.kelas}</span>
            </div>
            <p className="text-xs mt-1" style={{ color:"#94A3B8" }}>{j.dosen}</p>
          </div>
        ))}
        {myKuliah.length === 0 && <p className="text-sm text-center py-6" style={{ color:"#94A3B8" }}>Belum ada jadwal kuliah</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block">
        <TableWrap>
          <table className="w-full text-sm">
            <thead style={{ background:"#F8FAFC" }}>
              <tr>{["Mata Kuliah","Kelas","Hari","Jam","Ruangan","Dosen",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {myKuliah.map((j,i) => (
                <tr key={j.id} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#FAFBFC" }}>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color:"#0F172A" }}>{j.matkul}</td>
                  <td className="px-4 py-3 text-sm" style={{ color:"#374151" }}>{j.kelas}</td>
                  <td className="px-4 py-3 text-sm" style={{ color:"#374151" }}>{j.hari}</td>
                  <td className="px-4 py-3 text-sm" style={{ fontFamily:"JetBrains Mono", color:"#4338CA" }}>{j.jamMulai}–{j.jamSelesai}</td>
                  <td className="px-4 py-3 text-sm" style={{ color:"#374151" }}>{j.ruangan}</td>
                  <td className="px-4 py-3 text-sm" style={{ color:"#64748B" }}>{j.dosen}</td>
                  <td className="px-4 py-3"><button onClick={()=>handleDelete(j.id)} className="text-xs px-2 py-1 rounded" style={{ color:"#EF4444", background:"#FEF2F2" }}>Hapus</button></td>
                </tr>
              ))}
              {myKuliah.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color:"#94A3B8" }}>Belum ada jadwal kuliah</td></tr>}
            </tbody>
          </table>
        </TableWrap>
      </div>
    </div>
  );
}

// ─── ADMIN APPROVAL STATUS PAGE ───────────────────────────────────────────────
function AdminApprovalPage({ schedule, setSchedule, dosens }: {
  schedule: ScheduleResult[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleResult[]>>;
  dosens: Dosen[];
}) {
  // collect unique dosen from all approvals
  const allDosen = [...new Set(schedule.flatMap(s => s.approvals.map(a => a.nama)))];

  const approvalByDosen = allDosen.map(nama => {
    const myApprovals = schedule.flatMap(s => s.approvals.filter(a => a.nama === nama).map(a => ({ ...a, slot: s })));
    const approved = myApprovals.filter(a => a.status === "approved").length;
    const pending  = myApprovals.filter(a => a.status === "pending").length;
    const declined = myApprovals.filter(a => a.status === "declined").length;
    return { nama, total: myApprovals.length, approved, pending, declined, items: myApprovals };
  });

  const [expanded, setExpanded] = useState<string|null>(null);
  const allApprovals = schedule.flatMap(s => s.approvals);
  const totalSlots    = allApprovals.length;
  const totalApproved = allApprovals.filter(a => a.status === "approved").length;
  const totalPending  = allApprovals.filter(a => a.status === "pending").length;
  const totalDeclined = allApprovals.filter(a => a.status === "declined").length;

  return (
    <div>
      <PageHeader title="Status Approval Jadwal" subtitle="Monitor persetujuan dosen terhadap slot jadwal seminar yang ditetapkan" />

      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Slot" value={totalSlots} />
        <StatCard label="Disetujui" value={totalApproved} color="#059669" />
        <StatCard label="Menunggu" value={totalPending} color="#D97706" />
        <StatCard label="Ditolak" value={totalDeclined} color="#DC2626" />
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border p-4 mb-6" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
        <div className="flex justify-between text-xs mb-2" style={{ color:"#64748B" }}>
          <span className="font-medium">Progress Approval Keseluruhan</span>
          <span style={{ fontFamily:"JetBrains Mono" }}>{totalSlots > 0 ? Math.round(totalApproved/totalSlots*100) : 0}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background:"#F1F5F9" }}>
          <div style={{ width:`${totalSlots>0?totalApproved/totalSlots*100:0}%`, background:"#059669", transition:"width 0.4s" }} />
          <div style={{ width:`${totalSlots>0?totalDeclined/totalSlots*100:0}%`, background:"#EF4444", transition:"width 0.4s" }} />
        </div>
        <div className="flex gap-4 mt-2 text-xs" style={{ color:"#94A3B8" }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background:"#059669" }} />Disetujui</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background:"#F59E0B" }} />Menunggu</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background:"#EF4444" }} />Ditolak</span>
        </div>
      </div>

      {/* Per-dosen breakdown */}
      <div className="flex flex-col gap-3">
        {approvalByDosen.map(d => {
          const allApproved = d.approved === d.total;
          const hasDeclined = d.declined > 0;
          const isExpanded = expanded === d.nama;
          return (
            <div key={d.nama} className="rounded-xl border overflow-hidden" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
              <button
                onClick={() => setExpanded(isExpanded ? null : d.nama)}
                className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: allApproved ? "#059669" : hasDeclined ? "#DC2626" : "#D97706" }}>
                    {d.nama.split(" ").filter(w=>w.length>2).slice(0,2).map(w=>w[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color:"#0F172A" }}>{d.nama}</p>
                    <p className="text-xs mt-0.5" style={{ color:"#94A3B8" }}>{d.total} slot — {d.approved} disetujui, {d.pending} menunggu, {d.declined} ditolak</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                    background: allApproved ? "#DCFCE7" : hasDeclined ? "#FEE2E2" : "#FEF9C3",
                    color: allApproved ? "#059669" : hasDeclined ? "#DC2626" : "#92400E",
                  }}>
                    {allApproved ? "Semua Disetujui" : hasDeclined ? `${d.declined} Ditolak` : "Menunggu"}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="#94A3B8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t" style={{ borderColor:"#F1F5F9" }}>
                  {d.items.map((item, idx) => {
                    const sc = item.status === "approved" ? { bg:"#DCFCE7", text:"#059669", label:"Disetujui" } : item.status === "declined" ? { bg:"#FEE2E2", text:"#DC2626", label:"Ditolak" } : { bg:"#FEF9C3", text:"#92400E", label:"Menunggu" };
                    return (
                      <div key={idx} className="px-5 py-3 flex items-start justify-between gap-3 border-b last:border-0" style={{ borderColor:"#F8FAFC" }}>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm" style={{ color:"#0F172A" }}>{item.slot.mahasiswa}</span>
                            <Badge type={item.slot.jenis === "Sempro" ? "info" : "success"} label={item.slot.jenis} />
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background:"#F1F5F9", color:"#64748B" }}>{item.role}</span>
                          </div>
                          <div className="text-xs" style={{ color:"#94A3B8", fontFamily:"JetBrains Mono" }}>{item.slot.tanggal} · {item.slot.jam} · {item.slot.ruangan}</div>
                          {item.status === "declined" && item.declineReason && (
                            <div className="text-xs mt-1" style={{ color:"#DC2626" }}>Alasan: {item.declineReason}</div>
                          )}
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background:sc.bg, color:sc.text }}>{sc.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KaprodiLaporanPage({ history }: { history: HistoryItem[] }) {
  const totalSeminar = history.reduce((a, h) => a + h.jumlahSeminar, 0);
  const avgFitness = history.length ? (history.reduce((a, h) => a + h.fitnessScore, 0) / history.length).toFixed(1) : "0";
  const totalConflict = history.reduce((a, h) => a + h.conflict, 0);
  return (
    <div>
      <PageHeader title="Laporan Penjadwalan" subtitle="Ringkasan dan ekspor data jadwal seminar">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>
            {Icon.excel} Export Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background:"#4338CA" }}>
            {Icon.print} Export PDF
          </button>
        </div>
      </PageHeader>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Jadwal" value={history.length} color="#059669" />
        <StatCard label="Total Seminar" value={totalSeminar} color="#059669" />
        <StatCard label="Avg Fitness" value={`${avgFitness}%`} color="#059669" />
      </div>
      <TableWrap>
        <table className="w-full text-sm min-w-[600px]">
          <thead style={{ background:"#F8FAFC" }}>
            <tr>{["Nama Jadwal","Jenis","Periode","Seminar","Fitness","Konflik","Status"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color:"#94A3B8", borderBottom:"1px solid #E2E8F0" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id} style={{ borderBottom:"1px solid #F8FAFC" }}
                onMouseEnter={e => (e.currentTarget.style.background="#FAFAFA")}
                onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                <td className="px-4 py-3 text-xs font-semibold">{h.nama}</td>
                <td className="px-4 py-3"><Badge type={h.jenis === "Sempro" ? "info" : "success"} label={h.jenis} /></td>
                <td className="px-4 py-3 text-xs">{h.periode}</td>
                <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono" }}>{h.jumlahSeminar}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{ fontFamily:"JetBrains Mono", color:h.fitnessScore>=95?"#059669":"#D97706" }}>{h.fitnessScore}%</td>
                <td className="px-4 py-3 text-xs" style={{ fontFamily:"JetBrains Mono", color:h.conflict===0?"#059669":"#DC2626" }}>{h.conflict}</td>
                <td className="px-4 py-3"><Badge type={h.status === "Tersimpan" ? "success" : "warning"} label={h.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      <div className="mt-4 p-4 rounded-xl" style={{ background:"#F8FAFC", border:"1px solid #E2E8F0" }}>
        <div className="text-xs" style={{ color:"#64748B" }}>Total konflik keseluruhan: <span className="font-semibold" style={{ color:totalConflict===0?"#059669":"#DC2626" }}>{totalConflict}</span></div>
      </div>
    </div>
  );
}

// ─── KAPRODI APPROVE PAGE ─────────────────────────────────────────────────────
function KaprodiApprovePage({ history, setHistory }: { history: HistoryItem[]; setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>> }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState<number|null>(null);
  const [rejectReason, setRejectReason] = useState("");
  // For demo: first item is "Menunggu Approval" if it exists
  const pendingIds = history.length > 0 ? [history[0].id] : [];
  const getStatus = (h: HistoryItem) => pendingIds.includes(h.id) && h.status === "Tersimpan" ? "Menunggu Approval" : h.status;

  const handleApprove = (id: number) => {
    // Just mark it as Tersimpan (already is, but remove from pending)
    pendingIds.splice(pendingIds.indexOf(id), 1);
    setHistory(hs => hs.map(h => h.id === id ? { ...h, status:"Tersimpan" } : h));
  };
  const handleReject = () => {
    if (rejectId !== null) setHistory(hs => hs.filter(h => h.id !== rejectId));
    setShowRejectModal(false);
    setRejectId(null);
    setRejectReason("");
  };

  return (
    <div>
      <PageHeader title="Approve Jadwal" subtitle="Review dan setujui jadwal seminar yang diajukan" />
      <div className="flex flex-col gap-3">
        {history.map(h => {
          const status = getStatus(h);
          const isPending = status === "Menunggu Approval";
          return (
            <div key={h.id} className="rounded-xl border p-4 sm:p-5" style={{ background:"#fff", borderColor: isPending ? "#FDE68A" : "#E2E8F0" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-sm" style={{ fontFamily:"DM Sans" }}>{h.nama}</span>
                    <Badge type={h.jenis === "Sempro" ? "info" : "success"} label={h.jenis} />
                    {isPending
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background:"#FEF3C7", color:"#D97706" }}>Menunggu Approval</span>
                      : <Badge type="success" label="Approved" />
                    }
                  </div>
                  <div className="text-xs" style={{ color:"#94A3B8" }}>{h.tanggalGenerate} · {h.periode} · {h.jumlahSeminar} seminar · Fitness {h.fitnessScore}%</div>
                </div>
                {isPending && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleApprove(h.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ background:"#059669" }}>
                      {Icon.check} Approve
                    </button>
                    <button onClick={() => { setRejectId(h.id); setShowRejectModal(true); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border" style={{ borderColor:"#FCA5A5", color:"#DC2626" }}>
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <p className="text-sm font-medium" style={{ color:"#374151" }}>Tidak ada jadwal</p>
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ background:"rgba(15,23,42,0.55)" }}>
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
            <h3 className="font-bold text-base mb-2" style={{ fontFamily:"DM Sans" }}>Tolak Jadwal</h3>
            <p className="text-sm mb-4" style={{ color:"#64748B" }}>Berikan alasan penolakan:</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor:"#E2E8F0" }}
              placeholder="Alasan penolakan..." />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowRejectModal(false); setRejectId(null); setRejectReason(""); }} className="flex-1 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor:"#E2E8F0", color:"#374151" }}>Batal</button>
              <button onClick={handleReject} className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background:"#DC2626" }}>Tolak Jadwal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [currentUser, setCurrentUser] = useState<CurrentUser|null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Shared master data — lifted so DataDosen and JadwalDosen share the same state
  const [dosens, setDosens] = useState<Dosen[]>(INITIAL_DOSEN);
  const [jadwals, setJadwals] = useState<JadwalDosen[]>(INITIAL_JADWAL_DOSEN);
  const [seminars, setSeminars] = useState<SeminarData[]>(SAMPLE_SEMINARS);
  const [seminarType, setSeminarType] = useState<SeminarType|null>(null);
  const [namaJadwal, setNamaJadwal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(SAMPLE_HISTORY);
  const [lastSavedId, setLastSavedId] = useState<number|null>(null);
  const historyNextId = useRef(SAMPLE_HISTORY.length + 1);
  const [jadwalMhs, setJadwalMhs] = useState<JadwalKuliahMhs[]>(SAMPLE_JADWAL_MHS);
  const [schedule, setSchedule] = useState<ScheduleResult[]>(SAMPLE_SCHEDULE);


  const navigate = (p: Page) => {
    if (p === "login") setCurrentUser(null);
    if (p !== "jadwal") setLastSavedId(null);
    setPage(p);
    setSidebarOpen(false);
  };

  // Page title map
  const pageTitles: Record<Page, string> = {
    login:"Login", dashboard:"Dashboard", upload:"Buat Penjadwalan",
    preview:"Preview & Validasi", config:"Konfigurasi", generate:"Generate Jadwal",
    results:"Hasil Jadwal", calendar:"Kalender", history:"Riwayat", jadwal:"Jadwal",
    "data-dosen":"Data Dosen", "jadwal-dosen":"Jadwal Dosen", rooms:"Ruangan", settings:"",
    "dosen-seminar":"Seminar Saya", "dosen-blokir":"Blokir Waktu",
    "dosen-approve":"Approve Jadwal", "mhs-jadwal":"Jadwal Seminar", "mhs-kuliah":"Jadwal Kuliah", "kaprodi-laporan":"Laporan", "kaprodi-approve":"Approve Jadwal",
  };

  if (!currentUser || page === "login") {
    return <LoginPage onLogin={(u) => { setCurrentUser(u); setPage(u.role === "mahasiswa" ? "mhs-jadwal" : "dashboard"); }} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":       return <DashboardPage currentUser={currentUser} history={history} onNavigate={navigate} />;
      case "upload":          return <UploadPage seminarType={seminarType} setSeminarType={setSeminarType} onNext={()=>navigate("preview")} />;
      case "preview":         return <PreviewPage dosens={dosens} seminars={seminars.filter(s=>!seminarType||s.jenis===seminarType)} setSeminars={setSeminars} seminarType={seminarType} onNext={()=>navigate("config")} onBack={()=>navigate("upload")} />;
      case "config":          return <ConfigPage seminarType={seminarType} namaJadwal={namaJadwal} setNamaJadwal={setNamaJadwal} onNext={()=>navigate("generate")} onBack={()=>navigate("preview")} />;
      case "generate":        return <GeneratePage namaJadwal={namaJadwal} onDone={()=>{
        const id = historyNextId.current++;
        const nama = namaJadwal.trim() || `Jadwal ${seminarType??"Seminar"} ${new Date().toLocaleDateString("id-ID",{month:"short",year:"numeric"})}`;
        setHistory(h=>[{id,nama,jenis:seminarType??"Sempro",tanggalGenerate:new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}),periode:"Sep 2025",jumlahSeminar:6,fitnessScore:98.4,conflict:0,status:"Tersimpan"},...h]);
        setLastSavedId(id);
        setNamaJadwal("");
        navigate("jadwal");
      }} />;
      case "jadwal":          return <JadwalPage history={history} setHistory={setHistory} initialSelected={lastSavedId} schedule={schedule} />;
      case "results":         return <JadwalPage history={history} setHistory={setHistory} schedule={schedule} />;
      case "calendar":        return <JadwalPage history={history} setHistory={setHistory} schedule={schedule} />;
      case "history":         return <JadwalPage history={history} setHistory={setHistory} schedule={schedule} />;
      case "data-dosen":      return <DataDosenPage dosens={dosens} setDosens={setDosens} jadwals={jadwals} onNavigate={navigate} />;
      case "jadwal-dosen":    return <JadwalDosenPage dosens={dosens} jadwals={jadwals} setJadwals={setJadwals} />;
      case "rooms":           return <RoomsPage />;
      case "dosen-seminar":   return <DosenSeminarPage currentUser={currentUser} dosens={dosens} />;
      case "dosen-blokir":    return <DosenBlokirPage currentUser={currentUser} dosens={dosens} jadwals={jadwals} setJadwals={setJadwals} />;
      case "dosen-approve":   return <DosenApprovePage currentUser={currentUser} schedule={schedule} setSchedule={setSchedule} />;
      case "mhs-jadwal":      return <MahasiswaJadwalPage currentUser={currentUser} schedule={schedule} />;
      case "mhs-kuliah":      return <MahasiswaKuliahPage currentUser={currentUser} jadwalMhs={jadwalMhs} setJadwalMhs={setJadwalMhs} />;
      case "kaprodi-approve": return <AdminApprovalPage schedule={schedule} setSchedule={setSchedule} dosens={dosens} />;
      case "settings":        return <DashboardPage currentUser={currentUser} history={history} onNavigate={navigate} />;
      default:                return <DashboardPage currentUser={currentUser} history={history} onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background:"#F8FAFC" }}>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen shrink-0 sticky top-0" style={{ background:"#0F172A", height:"100vh" }}>
        <SidebarContent current={page} currentUser={currentUser} onNavigate={navigate} />
      </aside>

      {/* ── Mobile sidebar drawer ────────────────────────────── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background:"rgba(0,0,0,0.5)" }} onClick={()=>setSidebarOpen(false)} />
          {/* Drawer */}
          <div className="relative w-72 max-w-[85vw] h-full flex flex-col z-50 shadow-2xl" style={{ background:"#0F172A" }}>
            <SidebarContent current={page} currentUser={currentUser} onNavigate={navigate} />
          </div>
        </div>
      )}

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b" style={{ background:"#fff", borderColor:"#E2E8F0" }}>
          <button onClick={()=>setSidebarOpen(true)} className="p-1.5 rounded-lg -ml-1" style={{ color:"#374151" }}>{Icon.menu}</button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background:"#4338CA" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 3c.621 4.5 4.5 6 4.5 9s-3.879 4.5-4.5 9M19.5 3c-.621 4.5-4.5 6-4.5 9s3.879 4.5 4.5 9M9 6h6M8 12h8M9 18h6"/></svg>
            </div>
            <span className="font-semibold text-sm truncate" style={{ fontFamily:"DM Sans" }}>{pageTitles[page]}</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" style={{ background:"#4338CA" }}>{currentUser.initials}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
