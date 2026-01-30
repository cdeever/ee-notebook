---
title: "Impedance Matching"
weight: 30
bookCollapseSection: true
---

# Impedance Matching

Making power go where you want it.

Impedance matching is the art of making two parts of an RF system look like they belong together electrically. When impedances are matched, power transfers efficiently and reflections are minimized. When they're not, energy bounces back, signals degrade, and components can be damaged.

Matching shows up everywhere in RF — between antennas and feedlines, amplifiers and filters, sources and loads. The tools range from simple L-networks to Smith chart transformations, but the underlying goal is always the same: minimize reflections and maximize power delivery.

## What This Section Covers

- **[Power Transfer vs Voltage Transfer]({{< relref "power-transfer-vs-voltage-transfer" >}})** — Why RF systems optimize for maximum power delivery rather than maximum voltage, and how this shapes the 50-ohm convention.
- **[Why Mismatches Cause Reflections]({{< relref "why-mismatches-cause-reflections" >}})** — The physical mechanism behind signal reflections at impedance boundaries and why they matter.
- **[Simple Matching Networks]({{< relref "simple-matching-networks" >}})** — L-networks, pi-networks, and T-networks for transforming impedance between stages.
- **[Broadband vs Narrowband Matching]({{< relref "broadband-vs-narrowband-matching" >}})** — The fundamental tradeoffs between match bandwidth, loss, and complexity.
- **[Smith Chart Intuition]({{< relref "smith-chart-intuition" >}})** — Building graphical intuition for impedance transformations without drowning in math.
- **[Matching Antennas, Amplifiers & Filters]({{< relref "matching-antennas-amplifiers-and-filters" >}})** — Practical matching at real-world interfaces where impedances aren't purely resistive.
- **[Real-World Compromises & Tolerances]({{< relref "real-world-compromises-and-tolerances" >}})** — Why perfect matches exist only on paper and how to decide when "good enough" is good enough.
