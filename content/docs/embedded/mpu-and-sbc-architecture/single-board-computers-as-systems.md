---
title: "Single-Board Computers as Systems"
weight: 90
---

# Single-Board Computers as Systems

A single-board computer is a complete Linux-capable system on one PCB: SoC, RAM, storage interface, power regulation, and I/O connectors. SBCs are where MPU concepts become tangible — hold one, plug it in, and there is a shell prompt. But the gap between "it boots on the bench" and "it runs reliably in a product" is wider than it looks.

## What Makes an SBC

An SBC combines a System-on-Chip with the external components needed to run a full operating system: DRAM, a storage interface (SD card, eMMC, sometimes NVMe), voltage regulators, and connectors for I/O — USB, HDMI, Ethernet, and typically a GPIO header. See [CPU Cores & SoC Architecture]({{< relref "cpu-cores-and-soc-architecture" >}}) for details on what lives inside the SoC.

It is worth distinguishing an SBC from an MCU development board. An MCU dev board exists to evaluate the microcontroller — the board is scaffolding. An SBC is closer to a complete system. The Raspberry Pi is not scaffolding for the BCM2711 — it is the system people deploy. SBCs typically run full Linux distributions with a package manager, network services, and all the software infrastructure of a desktop machine.

A point that is easy to underestimate: how much of the SBC's behavior depends on the board design, not just the SoC. Two boards using the same SoC can have very different thermal behavior, power regulation quality, and I/O stability depending on PCB layout, PMIC choice, and DRAM routing.

## The Raspberry Pi Ecosystem

The Raspberry Pi dominates the SBC landscape. The progression from the BCM2835 (Pi 1/Zero) through the BCM2711 (Pi 4: quad Cortex-A72, 1-8 GB) to the BCM2712 (Pi 5: quad Cortex-A76, 4-8 GB) tracks a decade of capability growth while keeping the board dimensions and connector layout roughly stable.

Raspberry Pi OS (Debian-based) is well-maintained, and the ecosystem's real strength is software support: kernel patches upstreamed, extensive documentation, deep community troubleshooting resources. The 40-pin GPIO header has become a de facto standard that other manufacturers copy, and the HAT specification allows add-on boards to auto-configure via EEPROM-stored device tree overlays.

One important distinction: the Raspberry Pi Pico (RP2040) is not an SBC. It is a microcontroller board — dual Cortex-M0+, 264 KB SRAM, no MMU, no Linux. It belongs in MCU territory.

## BeagleBone and PRU Co-Processors

The BeagleBone family takes a different approach. The BeagleBone Black uses TI's AM335x SoC — a single Cortex-A8 that is slower than any recent Pi — but the SoC includes two PRU (Programmable Real-time Unit) cores. These are 200 MHz 32-bit RISC processors with deterministic, single-cycle execution: one instruction per 5-nanosecond clock cycle, guaranteed. No caches, no pipeline stalls.

The PRUs share memory with the A8, enabling hard real-time I/O (nanosecond-precision GPIO toggling, protocol bitbanging) while Linux runs normally on the A8. This bridges the gap that PREEMPT_RT cannot fully close. See [Timing, Latency & Determinism]({{< relref "timing-latency-and-determinism" >}}) for how this compares to other approaches.

The BeagleBone's weakness is community size and documentation density. TI's reference manuals are thorough but dense, and the PRU programming model has a steep learning curve. But once it works, the deterministic timing is something no Pi can offer.

## Other Platforms Worth Knowing

**NVIDIA Jetson** (Nano, Orin Nano, Orin NX) — GPU compute for ML inference and computer vision. When a project needs to run neural network inference at the edge, Jetson is the standard platform.

**Allwinner-based boards** (Orange Pi, Banana Pi) — compete on price. Thinner software support and community, but attractive when cost matters most.

**Pine64** — open hardware approach with published schematics and early RISC-V boards alongside ARM.

When to look beyond Pi: GPU compute for ML (Jetson), deterministic real-time alongside Linux (BeagleBone PRU), lowest cost (Allwinner boards), or open hardware (Pine64).

## Power, Thermals, and Reliability

SBCs are designed for development convenience, not production reliability.

**Power supply quality** is the most common invisible failure. SBCs powered through USB can experience voltage droop under load, causing brownout resets that look like random reboots or kernel panics. Use a supply rated for the board's peak current draw, with short cables.

**Thermal throttling** is silent. A Pi 4 under sustained load reaches 80-85°C and throttles — reduced clock speed with no warning, no error, just reduced performance. Heatsinks and fans are not optional for sustained compute.

**SD card reliability** is the single biggest source of SBC failures in deployed systems. Consumer SD cards lack the write endurance for Linux's constant writes (logs, journal, /tmp). Cards develop bad sectors after months and fail silently — reads return stale data, the filesystem corrupts gradually. Solutions: use eMMC, mount root read-only with logs to tmpfs, or use NVMe via USB 3 or PCIe.

For production, **compute modules** (Raspberry Pi CM4/CM5) separate the hard part (SoC + DRAM routing) from the application-specific carrier board design. See [Embedded Reality]({{< relref "/docs/embedded/embedded-reality" >}}) for broader discussion of reliability.

## Tips

- Use read-only root filesystems, eMMC, or NVMe for anything deployed unattended — SD card corruption is the number-one field reliability problem
- Measure actual voltage at the board under load to verify power supply adequacy — not all USB supplies are equal
- Check mainline Linux kernel support before selecting an SBC — vendor kernels may not receive security patches
- Add heatsinks and active cooling for sustained workloads — thermal throttling is silent

## Caveats

- **SD card corruption is the number-one SBC reliability problem in the field** — Consumer SD cards lack write endurance for Linux's constant writes
- **USB power supplies are not all equal** — Voltage droop under load causes brownouts that appear as random reboots
- **GPIO voltage levels vary by platform** — Raspberry Pi is 3.3V. Some boards use 1.8V. Connecting 5V signals directly damages the SoC
- **SBC GPIO is not as fast as MCU GPIO** — Toggling from Linux user space takes microseconds versus nanoseconds on an MCU
- **Not all SBCs have mainline kernel support** — Vendor kernels based on old versions may not receive security patches
- **The 40-pin header is a Pi convention, not a standard** — Other boards may use the same connector with completely different pinouts
- **Thermal throttling is silent** — The SoC reduces clock speed with no log message unless actively monitored

## Bench Relevance

- An SBC that reboots randomly likely has power supply issues — measure voltage at the board under load
- File system corruption that develops over weeks of operation points to SD card wear — switch to eMMC or read-only root
- An SBC that runs slower after minutes of sustained load is thermal throttling — check thermal zones with `cat /sys/class/thermal/thermal_zone*/temp`
- GPIO operations that are orders of magnitude slower than expected confirm the user-space syscall overhead — this is normal for SBCs
