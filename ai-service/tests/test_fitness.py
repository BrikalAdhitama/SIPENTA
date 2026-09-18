"""Fitness — tiap constraint diuji: kasus sengaja melanggar → terdeteksi; bersih → 0."""

from app.ga.context import Slot, build_context
from app.ga.fitness import evaluate
from app.models import SolveRequest


def req_2seminar(s1_dosen, s2_dosen) -> SolveRequest:
    return SolveRequest(
        seminar_type="sempro",
        session_duration_minutes=60,
        period={"start_date": "2026-02-16", "end_date": "2026-02-16"},
        active_days=["senin"],
        operational_hours={"start": "08:00", "end": "17:30"},
        rooms=[{"id": "R1", "is_online": False}, {"id": "R2", "is_online": False}],
        seminars=[
            {"id": 1, "nim": "a", "pembimbing_utama_id": s1_dosen[0], "pembimbing_pendamping_id": s1_dosen[1],
             "penguji1_id": s1_dosen[2], "penguji2_id": s1_dosen[3]},
            {"id": 2, "nim": "b", "pembimbing_utama_id": s2_dosen[0], "pembimbing_pendamping_id": s2_dosen[1],
             "penguji1_id": s2_dosen[2], "penguji2_id": s2_dosen[3]},
        ],
    )


def two_slots(same_room: bool, overlap_time: bool):
    r2 = "R1" if same_room else "R2"
    s2_start = 8 * 60 + 30 if overlap_time else 9 * 60 + 30
    return [
        Slot(0, "2026-02-16", "senin", 8 * 60, 9 * 60, "R1", False),
        Slot(1, "2026-02-16", "senin", s2_start, s2_start + 60, r2, False),
    ]


def test_H1_bentrok_ruangan_terdeteksi():
    req = req_2seminar((1, 2, 3, 4), (5, 6, 7, 8))  # dosen beda → bukan H2
    ctx = build_context(req)
    slots = two_slots(same_room=True, overlap_time=True)
    b = evaluate([0, 1], ctx, slots)
    assert b.detail["h1_bentrok_ruangan"] == 1
    assert b.v_hard == 1


def test_H1_ruangan_beda_tidak_bentrok():
    req = req_2seminar((1, 2, 3, 4), (5, 6, 7, 8))
    ctx = build_context(req)
    b = evaluate([0, 1], ctx, two_slots(same_room=False, overlap_time=True))
    assert b.detail["h1_bentrok_ruangan"] == 0


def test_H1_dilewati_untuk_online():
    req = req_2seminar((1, 2, 3, 4), (5, 6, 7, 8))
    req.seminars[0].is_online = req.seminars[1].is_online = True
    ctx = build_context(req)
    slots = [
        Slot(0, "2026-02-16", "senin", 8 * 60, 9 * 60, "online", True),
        Slot(1, "2026-02-16", "senin", 8 * 60, 9 * 60, "online", True),
    ]
    assert evaluate([0, 1], ctx, slots).detail["h1_bentrok_ruangan"] == 0


def test_H2_bentrok_dosen_terdeteksi():
    req = req_2seminar((1, 2, 3, 4), (1, 6, 7, 8))  # dosen 1 di kedua seminar
    ctx = build_context(req)
    b = evaluate([0, 1], ctx, two_slots(same_room=False, overlap_time=True))
    assert b.detail["h2_bentrok_dosen"] == 1
    assert b.v_hard == 1


def test_H2_dosen_sama_waktu_beda_ok():
    req = req_2seminar((1, 2, 3, 4), (1, 6, 7, 8))
    ctx = build_context(req)
    b = evaluate([0, 1], ctx, two_slots(same_room=False, overlap_time=False))
    assert b.detail["h2_bentrok_dosen"] == 0


def test_S0_menguji_2_topik_sehari():
    # dosen 3 jadi penguji di kedua seminar, jam beda (tidak H2 karena... sebenarnya H2 juga
    # kena; tapi S0 harus tetap mencatat 1 kelebihan)
    req = req_2seminar((1, 2, 3, 4), (5, 6, 3, 8))
    ctx = build_context(req)
    b = evaluate([0, 1], ctx, two_slots(same_room=False, overlap_time=False))
    assert b.detail["s0_menguji_lebih_dari_1"] == 1


def test_S1_keterlibatan_2_sehari():
    req = req_2seminar((1, 2, 3, 4), (1, 6, 7, 8))  # dosen 1 terlibat 2x
    ctx = build_context(req)
    b = evaluate([0, 1], ctx, two_slots(same_room=False, overlap_time=False))
    assert b.detail["s1_keterlibatan_lebih_dari_1"] >= 1


def test_jadwal_bersih_v_hard_nol():
    req = req_2seminar((1, 2, 3, 4), (5, 6, 7, 8))
    ctx = build_context(req)
    b = evaluate([0, 1], ctx, two_slots(same_room=False, overlap_time=False))
    assert b.v_hard == 0
    assert b.fitness > 0
