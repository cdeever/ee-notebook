---
title: "Software-Defined Radio (SDR)"
weight: 80
bookCollapseSection: true
---

# Software-Defined Radio (SDR)

Where the analog front end meets the digital back end.

Software-defined radio moves signal processing from analog hardware into software. Instead of fixed-function receivers with crystal filters and analog demodulators, an SDR digitizes a wide swath of spectrum and processes it computationally. This makes the radio flexible, reconfigurable, and — for learning — extraordinarily revealing.

SDR is both a practical technology and a powerful learning tool. It makes RF visible in ways that traditional test equipment doesn't — you can see entire bands, demodulate signals in real time, and experiment with modulation and filtering without building analog hardware.

## What This Section Covers

- **[What SDR Actually Replaces]({{< relref "what-sdr-replaces" >}})** — The traditional receiver chain and which parts move into software, which stay in hardware, and what that tradeoff means.
- **[I/Q Signals & Quadrature]({{< relref "iq-signals-and-quadrature" >}})** — How two signals 90 degrees apart capture both amplitude and phase, enabling all modern digital radio processing.
- **[Sampling Theory at RF]({{< relref "sampling-theory-at-rf" >}})** — Nyquist, bandpass sampling, quantization noise, and why the analog front end still determines what the ADC can usefully capture.
- **[Dynamic Range & Front-End Limits]({{< relref "dynamic-range-and-front-end-limits" >}})** — Why the span between weakest and strongest signal matters, and how ADC resolution and analog filtering set the boundaries.
- **[Common SDR Architectures]({{< relref "common-sdr-architectures" >}})** — From $20 RTL-SDR dongles to research-grade platforms, and how their hardware choices determine performance.
- **[Practical SDR Tools & Workflows]({{< relref "practical-sdr-tools-and-workflows" >}})** — Software for receiving, demodulating, recording, and analyzing signals with an SDR.
- **[SDR as a Learning Instrument]({{< relref "sdr-as-a-learning-instrument" >}})** — Using SDR to make RF concepts visible, from modulation and filtering to antenna comparison and protocol decoding.
