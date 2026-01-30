---
title: "Observability"
weight: 30
---

# Observability

A debugger with breakpoints is powerful, but it has a fundamental limitation: it stops the system. Halting the CPU changes timing, breaks real-time deadlines, disrupts communication protocols, and makes time-dependent bugs disappear. Some of the hardest embedded bugs only manifest at full speed — race conditions, interrupt priority inversions, marginal timing on a bus — and stopping the CPU to observe them is like opening the oven to check if the souffle has risen. You need ways to see what happened without changing when it happened.

There is also the production case. Deployed systems do not have a debug probe attached. When a device fails in the field, the only information available is whatever the firmware recorded before things went wrong. Observability is not a debugging convenience — it is a design requirement.

## GPIO Toggling

The simplest and most underrated debugging technique. Toggle a GPIO pin high at the start of a function or ISR and low at the end. Connect the pin to an oscilloscope or logic analyzer. Now you can see:

- **Execution duration** — The pulse width is the function's execution time, measured to nanosecond accuracy by the scope.
- **Jitter** — Variation in pulse width or period reveals scheduling inconsistency, interrupt latency variation, or contention for shared resources.
- **Execution frequency** — How often the function runs, and whether it matches your expectation.
- **Relative timing** — Use two GPIO pins for two different code paths to see their timing relationship.

The cost is one GPIO pin and two register writes (set high, set low) — a few nanoseconds of overhead. On most Cortex-M parts, you can write directly to the BSRR register for single-cycle atomic GPIO toggling. I keep a couple of header pins broken out on every prototype board specifically for this purpose.

This technique works when nothing else does. Before the UART is initialized, before the debug probe is configured, before the ITM clock is set up — a GPIO toggle and an oscilloscope will tell you whether your code is running and how long it takes.

## UART Logging

The workhorse of embedded observability. Send text strings over a UART to a serial terminal on the host. Every developer knows `printf` debugging, and on embedded it works the same way — with some caveats.

**Baud rate and timing impact:** At 115200 baud, each character takes approximately 87 microseconds. A 50-character log line takes over 4 milliseconds. If your main loop runs at 1 kHz, one log line per iteration consumes nearly half the loop budget. This is not hypothetical — I have seen systems where adding UART logging changed timing enough to mask the bug being investigated.

**Mitigation strategies:**

- **Buffered output with DMA** — Write log data into a SRAM ring buffer; let DMA drain the buffer to the UART in the background. The CPU cost is a memcpy into the buffer, not waiting for the UART to transmit. This reduces the per-call cost from milliseconds to microseconds.
- **Higher baud rates** — Many UART peripherals support 921600 baud or higher with acceptable error rates. This reduces per-character time to ~11 microseconds.
- **Conditional logging** — Only log when something interesting happens (state transitions, errors) rather than every iteration.

UART logging also requires a physical connection — a UART-to-USB adapter or an onboard USB-serial converter. On production boards without a serial header, this may not be available.

## Structured Logging

Once you have more than one subsystem producing log output, raw `printf` becomes unmanageable. Structured logging adds metadata to each message:

- **Log levels** — Error, warning, info, debug. Filter output by severity at compile time or runtime. Production builds might only emit errors and warnings.
- **Timestamps** — A millisecond (or microsecond) timer value at the start of each message. Essential for understanding the order and timing of events. Use a hardware timer, not a variable you increment — the timer keeps running even when the CPU is busy.
- **Source identifiers** — Which module produced the message (e.g., `[SPI]`, `[MOTOR]`, `[ADC]`). This makes log output greppable and lets you enable/disable logging per subsystem.

**Binary logging** is a more advanced technique: instead of formatting strings on the target, emit a compact binary record (message ID, timestamp, parameter values) and decode it on the host. This is dramatically faster — a 4-byte message ID plus a few parameters versus a 50-character formatted string — and reduces flash usage (no format strings stored in `.rodata`). The tradeoff is that raw binary output is not human-readable without a decoder.

## ITM (Instrumentation Trace Macrocell)

The ARM Cortex-M includes hardware support for non-intrusive trace output through the ITM. Data written to the ITM stimulus ports is serialized and sent out through the SWO (Serial Wire Output) pin — the optional third wire of the SWD interface.

ITM is significantly faster than UART logging because it uses dedicated trace hardware rather than a general-purpose peripheral. The CPU writes a word to a memory-mapped register, and the trace hardware handles serialization in the background. Typical SWO data rates reach 1-4 Mbit/s depending on the CPU clock and the SWO prescaler.

**Using ITM in practice:**

- The debug probe must support SWO capture (most do: J-Link, ST-Link V2+, CMSIS-DAP with SWO)
- The target firmware must configure the ITM and TPIU (Trace Port Interface Unit) registers
- The SWO clock must be configured to match between target and probe — this is the most common source of "ITM output is not working" problems
- Many IDEs (STM32CubeIDE, Ozone, VS Code with Cortex-Debug) can display ITM output in a console window

I think of ITM as "UART logging without the UART" — same concept, less timing impact, but it requires a debug probe connection, so it is a development-time tool, not a production one.

## ETM (Embedded Trace Macrocell)

ETM records every instruction the CPU executes. This is full instruction trace — not just the points where you added logging, but the complete execution path including branches taken, functions called, and interrupts serviced.

ETM requires:

- A CPU variant that includes ETM (not all Cortex-M do — check the datasheet)
- A trace-capable debug probe with a high-speed trace port (Segger J-Trace, ARM DSTREAM, Lauterbach)
- A target board with the trace pins routed to a header (4-bit or wider parallel trace port)

The probes are expensive (hundreds to thousands of dollars) and the board must be designed for trace from the start. But for hard-to-reproduce bugs — the kind where the system crashes once a day and you cannot figure out the sequence of events leading to the crash — ETM is invaluable. You can reconstruct the complete execution history leading up to the fault.

I have not used ETM regularly. It is on my list of tools to explore more deeply for complex timing bugs.

## Logic Analyzers

A logic analyzer captures digital signals over time — not just one channel, but 8, 16, or 32+ channels simultaneously. For embedded debugging, the killer application is protocol analysis.

Suppose an SPI peripheral is not responding. Is the firmware sending the right bytes? Is the clock frequency correct? Is the chip select being asserted at the right time? A logic analyzer captures CLK, MOSI, MISO, and CS, and a protocol decoder turns the raw waveforms into a readable transaction: "Wrote 0x8F to register 0x0D, read back 0x71." This answers questions that software-only debugging cannot.

Common uses:

- **SPI, I2C, UART protocol verification** — See the actual bytes on the wire, including timing between transactions
- **Interrupt timing** — Capture the interrupt request line alongside the ISR GPIO toggle to measure interrupt latency
- **Multi-signal correlation** — See the relationship between a DMA complete flag, a chip select, and a processing-done GPIO toggle

The Saleae Logic analyzers are popular for bench use — USB-connected, good software, reasonable price for the 8-channel version. For more channels or higher sample rates, dedicated instruments from Keysight, Rohde & Schwarz, and others are available. See {{< relref "/docs/measurement/signals-waveforms" >}} for general signal measurement techniques and {{< relref "/docs/measurement/digital-logic-protocols" >}} for digital protocol measurement specifics.

## Oscilloscope-Assisted Debugging

Some firmware bugs manifest as analog phenomena that no amount of software tracing will reveal. The oscilloscope bridges the gap between firmware behavior and electrical reality.

Examples:

- **Voltage droops during high-current GPIO transitions** — Switching a bank of GPIOs simultaneously causes a current spike that droops the supply rail. If the droop crosses the brownout threshold, the MCU resets. The firmware sees a reset; only the scope sees the droop.
- **ADC reference noise** — The ADC readings jitter. Is it the signal, the reference voltage, or the power supply? Probing VREF+ and VDDA with the scope while the ADC samples reveals whether the reference is stable.
- **Power supply ripple under load** — Firmware enables a peripheral (radio, motor driver, LED array) and the system misbehaves. The scope shows the supply rail sagging under the new load, possibly dropping below the MCU's minimum operating voltage.
- **SPI clock integrity** — The SPI clock looks clean at 1 MHz but develops ringing at 10 MHz due to trace impedance mismatches. The scope reveals signal integrity issues that the logic analyzer, with its simple threshold detection, misses entirely.

The oscilloscope shows what the firmware cannot see. For power supply investigation techniques, see {{< relref "/docs/measurement/power-rails-supplies" >}}.

## Post-Mortem Debugging

When a system crashes in the field, there is no debugger to inspect the state. The information is gone unless the firmware saved it before (or during) the crash.

**Fault handler data capture:** On Cortex-M, a hard fault pushes the exception frame onto the stack: R0-R3, R12, LR, PC, and xPSR. A fault handler can read these values and save them to a reserved SRAM region or to non-volatile storage (EEPROM, flash, backup SRAM with battery). After reboot, the application reads back the saved state and reports it — via logging, an LED pattern, or a diagnostic protocol.

**What to save:**

- The faulting PC — which instruction caused the crash
- The link register (LR) — which function called the one that crashed
- The fault status registers (CFSR, HFSR, MMFAR, BFAR on Cortex-M3+) — what type of fault occurred and what address was involved
- A software version identifier — so you can match the crash to a specific firmware build
- A timestamp or uptime counter — how long the system ran before crashing

**Implementation pattern:** Reserve a small block of SRAM (or use backup SRAM on STM32) that is not zeroed by the startup code. Write fault data to this region in the fault handler. On reboot, check for a magic value that indicates valid crash data. Read and report it, then clear the magic value.

This is the embedded equivalent of a crash dump, and it transforms field debugging from "it randomly reboots sometimes" to "it faulted at address 0x08003A7C due to a bus error accessing 0x40021800, which is the RCC register — probably a clock that was not enabled." That level of information is the difference between a wild goose chase and a targeted fix.

## Gotchas

- **UART logging changes timing enough to mask bugs** — A 50-character message at 115200 baud takes over 4 ms without DMA buffering. This is long enough to change interrupt timing, hide race conditions, and alter the behavior you are trying to observe. Always account for the timing impact of your logging.
- **ITM requires correct SWO clock configuration** — If the SWO prescaler does not match the CPU clock frequency, ITM output is garbled or absent. After changing the system clock, the SWO configuration must be updated too. This is the most common "ITM stopped working" problem.
- **GPIO toggle pins must be configured before use** — It sounds obvious, but a debug GPIO toggle in an early fault handler or startup code will do nothing if the GPIO port clock has not been enabled yet. For very early debugging, use a pin that defaults to a usable state, or enable the GPIO clock as the very first operation.
- **Post-mortem data survives only if SRAM is preserved** — A power loss clears SRAM. A watchdog reset may or may not clear SRAM depending on the MCU. Battery-backed SRAM (e.g., STM32 backup SRAM) or writing to flash/EEPROM is more reliable, but flash writes take time and may not complete if the supply is collapsing.
- **Logic analyzer sample rate must exceed signal frequency** — A 24 MHz logic analyzer sampling a 12 MHz SPI clock will alias or miss edges. The general rule is at least 4x the signal frequency for reliable capture, and 10x or more for timing measurements. Nyquist applies here just as it does to analog sampling.
- **Binary logging is unreadable without the matching decoder** — If you switch to binary log encoding for performance, you need a host-side tool that knows the message format. If the firmware version and the decoder version diverge, the output is garbage. Version the log format and keep the decoder in sync with the firmware.
