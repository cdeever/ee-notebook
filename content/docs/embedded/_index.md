---
title: "🔌 MCUs & Embedded Systems"
weight: 4
bookCollapseSection: true
---

# Microcontrollers & Embedded Systems

Where hardware reality meets software intent.

Microcontrollers combine digital logic, memory, and analog peripherals into a single device, controlled by firmware that must operate correctly in real time. This is the domain where registers, interrupts, clocks, and peripheral timing define what software can — and cannot — do.

Embedded systems sit at the boundary between hardware and software. Unlike general-purpose computing, there is no operating system to hide the details: pin multiplexing, clock trees, memory layout, and interrupt behavior directly shape system behavior. Correctness depends as much on electrical reality and timing constraints as it does on code structure.

Entries here cover microcontroller architectures, peripherals, firmware patterns, toolchains, and real-time concepts, with an emphasis on predictability, debuggability, and maintainability in resource-constrained systems.

## Sections

- **[MCU Architecture]({{< relref "mcu-architecture" >}})** — Core types, memory maps, clock trees, and power modes: what's inside the chip.
- **[Peripherals & I/O]({{< relref "peripherals-and-io" >}})** — GPIO, timers, and analog peripherals: how the MCU interacts with the physical world.
- **[Communication Interfaces]({{< relref "communication-interfaces" >}})** — UART, SPI, I²C, DMA, and higher-level protocols: talking to other devices.
- **[Firmware Structure & Patterns]({{< relref "firmware-structure" >}})** — Startup sequences, interrupt handling, and state machines: making code predictable.
- **[Real-Time Concepts]({{< relref "real-time-concepts" >}})** — Determinism, RTOS fundamentals, and concurrency: why timing is everything.
- **[Toolchains & Debugging]({{< relref "toolchains-and-debugging" >}})** — Build systems, debug interfaces, and observability: seeing what the system is doing.
- **[Embedded Reality]({{< relref "embedded-reality" >}})** — Power-up issues, faults, and recovery strategies: where designs succeed or fail.
