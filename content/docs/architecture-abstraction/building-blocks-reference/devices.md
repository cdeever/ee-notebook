---
title: "Devices"
weight: 40
---

# Devices

Devices are self-contained products or modules with defined external interfaces — things that come in enclosures, have connectors, and are documented as units. At this level, reasoning concerns capabilities, operating modes, interface compatibility, and integration constraints rather than internal circuit details. A bench power supply is evaluated by its output specs, not its internal regulator topology. A development board is evaluated by its peripherals, connectors, and software support, not by the individual ICs on the PCB.

Devices are where domain context matters most. A bench power supply is a measurement/test device. An MCU dev board is an embedded development device. The entries here reflect the kinds of devices encountered on a learning bench — instruments, development platforms, and interface modules. Production devices (phones, appliances, vehicles) operate at this same level but aren't cataloged here because the notebook focuses on learning and bench work.

## Bench Instruments

**Bench power supply.** A regulated DC source with adjustable voltage and current limits, typically with a display showing actual output V and I. Key parameters are voltage range, current capacity, number of channels, ripple/noise, and transient response. Appears in every bench setup. Composes from AC-DC conversion, linear or switching regulation, current limiting, and metering subsystems; serves as the power source inside test setups. The current limit is a protection feature, not a current source — behavior in current-limit mode varies by design and can surprise during inrush or capacitive loading.

**Oscilloscope.** A voltage-vs-time measurement instrument that captures and displays waveforms. Key parameters are bandwidth, sample rate, memory depth, number of channels, and trigger capabilities. Appears in every bench setup. Composes from probe interface, ADC front end, timebase, trigger system, and display/analysis subsystems; appears inside every test and debug system. Bandwidth means the -3 dB point — a 100 MHz scope shows a 100 MHz signal at 70.7% of its true amplitude. For accurate amplitude measurement, the signal frequency should be no more than ~1/3 to 1/5 of the scope's bandwidth.

**DMM (digital multimeter).** A general-purpose measurement instrument for voltage, current, resistance, and often continuity, diode test, capacitance, and frequency. Key parameters are accuracy (typically expressed as ±% of reading + counts), input impedance, measurement ranges, and safety rating (CAT). Appears in every bench setup. Composes from input protection, range selection, ADC, and display subsystems. The input impedance on the voltage range (typically 10 MΩ) matters when measuring high-impedance circuits — it forms a voltage divider with the source impedance and can load the circuit enough to change the reading.

**Signal/function generator.** A source that produces defined waveforms (sine, square, triangle, arbitrary) at specified frequencies and amplitudes. Key parameters are frequency range, amplitude range, output impedance (typically 50 Ω), waveform fidelity (THD for sine, rise time for square), and modulation capabilities. Appears in analog, RF, and audio test setups. Composes from a DDS (direct digital synthesis) engine, DAC, output amplifier, and output filter subsystems. The 50 Ω output impedance means the actual voltage at the DUT depends on the load — into a high-impedance load, the voltage is double the displayed value if the generator is calibrated for 50 Ω termination.

**Logic analyzer.** A digital acquisition instrument that captures many channels of logic-level signals simultaneously, with protocol decoding. Key parameters are channel count, sample rate (or state clock rate), memory depth, threshold voltage settings, and supported protocol decoders. Appears in digital and embedded debug setups. Composes from input comparators, high-speed sampling, deep memory, and protocol decode engines. More useful than an oscilloscope for understanding bus transactions (SPI, I2C, UART), but shows only logic levels — if the problem is analog (slow edges, ringing, crosstalk), a scope is still needed.

## Development and Evaluation

**MCU development board.** A PCB built around a microcontroller, providing power regulation, programming/debug interface, pin headers, and typically USB connectivity. Key parameters are the MCU family, available peripherals (ADC, timers, communication interfaces), I/O count, development environment support, and onboard features (LEDs, buttons, sensors). Appears in embedded development and prototyping. Composes from the MCU, power regulation, debug interface (SWD/JTAG), clock source, and connector subsystems. The dev board is a device for learning and prototyping; in production, the MCU gets designed into a custom board with only the needed peripherals.

**FPGA development board.** A PCB built around an FPGA, providing power, configuration interface, clock sources, I/O headers, and often memory (SRAM, DDR) and communication interfaces. Key parameters are FPGA family and size (logic cells, block RAM, DSP slices), I/O standard support, onboard peripherals, and toolchain compatibility. Appears in digital design, signal processing, and hardware prototyping. Composes from the FPGA, power sequencing, configuration flash, clock distribution, and I/O subsystems. FPGA dev boards often require careful power sequencing — the board handles this internally, but understanding the sequence matters when debugging startup issues.

**Sensor module / breakout board.** A small PCB carrying a sensor IC plus minimal support circuitry (decoupling, pull-ups, voltage regulation), with pin headers for easy prototyping. Key parameters are the sensor type and specs, communication interface (I2C, SPI, analog), supply voltage range, and pinout. Appears in embedded prototyping and data acquisition. Composes from the sensor IC, decoupling, and sometimes a level shifter or regulator. Convenient for prototyping, but the module's layout and grounding may not match what a production design needs — performance measured on a breakout board may not transfer directly to a custom PCB.

## Interface

**USB-to-serial adapter.** A device that bridges between a USB host port and a TTL-level or RS-232 UART, providing a virtual COM port. Key parameters are supported baud rates, voltage levels (3.3 V or 5 V TTL, or RS-232), driver support, and flow control capability. Appears in embedded development, debug, and instrument communication. Composes from a USB-to-UART bridge IC (FTDI, CP2102, CH340), USB connector, and level-shifting circuitry. The most-used device on many embedded benches. Driver issues (especially on macOS and Linux with cheap CH340 clones) remain a common frustration.

**Logic level converter module.** A bidirectional level shifter on a small breakout board, typically MOSFET-based, for connecting circuits at different logic voltages (e.g., 3.3 V to 5 V). Key parameters are voltage range on each side, number of channels, directionality (bidirectional or unidirectional), and maximum speed. Appears in embedded prototyping wherever mixed-voltage systems need to communicate. Composes from level-shifting MOSFETs and pull-up resistors. Speed is the common limitation — cheap MOSFET-based bidirectional shifters work for I2C at 100–400 kHz but may not handle fast SPI clocks cleanly.

## Power

**AC-DC power supply (external).** A wall adapter or enclosed supply that converts mains AC to a regulated DC output. Key parameters are output voltage, current rating, efficiency, ripple, safety certifications, and connector type. Appears in every bench and product application that runs from mains power. Composes from EMI filter, rectifier, switching converter, isolation transformer, and output regulation subsystems. The safety certifications (UL, CE) are the most important specs for anything connected to mains — building a mains-connected supply from scratch requires knowledge of isolation, creepage/clearance distances, and safety standards.

**Battery pack / holder.** A mechanical and electrical assembly that holds one or more cells and provides connection to the circuit. Key parameters are chemistry, cell count/configuration (series/parallel), capacity, voltage range, and protection (built-in BMS or external). Appears in portable and field-deployed applications. Composes from cells, mechanical holder or spot-welded connections, and sometimes an integrated protection circuit. The distinction between a battery holder (mechanical, passive) and a battery pack (cells plus protection BMS) matters for safety — unprotected lithium cells require external protection circuitry.

## Tips

- Device-level reasoning focuses on interface compatibility: voltage levels, communication protocols, mechanical fit, and power requirements. Internal details only matter when the device isn't meeting its spec.
- For bench instruments, understand the measurement limitations (bandwidth, input impedance, sample rate) before trusting the readings. The instrument is part of the measurement system, and its limitations affect the result.
- Development boards are learning tools, not production references. The schematic and layout choices made for a dev board (generous decoupling, wide traces, test points everywhere) often differ from what a cost-optimized production design would use.

## Caveats

- The line between a device and a subsystem depends on perspective. An oscilloscope is a device to the person using it; internally, it contains dozens of subsystems. A power supply module soldered onto a larger board might be treated as a subsystem in that context and a device when evaluated standalone.
- "Device" in this catalog means something encountered and used during bench work, not a formal product category. The emphasis is on devices a learner interacts with directly.
- Device specs often assume specific operating conditions (ambient temperature, load, input voltage). Real-world performance degrades at the edges of those conditions, and the derating curves in the datasheet (if they exist) are the guide to how much.
