---
title: "Amplifiers & Gain Stages"
weight: 20
bookCollapseSection: true
---

# Amplifiers & Gain Stages

Turning small signals into usable ones. Amplification is the core analog function — taking a weak signal and making it strong enough to drive a load, feed an ADC, or travel down a cable. The challenge is doing this without adding too much noise, distortion, or instability.

This section progresses from single-transistor stages through op-amp circuits to multistage designs, building intuition about gain, impedance, and the tradeoffs that every amplifier design confronts.

## What This Section Covers

- **[Single-Transistor Amplifiers]({{< relref "single-transistor-amplifiers" >}})** — Common emitter/source intuition, input/output impedance, and gain limits.
- **[Op-Amps]({{< relref "op-amps" >}})** — Ideal assumptions and why they fail, inverting/non-inverting/buffer topologies, and real-world limitations.
- **[Multistage Amplifiers]({{< relref "multistage-amplifiers" >}})** — Cascading gain, interstage coupling, stability, and loading effects.
