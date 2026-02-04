---
title: "Building Blocks Reference"
weight: 80
bookCollapseSection: true
---

# Building Blocks Reference

A music analogy helps frame what each abstraction level contains. Primitives are like individual notes — atomic, well-characterized by physics, and meaningless in isolation. Blocks are phrases or riffs — small combinations with a recognizable purpose and a transferable identity. Subsystems are songs — complete functional pieces with internal structure, a beginning and end, and a spec that describes what they deliver. Devices are albums — self-contained, packaged for an audience, with defined interfaces to the outside world. Systems are concerts — multiple pieces coordinated in real time, in a real environment, where emergent behavior matters as much as individual performance.

This is not an exhaustive catalog. It's a reference of building blocks encountered during learning, organized by the abstraction level where reasoning about them most naturally applies. Each entry notes what the thing is, what parameters matter, which domains it appears in, and how it composes downward (what it's built from) and upward (what it appears inside). Some entries sit ambiguously between levels — an op-amp is purchased as a primitive but reasons like a block — and those boundary cases are noted where they arise.

The catalog will grow over time as new circuits and systems appear on the bench.

## Pages

- **[Primitives]({{< relref "primitives" >}})** — Single components: the parts that appear on a BOM line, characterized by a datasheet, and reasoned about in terms of voltage, current, impedance, and thermal limits.

- **[Blocks]({{< relref "blocks" >}})** — Functional circuit units built from a handful of primitives: the smallest groupings that have a coherent purpose on a schematic.

- **[Subsystems]({{< relref "subsystems" >}})** — Integrated functional units with defined performance specifications: collections of blocks that together deliver a measurable capability.

- **[Devices]({{< relref "devices" >}})** — Self-contained products or modules with external interfaces: things that come in enclosures, have connectors, and are documented as units.

- **[Systems]({{< relref "systems" >}})** — Multi-device configurations coordinated to accomplish a purpose: test setups, signal chains, and control loops where emergent behavior dominates.
