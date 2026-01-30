---
title: "Signals & Waveforms"
weight: 60
bookCollapseSection: true
---

# Signals & Waveforms

Following signals stage by stage. Presence, shape, gain, distortion, clipping. When the output isn't right, the signal path is where you find out why.

## What This Section Covers

Measurement intent — the questions you're trying to answer at the bench:

- **Is the signal present at this node?** — Confirming that a signal exists where it should. No signal at all is a different problem than a wrong signal.
- **Does it match the expected waveform?** — Comparing what you see to what the datasheet, schematic, or simulation predicts. Amplitude, shape, DC offset, frequency.
- **Where in the chain does it go wrong?** — Stage-by-stage signal tracing. Input looks fine, output doesn't — so you walk through the circuit until you find where it breaks.
- **Is this stage adding distortion or clipping?** — Waveform integrity through amplifier stages, filters, and buffers. Catching soft clipping, crossover distortion, saturation, and unexpected nonlinearity.
