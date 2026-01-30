---
title: "Communication Interfaces"
weight: 30
bookCollapseSection: true
---

# Communication Interfaces

Talking to other devices. A microcontroller rarely operates alone — it communicates with sensors, displays, memory chips, other MCUs, and host systems. The communication peripherals (UART, SPI, I²C, USB, CAN) handle the electrical signaling and protocol framing in hardware, but firmware must configure clocking, handle data flow, and deal with errors.

The MCU-side view of communication is about registers, buffers, and timing: setting baud rates, configuring clock polarity, managing FIFOs, and deciding whether the CPU moves every byte or DMA handles it. The protocol-level details (what messages mean, how devices are addressed) sit above this layer, but getting the hardware configuration wrong means no communication happens at all.

## What This Section Covers

- **[Serial Interfaces]({{< relref "serial-interfaces" >}})** — UART, SPI, I²C: clocking, framing, and MCU-side configuration for the three most common embedded buses.
- **[DMA]({{< relref "dma" >}})** — Moving data between peripherals and memory without CPU involvement: channels, triggers, and throughput tradeoffs.
- **[Higher-Level Interfaces]({{< relref "higher-level-interfaces" >}})** — USB, CAN, Ethernet: where hardware peripheral meets protocol stack, and what firmware is responsible for.
