---
title: "Debug Interfaces"
weight: 20
---

# Debug Interfaces

Embedded debugging is fundamentally different from debugging on a desktop. There is no terminal window, no `printf` that just works, no core dump file, no OS to catch a segfault and give you a stack trace. The MCU is a chip on a board, and the only way to see inside it is through a dedicated debug interface — a hardware connection between the host machine and the CPU's debug unit. Without this connection, you are limited to blinking LEDs and toggling GPIOs, which works surprisingly often but has limits.

## Why a Hardware Debug Interface

The debug unit is built into the CPU silicon. On ARM Cortex-M, it is called the CoreSight Debug Access Port (DAP). It provides the ability to halt the CPU, read and write registers, read and write memory, set breakpoints, and single-step — all through a small number of dedicated pins. This is not a software feature that can be compiled in or out. It is a hardware block, always present (though it can be disabled for security).

This means debugging does not require any firmware support. You can connect to a completely blank chip, write to flash through the debug port, and begin stepping through the reset handler. This is how initial board bringup works — before there is firmware, the debug probe is the only way in.

## JTAG

JTAG (Joint Test Action Group, IEEE 1149.1) is the original debug and test interface. It predates ARM microcontrollers and was designed for boundary scan testing of solder joints on PCBs — the debug functionality was added later.

JTAG uses 4-5 wires:

- **TCK** — Test Clock, driven by the debug probe
- **TMS** — Test Mode Select, controls the state machine
- **TDI** — Test Data In, data from the probe to the target
- **TDO** — Test Data Out, data from the target to the probe
- **TRST** (optional) — Test Reset, resets the JTAG state machine

JTAG supports daisy-chaining multiple devices on a single bus. This is how a debug probe can access both an FPGA and an MCU on the same board through one JTAG header. However, daisy-chaining adds complexity and can cause reliability problems if any device in the chain misbehaves.

JTAG is still used on larger ARM processors (Cortex-A), FPGAs, and some DSPs. On Cortex-M, it has been largely displaced by SWD, though most Cortex-M chips still support JTAG as an alternative interface.

## SWD (Serial Wire Debug)

SWD is ARM's 2-wire alternative to JTAG, designed specifically for Cortex-M. It provides the same debug functionality — halt, step, breakpoints, memory access — using only two pins:

- **SWDIO** — Bidirectional data line
- **SWCLK** — Clock, driven by the debug probe

Two pins versus five is a significant advantage on pin-constrained MCUs. SWD also supports an optional third pin, **SWO** (Serial Wire Output), which provides trace output through the ITM — see {{< relref "observability" >}} for how SWO is used for non-intrusive logging.

SWD is the standard debug interface for Cortex-M. Every modern ARM debug probe supports it, and most Cortex-M development boards expose an SWD header (sometimes labeled as the "debug" or "programming" header). The 10-pin Cortex Debug Connector is the standard pinout, though many boards use a smaller 2x5 1.27mm header.

## Debug Probes

The debug probe bridges the gap between the host computer (USB) and the target board (SWD or JTAG). The probe runs a protocol translator — USB on one side, SWD/JTAG on the other — and typically provides a GDB server that the host-side debugger connects to.

Common probes:

- **Segger J-Link** — The industry standard for professional work. Fast, reliable, excellent software support. The EDU version is affordable for non-commercial use. Provides its own GDB server (`JLinkGDBServer`) and supports SWD, JTAG, SWO, and RTT.
- **ST-Link** — Bundled on every STM32 Nucleo and Discovery board. Good enough for most STM32 development. Open-source alternatives like `stlink` and `OpenOCD` support it. Newer versions (ST-Link V3) are significantly faster.
- **CMSIS-DAP** — ARM's open standard for debug probes. Any vendor can build one. Performance varies. DAPLink is a common open-source firmware implementing this protocol. Useful when you need a vendor-neutral solution or want to build your own probe.

The probe selection matters less than you might think for basic debugging. Where it matters is speed (flash programming throughput, single-step responsiveness) and advanced features (trace capture, real-time transfer). I started with the ST-Link on a Nucleo board and did not feel limited for months.

## Breakpoints

Breakpoints halt the CPU when execution reaches a specific address. There are two kinds, and the distinction matters:

### Hardware Breakpoints

The Cortex-M debug unit contains a Flash Patch and Breakpoint (FPB) unit with a limited number of comparators — typically 4 to 8 depending on the CPU variant. Each comparator can watch for one address. When the CPU fetches an instruction from a watched address, it halts.

Hardware breakpoints work everywhere — flash, SRAM, external memory. The limitation is quantity. If you need more breakpoints than the FPB provides, the debugger has to swap them in and out, which can change timing behavior.

### Software Breakpoints

A software breakpoint replaces the instruction at the target address with a special breakpoint instruction (`BKPT` on ARM). When the CPU executes it, it halts. The debugger then restores the original instruction when you continue.

This requires the memory to be writable at runtime, which means software breakpoints work in SRAM but not in flash (on most MCUs, you cannot write to flash without an erase-program cycle). Since most code runs from flash, software breakpoints are rarely usable on Cortex-M. Some probes work around this by using the FPB to remap flash addresses to SRAM patches, but this is limited and probe-dependent.

In practice, you have 4-8 breakpoints available. This is enough most of the time, but it requires a different debugging style than desktop development — you cannot casually scatter breakpoints everywhere. Set them deliberately, and remove them when you are done with a section of code.

## Watchpoints

Watchpoints (also called data breakpoints) halt the CPU when a specific memory address is read from or written to. The Cortex-M Data Watchpoint and Trace (DWT) unit provides 2-4 watchpoint comparators.

Watchpoints are invaluable for a specific class of bugs: "something is corrupting this variable, and I do not know what." Set a watchpoint on the variable's address, and the CPU halts at the exact instruction that writes to it. Without watchpoints, you would have to audit every pointer access and every array bounds check manually. I have spent hours tracking down a corruption bug that a watchpoint found in seconds.

Watchpoints can trigger on read, write, or both. They can also trigger on a specific data value on some implementations, though this is less common on Cortex-M.

## Single-Stepping and Register Inspection

With the CPU halted, the debugger can:

- **Step one instruction** — Execute the next machine instruction and halt again. This shows exactly what the CPU is doing, but at the assembly level, not the source level.
- **Step one source line** — Execute all instructions corresponding to the next C source line. At higher optimization levels, one source line may correspond to many instructions, or multiple source lines may be merged into one instruction, making this confusing.
- **Read/write CPU registers** — R0-R15, PSR, CONTROL, PRIMASK. You can see the current PC (program counter), the stack pointer, and the link register (return address).
- **Read/write any memory address** — This includes peripheral registers, SRAM, flash, and the debug unit itself. You can manually toggle a GPIO by writing to its output register from the debugger.

The most important skill is correlating what the debugger shows with what the source code intends. At `-O0`, this is straightforward. At `-O2`, the debugger may show variables as "optimized out" and the PC may jump between source lines in a non-obvious order. Debugging optimized code is a learned skill.

## Semihosting

Semihosting lets the target MCU call host-side functions — `printf` that appears in the debugger console, file I/O to the host filesystem. The mechanism is a special breakpoint instruction (`BKPT 0xAB` on ARM) that the debug probe intercepts. The probe reads the requested operation from the CPU registers, performs it on the host, and resumes the CPU.

The problem is performance. Every semihosting call halts the CPU. A single `printf` can take milliseconds — an eternity on a microcontroller running at 168 MHz. If you use semihosting in a time-critical loop, the system's timing behavior changes completely. It is a development tool, not a production technique.

Semihosting also fails silently if no debugger is attached. On some implementations, the `BKPT` instruction causes a hard fault without a debug probe connected, so firmware that uses semihosting will crash in standalone operation unless you guard the calls.

## RTT (Real-Time Transfer)

Segger's RTT is a better answer to the "I want `printf` over the debug probe" problem. RTT uses a shared memory buffer in SRAM. The firmware writes log data into the buffer using normal memory writes (no CPU halt). The debug probe reads the buffer contents in the background using the debug access port. The CPU never stops.

RTT achieves throughput of several hundred KB/s with negligible CPU overhead. The tradeoff is that it requires a Segger J-Link (or a CMSIS-DAP probe with RTT support) and the RTT library linked into the firmware. For development-time logging, it is dramatically better than semihosting or UART in my experience.

## Debug Access in Production

Debug pins (SWDIO, SWCLK) are valuable GPIO on pin-constrained packages. Some designs repurpose them after development, which means the production board cannot be debugged without rework.

More critically, most MCUs allow permanently locking the debug interface via option bytes or fuse bits. Once locked:

- The debug probe cannot connect
- Flash contents cannot be read back (protecting firmware IP)
- The chip cannot be re-programmed through SWD/JTAG (only through a bootloader, if one exists)

This is intentional — it prevents competitors from reading your firmware. But if you lock a chip during development by accident, it is bricked for debugging purposes. Some MCUs allow a "mass erase unlock" that erases all flash and then re-enables debug access, but this destroys the firmware.

## Gotchas

- **Hardware breakpoints are limited in number** — Cortex-M typically provides 4-8 hardware breakpoints. If you set more than the hardware supports, the debugger may silently fail to set the extra ones, or it may try software breakpoints that do not work in flash. Check your debugger's output for warnings.
- **Semihosting crashes without a debugger attached** — The `BKPT` instruction used by semihosting causes a hard fault if no debug probe is connected. Production firmware must never include semihosting calls, or must guard them behind a check for debugger presence (the CoreDebug->DHCSR register, C_DEBUGEN bit).
- **Debugging optimized code is confusing by design** — At `-O2`, variables are "optimized out," lines execute out of order, and functions are inlined or eliminated. This is correct compiler behavior, not a bug. Build a separate debug configuration at `-O0` for interactive debugging.
- **SWO requires a matching clock configuration** — The SWO output baud rate depends on the CPU clock. If the debugger's SWO configuration does not match the target's actual clock speed, SWO output is garbled or silent. Some probes auto-detect the clock, but many require manual configuration.
- **Locking debug access is permanent on some MCUs** — Write-protecting the debug interface (read-out protection level 2 on STM32, for example) is irreversible. The chip cannot be debugged, reprogrammed, or unlocked. This is a manufacturing step, not a development step. Triple-check before setting it.
- **Watchpoints on peripheral registers may not work as expected** — The DWT watchpoint comparators monitor the CPU's data bus. DMA transfers that bypass the CPU will not trigger a watchpoint, even if they write to the watched address. If DMA is corrupting a buffer, watchpoints will not catch it.
