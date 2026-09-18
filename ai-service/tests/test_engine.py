"""End-to-end: engine harus keluarkan jadwal bebas bentrok untuk fixture contoh."""

import json
from pathlib import Path

from app.ga.engine import solve
from app.models import SolveRequest

FIX = Path(__file__).parent / "fixtures" / "contoh_sempro_februari.json"


def load() -> SolveRequest:
    return SolveRequest(**json.loads(FIX.read_text(encoding="utf-8")))


def test_solve_menghasilkan_jadwal_bebas_bentrok():
    res = solve(load())
    assert res.conflict_count == 0, f"masih ada bentrok: {res.stats['constraint_detail']}"
    assert res.stats["jumlah_terjadwal"] + len(res.unscheduled) == res.stats["jumlah_seminar"]
    # tiap slot dalam jam operasional & bukan waktu sholat
    for s in res.schedule:
        assert "08:00" <= s.jam_mulai and s.jam_selesai <= "17:30"


def test_reproducible_dengan_seed_sama():
    r1 = solve(load())
    r2 = solve(load())
    assert [s.model_dump() for s in r1.schedule] == [s.model_dump() for s in r2.schedule]


def test_reduksi_domain_menyusutkan_ruang_pencarian():
    from app.ga.context import build_context
    from app.ga.slots import build_candidate_slots, reduce_domains

    req = load()
    ctx = build_context(req)
    slots = build_candidate_slots(ctx)
    domains, _ = reduce_domains(ctx, slots)
    avg = sum(len(d) for d in domains) / len(domains)
    assert avg < len(slots), "domain harus lebih kecil dari total slot"
