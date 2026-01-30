---
title: "Switches, Attenuators & Couplers"
weight: 60
---

# Switches, Attenuators & Couplers

Between the amplifiers, mixers, and filters in an RF signal chain are the routing and signal-conditioning components: switches that direct signals between paths, attenuators that reduce signal levels, and couplers that sample a fraction of the signal for measurement or feedback. These components seem simple but their RF-specific behaviors — insertion loss, isolation, power handling, and impedance match — have real consequences for system performance.

## RF Switches

An RF switch routes signals between two or more paths. Common applications include transmit/receive (T/R) switching, band selection, and test multiplexing.

### Switch Technologies

| Technology | Frequency Range | Insertion Loss | Isolation | Switching Speed | Power Handling |
|-----------|----------------|----------------|-----------|-----------------|----------------|
| PIN diode | DC - 40+ GHz | 0.3-1.5 dB | 30-60 dB | 1-100 us | High (watts) |
| GaAs FET | DC - 30 GHz | 0.3-2 dB | 20-50 dB | 1-50 ns | Moderate |
| SOI CMOS | DC - 6 GHz | 0.3-1.5 dB | 20-40 dB | 10-100 ns | Moderate |
| MEMS | DC - 40+ GHz | 0.1-0.5 dB | 40-60+ dB | 5-100 us | Low-Moderate |

**PIN diode switches** use the variable resistance of a PIN diode (high impedance when reverse-biased, low impedance when forward-biased) to open or close a signal path. They offer wide bandwidth, good power handling, and moderate switching speed. The main disadvantage is that they require DC bias current in the on state (typically 5-20 mA), so they consume power continuously.

**GaAs FET switches** use the channel resistance of a field-effect transistor. They switch faster than PIN diodes and do not require continuous DC current, but they have lower power handling (limited by the FET's compression) and produce harmonics when operating near their power limit.

**SOI CMOS switches** are integrated on silicon-on-insulator processes. They are compact, inexpensive, and integrate easily with digital control logic. They dominate in consumer electronics (WiFi, cellular) where cost and integration matter more than ultimate performance.

**MEMS (Micro-Electro-Mechanical Systems) switches** are tiny mechanical contacts actuated by electrostatic force. They have the lowest insertion loss and highest isolation of any switch technology, but switching speed is slow (microseconds), power handling is limited, and reliability over many switching cycles is a concern.

### Key Switch Specifications

**Insertion loss:** The signal loss through the switch when it is on. Every dB of switch insertion loss in a receiver's signal path before the LNA degrades noise figure. In a transmitter, it wastes power.

**Isolation:** The attenuation between the input and output when the switch is off. If you are switching between transmit and receive, isolation determines how much transmit power leaks into the receiver during transmit. For a +20 dBm transmitter and a -100 dBm receive sensitivity, you need at least 120 dB of isolation — more than any single switch provides. Multiple switches in series, combined with physical separation and filtering, are needed.

**Switching speed:** The time between the control signal transition and the RF path being settled. Matters for time-division systems (TDD) where transmit and receive alternate rapidly.

**Power handling (P1dB):** The input power at which the switch's insertion loss increases by 1 dB. Operating a switch above P1dB creates harmonics and intermodulation.

## Attenuators

Attenuators reduce signal level by a precise amount while maintaining the system impedance (usually 50 ohms). They are used for level adjustment, isolation improvement, and preventing amplifier stages from being overdriven.

### Fixed Attenuators

Built from precision resistors in a pi or T network. Standard values: 1, 2, 3, 6, 10, 20, 30 dB. Available as SMD components, inline coaxial pads, or PCB footprints.

**Pi attenuator** (two shunt resistors, one series): symmetric, easy to design, good return loss. The resistor values for a 50-ohm pi attenuator:

| Attenuation | Series R (ohms) | Shunt R (ohms) |
|------------|-----------------|----------------|
| 1 dB | 5.8 | 870 |
| 3 dB | 17.6 | 292 |
| 6 dB | 37.4 | 150.5 |
| 10 dB | 71.2 | 96.2 |
| 20 dB | 247.5 | 61.1 |

**T attenuator** (two series resistors, one shunt): also symmetric, similar performance to pi. Preferred in some layouts where the series element is easier to place.

### Variable Attenuators

**Digital step attenuators** use a series of switchable attenuation sections (e.g., 0.5, 1, 2, 4, 8, 16 dB) controlled by digital logic. They provide precise, repeatable attenuation settings. Common in automatic gain control (AGC) loops and test equipment.

**Voltage-variable attenuators** use a PIN diode or FET whose attenuation is controlled by a DC voltage. They provide continuous attenuation adjustment but with less precision than digital step attenuators. Useful for fast AGC loops.

### Attenuator Applications

**Improving return loss:** A 3-6 dB attenuator between an amplifier and a poorly matched load improves the effective return loss seen by the amplifier by twice the attenuation value (6-12 dB improvement for 3-6 dB pad). This can stabilize an amplifier that is conditionally stable.

**Setting drive levels:** Placing an attenuator before a mixer sets the RF input level to the optimal range for the mixer's linearity specification.

**Protecting sensitive inputs:** A 10-20 dB pad before a spectrum analyzer or receiver prevents accidental overdrive from strong signals.

## Directional Couplers

A directional coupler samples a small fraction of signal power from a transmission line without significantly disturbing the main signal path. They are essential for monitoring transmitted power, providing feedback for power control loops, and making measurements on live signals.

### How Couplers Work

A directional coupler has four ports: input, output (through), coupled, and isolated. A signal entering the input port passes to the output port with minimal loss. A fraction of the signal power is diverted to the coupled port. The isolated port receives very little signal (ideally none).

**Coupling factor:** The ratio of input power to coupled power, in dB. A 10 dB coupler diverts 10% of the power (1/10) to the coupled port. A 20 dB coupler diverts 1% (1/100). Common values: 6, 10, 20, 30 dB.

**Directivity:** The ratio of coupled port power to isolated port power, in dB. Measures how well the coupler distinguishes between forward and reverse signals. Higher directivity means better measurement accuracy. Typical values: 15-25 dB for stripline couplers, 10-15 dB for microstrip.

**Insertion loss (through path):** The loss in the main signal path due to the coupler. For a 10 dB coupler, the theoretical insertion loss is 0.46 dB (10% of power diverted). With real conductor and dielectric losses, expect 0.5-1.0 dB.

**Frequency range:** Couplers are inherently narrowband unless designed with multiple sections. A quarter-wave coupled-line coupler works well over about an octave bandwidth. Broadband couplers using multiple cascaded sections can cover decades of bandwidth.

### Applications

- **Power monitoring:** A 20 dB coupler on the transmitter output samples 1% of the output power, feeding it to a power detector. This allows real-time power measurement without disconnecting the load.
- **VSWR measurement:** Using both the coupled and isolated ports of a dual-directional coupler, you can measure forward and reflected power to calculate VSWR.
- **Feedback for power control:** The coupled sample drives a detector that feeds back to the transmitter gain control, maintaining constant output power.

## Power Dividers and Combiners

**Wilkinson divider:** Splits one input into two equal outputs (or combines two inputs to one output). Uses quarter-wave transmission lines and a termination resistor between the output ports. Provides good isolation between the output ports and matched impedance at all ports. The standard choice for equal power division at a single frequency.

**Resistive divider:** Three resistors in a star or delta configuration. Works from DC to many GHz (limited by parasitic effects). Simple, broadband, but lossy — a 2-way resistive divider has 6 dB of inherent loss (3 dB from splitting, 3 dB from resistive dissipation). Used when bandwidth matters more than efficiency.

**Hybrid couplers (90-degree and 180-degree):** Split power with a specific phase relationship between outputs. Used in balanced amplifier configurations, image-reject mixers, and phased antenna arrays.

## Gotchas

- **Switch insertion loss before the LNA directly degrades receiver noise figure** — A 0.5 dB T/R switch in front of the LNA adds 0.5 dB to the system noise figure. Choose the lowest-loss switch for this position.
- **Switch isolation is not infinite — plan for leakage** — A T/R switch with 30 dB isolation means transmit power leaks into the receive path at -30 dB below transmit level. For a +20 dBm transmitter, that is -10 dBm leaking into the receiver — enough to damage many LNAs.
- **Attenuator power handling is often only 0.25 W or 0.5 W for SMD parts** — A 50-ohm SMD attenuator rated for 0.25 W will overheat at +24 dBm input. Check the power rating and derate for temperature.
- **Coupler directivity limits measurement accuracy** — With 15 dB directivity, the isolated port is only 15 dB below the coupled port. This limits VSWR measurement accuracy, especially for loads near 50 ohms where the reflected power is small.
- **Wilkinson dividers only work well at the design frequency** — The quarter-wave sections are frequency-specific. Off-frequency, the isolation between output ports degrades. For broadband splitting, use resistive dividers or multi-section Wilkinson designs.
- **Attenuator resistors at RF are not ideal** — At GHz frequencies, even thin-film resistors in an attenuator have parasitic inductance and capacitance. Purpose-built RF attenuator components outperform ad-hoc resistor networks above about 1 GHz.
