---
title: "Sequencing, Bring-Up, and Reset Domains"
weight: 30
---

# Sequencing, Bring-Up, and Reset Domains

A device doesn't spring into existence fully operational. It boots. Power rails come up in sequence. Oscillators start and stabilize. Reset signals are asserted and then released. Configuration registers are loaded. Calibration routines execute. Communication links synchronize. Between "power applied" and "fully operational," the device passes through a series of intermediate states, each with its own rules about what's valid, what's stable, and what can be trusted.

This temporal structure is as important as the spatial structure of subsystems and interfaces. A device whose subsystems are perfectly designed can still fail if they start in the wrong order, if resets aren't coordinated, or if one subsystem begins operating before another has stabilized. The sequencing, bring-up, and reset architecture defines the path from "off" to "running" — and errors on that path produce some of the most difficult failures to diagnose, because the device appears to work (once it's running) and fails only during the transition.

## Power Sequencing

Most devices with multiple supply rails require those rails to come up in a specific order. The sequencing requirements originate from the ICs' internal structure:

**Core before I/O.** Many processors and FPGAs require the core supply (the lowest voltage, powering internal logic) to be established before the I/O supply (the higher voltage, powering the interface buffers). If the I/O supply comes up first, the I/O buffer transistors can forward-bias the ESD protection diodes connected to the unpowered core, injecting current into the core supply through the substrate. This can cause latch-up — a parasitic thyristor turns on and creates a low-impedance path between supply and ground that persists until power is removed.

**Analog before digital.** In mixed-signal devices, the analog supply often needs to be stable before the digital supply activates. If digital switching begins before the analog supply has reached its operating point, the switching transients can couple into the analog circuitry during its most vulnerable period — before bias points have settled and before internal references have stabilized.

**Reference before regulated.** A voltage regulator that depends on an external reference cannot regulate until the reference is stable. If the regulator is enabled before the reference has settled, the output voltage during the settling period is unpredictable — it may overshoot, undershoot, or oscillate, subjecting downstream subsystems to voltage transients outside their rated range.

Power sequencing is typically managed by dedicated sequencing ICs, enable pins with RC delay networks, or power management ICs (PMICs) with built-in sequencing logic. The sequencing specification is part of the device's design — it defines the temporal contract for power-up and must be honored every time the device starts.

## Reset Domains

A device may have multiple reset domains — groups of subsystems that can be reset independently. A common architecture includes:

**Power-on reset (POR).** Detects when the supply voltage has reached a stable level and releases the reset signal, allowing the device to begin initializing. POR circuits have a threshold voltage and a delay — the supply must exceed the threshold for longer than the delay before reset is released. The threshold and delay are designed to ensure that the supply is stable and that internal circuits have had time to reach their operating points.

**External reset.** A dedicated reset input that allows an external supervisor or controller to reset the device. This is typically used for system-level reset coordination — ensuring that all devices in a system reset together and restart in a known state.

**Watchdog reset.** An internally or externally generated reset triggered by failure to service a watchdog timer. This reset assumes that if the processor hasn't executed its watchdog service routine within the timeout period, it has lost control and should be restarted.

**Domain-specific reset.** In complex devices, individual subsystems may have their own reset signals. A communication peripheral may be reset without resetting the entire processor. A USB controller may be reset when a bus error is detected. These domain-specific resets allow targeted recovery without disrupting the entire device.

The challenge with multiple reset domains is coordination: after a domain-specific reset, the reset subsystem must re-synchronize with the subsystems that weren't reset. If the reset subsystem was in the middle of a transaction with another subsystem, the non-reset subsystem may be left in an inconsistent state — waiting for a response that will never come, holding a bus lock that will never be released, or expecting data in a format that the re-initialized subsystem no longer speaks.

## Bring-Up Sequence

The bring-up sequence is the ordered series of steps between "reset released" and "fully operational." It's largely a firmware concern, but it has deep hardware implications because each step changes the device's electrical behavior:

**Clock initialization.** The processor starts on an internal oscillator (often slow and imprecise) and then switches to the intended clock source — an external crystal, a PLL, or an external clock signal. Until the clock switch is complete, the device runs at a different speed than its steady-state operation. Peripherals that depend on clock frequency for their timing (UARTs, SPI masters, timers) produce incorrect timing until the clock is configured.

**Pin configuration.** At reset, I/O pins are typically in a default state — often high-impedance inputs. The bring-up firmware configures each pin for its intended function: output, input, alternate function (UART, SPI, PWM), analog input. Until configuration is complete, pins may float, creating indeterminate states on buses and enabling spurious outputs. Downstream devices connected to these pins see undefined signals during this period.

**Peripheral initialization.** Each peripheral subsystem (ADC, DAC, communication interface, timer) must be configured before use — clock enabled, mode set, interrupts configured, DMA channels assigned. The initialization order matters: peripherals that generate interrupts or DMA requests should generally be initialized after the interrupt controller and DMA engine are configured. Otherwise, a peripheral may request service before the handler is ready, causing an unhandled exception or a missed event.

**Calibration and startup routines.** Some subsystems require calibration after power-up: ADCs may run an internal offset calibration, PLLs must acquire lock, communication receivers must synchronize with their transmitters. These routines take time — microseconds for fast analog calibrations, milliseconds for PLL lock, seconds for some communication link training sequences. The device is not fully operational until all calibrations are complete.

## Timing Windows and Vulnerabilities

The transition from "off" to "running" passes through several vulnerability windows — periods during which the device is more susceptible to interference, misconfiguration, or damage than during steady-state operation:

**The floating-pin window.** Between power-up and pin configuration, I/O pins are in their default state. If the default state is high-impedance, external pull-up or pull-down resistors determine the pin's level. If no external pull is present, the pin floats, and its level depends on parasitic coupling, leakage current, and noise. A floating output driving a downstream device can cause that device to operate erratically during the window.

**The unconfigured-peripheral window.** Between reset release and peripheral initialization, internal peripherals are in their default (usually disabled) state. A peripheral that was active before a reset — a PWM output driving a motor, a DAC output setting a bias voltage — goes to its default state during reset and stays there until firmware re-initializes it. The downstream hardware sees a step change from the operating value to the default value.

**The clock-transition window.** Switching clock sources creates a brief discontinuity — a glitch, a stretched period, or a pause — that can affect peripherals that are already running. If a UART is transmitting during a clock switch, the baud rate changes mid-byte, corrupting the transmission.

**The PLL-lock window.** A PLL-based clock source is not valid until the PLL has acquired lock. If the system attempts to use PLL-derived clocks before lock is achieved, the clock frequency and phase are unpredictable. Some PLLs have a "lock detect" output; using it to gate downstream clock enables prevents operation during this window.

## Tips

- Treat power sequencing as a safety specification, not a performance specification. Violating sequencing requirements can damage hardware through latch-up or overstress. Verify sequencing with an oscilloscope during the design verification phase — capture all supply rails and reset signals simultaneously during power-up to confirm the actual sequence matches the intended sequence.
- Design bring-up firmware to be tolerant of partially initialized state. If an interrupt fires before its handler is fully configured, the system should handle it gracefully (typically by ignoring it) rather than crashing. If a peripheral reports data before calibration is complete, the data should be discarded, not processed.
- For devices that must maintain operation through brownouts (brief supply dips), verify that the reset and POR thresholds are set correctly to distinguish between a brownout (which should be ridden through) and a genuine power loss (which requires a full restart). Hysteresis between the reset-entry and reset-exit thresholds prevents chattering during slow voltage transitions.
- When debugging a startup issue, capture the first 100 ms after power application with a fast enough sample rate to see the relevant transitions. Many startup failures happen in the first few milliseconds and are invisible during normal observation because the system reaches steady state before measurement begins.

## Caveats

- **"Works every time on the bench" doesn't mean the sequencing is correct** — A bench power supply may ramp faster or slower than the production supply, a debugger connection may hold the processor in reset during power-up, or the ambient temperature may keep all components within a narrow range. The sequencing margin that exists on the bench may not exist in the field.
- **Reset doesn't restore all state** — A reset typically initializes digital registers to their default values, but it doesn't discharge capacitors, doesn't reset analog bias points instantly, and doesn't clear the charge trapped in ESD protection structures. The state after a reset is not the same as the state after a power cycle. Some failures can be cleared by a power cycle but not by a reset.
- **Power-down sequencing matters too** — When power is removed, supply rails decay at rates determined by their load current and output capacitance. If rails decay in the wrong order, the same latch-up and overstress risks that apply during power-up apply during power-down. Active discharge circuits on supply rails ensure controlled power-down sequencing.
- **Watchdog resets can mask design flaws** — A watchdog that periodically resets a hung system provides availability (the system recovers) at the cost of visibility (the hang occurs because of a design flaw that's never diagnosed). If a system requires its watchdog to fire more than rarely, the root cause of the hangs should be investigated.

## Bench Relevance

- **A device that starts correctly on some power-up cycles but not others** often shows up when the power sequencing has marginal timing — the delay between supplies is close to the minimum required by the IC, and variation in the supply ramp rate or regulator enable timing pushes some cycles across the boundary between correct and incorrect sequencing.
- **A peripheral that produces wrong output values or timing immediately after power-up but works correctly after re-initialization** commonly appears when the bring-up firmware initializes subsystems in an order that doesn't account for dependencies — a peripheral begins operating before its clock source, reference, or configuration is fully established.
- **A system that recovers from a reset command but hangs after a brief power glitch** is frequently showing a reset-domain coordination issue — the power glitch resets some subsystems but not others, leaving the non-reset subsystems in states that are incompatible with the re-initialized subsystems.
- **A motor or actuator that twitches during power-up** often indicates that the motor driver's output pins are in an undefined state during the bring-up window — the driver IC's outputs float or default to a state that briefly activates the motor before firmware configures the pins to their correct quiescent state.
