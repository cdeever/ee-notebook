---
title: "Dev Boards & Modules as POC Tools"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Dev Boards & Modules as POC Tools

Before designing a custom circuit around a component, it is almost always worth testing that component on a pre-built board first. Development boards, evaluation boards, and breakout modules make it possible to verify that a sensor, MCU, communication link, or power stage actually does what the datasheet claims — without investing time in schematic capture, layout, and fabrication.

## Types of Pre-Built Boards

**MCU development boards** — Arduino Uno, STM32 Nucleo, ESP32 DevKit, Raspberry Pi Pico, Teensy, and dozens more. These provide a working microcontroller with power regulation, a programming interface, and broken-out GPIO. These are the fastest way to test firmware, peripheral interfaces, and I/O behavior.

What a dev board reveals:
- Whether the MCU's peripherals (ADC, SPI, I2C, timers, DMA) meet the application requirements
- How much flash, RAM, and CPU bandwidth the firmware actually needs
- Whether the toolchain and debugging experience are acceptable
- Power consumption in different operating modes

What a dev board cannot reveal: whether a custom PCB's power supply, clock circuit, and decoupling will work. The dev board handles all of that internally — and its design may be more conservative (or more optimized) than the final custom design.

**Sensor breakout boards** — from SparkFun, Adafruit, Pololu, DFRobot, and others. These mount a sensor IC on a small PCB with the required support circuitry (voltage regulators, level shifters, pull-up resistors, decoupling) and break out the interface pins to a header.

What a breakout board reveals:
- Whether the sensor's sensitivity, range, resolution, and noise floor meet requirements
- How the sensor behaves in the actual target environment (not the datasheet's idealized test setup)
- Whether the communication interface works cleanly with the chosen MCU

The trap: **breakout boards include hidden support circuitry that makes the sensor look better than it will on a custom board.** A sensor breakout might include a low-noise LDO, careful ground plane design, and optimized decoupling that the custom design must replicate. Reading the breakout board's schematic (most open-source boards publish it) reveals what is doing the heavy lifting.

**Power supply modules** — Pololu regulators, MeanWell converters, LM2596-based buck modules. These provide regulated power, freeing attention for the signal-processing or control portions of the design.

Useful for:
- Powering a breadboard or dead-bug prototype from a bench supply or battery
- Testing load behavior without designing a custom supply
- Evaluating whether a particular topology (buck, boost, LDO) meets noise and ripple requirements

**RF modules** — LoRa (RFM95/96), Bluetooth (HC-05, nRF52840), WiFi (ESP32), GPS (u-blox NEO), Zigbee, Sub-GHz. These encapsulate the hardest-to-design portion of an RF system: the radio front end, matching network, and often the antenna.

Using a module instead of designing a custom RF front end:
- Saves months of design time and thousands of dollars in test equipment
- Provides FCC/CE certification in many cases (the module is pre-certified)
- Limits flexibility (fixed frequency, fixed power, module's antenna characteristics)
- Costs more per unit than a custom design at volume

For proof-of-concept work, RF modules are almost always the right choice. The custom RF design question is a production decision.

## Evaluating Results Honestly

The point of a POC is to get honest answers, which means understanding the gap between the eval board environment and the eventual custom design:

| What the eval board provides | What the custom design must provide |
|------------------------------|--------------------------------------|
| Clean, well-regulated power | The custom power supply (which may be noisier) |
| Optimized PCB layout | The custom layout (which has other constraints) |
| Known-good support components | The chosen components (which may differ) |
| Controlled test environment | The actual operating environment |
| Reference firmware | The application firmware |

When a sensor or IC works on the eval board, it means the component is *capable* of meeting the requirement. It does not guarantee that the final implementation will achieve the same performance. The eval board sets an upper bound.

When a sensor or IC *doesn't* work on the eval board, the answer is much clearer — if it cannot meet the requirement under ideal conditions, it will not meet it under real-world conditions either. Failed eval board tests are more conclusive than successful ones.

## Module vs Custom: The Production Decision

Using modules in a POC does not commit the project to using them in production. But it is worth noting that many successful products ship with modules rather than custom RF, power, or sensor circuits:

**Favor modules when:**
- Production volume is low (under 1,000 units)
- Time-to-market matters more than per-unit cost
- The module provides certification (FCC, CE) that custom design would require
- The design team lacks domain expertise (RF design, power supply design)

**Favor custom design when:**
- Volume justifies the engineering investment
- The module's size, power consumption, or performance does not meet requirements
- Cost reduction per unit exceeds the design cost amortized over volume
- Full control over the design is necessary for regulatory or reliability reasons

This decision does not need to be made at the POC stage. The POC answers "can this work?" — the module-vs-custom question is for [system architecture]({{< relref "../system-architecture" >}}) and [part selection]({{< relref "../part-selection-and-sourcing" >}}).

## Building Effective POC Setups

A dev board plugged into a breadboard with a sensor breakout wired to it is a legitimate proof-of-concept. To get the most from it:

- **Power it properly.** Use a bench supply with current limiting, not just USB power. Monitor the current draw — it reveals something about the power budget.
- **Instrument it.** Connect a scope probe to critical signals. Log data over serial or to an SD card. The more data captured, the more useful the POC.
- **Test at the edges.** Do not just verify that the circuit works at nominal conditions. What happens at minimum supply voltage? Maximum temperature? Maximum input signal? Edge cases reveal margins.
- **Document the setup.** A photo, a wiring list, and a summary of results. When revisiting this in two weeks to inform the architecture, it helps to remember what was tested and what was found.

## Tips

- Always read the eval board or breakout board schematic before drawing conclusions — the support circuitry (LDOs, decoupling, ground planes) may be doing more work than the component itself
- Instrument the POC setup with scope probes and data logging from the start; captured data is far more useful than remembered impressions
- Test at boundary conditions (minimum voltage, maximum load, temperature extremes) rather than just nominal — edge cases reveal design margins
- Treat failed eval board tests as conclusive negative results; if a component cannot meet the spec under ideal conditions, it will not meet it on a custom board

## Caveats

- **Eval board schematics may not match the latest silicon.** IC manufacturers update eval boards less frequently than silicon revisions — check the errata and compare the eval board design to the current datasheet recommendations
- **Breakout boards sometimes have design errors.** Open-source hardware boards are community-reviewed but not infallible — if results seem wrong, check the schematic against the datasheet
- **Dev board pin mappings are confusing.** Arduino pin numbers do not match the MCU's actual pin numbers; STM32 Nucleo boards have multiple naming schemes (Arduino headers, Morpho headers, MCU pins) — always verify which physical pin is actually in use
- **Module datasheets overstate performance.** Range claims for RF modules are often best-case (line of sight, optimal antenna, no interference) — test in the actual target environment to get realistic numbers
- **Library code hides important details.** Arduino libraries and vendor HALs abstract away peripheral configuration; when moving to a custom design, it may be necessary to understand what the library was doing — clock configuration, DMA setup, interrupt priorities — and replicate it explicitly
