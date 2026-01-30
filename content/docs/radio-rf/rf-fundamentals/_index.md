---
title: "RF Fundamentals & Wavelength Thinking"
weight: 10
bookCollapseSection: true
---

# RF Fundamentals & Wavelength Thinking

Rewiring intuition for high-frequency design.

This section is about the conceptual shift required when frequency rises high enough that physical dimensions matter. At low frequencies, wires are wires and circuits behave as schematics suggest. At RF, the physical world asserts itself — signals have spatial extent, and geometry becomes part of the design.

Understanding these fundamentals is prerequisite to everything else in RF — transmission lines, matching, layout, and antenna work all depend on thinking in terms of wavelengths, phase, and distributed effects rather than lumped components.

## What This Section Covers

- **[Frequency vs Wavelength]({{< relref "frequency-vs-wavelength" >}})** — When physical size starts to matter, and how the relationship between frequency and wavelength reshapes circuit design.
- **[Phase, Delay & Timing in Physical Space]({{< relref "phase-delay-and-timing" >}})** — Signals take time to propagate, and at RF that delay is a significant fraction of a cycle.
- **[Lumped vs Distributed Systems]({{< relref "lumped-vs-distributed" >}})** — When a component can be treated as a single point vs when it must be modeled as having spatial extent.
- **[Skin Effect & Proximity Effect]({{< relref "skin-effect-and-proximity-effect" >}})** — Current crowds to the surface of conductors at high frequencies, changing resistance and loss.
- **[When Short Wires Stop Being Short]({{< relref "when-short-wires-stop-being-short" >}})** — A wire's behavior depends on its length relative to wavelength, not just its physical size.
- **[Why RF Problems Feel Non-Local]({{< relref "why-rf-problems-feel-non-local" >}})** — At RF, energy couples through fields, making problems difficult to localize on a schematic.
