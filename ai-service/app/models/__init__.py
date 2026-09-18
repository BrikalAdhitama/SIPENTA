"""Skema request/response — persis kontrak di docs/api-contract.md §E.

Semua validasi payload ada di sini: format jam/tanggal, nama hari, id ganda,
rentang periode, dan bobot soft yang tidak lengkap. Pesan error dibuat ramah
supaya Edge Function bisa langsung menampilkannya ke admin.
"""

from __future__ import annotations

import datetime as _dt
import re

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator, model_validator

HARI_VALID = ("senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu")
JENIS_VALID = ("sempro", "semhas")
_JAM_RE = re.compile(r"^([01]\d|2[0-3])[:.]([0-5]\d)(:[0-5]\d)?$")

# bobot default; payload boleh mengirim sebagian saja (sisanya memakai nilai ini)
SOFT_WEIGHTS_DEFAULT: dict[str, float] = {
    "s0_menguji_lebih_dari_1_per_hari": 10.0,
    "s1_total_peran_lebih_dari_1_per_hari": 5.0,
    "s2_beban_merata_antar_dosen": 4.0,
    "s3_gap_kosong_ruangan": 3.0,
    "s4_sebar_antar_hari": 2.0,
    "s5_dosen_lompat_ruangan": 1.0,
}


def _cek_jam(v: str, field: str) -> str:
    if not isinstance(v, str) or not _JAM_RE.match(v.strip()):
        raise ValueError(f"{field} harus berformat HH:MM (24 jam), dapat: {v!r}")
    return v.strip().replace(".", ":")[:5]


def _cek_hari(v: str, field: str = "hari") -> str:
    h = str(v).strip().lower()
    if h not in HARI_VALID:
        raise ValueError(f"{field} tidak dikenal: {v!r} (pilihan: {', '.join(HARI_VALID)})")
    return h


def _cek_tanggal(v: str, field: str) -> str:
    try:
        return _dt.date.fromisoformat(str(v)).isoformat()
    except ValueError as e:
        raise ValueError(f"{field} harus berformat YYYY-MM-DD, dapat: {v!r}") from e


class Room(BaseModel):
    id: str
    is_online: bool = False

    @field_validator("id")
    @classmethod
    def _id_tidak_kosong(cls, v: str) -> str:
        if not str(v).strip():
            raise ValueError("rooms[].id tidak boleh kosong")
        return str(v).strip()


class SeminarIn(BaseModel):
    id: int
    nim: str | None = None
    nama: str | None = None
    is_online: bool = False
    pembimbing_utama_id: int
    pembimbing_pendamping_id: int
    penguji1_id: int
    penguji2_id: int

    @property
    def dosen_ids(self) -> tuple[int, int, int, int]:
        return (
            self.pembimbing_utama_id,
            self.pembimbing_pendamping_id,
            self.penguji1_id,
            self.penguji2_id,
        )

    @property
    def penguji_ids(self) -> tuple[int, int]:
        return (self.penguji1_id, self.penguji2_id)


class Interval(BaseModel):
    """Rentang waktu sibuk: jadwal mengajar, waktu pribadi dosen, atau jadwal kuliah.

    Isi **salah satu**: `hari` (berulang tiap minggu) atau `tanggal` (sekali, untuk
    waktu pribadi seperti dinas luar) — sama seperti kolom `blokir_waktu` di DB.
    Jadwal mengajar & jadwal kuliah selalu memakai `hari`.
    """

    dosen_id: int | None = None
    nim: str | None = None
    hari: str | None = None
    tanggal: str | None = None
    jam_mulai: str
    jam_selesai: str

    @field_validator("hari")
    @classmethod
    def _hari(cls, v: str | None) -> str | None:
        return None if v is None else _cek_hari(v)

    @field_validator("tanggal")
    @classmethod
    def _tanggal(cls, v: str | None) -> str | None:
        return None if v is None else _cek_tanggal(v, "tanggal")

    @field_validator("jam_mulai", "jam_selesai")
    @classmethod
    def _jam(cls, v: str, info) -> str:
        return _cek_jam(v, info.field_name)

    @model_validator(mode="after")
    def _isi_salah_satu_dan_urutan_jam(self):
        if (self.hari is None) == (self.tanggal is None):
            raise ValueError("isi tepat salah satu: hari (berulang mingguan) atau tanggal (sekali)")
        if self.jam_selesai <= self.jam_mulai:
            raise ValueError(
                f"jam_selesai harus setelah jam_mulai ({self.jam_mulai}–{self.jam_selesai})"
            )
        return self


class BlackoutWindow(BaseModel):
    start: str
    end: str
    label: str = ""
    hari: list[str] = Field(default_factory=list)  # kosong = semua hari aktif

    @field_validator("start", "end")
    @classmethod
    def _jam(cls, v: str, info) -> str:
        return _cek_jam(v, f"blackout_windows[].{info.field_name}")

    @field_validator("hari")
    @classmethod
    def _hari(cls, v: list[str]) -> list[str]:
        return [_cek_hari(h, "blackout_windows[].hari") for h in v]

    @model_validator(mode="after")
    def _urutan_jam(self):
        if self.end <= self.start:
            raise ValueError(f"blackout_windows[].end harus setelah start ({self.start}–{self.end})")
        return self


class GAParams(BaseModel):
    population_size: int = Field(default=100, ge=4, le=1000)
    generations: int = Field(default=500, ge=1, le=5000)
    crossover_rate: float = Field(default=0.8, ge=0.0, le=1.0)
    mutation_rate: float = Field(default=0.1, ge=0.0, le=1.0)
    elitism_count: int = Field(default=2, ge=0)
    tournament_size: int = Field(default=3, ge=2)
    plateau_generations: int = Field(default=60, ge=1)
    max_seconds: float = Field(default=25.0, gt=0)
    random_seed: int | None = None
    soft_weights: dict[str, float] = Field(default_factory=lambda: dict(SOFT_WEIGHTS_DEFAULT))

    @field_validator("soft_weights", mode="before")
    @classmethod
    def _lengkapi_bobot(cls, v):
        """Payload boleh mengirim sebagian bobot (mis. hanya S0 & S1 seperti di
        app_config); kunci yang tidak dikirim memakai nilai default."""
        if v is None:
            return dict(SOFT_WEIGHTS_DEFAULT)
        if not isinstance(v, dict):
            raise ValueError("ga_params.soft_weights harus berupa objek {nama_bobot: angka}")
        tak_dikenal = [k for k in v if k not in SOFT_WEIGHTS_DEFAULT]
        if tak_dikenal:
            raise ValueError(
                "ga_params.soft_weights memuat kunci tak dikenal: "
                f"{', '.join(sorted(tak_dikenal))} (pilihan: {', '.join(SOFT_WEIGHTS_DEFAULT)})"
            )
        for k, val in v.items():
            if not isinstance(val, (int, float)) or isinstance(val, bool) or val < 0:
                raise ValueError(f"ga_params.soft_weights.{k} harus angka ≥ 0, dapat: {val!r}")
        return {**SOFT_WEIGHTS_DEFAULT, **{k: float(x) for k, x in v.items()}}

    @model_validator(mode="after")
    def _elitism_masuk_akal(self):
        if self.elitism_count >= self.population_size:
            raise ValueError("ga_params.elitism_count harus lebih kecil dari population_size")
        if self.tournament_size > self.population_size:
            raise ValueError("ga_params.tournament_size tidak boleh melebihi population_size")
        return self


class SolveRequest(BaseModel):
    seminar_type: str
    session_duration_minutes: int = Field(ge=1, le=600)
    period: dict  # {"start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD"}
    active_days: list[str]
    operational_hours: dict  # {"start": "HH:MM", "end": "HH:MM"}
    gap_minutes: int = Field(default=15, ge=0, le=240)
    blackout_windows: list[BlackoutWindow] = Field(default_factory=list)
    rooms: list[Room]
    seminars: list[SeminarIn]
    dosen_teaching_schedule: list[Interval] = Field(default_factory=list)
    # "waktu pribadi" dosen; nama lama `dosen_blocked_time` tetap diterima
    dosen_waktu_pribadi: list[Interval] = Field(
        default_factory=list,
        validation_alias=AliasChoices("dosen_waktu_pribadi", "dosen_blocked_time"),
    )
    student_class_schedule: list[Interval] = Field(default_factory=list)
    ga_params: GAParams = Field(default_factory=GAParams)

    model_config = ConfigDict(populate_by_name=True)

    @field_validator("seminar_type")
    @classmethod
    def _jenis(cls, v: str) -> str:
        j = str(v).strip().lower()
        if j not in JENIS_VALID:
            raise ValueError(f"seminar_type harus salah satu dari {JENIS_VALID}, dapat: {v!r}")
        return j

    @field_validator("active_days")
    @classmethod
    def _hari_aktif(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("active_days tidak boleh kosong")
        return [_cek_hari(h, "active_days") for h in v]

    @field_validator("period")
    @classmethod
    def _periode(cls, v: dict) -> dict:
        for k in ("start_date", "end_date"):
            if k not in v:
                raise ValueError(f"period.{k} wajib diisi")
        mulai = _cek_tanggal(v["start_date"], "period.start_date")
        selesai = _cek_tanggal(v["end_date"], "period.end_date")
        if selesai < mulai:
            raise ValueError(f"period.end_date ({selesai}) lebih awal dari start_date ({mulai})")
        return {**v, "start_date": mulai, "end_date": selesai}

    @field_validator("operational_hours")
    @classmethod
    def _jam_operasional(cls, v: dict) -> dict:
        for k in ("start", "end"):
            if k not in v:
                raise ValueError(f"operational_hours.{k} wajib diisi")
        mulai = _cek_jam(v["start"], "operational_hours.start")
        selesai = _cek_jam(v["end"], "operational_hours.end")
        if selesai <= mulai:
            raise ValueError(
                f"operational_hours.end ({selesai}) harus setelah start ({mulai})"
            )
        return {**v, "start": mulai, "end": selesai}

    @field_validator("rooms")
    @classmethod
    def _rooms(cls, v: list[Room]) -> list[Room]:
        if not v:
            raise ValueError("rooms tidak boleh kosong")
        ids = [r.id for r in v]
        ganda = sorted({i for i in ids if ids.count(i) > 1})
        if ganda:
            raise ValueError(f"rooms[].id ganda: {', '.join(ganda)}")
        return v

    @field_validator("seminars")
    @classmethod
    def _seminars(cls, v: list[SeminarIn]) -> list[SeminarIn]:
        if not v:
            raise ValueError("seminars tidak boleh kosong")
        ids = [s.id for s in v]
        ganda = sorted({i for i in ids if ids.count(i) > 1})
        if ganda:
            raise ValueError(f"seminars[].id ganda: {', '.join(map(str, ganda))}")
        return v

    @field_validator("dosen_teaching_schedule", "dosen_waktu_pribadi")
    @classmethod
    def _butuh_dosen_id(cls, v: list[Interval], info) -> list[Interval]:
        if any(iv.dosen_id is None for iv in v):
            raise ValueError(f"{info.field_name}[].dosen_id wajib diisi")
        return v

    @field_validator("dosen_teaching_schedule")
    @classmethod
    def _mengajar_berulang_mingguan(cls, v: list[Interval]) -> list[Interval]:
        if any(iv.tanggal is not None for iv in v):
            raise ValueError(
                "dosen_teaching_schedule[] memakai hari (berulang mingguan), bukan tanggal"
            )
        return v

    @field_validator("student_class_schedule")
    @classmethod
    def _butuh_nim(cls, v: list[Interval]) -> list[Interval]:
        if any(not iv.nim for iv in v):
            raise ValueError("student_class_schedule[].nim wajib diisi")
        if any(iv.tanggal is not None for iv in v):
            raise ValueError(
                "student_class_schedule[] memakai hari (berulang mingguan), bukan tanggal"
            )
        return v

    @model_validator(mode="after")
    def _sesi_muat_di_jam_operasional(self):
        def menit(t: str) -> int:
            h, m = t.split(":")[:2]
            return int(h) * 60 + int(m)

        mulai, selesai = menit(self.operational_hours["start"]), menit(self.operational_hours["end"])
        if mulai + self.session_duration_minutes > selesai:
            raise ValueError(
                f"session_duration_minutes ({self.session_duration_minutes} menit) tidak muat "
                f"dalam jam operasional {self.operational_hours['start']}–{self.operational_hours['end']}"
            )
        online = [s for s in self.seminars if s.is_online]
        if online and not any(r.is_online for r in self.rooms):
            raise ValueError(
                f"{len(online)} seminar ditandai daring tetapi tidak ada ruangan dengan is_online = true"
            )
        if any(not r.is_online for r in self.rooms) is False and any(
            not s.is_online for s in self.seminars
        ):
            raise ValueError("ada seminar luring tetapi semua ruangan bertipe daring")
        return self


class SlotOut(BaseModel):
    seminar_id: int
    tanggal: str
    jam_mulai: str
    jam_selesai: str
    ruangan: str


class UnscheduledOut(BaseModel):
    seminar_id: int
    alasan: str


class SolveResponse(BaseModel):
    status: str = "success"
    fitness_score: float
    conflict_count: int
    generations_run: int
    execution_time_ms: int
    stats: dict
    schedule: list[SlotOut]
    unscheduled: list[UnscheduledOut]
