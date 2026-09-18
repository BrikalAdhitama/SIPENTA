"""Context — request yang sudah di-parse & di-index untuk dipakai fitness/engine.

Ini kontrak internal antar-modul GA. Bentuknya tetap; slots.py, fitness.py,
operators.py, engine.py semuanya bergantung padanya.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.models import SolveRequest
from app.ga.timeutil import to_min


@dataclass(frozen=True)
class Slot:
    idx: int
    tanggal: str  # YYYY-MM-DD
    hari: str
    start: int  # menit sejak 00:00
    end: int
    ruangan: str
    is_online: bool


@dataclass
class Context:
    req: SolveRequest
    durasi: int
    gap: int
    # daftar interval sibuk mingguan per dosen_id: list[(hari, start, end)]
    dosen_busy: dict[int, list[tuple[str, int, int]]] = field(default_factory=dict)
    # waktu pribadi dosen pada tanggal tertentu: list[(tanggal, start, end)]
    dosen_busy_tanggal: dict[int, list[tuple[str, int, int]]] = field(default_factory=dict)
    # daftar interval sibuk per nim
    mhs_busy: dict[str, list[tuple[str, int, int]]] = field(default_factory=dict)
    # blackout per hari (hari -> list[(start, end)]); key "*" = semua hari
    blackout: dict[str, list[tuple[int, int]]] = field(default_factory=dict)
    # dosen_id -> daftar index seminar tempat dia terlibat (peran apa pun)
    dosen_to_seminars: dict[int, list[int]] = field(default_factory=dict)
    # dosen_id -> daftar index seminar tempat dia jadi PENGUJI saja
    dosen_to_penguji_seminars: dict[int, list[int]] = field(default_factory=dict)

    def blackout_for(self, hari: str) -> list[tuple[int, int]]:
        return self.blackout.get("*", []) + self.blackout.get(hari, [])


def build_context(req: SolveRequest) -> Context:
    ctx = Context(req=req, durasi=req.session_duration_minutes, gap=req.gap_minutes)

    for iv in req.dosen_teaching_schedule + req.dosen_waktu_pribadi:
        if iv.dosen_id is None:
            continue
        rng = (to_min(iv.jam_mulai), to_min(iv.jam_selesai))
        if iv.tanggal:  # waktu pribadi sekali pakai (mis. dinas luar 3 Okt)
            ctx.dosen_busy_tanggal.setdefault(iv.dosen_id, []).append((iv.tanggal, *rng))
        else:
            ctx.dosen_busy.setdefault(iv.dosen_id, []).append((iv.hari.lower(), *rng))

    for iv in req.student_class_schedule:
        if iv.nim is None or iv.hari is None:
            continue
        ctx.mhs_busy.setdefault(iv.nim, []).append(
            (iv.hari.lower(), to_min(iv.jam_mulai), to_min(iv.jam_selesai))
        )

    for bw in req.blackout_windows:
        rng = (to_min(bw.start), to_min(bw.end))
        if not bw.hari:
            ctx.blackout.setdefault("*", []).append(rng)
        else:
            for h in bw.hari:
                ctx.blackout.setdefault(h.lower(), []).append(rng)

    for i, s in enumerate(req.seminars):
        for d in set(s.dosen_ids):
            ctx.dosen_to_seminars.setdefault(d, []).append(i)
        for d in set(s.penguji_ids):
            ctx.dosen_to_penguji_seminars.setdefault(d, []).append(i)

    return ctx
