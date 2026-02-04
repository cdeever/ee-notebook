---
title: "MCU Architecture"
weight: 10
bookCollapseSection: true
---

# MCU Architecture

What's inside the chip. A microcontroller is not just a CPU — it's a complete system on a single die: processor core, memory, bus fabric, clock generation, reset logic, and power management, all tightly integrated.

This section provides a conceptual overview of microcontroller architectures, focusing on how core design choices shape firmware behavior, timing, and portability. The goal is to build an intuition for why different MCUs behave the way they do — not to document every instruction, register, or compiler flag. Coverage emphasizes architectural families (ARM Cortex-M, RISC-V, AVR), interrupt models, memory organization, and the tradeoffs that matter when selecting a platform or porting firmware.

Detailed core internals, pipeline behavior, ABI nuances, and toolchain-specific tuning are intentionally deferred to dedicated deep-dive pages and reference sections. Those details are essential when debugging or optimizing, but they are not required to understand the architectural landscape.

After reading this section, the goal is to:

- Explain the practical differences between major MCU core families
- Understand why firmware does not trivially "port" between architectures
- Recognize when architectural features (interrupts, memory model, ISA) influence system design
- Know where to look next when deeper detail is required

## What This Section Covers

- **[Core Architectures]({{< relref "core-architectures" >}})** — ARM Cortex-M, RISC-V, and AVR: how each family is structured, what the ISA means for firmware, and where portability breaks down.
- **[Memory Map]({{< relref "memory-map" >}})** — How the address space is organized: flash, SRAM, memory-mapped peripherals, stack and heap, and why the linker script matters.
- **[Clocks, Reset & Power Modes]({{< relref "clocks-reset-and-power-modes" >}})** — Oscillators, PLLs, and clock trees; reset sources and startup behavior; sleep modes and the "race to sleep" tradeoff.
