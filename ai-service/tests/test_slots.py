"""Slot kandidat + reduksi domain."""

from app.ga.context import build_context
from app.ga.slots import build_candidate_slots, reduce_domains
from app.models import SolveRequest


def base_req(**over) -> SolveRequest:
    d = {
        "seminar_type": "sempro",
        "session_duration_minutes": 60,
        "period": {"start_date": "2026-02-16", "end_date": "2026-02-16"},  # 1 hari (Senin)
        "active_days": ["senin"],
        "operational_hours": {"start": "08:00", "end": "17:30"},
        "gap_minutes": 15,
        "blackout_windows": [],
        "rooms": [{"id": "R1", "is_online": False}],
        "seminars": [
            {"id": 1, "nim": "x", "is_online": False,
             "pembimbing_utama_id": 1, "pembimbing_pendamping_id": 2,
             "penguji1_id": 3, "penguji2_id": 4}
        ],
    }
    d.update(over)
    return SolveRequest(**d)


def test_slot_grid_dan_operasional():
    req = base_req()
    slots = build_candidate_slots(build_context(req))
    # 08:00..17:30, langkah 75 menit, durasi 60 → 08:00,09:15,...,16:15 (16:15+60=17:15<=17:30)
    starts = sorted({s.start for s in slots})
    assert starts[0] == 8 * 60
    assert all(e <= 17 * 60 + 30 for e in (s.end for s in slots))
    assert len(slots) == len(starts)  # 1 ruangan


def test_blackout_membuang_slot():
    req = base_req(blackout_windows=[{"start": "12:00", "end": "13:00", "label": "Dzuhur"}])
    slots = build_candidate_slots(build_context(req))
    for s in slots:
        assert not (s.start < 13 * 60 and 12 * 60 < s.end), "ada slot beririsan blackout"


def test_blackout_hormati_field_hari():
    # blackout khusus jumat tidak memotong hari Senin
    req = base_req(blackout_windows=[{"start": "11:00", "end": "13:00", "label": "Jumat", "hari": ["jumat"]}])
    slots = build_candidate_slots(build_context(req))
    assert any(11 * 60 <= s.start < 13 * 60 for s in slots)


def test_reduksi_domain_H3_jadwal_mengajar():
    req = base_req(dosen_teaching_schedule=[
        {"dosen_id": 1, "hari": "senin", "jam_mulai": "08:00", "jam_selesai": "12:00"}
    ])
    ctx = build_context(req)
    slots = build_candidate_slots(ctx)
    domains, _ = reduce_domains(ctx, slots)
    for gi in domains[0]:
        assert slots[gi].start >= 12 * 60, "slot pagi harusnya terbuang (dosen 1 mengajar)"


def test_reduksi_domain_H5_jadwal_kuliah():
    req = base_req(student_class_schedule=[
        {"nim": "x", "hari": "senin", "jam_mulai": "13:00", "jam_selesai": "15:30"}
    ])
    ctx = build_context(req)
    slots = build_candidate_slots(ctx)
    domains, _ = reduce_domains(ctx, slots)
    for gi in domains[0]:
        assert not (slots[gi].start < 15 * 60 + 30 and 13 * 60 < slots[gi].end)


def test_domain_kosong_jadi_unscheduled():
    req = base_req(dosen_blocked_time=[
        {"dosen_id": 1, "hari": "senin", "jam_mulai": "08:00", "jam_selesai": "17:30"}
    ])
    ctx = build_context(req)
    slots = build_candidate_slots(ctx)
    domains, unsched = reduce_domains(ctx, slots)
    assert domains[0] == []
    assert unsched and unsched[0][0] == 1


# ── H4: waktu pribadi dosen ────────────────────────────────────────────────
def test_waktu_pribadi_mingguan_membuang_slot():
    req = base_req(dosen_waktu_pribadi=[
        {"dosen_id": 3, "hari": "senin", "jam_mulai": "08:00", "jam_selesai": "12:00"}
    ])
    ctx = build_context(req)
    slots = build_candidate_slots(ctx)
    domains, _ = reduce_domains(ctx, slots)
    assert all(slots[g].start >= 12 * 60 for g in domains[0])


def test_waktu_pribadi_bertanggal_hanya_kena_tanggal_itu():
    """Dinas luar 17 Feb: slot 17 Feb hilang, tetapi Senin 16 & 24 Feb tetap ada."""
    req = base_req(
        period={"start_date": "2026-02-16", "end_date": "2026-02-24"},
        active_days=["senin", "selasa"],
        dosen_waktu_pribadi=[
            {"dosen_id": 3, "tanggal": "2026-02-17", "jam_mulai": "08:00", "jam_selesai": "17:30"}
        ],
    )
    ctx = build_context(req)
    slots = build_candidate_slots(ctx)
    domains, _ = reduce_domains(ctx, slots)
    tanggal_layak = {slots[g].tanggal for g in domains[0]}
    assert "2026-02-17" not in tanggal_layak          # dibuang
    assert {"2026-02-16", "2026-02-23", "2026-02-24"} <= tanggal_layak   # hari lain aman


def test_nama_lama_dosen_blocked_time_masih_diterima():
    req = base_req(dosen_blocked_time=[
        {"dosen_id": 3, "hari": "senin", "jam_mulai": "08:00", "jam_selesai": "12:00"}
    ])
    assert len(req.dosen_waktu_pribadi) == 1
    ctx = build_context(req)
    domains, _ = reduce_domains(ctx, build_candidate_slots(ctx))
    assert all(x >= 0 for x in [len(d) for d in domains])
