---
title: "Timing & Synchronization"
weight: 30
bookCollapseSection: true
---

# Timing & Synchronization

Where digital designs succeed or fail. Every synchronous digital system runs on a clock, and the clock is both the heartbeat and the constraint. Signals must arrive at the right place at the right time, every cycle, without exception. Setup time, hold time, propagation delay, skew, and jitter define the margins that separate a working design from a broken one.

The irony of digital timing is that the clock itself is an analog signal — a voltage waveform with finite rise times, overshoot, jitter, and distribution challenges. Getting a clean clock to every flip-flop, at the right time, with enough margin, is one of the hardest practical problems in digital design.

## What This Section Covers

- **[Clocks]({{< relref "clocks" >}})** — Clock generation, distribution, jitter, skew, and clock trees; why clocks are analog signals in disguise.
- **[Timing Constraints]({{< relref "timing-constraints" >}})** — Setup and hold time; propagation delay; critical paths; timing closure as a concept.
- **[Clock Domain Crossing]({{< relref "clock-domain-crossing" >}})** — Metastability risk at domain boundaries; synchronizers; FIFOs; handshake protocols.
