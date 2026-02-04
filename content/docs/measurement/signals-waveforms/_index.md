---
title: "Signals & Waveforms"
weight: 60
bookCollapseSection: true
---

# Signals & Waveforms

Following signals stage by stage. Presence, shape, gain, distortion, clipping. When the output isn't right, the signal path is where the answer lies.

- **[Is the signal present at this node?]({{< relref "signal-present" >}})** — Confirming that a signal exists where it should. No signal at all is a different problem than a wrong signal.
- **[Does it match the expected waveform?]({{< relref "expected-waveform" >}})** — Comparing what the scope shows to what the datasheet, schematic, or simulation predicts. Amplitude, shape, DC offset, frequency.
- **[Where in the chain does it go wrong?]({{< relref "signal-tracing" >}})** — Stage-by-stage signal tracing. Input looks fine, output doesn't — walk through the circuit until the break point appears.
- **[Is this stage adding distortion or clipping?]({{< relref "distortion-clipping" >}})** — Waveform integrity through amplifier stages, filters, and buffers. Catching soft clipping, crossover distortion, saturation, and unexpected nonlinearity.
