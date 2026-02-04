---
title: "🏗️ Architecture & Abstraction"
weight: 4
bookCollapseSection: true
---

# Architecture & Abstraction

How to think about electronics at different levels — and how to move between them.

Electronics is built in layers. A resistor divider is a primitive. A voltage regulator is a block. A power supply is a subsystem. A bench instrument is a device. A test setup with DUT, supply, and scope is a system. Each layer hides detail from the one above it, and each layer depends on assumptions about the one below. When those assumptions hold, the abstraction saves time and mental effort. When they don't, the abstraction becomes a trap.

This section is not about circuit design or specific technologies — those belong in their respective sections. It's about the structural thinking that cuts across all of them: how to decompose a problem, how to recognize which level of detail matters right now, how to trace failures that cross layer boundaries, and how to build mental models that survive contact with real hardware.

The emphasis is practical. These aren't software-engineering abstractions applied to hardware by analogy — they're patterns that emerge from working with real circuits, real ICs, and real systems on the bench.

## Sections

- **[The Abstraction Ladder]({{< relref "abstraction-ladder" >}})** — The hierarchy from primitives to systems: what each level is, why it exists, and how to choose the right one.

- **[Composition Patterns]({{< relref "composition-patterns" >}})** — How smaller things combine into larger things: the interfaces, contracts, and assumptions at each boundary.

- **[Integrated Circuits as Layer-Spanning Artifacts]({{< relref "ics-as-layer-spanning" >}})** — Why ICs don't fit neatly into one abstraction level, and what that means for reasoning about them.

- **[Abstraction Leakage & Failure Propagation]({{< relref "abstraction-leakage" >}})** — How internal behavior escapes its layer, how failures propagate up and down, and how wrong-layer reasoning leads to misdiagnosis.

- **[Device-Level Thinking]({{< relref "device-level-thinking" >}})** — Defining device boundaries, managing cross-subsystem interactions, and understanding why "works alone" doesn't guarantee "works integrated."

- **[System-Level Thinking]({{< relref "system-level-thinking" >}})** — Systems as coordination problems: environmental inputs, emergent failures, and the observability limits that make system-level debugging hard.

- **[Practical Mental Models]({{< relref "practical-mental-models" >}})** — Frameworks for reasoning about energy, information, time, and control across layers — and recognizing when an abstraction is helping vs. hiding a problem.

- **[Building Blocks Reference]({{< relref "building-blocks-reference" >}})** — A browseable catalog of common electronics building blocks organized by abstraction level, from single components to multi-device systems.
