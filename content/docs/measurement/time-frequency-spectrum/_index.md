---
title: "Time, Frequency & Spectrum"
weight: 70
bookCollapseSection: true
---

# Time, Frequency & Spectrum

Signal characterization in time and frequency domains. Rise times, jitter, clock accuracy, harmonics, bandwidth, spurs. Moving beyond "is it there?" to "what exactly is it?"

## What This Section Covers

Measurement intent — the questions you're trying to answer at the bench:

- **Is this clock at the right frequency?** — Frequency measurement with counters, scopes, and FFT. Crystal oscillators, PLLs, RC oscillators, and clock dividers.
- **What's the rise/fall time?** — Edge speed matters for signal integrity, EMI, and logic timing. Measuring edges accurately (and knowing when your scope is the bottleneck).
- **What harmonics are present?** — FFT and spectrum analysis. Identifying harmonic content, switching artifacts, and unexpected frequency components.
- **What's the actual bandwidth here?** — Measuring the real bandwidth of amplifiers, filters, and signal paths vs. what the datasheet claims.
- **Is there jitter, and where is it from?** — Timing variation on clocks and data signals. Random vs. deterministic jitter, period jitter, and cycle-to-cycle measurements.
