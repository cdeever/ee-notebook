---
title: "Transformers"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Transformers

Two or more inductors sharing a magnetic core. Energy goes in on one winding and comes out on another — with the voltage and current scaled by the turns ratio. Transformers provide isolation, voltage conversion, and impedance matching, all without any active components.

## The Basic Relationship

The turns ratio N = N_primary / N_secondary determines the voltage scaling:

V_secondary = V_primary × (N_secondary / N_primary)

Current scales inversely (conservation of energy):

I_secondary = I_primary × (N_primary / N_secondary)

A 10:1 step-down transformer converts 120 V to 12 V, but the available current goes up by 10×. Power in equals power out (minus losses). There's no free energy.

## Isolation

This is the transformer's most important property, often overlooked in favor of voltage conversion. The primary and secondary windings are electrically separate — galvanically isolated. No DC path exists between them.

This means:

- The secondary can be referenced to a completely different ground
- Fault currents on one side don't directly flow to the other
- Common-mode voltage differences between circuits are blocked (up to the transformer's isolation rating)
- Ground loops can be broken

Isolation voltage ratings matter. A transformer rated for 1500 V isolation can withstand that voltage between windings without breakdown. Exceeding this in a fault condition can be catastrophic. Safety-rated transformers in mains equipment must meet specific creepage and clearance requirements.

## Ideal vs. Real

The ideal transformer transfers all energy perfectly. Real transformers have losses and parasitic effects that determine where they work well and where they don't.

### Magnetizing Inductance

The primary winding is still an inductor. Even with no load on the secondary, the primary draws a magnetizing current that creates the magnetic flux in the core. This magnetizing inductance:

- Appears in parallel with the ideal transformer model
- Limits low-frequency performance — at low frequencies, the magnetizing impedance drops, and the primary draws excessive current even unloaded
- Determines the minimum operating frequency. Below it, the core saturates on each cycle

### Leakage Inductance

Not all flux from the primary links to the secondary. The flux that doesn't couple shows up as leakage inductance — a series inductance on each winding that limits high-frequency performance and causes voltage spikes during fast current transitions.

Leakage inductance is why switching power supply transformers need careful winding technique (interleaving, sandwich windings) and why flyback transformers are really coupled inductors with intentionally gapped cores.

### Winding Resistance

Copper losses. I²R in each winding. Causes heating and voltage drop under load. At high frequencies, skin effect and proximity effect increase the effective resistance beyond the DC value.

### Core Losses

Same as inductors — hysteresis and eddy current losses in the core material. Proportional to frequency, flux swing, and core volume. Core losses set an upper limit on efficient operating frequency for a given core material.

## Transformer Types by Application

### Power Transformers (Mains Frequency)

The heavy iron-core transformers in linear power supplies and mains isolation applications. Laminated steel cores optimized for 50/60 Hz.

- Large, heavy, and reliable
- Excellent isolation for safety applications
- Regulation is mediocre — output voltage drops with load due to winding resistance and leakage inductance. Typical regulation is 5-15%
- Inrush current at power-on can be extreme (core may be at residual magnetization from the last time it was turned off, hitting saturation for the first few cycles)

### Switching Power Supply Transformers

Small ferrite-core transformers operating at tens of kHz to hundreds of kHz. Much smaller and lighter than mains-frequency transformers for the same power level.

- Ferrite core — low loss at high frequency, but saturation is a hard wall
- Tight winding coupling is critical to minimize leakage inductance
- Often custom-wound for a specific converter design
- Flyback "transformers" are really coupled inductors — they store energy in the core gap during the switch-on phase and deliver it during switch-off. True transformers transfer energy continuously

### Signal Transformers

Small transformers for audio, telecom, or RF signal coupling. Designed for signal integrity, not power handling.

- Audio transformers provide balanced-to-unbalanced conversion, impedance matching, and ground loop isolation. Quality audio transformers maintain flat frequency response across the audio band. Cheap ones don't
- RF transformers (including transmission-line transformers) provide impedance transformation for antenna matching and amplifier interstage coupling
- Pulse transformers pass fast edges for gate drive isolation in power electronics. Droop and volt-second limits constrain the maximum pulse width

### Current Transformers (CTs)

A transformer used to measure AC current. The conductor carrying the current to be measured passes through the core (or is the primary winding). The secondary produces a scaled-down current proportional to the primary current.

- The secondary must always be loaded (a burden resistor). An open-circuited CT secondary develops dangerously high voltages — the full magnetizing current has nowhere to go, and the voltage rises until something breaks down
- Used in power metering, overcurrent protection, and current sensing without breaking the circuit

## Impedance Transformation

Transformers transform impedance by the square of the turns ratio:

Z_reflected = Z_load × (N_primary / N_secondary)²

A 4:1 turns ratio transforms a 50 Ω load to 800 Ω as seen from the primary. This is how impedance matching networks work in audio (matching a low-impedance speaker to a tube amplifier output) and RF (matching antenna impedance to transmitter output).

## Dot Convention and Polarity

Transformer schematics use dots to indicate winding polarity — which terminals have the same instantaneous voltage polarity. Getting the dots wrong means:

- In a power supply, the output voltage is inverted (or the rectifier doesn't work)
- In a push-pull or bridge converter, the switching transistors shoot through
- In a feedback winding, positive feedback instead of negative — oscillation or latch-up

When winding or specifying a custom transformer, polarity must be defined explicitly. When troubleshooting, a scope on both windings confirms the phase relationship.

## Tips

- Check isolation voltage rating for safety-critical applications — it's not the same as operating voltage
- For switching converters, minimize leakage inductance through tight winding coupling
- CT secondaries must never be open-circuited — always install a burden resistor before removing the load

## Caveats

- Saturation at low frequency — A transformer designed for 60 Hz will saturate at 20 Hz at the same voltage. The flux swing is inversely proportional to frequency. Audio output transformers have large cores to handle low frequencies without saturating
- DC current saturates the core — Any DC bias in the primary current pushes the core toward saturation, reducing the available flux swing for the AC signal. This is why coupling capacitors are used before transformer-coupled stages, and why push-pull converters are preferred for high-power designs (the DC components cancel in the core)
- Inrush current — Energizing a power transformer can draw 10-20× rated current for the first few cycles, depending on the instantaneous voltage at switch-on and the residual core magnetization. Soft-start circuits or NTC thermistors limit this
- Leakage inductance spikes — When current through a transformer winding is interrupted quickly (as in switching converters), leakage inductance produces a voltage spike. Snubbers or clamp circuits are almost always needed
- CT secondary must never be open-circuited — The voltage will rise until insulation breaks down or the core saturates violently. Always short the secondary before disconnecting the burden resistor
- Capacitive coupling between windings — High-frequency noise can couple through the inter-winding capacitance, bypassing the galvanic isolation. Faraday shields (grounded copper foil between windings) reduce this but add cost and complexity

## In Practice

- A transformer that hums louder than normal may have DC on the mains, loose laminations, or be approaching saturation
- Voltage droop under load indicates winding resistance and leakage inductance losses — measure no-load vs. loaded voltage to assess regulation
- Ringing on the secondary after switching transitions points to leakage inductance resonating with stray capacitance
- A CT with abnormally high output indicates an open or high-resistance burden — check the burden resistor immediately
