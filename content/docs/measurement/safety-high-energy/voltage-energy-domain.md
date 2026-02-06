---
title: "What Voltage/Energy Am I Dealing With?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What Voltage/Energy Am I Dealing With?

Before choosing instruments, probes, and safety precautions, the energy domain of the circuit must be identified. A 3.3V microcontroller board and a 400V PFC stage require completely different approaches — and the difference isn't always obvious from the outside of the box.

## Energy Domains

Circuits fall into distinct energy domains, each with different safety requirements:

| Domain | Typical voltages | Examples | Hazard level |
|--------|-----------------|----------|--------------|
| Low-voltage DC | < 50V | Battery circuits, MCU boards, LED drivers, USB | Generally safe to touch; current can still burn at high amps |
| Mains AC | 120V / 240V (±10%) | Power entry, after the plug, before the transformer or supply | Lethal. Full stop |
| High-voltage DC | 100V–800V+ | Tube amplifiers (B+), PFC bus, CRT anode, switchmode primary side, EV batteries | Lethal, with stored energy that persists after power-off |
| Transient / induced | Varies | Flyback spikes, boost converter outputs, inductive kick, ESD | Can exceed steady-state voltage by 10x or more |

### Identifying the Domain

The schematic provides the first clues — power supply topology, voltage rails, and isolation boundaries between primary and secondary sides. On the board itself, component markings reveal much: electrolytic capacitors are labeled with maximum voltage, giving a strong indication of rail voltage. Transformer markings, fuse ratings, and regulator part numbers fill in the picture.

A DMM confirms what the documentation suggests. Schematic values are nominal; actual voltages can differ. Measure main supply rails, capacitor voltages, and any point where a scope or other instrument will connect. Check both DC and AC — some circuits have residual AC even when the DC supply is the primary concern.

### Stored Energy

Voltage alone doesn't capture the hazard. The stored energy determines whether contact results in a mild spark or a lethal shock.

**Capacitor energy: E = ½CV²**

| Capacitor | Voltage | Energy | Danger |
|-----------|---------|--------|--------|
| 10 µF | 12V | 0.7 mJ | Negligible |
| 100 µF | 50V | 125 mJ | Noticeable spark |
| 220 µF | 400V | 17.6 J | Potentially lethal |
| 1000 µF | 400V | 80 J | Absolutely lethal |

The threshold for a dangerous shock is debated, but stored energy above ~1 joule at voltages above ~50V deserves serious respect.

**Inductor energy: E = ½LI²**

Inductor energy is usually a transient hazard — released as a voltage spike when current is interrupted, not as sustained stored energy after power-off. But in active circuits, breaking a current-carrying inductor connection creates an arc.

## Tips

- Read capacitor voltage ratings on the board to infer rail voltages before measuring
- Start the DMM at the highest manual range when voltage is uncertain — safer than auto-range stepping up through an OL reading
- Calculate stored energy (E = ½CV²) before working near large capacitors at high voltage
- Measure both DC and AC voltage at any point where an instrument will connect
- Note isolation boundaries — primary vs. secondary side of transformers, optocoupler barriers
- Record measured values for selecting probe ratings and oscilloscope vertical ranges

## Caveats

- Voltage can exceed the supply rail — boost converters, flyback converters, charge pumps, and ringing LC circuits all produce voltages higher than their input
- Mains-connected equipment has primary-side voltages on the PCB even when the output is "low voltage" — the inside of a USB charger has mains present
- Battery-powered doesn't mean low-voltage — EV battery packs run 300V–800V; some test equipment has internal HV supplies
- Multiple capacitors in a power supply stage add up — three 220 µF/400V caps store over 50 joules total
- Even "low-voltage" circuits can store dangerous energy if capacitance is large — a 1 farad supercap at 5V stores 12.5 joules
- Auto-range meters start at the lowest range and step up — on high-voltage circuits, expect a brief OL reading before settling
- True RMS meters give accurate AC readings on non-sinusoidal waveforms; average-responding meters can be significantly off on switched or distorted waveforms
- Measuring across a series string of capacitors shows only total voltage, not per-capacitor voltage — measure each individually if balance matters

## In Practice

- Capacitor voltage ratings printed on components indicate the expected rail voltage — a 450V-rated cap suggests a high-voltage DC bus
- Transformer markings and fuse ratings reveal expected power levels and help identify the energy domain before measurement
- An OL reading that settles to a value indicates the initial range was too low — always start high when uncertain
- Unexpected voltage on a rail suggests a fault, backfeed from another source, or a topology not accounted for (boost stage, charge pump)
- AC voltage reading on a nominally DC rail indicates ripple, switching noise, or induced voltage from nearby wiring
- Inductors that spark when a connection is broken indicate significant current was flowing — the inductive kick voltage can far exceed the supply voltage
