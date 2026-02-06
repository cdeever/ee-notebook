---
title: "MPU & SBC Architecture"
weight: 15
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# MPU & SBC Architecture

Where embedded meets Linux, virtual memory, and multi-stage boot.

Microprocessors (MPUs) and the single-board computers built around them occupy a fundamentally different design space than microcontrollers. Where an MCU provides direct hardware access, deterministic timing, and a single-threaded bare-metal model, an MPU trades that directness for processing power, memory management hardware, and the ability to run a full operating system. The hardware is no longer directly accessible — an MMU stands between application code and physical memory, a kernel mediates access to peripherals, and a multi-stage boot chain replaces the simple reset-vector-to-main path.

This section covers the architecture of application processors, Systems-on-Chip (SoCs), and the Linux-based embedded systems built on them. The emphasis is on what changes when moving from MCU to MPU territory: what new hardware exists (MMU, caches, IOMMU), what new software layers appear (bootloader, kernel, device tree, drivers), and what changes in terms of timing, determinism, and system complexity. Single-board computers like the Raspberry Pi and BeagleBone are covered as concrete platforms where these concepts become tangible.

## What This Section Covers

- **[MCU vs MPU: Architectural Differences]({{< relref "mcu-vs-mpu" >}})** — Where the dividing line falls and why it matters: memory management, operating systems, and the tradeoffs involved.
- **[CPU Cores & SoC Architecture]({{< relref "cpu-cores-and-soc-architecture" >}})** — Cortex-A cores, multi-core designs, SoC integration blocks, caches, and common SoC families.
- **[MMU, Virtual Memory & Address Spaces]({{< relref "mmu-virtual-memory-and-address-spaces" >}})** — The big conceptual leap from MCU land: page tables, virtual-to-physical translation, and why user space cannot touch hardware.
- **[Boot Chain: ROM to Bootloader to Kernel]({{< relref "boot-chain" >}})** — Multi-stage boot: SoC ROM code, U-Boot, kernel loading, and the path from power-on to a running system.
- **[Device Tree & Hardware Description]({{< relref "device-tree-and-hardware-description" >}})** — The MPU equivalent of MCU register maps: describing hardware to the kernel without recompiling it.
- **[Drivers, Kernel Space & User Space]({{< relref "drivers-kernel-space-and-user-space" >}})** — The privilege split, kernel modules, /dev and sysfs, and accessing peripherals from user space.
- **[Timing, Latency & Determinism]({{< relref "timing-latency-and-determinism" >}})** — Why MPUs are not deterministic, how to measure and improve latency, and when to offload real-time work.
- **[DMA in MPU Systems]({{< relref "dma-in-mpu-systems" >}})** — DMA with an MMU: physical vs virtual addresses, cache coherency, and how the kernel manages transfers.
- **[Single-Board Computers as Systems]({{< relref "single-board-computers-as-systems" >}})** — Raspberry Pi, BeagleBone, and other platforms: what makes an SBC, and where they fit in prototyping and production.
- **[Where MPUs Fit in Embedded Design]({{< relref "where-mpus-fit" >}})** — The synthesis: MCU vs MPU decision space, hybrid architectures, and when Linux helps or hurts.
