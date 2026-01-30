---
title: "Embedded Reality"
weight: 70
bookCollapseSection: true
---

# Embedded Reality

Where designs succeed or fail. Embedded systems operate in the physical world — subject to power glitches, temperature extremes, electrical noise, and conditions the firmware author never anticipated. The gap between "works on the bench" and "works in the field" is where most embedded failures live.

This section covers the failure modes that don't show up in simulation or code review: what happens when power arrives slowly, when the stack overflows into data, when a peripheral bus fault halts the CPU, or when a deployed system hangs with no debugger attached. The common thread is that these problems require thinking about the system as hardware and software together — firmware alone cannot explain or fix them.

## What This Section Covers

- **[Power-Up & Reset]({{< relref "power-up-and-reset" >}})** — Brownout behavior, startup races, initialization order, and power sequencing: what happens before firmware has control.
- **[Faults & Exceptions]({{< relref "faults-and-exceptions" >}})** — Hard faults, bus faults, stack overflows, and memory protection: when the CPU cannot continue.
- **[Watchdogs & Recovery]({{< relref "watchdogs-and-recovery" >}})** — Watchdog timers, recovery strategies, and field failure patterns: keeping systems running when things go wrong.
