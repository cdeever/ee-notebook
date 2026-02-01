---
title: "Signaling Models"
weight: 15
bookCollapseSection: true
---

# Signaling Models

What exactly is the signal, and what is it measured against? Every signal needs a go path and a return path; the way those paths are arranged is a fundamental design decision that determines noise immunity, cost, and complexity. These concepts cut across every domain — audio, RF, digital, and instrumentation — and getting them wrong is the root cause of most noise, grounding, and interference problems.

## What This Section Covers

- **[Go & Return Paths]({{< relref "go-and-return-paths" >}})** — Every signal is a closed loop. Return path is not "ground." Why splitting grounds breaks signals.
- **[Reference Planes & Grounds]({{< relref "reference-planes-and-grounds" >}})** — Ground is a reference, not a destination. Local vs global, chassis vs signal, floating vs earth-referenced.
- **[Single-Ended vs Differential]({{< relref "single-ended-vs-differential" >}})** — Signal = V(A) - V(B). Single-ended is just a special case. Why symmetry matters more than shielding.
- **[Balanced vs Unbalanced]({{< relref "balanced-vs-unbalanced" >}})** — The physical implementation: how balance enables common-mode rejection, and when it breaks.
- **[Common-Mode vs Differential-Mode]({{< relref "common-mode-vs-differential-mode" >}})** — Noise taxonomy. What common-mode noise really is, why CMRR is finite, and how imbalance converts one to the other.
