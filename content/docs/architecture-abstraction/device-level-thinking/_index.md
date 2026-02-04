---
title: "Device-Level Thinking"
weight: 50
bookCollapseSection: true
---

# Device-Level Thinking

A subsystem has a specification. A device has an identity. A switching regulator subsystem delivers 3.3 V at 2 A. The board it lives on — with its processor, memory, communication interfaces, sensors, and power management — is a device. The device isn't defined by any single subsystem's specification. It's defined by what the whole assembly does: it acquires data, controls a motor, processes audio, monitors a patient. The subsystems are the organs; the device is the organism.

Device-level thinking is about reasoning at this boundary — where multiple subsystems share resources, where bring-up sequence determines whether anything works at all, where a subsystem that passed every bench test individually fails when integrated with the rest of the board. The challenges at the device level are coordination challenges: power sequencing, shared grounds, thermal budgets, reset domains, and the gap between "each part works" and "the whole thing works."

## What This Section Covers

- **[What Defines a Device Boundary]({{< relref "what-defines-a-device-boundary" >}})** — How to identify where one device ends and another begins, and why the boundary matters for reasoning and debugging.

- **[Cross-Subsystem Interactions]({{< relref "cross-subsystem-interactions" >}})** — How subsystems within a device affect each other through shared power, ground, thermal paths, and timing — even when the schematic says they're independent.

- **[Sequencing, Bring-Up, and Reset Domains]({{< relref "sequencing-bring-up-and-reset-domains" >}})** — The temporal structure of a device: power sequencing, reset dependencies, and the assumptions that must hold before each subsystem can operate.

- **["Works Alone" vs "Works Integrated"]({{< relref "works-alone-vs-works-integrated" >}})** — Why a subsystem that passes every bench test can still fail when combined with the rest of the device, and what to look for at integration time.
