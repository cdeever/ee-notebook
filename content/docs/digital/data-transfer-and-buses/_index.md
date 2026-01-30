---
title: "Data Transfer & Buses"
weight: 40
bookCollapseSection: true
---

# Data Transfer & Buses

Moving information reliably. Once a digital system can process and store data, the next problem is moving it — between chips, between boards, between subsystems. Buses and interfaces define how data travels: how many wires, how fast, what protocol, and what happens when something goes wrong.

The fundamental tradeoff is between parallelism and serialization. Parallel buses move many bits simultaneously but require many pins and careful timing across all of them. Serial interfaces move bits one at a time but need fewer wires and scale to higher speeds. Modern digital design has overwhelmingly shifted toward serial interfaces, driven by pin count, PCB routing, and the physics of high-speed signaling.

## What This Section Covers

- **[Parallel vs Serial Interfaces]({{< relref "parallel-vs-serial" >}})** — Pin count, speed, complexity tradeoffs; why serial won; where parallel still makes sense.
- **[Common Bus Protocols]({{< relref "common-bus-protocols" >}})** — SPI, I2C, UART from the hardware perspective; timing diagrams; electrical characteristics; not software drivers.
- **[Signal Integrity Basics]({{< relref "signal-integrity-basics" >}})** — Termination; reflections; edge rate vs trace length; when digital becomes transmission-line design.
