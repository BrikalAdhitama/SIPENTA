"""Helper waktu — semua perhitungan overlap pakai menit-sejak-tengah-malam (int)."""

from __future__ import annotations

import datetime as _dt

HARI = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"]


def to_min(hhmm: str) -> int:
    """'13:30' -> 810. Toleran terhadap '13.30' dan '13:30:00'."""
    s = hhmm.strip().replace(".", ":")
    parts = s.split(":")
    return int(parts[0]) * 60 + int(parts[1])


def to_hhmm(m: int) -> str:
    return f"{m // 60:02d}:{m % 60:02d}"


def overlap(a_start: int, a_end: int, b_start: int, b_end: int) -> bool:
    """True bila dua rentang [start, end) beririsan."""
    return a_start < b_end and b_start < a_end


def parse_date(s: str) -> _dt.date:
    return _dt.date.fromisoformat(s)


def hari_of(d: _dt.date) -> str:
    return HARI[d.weekday()]


def daterange(start: _dt.date, end: _dt.date):
    cur = start
    while cur <= end:
        yield cur
        cur += _dt.timedelta(days=1)
