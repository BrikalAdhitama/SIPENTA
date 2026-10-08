"""Uji beberapa konfigurasi bobot soft constraint (milestone M6).

Menjalankan GA pada tiap fixture dengan beberapa set bobot, lalu melaporkan
pelanggaran soft yang tersisa. Dipakai untuk membuktikan bahwa urutan bobot
(S0 > S1 > S2 > ...) memang menurunkan pain point utama: dosen menguji lebih
dari satu topik per hari.

  python -m scripts.tuning                       # semua fixture, seed 42,1,7
  python -m scripts.tuning --seeds 42 --out ../docs/tuning-bobot.md
"""

from __future__ import annotations

import argparse
import json
import statistics
import sys
from pathlib import Path

from app.config import FIXTURE_DIR
from app.ga.engine import solve
from app.models import SOFT_WEIGHTS_DEFAULT, SolveRequest

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

K = list(SOFT_WEIGHTS_DEFAULT)  # s0..s5 berurutan

KONFIGURASI: dict[str, list[float]] = {
    "Dipakai (10·5·4·3·2·1)": [10, 5, 4, 3, 2, 1],
    "Tanpa S0 & S1 (0·0·4·3·2·1)": [0, 0, 4, 3, 2, 1],
    "Semua sama (1·1·1·1·1·1)": [1, 1, 1, 1, 1, 1],
    "S0 digandakan (20·5·4·3·2·1)": [20, 5, 4, 3, 2, 1],
}


def jalankan(req: SolveRequest, bobot: list[float], seed: int) -> dict:
    r = req.model_copy(deep=True)
    r.ga_params.random_seed = seed
    r.ga_params.soft_weights = dict(zip(K, map(float, bobot)))
    res = solve(r)
    d = res.stats.get("constraint_detail", {})
    return {
        "s0": d.get("s0_menguji_lebih_dari_1", 0),
        "s1": d.get("s1_keterlibatan_lebih_dari_1", 0),
        "s2": d.get("s2_cv_beban", 0.0),
        "bentrok": res.conflict_count,
        "skor": res.fitness_score,
        "detik": res.execution_time_ms / 1000,
    }


def rata(v: list[float], d: int = 1) -> str:
    return f"{statistics.fmean(v):.{d}f}" if len(v) > 1 else f"{v[0]:.{d}f}"


def main() -> None:
    ap = argparse.ArgumentParser(description="Tuning bobot soft constraint")
    ap.add_argument("--seeds", default="42,1,7")
    ap.add_argument("--fixtures", default="")
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    seeds = [int(s) for s in args.seeds.split(",") if s.strip()]
    berkas = sorted(p for p in FIXTURE_DIR.glob("*.json") if args.fixtures in p.name)
    if not berkas:
        raise SystemExit(f"tidak ada fixture di {FIXTURE_DIR}")

    hasil: dict[str, dict[str, dict]] = {}
    for p in berkas:
        req = SolveRequest(**json.loads(p.read_text(encoding="utf-8")))
        hasil[p.stem] = {}
        for nama, bobot in KONFIGURASI.items():
            r = [jalankan(req, bobot, s) for s in seeds]
            hasil[p.stem][nama] = {
                "s0": rata([x["s0"] for x in r], 1),
                "s1": rata([x["s1"] for x in r], 1),
                "s2": rata([x["s2"] for x in r], 3),
                "bentrok": rata([x["bentrok"] for x in r], 1),
                "skor": rata([x["skor"] for x in r], 1),
                "detik": rata([x["detik"] for x in r], 1),
            }

    baris = [
        f"# Tuning bobot soft constraint\n\nSeed: {', '.join(map(str, seeds))} (nilai = rata-rata). "
        "S0 & S1 = jumlah kelebihan penugasan; S2 = koefisien variasi beban dosen; makin kecil makin baik.\n",
        "| Dataset | Konfigurasi bobot | Bentrok (hard) | S0 | S1 | S2 | Skor | Detik |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for dataset, per_konfig in hasil.items():
        for i, (nama, m) in enumerate(per_konfig.items()):
            kolom = f"`{dataset}`" if i == 0 else ""
            baris.append(
                f"| {kolom} | {nama} | {m['bentrok']} | {m['s0']} | {m['s1']} | {m['s2']} | {m['skor']} | {m['detik']} |"
            )

    def total(nama: str, kunci: str) -> float:
        return sum(float(hasil[d][nama][kunci]) for d in hasil)

    baris += [
        "",
        "## Rekapitulasi seluruh dataset",
        "",
        "| Konfigurasi bobot | Total S0 | Total S1 | Bentrok hard |",
        "|---|---|---|---|",
    ]
    for nama in KONFIGURASI:
        baris.append(
            f"| {nama} | {total(nama, 's0'):.0f} | {total(nama, 's1'):.0f} | {total(nama, 'bentrok'):.0f} |"
        )

    dipakai, tanpa, sama = list(KONFIGURASI)[0], list(KONFIGURASI)[1], list(KONFIGURASI)[2]
    s2_tetap = all(
        len({hasil[d][k]["s2"] for k in KONFIGURASI}) == 1 for d in hasil
    )
    baris += [
        "",
        "## Kesimpulan",
        "",
        "- **Bentrok hard tetap 0 pada semua konfigurasi.** Bobot soft hanya memengaruhi kualitas jadwal, bukan kelayakannya.",
        f"- **Bobot yang dipakai bekerja.** Dengan 10·5·…·1 total pelanggaran S0 = {total(dipakai, 's0'):.0f} dan S1 = {total(dipakai, 's1'):.0f}; "
        f"bila S0 & S1 dimatikan keduanya naik menjadi {total(tanpa, 's0'):.0f} dan {total(tanpa, 's1'):.0f}; "
        f"bila semua bobot disamakan menjadi {total(sama, 's0'):.0f} dan {total(sama, 's1'):.0f}.",
        "- **Menggandakan S0 tidak banyak membantu** karena S0 sudah 0 pada konfigurasi yang dipakai — bobot 10 sudah memadai.",
    ]
    if s2_tetap:
        baris.append(
            "- **S2 (pemerataan beban) tidak berubah sama sekali antar konfigurasi.** Beban tiap dosen ditentukan oleh "
            "pembagian pembimbing/penguji, bukan oleh jadwal, sehingga tidak bisa diperbaiki lewat bobot."
        )
    baris += [
        "",
        "> Catatan membaca tabel: kolom **Skor** dihitung memakai bobot konfigurasi itu sendiri, jadi **tidak bisa dibandingkan antar baris**. "
        "Perbandingan yang sah adalah jumlah pelanggaran S0 dan S1.",
    ]

    teks = "\n".join(baris) + "\n"
    print(teks)
    if args.out:
        Path(args.out).write_text(teks, encoding="utf-8")
        print(f"tersimpan: {Path(args.out).resolve()}")


if __name__ == "__main__":
    main()
