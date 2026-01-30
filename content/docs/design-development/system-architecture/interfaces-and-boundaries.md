---
title: "Interfaces & Boundaries"
weight: 30
---

# Interfaces & Boundaries

The interface between blocks is where most design problems live. Two blocks can be individually well-designed and still fail when connected because the interface between them wasn't properly defined. Impedance mismatches, voltage level conflicts, timing violations, and ground reference differences all hide at block boundaries, and they're much harder to debug than problems within a single block.

## Why Interfaces Deserve Special Attention

Inside a block, the designer controls everything. The power supply, the ground reference, the signal levels, the timing — all are determined by the design of that block. At the interface between blocks, two sets of design assumptions meet, and they don't always agree.

Common interface problems:

- **Voltage level mismatch.** One block outputs 5V logic, the other expects 3.3V inputs. Without level translation, inputs are overstressed or outputs can't drive the load.
- **Impedance mismatch.** A high-impedance sensor output connected to a low-impedance load loses signal level. An RF line with a mismatched termination creates reflections.
- **Timing mismatch.** Block A sends data on the rising edge; block B samples on the falling edge. The interface "works" with short traces but fails with longer ones where propagation delay matters.
- **Ground reference mismatch.** Two blocks with different ground potentials see each other's signals shifted by the ground difference. In severe cases, this can damage input protection diodes or cause logic errors.

Each of these is invisible within a single block and only appears at the boundary. This is why interface definition is an architectural activity, not a schematic detail.

## Defining Interfaces

A well-defined interface specifies enough information that either block can be designed independently. The other block is a black box whose behavior at the interface is completely described.

Key interface parameters:

| Parameter | What it specifies | Example |
|---|---|---|
| Signal levels | Voltage range and logic thresholds | 0-3.3V CMOS, low < 0.8V, high > 2.0V |
| Impedance | Source and load impedance | 50 ohm source, 1 Mohm load |
| Timing | Setup time, hold time, clock relationship | Data valid 10 ns before rising clock edge |
| Protocol | Communication standard | SPI Mode 0, 1 MHz clock, MSB first |
| Power | Voltage, current, ripple | 3.3V +/- 5%, 50 mA max, < 10 mV ripple |
| Physical | Connector type, pinout, cable length | 10-pin 0.1" header, signal assignment per ICD |
| Direction | Input, output, or bidirectional | MCU drives MOSI; sensor drives MISO |
| Protection | ESD, overcurrent, overvoltage | TVS to 5V on all external signals |

This might seem like overkill for a personal project, but even an informal version — a few notes on expected signal levels, impedances, and protocols — catches mismatches before they become hardware bugs.

## Analog-to-Digital Boundaries

The analog-to-digital boundary is the most sensitive interface in many designs. It's where continuous-time, continuous-amplitude signals meet the discrete world of sampling and quantization. Getting this boundary wrong degrades the entire measurement chain.

**ADC placement.** The ADC is the physical location of the analog-to-digital boundary. It should be placed at the transition between the analog and digital zones on the PCB, with its analog inputs routed from the analog side and its digital outputs routed to the digital side. Placing the ADC deep in the digital zone means analog signals must route through noisy territory to reach it.

**Anti-aliasing filter.** Signals must be bandwidth-limited before sampling. The anti-aliasing filter is a hardware requirement (see [When Software Beats Hardware]({{< relref "/docs/design-development/ideation-and-requirements/when-software-beats-hardware" >}})) that lives on the analog side of the boundary. Its cutoff frequency is determined by the sample rate and the required stopband attenuation.

**Reference voltage.** The ADC's reference determines its full-scale range and accuracy. The reference must be clean — noise on the reference appears as noise in the conversion. Reference routing should stay in the analog domain, away from digital switching.

**Ground connection.** Most ADCs have separate analog and digital ground pins. These should connect at a single point, usually directly at the ADC. This is the bridge between analog and digital ground domains discussed in [Partitioning Analog, Digital, Power & RF]({{< relref "/docs/design-development/system-architecture/partitioning" >}}).

## Power Domain Crossings

When signals cross between different power domains, level translation is necessary:

| Situation | Solution | Notes |
|---|---|---|
| 3.3V to 5V digital | Level translator IC (e.g., TXB0108) | Bidirectional translators available but can have drive strength issues |
| 5V to 3.3V digital | Resistor divider or level translator | Simple divider works for slow signals; translator for fast ones |
| Galvanic isolation | Optocoupler or digital isolator | Required when ground references are not shared |
| Mixed-voltage I2C | I2C level translator with voltage isolation | I2C is open-drain; requires specific translator topology |

Power domain crossings also involve sequencing considerations. If block A runs at 3.3V and block B at 1.8V, and block A powers up before block B, block A's outputs may drive block B's inputs before B's supply has reached its operating voltage. Clamping diodes in block B may try to power the chip through the I/O pins, which can cause latch-up or damage.

Power sequencing requirements should be part of the interface definition: which domain powers up first, what state outputs should be during power-up, and whether enable signals are needed.

## Mechanical Interfaces

Interfaces aren't only electrical. Mechanical interfaces — connectors, mounting points, thermal paths — are equally important and equally prone to problems:

- **Connector selection.** A connector defines the mechanical and electrical interface simultaneously. Pitch, pin count, current rating, mating force, retention mechanism, and cost all factor in. The connector also sets the minimum distance between boards or between the board and the enclosure.
- **Mounting.** How a board is mounted in an enclosure affects vibration resistance, thermal conduction, and access for test and debug. Mounting holes are interface features that require coordination between electrical and mechanical design.
- **Thermal paths.** If a component needs to dissipate heat through the PCB to a heatsink or enclosure, the thermal path is an interface between the electrical design and the mechanical design. Thermal vias, pad area, and interface material all affect thermal resistance.
- **Cable length.** The cable between two boards is part of the interface. Its length affects signal integrity (capacitance, inductance, crosstalk), EMC (antenna effect), and mechanical routing within the enclosure.

## The Value of Clean Interfaces

Clean interfaces — well-defined, well-documented, and minimal — provide a powerful benefit: blocks can be redesigned independently. If the interface between the analog front-end and the digital processing is defined by a specific ADC protocol, voltage range, and update rate, then either side can be changed without affecting the other.

This matters for:

- **Debugging.** You can test each block independently by injecting known signals at the interface and measuring the output. A well-defined interface is a natural test point.
- **Iteration.** When revision 2 improves the analog front-end, the digital processing doesn't change — the interface contract is the same.
- **Reuse.** A block with a clean interface can be reused in a different project. A block that's tightly coupled to the rest of the system can't be separated.
- **Collaboration.** If two people are working on the project, clean interfaces let them work independently on their respective blocks.

## Interface Control Documents

In professional engineering, Interface Control Documents (ICDs) formally define every parameter of every interface. For personal projects, that level of formality isn't necessary, but the concept scales down well.

An informal ICD might be:

- A table in a project notebook listing each interface, its signals, voltage levels, and protocols
- Annotations on the block diagram specifying key interface parameters
- Comments in the schematic at block boundaries describing the expected signal characteristics

The format doesn't matter. What matters is that the information exists somewhere other than your memory. Future you, debugging a problem at 11 PM, will be grateful for a note that says "this SPI bus runs at 1 MHz, Mode 0, 3.3V logic, active-low chip select."

## Gotchas

- **"It's all on one board" doesn't mean there are no interfaces.** The boundary between the analog section and the digital section is an interface even if it's on the same PCB. It needs the same attention to level matching, impedance, and ground management.
- **Bidirectional interfaces are harder than unidirectional ones.** An SPI bus with separate MOSI and MISO lines is easier to reason about than an I2C bus with a shared bidirectional data line. Bidirectional level translators add complexity and potential failure modes.
- **Don't forget the power-up state.** What does the interface look like before the system is fully initialized? Floating outputs, undefined states, and contention during startup cause glitches that can confuse downstream blocks or, in worst cases, cause hardware damage.
- **Cable interfaces pick up noise.** Any cable between boards is an antenna for EMI. Long cables between analog and digital sections are especially problematic. Use differential signaling, shielding, or filters at cable entry points.
- **The interface spec should include fault conditions.** What happens if one side of the interface loses power? What if a signal is shorted to ground? Including fault behavior in the interface definition prevents one block's failure from damaging the other.
- **Test access is an interface.** Test points, debug headers, and programming connectors are interfaces between the design and the test equipment. They need to be defined in the architecture, not added as an afterthought in layout.
