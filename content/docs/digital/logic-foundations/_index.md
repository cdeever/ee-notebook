---
title: "Logic Foundations"
weight: 10
bookCollapseSection: true
---

# Logic Foundations

The rules of the abstraction. Digital electronics begins with a decision: treat voltages as symbols — HIGH or LOW, 1 or 0 — and build systems from the rules that govern those symbols. Boolean algebra provides the math. Logic gates provide the physical implementation. Combinational circuits combine gates into functional blocks that produce outputs determined entirely by their current inputs.

This abstraction is powerful because it's composable — small, well-defined building blocks snap together into arbitrarily complex systems. But the abstraction rests on analog foundations: voltage thresholds, noise margins, propagation delays, and drive strength. Understanding where the rules come from, and where they start to bend, is the difference between a design that works and one that works most of the time.

## What This Section Covers

- **[Boolean Logic]({{< relref "boolean-logic" >}})** — AND, OR, NOT, XOR; truth tables; simplification; De Morgan's theorem; how logical rules map to physical gates.
- **[Logic Families]({{< relref "logic-families" >}})** — TTL vs CMOS; voltage levels and noise margins; fan-out; drive strength; level shifting between families.
- **[Combinational Logic]({{< relref "combinational-logic" >}})** — Decoders, encoders, multiplexers; building functional blocks from gates; hazards and glitches.
