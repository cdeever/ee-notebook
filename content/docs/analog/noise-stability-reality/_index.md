---
title: "Noise, Stability & Reality"
weight: 60
bookCollapseSection: true
---

# Noise, Stability & Reality

Where designs succeed or fail. Everything up to this point assumes the schematic is the truth — that components behave as drawn, signals stay where they're routed, and the PCB is just a carrier for the design. This section is about what happens when those assumptions break down.

Noise enters circuits in ways the schematic doesn't show. Feedback loops oscillate when the math says they shouldn't. And the physical layout of a board can matter more than the topology of the circuit. This is where analog design meets the real world.

## What This Section Covers

- **[Noise Sources]({{< relref "noise-sources" >}})** — Thermal, shot, and flicker noise. Where noise actually enters a circuit and what you can do about it.
- **[Feedback & Loop Intuition]({{< relref "feedback-and-loop-intuition" >}})** — What feedback does in circuits, loop gain, phase margin as a concept, and why compensation exists.
- **[Stability & Oscillation]({{< relref "stability-and-oscillation" >}})** — Feedback done right and wrong, phase margin, and why good designs still oscillate.
- **[Layout & Parasitics]({{< relref "layout-and-parasitics" >}})** — When schematics stop being the truth. Stray capacitance, ground loops, and the physical reality of PCBs.
