---
title: "Measurement, Debugging & RF Tools"
weight: 90
bookCollapseSection: true
---

# Measurement, Debugging & RF Tools

Seeing invisible problems.

RF problems are invisible — signals radiate, couple, and reflect in ways that can't be seen or easily predicted. The tools and techniques for RF measurement are specialized because the act of measuring can itself disturb the circuit. Probing a node at 1 GHz is not like probing one at 1 kHz.

This section covers the instruments, techniques, and practical approaches for measuring RF circuits, debugging oscillations and spurious emissions, and verifying that designs work as intended. The emphasis is on what's achievable with modest equipment and how to extract meaningful data from imperfect measurements.

## What This Section Covers

- **[Spectrum Analyzers]({{< relref "spectrum-analyzers" >}})** — Understanding frequency-domain measurement: swept-tuned and FFT-based spectrum analyzers, key specs, and what to look for on the display.
- **[Vector Network Analyzers]({{< relref "vector-network-analyzers" >}})** — Measuring magnitude and phase with S-parameters, calibration procedures, and practical uses including the NanoVNA.
- **[Using Oscilloscopes at RF]({{< relref "using-oscilloscopes-at-rf" >}})** — Where time-domain instruments help at RF frequencies, and where they fall short.
- **[Directional Couplers & Power Meters]({{< relref "directional-couplers-and-power-meters" >}})** — Sampling forward and reverse power, measuring RF power levels, and understanding coupling and directivity.
- **[Probing Without Destroying the Circuit]({{< relref "probing-without-destroying" >}})** — Techniques for observing RF circuits without changing what you're trying to measure.
- **[Debugging Oscillations, Noise & Spurs]({{< relref "debugging-oscillations-noise-and-spurs" >}})** — Identifying and fixing unwanted oscillations, spurious emissions, and elevated noise floors.
- **[Field-Expedient RF Measurement]({{< relref "field-expedient-measurement" >}})** — Making useful RF measurements with modest equipment, SDR receivers, and improvised techniques.
