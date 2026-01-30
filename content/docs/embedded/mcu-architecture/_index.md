---
title: "MCU Architecture"
weight: 10
bookCollapseSection: true
---

# MCU Architecture

What's inside the chip. A microcontroller is not just a CPU — it's a complete system on a single die: processor core, memory, bus fabric, clock generation, reset logic, and power management, all tightly integrated. Understanding the architecture means knowing how these pieces connect and constrain each other.

The choice of core architecture determines the instruction set, interrupt model, and debugging interface. The memory map determines how firmware accesses peripherals, where code lives, and how data is organized. The clock and reset system determines what runs, how fast, and what happens at power-on. None of these are independent — the memory map reflects the bus architecture, the clock tree feeds everything, and the reset system initializes it all in a specific order.

## What This Section Covers

- **[Core Architectures]({{< relref "core-architectures" >}})** — ARM Cortex-M, RISC-V, AVR, and others; Harvard vs von Neumann; registers, pipelines, and what the ISA means for firmware.
- **[Memory Map]({{< relref "memory-map" >}})** — Flash, SRAM, EEPROM; memory-mapped peripherals; stack and heap; how the address space is organized and why it matters.
- **[Clocks, Reset & Power Modes]({{< relref "clocks-reset-and-power-modes" >}})** — Oscillators, PLLs, clock trees; reset sources and startup behavior; sleep modes and wake sources.
