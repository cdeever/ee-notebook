---
title: "Power Rails & Supplies"
weight: 50
bookCollapseSection: true
---

# Power Rails & Supplies

Supply verification, ripple, regulation, current draw, sequencing, energy storage behavior. Power is the first thing to check and the last thing people suspect — and it causes more mysterious failures than almost anything else.

## What This Section Covers

Measurement intent — the questions you're trying to answer at the bench:

- **[Is voltage present?]({{< relref "voltage-present" >}})** — First check at power-up. Confirm the rail exists before looking at anything downstream.
- **[Is voltage correct under load?]({{< relref "voltage-correct-under-load" >}})** — Static regulation and load-dependent droop. What the rail looks like when the circuit is actually drawing current.
- **[How much ripple / noise on the rail?]({{< relref "ripple-and-noise" >}})** — AC on top of DC. Switching converter ripple, LDO noise, and knowing what's acceptable vs. problematic.
- **[Is current draw expected?]({{< relref "current-draw" >}})** — Total supply current, per-rail current, and spotting overcurrent or undercurrent conditions.
- **[Are rails sequencing correctly?]({{< relref "power-sequencing" >}})** — Multi-rail systems where order matters. FPGA supplies, mixed-signal boards, and anything with enable chains.
- **[How is the bulk capacitance / battery behaving?]({{< relref "bulk-cap-battery" >}})** — Energy storage health. Bulk cap ESR, battery voltage under load, and holdup time.
