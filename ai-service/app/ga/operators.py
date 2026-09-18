"""Operator GA: tournament selection, uniform crossover, reassignment mutation."""

from __future__ import annotations

import random

from app.ga.fitness import Chromosome

RNG = random.Random


def tournament(
    pop: list[Chromosome], fits: list[float], k: int, rng: RNG
) -> Chromosome:
    best_i = rng.randrange(len(pop))
    for _ in range(k - 1):
        j = rng.randrange(len(pop))
        if fits[j] > fits[best_i]:
            best_i = j
    return pop[best_i][:]


def uniform_crossover(
    a: Chromosome, b: Chromosome, rate: float, rng: RNG
) -> tuple[Chromosome, Chromosome]:
    if rng.random() >= rate:
        return a[:], b[:]
    c1, c2 = a[:], b[:]
    for i in range(len(a)):
        if rng.random() < 0.5:
            c1[i], c2[i] = c2[i], c1[i]
    return c1, c2


def reassign_mutation(
    chromo: Chromosome, domains: list[list[int]], rate: float, rng: RNG
) -> Chromosome:
    out = chromo[:]
    for i in range(len(out)):
        if out[i] < 0:
            continue
        if rng.random() < rate and domains[i]:
            out[i] = rng.choice(domains[i])
    return out
