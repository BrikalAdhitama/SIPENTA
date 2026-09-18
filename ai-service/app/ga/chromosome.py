"""Kromosom = list[int]; posisi i = seminar i, nilai = index slot dari domain[i]
(atau -1 bila domain[i] kosong = unscheduled)."""

from __future__ import annotations

import random

from app.ga.context import Context, Slot
from app.ga.fitness import Chromosome, evaluate

RNG = random.Random


def random_chromosome(domains: list[list[int]], rng: RNG) -> Chromosome:
    return [rng.choice(dom) if dom else -1 for dom in domains]


def greedy_chromosome(
    ctx: Context, slots: list[Slot], domains: list[list[int]], rng: RNG
) -> Chromosome:
    """First-fit: tempatkan seminar (urut domain paling sempit dulu) ke slot
    pertama yang tidak menambah bentrok ruangan/dosen. Bikin populasi awal
    dekat feasible → konvergensi cepat."""
    order = sorted(range(len(domains)), key=lambda i: len(domains[i]) or 10**9)
    chromo: Chromosome = [-1] * len(domains)
    used_room: set[tuple[str, str, int]] = set()  # (ruangan, tgl, start)
    dosen_busy: set[tuple[int, str, int]] = set()  # (dosen, tgl, start)

    for i in order:
        dom = domains[i]
        if not dom:
            continue
        cand = dom[:]
        rng.shuffle(cand)
        cand.sort(key=lambda gi: (slots[gi].tanggal, slots[gi].start))
        chosen = cand[0]
        for gi in cand:
            sl = slots[gi]
            room_key = (sl.ruangan, sl.tanggal, sl.start)
            if not sl.is_online and room_key in used_room:
                continue
            dset = set(ctx.req.seminars[i].dosen_ids)
            if any((d, sl.tanggal, sl.start) in dosen_busy for d in dset):
                continue
            chosen = gi
            break
        sl = slots[chosen]
        chromo[i] = chosen
        if not sl.is_online:
            used_room.add((sl.ruangan, sl.tanggal, sl.start))
        for d in set(ctx.req.seminars[i].dosen_ids):
            dosen_busy.add((d, sl.tanggal, sl.start))
    return chromo


def initial_population(
    ctx: Context, slots: list[Slot], domains: list[list[int]], size: int, rng: RNG
) -> list[Chromosome]:
    pop = [greedy_chromosome(ctx, slots, domains, rng)]
    pop += [random_chromosome(domains, rng) for _ in range(size - 1)]
    return pop


def decode(chromo: Chromosome, slots: list[Slot], ctx: Context) -> list[dict]:
    out = []
    for i, g in enumerate(chromo):
        if g < 0:
            continue
        sl = slots[g]
        out.append(
            {
                "seminar_id": ctx.req.seminars[i].id,
                "tanggal": sl.tanggal,
                "jam_mulai": _hhmm(sl.start),
                "jam_selesai": _hhmm(sl.end),
                "ruangan": sl.ruangan,
            }
        )
    return out


def _hhmm(m: int) -> str:
    return f"{m // 60:02d}:{m % 60:02d}"


__all__ = ["random_chromosome", "greedy_chromosome", "initial_population", "decode", "evaluate"]
