"""Uji cepat service yang sudah berjalan (lokal maupun hasil deploy).

Memeriksa: /health, /ready, /version, /solve dengan contoh payload, serta
penolakan yang benar untuk key salah dan payload rusak.

  python -m scripts.smoke_test                                   # http://127.0.0.1:8000
  python -m scripts.smoke_test --url https://sipenta-ai.onrender.com --key RAHASIA
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

CONTOH = Path(__file__).resolve().parent.parent / "examples" / "solve-request.example.json"


def panggil(url: str, metode: str = "GET", body: dict | None = None,
            key: str = "", timeout: float = 90) -> tuple[int, dict | str]:
    data = json.dumps(body).encode() if body is not None else None
    headers = {"Content-Type": "application/json"} if data else {}
    if key:
        headers["X-AI-Key"] = key
    req = urllib.request.Request(url, data=data, headers=headers, method=metode)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        isi = e.read().decode()
        try:
            return e.code, json.loads(isi)
        except json.JSONDecodeError:
            return e.code, isi
    except Exception as e:  # noqa: BLE001 — jaringan mati, DNS salah, dll
        return 0, str(e)


def main() -> None:
    ap = argparse.ArgumentParser(description="Smoke test AI service")
    ap.add_argument("--url", default="http://127.0.0.1:8000", help="alamat service")
    ap.add_argument("--key", default=os.environ.get("AI_SERVICE_KEY", ""), help="X-AI-Key bila service memakainya")
    args = ap.parse_args()
    base = args.url.rstrip("/")
    lolos, gagal = 0, 0

    def cek(nama: str, ok: bool, keterangan: str = "") -> None:
        nonlocal lolos, gagal
        print(f"  {'OK  ' if ok else 'GAGAL'}  {nama}{' — ' + keterangan if keterangan else ''}")
        if ok:
            lolos += 1
        else:
            gagal += 1

    print(f"Menguji {base}\n")

    t0 = time.perf_counter()
    kode, isi = panggil(f"{base}/health")
    bangun = time.perf_counter() - t0
    cek("/health", kode == 200 and isinstance(isi, dict) and isi.get("status") == "ok",
        f"{kode}, {bangun:.1f} dtk" + (" (cold start)" if bangun > 5 else ""))

    kode, isi = panggil(f"{base}/ready")
    cek("/ready — mesin GA hidup", kode == 200 and isinstance(isi, dict) and isi.get("status") == "ready", str(kode))

    kode, isi = panggil(f"{base}/version")
    versi = isi.get("version") if isinstance(isi, dict) else "?"
    auth = isi.get("auth_aktif") if isinstance(isi, dict) else None
    cek("/version", kode == 200, f"versi {versi}, auth {'aktif' if auth else 'nonaktif'}")

    contoh = json.loads(CONTOH.read_text(encoding="utf-8"))
    t0 = time.perf_counter()
    kode, isi = panggil(f"{base}/solve", "POST", contoh, args.key)
    lama = time.perf_counter() - t0
    ok = kode == 200 and isinstance(isi, dict) and isi.get("conflict_count") == 0
    rincian = (
        f"{isi.get('stats', {}).get('jumlah_terjadwal')}/{len(contoh['seminars'])} terjadwal, "
        f"bentrok {isi.get('conflict_count')}, skor {isi.get('fitness_score')}, {lama:.1f} dtk"
        if isinstance(isi, dict) and kode == 200 else str(isi)[:120]
    )
    cek("/solve — contoh payload", ok, rincian)

    if auth:
        kode, isi = panggil(f"{base}/solve", "POST", contoh, "key-sengaja-salah")
        cek("/solve tanpa key yang benar ditolak 401",
            kode == 401 and isinstance(isi, dict) and isi.get("error", {}).get("code") == "UNAUTHENTICATED", str(kode))
    else:
        print("  (lewati) uji 401 — service berjalan tanpa AI_SERVICE_KEY")

    kode, isi = panggil(f"{base}/solve", "POST", {"seminar_type": "sempro"}, args.key)
    cek("payload rusak ditolak 422",
        kode == 422 and isinstance(isi, dict) and isi.get("error", {}).get("code") == "VALIDATION_FAILED",
        str(kode))

    print(f"\n{lolos} lolos, {gagal} gagal")
    if gagal:
        raise SystemExit(1)
    print("Service siap dipakai FE/BE.")


if __name__ == "__main__":
    main()
