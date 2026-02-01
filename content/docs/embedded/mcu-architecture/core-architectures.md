---
title: "Core Architectures"
weight: 10
---

# Core Architectures

A microcontroller's core determines what instructions it executes, how it accesses memory, how it handles interrupts, and what debugging tools are available. The choice of core architecture shapes the firmware, the toolchain, and the performance and power characteristics of the system. Most embedded work today involves one of three families: ARM Cortex-M, AVR, or the newer RISC-V cores. Each has a different philosophy, and understanding the differences helps explain why firmware for one target does not just "port over" to another.

## ARM Cortex-M Family

ARM does not make chips. ARM licenses processor core designs to silicon vendors (ST, NXP, TI, Nordic, Microchip, and many others), who wrap them in their own peripherals, memory, and packaging. The Cortex-M series is specifically designed for microcontroller use — deterministic interrupt response, low gate count, and a simplified programmer's model compared to the Cortex-A (application) cores found in phones and single-board computers.

### The Cortex-M Variants

- **M0 / M0+** — The smallest ARM cores. 32-bit but very simple: no hardware divide, no bit-banding. M0+ is the most energy-efficient ARM core available
- **M3** — The "standard" Cortex-M. Hardware divide, full Thumb-2 instruction set, bit-banding, configurable MPU (Memory Protection Unit). Where most mid-range STM32, LPC, and similar parts sit
- **M4** — M3 plus DSP instructions (single-cycle multiply-accumulate, SIMD) and an optional single-precision FPU. The go-to choice for signal processing tasks that do not justify a full DSP chip
- **M7** — Superscalar pipeline, dual-issue, instruction and data caches, optional double-precision FPU, tightly-coupled memory (TCM). Used in high-performance MCU applications (motor control, audio, industrial)

The jump from M0 to M7 is significant — an M0 might run at 48 MHz with 2 KB of SRAM, while an M7 might run at 480 MHz with 1 MB of SRAM and caches. But they share the same programmer's model, the same NVIC interrupt controller architecture, and largely the same toolchain.

### The NVIC: Interrupt Handling

All Cortex-M cores share the Nested Vectored Interrupt Controller (NVIC). This is one of the strongest reasons for ARM's dominance in embedded: the interrupt model is consistent across M0 through M7 and across all silicon vendors. The NVIC provides hardware-assisted context saving, configurable priority levels, priority grouping (preemption vs. sub-priority), and tail-chaining (back-to-back interrupts skip the unstacking/restacking). This standardization means interrupt-handling code is largely portable across Cortex-M parts.

### What the FPU Means in Practice

Cortex-M4F and M7 cores include a hardware floating-point unit. Without an FPU, floating-point operations are emulated in software — a single-precision multiply might take 30-70 cycles in software versus 1 cycle in hardware. The compiler flags must explicitly enable the FPU; otherwise it sits idle while software emulation burns cycles. Projects accidentally compiled with soft-float on an FPU-equipped core lose all the hardware benefit while paying for the silicon.

## RISC-V

RISC-V is an open instruction set architecture — no licensing fees, no proprietary extensions. It is modular: the base integer ISA (RV32I) is simple, and extensions are added for multiplication (M), atomics (A), floating-point (F, D), compressed instructions (C), and more. A chip advertising "RV32IMAC" supports 32-bit integer, multiply/divide, atomics, and compressed instructions.

The modularity is both a strength and a source of confusion. Two RISC-V chips may support different extension combinations, meaning code that uses atomics on one part will not compile for another that lacks the A extension. The compressed instruction extension (C) provides 16-bit encodings for common operations, reducing code size by 25-30%.

The embedded RISC-V ecosystem is younger than ARM's. Toolchain support (GCC, LLVM) is solid, but vendor HALs, RTOSes, and debugger support are still catching up. Espressif's ESP32-C3 and C6 use RISC-V cores, as do parts from GigaDevice (GD32V) and WCH. The architecture itself is clean and well-documented, but the practical ecosystem — libraries, examples, community knowledge — is thinner than ARM's.

One notable difference: RISC-V does not define a standard interrupt controller equivalent to ARM's NVIC. The PLIC (Platform-Level Interrupt Controller) and CLIC (Core-Local Interrupt Controller) are separate specifications, and vendors implement them differently. This means interrupt handling code is less portable across RISC-V chips than across Cortex-M chips.

## AVR

The Atmel (now Microchip) AVR is an 8-bit RISC core with a true Harvard architecture — completely separate buses and address spaces for program memory (flash) and data memory (SRAM). It has 32 general-purpose 8-bit registers, and most instructions execute in a single clock cycle.

AVR is still relevant: it is extremely simple to understand at the register level, the Arduino ecosystem created an enormous body of example code, and for small, low-power applications, an 8-bit core that draws microamps in sleep is hard to beat. The ATmega328P (Arduino Uno) and ATtiny series remain widely used in hobby and low-volume production work.

The Harvard architecture means flash and SRAM pointers cannot be used interchangeably. Reading a constant string from flash requires special macros (`PROGMEM`, `pgm_read_byte`) because the compiler's default pointer type refers to SRAM. This is a common source of bugs when porting code from other architectures.

Because AVR has only 32 registers, a small flash, and a handful of peripherals, it is realistic to read the entire datasheet and understand everything the chip does. That is not feasible with a modern Cortex-M part whose reference manual runs to 2000+ pages. AVR teaches register-level thinking in a way that translates well to more complex architectures later.

## Harvard vs Von Neumann

**Von Neumann architecture** uses a single bus for both instructions and data. Simple and flexible, but the bus is a bottleneck — the CPU cannot fetch an instruction and read data simultaneously.

**Harvard architecture** uses separate buses for instructions and data. The CPU can fetch the next instruction while completing a data access, but the strict separation means code cannot easily read data from instruction memory (the AVR issue above).

**Modified Harvard** is what most modern MCUs actually use. Cortex-M cores have separate instruction and data buses internally (for pipeline efficiency), but both map into a single unified address space. Firmware sees one flat memory map. This gives most of the performance benefit of Harvard without the programming inconvenience.

The practical takeaway: on Cortex-M and RISC-V, a pointer is a pointer — the unified address space makes the bus architecture invisible. On AVR, the split address space is visible to the programmer and affects how data access is structured. Moving from AVR to ARM, one of the first relief moments is realizing a constant from flash can be read with a normal pointer dereference.

## What the ISA Means for Firmware

Most of the time, the C compiler hides the ISA. But certain architectural details leak through into firmware behavior:

- **Alignment** — Cortex-M3 and above support unaligned access (with a performance penalty). M0 does not — an unaligned 32-bit access faults. Casting a `uint8_t*` to a `uint32_t*` and dereferencing it is undefined behavior in C and will hard-fault on M0
- **Atomics** — Cortex-M3+ provide load/store exclusive instructions for lock-free atomic operations. M0 lacks these, so atomic access on M0 requires disabling interrupts. RISC-V has the A extension for atomics, but only if the chip implements it
- **Endianness** — ARM Cortex-M is configurable but almost always little-endian. RISC-V specifies little-endian. AVR is little-endian. Reading data from a big-endian sensor or network protocol requires byte-swapping

## Common MCU Families

The ISA matters, but in practice a learner picks a chip family, not an instruction set. Each family combines a core architecture with a specific set of peripherals, a software ecosystem, and a community. Here are the families most likely to appear on a workbench.

**STM32 (STMicroelectronics).** The largest ARM Cortex-M family, spanning M0 through M7 cores across hundreds of part numbers. STMicroelectronics provides CubeMX (a graphical pin and clock configuration tool that generates initialization code) and the HAL driver library. Documentation is extensive, community resources are deep, and the STM32 ecosystem is the default choice for learning production-grade ARM embedded development.

**ESP32 (Espressif).** Xtensa-based (ESP32, ESP32-S3) or RISC-V (ESP32-C3, ESP32-C6) cores with integrated WiFi and Bluetooth. Supported by both the Arduino framework and Espressif's own ESP-IDF (FreeRTOS-based). Dominant in hobbyist IoT projects. The tradeoff: integrated wireless simplifies system design, but the SoC is significantly more complex than a bare MCU — the reference manual is large and the radio subsystem adds power and timing considerations that a simple Cortex-M part does not have.

**RP2040 / RP2350 (Raspberry Pi).** Dual Cortex-M0+ (RP2040) or dual Cortex-M33 / RISC-V (RP2350), with PIO (Programmable I/O) state machines as a unique peripheral — small programmable engines that can bit-bang protocols at hardware speed. The full datasheet is readable cover-to-cover, which is rare for a modern MCU. The Pi Pico board is a low-cost entry point, with first-class support for both MicroPython and the C/C++ SDK.

**Arduino AVR (Microchip ATmega / ATtiny).** 8-bit AVR core. The Arduino Uno (ATmega328P) and ATtiny series, backed by the Arduino IDE and library ecosystem, remain the most common first MCU for beginners. Limited resources (32 KB flash, 2 KB SRAM on the ATmega328P) constrain what is possible, but that constraint teaches discipline — every byte and cycle matters, and there is nowhere to hide sloppy code.

**nRF52 / nRF53 (Nordic Semiconductor).** Cortex-M4F (nRF52840) or dual Cortex-M33 (nRF5340), focused on Bluetooth Low Energy. Nordic's nRF Connect SDK (built on top of Zephyr RTOS) provides a mature BLE software stack. This is the go-to platform for learning BLE development — well-documented, with strong community support and readily available development kits.

The pattern across these families: the choice is about the combination of core architecture, peripherals, software ecosystem, and community — not just the ISA. For learning, start where the community and examples are strongest, then branch out as projects demand different capabilities.

## Gotchas

- **Cortex-M0 faults on unaligned access** — Code that works on M3 or M4 may hard-fault on M0. Packed structs and careless pointer casts are the usual triggers
- **RISC-V interrupt handling is not portable** — Unlike Cortex-M's standardized NVIC, RISC-V interrupt controllers vary by vendor. Moving firmware between RISC-V chips often means rewriting the interrupt setup
- **AVR flash reads require special handling** — String constants and lookup tables stored in flash on AVR cannot be read with normal pointer dereferences. Forgetting `PROGMEM` and `pgm_read_*` produces garbage data at runtime
- **Soft-float on an FPU-equipped core wastes the hardware** — If the compiler flags do not enable hard float, the FPU sits idle while software emulation burns cycles. Check the build flags whenever floating-point performance seems wrong
