---
title: "EE Notebook"
type: docs
---

# EE Notebook

This is a working notebook for learning electronics and electrical engineering — a place to record concepts, experiments, procedures, gotchas, and patterns as I encounter them.

The tone here is exploratory. This is what I'm learning, not what I'm teaching. Entries capture understanding as it develops — sometimes incomplete, sometimes wrong and later corrected, always honest about what I do and don't yet know. Each section holds evergreen entries that get revised and expanded over time rather than dated posts that grow stale.

## How It's Organized

The sections follow a rough layering. Nature's constraints come first. Human-engineered behavior is built on top. Practice — measurement and debugging — runs through everything.

**The physics layer** — rules you can't negotiate with:

- **[Fundamentals]({{< relref "/docs/fundamentals" >}})** — Ohm's law, Kirchhoff's laws, power and energy, passive component behavior, circuit analysis, and the unit system. The universal constraints that every circuit obeys whether you remember them or not.

**The engineering layer** — designed behavior built on top of those constraints:

- **[Analog Electronics]({{< relref "/docs/analog" >}})** — Transistors, op-amps, amplifiers, filters, regulators. Continuous-signal design where everything is a tradeoff between gain, bandwidth, noise, and stability.
- **[Digital Electronics]({{< relref "/docs/digital" >}})** — Logic gates, flip-flops, timing, buses, state machines. Discrete abstraction layered over analog reality — until edges get fast enough that the analog reality shows through.
- **[Microcontrollers & Embedded]({{< relref "/docs/embedded" >}})** — MCU architecture, peripherals, firmware, toolchains. Where hardware meets software and timing constraints define what's possible.
- **[Audio & Signal Processing]({{< relref "/docs/audio-signal" >}})** — Filters, FFT, DACs, ADCs, sampling theory. The information layer — capturing, transforming, and reproducing signals.
- **[Radio & RF]({{< relref "/docs/radio-rf" >}})** — Antennas, impedance matching, transmission lines, propagation. Where wavelength matters and low-frequency intuition breaks down.

**The practice layer** — verifying and fixing the things you build:

- **[Measurement & Test]({{< relref "/docs/measurement" >}})** — Organized by what you're trying to measure, not which instrument you pick up. How you find out what's actually happening.
- **[Debugging, Failure & Repair]({{< relref "/docs/debugging" >}})** — Troubleshooting methods, failure modes, rework techniques. What you do when reality disagrees with your model.
