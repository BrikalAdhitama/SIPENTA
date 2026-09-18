"""Fase 4: fitness. Hard = H1, H2 (H3-H5 sudah 0 lewat reduksi domain). Soft = S0-S5.

Kromosom = list[int] sepanjang jumlah seminar; nilai = index slot, atau -1 bila
seminar itu unscheduled (domain kosong).
"""

from __future__ import annotations

import statistics
from dataclasses import dataclass, field

from app.ga.context import Context, Slot
from app.ga.timeutil import overlap

Chromosome = list[int]


@dataclass
class FitnessBreakdown:
    v_hard: int
    soft_score: float
    fitness: float
    detail: dict = field(default_factory=dict)


def _cv(values: list[float]) -> float:
    """Koefisien variasi (stdev/mean), 0 bila kosong/rata."""
    vals = [v for v in values if v is not None]
    if len(vals) < 2:
        return 0.0
    m = statistics.fmean(vals)
    if m == 0:
        return 0.0
    return statistics.pstdev(vals) / m


def evaluate(chromo: Chromosome, ctx: Context, slots: list[Slot]) -> FitnessBreakdown:
    req = ctx.req
    # slot terpakai per seminar (yang terjadwal saja)
    placed: list[tuple[int, Slot]] = [
        (i, slots[g]) for i, g in enumerate(chromo) if g >= 0
    ]

    # ── H1: bentrok ruangan (skip online) ────────────────────────────────────
    h1 = 0
    by_room_date: dict[tuple[str, str], list[Slot]] = {}
    for _i, sl in placed:
        if sl.is_online:
            continue
        by_room_date.setdefault((sl.ruangan, sl.tanggal), []).append(sl)
    for group in by_room_date.values():
        for a in range(len(group)):
            for b in range(a + 1, len(group)):
                if overlap(group[a].start, group[a].end, group[b].start, group[b].end):
                    h1 += 1

    # ── H2: dosen di 2 seminar bersamaan (lintas 4 peran) ────────────────────
    h2 = 0
    dosen_slots: dict[int, list[Slot]] = {}
    for i, sl in placed:
        for d in set(req.seminars[i].dosen_ids):
            dosen_slots.setdefault(d, []).append(sl)
    for sl_list in dosen_slots.values():
        for a in range(len(sl_list)):
            for b in range(a + 1, len(sl_list)):
                if sl_list[a].tanggal == sl_list[b].tanggal and overlap(
                    sl_list[a].start, sl_list[a].end, sl_list[b].start, sl_list[b].end
                ):
                    h2 += 1

    v_hard = h1 + h2
    n = max(1, len(placed))

    # ── S0: dosen menguji > 1 topik / hari (peran penguji saja) ──────────────
    penguji_day: dict[tuple[int, str], int] = {}
    for i, sl in placed:
        for d in set(req.seminars[i].penguji_ids):
            penguji_day[(d, sl.tanggal)] = penguji_day.get((d, sl.tanggal), 0) + 1
    s0_excess = sum(max(0, c - 1) for c in penguji_day.values())
    s0 = s0_excess / n

    # ── S1: total keterlibatan dosen > 1 / hari (semua peran) ────────────────
    total_day: dict[tuple[int, str], int] = {}
    for i, sl in placed:
        for d in set(req.seminars[i].dosen_ids):
            total_day[(d, sl.tanggal)] = total_day.get((d, sl.tanggal), 0) + 1
    s1_excess = sum(max(0, c - 1) for c in total_day.values())
    s1 = s1_excess / n

    # ── S2: beban total antar dosen tidak merata ────────────────────────────
    load: dict[int, int] = {}
    for i, _sl in placed:
        for d in set(req.seminars[i].dosen_ids):
            load[d] = load.get(d, 0) + 1
    s2 = min(1.0, _cv(list(load.values())))

    # ── S3: gap kosong dalam 1 ruangan / hari ───────────────────────────────
    idle, span = 0, 0
    for group in by_room_date.values():
        g = sorted(group, key=lambda x: x.start)
        span += g[-1].end - g[0].start
        for a in range(len(g) - 1):
            idle += max(0, g[a + 1].start - g[a].end)
    s3 = (idle / span) if span else 0.0

    # ── S4: sebaran seminar antar hari ─────────────────────────────────────
    per_day: dict[str, int] = {}
    for _i, sl in placed:
        per_day[sl.tanggal] = per_day.get(sl.tanggal, 0) + 1
    s4 = min(1.0, _cv(list(per_day.values())))

    # ── S5: dosen lompat ruangan antar sidang berurutan ────────────────────
    hops, adj = 0, 0
    for sl_list in dosen_slots.values():
        by_day: dict[str, list[Slot]] = {}
        for sl in sl_list:
            by_day.setdefault(sl.tanggal, []).append(sl)
        for day_slots in by_day.values():
            g = sorted(day_slots, key=lambda x: x.start)
            for a in range(len(g) - 1):
                adj += 1
                if g[a].ruangan != g[a + 1].ruangan:
                    hops += 1
    s5 = (hops / adj) if adj else 0.0

    w = req.ga_params.soft_weights
    soft_score = (
        w["s0_menguji_lebih_dari_1_per_hari"] * s0
        + w["s1_total_peran_lebih_dari_1_per_hari"] * s1
        + w["s2_beban_merata_antar_dosen"] * s2
        + w["s3_gap_kosong_ruangan"] * s3
        + w["s4_sebar_antar_hari"] * s4
        + w["s5_dosen_lompat_ruangan"] * s5
    )
    fitness = 1000.0 / (1.0 + 100.0 * v_hard + 10.0 * soft_score)

    return FitnessBreakdown(
        v_hard=v_hard,
        soft_score=soft_score,
        fitness=fitness,
        detail={
            "h1_bentrok_ruangan": h1,
            "h2_bentrok_dosen": h2,
            "s0_menguji_lebih_dari_1": s0_excess,
            "s1_keterlibatan_lebih_dari_1": s1_excess,
            "s2_cv_beban": round(s2, 3),
            "s3_rasio_gap": round(s3, 3),
            "s4_cv_per_hari": round(s4, 3),
            "s5_rasio_lompat_ruangan": round(s5, 3),
        },
    )
