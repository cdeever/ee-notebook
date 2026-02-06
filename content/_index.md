---
title: "EE Notebook"
type: docs
---

# EE Notebook

**The gap between knowing a law and applying it at the bench is where most learning happens.**

This notebook bridges that gap. It's a working reference for electronics — not a textbook that stops at theory, and not a cookbook that skips the reasoning. Too many resources bury behavior under math, leaving you able to solve equations but not predict what a circuit will actually do. Here, the emphasis is on building intuition: how components behave, why circuits respond the way they do, and what changes when ideal assumptions don't hold. Every entry connects concepts to real measurements, expected behavior to actual symptoms, and ideal models to the messy reality of components on a board.

What you'll find here:

- **Practical depth** — Each topic goes deep enough to apply correctly. Not just "Ohm's law" but when it misleads you. Not just "use a decoupling capacitor" but why placement matters and what happens when it's wrong.
- **Tips and Caveats** — Every entry includes tips for staying on the happy path and caveats where intuition breaks down, measurements mislead, or the textbook model quietly fails. These are collected explicitly so you recognize them before they cost you hours.
- **In Practice** — When a circuit misbehaves, the answer is usually in the fundamentals. Entries connect theory to observable behavior at the bench — the reset that happens under load, the oscillation that appears only when warm, the voltage that doesn't match the schematic.

The goal is **applied reasoning**: knowing when a rule applies, knowing when it doesn't, and understanding what your measurements are telling you when the numbers don't add up. That skill is what turns theory into working hardware.

## How It's Organized

The sections follow a rough layering. Nature's constraints come first. Human-engineered behavior is built on top. The design process turns ideas into hardware. Practice — measurement and debugging — runs through everything.

**The physics layer** — rules you can't negotiate with:

- **[Fundamentals]({{< relref "/docs/fundamentals" >}})** — Ohm's law, Kirchhoff's laws, power and energy, passive components, semiconductor devices, and circuit analysis. The universal constraints and behavioral primitives that every circuit is built from.

**The engineering layer** — designed behavior built on top of those constraints:

- **[Analog Electronics]({{< relref "/docs/analog" >}})** — Transistors, op-amps, amplifiers, filters, regulators. Continuous-signal design where everything is a tradeoff between gain, bandwidth, noise, and stability.
- **[Digital Electronics]({{< relref "/docs/digital" >}})** — Logic gates, flip-flops, timing, buses, state machines. Discrete abstraction layered over analog reality — until edges get fast enough that the analog reality shows through.
- **[Embedded Systems]({{< relref "/docs/embedded" >}})** — MCU and MPU architecture, single-board computers, peripherals, firmware, toolchains. Where hardware meets software and timing constraints define what's possible.
- **[Audio & Signal Processing]({{< relref "/docs/audio-signal" >}})** — Filters, FFT, DACs, ADCs, sampling theory. The information layer — capturing, transforming, and reproducing signals.
- **[Radio & RF]({{< relref "/docs/radio-rf" >}})** — Antennas, impedance matching, transmission lines, propagation. Where wavelength matters and low-frequency intuition breaks down.

**The design process layer** — turning ideas into working hardware:

- **[Design & Development]({{< relref "/docs/design-development" >}})** — From requirements through schematic, layout, prototyping, and validation. The workflow and discipline of turning a concept into working hardware.

**The context layer** — learning from what came before:

- **[Retro & Legacy Systems]({{< relref "/docs/retro-legacy" >}})** — Vintage equipment, legacy interfaces, and discrete-era design. Older circuits expose the physics directly — every gain stage and bias network visible on the schematic. Understanding how things were built before integration builds intuition that transfers forward, and bridges the gap when interfacing modern systems with hardware that's still in service.

**The practice layer** — verifying and fixing the things you build:

- **[Measurement & Test]({{< relref "/docs/measurement" >}})** — Organized by what you're trying to measure, not which instrument you pick up. How you find out what's actually happening.
- **[Debugging, Failure & Repair]({{< relref "/docs/debugging" >}})** — Troubleshooting methods, failure modes, rework techniques. What you do when reality disagrees with your model.
