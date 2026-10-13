// Kelas Tailwind bersama untuk kontrol form di halaman web admin (dua gaya mengikuti Figma).
const DASAR = "w-full rounded-xl border text-sm text-[#0f172a] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

/** gaya "a" — Ruangan, Mahasiswa: latar abu muda */
export const INPUT_ABU = `${DASAR} h-11 border-[#e2e8f0] bg-[#f8fafc] px-4 disabled:text-meta`;
/** gaya "b" — Dosen, Jadwal Dosen: latar putih bergaris */
export const INPUT_CLASS = `${DASAR} h-11 border-line bg-white px-4 disabled:bg-line-soft disabled:text-meta`;

export type ChipTone = "success" | "warning" | "danger" | "neutral";
