"""Loop GA + terminasi. `solve(request)` = pipeline lengkap 5 fase."""

from __future__ import annotations

import random
import time

from app.ga.chromosome import decode, initial_population
from app.ga.context import build_context
from app.ga.fitness import Chromosome, FitnessBreakdown, evaluate
from app.ga.operators import reassign_mutation, tournament, uniform_crossover
from app.ga.slots import build_candidate_slots, reduce_domains
from app.models import SlotOut, SolveRequest, SolveResponse, UnscheduledOut


def run_ga(ctx, slots, domains, params, on_generation=None, trace=None):
    """`trace` (dict, opsional) diisi jejak evolusi untuk peraga — tidak mengubah hasil."""
    rng = random.Random(params.random_seed)
    pop = initial_population(ctx, slots, domains, params.population_size, rng)

    def score(ch: Chromosome) -> FitnessBreakdown:
        return evaluate(ch, ctx, slots)

    breaks = [score(ch) for ch in pop]
    fits = [b.fitness for b in breaks]

    best_i = max(range(len(pop)), key=lambda i: fits[i])
    best, best_break = pop[best_i][:], breaks[best_i]
    history = [best_break.fitness]
    if trace is not None:
        trace["pop0"] = [ch[:] for ch in pop]
        trace["fits0"] = fits[:]
        trace["gen0_best"] = best[:]
        trace["generations"] = [_gen_stats(0, breaks, fits, best_break)]
        trace["termination"] = "batas generasi maksimum"

    started = time.perf_counter()
    plateau = 0
    gen = 0
    for gen in range(1, params.generations + 1):
        # elitism
        elite_idx = sorted(range(len(pop)), key=lambda i: fits[i], reverse=True)[
            : params.elitism_count
        ]
        new_pop = [pop[i][:] for i in elite_idx]

        while len(new_pop) < params.population_size:
            p1 = tournament(pop, fits, params.tournament_size, rng)
            p2 = tournament(pop, fits, params.tournament_size, rng)
            c1, c2 = uniform_crossover(p1, p2, params.crossover_rate, rng)
            c1 = reassign_mutation(c1, domains, params.mutation_rate, rng)
            c2 = reassign_mutation(c2, domains, params.mutation_rate, rng)
            new_pop.append(c1)
            if len(new_pop) < params.population_size:
                new_pop.append(c2)

        pop = new_pop
        breaks = [score(ch) for ch in pop]
        fits = [b.fitness for b in breaks]
        cur_i = max(range(len(pop)), key=lambda i: fits[i])

        if fits[cur_i] > best_break.fitness + 1e-9:
            best, best_break = pop[cur_i][:], breaks[cur_i]
            plateau = 0
        else:
            plateau += 1

        history.append(best_break.fitness)
        if on_generation:
            on_generation(gen, best_break)
        if trace is not None:
            trace["generations"].append(_gen_stats(gen, breaks, fits, best_break))

        # terminasi
        stop = None
        if best_break.v_hard == 0 and plateau >= params.plateau_generations:
            stop = f"hard = 0 dan tidak ada perbaikan selama {params.plateau_generations} generasi"
        elif plateau >= params.plateau_generations * 2:
            stop = f"tidak ada perbaikan selama {params.plateau_generations * 2} generasi"
        elif time.perf_counter() - started > params.max_seconds:
            stop = f"batas waktu {params.max_seconds:g} detik"
        if stop:
            if trace is not None:
                trace["termination"] = stop
            break

    if trace is not None:
        trace["best"] = best[:]

    return best, best_break, gen, history


def _gen_stats(gen: int, breaks: list[FitnessBreakdown], fits: list[float], best) -> dict:
    return {
        "g": gen,
        "best": round(best.fitness, 3),
        "avg": round(sum(fits) / len(fits), 3),
        "v_hard": best.v_hard,
        "soft": round(best.soft_score, 4),
        "feasible": sum(1 for b in breaks if b.v_hard == 0),
    }


def solve(req: SolveRequest, trace: dict | None = None) -> SolveResponse:
    t0 = time.perf_counter()
    ctx = build_context(req)
    slots = build_candidate_slots(ctx)
    domains, unsched_pairs = reduce_domains(ctx, slots)

    scheduled_idx = [i for i, d in enumerate(domains) if d]
    if not scheduled_idx:
        return SolveResponse(
            status="no_feasible_slot",
            fitness_score=0.0,
            conflict_count=0,
            generations_run=0,
            execution_time_ms=int((time.perf_counter() - t0) * 1000),
            stats={"jumlah_slot_kandidat": len(slots), "domain_kosong_semua": True},
            schedule=[],
            unscheduled=[UnscheduledOut(seminar_id=sid, alasan=a) for sid, a in unsched_pairs],
        )

    best, brk, gens, history = run_ga(ctx, slots, domains, req.ga_params, trace=trace)

    sched = decode(best, slots, ctx)
    # statistik kepadatan dosen dari solusi terbaik
    penguji_gt1 = brk.detail["s0_menguji_lebih_dari_1"]
    total_gt1 = brk.detail["s1_keterlibatan_lebih_dari_1"]
    n_placed = len(sched)
    avg_per_dosen = round((n_placed * 4) / max(1, _n_unique_dosen(req)), 2)

    max_soft = 10 + 5 + 4 + 3 + 2 + 1
    skor_kualitas = round(100.0 * (1.0 - min(1.0, brk.soft_score / max_soft)), 1)

    return SolveResponse(
        status="success" if brk.v_hard == 0 else "partial",
        fitness_score=skor_kualitas,
        conflict_count=brk.v_hard,
        generations_run=gens,
        execution_time_ms=int((time.perf_counter() - t0) * 1000),
        stats={
            "jumlah_seminar": len(req.seminars),
            "jumlah_terjadwal": n_placed,
            "jumlah_slot_kandidat": len(slots),
            "rata_ukuran_domain": round(
                sum(len(d) for d in domains) / max(1, len(domains)), 1
            ),
            "dosen_menguji_lebih_dari_1_topik_per_hari": penguji_gt1,
            "dosen_dengan_lebih_dari_1_keterlibatan_per_hari": total_gt1,
            "rata_rata_sidang_per_dosen": avg_per_dosen,
            "fitness_history": [round(h, 2) for h in history],
            "constraint_detail": brk.detail,
        },
        schedule=[SlotOut(**s) for s in sched],
        unscheduled=[UnscheduledOut(seminar_id=sid, alasan=a) for sid, a in unsched_pairs],
    )


def _n_unique_dosen(req: SolveRequest) -> int:
    ids: set[int] = set()
    for s in req.seminars:
        ids.update(s.dosen_ids)
    return len(ids)
