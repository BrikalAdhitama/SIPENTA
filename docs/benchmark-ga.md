# Benchmark GA vs penyusunan manual

Seed: 42, 1, 7. Angka GA ditulis rata-rata (min–maks) bila lebih dari satu seed.

| Dataset | Seminar | Metode | Terjadwal | Bentrok ruangan (H1) | Bentrok dosen (H2) | Tabrakan mengajar/pribadi/kuliah (H3–H5) | Dosen menguji >1/hari (S0) | Dosen >1 seminar/hari (S1) | Hari dipakai | Skor | Generasi | Detik |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `contoh_sempro_februari` | 12 | Manual | 12 | 0 | 16 | 6 | 1 | 16 | 4 | — | — | — |
| | | **GA** | 12 (12–12) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 6 (6–7) | 5 (5–5) | 82.9 (82.1–83.5) | 177 (135–243) | 3.1 (2.3–3.9) |
| `genap2526_semhas_april` | 2 | Manual | 2 | 0 | 0 | 2 | 0 | 2 | 1 | — | — | — |
| | | **GA** | 2 (2–2) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 2 (2–2) | 94.3 (94.3–94.3) | 60 (60–60) | 0.5 (0.5–0.6) |
| `genap2526_semhas_juni` | 15 | Manual | 15 | 0 | 15 | 10 | 5 | 14 | 5 | — | — | — |
| | | **GA** | 14 (14–14) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 14 (14–14) | 92.7 (92.7–92.7) | 61 (60–61) | 1.6 (1.4–1.8) |
| `genap2526_sempro_februari` | 15 | Manual | 15 | 0 | 19 | 7 | 7 | 18 | 5 | — | — | — |
| | | **GA** | 15 (15–15) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 0 (0–0) | 15 (15–15) | 94.5 (94.5–94.5) | 66 (63–72) | 1.9 (1.7–2.1) |

## Kesimpulan

- Penyusunan manual menghasilkan **75 pelanggaran hard constraint** pada 4 dataset; GA **0** di seluruh dataset dan seed.
- Hard constraint H3–H5 selalu 0 pada GA karena ditangani lewat reduksi domain sebelum evolusi.
- Waktu komputasi GA di bawah 5 detik per gelombang (≤ 15 seminar).

Catatan:
- `genap2526_semhas_juni`: 1 seminar tidak mendapat slot layak (domain kosong setelah H3–H5).
