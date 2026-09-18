"""Fase 2 & 3: generate slot kandidat + reduksi domain (H3/H4/H5)."""

from __future__ import annotations

from app.ga.context import Context, Slot
from app.ga.timeutil import daterange, hari_of, overlap, parse_date, to_min


def build_candidate_slots(ctx: Context) -> list[Slot]:
    """Semua kemungkinan (tanggal, jam, ruangan). Slot yang beririsan
    dengan blackout (waktu sholat) tidak pernah dibuat."""
    req = ctx.req
    op_start = to_min(req.operational_hours["start"])
    op_end = to_min(req.operational_hours["end"])
    step = ctx.durasi + ctx.gap
    active = {d.lower() for d in req.active_days}

    slots: list[Slot] = []
    idx = 0
    for d in daterange(parse_date(req.period["start_date"]), parse_date(req.period["end_date"])):
        hari = hari_of(d)
        if hari not in active:
            continue
        blk = ctx.blackout_for(hari)
        start = op_start
        while start + ctx.durasi <= op_end:
            end = start + ctx.durasi
            if not any(overlap(start, end, bs, be) for bs, be in blk):
                for r in req.rooms:
                    slots.append(
                        Slot(idx, d.isoformat(), hari, start, end, r.id, r.is_online)
                    )
                    idx += 1
            start += step
    return slots


def _violates_static(ctx: Context, seminar_i: int, slot: Slot) -> bool:
    """H3 (jadwal mengajar) + H4 (waktu pribadi dosen) + H5 (jadwal kuliah mahasiswa)."""
    s = ctx.req.seminars[seminar_i]

    for d in set(s.dosen_ids):
        for hari, bs, be in ctx.dosen_busy.get(d, ()):
            if hari == slot.hari and overlap(slot.start, slot.end, bs, be):
                return True
        for tanggal, bs, be in ctx.dosen_busy_tanggal.get(d, ()):
            if tanggal == slot.tanggal and overlap(slot.start, slot.end, bs, be):
                return True

    if s.nim:
        for hari, bs, be in ctx.mhs_busy.get(s.nim, ()):
            if hari == slot.hari and overlap(slot.start, slot.end, bs, be):
                return True
    return False


def reduce_domains(
    ctx: Context, slots: list[Slot]
) -> tuple[list[list[int]], list[tuple[int, str]]]:
    """domain[i] = index slot yang lolos H3/H4/H5 untuk seminar i.
    Return (domains, unscheduled) — unscheduled = seminar dengan domain kosong."""
    domains: list[list[int]] = []
    unscheduled: list[tuple[int, str]] = []

    for i, s in enumerate(ctx.req.seminars):
        allowed_online = s.is_online
        dom = [
            slot.idx
            for slot in slots
            if slot.is_online == allowed_online and not _violates_static(ctx, i, slot)
        ]
        domains.append(dom)
        if not dom:
            unscheduled.append(
                (
                    s.id,
                    "domain kosong setelah H3–H5 — tidak ada slot yang bebas dari "
                    "jadwal mengajar/waktu pribadi 4 dosen & jadwal kuliah mahasiswa",
                )
            )
    return domains, unscheduled
