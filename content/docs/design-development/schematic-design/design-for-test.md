---
title: "Design for Test"
weight: 40
---

# Design for Test

If you can't measure it, you can't debug it. This is one of those statements that sounds obvious until you're staring at a board with a misbehaving power supply and no way to probe the switching node because it's buried under a shielding can with no test point. Design for test (DFT) means building measurement access and debug features into the circuit from the very beginning — when adding a test point costs nothing — rather than desperately soldering wires to 0402 pads during bring-up.

## Test Points: The Cheapest Debug Tool

A test point is a deliberate, accessible connection to a net that you might need to measure. It can be a dedicated test point component (a simple loop or pad), an oversized via, or even just a spot on a trace where a probe can make contact. The cost is essentially zero in the schematic and near-zero on the PCB. The value during debug is immeasurable.

Where to place test points:

- **Every power rail.** Every distinct voltage in the system should have a test point. Not just VCC and ground — the intermediate rails, the analog supply, the I/O voltage, the reference voltage. During bring-up, the first thing you verify is that every rail is at the right voltage. Without test points, this requires probing component leads or IC pins, which is difficult on fine-pitch packages and risks damage.
- **Key signals in the signal path.** The input and output of each major functional block. If the system has an analog front end feeding an ADC, you want test points at the sensor output, the amplifier output, and the ADC input. When something doesn't work, you need to isolate which block is failing.
- **Clock signals.** A missing or incorrect clock is one of the most common bring-up failures, and it's instantly diagnosable with a scope probe on a test point. Put test points on oscillator outputs, PLL outputs, and any divided or distributed clocks.
- **Reset and enable signals.** If the processor isn't running, the first thing to check is whether it's being held in reset. A test point on the reset line saves minutes of probing.
- **Debug outputs.** Many microcontrollers can be configured to output internal signals (timer outputs, PWM, clock dividers) on GPIO pins. Routing these to test points gives you visibility into firmware behavior without a debugger connection.

A practical guideline I've adopted: when in doubt, add a test point. You can always leave it unpopulated in production, but you can't add one to a fabricated board without rework.

## LED Indicators

LEDs are the simplest, cheapest, and most immediately useful debug tools you can put on a board. During bring-up, before any software is running, before any communication interface is established, an LED tells you whether power is present.

**Power-good LEDs.** One LED per major power rail, driven through an appropriate current-limiting resistor. When you power up a new board, the first thing you want to see is all power LEDs lit. A missing LED immediately tells you which rail has a problem. The cost is a few cents per rail. On a board with 3.3V, 5V, and 1.8V rails, that's three LEDs and three resistors — trivial cost for enormous bring-up value.

**Status LEDs.** Connected to microcontroller GPIO pins, these give immediate visual feedback that firmware is running. The classic "heartbeat" LED — toggling at 1 Hz — is the single most useful firmware debug indicator. If the heartbeat is running, you know the processor is alive, the clock is working, and the main loop is executing. If it stops, something has crashed.

**Communication activity LEDs.** TX and RX LEDs on serial ports, activity LEDs on Ethernet or CAN interfaces. These tell you at a glance whether data is flowing, even before you've connected a protocol analyzer.

The argument against LEDs is power consumption and board space. In ultra-low-power designs, the 2-10 mA an LED draws might be significant. In those cases, use jumper-selectable LEDs or populate them only on development boards. But for most designs, the few milliamps are negligible, and the debug value is enormous.

## Headers and Breakout Points

Debug interfaces need physical connectors. It's tempting to leave out the JTAG header on a production board to save space, but when the firmware has a hard fault that only appears in the field, you'll wish you had it.

**JTAG/SWD debug headers.** For ARM-based designs, a standard 10-pin Cortex Debug connector (1.27mm pitch) is small enough to fit on most boards. Even if you remove it for production, including the pads and routing the signals means you can solder a header for debug. Tag-Connect provides pogo-pin connectors that need only pads, no through-hole header — an excellent compromise between access and board space.

**UART debug ports.** A serial console is the most universal debug interface. Route the MCU's UART TX and RX to a header or test points. During bring-up, a serial console gives you printf-style debugging before any other interface is working. Even systems that don't use UART in normal operation benefit from having a debug UART available.

**I2C/SPI bus access.** If your design uses I2C or SPI sensors or peripherals, breaking out the bus to a header lets you use a logic analyzer or protocol analyzer to observe traffic. It also lets you inject test commands using a bus master tool, which is invaluable for verifying peripheral configuration.

## Current Sense Resistors

Understanding power consumption per rail is critical during development and production test. A small sense resistor (10-100 milliohms) in series with each power rail lets you measure current by measuring the voltage drop across it.

During development, you can place your meter probes across the sense resistor to monitor current in real time. This reveals firmware power states (sleep vs active), identifies unexpected current draw, and helps optimize power consumption.

For production test, the same sense resistors enable automated current measurement as part of a functional test. If the board draws 150 mA when it should draw 100 mA, something is wrong — and the test catches it before the product ships.

The sense resistor value is a tradeoff: too large and it drops excessive voltage (affecting the rail it's measuring); too small and the voltage drop is in the noise floor of your measurement instrument. For a 3.3V rail drawing 100 mA, a 100 milliohm resistor drops 10 mV (0.3% of the rail voltage, negligible) and is easily measurable with a multimeter.

## Pad-Out Components

"Pad-out" or "option" components are places in the circuit where a zero-ohm resistor or solder jumper can be replaced with a different component to change the circuit's behavior. This builds flexibility into the hardware for testing, tuning, and future modifications.

Common pad-out applications:

- **Series resistors in signal paths** that are normally zero-ohm but can be replaced with a filter resistor, ferrite bead, or removed entirely to isolate sections.
- **Alternate feedback resistors** for adjustable voltage regulators, allowing the output voltage to be changed by swapping one component.
- **Optional filter components** (RC low-pass on signal inputs) that can be populated if noise turns out to be a problem or left as zero-ohm if not needed.
- **Configuration resistors** for ICs that use pin-strapping to set addresses or modes. Using resistor pads instead of hard-wiring to power or ground lets you reconfigure without a board change.

The idea is to anticipate places where you might need to make changes and provide a way to make them without cutting traces or adding bodge wires. It takes experience to know where to put these options, but a few general principles apply: put them at boundaries between functional blocks, at interfaces where impedance matching might need adjustment, and at any configuration point that might change between hardware revisions.

## Testability vs Cost in Production

Development boards and production boards have different test needs. During development, maximum observability is the priority — test points everywhere, LEDs on every rail, debug headers on every bus. In production, the goal shifts to minimum-cost testing that catches manufacturing defects.

Production test typically uses a bed-of-nails fixture that contacts test pads on the PCB. The test program applies power, verifies voltages, checks continuity, and runs a basic functional test. For this to work, the board needs accessible test pads at strategic locations, placed on a regular grid where possible to simplify fixture design.

Boundary scan (JTAG) is another production test approach that verifies digital IC connections without physical probing. It requires ICs that support the JTAG boundary scan standard (IEEE 1149.1), which includes most modern FPGAs, processors, and some peripheral ICs. Boundary scan can test solder joint integrity by toggling and reading I/O pins through the JTAG chain — detecting opens, shorts, and stuck-at faults.

The schematic decision: include the test infrastructure in the design and manage what gets populated. Development boards get all test points, LEDs, and headers populated. Production boards get test pads but may omit LEDs and debug connectors to save cost and space.

## Gotchas

- **Test points on high-speed signals add capacitance.** A test point pad adds a few picofarads of parasitic capacitance, which can affect signal integrity on multi-gigabit or RF signals. For these, use minimal-pad test points or accept that you'll only probe during debug.
- **Ground test points are as important as signal test points.** A scope probe needs a ground reference near the signal. Without a nearby ground test point, you're forced to use long ground leads that add inductance and pick up noise, corrupting the measurement. Place ground test points adjacent to signal test points.
- **LEDs can mask power problems.** An LED on a power rail draws current and can keep a marginal regulator in regulation during development, then fail in production when the LED is removed and the minimum load isn't met. Verify that the regulator is stable without the LED load.
- **Debug headers are attack surfaces.** In security-sensitive applications, exposed JTAG and UART ports are entry points for reverse engineering or firmware extraction. Consider disabling debug access in production firmware or using connectors that can be physically removed after programming.
- **Test point placement on the PCB matters as much as their existence.** A test point buried under a daughter board or heatsink is useless. Coordinate with the layout engineer to ensure test points are physically accessible with standard probes.
