---
title: "Communication Interfaces"
weight: 30
bookCollapseSection: true
---

# Communication Interfaces

Talking to other devices. A microcontroller rarely operates alone — it communicates with sensors, displays, memory chips, other MCUs, and host systems. The communication peripherals handle the electrical signaling and protocol framing in hardware, but firmware must configure clocking, handle data flow, and deal with errors.

The MCU-side view of communication is about registers, buffers, and timing: setting baud rates, configuring clock polarity, managing FIFOs, and deciding whether the CPU moves every byte or DMA handles it. The protocol-level details (what messages mean, how devices are addressed) sit above this layer, but getting the hardware configuration wrong means no communication happens at all.

## What This Section Covers

- **[Serial Interfaces]({{< relref "serial-interfaces" >}})** — UART, SPI, and I²C: clocking, framing, and MCU-side configuration for the most common embedded buses.
- **[I²S]({{< relref "i2s" >}})** — Audio streaming between MCUs and codecs: master clocks, bit clocks, word select, and why DMA is not optional.
- **[DMA]({{< relref "dma" >}})** — Moving data between peripherals and memory without CPU involvement: channels, triggers, and throughput tradeoffs.
- **[USB]({{< relref "usb" >}})** — Device classes, enumeration, descriptors, and USB stacks: where simple serial meets complex protocol machinery.
- **[Bluetooth]({{< relref "bluetooth" >}})** — BLE vs Classic, integration approaches (external module vs integrated SoC), GATT services, and practical firmware considerations.
- **[WiFi & Networking]({{< relref "wifi-and-networking" >}})** — Ethernet and WiFi: IP networking on MCUs, from PHY management through TCP/IP stacks and cloud connectivity.
- **[CAN & LIN]({{< relref "can-and-lin" >}})** — Automotive and industrial buses: CAN's differential multi-master network and LIN's single-wire master-slave companion.
- **[Other Serial Interfaces]({{< relref "other-serial" >}})** — 1-Wire and SMBus: niche protocols for temperature sensors, device discovery, and system management.
