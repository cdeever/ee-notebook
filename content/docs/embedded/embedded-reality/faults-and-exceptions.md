---
title: "Faults & Exceptions"
weight: 20
---

# Faults & Exceptions

When a CPU encounters something it cannot execute -- an illegal instruction, an access to unmapped memory, a division by zero -- it does not quietly continue. It raises a fault: a high-priority exception that preempts whatever the processor was doing. On ARM Cortex-M, faults are the system's way of saying "I cannot do what you asked, and I am stopping until you deal with it." Understanding faults is not optional for embedded development. They are the primary diagnostic mechanism when firmware crashes, and the default response (an infinite loop) tells you nothing.

## What Faults Are

Faults are a specific category of exceptions in the ARM Cortex-M architecture. They are triggered synchronously by the instruction that caused the problem (unlike interrupts, which are asynchronous). When a fault occurs, the CPU stops executing the current instruction stream, saves context to the stack, and jumps to the fault handler -- exactly like an interrupt, but involuntary.

On Cortex-M3, M4, and M7, the architecture defines four fault types. On Cortex-M0 and M0+, all faults collapse into HardFault because the simpler core does not support the configurable fault handlers.

## HardFault

HardFault is the catch-all. It fires when a more specific fault handler is either disabled or itself faults. On Cortex-M0, every fault is a HardFault. On M3/M4/M7, HardFault fires when:

- A configurable fault (BusFault, MemManage, UsageFault) occurs but its handler is not enabled in the SHCSR register
- A fault occurs during the execution of another fault handler (fault escalation)
- A vector table read fails during exception entry

HardFault has a fixed priority of -1, meaning only NMI and reset can preempt it. If the HardFault handler itself faults (usually because the stack is corrupt), the CPU enters a lockup state -- it holds the reset line active and can only recover via an external reset or power cycle.

## BusFault

A BusFault occurs when a memory transaction fails at the bus level. Common causes:

- **Dereferencing a NULL pointer** -- address 0x00000000 is valid on Cortex-M (it is the start of the vector table in flash), so NULL dereferences often read the initial stack pointer value rather than faulting. However, writes to flash addresses fault because flash is read-only at the bus level
- **Accessing a peripheral with its clock disabled** -- on most MCUs, reading or writing a peripheral register when the peripheral clock is not enabled returns a bus error. See {{< relref "/docs/embedded/mcu-architecture/memory-map" >}} for details on the peripheral address space
- **Accessing unmapped memory** -- any address that does not correspond to flash, SRAM, or a peripheral returns a bus error
- **DMA accessing an invalid address** -- a misconfigured DMA channel can trigger a BusFault during a transfer

BusFault can be precise (the faulting instruction is identified in the stacked PC) or imprecise (the fault is reported some time after the offending instruction, due to write buffering). Imprecise bus faults are harder to debug because the stacked PC does not point to the instruction that caused the problem. The BFSR (BusFault Status Register) indicates whether the fault is precise and whether the BFAR (BusFault Address Register) contains a valid address.

## UsageFault

UsageFault covers illegal instruction execution and certain arithmetic errors:

- **Undefined instruction** -- the CPU fetched something that does not decode as a valid Thumb instruction. This often means the program counter has been corrupted (wild jump) or the code was compiled for the wrong architecture (e.g., ARM instructions on a Thumb-only core)
- **Unaligned access** -- accessing a 32-bit value at a non-4-byte-aligned address. The default behavior on Cortex-M3+ is to allow unaligned access (with a performance penalty), but the UNALIGN_TRP bit in the CCR can be set to trap on it
- **Division by zero** -- by default, integer division by zero on Cortex-M3+ returns zero without faulting. Setting the DIV_0_TRP bit in the CCR makes it trigger a UsageFault instead. I always enable this trap; a silent zero from a divide-by-zero masks bugs
- **Invalid state** -- attempting to execute in ARM state on a Thumb-only processor, or attempting to use a coprocessor instruction without the coprocessor enabled (common when using floating-point on M4F without enabling the FPU)

## MemManage Fault

The MemManage fault fires when the Memory Protection Unit (MPU) detects an access violation. The MPU is a hardware unit that defines memory regions with access permissions (read, write, execute) and privilege levels. When code accesses memory in a way that violates the configured permissions, MemManage fires.

Without the MPU configured, MemManage faults never occur. But with even a minimal MPU configuration, the MPU becomes a powerful debugging tool. Common uses:

- Making a guard region below the stack non-accessible, so stack overflow triggers an immediate fault instead of silent corruption
- Making the NULL page (address 0) non-accessible, so NULL pointer dereferences fault immediately
- Making peripheral regions accessible only from privileged mode, catching accidental peripheral access from application code

The MMFSR (MemManage Fault Status Register) and MMFAR (MemManage Fault Address Register) identify the violation type and the faulting address.

## Stack Overflow

Stack overflow is one of the most common and most destructive embedded failure modes. The stack grows downward on Cortex-M. When it grows past its allocated region, it writes into whatever memory lies below -- typically global variables in `.bss` or `.data`, or the heap.

The insidious part is that stack overflow does not trigger any fault by default. The writes succeed (they hit valid SRAM), and the corrupted variables cause failures that appear completely unrelated to the stack. A counter that spontaneously changes value, a state machine that jumps to an impossible state, a pointer that suddenly points somewhere wrong -- these can all be symptoms of stack overflow.

Causes of stack overflow in embedded systems:

- **Deep call chains** -- especially with library functions that are deeper than expected
- **Large local variables** -- a local array of 1024 bytes consumes 1 KB of stack on every call
- **Interrupt nesting** -- each nested interrupt pushes its own context frame (at least 32 bytes on Cortex-M, more with FPU context). In a system with multiple interrupt priorities, worst-case stack usage includes all possible nesting levels
- **Recursive functions** -- generally avoided in embedded code for exactly this reason

Detection strategies: paint the stack with a known pattern (0xDEADBEEF is traditional) at startup and periodically check whether the pattern at the bottom of the stack region has been overwritten. GCC's `-fstack-usage` flag reports per-function stack consumption at compile time. The MPU guard region approach mentioned above is the most reliable runtime detection.

## Fault Diagnosis

When a fault fires, the CPU pushes an exception frame onto the stack before jumping to the handler. This frame contains the register values at the time of the fault:

- **R0-R3, R12** -- general-purpose registers
- **LR (Link Register)** -- the return address of the function that was executing
- **PC (Program Counter)** -- the address of the instruction that caused the fault (for synchronous faults)
- **xPSR** -- the program status register

The stacked PC is the most valuable piece of information. Loading it in a debugger or looking it up in the `.map` file tells you exactly which function and which line caused the fault.

On Cortex-M3+, the fault status registers (CFSR, HFSR, MMFAR, BFAR) provide additional detail: the type of fault, whether the fault address is valid, and whether the fault escalated from a configurable fault.

## Writing a Fault Handler

The default fault handler generated by most startup files is an infinite loop: `while(1){}`. This is useless -- it tells you a fault occurred, but nothing about why.

A useful fault handler should:

1. **Read the stacked registers** -- The exception frame is on the stack pointed to by the MSP (or PSP if using an RTOS). The stacked PC is the key to identifying the fault location
2. **Read the fault status registers** -- CFSR (Configurable Fault Status Register) combines MMFSR, BFSR, and UFSR into one word. HFSR (HardFault Status Register) indicates whether the fault was escalated
3. **Log the information** -- Write the fault data to a reserved SRAM region, to backup registers, or to non-volatile memory so it survives the subsequent reset. If a debug UART is available, print it
4. **Trigger a reset or halt** -- Depending on the application, either reset the system or halt for debugger inspection

A minimal fault handler in C that extracts the stacked PC is straightforward to write, and it transforms fault debugging from "something crashed" to "the instruction at address 0x08001A34 caused a precise bus fault when accessing address 0x40021400." That level of specificity usually leads to a fix within minutes.

## MPU as a Defensive Tool

The MPU is underused in bare-metal embedded projects. Configuring it takes a few dozen lines of code, but it catches entire categories of bugs at runtime:

- **Stack guard** -- a 32-byte or larger region at the bottom of the stack, marked no-access. Stack overflow triggers an immediate MemManage fault instead of silent corruption
- **NULL pointer guard** -- the bottom of the address space marked no-access. NULL dereferences fault immediately
- **Peripheral protection** -- peripheral regions accessible only in privileged mode. Accidental peripheral access from the wrong module faults instead of silently clobbering registers

The MPU has a limited number of regions (typically 8 on Cortex-M3/M4, 16 on M7), and region alignment requirements can be restrictive (power-of-two sizes, aligned to their own size on M3/M4). Despite these limitations, even three or four MPU regions covering the stack guard, NULL page, and flash (no-write) catch a meaningful fraction of common bugs.

## Gotchas

- **The default fault handler tells you nothing** -- Most startup files define the fault handler as an infinite loop. You will not know why the system faulted until you replace it with a handler that reads the stacked PC and fault status registers.
- **Imprecise bus faults point to the wrong instruction** -- Write buffer delays mean the stacked PC for an imprecise bus fault is some instruction after the one that caused the write. Disabling the write buffer (DISDEFWRT in the ACTLR) makes all bus faults precise, at a performance cost, but is invaluable during debugging.
- **Stack overflow does not fault by default** -- The stack writes into valid SRAM, corrupting other variables. The resulting symptoms appear unrelated to the stack. Without an MPU guard region or stack painting, stack overflow can take days to diagnose.
- **NULL pointer dereference may not fault on Cortex-M** -- Address 0x00000000 is the start of the vector table and is valid readable memory. Dereferencing NULL reads the initial stack pointer value. Only writes to flash addresses fault at the bus level. An MPU region marking address 0 as no-access is the fix.
- **Floating-point instructions fault if the FPU is not enabled** -- On Cortex-M4F and M7, the FPU is disabled at reset. Any floating-point instruction triggers a UsageFault until the CPACR register is configured. This is typically done in SystemInit() or the startup code, but a custom startup file may miss it.
