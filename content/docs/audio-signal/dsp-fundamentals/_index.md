---
title: "DSP Fundamentals"
weight: 40
bookCollapseSection: true
---

# DSP Fundamentals

Processing signals as numbers. Once a signal is digitized, it becomes a sequence of discrete samples — and everything from filtering to spectral analysis becomes arithmetic. DSP is where math meets real-time constraints: the operations are conceptually simple (multiply, add, shift) but the design choices are subtle.

This section focuses on building intuition for what digital signal processing does to signals, not on software implementation details. The goal is understanding FIR vs IIR tradeoffs, knowing what an FFT actually tells you, and recognizing when fixed-point arithmetic is distorting your results — whether you're working on an MCU, FPGA, or dedicated DSP chip.

## What This Section Covers

- **[Discrete-Time Signals]({{< relref "discrete-time-signals" >}})** — Samples, sequences, frames, windowing, and the practical realities of working with discrete data.
- **[Digital Filters]({{< relref "digital-filters" >}})** — FIR and IIR filters: stability, phase, computational cost, and fixed-point implementation concerns.
- **[Transforms]({{< relref "transforms" >}})** — FFT, spectral bins, frequency resolution, leakage, and practical spectral analysis.
