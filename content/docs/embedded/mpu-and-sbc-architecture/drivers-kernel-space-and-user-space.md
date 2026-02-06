---
title: "Drivers, Kernel Space & User Space"
weight: 60
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Drivers, Kernel Space & User Space

On an MCU, all code runs at the same privilege level with full access to every register and memory address. On an MPU running Linux, code is divided into two worlds: kernel space (privileged, full hardware access) and user space (restricted, hardware access only through the kernel). This split is what makes a multi-user, multi-process operating system possible — and it is where most of the confusion lives when coming from bare-metal embedded work.

## The Privilege Split

ARM defines Exception Levels that determine what code is allowed to do. EL0 is user mode — where application code runs. EL1 is the kernel — where the OS runs with full hardware control. For most embedded Linux work, these are the only two that matter.

The split is absolute. Code running at EL0 cannot execute privileged instructions — it cannot touch MMU configuration registers, disable interrupts, or write to I/O memory that has not been explicitly mapped into its address space. The hardware enforces this. See [MMU, Virtual Memory & Address Spaces]({{< relref "mmu-virtual-memory-and-address-spaces" >}}) for how the MMU enforces address space separation.

The interface between user space and kernel space is the system call. When user-space code needs to open a file, read from a device, or send a network packet, it invokes a syscall — a controlled transition from EL0 to EL1. The cost is not trivial: hundreds of nanoseconds to a few microseconds for the round-trip. On an MCU, writing to a peripheral register is a single store instruction. On an MPU through the kernel, that same conceptual operation takes orders of magnitude longer.

One thing worth internalizing: running as root does not make application code kernel-space code. Root is a user-space concept — the kernel grants more permission checks, but the code still runs at EL0, still goes through syscalls, and still cannot touch hardware directly.

## Kernel Drivers

A device driver is kernel code that manages a specific piece of hardware — configuring registers, handling interrupts, moving data. Instead of running as standalone firmware, it runs within the kernel's framework, registering with the device model and exposing interfaces through the Virtual File System.

The relationship between the device tree and the driver is central to modern embedded Linux. The device tree describes what hardware exists. The driver registers with the kernel saying "I know how to drive devices with these `compatible` strings." The kernel matches nodes to drivers and calls the driver's `probe` function. This is covered in detail in [Device Tree & Hardware Description]({{< relref "device-tree-and-hardware-description" >}}).

Drivers can be compiled into the kernel (built-in) or as loadable modules (`.ko` files). On embedded systems with fixed hardware, building drivers as built-in is common. On SBCs running general-purpose distributions, most drivers ship as modules.

## User Space Access Patterns

User-space code accesses hardware through interfaces the kernel provides. The most common is the device file in `/dev/`. Character devices (like `/dev/ttyS0` for a UART, or `/dev/spidev0.0` for SPI) support `open`, `read`, `write`, `close`, and `ioctl` operations. Under the hood, the driver is talking to hardware.

The `sysfs` filesystem at `/sys/` exposes device attributes as simple files. An LED driver might expose `/sys/class/leds/led0/brightness` — echo a number to it and the LED changes. Shell scripts can control hardware without driver-specific libraries. The downside is performance: each operation involves opening a file, a syscall, string formatting, and closing the file.

Simple I/O — sensors polled at low rates, LEDs, simple actuators — works fine from user space. See [GPIO]({{< relref "/docs/embedded/peripherals-and-io/gpio" >}}) and [SPI & I2C]({{< relref "/docs/embedded/communication-interfaces/spi-and-i2c" >}}) for how these interfaces work at the MCU register level.

## When a Kernel Driver Is Needed

User-space access is convenient but has hard limits.

**Interrupt handling** is the most fundamental. User-space code cannot register interrupt handlers. The kernel can route notifications to user space, but the initial response — acknowledging the interrupt, reading status, clearing the flag — must happen in kernel space.

**DMA** requires kernel privilege. Setting up a DMA transfer needs physical addresses, cache coherency management, and completion interrupt handling. Only the kernel has the mechanisms for this.

**High-frequency I/O** runs into syscall overhead. Toggling a GPIO from user space is limited to roughly 100 kHz on a typical Cortex-A processor. Bit-banging protocols with sub-microsecond timing from user space is impractical because the scheduler can preempt at any point.

Before writing a custom kernel driver, always check whether one already exists. The Linux kernel has drivers for thousands of devices. A sensor might already be supported by an IIO driver, a display controller by DRM/KMS, an audio codec by ALSA.

## Tips

- Use `libgpiod` for GPIO access, not the deprecated `/sys/class/gpio/` interface
- Before writing a custom kernel driver, check whether one already exists — the kernel has drivers for thousands of devices
- Test kernel modules on a development board with serial console attached — bugs produce oops or panic, not segfaults
- Use kernel drivers rather than user-space access for anything requiring interrupt handling, DMA, or high-frequency I/O

## Caveats

- **Sysfs GPIO is deprecated but still everywhere in tutorials** — The `/sys/class/gpio/` interface was deprecated in favor of `libgpiod`. Use `libgpiod` for new work
- **User-space SPI and I2C are slow compared to kernel drivers** — Every transaction involves at least one syscall. For high-frequency access, this overhead is significant
- **Running as root does not make code kernel-space code** — Root is a user-space privilege concept. A root process still runs at EL0 with syscall overhead
- **Loading a kernel module can crash the system** — Kernel modules run with full privilege. A null pointer dereference produces a kernel oops or panic
- **`/dev/mem` bypasses all protections and is dangerous in production** — Useful for experiments but a security hole and reliability hazard

## In Practice

- GPIO toggling from user space that cannot exceed ~100 kHz is hitting syscall overhead — use a kernel driver or hardware peripheral
- A sensor driver that works but is too slow for the required update rate may benefit from moving to a kernel driver
- A crash with no segfault that takes down the entire system came from kernel space — check recently loaded modules
- Code that runs as root but cannot access hardware directly is discovering the EL0/EL1 privilege split
