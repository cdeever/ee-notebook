---
title: "Peripherals & I/O"
weight: 20
bookCollapseSection: true
---

# Peripherals & I/O

How the MCU touches the physical world. Every microcontroller pin is a connection between digital firmware and analog reality — voltage levels, current limits, timing requirements, and electrical noise. The peripherals behind those pins (GPIO controllers, timers, ADCs) are hardware engines that firmware configures and monitors through registers.

Getting peripherals right means understanding not just the register interface, but the electrical behavior: what happens when a GPIO drives a capacitive load, how a timer's resolution limits PWM accuracy, or why an ADC reading depends on source impedance and sampling time. The peripheral is where firmware assumptions meet bench reality.

## What This Section Covers

- **[GPIO]({{< relref "gpio" >}})** — Input/output modes, pull configuration, drive strength, alternate functions, and pin multiplexing: the most fundamental peripheral.
- **[Timers & Counters]({{< relref "timers-and-counters" >}})** — Basic timers, PWM generation, input capture, output compare: hardware timing without CPU involvement.
- **[Analog Peripherals]({{< relref "analog-peripherals" >}})** — ADC, DAC, comparators, and internal references: bridging the analog-digital boundary on-chip.
