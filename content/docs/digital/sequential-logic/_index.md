---
title: "Sequential Logic"
weight: 20
bookCollapseSection: true
---

# Sequential Logic

Adding memory and time. Combinational circuits are stateless — their outputs depend only on current inputs. Sequential circuits remember. A latch, a flip-flop, a register, a counter, a state machine — each stores information and uses it to influence future behavior. This is what makes digital systems capable of sequences, decisions, and processes rather than just mappings.

The key ingredient is feedback: an output fed back to an input creates bistability, and bistability creates memory. Once a circuit can remember, it can count, sequence, decide, and control. The cost of memory is timing — sequential circuits must be clocked, synchronized, and carefully constrained to avoid race conditions and metastability.

## What This Section Covers

- **[Latches & Flip-Flops]({{< relref "latches-and-flip-flops" >}})** — SR, D, JK, T; edge-triggered vs level-sensitive; why the distinction matters for reliable designs.
- **[Registers & Counters]({{< relref "registers-and-counters" >}})** — Shift registers; synchronous vs asynchronous counters; ripple effects and timing implications.
- **[State Machines]({{< relref "state-machines" >}})** — Moore vs Mealy; state diagrams; implementation on hardware; designing sequential behavior.
