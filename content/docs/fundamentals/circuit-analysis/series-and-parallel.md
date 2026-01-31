---
title: "Series & Parallel Analysis"
weight: 10
---

# Series & Parallel Analysis

The first simplification technique: reduce series and parallel combinations to equivalent single components. It's the starting point for understanding most circuits and the first tool you reach for when making sense of a schematic.

## Series Combinations

Components in series carry the same current. Voltages add.

- **Resistors:** R_total = R1 + R2 + R3 + ...
- **Capacitors:** 1/C_total = 1/C1 + 1/C2 + ... (capacitance decreases — the smallest cap dominates)
- **Inductors:** L_total = L1 + L2 + ... (assuming no mutual coupling)

### Why Series Capacitors Seem Backwards

The series capacitor formula confuses everyone at first. Think of it this way: series capacitors are like making the dielectric thicker. A thicker dielectric means less capacitance. The series combination is always less than the smallest individual capacitor.

For two caps in series: C_total = (C1 x C2) / (C1 + C2)

## Parallel Combinations

Components in parallel share the same voltage. Currents add.

- **Resistors:** 1/R_total = 1/R1 + 1/R2 + ... (resistance decreases — the smallest R dominates)
- **Capacitors:** C_total = C1 + C2 + C3 + ... (capacitance adds directly)
- **Inductors:** 1/L_total = 1/L1 + 1/L2 + ... (assuming no mutual coupling)

For two resistors in parallel: R_total = (R1 x R2) / (R1 + R2)

Quick mental math: two equal resistors in parallel = half of one. A 10 kohm in parallel with a 1 kohm is approximately 0.9 kohm — the smaller one dominates.

## When Simplification Helps

- **Calculating total load resistance** — What does the power supply see? Reduce parallel loads to one equivalent resistance
- **Finding expected voltages** — Combine resistors, then use Ohm's law or voltage divider equations
- **Estimating filter behavior** — Equivalent RC or LC values determine cutoff frequencies
- **Quick sanity checks** — "Is this node about where I expect it?" often comes down to a quick series/parallel reduction

## When Simplification Hides Problems

- **Component tolerances disappear** — When you combine R1 + R2, you lose the individual tolerances. The worst-case equivalent resistance depends on which way each tolerance goes, and simplification sweeps this under the rug
- **Power distribution is hidden** — A single equivalent resistor doesn't tell you how power is split among the actual components. Each real resistor has its own power dissipation and thermal limit
- **Parasitic behavior doesn't simplify cleanly** — Two capacitors in parallel don't just add capacitance — they also combine their ESR (in parallel, reducing it) and their ESL (in parallel, reducing it). The simplified model of "bigger C" misses the improved high-frequency behavior that was the whole reason you paralleled them
- **Loading effects** — Replacing a load with its equivalent resistance can mask the fact that adding another branch changes what the original components see. This is where voltage divider loading analysis takes over

## Mixed Series-Parallel Networks

Most circuits aren't purely series or purely parallel. The approach:

1. Identify the innermost series or parallel group
2. Reduce it to a single equivalent element
3. Repeat until you can't simplify further
4. Apply KVL/KCL to whatever remains

Some networks (bridges, T-networks, pi-networks) can't be fully reduced by series/parallel alone. These require node or loop analysis, or delta-wye transformations.

## Gotchas

- **Series elements must carry the same current** — If there's a branch point between two elements, they're not in series. This sounds obvious but causes errors in complex schematics
- **Parallel elements must share the same two nodes** — If two elements connect between the same pair of nodes, they're in parallel. If they don't share both nodes, they're not parallel, even if they look close on the schematic
- **Real components aren't purely R, C, or L** — A real capacitor in a series chain adds its ESR as a series resistance and its ESL as a series inductance. At some frequency, this changes the effective impedance significantly
- **Don't over-simplify for AC** — At AC, you need impedances, not just resistances. A 1 kohm resistor in parallel with a 100 nF cap has different equivalent impedance at every frequency. Series/parallel reduction still works, but with complex numbers
