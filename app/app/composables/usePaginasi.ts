// Paginasi sisi-klien untuk tabel admin ("Showing data 1 to 8 of N entries").
// `sumber` = daftar yang SUDAH difilter. Halaman otomatis kembali ke 1 saat daftar berubah jauh,
// dan dijepit bila halaman saat ini melebihi jumlah halaman (mis. setelah hapus data).
export function usePaginasi<T>(sumber: Ref<T[]>, ukuran = 8) {
  const halaman = ref(1);
  const total = computed(() => sumber.value.length);
  const potong = computed(() => sumber.value.slice((halaman.value - 1) * ukuran, halaman.value * ukuran));

  watch(total, (n) => {
    const maks = Math.max(1, Math.ceil(n / ukuran));
    if (halaman.value > maks) halaman.value = maks;
  });

  const ulang = () => (halaman.value = 1);
  return { halaman, total, potong, ukuran, ulang };
}
