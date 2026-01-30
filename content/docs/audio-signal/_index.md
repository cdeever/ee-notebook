---
title: "🎵 Audio & Signal Processing"
weight: 5
bookCollapseSection: true
---

# Audio & Signal Processing

Where analog meets digital, one sample at a time.

Signals start as continuous physical phenomena — sound pressure, sensor output, radio waves — and must be captured, conditioned, digitized, processed, and reproduced. This section follows that signal flow from microphone to speaker, from sensor to screen, tracing how information is preserved and transformed at each stage.

The focus is hardware-oriented DSP intuition: understanding what converters, filters, and modulators actually do to signals, and why practical systems deviate from textbook ideals. This is not a software DSP library tutorial or a pure mathematics course — it's about building intuition for what happens to real signals in real circuits.

## Sections

- **[Signals & Waveforms]({{< relref "signals-and-waveforms" >}})** — Time-domain and frequency-domain fundamentals: how signals are described, measured, and characterized.
- **[Analog Front Ends]({{< relref "analog-front-ends" >}})** — Preamps, analog filters, and signal conditioning: preparing real-world signals for conversion.
- **[Sampling & Conversion]({{< relref "sampling-and-conversion" >}})** — ADCs, DACs, and sampling theory: bridging the analog and digital domains.
- **[DSP Fundamentals]({{< relref "dsp-fundamentals" >}})** — Discrete-time signals, digital filters, and transforms: processing signals in the digital domain.
- **[Modulation & Encoding]({{< relref "modulation-and-encoding" >}})** — AM, FM, PWM, PDM, and digital modulation: moving information by reshaping signals.
- **[Audio Systems & Signal Chains]({{< relref "audio-systems-and-signal-chains" >}})** — Gain staging, latency, and multistage design: building complete systems from individual blocks.
- **[Practical Signal Reality]({{< relref "practical-signal-reality" >}})** — Quantization, jitter, and measurement: where theory meets the bench.
