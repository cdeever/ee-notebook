---
title: "Core Architectures"
weight: 10
---

# Core Architectures

A microcontroller's core determines what instructions it executes, how it accesses memory, how it handles interrupts, and what debugging tools are available. The choice of core architecture is not just an academic distinction — it shapes the firmware you write, the toolchain you use, and the performance and power characteristics you can expect. Most embedded work today involves one of three families: ARM Cortex-M, AVR, or the newer RISC-V cores. Each has a different philosophy, and understanding the differences helps explain why firmware for one target does not just "port over" to another.

## ARM Cortex-M Family

ARM does not make chips. ARM licenses processor core designs to silicon vendors (ST, NXP, TI, Nordic, Microchip, and many others), who wrap them in their own peripherals, memory, and packaging. The Cortex-M series is specifically designed for microcontroller use — deterministic interrupt response, low gate count, and a simplified programmer's model compared to the Cortex-A (application) cores found in phones and single-board computers.

### The Cortex-M Variants

- **M0 / M0+** — The smallest ARM cores. 32-bit, but very simple: a 2-stage pipeline (M0) or 2-stage with single-cycle I/O port access (M0+). No hardware divide, no bit-banding. Thumb / Thumb-2 (subset) instruction set. Used in low-cost, low-power devices. M0+ is the most energy-efficient ARM core available
- **M3** — The "standard" Cortex-M. 3-stage pipeline, hardware divide, full Thumb-2 instruction set, bit-banding, configurable MPU (Memory Protection Unit). This is where most mid-range STM32, LPC, and similar parts sit
- **M4** — M3 plus DSP instructions (single-cycle multiply-accumulate, SIMD operations) and an optional single-precision FPU. The go-to choice for signal processing tasks that do not justify a full DSP chip
- **M7** — 6-stage superscalar pipeline, dual-issue, instruction and data caches, optional double-precision FPU, tightly-coupled memory (TCM). Used in high-performance MCU applications (motor control, audio, industrial)

The jump from M0 to M7 is significant. An M0 might run at 48 MHz with 2 KB of SRAM. An M7 might run at 480 MHz with 1 MB of SRAM and caches. But they share the same programmer's model, the same NVIC interrupt controller architecture, and largely the same toolchain. Code written for M0 will usually compile for M7 — though it may not use the M7's features efficiently.

### The NVIC: Interrupt Handling

All Cortex-M cores share the Nested Vectored Interrupt Controller (NVIC). This is one of the strongest reasons for ARM's dominance in embedded: the interrupt model is consistent across M0 through M7 and across all silicon vendors. The NVIC provides hardware-assisted context saving (registers are pushed to the stack automatically), configurable priority levels (4 on M0, up to 256 on M3+), priority grouping (preemption vs. sub-priority), and tail-chaining (back-to-back interrupts skip the unstacking/restacking). This level of standardization means interrupt-handling code is largely portable across Cortex-M parts.

### What the FPU Means in Practice

Cortex-M4F and M7 cores include a hardware floating-point unit. Without an FPU, floating-point operations are emulated in software — a single-precision multiply might take 30-70 cycles in software versus 1 cycle in hardware. The compiler flag matters: `-mfloat-abi=hard` uses FPU registers and instructions; `-mfloat-abi=soft` emulates in software even if the FPU exists. I have seen projects accidentally compiled with soft float on an M4F, losing all the FPU benefit while paying for the silicon.

There is also `-mfloat-abi=softfp`, which uses the FPU for computation but passes float arguments in integer registers (for ABI compatibility with soft-float libraries). This is a reasonable middle ground when mixing FPU-aware and FPU-unaware code, but it costs a few cycles per function call for the register shuffling.

## RISC-V

RISC-V is an open instruction set architecture — no licensing fees, no proprietary extensions needed. It is modular: the base integer ISA (RV32I) is simple, and extensions are added for multiplication (M), atomics (A), floating-point (F, D), compressed instructions (C), and more. A chip advertising "RV32IMAC" supports 32-bit integer, multiply/divide, atomics, and compressed instructions.

The modularity is both a strength and a source of confusion. Two RISC-V chips may support different extension combinations, meaning code that uses atomics on one part will not compile for another that lacks the A extension. The compressed instruction extension (C) is worth noting — it provides 16-bit encodings for common operations, similar to ARM's Thumb, reducing code size by 25-30%. Most embedded RISC-V parts include it.

The embedded RISC-V ecosystem is younger than ARM's. Toolchain support (GCC, LLVM) is solid, but vendor HALs, RTOSes, and debugger support are still catching up. Espressif's ESP32-C3 and C6 use RISC-V cores, as do parts from GigaDevice (GD32V) and WCH. The architecture itself is clean and well-documented, but the practical ecosystem — libraries, examples, community knowledge — is thinner than ARM's. Finding a working example for a specific peripheral on a RISC-V chip often means reading the vendor's SDK source directly, rather than finding a forum post or blog entry.

**Debugging differences:** ARM Cortex-M uses SWD (Serial Wire Debug) or JTAG, with mature tooling (OpenOCD, J-Link, ST-Link). RISC-V uses its own debug specification, also over JTAG, but support in debugger software is less uniform. Some RISC-V vendors provide their own debug probes and tools; others rely on OpenOCD with varying levels of polish.

One difference that surprised me: RISC-V does not define a standard interrupt controller equivalent to ARM's NVIC. The RISC-V PLIC (Platform-Level Interrupt Controller) and CLIC (Core-Local Interrupt Controller) are separate specifications, and vendors implement them differently. This means interrupt handling code is less portable across RISC-V chips than across Cortex-M chips.

## AVR

The Atmel (now Microchip) AVR is an 8-bit RISC core with a true Harvard architecture — completely separate buses and address spaces for program memory (flash) and data memory (SRAM). It has 32 general-purpose 8-bit registers, and most instructions execute in a single clock cycle.

AVR is still relevant for several reasons: it is extremely simple to understand at the register level, the Arduino ecosystem built on it created an enormous body of example code and libraries, and for small, low-power applications, an 8-bit core that draws microamps in sleep is hard to beat. The ATmega328P (Arduino Uno) and ATtiny series remain widely used in hobby and low-volume production work.

The Harvard architecture means you cannot treat flash and SRAM pointers interchangeably. On AVR, reading a constant string from flash requires special macros (`PROGMEM`, `pgm_read_byte`) because the compiler's default pointer type refers to SRAM. This is a common source of bugs when porting code from other architectures.

One thing I appreciate about AVR for learning: because there are only 32 registers, a small flash, and a handful of peripherals, you can realistically read the entire datasheet and understand everything the chip does. That is not feasible with a modern Cortex-M part whose reference manual runs to 2000+ pages. AVR teaches you to think at the register level in a way that translates well to more complex architectures later.

## Harvard vs Von Neumann

**Von Neumann architecture** uses a single bus for both instructions and data. The CPU fetches an instruction and reads or writes data over the same path. Simple, flexible (code can modify itself, data and instructions share one address space), but the bus is a bottleneck — the CPU cannot fetch an instruction and read data simultaneously. The original Intel 8051 is a classic von Neumann example, and the architecture remains common in application processors (Cortex-A, x86).

**Harvard architecture** uses separate buses for instructions and data. The CPU can fetch the next instruction while completing a data access from SRAM, in the same clock cycle. Faster for execution, but the strict separation means code cannot easily read data from instruction memory (the AVR problem above). DSP chips (like the TI C2000 series) often use Harvard architecture for maximum throughput in tight signal processing loops.

**Modified Harvard** is what most modern MCUs actually use. Cortex-M cores are modified Harvard: they have separate instruction and data buses internally (for pipeline efficiency), but both map into a single unified address space. Firmware sees one flat memory map. The bus matrix handles arbitration. This gives most of the performance benefit of Harvard without the programming inconvenience.

The practical takeaway: on Cortex-M and RISC-V, you generally do not need to think about the bus architecture — the unified address space means a pointer is a pointer. On AVR, the split address space is visible to the programmer and affects how you structure data access. If you are moving from AVR to ARM, one of the first relief moments is realizing you can just read a constant from flash with a normal pointer dereference.

## Registers and Execution

### ARM Cortex-M Registers

The Cortex-M programmer's model includes:
- **R0-R12** — General-purpose 32-bit registers
- **R13 (SP)** — Stack pointer. Cortex-M has two: MSP (Main Stack Pointer) for exceptions, PSP (Process Stack Pointer) for thread code. The active one depends on execution mode
- **R14 (LR)** — Link register. Stores the return address when a function is called or an interrupt is taken
- **R15 (PC)** — Program counter

There are also special registers (xPSR, CONTROL, PRIMASK, BASEPRI) that control execution state, interrupt masking, and privilege level. These are not part of the general register file — they are accessed through special instructions (`MRS`, `MSR`).

### Pipeline Effects

Cortex-M0 has a 2-stage pipeline (fetch, execute). Cortex-M3/M4 have a 3-stage pipeline (fetch, decode, execute). Cortex-M7 has a 6-stage pipeline with dual-issue capability (it can dispatch two instructions per cycle under certain conditions). Longer pipelines allow higher clock speeds but increase the penalty for branches (the pipeline must be flushed and refilled). The Cortex-M branch predictor and speculative fetch logic mitigate this, but branch-heavy code still runs slower than straight-line code, proportionally more so on the deeper-pipeline cores.

In practice, pipeline effects are mostly invisible when writing C — the compiler handles instruction scheduling. Where it shows up is in cycle-counted code (bitbanged protocols, tight DSP loops) and in interrupt latency measurements. If you are trying to understand why a function takes more cycles than you expect, the pipeline and memory wait states are usually the explanation. Cortex-M7 adds another layer of complexity with its instruction and data caches: cache misses stall the pipeline, and execution time becomes less deterministic unless you use the tightly-coupled memory (TCM) regions.

## What the ISA Means for Firmware

Most of the time, the C compiler hides the ISA. But certain architectural details leak through into firmware behavior, and understanding them prevents subtle bugs:

- **Alignment** — ARM Cortex-M3 and above support unaligned access (with a performance penalty). M0 does not — an unaligned 32-bit access faults. Casting a `uint8_t*` to a `uint32_t*` and dereferencing it is undefined behavior in C and will hard-fault on M0
- **Atomics** — Cortex-M3+ provide `LDREX`/`STREX` (load/store exclusive) for lock-free atomic operations. M0 lacks these, so atomic access on M0 requires disabling interrupts. RISC-V has the A extension for atomics, but only if the chip implements it
- **Bit-banding** — Cortex-M3 and M4 (not M0, not M7 typically) provide a bit-band region where each bit in a peripheral or SRAM address is aliased to a full 32-bit word. Writing to the alias atomically sets or clears a single bit without a read-modify-write cycle. Useful for GPIO and flag manipulation
- **Endianness** — ARM Cortex-M is configurable but almost always runs little-endian. RISC-V specifies little-endian for the base ISA. AVR is inherently little-endian. If you are reading data from a big-endian sensor or network protocol, you need to byte-swap
- **Thumb vs Thumb-2** — All Cortex-M code runs in Thumb mode (16-bit and 32-bit mixed-width instructions). There is no ARM mode (32-bit fixed-width) on Cortex-M, unlike Cortex-A. This is transparent in C, but matters if you are reading disassembly or writing inline assembly — function pointers on Cortex-M always have bit 0 set to indicate Thumb mode

## Gotchas

- **Soft-float on an FPU-equipped core wastes the hardware** — If the compiler flags do not enable hard float (`-mfloat-abi=hard -mfpu=fpv4-sp-d16` for M4F), the FPU sits idle while software emulation burns cycles. Check the build flags whenever floating-point performance seems wrong
- **Cortex-M0 faults on unaligned access** — Code that works on M3 or M4 may hard-fault on M0 because M0 does not support unaligned 32-bit loads or stores. Packed structs and careless pointer casts are the usual triggers
- **RISC-V interrupt handling is not portable** — Unlike Cortex-M's standardized NVIC, RISC-V interrupt controllers vary by vendor. Moving firmware between RISC-V chips often means rewriting the interrupt setup, not just changing addresses
- **AVR flash reads require special handling** — String constants and lookup tables stored in flash on AVR cannot be read with normal pointer dereferences. Forgetting `PROGMEM` and `pgm_read_*` is a classic AVR bug that produces garbage data at runtime
- **Pipeline depth affects interrupt latency** — A deeper pipeline means more cycles to flush before the interrupt handler begins executing. Cortex-M0 has 15-cycle worst-case interrupt latency; M7 can be 20+ cycles depending on cache and TCM configuration. For hard real-time work, this matters
- **Modified Harvard looks like von Neumann to the programmer** — On Cortex-M, you can read flash, SRAM, and peripherals through the same address space. But the bus architecture underneath still has separate paths, and simultaneous accesses can stall. The [Memory Map]({{< relref "memory-map" >}}) determines which bus carries which access
