---
title: "Memory Map"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Memory Map

The memory map is the contract between hardware and software. Every address in the microcontroller's address space has a defined meaning: some ranges are flash (where code lives), some are SRAM (where variables live), some are peripheral registers (where writing a value actually toggles a pin or starts a timer). When a hard fault fires, the faulting address reveals whether the access hit an unmapped region, a peripheral with its clock disabled, or the end of the stack.

## The Address Space

On a 32-bit Cortex-M, the address space is 4 GB. ARM defines a standard partitioning into regions for code (typically flash), SRAM, peripherals, external memory, and system control blocks. No chip uses all of it — a typical Cortex-M4 MCU might have 512 KB of flash, 128 KB of SRAM, and peripherals scattered through the peripheral region. Everything else is unmapped, and accessing it triggers a hard fault.

The vendor's reference manual contains the detailed memory map with exact address ranges. This is one of the most-referenced chapters in any MCU reference manual.

## Flash

Flash memory stores program code and read-only data (constants, lookup tables, string literals). It is non-volatile — contents survive power loss.

Key runtime properties:

- Flash is read-only during normal execution. Writing requires a special erase-then-program sequence through the flash controller, not a simple store instruction
- At high clock speeds, flash may be slower than the CPU. The flash controller inserts wait states (extra stall cycles) to compensate. Vendor datasheets specify wait states vs. clock speed
- Many MCUs include a flash prefetch buffer or instruction cache to hide wait states for sequential code execution

## SRAM

SRAM holds all runtime data: local variables (on the stack), global and static variables, the heap (if dynamic allocation is used), and DMA buffers.

Key properties:

- Volatile — contents are lost at power-off
- No endurance limits — read and write without restriction
- Typically single-cycle access at the CPU clock speed

Size matters differently than on a PC. A mid-range Cortex-M4 might have 128-256 KB of SRAM. That is where the stack, global buffers, RTOS task stacks, and the heap all compete for space. Running out of SRAM is a real and common failure mode, and unlike a desktop OS, there is no swap file.

## Memory-Mapped I/O

On Cortex-M (and most modern MCU architectures), peripherals are not accessed through special I/O instructions. They are accessed through normal memory addresses. Reading the GPIO input data register is a load from a specific address; writing the UART data register is a store to another. This is memory-mapped I/O.

Why this matters for firmware:

- Peripheral registers are declared as pointers to specific addresses. Vendor header files define structs overlaid on the peripheral address. `GPIOA->ODR = 0x01` compiles to a store to a fixed address
- The `volatile` keyword is essential. Without it, the compiler may optimize away reads from peripheral registers (assuming the value hasn't changed) or reorder writes. Every peripheral register pointer must be `volatile`
- Read-modify-write on peripheral registers is not atomic. If main-loop code reads a GPIO output register, ORs in a bit, and writes it back, an interrupt between the read and write can clobber the other bits. Atomic set/clear registers (like GPIO BSRR) or interrupt masking avoid this

## Stack and Heap

### Stack

The stack holds function call frames: return addresses, saved registers, and local variables. On Cortex-M, the stack grows downward (from high addresses to low). The initial stack pointer is loaded from the first word of the vector table at reset.

Stack overflow is silent and catastrophic. There is no guard page, no segfault, no exception (unless the MPU is configured for it). The stack simply writes into whatever memory is below it — typically the heap or `.bss`. The resulting corruption may not crash immediately, making it extremely hard to diagnose.

### Heap

Dynamic memory allocation (`malloc`, `free`) uses the heap — typically whatever SRAM remains between static data and the bottom of the stack. Most experienced embedded developers avoid dynamic allocation in production firmware due to fragmentation in long-running systems and non-deterministic allocation time.

## Linker Scripts Define the Map

The linker script (`.ld` file on GCC-based toolchains) is where the firmware's view of memory is defined. It specifies memory regions (flash and SRAM start addresses and sizes) and where each type of data goes: executable code in flash, constants in flash, initialized variables stored in flash and copied to SRAM at startup, zero-initialized variables zeroed in SRAM at startup, and stack and heap regions carved from remaining SRAM.

The startup code is responsible for copying initialized data from flash to SRAM and zeroing the `.bss` section before `main()` runs. If the linker script is wrong — say, the SRAM size is larger than what the chip actually has — the system may appear to work but corrupt memory silently.

## Tips

- **Read the memory map chapter first** — the vendor reference manual's memory map is the single most-referenced chapter during firmware development; it defines where every peripheral register, flash region, and SRAM block sits in the address space
- **Every peripheral register pointer must be `volatile`** — without it, the compiler may cache a register read or reorder writes, producing intermittent bugs that disappear at lower optimization levels
- **Avoid `malloc` on bare-metal** — heap fragmentation in a long-running system with limited SRAM leads to allocation failures that are nearly impossible to reproduce; use statically allocated buffers instead
- **Check the linker script when switching chip variants** — a different part number in the same family may have different flash and SRAM sizes; the linker script must match the actual hardware

## Caveats

- **Accessing an unclocked peripheral faults** — On most Cortex-M MCUs, peripheral registers are inaccessible until the peripheral's clock is enabled. Reading an unclocked peripheral returns a bus fault. This is the most common cause of hard faults in new firmware bringup
- **Stack overflow corrupts silently** — Without an MPU region guarding the stack boundary, overflow writes into adjacent memory with no exception. The symptom is usually mysterious data corruption or a crash far removed from the actual overflow
- **Flash wait states must match clock speed** — If the system clock increases but flash wait states remain at the reset default, the CPU reads garbage from flash. Always configure wait states before increasing the clock
- **Linker script errors are silent until they crash** — If the linker script declares more SRAM than the chip has, the linker happily places data in nonexistent addresses. Everything builds cleanly; the firmware crashes at runtime

## In Practice

A hard fault on first access to a peripheral register almost always means the peripheral clock has not been enabled — the register address is valid, but the bus returns a fault because the peripheral is powered down. Mysterious data corruption that appears only under load often traces to stack overflow: the stack grows into the heap or `.bss` region, overwriting variables with return addresses and saved registers. When initialized variables contain wrong values at startup, the linker script is the first suspect — either the SRAM region is declared larger than the physical memory, or the startup code is not copying `.data` from flash correctly. In each case, the memory map is the reference that connects the faulting address to the subsystem involved.
