---
title: "Watchdogs & Recovery"
weight: 30
---

# Watchdogs & Recovery

Embedded systems are expected to keep running. A desktop application that hangs gets killed by the user. A microcontroller buried in a sensor node, a motor controller, or a piece of industrial equipment has no user -- if firmware hangs, the system is dead until someone power-cycles it. The watchdog timer exists to solve this: it is a hardware countdown that resets the MCU if firmware fails to check in periodically. But the watchdog is only the starting point. Real reliability requires thinking about what happens after the reset, how to diagnose the failure, and how to prevent the same crash from recurring.

## The Watchdog Concept

A watchdog timer is a free-running hardware counter that counts toward a timeout. Firmware must periodically reset the counter (called "kicking," "feeding," or "refreshing" the watchdog) before it expires. If firmware stops kicking -- because it crashed, entered an infinite loop, or deadlocked waiting for a resource -- the counter expires and forces a hardware reset.

The watchdog is deliberately simple. It does not know what firmware is supposed to be doing; it only knows whether firmware checked in on time. This simplicity is its strength: the watchdog runs on its own oscillator, independently of the system clock and CPU state. Even if the main oscillator fails or the CPU enters an unexpected state, the watchdog still counts and still resets the system.

Choosing the timeout period involves a tradeoff. Too short, and normal firmware execution paths that take longer than expected (a slow I2C transaction, a flash erase) will trigger a false reset. Too long, and the system sits in a crashed state for an unacceptable duration before recovering. I typically start with a 1-2 second timeout and adjust based on the worst-case execution time of the main loop.

## Independent vs Windowed Watchdog

Most MCU families offer two types of watchdog, and they catch different failure modes.

### Independent Watchdog (IWDG)

The IWDG runs from a dedicated low-speed oscillator (often the LSI, around 32-40 kHz). It is completely independent of the system clock -- if the main clock fails, the IWDG still runs. Configuration is simple: set the prescaler and reload value, enable it, and kick it before it expires. On many parts, once enabled, the IWDG cannot be disabled except by reset. This is intentional -- firmware that could disable the watchdog could also hang after disabling it.

### Windowed Watchdog (WWDG)

The WWDG adds a constraint: the kick must happen within a specific time window. Kicking too early (before the window opens) triggers a reset, and kicking too late (after the counter expires) also triggers a reset. This catches a failure mode that the IWDG misses: runaway firmware that spins through the main loop too fast, kicking the IWDG at every iteration but not actually doing useful work.

The WWDG typically runs from the system clock (APB1 on STM32), so it is not independent of the main oscillator. Using both IWDG and WWDG together provides complementary coverage: the IWDG catches hangs and clock failure, while the WWDG catches timing violations.

## Watchdog Placement

Where you kick the watchdog in your code determines what the watchdog actually proves. This is the most common mistake I see in watchdog implementation: kicking it from the wrong place.

**Bad: kicking from a timer ISR.** A timer ISR runs on a hardware interrupt, independent of the main loop. If the main loop hangs but interrupts are still enabled, the timer ISR keeps kicking the watchdog, and the watchdog never fires. The system is hung, but the watchdog thinks everything is fine.

**Better: kicking from the main loop.** This proves the main loop is running. But if the main loop is a simple `while(1)` that calls several subsystems, kicking at the top of the loop only proves the loop iterates -- not that each subsystem completed successfully.

**Best: kicking after all critical tasks verify completion.** Each subsystem sets a flag when it completes its work within the expected time. The watchdog is kicked only if all flags are set. This proves that every critical path actually executed. It is more effort to implement but catches partial hangs where one task is stuck but the loop still runs.

## Reset and Recovery

When the watchdog fires, the MCU resets. What happens next determines whether the system recovers or enters a crash loop.

The reset cause register (see {{< relref "power-up-and-reset" >}}) will show a watchdog reset. Firmware should read this register at startup, before anything clears it, and take appropriate action:

- **Log the event** -- Write a watchdog reset counter to non-volatile storage (EEPROM, backup registers, or a dedicated flash sector). This creates a history that is invaluable for field diagnosis
- **Decide how to recover** -- A single watchdog reset might be a transient event (EMI spike, marginal timing). Restart normally. But if the watchdog reset counter shows five resets in the last minute, the system is in a crash loop. At that point, more sophisticated recovery is needed: skip the initialization step that is probably causing the hang, enter a diagnostic mode, or revert to a known-good firmware image

Blind restart without checking the reset cause is the default behavior in most projects, and it hides recurring problems. A system that watchdog-resets once a day for months appears to work -- until someone notices the data gaps or the missed control actions.

## Safe State Design

When firmware cannot be trusted, the system must not depend on firmware to be safe. This is the principle of hardware-level safe state: the system's physical outputs must go to a known, non-destructive configuration even if the CPU is crashed or in reset.

Examples of safe state design:

- **Motor drives** -- The enable pin for the motor driver is held inactive by a pull-down resistor. Firmware must actively drive it high to enable the motor. If the MCU resets, the pin goes high-impedance, the pull-down pulls it low, and the motor stops
- **Heater control** -- The relay or SSR controlling a heating element is normally open. A crashed MCU cannot leave the heater on because the relay de-energizes when the drive signal drops
- **Watchdog output** -- Some external watchdog ICs have an output pin that directly controls a system enable signal. If the watchdog expires, it disables the output stage independently of the MCU

The key insight is that safe state is a hardware design decision, not a firmware decision. Firmware that tries to "clean up" during a crash is unreliable by definition -- the crash may have corrupted the very code that does the cleanup.

## Field Failure Patterns

Failures in deployed embedded systems are qualitatively different from bench bugs. They are intermittent, environment-dependent, and impossible to reproduce on demand. Common patterns:

- **Marginal power supply** -- A supply that droops under load, causing intermittent brownout resets. The system works on the bench (light load) but resets in the field (full load, temperature extremes). The watchdog reset counter climbs slowly over weeks
- **EMI-induced faults** -- A nearby motor, relay, or switching supply injects noise that corrupts a bus transaction or flips a bit in SRAM. The symptom is a hard fault or watchdog reset with no obvious firmware cause. See {{< relref "/docs/measurement/noise-interference-grounding" >}} for measurement approaches
- **Temperature-dependent timing** -- An oscillator that drifts out of tolerance at temperature extremes, causing a communication peripheral to fail. UART baud rate errors above 3% cause framing errors; I2C timing violations cause NACKs
- **State accumulation bugs** -- A memory leak, a counter that eventually overflows, or a resource that is acquired but never released. The system runs for days or weeks before the accumulated state triggers a fault. These are the hardest bugs to find because they do not reproduce on short test runs

Diagnosing field failures requires instrumentation: persistent logging to non-volatile memory, watchdog reset counters, periodic snapshots of key variables, and ideally some way to retrieve diagnostic data remotely.

## Defensive Firmware

Beyond the watchdog, firmware can be written to tolerate and contain faults rather than propagating them:

- **Bounds checking** -- Validate array indices before use. An out-of-bounds write corrupts memory silently; a bounds check catches it immediately
- **Configuration validation** -- After reading settings from flash or EEPROM, verify them with a CRC or magic number. Corrupt configuration data (from a failed write, a power loss, or flash wear) can make firmware behave in bizarre ways
- **Timeout on all blocking waits** -- Never wait forever for a peripheral to respond, a flag to be set, or a bus transaction to complete. Every wait should have a timeout that triggers error handling rather than hanging. This is the single most effective defense against firmware hangs
- **Assertion macros** -- Check preconditions and invariants at runtime. When an assertion fails, log the location and reset rather than continuing with corrupt state. In production firmware, assertions should log and reset, not halt (unlike desktop development where halting in a debugger is useful)

## Over-the-Air Updates and Bootloaders

Field-deployed systems need a way to update firmware without physical access. This requires a bootloader: a small, separate program stored in a protected region of flash that can receive, validate, and install new firmware images.

The critical requirement is that a failed update must not brick the device. Strategies:

- **Dual-bank flash** -- The MCU has two flash banks, each capable of holding a complete firmware image. The bootloader writes the new image to the inactive bank, validates it (CRC, signature), and switches the boot target. If the new image fails to run (watchdog reset during first boot), the bootloader reverts to the previous bank
- **Golden image** -- A minimal, known-good firmware image is stored in a protected flash region. If the main firmware is corrupt or crashes repeatedly, the bootloader falls back to the golden image, which provides at least basic functionality and the ability to receive another update
- **CRC and signature verification** -- The bootloader checks the integrity (CRC32) and authenticity (cryptographic signature) of the firmware image before marking it as bootable. Flashing a truncated, corrupted, or unauthorized image is rejected before it can run

A botched firmware update that bricks a device in the field is worse than the bug the update was supposed to fix. The bootloader must be the most reliable piece of code in the system, and it should be as small and simple as possible to minimize the chance of bugs in the bootloader itself. I have seen projects where the bootloader was more complex than the application -- and sure enough, a bootloader bug eventually bricked devices in the field.

## Gotchas

- **Kicking the watchdog from a timer ISR defeats its purpose** -- The ISR runs independently of the main loop. If the main loop hangs but interrupts are still serviced, the watchdog never fires. Always kick from the main loop, conditional on actual work being completed.
- **The IWDG cannot be disabled once enabled on most parts** -- This is by design, but it means you must kick the watchdog throughout all code paths, including bootloader mode, firmware update, and long flash erase operations. Missing a kick during a 2-second flash sector erase is a common trap.
- **A watchdog reset without logging hides recurring failures** -- If firmware does not check the reset cause register and count watchdog resets, a system that crashes and restarts once a day appears to work. Persistent logging turns invisible failures into diagnosable events.
- **Safe state requires hardware design, not firmware** -- Relying on firmware to drive outputs to safe values during a crash is unreliable. Pull resistors, normally-open relays, and hardware enable interlocks provide safety that does not depend on CPU execution.
- **Dual-bank bootloaders need a rollback trigger** -- Writing a new image to the inactive bank is not enough. The bootloader must detect that the new image failed (e.g., watchdog reset on first boot) and revert automatically. Without automatic rollback, a broken update bricks the device just as effectively as a single-bank approach.
