---
title: "Components & Patterns"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Components & Patterns

A quick reference to components and patterns commonly encountered in digital circuit design, emphasizing timing, edges, logic levels, and power integrity. Key parameters include propagation delay, setup/hold times, and voltage thresholds.

## Passive Components

**Resistor**
Sets pull-up/pull-down strength and limits current through LEDs and protection networks. Power rating rarely matters in logic circuits; tolerance affects voltage divider accuracy in threshold-setting applications. Pull-up/pull-down values are a trade-off between power consumption (lower resistance = more current) and transition speed (lower resistance = faster edges). Series resistors on signal lines can dampen ringing and reflections — typically 22–50 Ω at the source. Termination resistors match transmission line impedance to prevent reflections on long traces.

**Capacitor**
Decoupling, filtering, and timing. Ceramic types dominate — X5R/X7R for bulk decoupling (0.1–10 µF typical), C0G for precision timing where capacitance must not vary with voltage or temperature. ESR and ESL matter for high-speed power integrity — low-ESL packages (0402, reverse geometry) improve high-frequency performance. Multiple smaller capacitors often outperform a single large one for decoupling because of lower effective inductance. Capacitor placement directly affects effectiveness — place as close as possible to IC power pins with short, low-inductance connections to ground.

## Active Components

**MOSFET**
Used as a level shifter, power switch, or load switch. Key parameters are Vth, RDS(on), and gate charge. Logic-level threshold MOSFETs switch fully on with 3.3 V gate drive; standard threshold types need higher voltage and are unsuitable for direct MCU control. Gate charge determines switching speed when driven from a limited-current source — total charge divided by drive current gives switching time. For load switching, consider inrush current to capacitive loads and use soft-start or current limiting when needed. Body diode conducts when drain goes negative relative to source.

## Timing & Clock

**Crystal/resonator**
Precision frequency-determining element. Key parameters are frequency, load capacitance, ESR, and temperature stability (ppm/°C). Wrong load capacitance shifts frequency or prevents startup entirely — use the crystal's specified load capacitance and calculate external capacitors accordingly. Crystals provide best stability and accuracy but require external capacitors; ceramic resonators are cheaper and integrate more easily but have looser tolerance (0.5% vs. 0.005%). High-ESR crystals may not start reliably with high-ESR or low-gain oscillator circuits. Temperature coefficient causes frequency drift — ±25 ppm from -40°C to +85°C is typical for AT-cut crystals.

**Crystal oscillator circuit**
Crystal combined with inverter gate (Pierce topology) and load capacitors. Key parameters are frequency accuracy, startup time, and phase noise. Load capacitors must match the crystal's specified load capacitance — the formula accounts for both external capacitors and stray capacitance. Excessive drive level can damage crystals over time (activity dipping); limiting resistors protect against this. Some MCUs have internal load capacitors or programmable drive strength. Oscillator startup can take milliseconds — watch for code that executes before the oscillator is stable.

**Clock distribution**
Takes a single clock source and distributes it to multiple destinations with controlled skew and jitter. Key parameters are output frequency, jitter (additive and total), skew between outputs, and output format (LVCMOS, LVDS, LVPECL, HCSL). At high frequencies, trace length matching and impedance control matter as much as the buffer IC — a mismatch of 6 inches (150 mm) is about 1 ns of skew. Fanout buffers and clock synthesis PLLs serve different purposes — fanout buffers replicate a clock, PLLs generate new frequencies. Point-to-point LVDS distribution reduces EMI and improves noise immunity.

## Power & Integrity

**Decoupling/bypass network**
Capacitors near IC power pins providing local charge storage and suppressing high-frequency noise. Place as close as possible to power/ground pins — trace inductance between capacitor and IC degrades effectiveness, and every nanohenry matters at high frequencies. Use multiple values in parallel to cover a wide frequency range — 100 nF ceramic for mid-frequency, larger ceramics or tantalum for bulk charge storage, smaller ceramics for GHz-range noise. Via inductance also matters — multiple vias to the ground plane reduce effective inductance. Route high-frequency switching currents locally rather than through long power traces.

**Reset/supervisor**
Monitors supply voltage and asserts reset when below threshold. Key parameters are threshold voltage, reset delay (hold time after voltage stabilizes), and output polarity (active-low is most common). Prevents the processor from executing random instructions during power-up, brown-out, or supply glitches. Choose threshold voltage slightly above the MCU's minimum operating voltage. Some supervisors include watchdog timers or manual reset inputs. Reset glitch filtering prevents short supply transients from causing unnecessary resets. Simple RC reset circuits are unreliable — use dedicated supervisor ICs.

## Interfaces & Glue

**Level shifter**
Translates signals between voltage domains (e.g., 3.3 V to 5 V). MOSFET-based bidirectional shifters work for I2C and other open-drain protocols but may not handle fast SPI clocks — the pull-up resistor and line capacitance limit edge rates. Resistor dividers are unidirectional (high-to-low only) and waste power but are simple and fast. Active level shifters with dedicated ICs handle high-speed bidirectional translation but add cost and board space. Direction-sensing auto-level-shifters work for bidirectional signals but have speed and current limitations.

**Logic gate**
Elementary combinational logic (AND, OR, NOT, XOR) in a specific logic family (74HC, 74LVC, 74AHC, etc.). Key parameters are propagation delay, voltage thresholds, and fanout. Discrete gates are increasingly rare in new designs but remain essential for level translation, glue logic, and prototyping. Logic family selection affects speed, power, and voltage compatibility — 74LVC operates from 1.65 V to 5.5 V with 5 V tolerant inputs, making it versatile for mixed-voltage systems. Unused inputs must be tied to valid logic levels to prevent oscillation and excessive power consumption.

**Connector**
Mechanical-electrical interface. Key parameters are pin count, current rating, mating cycles, and contact resistance. Intermittent connector failures are among the most common and frustrating bench problems — symptoms include resets, data corruption, and power glitches that appear random. Gold-plated contacts resist corrosion but cost more; tin-plated contacts are cheaper but can develop intermetallic compounds over time. Polarization prevents reverse insertion. Locking mechanisms prevent accidental disconnection in high-vibration environments. Contact wiping during insertion helps maintain clean connections.

## Protection

**ESD/TVS clamp**
Transient voltage suppressor protecting external interfaces. Key parameters are standoff voltage (maximum continuous operating voltage), clamping voltage (voltage during surge), peak current, and capacitance (which matters for high-speed data lines). Select standoff voltage above normal signal voltage but below the protected device's maximum rating. Low-capacitance parts (sub-picofarad) are essential for USB, HDMI, and other high-speed interfaces where added capacitance degrades signal integrity. Response time matters for protecting fast logic — TVS diodes respond in nanoseconds, while varistors are slower.

## Communication Interfaces

**UART/serial**
Asynchronous serial communication with start/stop framing. Key parameters are baud rate, voltage levels (3.3 V TTL, 5 V TTL, RS-232), and flow control (hardware RTS/CTS or software XON/XOFF). Both ends must agree on baud rate within a few percent — clock mismatch is the most common cause of garbled data. Standard baud rates (9600, 115200) work reliably; non-standard rates require careful clock selection and may not work with all USB-serial adapters. RS-232 uses ±12 V signaling and needs level translation to interface with 3.3/5 V logic. Debug UART is often the first interface brought up when developing new hardware.

**SPI**
Synchronous serial bus with separate clock, data, and chip-select. Key parameters are clock frequency, clock mode (CPOL/CPHA), and chip-select polarity. The four possible clock mode combinations (modes 0-3) are a constant source of confusion — mode mismatch produces garbage that looks almost valid. Most devices use mode 0 (idle low, sample on rising edge) or mode 3 (idle high, sample on rising edge). SPI supports much higher frequencies than I2C (tens of MHz) but requires more pins. Multi-device buses share clock and data lines but need separate chip-select for each device. Some devices require delays between chip-select assertion and first clock edge.

**I2C**
Two-wire synchronous serial bus with multi-device addressing. Key parameters are clock speed (100/400/1000 kHz standard modes, plus high-speed and ultra-fast modes) and bus capacitance (limited to 400 pF in standard spec). Long traces and many devices slow rising edges beyond spec — the pull-up must charge the bus capacitance, and excessive capacitance prevents meeting timing requirements. Solutions include reducing pull-up resistance (limited by sink current, typically 3 mA), reducing device count, using bus buffers, or running at lower speed. Address conflicts occur when two devices have the same address — some devices have configurable addresses via pins or registers.

## Common Patterns

**Pull-up/pull-down network**
Holds signal lines at defined logic levels when undriven. Key parameters are resistance (trade-off between power consumption and transition speed) and bus capacitance. Too strong (low resistance) wastes power and may exceed open-drain sink current limits; too weak (high resistance) causes slow edges and noise susceptibility. Typical values: 4.7 kΩ for I2C (can go lower for higher speed or longer buses), 10 kΩ for general pull-ups where speed isn't critical. Consider current during the logic-low state — 3.3 V across 4.7 kΩ draws 0.7 mA per line, which adds up with many open-drain signals.

## Development Boards & Modules

**MCU development board**
MCU plus power regulation, programming interface, and pin headers. Key parameters are MCU family, peripheral set, clock options, and development environment support. The dev board is for prototyping — production uses a custom board with only needed peripherals. Common examples include Arduino (AVR/ARM ecosystem), STM32 Nucleo (ARM Cortex), and ESP32 DevKit (WiFi/BLE). Built-in debugger/programmer simplifies development; some boards require external programmers. Watch for differences between dev board voltage (often 5 V USB) and MCU native voltage (often 3.3 V).

**FPGA development board**
FPGA plus power sequencing, configuration flash, clock sources, and I/O headers. Key parameters are FPGA size (logic elements, RAM blocks, DSP slices), I/O standards supported, and onboard memory/peripherals. Power sequencing is handled by the board but matters when debugging startup issues — incorrect sequence can cause latch-up or configuration failure. Configuration typically loads from flash at power-up or can be loaded via JTAG during development. Popular boards include Digilent Arty (Xilinx), Terasic DE-series (Intel/Altera), and Lattice iCE40 boards. Synthesis, place-and-route, and timing closure are new concepts for those coming from software or MCU backgrounds.

**Logic level converter module**
Bidirectional level shifter on a breakout board, typically MOSFET-based. Speed is the common limitation — cheap modules work for I2C (up to 400 kHz typically) but may not handle fast SPI or other high-frequency signals. Check the module's maximum operating frequency before using with fast protocols. Some modules are unidirectional despite marketing claims. Long wires to the module add capacitance that further limits speed. For high-speed or production use, design the level shifter directly onto the PCB.

## System Patterns

**Multi-rail power distribution system**
Generates, sequences, and distributes multiple voltage rails (e.g., 1.2 V core, 1.8 V I/O, 3.3 V peripherals). Key parameters are rail voltages, sequencing order, sequencing timing, and fault response. Load transients on one rail can couple into others through shared input capacitance, PCB impedance, or regulator cross-regulation. FPGAs and complex SoCs often have strict sequencing requirements — violating them risks latch-up or damage. Hot-swap and fault protection become important in rack-mounted or field-replaceable systems. Power tree analysis helps identify bottlenecks and worst-case current paths.
