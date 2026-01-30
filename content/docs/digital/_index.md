---
title: "Digital Electronics"
weight: 3
bookCollapseSection: true
---

# Digital Electronics

Discrete abstraction layered over analog reality.

Digital electronics treats voltages and currents as symbols — highs and lows, ones and zeros — allowing complex systems to be built from simple, repeatable rules. Logic gates, flip-flops, state machines, buses, and programmable logic all live in this domain.

Design here is about timing, edges, and coordination: setup and hold times, propagation delays, clock domains, fan-out, and synchronization. As long as signals behave cleanly, the abstraction holds. When edges get fast, margins shrink, or noise creeps in, the underlying analog physics reasserts itself.

Entries range from basic combinational logic to complex sequential systems, with an emphasis on understanding why digital designs work — and why they sometimes fail — at real speeds, on real boards.

## Sections

- **[Logic Foundations]({{< relref "logic-foundations" >}})** — Boolean logic, logic families, and combinational circuits: the rules of the digital abstraction.
- **[Sequential Logic]({{< relref "sequential-logic" >}})** — Latches, flip-flops, registers, counters, and state machines: adding memory and time.
- **[Timing & Synchronization]({{< relref "timing-and-synchronization" >}})** — Clocks, timing constraints, and clock domain crossing: where digital designs succeed or fail.
- **[Data Transfer & Buses]({{< relref "data-transfer-and-buses" >}})** — Parallel vs serial, common bus protocols, and signal integrity: moving information reliably.
- **[Programmable Logic]({{< relref "programmable-logic" >}})** — PLDs, CPLDs, FPGAs, and HDL concepts: scaling digital systems beyond fixed-function chips.
- **[When Digital Breaks Down]({{< relref "when-digital-breaks-down" >}})** — Metastability, power integrity, and high-speed effects: where the abstraction leaks.
