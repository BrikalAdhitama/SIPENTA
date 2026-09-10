"""SIPENTA AI service — FastAPI entrypoint.

POST /solve  — jalankan Algoritma Genetika (dipanggil hanya oleh Edge Function generate-schedule)
GET  /health — cek hidup

Kontrak: docs/api-contract.md §E. Algoritma: docs/ga-design.md.
Ini KERANGKA — isi TODO di app/ga/*.
"""

from __future__ import annotations

import os
import time

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

AI_KEY = os.environ.get("AI_SERVICE_KEY", "")

app = FastAPI(title="SIPENTA AI service", version="0.1.0")


# ── Skema (ringkas — lengkapnya di app/models/) ────────────────────────────────
class Room(BaseModel):
    id: str
    is_online: bool = False


class SeminarIn(BaseModel):
    id: int
    is_online: bool = False  # ditetapkan admin; venue dikunci "online", waktu tetap dijadwalkan GA
    pembimbing_utama_id: int
    pembimbing_pendamping_id: int
    penguji1_id: int
    penguji2_id: int


class Interval(BaseModel):
    dosen_id: int | None = None
    nim: str | None = None
    hari: str
    jam_mulai: str
    jam_selesai: str


class SolveRequest(BaseModel):
    seminar_type: str
    session_duration_minutes: int
    period: dict
    active_days: list[str]
    operational_hours: dict
    gap_minutes: int = 15
    rooms: list[Room]
    seminars: list[SeminarIn]
    dosen_teaching_schedule: list[Interval] = Field(default_factory=list)
    dosen_blocked_time: list[Interval] = Field(default_factory=list)
    student_class_schedule: list[Interval] = Field(default_factory=list)
    ga_params: dict = Field(default_factory=dict)


class SlotOut(BaseModel):
    seminar_id: int
    tanggal: str
    jam_mulai: str
    jam_selesai: str
    ruangan: str


class SolveResponse(BaseModel):
    status: str = "success"
    fitness_score: float
    conflict_count: int
    generations_run: int
    execution_time_ms: int
    stats: dict
    schedule: list[SlotOut]
    unscheduled: list[dict]


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health() -> dict:
    return {"status": "ok", "version": app.version}


@app.post("/solve", response_model=SolveResponse)
def solve(req: SolveRequest, x_ai_key: str = Header(default="")) -> SolveResponse:
    if not AI_KEY or x_ai_key != AI_KEY:
        raise HTTPException(status_code=401, detail="X-AI-Key tidak valid")
    if not req.rooms:
        raise HTTPException(status_code=422, detail="rooms tidak boleh kosong")

    started = time.perf_counter()

    # TODO: from app.ga.slots import build_candidate_slots, reduce_domains
    # TODO: from app.ga.engine import run_ga
    #   slots = build_candidate_slots(req)
    #   domains, unscheduled = reduce_domains(req, slots)      # buang slot langgar H3-H5
    #   best, meta = run_ga(req, slots, domains)                # optimasi H1,H2 + S0..S5
    #   schedule = decode(best, slots)

    elapsed_ms = int((time.perf_counter() - started) * 1000)

    # placeholder response
    return SolveResponse(
        fitness_score=0.0,
        conflict_count=0,
        generations_run=0,
        execution_time_ms=elapsed_ms,
        stats={},
        schedule=[],
        unscheduled=[{"seminar_id": s.id, "alasan": "belum diimplementasi"} for s in req.seminars],
    )
