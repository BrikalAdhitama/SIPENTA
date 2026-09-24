// Saklar tampilan mobile ↔ web. Satu sumber untuk semua halaman & layout.
// Nilainya diisi & dipantau oleh plugins/layout-mode.client.ts.
//   < 768px (sama dengan breakpoint `md` Tailwind) atau di dalam APK  → mobile
//   selain itu                                                        → web

export const MOBILE_MAX_WIDTH = 767;

export function useLayoutMode() {
  const isMobile = useState<boolean>("layout:isMobile", () => false);
  return { isMobile: readonly(isMobile) };
}
