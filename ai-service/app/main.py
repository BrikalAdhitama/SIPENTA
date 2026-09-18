"""SIPENTA AI service — FastAPI.

  POST /solve   jalankan Algoritma Genetika (dipanggil Edge Function; butuh X-AI-Key)
  GET  /health  cek hidup

Kontrak /solve & format error: docs/api-contract.md §E. Algoritma: docs/ga-design.md.
"""

from __future__ import annotations

import logging
import time
import uuid

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.config import AI_KEY
from app.ga.engine import solve
from app.models import SolveRequest, SolveResponse

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s"
)
log = logging.getLogger("sipenta.ai")

app = FastAPI(
    title="SIPENTA AI service",
    version="0.1.0",
    description="Penjadwalan seminar dengan Algoritma Genetika. Dipanggil Edge Function generate-schedule.",
)


# ── format error seragam: {"error": {"code", "message", "details"}} ──────────
def err(code: str, message: str, status: int, details: dict | None = None) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={"error": {"code": code, "message": message, "details": details or {}}},
    )


@app.exception_handler(RequestValidationError)
async def _validation_handler(_req: Request, exc: RequestValidationError) -> JSONResponse:
    e = exc.errors()[0]
    field = ".".join(str(x) for x in e.get("loc", ()) if x != "body") or "body"
    pesan = e.get("msg", "payload tidak valid")
    pesan = pesan.split("Value error, ")[-1]  # buang prefiks pydantic
    return err("VALIDATION_FAILED", pesan, 422, {"field": field, "jumlah_error": len(exc.errors())})


@app.exception_handler(HTTPException)
async def _http_handler(_req: Request, exc: HTTPException) -> JSONResponse:
    kode = {401: "UNAUTHENTICATED", 403: "FORBIDDEN", 404: "NOT_FOUND", 422: "VALIDATION_FAILED"}
    detail = exc.detail if isinstance(exc.detail, str) else "permintaan ditolak"
    return err(kode.get(exc.status_code, "INTERNAL"), detail, exc.status_code)


@app.exception_handler(Exception)
async def _unhandled_handler(_req: Request, exc: Exception) -> JSONResponse:
    log.exception("kesalahan tak tertangani: %s", exc)
    return err("INTERNAL", f"kesalahan internal AI service: {exc}", 500)


# ── endpoint ────────────────────────────────────────────────────────────────
@app.get("/health")
def health() -> dict:
    return {"status": "ok", "version": app.version}


@app.post("/solve", response_model=SolveResponse)
def solve_endpoint(req: SolveRequest, x_ai_key: str = Header(default="")) -> SolveResponse:
    if AI_KEY and x_ai_key != AI_KEY:
        raise HTTPException(status_code=401, detail="X-AI-Key tidak valid")

    rid = uuid.uuid4().hex[:8]
    t0 = time.perf_counter()
    log.info(
        "[%s] /solve mulai — %s, %d seminar, %d ruangan, periode %s s.d. %s",
        rid, req.seminar_type, len(req.seminars), len(req.rooms),
        req.period["start_date"], req.period["end_date"],
    )

    res = solve(req)
    res.stats["peringatan"] = _peringatan_data(req)

    log.info(
        "[%s] /solve selesai — status=%s terjadwal=%d/%d bentrok=%d skor=%s generasi=%d %dms%s",
        rid, res.status, res.stats.get("jumlah_terjadwal", 0), len(req.seminars),
        res.conflict_count, res.fitness_score, res.generations_run, res.execution_time_ms,
        f" peringatan={len(res.stats['peringatan'])}" if res.stats["peringatan"] else "",
    )
    if res.stats["peringatan"]:
        log.warning("[%s] %s", rid, " | ".join(res.stats["peringatan"]))
    log.debug("[%s] total handler %.0f ms", rid, (time.perf_counter() - t0) * 1000)
    return res


def _peringatan_data(req: SolveRequest) -> list[str]:
    """Data yang secara teknis valid tetapi kemungkinan salah rakit di Edge Function.
    Tidak menggagalkan generate — hanya membantu BE menelusuri saat integrasi."""
    pesan: list[str] = []

    nim_seminar = {s.nim for s in req.seminars if s.nim}
    tanpa_nim = sum(1 for s in req.seminars if not s.nim)
    if req.student_class_schedule and tanpa_nim:
        pesan.append(
            f"{tanpa_nim} seminar tidak memuat nim sehingga jadwal kuliah mahasiswanya (H5) tidak dapat diterapkan"
        )
    nim_asing = {iv.nim for iv in req.student_class_schedule if iv.nim not in nim_seminar}
    if nim_asing:
        pesan.append(
            f"{len(nim_asing)} nim di student_class_schedule tidak cocok dengan seminar mana pun: "
            + ", ".join(sorted(map(str, nim_asing))[:5])
        )

    dosen_seminar = {d for s in req.seminars for d in s.dosen_ids}
    for field, data in (
        ("dosen_teaching_schedule", req.dosen_teaching_schedule),
        ("dosen_waktu_pribadi", req.dosen_waktu_pribadi),
    ):
        asing = {iv.dosen_id for iv in data if iv.dosen_id not in dosen_seminar}
        if asing:
            pesan.append(
                f"{len(asing)} dosen_id di {field} tidak terlibat seminar mana pun: "
                + ", ".join(map(str, sorted(asing)[:5]))
            )

    luar_periode = [
        iv.tanggal for iv in req.dosen_waktu_pribadi
        if iv.tanggal and not (req.period["start_date"] <= iv.tanggal <= req.period["end_date"])
    ]
    if luar_periode:
        pesan.append(
            f"{len(luar_periode)} waktu pribadi bertanggal di luar periode gelombang (diabaikan): "
            + ", ".join(sorted(set(luar_periode))[:5])
        )

    hari_blackout = {h for b in req.blackout_windows for h in b.hari}
    asing_hari = hari_blackout - set(req.active_days)
    if asing_hari:
        pesan.append(
            "blackout_windows memuat hari di luar active_days: " + ", ".join(sorted(asing_hari))
        )
    if not req.dosen_teaching_schedule and not req.dosen_waktu_pribadi:
        pesan.append(
            "dosen_teaching_schedule dan dosen_waktu_pribadi kosong — H3 & H4 tidak diterapkan; pastikan Edge Function sudah mengirimnya"
        )
    return pesan
