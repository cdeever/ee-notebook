---
title: "Composition Patterns"
weight: 20
bookCollapseSection: true
---

# Composition Patterns

Electronics is built by combining smaller things into larger things — but the combining is not arbitrary. A voltage divider isn't just "two resistors near each other." It's two resistors in a specific relationship, with a specific contract: the output voltage is a defined fraction of the input, as long as the load doesn't draw too much current. That contract — what the combination promises and what it requires — is what turns a collection of parts into a functional unit.

This section traces how composition works at each transition in the abstraction ladder: how primitives become blocks, blocks become subsystems, and subsystems become devices. At each step, something new emerges — a transfer function, a specification, an interface — that didn't exist in the pieces individually. And at each step, new failure modes appear that couldn't exist in the pieces alone: interactions between parts, loading effects, stability concerns, and coupling through shared resources like power and ground.

Understanding these composition patterns isn't just an intellectual exercise. It directly shapes how schematics are read, how a design gets partitioned for testing, and how faults are isolated. Knowing how things were put together reveals where the seams are — and the seams are where things come apart.

## What This Section Covers

- **[From Primitive to Block]({{< relref "from-primitive-to-block" >}})** — How individual components combine into functional circuits with coherent purpose.

- **[From Block to Subsystem]({{< relref "from-block-to-subsystem" >}})** — How functional blocks compose into subsystems with defined specifications.

- **[From Subsystem to Device]({{< relref "from-subsystem-to-device" >}})** — How subsystems integrate into self-contained devices with external interfaces.

- **[Interfaces Between Layers]({{< relref "interfaces-between-layers" >}})** — The four channels — power, signal, time, and control — that connect abstraction levels and define the contracts between them.
