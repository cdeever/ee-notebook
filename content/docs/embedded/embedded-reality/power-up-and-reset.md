---
title: "Power-Up & Reset"
weight: 10
---

# Power-Up & Reset

Before firmware has control, the hardware has to get itself into a state where code can run. This takes microseconds to milliseconds, but more can go wrong in that interval than in the entire application. Supply voltages ramp, oscillators start, reset circuits release, and peripherals wake up on their own timelines. If any of these steps happen out of order or too slowly, the system fails in ways that are difficult to reproduce and harder to diagnose.

## The Power-On Sequence

When power is applied, VCC ramps from 0V toward the operating voltage. The rate of that ramp depends on the power supply design, the load, and the decoupling capacitors on the board. During this ramp, the MCU is in an undefined state -- internal logic is not functional, registers contain garbage, and the oscillators are not running.

The power-on reset (POR) circuit is a simple analog comparator inside the MCU. It holds the internal reset signal active until VCC crosses a threshold (typically around 1.7-2.0V for a 3.3V part, but check the datasheet). Only after VCC is above the POR threshold and has been stable for a specified time does the POR release and allow the CPU to begin executing from the reset vector.

The ramp rate matters. Most datasheets specify a minimum VCC rise rate -- often 100 mV/ms or faster. If VCC rises too slowly (a common scenario with large bulk capacitors or soft-start regulators), the POR circuit may not trigger reliably. The MCU can come out of reset with internal state partially initialized, leading to behavior that looks like a firmware bug but is actually a power supply problem.

There is also a POR release delay -- a short hold-off time after VCC crosses the threshold, typically a few microseconds to tens of microseconds. This allows internal voltage regulators and references to stabilize. The datasheet specifies this as t_RST or t_POR. During this time, the CPU is still held in reset even though VCC is stable.

On some parts, the POR threshold has significant hysteresis -- the release voltage is higher than the assertion voltage. This prevents the MCU from cycling in and out of reset if VCC hovers near the threshold. The hysteresis is typically 100-200 mV, but it varies by family.

## Brownout Detection

The brownout detector (BOD, or BOR on some parts) is a separate comparator that monitors VCC during operation. If VCC sags below a configured threshold -- due to a supply dropout, a heavy load transient, or a failing battery -- the BOD asserts a reset.

Without brownout detection, the consequences are ugly. As VCC drops, flash reads become unreliable first (the charge threshold for reading a 1 vs. 0 shifts), then SRAM, then the CPU logic itself. The MCU does not stop executing; it executes corrupt instructions from misread flash. This can do real damage: writing garbage to EEPROM, driving outputs to incorrect states, or corrupting external peripherals over SPI or I2C. I have seen a system without BOD enabled corrupt its own configuration data during a power sag -- it took weeks to trace.

Most MCUs allow the BOD threshold to be configured in option bytes or fuse bits. Set it as high as practical for your supply voltage. The tradeoff is that a higher threshold makes the system more sensitive to supply noise, so the power supply needs to be clean.

Some MCUs offer multiple BOD threshold levels (e.g., STM32 BOR levels 0 through 4, ranging from about 1.7V to 2.7V for a 3.3V part). Others provide a single fixed threshold that is either enabled or disabled. On parts where the BOD is configured via fuse bits or option bytes, the setting is non-volatile -- it persists across power cycles and firmware reflashes. This is worth verifying on new hardware: a chip with BOD disabled at the factory will stay that way until explicitly configured.

## Supply Voltage Ramp and Stability

The datasheet's POR specification assumes VCC rises monotonically and reaches the operating voltage within a defined time. Real power supplies do not always cooperate:

- **Soft-start circuits** in switching regulators deliberately slow the ramp to limit inrush current. This can violate the MCU's minimum ramp rate
- **Decoupling capacitors** near the MCU's VCC pins slow the local ramp and smooth out noise, which is generally good -- but very large capacitors can make the ramp too slow
- **Non-monotonic ramps** happen when a supply overshoots and rings, or when a load draws heavy current during startup. If VCC crosses the POR threshold, drops below it, and rises again, some POR circuits handle this correctly and some do not

The safest approach is to measure the actual VCC ramp on your board with an oscilloscope and verify it meets the datasheet requirements. I have been surprised by how often the measured ramp differs from what the schematic implies. If the ramp is too slow, options include reducing bulk capacitance near the MCU, using a faster power supply, or adding an external reset supervisor that holds the MCU in reset until VCC is genuinely stable regardless of ramp rate. See {{< relref "/docs/measurement/power-rails-supplies" >}} for practical measurement techniques.

## Startup Races

Even after the MCU's POR releases, external peripherals may not be ready. Sensors, flash memory chips, displays, and communication modules have their own startup times -- ranging from a few milliseconds (a SPI flash) to hundreds of milliseconds (some OLED displays or GPS modules).

Firmware that immediately tries to communicate with a peripheral that has not finished its own initialization will get NACK on I2C, garbage on SPI, or no response at all. This is a startup race: the MCU is ready before the peripheral is. The fix is straightforward but easy to forget -- add explicit startup delays or poll the peripheral's status register until it reports ready. Hardcoding delay values is fragile; polling with a timeout is more robust.

Startup races are particularly common in designs where the MCU and peripherals share a power rail. Both begin their power-up sequence simultaneously, but the MCU's POR is typically faster than a sensor's internal initialization. The datasheet for each external device specifies its power-up time, but I have found these numbers are sometimes optimistic -- adding a margin of 20-50% is cheap insurance.

The order in which peripherals are powered also matters. If a sensor is on a switched power rail that firmware must enable, the sensor's startup time begins when the rail is turned on, not when the MCU resets. See {{< relref "/docs/embedded/firmware-structure/startup-and-initialization" >}} for the initialization sequence from firmware's perspective.

## Multi-Rail Sequencing

Many MCUs have separate power pins for digital core (VDD), I/O (VDDIO), and analog (VDDA). The datasheet typically specifies a required power-up order -- often VDD first, then VDDIO, then VDDA. Violating the sequence can forward-bias internal ESD protection diodes, injecting current into unpowered domains. At best, this causes excessive startup current. At worst, it triggers latch-up: a parasitic thyristor structure turns on and shorts the supply rail, potentially damaging the chip.

On boards where all rails come from the same regulator, sequencing is usually automatic (the lowest-voltage rail stabilizes first). On boards with multiple regulators, sequencing must be explicitly designed using enable pins, supervisory ICs, or sequencing controllers. This is a hardware design concern, but firmware engineers need to know about it because the symptoms -- random failures on some boards but not others, chips that draw excessive current -- look like firmware problems.

A related issue: applying a logic-high signal to an I/O pin when the MCU's VDD is unpowered can also forward-bias ESD diodes and inject current into the core supply through the pin. This happens when an external device powers up before the MCU, or when a level shifter holds a line high before the MCU's supply is stable. The absolute maximum ratings section of the datasheet usually specifies the maximum voltage allowed on I/O pins relative to VDD -- often VDD + 0.3V or less.

## External Reset Circuits

The MCU's internal POR is minimal by design. For systems with external peripherals that need time to initialize, or where the power supply ramp is marginal, an external reset circuit provides a longer, more controlled reset.

The simplest external reset is an RC circuit on the reset pin -- a resistor to VCC and a capacitor to ground. The capacitor holds the reset pin low while it charges, releasing the MCU only after a delay determined by the RC time constant. This is cheap and adequate for simple systems, though RC circuits have drawbacks: the release voltage is not precise (it depends on component tolerances), and the circuit does not re-assert reset if VCC sags after startup.

An RC reset also interacts with the MCU's internal reset pin filter. Most MCUs require the reset pin to be held low for a minimum duration (often several microseconds) to register as a valid reset. An RC circuit with a very small time constant might release too quickly for the MCU to recognize the reset properly.

For more demanding applications, a dedicated supervisor IC (TPS3839, MAX809, STM6315, and many others) monitors VCC and holds the reset pin active until VCC has been above a defined threshold for a guaranteed time. These ICs provide a precise threshold, a clean output edge (no bounce), and a defined delay. They cost pennies and eliminate an entire class of startup problems.

When choosing an external supervisor, match its threshold to the MCU's minimum operating voltage (with margin), and select a reset delay that exceeds the longest peripheral startup time in the system. A supervisor with a 100 ms delay is common for systems with slow peripherals. Also note that the supervisor's output must be compatible with the MCU's reset pin -- most MCUs use an active-low NRST with an internal pull-up, and the supervisor drives it low during reset.

## Reset Cause Identification

Most MCUs provide a register (often called RCC_CSR, RSTSR, or similar) that records the reason for the last reset. Common flags include:

- **Power-on reset** -- first power-up
- **Brownout reset** -- VCC dropped below the BOD threshold
- **Watchdog reset** -- the watchdog timer expired
- **Software reset** -- firmware requested a reset via the AIRCR register
- **External pin reset** -- the NRST pin was asserted

Reading this register early in startup (before clearing it) is essential for diagnostics. A system that repeatedly brownout-resets has a power supply problem. A system that watchdog-resets has a firmware hang. A system that alternates between software reset and watchdog reset may be stuck in a crash-recover loop. See {{< relref "watchdogs-and-recovery" >}} for what to do with this information.

On some MCUs, multiple reset cause flags can be set simultaneously (e.g., both POR and brownout on an initial power-up). The firmware should check flags in priority order and clear them after reading. Some HAL libraries clear the register automatically during their initialization, which means application code that checks the cause later sees nothing -- another reason to read it as early as possible, ideally in the first few lines of main().

## The First Few Microseconds

Between POR release and the first line of `main()`, the world is partially initialized. The CPU is running on the internal RC oscillator -- typically 8 MHz and not very accurate. The external crystal is not running yet. No peripherals are configured. The startup code copies `.data`, zeroes `.bss`, and calls `SystemInit()`, all on the internal clock.

This means that any time-sensitive operation in early startup (like configuring a UART for debug output) will run at the internal oscillator frequency, not the final system clock. Baud rate calculations based on the final clock will be wrong until the PLL is configured and switched in. I keep a mental note: nothing time-accurate happens until the clock tree is fully configured.

The internal RC oscillator is also only roughly calibrated from the factory -- typically within 1-2% at room temperature, but accuracy degrades at temperature extremes. For protocols with tight timing requirements (like UART, where baud rate error above 3% causes framing errors), the internal oscillator may not be reliable enough even temporarily. This is another reason to bring up the external crystal and PLL early in the initialization sequence.

## Gotchas

- **Slow VCC ramp defeats the internal POR** -- If the supply ramp rate is below the datasheet minimum, the POR may release before VCC is stable, causing the MCU to start executing in an undefined state. An external supervisor IC fixes this reliably.
- **Missing brownout detection lets the MCU execute corrupt instructions** -- Without BOD enabled, a VCC sag causes the MCU to misread flash and execute garbage rather than resetting cleanly. Always enable BOD and set the threshold appropriately for your supply voltage.
- **Talking to a peripheral before it is ready produces garbage or bus errors** -- External devices have their own startup times that are independent of the MCU's reset. Firmware must wait for peripherals to report ready or insert a sufficient delay before communicating.
- **Power sequencing violations can cause latch-up** -- Applying voltage to I/O pins before the MCU's core supply is stable can trigger latch-up through ESD protection diodes. This can draw destructive current and is not always recoverable without a full power cycle.
- **The reset cause register must be read before clearing** -- Some startup code or HAL libraries clear the reset status register during initialization. If your application code checks it after that point, the information is already gone. Read and save the reset cause as early as possible in startup.
- **First-line-of-main is not first-line-of-execution** -- The startup code and SystemInit() run before main(). Bugs in these routines -- wrong flash wait states, invalid clock configuration -- cause failures that appear to happen before your code, because they do.
