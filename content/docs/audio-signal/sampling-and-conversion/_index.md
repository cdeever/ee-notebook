---
title: "Sampling & Conversion"
weight: 30
bookCollapseSection: true
---

# Sampling & Conversion

Bridging analog and digital. Sampling is where continuous signals become discrete numbers, and reconstruction is where discrete numbers become continuous signals again. This boundary is the most critical interface in any mixed-signal system — it defines the fundamental limits on what information can be preserved.

ADCs and DACs are not black boxes. Their architecture, resolution, speed, and non-idealities directly shape what your digital processing can and cannot do. Understanding converter behavior is essential for designing systems that actually achieve their theoretical performance.

## What This Section Covers

- **[Sampling Theory]({{< relref "sampling-theory" >}})** — Nyquist criterion, aliasing, reconstruction, and practical departures from ideal sampling.
- **[Analog-to-Digital Converters]({{< relref "analog-to-digital-converters" >}})** — Resolution vs ENOB, converter architectures, and sampling rate tradeoffs.
- **[Digital-to-Analog Converters]({{< relref "digital-to-analog-converters" >}})** — DAC architectures, reconstruction filtering, glitches, and settling behavior.
