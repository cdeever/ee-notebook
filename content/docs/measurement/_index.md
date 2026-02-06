---
title: "📏 Measurement & Test"
weight: 10
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Measurement & Test

Organized by measurement situation — what you need to learn about the circuit — rather than starting from which instrument to pick up. Each subsection starts with a measurement situation — safety, probing, power rails, signals, noise — and works through the practical questions that come up at the bench.

Subsections are ordered prerequisites-first: safety and probing technique before anything else, simple checks (continuity, components) before complex ones (signals, spectrum, protocols), and cross-cutting skills (noise, calibration) at the end.

## Sections

- **[Safety & High Energy]({{< relref "safety-high-energy" >}})** — Mains, high voltage, CAT ratings, and the hazard assessment that comes before every measurement.

- **[Probing & Measurement Technique]({{< relref "probing-technique" >}})** — Connecting without changing the thing being measured: loading, bandwidth, and grounding.

- **[Continuity & Connections]({{< relref "continuity-connections" >}})** — The simplest checks: joints, shorts, wire mapping, and intermittent faults.

- **[Component Testing]({{< relref "component-testing" >}})** — Go/no-go checks, actual values, tolerance, and characterizing ESR, leakage, and gain.

- **[Power Rails & Supplies]({{< relref "power-rails-supplies" >}})** — Supply verification, regulation, ripple, current draw, sequencing, and energy storage health.

- **[Signals & Waveforms]({{< relref "signals-waveforms" >}})** — Following signals through the circuit: presence, shape, gain, distortion, and finding where they go wrong.

- **[Time, Frequency & Spectrum]({{< relref "time-frequency-spectrum" >}})** — Signal characterization in both domains: rise times, jitter, harmonics, bandwidth, and frequency content.

- **[Digital Logic & Protocols]({{< relref "digital-logic-protocols" >}})** — Logic levels, bus health, protocol decode, clock-data alignment, and speed failures.

- **[Audio & Analog Circuits]({{< relref "audio-analog" >}})** — THD, SNR, frequency response, gain structure, and sensor interfaces where the signal is the product.

- **[Noise, Interference & Grounding]({{< relref "noise-interference-grounding" >}})** — Tracking unwanted signals: EMI, ground loops, crosstalk, coupling, and empirical fixes.

- **[Calibration & Measurement Confidence]({{< relref "calibration-confidence" >}})** — Trusting the readings: accuracy, artifacts, calibration status, and measurement uncertainty.

- **[Test Instruments]({{< relref "test-instruments" >}})** — Reference material for the instruments mentioned throughout: key specs, what they mean, feature tiers, and which capability level different work demands.
