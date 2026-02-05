---
title: "🏗️ Architecture & Abstraction"
weight: 1
bookCollapseSection: true
---

# Architecture & Abstraction

How to think about electronics at different levels — and how to move between them.

Electronic systems can be understood in terms of structure as well as circuitry. Complex behavior emerges from simpler parts combined in consistent ways, and those combinations can be examined at different levels of detail depending on the task at hand. Being able to shift perspective — to see a circuit as a collection of components, a functional block, a subsystem, or a complete device — makes unfamiliar designs easier to understand and complex problems easier to reason about.

This section introduces the structural view of electronics that underlies the rest of the notebook. It focuses on how systems are composed, how boundaries between levels behave, and how assumptions made at one level affect behavior at another. The goal is to establish a way of thinking that scales with complexity, allowing larger and less familiar systems to be understood as coherent structures rather than collections of isolated details.

The emphasis is practical. These ideas reflect how electronic systems are organized and how their behavior emerges across levels of abstraction. Understanding them makes it easier to choose the right level of detail for a given task, to interpret schematics and measurements in context, and to trace problems that cross conventional boundaries between circuits, devices, and systems.

## Sections

- **[Abstraction Layers]({{< relref "abstraction-layers" >}})** — The hierarchy from primitives to systems: what each level is, why it exists, and how to choose the right one.

- **[Composition Patterns]({{< relref "composition-patterns" >}})** — How smaller things combine into larger things: the interfaces, contracts, and assumptions at each boundary.

- **[Abstraction Leakage & Failure Propagation]({{< relref "abstraction-leakage" >}})** — How internal behavior escapes its layer, how failures propagate up and down, and how wrong-layer reasoning leads to misdiagnosis.

- **[Device-Level Thinking]({{< relref "device-level-thinking" >}})** — Defining device boundaries, managing cross-subsystem interactions, and understanding why "works alone" doesn't guarantee "works integrated."

- **[System-Level Thinking]({{< relref "system-level-thinking" >}})** — Systems as coordination problems: environmental inputs, emergent failures, and the observability limits that make system-level debugging hard.

- **[Practical Mental Models]({{< relref "practical-mental-models" >}})** — Frameworks for reasoning about energy, information, time, and control across layers — and recognizing when an abstraction is helping vs. hiding a problem.

- **[Integrated Circuits as Layer-Spanning Artifacts]({{< relref "ics-as-layer-spanning" >}})** — Why ICs don't fit neatly into one abstraction level, and what that means for reasoning about them.
