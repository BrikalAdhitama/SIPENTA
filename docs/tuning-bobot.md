# Tuning bobot soft constraint

Seed: 42 (nilai = rata-rata). S0 & S1 = jumlah kelebihan penugasan; S2 = koefisien variasi beban dosen; makin kecil makin baik.

| Dataset | Konfigurasi bobot | Bentrok (hard) | S0 | S1 | S2 | Skor | Detik |
|---|---|---|---|---|---|---|---|
| `contoh_sempro_februari` | Dipakai (10·5·4·3·2·1) | 0.0 | 0.0 | 7.0 | 0.125 | 82.1 | 4.9 |
|  | Tanpa S0 & S1 (0·0·4·3·2·1) | 0.0 | 3.0 | 15.0 | 0.125 | 95.6 | 2.7 |
|  | Semua sama (1·1·1·1·1·1) | 0.0 | 2.0 | 9.0 | 0.125 | 94.6 | 2.4 |
|  | S0 digandakan (20·5·4·3·2·1) | 0.0 | 0.0 | 6.0 | 0.125 | 82.7 | 3.4 |
| `genap2526_semhas_april` | Dipakai (10·5·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.354 | 94.3 | 0.8 |
|  | Tanpa S0 & S1 (0·0·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.354 | 94.3 | 0.8 |
|  | Semua sama (1·1·1·1·1·1) | 0.0 | 0.0 | 0.0 | 0.354 | 98.6 | 0.9 |
|  | S0 digandakan (20·5·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.354 | 94.3 | 0.6 |
| `genap2526_semhas_juni` | Dipakai (10·5·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.453 | 92.7 | 1.8 |
|  | Tanpa S0 & S1 (0·0·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.453 | 92.7 | 1.7 |
|  | Semua sama (1·1·1·1·1·1) | 0.0 | 0.0 | 0.0 | 0.453 | 98.2 | 2.0 |
|  | S0 digandakan (20·5·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.453 | 92.7 | 1.7 |
| `genap2526_sempro_februari` | Dipakai (10·5·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.346 | 94.5 | 1.9 |
|  | Tanpa S0 & S1 (0·0·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.346 | 94.5 | 1.9 |
|  | Semua sama (1·1·1·1·1·1) | 0.0 | 0.0 | 0.0 | 0.346 | 98.6 | 1.7 |
|  | S0 digandakan (20·5·4·3·2·1) | 0.0 | 0.0 | 0.0 | 0.346 | 94.5 | 2.2 |

## Rekapitulasi seluruh dataset

| Konfigurasi bobot | Total S0 | Total S1 | Bentrok hard |
|---|---|---|---|
| Dipakai (10·5·4·3·2·1) | 0 | 7 | 0 |
| Tanpa S0 & S1 (0·0·4·3·2·1) | 3 | 15 | 0 |
| Semua sama (1·1·1·1·1·1) | 2 | 9 | 0 |
| S0 digandakan (20·5·4·3·2·1) | 0 | 6 | 0 |

## Kesimpulan

- **Bentrok hard tetap 0 pada semua konfigurasi.** Bobot soft hanya memengaruhi kualitas jadwal, bukan kelayakannya.
- **Bobot yang dipakai bekerja.** Dengan 10·5·…·1 total pelanggaran S0 = 0 dan S1 = 7; bila S0 & S1 dimatikan keduanya naik menjadi 3 dan 15; bila semua bobot disamakan menjadi 2 dan 9.
- **Menggandakan S0 tidak banyak membantu** karena S0 sudah 0 pada konfigurasi yang dipakai — bobot 10 sudah memadai.
- **S2 (pemerataan beban) tidak berubah sama sekali antar konfigurasi.** Beban tiap dosen ditentukan oleh pembagian pembimbing/penguji, bukan oleh jadwal, sehingga tidak bisa diperbaiki lewat bobot.

> Catatan membaca tabel: kolom **Skor** dihitung memakai bobot konfigurasi itu sendiri, jadi **tidak bisa dibandingkan antar baris**. Perbandingan yang sah adalah jumlah pelanggaran S0 dan S1.
