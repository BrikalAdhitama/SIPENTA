"""Kontrak HTTP /solve & /health — yang dipakai Edge Function generate-schedule.

Fokus: bentuk response, format error (api-contract.md §Konvensi), auth X-AI-Key,
dan payload menyimpang yang harus ditolak dengan pesan jelas (bukan 500).
"""

import copy
import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

FIX = Path(__file__).parent / "fixtures" / "contoh_sempro_februari.json"
CEPAT = {"random_seed": 42, "population_size": 30, "generations": 40, "max_seconds": 10.0}


@pytest.fixture(scope="module")
def payload() -> dict:
    d = json.loads(FIX.read_text(encoding="utf-8"))
    d["ga_params"] = {**d.get("ga_params", {}), **CEPAT}
    return d


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


def ubah(payload: dict, **patch) -> dict:
    d = copy.deepcopy(payload)
    d.update(patch)
    return d


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "version": app.version}


def test_solve_mengembalikan_bentuk_sesuai_kontrak(client, payload):
    r = client.post("/solve", json=payload)
    assert r.status_code == 200, r.text
    d = r.json()
    assert set(d) >= {
        "status", "fitness_score", "conflict_count", "generations_run",
        "execution_time_ms", "stats", "schedule", "unscheduled",
    }
    assert d["status"] in ("success", "partial", "no_feasible_slot")
    assert d["conflict_count"] == 0
    assert len(d["schedule"]) == len(payload["seminars"])
    slot = d["schedule"][0]
    assert set(slot) == {"seminar_id", "tanggal", "jam_mulai", "jam_selesai", "ruangan"}
    assert 0 <= d["fitness_score"] <= 100


def test_bobot_soft_boleh_sebagian_seperti_app_config(client, payload):
    """app_config.ga_defaults di DB hanya memuat S0 & S1 — sisanya harus memakai default."""
    d = ubah(payload, ga_params={
        **CEPAT,
        "soft_weights": {
            "s0_menguji_lebih_dari_1_per_hari": 10,
            "s1_total_peran_lebih_dari_1_per_hari": 5,
        },
    })
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text
    assert r.json()["conflict_count"] == 0


def test_ga_params_kosong_memakai_default(client, payload):
    d = copy.deepcopy(payload)
    d.pop("ga_params", None)
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text


@pytest.mark.parametrize(
    "patch, potongan_pesan",
    [
        ({"rooms": []}, "rooms tidak boleh kosong"),
        ({"seminars": []}, "seminars tidak boleh kosong"),
        ({"period": {"start_date": "2026-02-20", "end_date": "2026-02-16"}}, "lebih awal"),
        ({"period": {"start_date": "20-02-2026", "end_date": "2026-02-16"}}, "YYYY-MM-DD"),
        ({"active_days": []}, "active_days tidak boleh kosong"),
        ({"active_days": ["senen"]}, "tidak dikenal"),
        ({"operational_hours": {"start": "17:00", "end": "08:00"}}, "harus setelah"),
        ({"operational_hours": {"start": "8 pagi", "end": "17:00"}}, "HH:MM"),
        ({"seminar_type": "sidang"}, "seminar_type"),
        ({"session_duration_minutes": 900}, "less than or equal"),
        ({"ga_params": {"soft_weights": {"s9_entah_apa": 3}}}, "tak dikenal"),
        ({"ga_params": {"population_size": 2}}, "greater than or equal"),
    ],
)
def test_payload_menyimpang_ditolak_422_dengan_pesan_jelas(client, payload, patch, potongan_pesan):
    r = client.post("/solve", json=ubah(payload, **patch))
    assert r.status_code == 422, r.text
    body = r.json()
    assert set(body["error"]) == {"code", "message", "details"}
    assert body["error"]["code"] == "VALIDATION_FAILED"
    assert potongan_pesan.lower() in body["error"]["message"].lower(), body["error"]["message"]
    assert body["error"]["details"]["field"]


def test_id_ganda_ditolak(client, payload):
    d = copy.deepcopy(payload)
    d["seminars"].append(copy.deepcopy(d["seminars"][0]))
    r = client.post("/solve", json=d)
    assert r.status_code == 422
    assert "ganda" in r.json()["error"]["message"]


def test_seminar_daring_tanpa_ruang_daring_ditolak(client, payload):
    d = copy.deepcopy(payload)
    d["seminars"][0]["is_online"] = True
    d["rooms"] = [r for r in d["rooms"] if not r.get("is_online")]
    r = client.post("/solve", json=d)
    assert r.status_code == 422
    assert "daring" in r.json()["error"]["message"]


def test_jam_boleh_memakai_titik_dan_detik(client, payload):
    """Data Excel kampus kadang menulis 13.30 atau 13:30:00."""
    d = copy.deepcopy(payload)
    d["dosen_teaching_schedule"][0]["jam_mulai"] = "13.30"
    d["dosen_teaching_schedule"][0]["jam_selesai"] = "15:30:00"
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text


def test_peringatan_data_muncul_di_stats(client, payload):
    d = copy.deepcopy(payload)
    d["student_class_schedule"] = [
        {"nim": "00000000", "hari": "senin", "jam_mulai": "07:30", "jam_selesai": "10:00"}
    ]
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text
    peringatan = r.json()["stats"]["peringatan"]
    assert any("tidak cocok dengan seminar" in p for p in peringatan), peringatan


def test_auth_x_ai_key(client, payload, monkeypatch):
    monkeypatch.setattr("app.main.AI_KEY", "rahasia")
    r = client.post("/solve", json=payload)
    assert r.status_code == 401
    assert r.json()["error"]["code"] == "UNAUTHENTICATED"

    r = client.post("/solve", json=payload, headers={"X-AI-Key": "salah"})
    assert r.status_code == 401

    r = client.post("/solve", json=payload, headers={"X-AI-Key": "rahasia"})
    assert r.status_code == 200


# ── waktu pribadi dosen (H4) ───────────────────────────────────────────────
def test_waktu_pribadi_bertanggal_diterima(client, payload):
    d = copy.deepcopy(payload)
    dosen_id = d["seminars"][0]["penguji1_id"]
    d["dosen_waktu_pribadi"] = [
        {"dosen_id": dosen_id, "tanggal": d["period"]["start_date"],
         "jam_mulai": "08:00", "jam_selesai": "17:00"}
    ]
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text
    hasil = r.json()
    sid = d["seminars"][0]["id"]
    slot = next((s for s in hasil["schedule"] if s["seminar_id"] == sid), None)
    assert slot is None or slot["tanggal"] != d["period"]["start_date"]


def test_nama_lama_dosen_blocked_time_masih_diterima_lewat_http(client, payload):
    d = copy.deepcopy(payload)
    d["dosen_blocked_time"] = [
        {"dosen_id": d["seminars"][0]["penguji1_id"], "hari": "senin",
         "jam_mulai": "08:00", "jam_selesai": "12:00"}
    ]
    assert client.post("/solve", json=d).status_code == 200


def test_baris_blokir_waktu_db_punya_hari_dan_tanggal(client, payload):
    """Tabel blokir_waktu mengisi hari DAN tanggal sekaligus — harus diterima,
    dan yang dipakai adalah tanggalnya."""
    d = copy.deepcopy(payload)
    dosen_id = d["seminars"][0]["penguji1_id"]
    tgl = d["period"]["start_date"]
    d["dosen_waktu_pribadi"] = [
        {"dosen_id": dosen_id, "hari": "senin", "tanggal": tgl,
         "jam_mulai": "08:00", "jam_selesai": "17:00"}
    ]
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text
    sid = d["seminars"][0]["id"]
    slot = next((s for s in r.json()["schedule"] if s["seminar_id"] == sid), None)
    assert slot is None or slot["tanggal"] != tgl


def test_interval_tanpa_hari_dan_tanggal_ditolak(client, payload):
    d = copy.deepcopy(payload)
    d["dosen_waktu_pribadi"] = [{"dosen_id": 1, "jam_mulai": "08:00", "jam_selesai": "12:00"}]
    r = client.post("/solve", json=d)
    assert r.status_code == 422
    assert "minimal salah satu" in r.json()["error"]["message"]


@pytest.mark.parametrize("jenis", ["seminar_proposal", "sempro", "seminar_hasil", "semhas"])
def test_jenis_seminar_enum_db_maupun_singkatan_diterima(client, payload, jenis):
    """DB memakai enum seminar_proposal/seminar_hasil; fixture lama memakai sempro/semhas."""
    d = copy.deepcopy(payload)
    d["seminar_type"] = jenis
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text


def test_peringatan_hari_tidak_cocok_dengan_tanggal(client, payload):
    d = copy.deepcopy(payload)
    d["dosen_waktu_pribadi"] = [
        {"dosen_id": d["seminars"][0]["penguji1_id"], "hari": "jumat",
         "tanggal": "2026-02-16",  # 16 Feb 2026 = Senin, bukan Jumat
         "jam_mulai": "08:00", "jam_selesai": "10:00"}
    ]
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text
    assert any("tidak cocok" in p and "tanggal" in p for p in r.json()["stats"]["peringatan"])


def test_jadwal_mengajar_tidak_boleh_pakai_tanggal(client, payload):
    d = copy.deepcopy(payload)
    d["dosen_teaching_schedule"] = [
        {"dosen_id": 1, "tanggal": "2026-02-17", "jam_mulai": "08:00", "jam_selesai": "10:00"}
    ]
    r = client.post("/solve", json=d)
    assert r.status_code == 422
    assert "berulang mingguan" in r.json()["error"]["message"]


def test_peringatan_waktu_pribadi_di_luar_periode(client, payload):
    d = copy.deepcopy(payload)
    d["dosen_waktu_pribadi"] = [
        {"dosen_id": d["seminars"][0]["penguji1_id"], "tanggal": "2030-01-01",
         "jam_mulai": "08:00", "jam_selesai": "10:00"}
    ]
    r = client.post("/solve", json=d)
    assert r.status_code == 200, r.text
    assert any("luar periode" in p for p in r.json()["stats"]["peringatan"])


def test_contoh_payload_untuk_be_valid(client):
    """examples/solve-request.example.json harus selalu bisa dijalankan —
    inilah contoh yang dipakai BE saat merakit payload."""
    contoh = json.loads((Path(__file__).parent.parent / "examples" / "solve-request.example.json").read_text(encoding="utf-8"))
    r = client.post("/solve", json=contoh)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["status"] == "success"
    assert d["conflict_count"] == 0
    assert d["stats"]["jumlah_terjadwal"] == len(contoh["seminars"])
    assert d["stats"]["peringatan"] == []


def test_ready_dan_version(client):
    r = client.get("/ready")
    assert r.status_code == 200 and r.json()["status"] == "ready"

    v = client.get("/version")
    assert v.status_code == 200
    d = v.json()
    assert d["service"] == "sipenta-ai" and d["version"] == app.version
    assert set(d["ga_default"]["soft_weights"]) == {
        "s0_menguji_lebih_dari_1_per_hari", "s1_total_peran_lebih_dari_1_per_hari",
        "s2_beban_merata_antar_dosen", "s3_gap_kosong_ruangan",
        "s4_sebar_antar_hari", "s5_dosen_lompat_ruangan",
    }


def test_request_id_dikembalikan_dan_bisa_diteruskan(client):
    r = client.get("/version")
    assert r.headers.get("X-Request-Id")

    r = client.get("/version", headers={"X-Request-Id": "dari-nuxt-123"})
    assert r.headers["X-Request-Id"] == "dari-nuxt-123"
