---
title: "🔌 Embedded Systems"
weight: 5
bookCollapseSection: true
---

# Embedded Systems

Where hardware reality meets software intent.

Embedded systems span two architecturally distinct worlds. **Microcontrollers (MCUs)** integrate CPU, memory, and peripherals on a single chip for direct hardware control — bare-metal firmware, deterministic timing, and register-level access to everything. **Microprocessors (MPUs)** and the single-board computers built around them trade that directness for processing power, memory management, and full operating systems — Linux, networking stacks, and complex software become possible, but the hardware is no longer directly accessible. The choice between MCU and MPU is one of the first architectural decisions in any embedded design, and it shapes everything that follows: the firmware model, the toolchain, the debugging approach, and what kinds of problems are easy or hard.

Unlike general-purpose computing, there is no operating system to hide the details (or the OS itself is part of the design): pin multiplexing, clock trees, memory layout, and interrupt behavior directly shape system behavior. Correctness depends as much on electrical reality and timing constraints as it does on code structure.

Entries here cover microcontroller and microprocessor architectures, peripherals, firmware patterns, toolchains, and real-time concepts, with an emphasis on predictability, debuggability, and maintainability in resource-constrained systems.

## Sections

- **[MCU Architecture]({{< relref "mcu-architecture" >}})** — Core types, memory maps, clock trees, and power modes: what's inside the chip.

- **[MPU & SBC Architecture]({{< relref "mpu-and-sbc-architecture" >}})** — Microprocessors, SoCs, and single-board computers: where embedded meets Linux, virtual memory, and multi-stage boot.

- **[Peripherals & I/O]({{< relref "peripherals-and-io" >}})** — GPIO, timers, and analog peripherals: how the MCU interacts with the physical world.

- **[Communication Interfaces]({{< relref "communication-interfaces" >}})** — Serial buses, USB, CAN, Bluetooth, WiFi, and DMA: talking to other devices.

- **[Firmware Structure & Patterns]({{< relref "firmware-structure" >}})** — Startup sequences, interrupt handling, and state machines: making code predictable.

- **[Real-Time Concepts]({{< relref "real-time-concepts" >}})** — Determinism, RTOS fundamentals, and concurrency: why timing is everything.

- **[Toolchains & Debugging]({{< relref "toolchains-and-debugging" >}})** — Build systems, debug interfaces, and observability: seeing what the system is doing.

- **[Embedded Reality]({{< relref "embedded-reality" >}})** — Power-up issues, faults, and recovery strategies: where designs succeed or fail.
