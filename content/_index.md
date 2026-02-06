---
title: "EE Notebook"
type: docs
---

# EE Notebook

**The gap between knowing a law and applying it at the bench is where most learning happens.**

This notebook exists to bridge that gap. It is a working reference for electronics — not a textbook that stops at theory, and not a cookbook that skips the reasoning. Many resources emphasize equations without explaining how real circuits behave. The result is math that can be solved but hardware that still surprises. The emphasis is on building intuition: how components behave, why circuits respond the way they do, and what changes when ideal assumptions no longer hold. Every entry connects concepts to real measurements, expected behavior to actual symptoms, and ideal models to the messy reality of components on a board.

**What lives here:**

- **Practical depth** — Each topic goes deep enough to apply correctly. Not just Ohm's law, but where it misleads. Not just decoupling, but why placement matters and what happens when it's wrong.

- **Tips and Caveats** — Each entry calls out the conditions where intuition breaks down, measurements mislead, or simplified models quietly fail. These are surfaced explicitly so they are recognized before costing hours of investigation.

- **In Practice** — When a circuit misbehaves, the explanation is usually found in the fundamentals. Entries connect theory to observable behavior at the bench: resets that occur only under load, oscillations that appear only when warm, voltages that don't match the schematic.

The goal is **applied reasoning**: understanding when a rule applies, when it does not, and what measurements are actually revealing when numbers fail to match expectation. That capability is what turns theory into working hardware.

## How It's Organized

The sections follow a loose layering. Physical constraints come first. Engineered behavior builds on those constraints. Design turns ideas into hardware. Measurement, debugging, and repair reveal how that hardware behaves in the real world.

**The physics layer** — rules that cannot be negotiated:

- **[Fundamentals]({{< relref "/docs/fundamentals" >}})** — Ohm's law, Kirchhoff's laws, power and energy, passive components, semiconductor devices, and circuit analysis. The universal constraints and behavioral primitives underlying every circuit.

**The engineering layer** — designed behavior built on those constraints:

- **[Analog Electronics]({{< relref "/docs/analog" >}})** — Transistors, op-amps, amplifiers, filters, regulators. Continuous-signal design where performance is shaped by tradeoffs between gain, bandwidth, noise, and stability.
- **[Digital Electronics]({{< relref "/docs/digital" >}})** — Logic gates, flip-flops, timing, buses, and state machines. Discrete abstraction layered over analog reality — until transitions become fast enough that the analog layer reasserts itself.
- **[Embedded Systems]({{< relref "/docs/embedded" >}})** — MCU and MPU architecture, single-board computers, peripherals, firmware, and toolchains. Where hardware and software meet and timing constraints define what is possible.
- **[Audio & Signal Processing]({{< relref "/docs/audio-signal" >}})** — Filters, FFT, DACs, ADCs, and sampling theory. The information layer: capturing, transforming, and reproducing signals.
- **[Radio & RF]({{< relref "/docs/radio-rf" >}})** — Antennas, impedance matching, transmission lines, and propagation. The domain where wavelength matters and low-frequency intuition stops working.

**The design process layer** — turning ideas into working hardware:

- **[Design & Development]({{< relref "/docs/design-development" >}})** — From requirements through schematic, layout, prototyping, and validation. The workflow and discipline required to turn concepts into reliable hardware.

**The context layer** — learning from what came before:

- **[Retro & Legacy Systems]({{< relref "/docs/retro-legacy" >}})** — Vintage equipment, legacy interfaces, and discrete-era design. Older circuits expose the physics directly — gain stages, bias networks, and protection schemes visible on the schematic. Studying earlier designs builds intuition that transfers forward and helps bridge modern systems to hardware still in service.

**The practice layer** — verifying and fixing what gets built:

- **[Measurement & Test]({{< relref "/docs/measurement" >}})** — Organized by what is being measured rather than by instrument. Methods for determining what is actually happening in a circuit.
- **[Debugging, Failure & Repair]({{< relref "/docs/debugging" >}})** — Troubleshooting strategies, common failure modes, and rework techniques. The discipline required when observed behavior disagrees with the expected model.
