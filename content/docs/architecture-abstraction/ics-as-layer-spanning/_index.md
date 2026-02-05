---
title: "Integrated Circuits as Layer-Spanning Artifacts"
weight: 80
bookCollapseSection: true
---

# Integrated Circuits as Layer-Spanning Artifacts

An integrated circuit isn't a primitive, a block, or a subsystem. It might contain all three. A microcontroller has transistors (primitives), amplifiers and registers (blocks), an ADC and a UART (subsystems), and arguably constitutes a device — all inside a single package. A 555 timer integrates a voltage divider, two comparators, and a flip-flop into what functions as a subsystem. A jellybean op-amp is essentially a single block. The IC package reveals nothing about where the thing inside sits in the abstraction hierarchy.

This creates a persistent confusion: the habit of treating "IC" as if it were an abstraction level, somewhere between "discrete component" and "system." It isn't. An IC is a manufacturing artifact — a way of physically packaging circuitry — not a functional category. The abstraction level of an IC depends entirely on what's inside it and how it's used. Getting this distinction right matters because it determines how to reason about the IC's behavior, what the datasheet is actually promising, and where the boundaries of understanding need to be drawn.

## What This Section Covers

- **[ICs Are Not an Abstraction Level]({{< relref "ics-are-not-an-abstraction-level" >}})** — Why integrated circuits don't fit neatly into the primitive–block–subsystem hierarchy, and what that means for reasoning about them.

- **[Collapsed Subsystems]({{< relref "collapsed-subsystems" >}})** — How ICs compress multiple abstraction levels into a single package, and the consequences for understanding their behavior.

- **[What Can and Can't Be Treated as a Black Box]({{< relref "black-box-boundaries" >}})** — When the datasheet abstraction is sufficient, and when it becomes necessary to reason about what's inside.

- **[Why External Components Still Matter]({{< relref "why-external-components-still-matter" >}})** — How the components surrounding an IC shape its behavior, and why "integrated" doesn't mean "self-contained."
