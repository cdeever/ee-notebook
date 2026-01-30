---
title: "RF Connectors & Transitions"
weight: 60
---

# RF Connectors & Transitions

An RF connector is the interface between the controlled-impedance world of the PCB and the controlled-impedance world of a cable. If the transition maintains 50 ohms through the connector, signals pass cleanly. If it does not, reflections degrade performance just as surely as a bad matching network. Connector selection, footprint design, and launch geometry all matter — especially as frequency increases.

## Common RF Connector Types

### SMA (SubMiniature version A)

The workhorse of RF test and design. SMA connectors are rated from DC to 18 GHz (standard) or 26.5 GHz (precision versions). They use a threaded coupling mechanism that provides reliable, repeatable connections.

- Impedance: 50 ohms
- Frequency range: DC to 18+ GHz
- Mating cycles: 500+ (standard), 5000+ (precision)
- Power handling: approximately 0.5-1 W at 18 GHz (limited by connector size and contact resistance)
- Interface: threaded, requires wrench torque (typically 5-8 in-lb)

SMA is the default choice for prototype boards, test fixtures, and bench measurements. Edge-mount and vertical-mount variants are available for PCB integration.

### BNC (Bayonet Neill-Concelman)

A bayonet-lock connector common in test equipment and lower-frequency RF work.

- Impedance: 50 ohms (also 75-ohm version for video)
- Frequency range: DC to 4 GHz (usable to 11 GHz with precision versions)
- Mating cycles: 500+
- Advantage: quick connect/disconnect, no tools required
- Common use: oscilloscope probes, signal generators, lower-frequency RF

BNC connectors are larger than SMA and have a lower frequency limit, but they are very convenient for bench work. The bayonet lock is fast and does not overtorque.

### N-Type

A medium-sized, weatherproof connector for higher-power applications.

- Impedance: 50 ohms (also 75-ohm version)
- Frequency range: DC to 11 GHz (standard), DC to 18 GHz (precision)
- Power handling: 300-500 W at low frequencies, derated at higher frequencies
- Common use: antenna feedlines, base station equipment, power measurements

N-type is the standard for outdoor and high-power RF connections. Its larger size gives lower loss and higher power handling than SMA.

### U.FL / IPEX (MHF)

Tiny board-mount connectors used for internal connections in consumer electronics.

- Impedance: 50 ohms
- Frequency range: DC to 6 GHz
- Mating cycles: 30 (yes, only thirty)
- Common use: WiFi/Bluetooth antenna connections, internal RF cables in laptops and phones

U.FL connectors are essential for connecting to chip antennas or RF modules in small products. Their extremely limited mating cycle count means they are not suitable for connections that will be made and broken regularly. They are designed to be connected during assembly and left alone.

### Comparison Table

| Connector | Impedance | Max Freq (GHz) | Mating Cycles | Size | Use Case |
|-----------|-----------|-----------------|---------------|------|----------|
| SMA | 50 | 18+ | 500+ | Small | Prototyping, test, instruments |
| BNC | 50/75 | 4 | 500+ | Medium | Low-freq RF, test equipment |
| N-type | 50/75 | 11-18 | 500+ | Large | Antennas, high power |
| U.FL/IPEX | 50 | 6 | 30 | Tiny | Internal board connections |
| MMCX | 50 | 6 | 500+ | Tiny | Snap-on, GPS, WiFi modules |
| RP-SMA | 50 | 18 | 500+ | Small | Consumer WiFi antennas |

## Connector-to-PCB Transition (Launch Design)

The physical interface between the connector and the PCB trace is called the "launch." A poorly designed launch creates an impedance discontinuity at the exact point where the signal enters or exits the board. At frequencies above a few GHz, launch design can dominate connector performance.

Key principles:

**Maintain 50 ohms through the transition.** The connector center pin connects to a PCB pad, which transitions to a trace. Each element in this chain must maintain controlled impedance. The pad may be wider than the trace, creating a capacitive discontinuity. Tapering the pad to the trace width over a short distance helps.

**Ground vias around the connector pad.** The connector shell (ground) must connect to the PCB ground plane with low inductance. For an edge-mount SMA, this means vias from each ground pad directly to the ground plane — at least 3-4 ground vias, as close to the center pin pad as possible.

**Minimize the uncontrolled region.** The length of PCB between the connector pin and the start of the controlled-impedance trace should be as short as fabrication allows. Every millimeter of uncontrolled trace adds parasitic inductance and capacitance.

**Use the vendor's recommended footprint.** Connector manufacturers provide recommended PCB footprints that have been optimized for impedance continuity. Modifying the footprint to "clean it up" or fit your layout can degrade the transition.

## Edge-Mount vs Vertical-Mount vs End-Launch

**Edge-mount SMA** — The connector mounts on the edge of the board, with the center pin extending onto a trace on the board surface. This is the most common type for prototyping. The signal path is short and largely controlled, but the connector body extends off the board edge, requiring mechanical clearance.

**Vertical-mount SMA** — The connector mounts perpendicular to the board surface, with the center pin going through a via to an internal or opposite-side trace. The via adds inductance, and the transition is harder to control. Suitable for lower frequencies (below 3-4 GHz) where the via inductance is tolerable.

**End-launch SMA** — A precision connector that clamps to the board edge, making contact with both the signal trace and the ground planes. End-launch connectors provide the best transitions at high frequency (to 18+ GHz) but are more expensive and require specific board edge preparation (exposed copper on the edge).

## Cable Assemblies

The cable connecting two connectors is as important as the connectors themselves:

**Loss.** Cable loss is specified in dB per meter or dB per foot at a given frequency. Loss increases with frequency (roughly proportional to the square root of frequency). At 2.4 GHz, a cheap RG-174 cable loses about 1.1 dB/m. A better RG-316 loses about 0.9 dB/m. A quality cable like LMR-240 loses about 0.35 dB/m.

**Phase stability.** Flexing a cable changes its electrical length slightly, which changes the phase. For phase-sensitive measurements, use phase-stable cables (often semi-rigid or conformable) that maintain consistent phase when moved.

**Connector quality.** A cable assembly is only as good as its worst connector. Poorly crimped or soldered connectors create reflections and intermittent contacts. For measurement, use factory-made test cables with specified return loss and insertion loss.

| Cable Type | Diameter | Loss at 2.4 GHz (dB/m) | Flexibility | Use Case |
|-----------|----------|------------------------|-------------|----------|
| RG-174 | 2.8 mm | 1.1 | Very flexible | Short jumpers, low power |
| RG-316 | 2.5 mm | 0.9 | Flexible | Test leads, internal wiring |
| RG-58 | 5.0 mm | 0.6 | Moderate | General purpose |
| LMR-240 | 6.1 mm | 0.35 | Moderate | Antenna runs |
| Semi-rigid 0.085 | 2.2 mm | 0.7 | Rigid (formable) | Precision connections |

## Gotchas

- **U.FL connectors wear out after about 30 matings** — If you are debugging a board and keep connecting/disconnecting a U.FL cable, the connector degrades quickly. Use an SMA-to-U.FL adapter cable and only disconnect the SMA end.
- **SMA connectors need torque-wrench tightening** — Hand-tightened SMA connections are not repeatable. For measurements, use a torque wrench set to the manufacturer's specification (usually 5-8 in-lb). Over-tightening damages the connector.
- **75-ohm BNC and 50-ohm BNC look identical** — They will mate, but the impedance mismatch creates reflections. Video equipment uses 75 ohms; RF test equipment uses 50 ohms. Check before connecting.
- **Edge-mount SMA footprints vary between manufacturers** — An SMA connector from one vendor may not fit the footprint designed for another. Always match the footprint to the specific connector part number.
- **Cable loss adds up quickly at GHz frequencies** — A 1-meter cable with 1 dB/m loss at 5.8 GHz eats 1 dB of your link budget. In a receiver, that 1 dB directly degrades noise figure. Keep cables short or use lower-loss types.
- **Connector return loss degrades with wear** — A new SMA connector might have 26 dB return loss. After hundreds of mating cycles, this can degrade to 15-18 dB. Replace connectors in precision setups periodically.
