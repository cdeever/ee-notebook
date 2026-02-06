---
title: "ESD & Transient Protection Basics"
weight: 50
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# ESD & Transient Protection Basics

ESD and electrical transients are two different failure mechanisms that produce frustratingly similar results: circuits that work intermittently, ICs that die without visible damage, and analog peripherals that slowly degrade.

## What ESD Actually Is

Electrostatic discharge is a fast, high-voltage, low-energy event. The human body accumulates charge from friction with clothing, chairs, and carpeting — the triboelectric effect. Typical body voltages range from 2–15 kV depending on humidity and materials, though discharges below about 3 kV aren't perceptible. This means a MOSFET gate oxide can be destroyed at 100V without any sensory feedback.

The discharge itself is extremely fast — nanosecond rise times, peak currents of several amps for microseconds. The total energy is small (microjoules), so it won't burn a trace off a board. Instead, it punches through thin oxide layers, damages junction structures, or creates latent defects that degrade over time.

### Human Body Model (HBM)

The standard ESD model for handling damage treats the human body as roughly a 100 pF capacitor discharged through a 1.5 kΩ resistor (skin and finger). A 2 kV HBM event delivers about 1.3A peak with a ~10 ns rise time. Most modern ICs are rated to survive 1–2 kV HBM at their pins. Exceeding that, or hitting an unprotected internal node, enters damage territory.

### Why ICs Die Without Sparks

A discharge of ~3 kV is required to feel it, ~5 kV to see or hear a spark. CMOS gate oxide can fail at 30–100V. The gap between "felt nothing" and "killed that chip" is enormous — this is why ESD damage is so insidious.

## ESD vs. Electrical Transients

| | ESD | Electrical Transient |
|---|---|---|
| **Source** | Human body, charged objects, triboelectric buildup | Inductive kick, relay coils, motor commutation, hot-plug, lightning coupling |
| **Voltage** | 1–25 kV typical | Tens to hundreds of volts (or kV for lightning) |
| **Duration** | Nanoseconds | Microseconds to milliseconds |
| **Energy** | Microjoules | Millijoules to joules |
| **Repetition** | Random, per-touch | Can be periodic (motor commutation) or event-driven (relay cycling) |
| **Primary damage** | Oxide punch-through, junction degradation | Overvoltage breakdown, overcurrent, thermal damage |
| **Protection strategy** | Handling discipline, ESD structures on-chip | External protection components in circuit |

### Common Transient Sources

- **Relay coils:** Deenergizing a relay without a flyback diode produces a voltage spike of 10–100× the supply voltage — a 12V relay can kick back 200V+
- **Motor commutation:** Brush motors generate continuous transient noise; every commutator segment transition is a small inductive event
- **Hot-plug connectors:** Plugging in a USB device, sensor, or module while powered creates current inrush and potential ground bounce
- **Solenoids and actuators:** Same physics as relays — any switched inductive load produces a flyback spike
- **Long cable runs:** Act as antennas, coupling nearby transients or lightning-induced surges into the circuit

## On-Chip Protection

Most modern ICs include ESD protection diodes on every pin — typically a pair of diodes clamping the pin to VDD and VSS. These diodes are designed to clamp fast ESD events (nanoseconds) and shunt current to the supply rails. They are not designed for sustained overvoltage (they'll conduct and overheat), high-energy transients (limited current handling), or voltages beyond the rails when unpowered (VDD is floating, so the clamp has nowhere to shunt current).

### Latch-up

CMOS ICs contain parasitic thyristor structures (PNPN paths between VDD and VSS). If an overvoltage event forward-biases an internal junction enough to trigger this parasitic SCR, the chip enters latch-up: a low-impedance path from VDD to VSS that draws excessive current and usually destroys the chip unless power is removed within milliseconds. Latch-up is triggered by voltages on I/O pins that exceed VDD or go below VSS — exactly what happens during transient events or when powering on modules in the wrong sequence.

## Circuit Protection Components

**TVS diodes** on any pin connecting to the outside world clamp fast (sub-nanosecond) and handle real energy. Place them as close to the connector as possible with short, wide traces to ground.

**Series resistors** (100–470Ω) on I/O pins limit peak current during ESD events and work with the IC's internal clamp diodes.

**Flyback diodes** across every relay coil, solenoid, and motor allow stored inductive energy to dissipate through the diode instead of spiking the driver's output pin.

**RC snubbers** across relay contacts (typically 100Ω + 100 nF) damp the contact arc that generates broadband RF noise and erodes contacts.

**Ferrite beads** on power and signal lines entering or leaving the board are resistive at high frequencies, attenuating fast transient edges without affecting DC or low-frequency signals.

## Tips

- Connect wrist strap to a known ground point — the strap's 1 MΩ resistor limits current while providing a bleed path for static charge
- Use an ESD mat connected to the same ground as the wrist strap — the mat's slight conductivity (10⁶ to 10⁹ ohms) drains charge slowly rather than creating a discharge event
- Touch a grounded surface before handling boards when no mat/strap is available — chassis ground, bench frame, or a grounded tool
- Handle boards by the edges, avoiding pins, exposed traces, connector contacts, and IC packages
- Keep ICs in anti-static packaging until ready for installation — pink/silver bags and black foam are conductive or dissipative; regular plastic bags generate triboelectric charge
- Don't slide boards across surfaces — sliding generates charge; pick up, place down
- Power down and discharge before connecting or disconnecting anything
- Place protection components at the board edge, as close to connectors as possible — every millimeter of trace between connector and TVS is inductance that reduces effectiveness
- Ground yourself before each touch when working without a mat and strap

## Caveats

- Anti-static bags are not insulating pouches — use them as work surfaces only with the board sitting *on top* of the bag's conductive exterior, not inside
- Wrist straps fail silently — the coiled cord breaks internally, snaps corrode, banana plugs oxidize; test regularly with a wrist strap checker
- "Never had an ESD problem" usually means undiagnosed ESD problems — latent damage is the default outcome, not immediate death
- Unpowered ICs are more vulnerable than powered ones — with VDD floating, internal clamp diodes have nowhere to shunt current
- Latch-up can be triggered by power sequencing — if an I/O pin is driven high before the IC's VDD rail comes up, the pin voltage exceeds VDD and can trigger latch-up
- Flyback diodes slow relay release — the clamped voltage means current decays slowly through L/R; use a Zener + diode clamp for faster release
- TVS diodes have capacitance — high-speed signal lines (USB, fast SPI, HDMI) need low-capacitance TVS arrays designed for those protocols
- The chassis is not always ground — plastic enclosures have no chassis reference; metal enclosures may connect chassis and circuit ground through intentional impedance
- Humidity below 30% RH allows static charge to accumulate readily — winter in heated buildings is peak ESD season
- Synthetic clothing (polyester, nylon, fleece) and carpet are triboelectric charge generators

## In Practice

- One or two GPIO pins stop responding while the rest of the chip functions normally — ESD or overvoltage damaged the I/O cell for those specific pins; check for microamps of leakage current or shorts to VDD/VSS
- ADC readings become noisier or show offset that wasn't there before — damaged analog input structure or ESD clamp diode has increased leakage; compare against a known-good channel
- Board "mostly works" but has intermittent glitches that may be temperature-dependent — latent ESD damage where a weakened junction degrades over time; heat increases leakage through damaged structures
- Sudden excessive current draw (saturating regulator or blowing fuse), heat, and loss of function followed by recovery on power cycle — classic latch-up; check what external event correlates with the trigger (cable connection, relay switching, motor starting)
- Board that passed initial testing and degrades over time, especially in I/O or analog functions — likely latent ESD damage; compare against a known-good board
