---
title: "Decoupling at RF"
weight: 50
---

# Decoupling at RF

At low frequencies, decoupling is straightforward — place a capacitor near the power pin, and it provides a low-impedance path to ground for noise. At RF, this simple approach falls apart. Capacitors have self-resonant frequencies, vias add inductance, traces add more inductance, and the combination of multiple capacitor values can create parallel resonances that actually amplify noise at certain frequencies. Effective RF decoupling requires thinking about the entire impedance path from IC pin to ground plane across the frequency range of interest.

## Self-Resonant Frequency (SRF)

Every real capacitor has parasitic series inductance from its internal structure, leads, and terminations. This series inductance (ESL) forms a series resonant circuit with the capacitance. Below the self-resonant frequency, the component behaves as a capacitor. At the SRF, the impedance reaches its minimum (equal to the ESR). Above the SRF, the component behaves as an inductor.

| Capacitor Value | Package | Typical SRF | Impedance at SRF |
|----------------|---------|-------------|-------------------|
| 10 uF | 0805 | 1-3 MHz | 5-20 mohm |
| 1 uF | 0402 | 15-30 MHz | 10-50 mohm |
| 100 nF | 0402 | 80-200 MHz | 10-30 mohm |
| 10 nF | 0402 | 200-500 MHz | 20-50 mohm |
| 1 nF | 0402 | 500 MHz - 1.2 GHz | 30-80 mohm |
| 100 pF | 0402 | 1-3 GHz | 50-150 mohm |
| 10 pF | 0402 | 3-8 GHz | 100-300 mohm |

The SRF is approximately:

**f_SRF = 1 / (2 * pi * sqrt(L_ESL * C))**

Smaller packages have lower ESL and therefore higher SRF for the same capacitance value. This is why 0402 and 0201 components dominate in GHz-frequency designs. A 100 nF capacitor in an 0805 package might self-resonate at 30 MHz, while the same value in 0402 resonates around 150 MHz.

## The Parallel Resonance Problem

A common instinct is to place multiple capacitor values in parallel — say 10 uF, 100 nF, and 100 pF — to "cover all frequencies." Each capacitor provides low impedance near its SRF. But between any two capacitors, a parallel resonance forms where the inductive behavior of the lower-frequency cap resonates with the capacitive behavior of the higher-frequency cap. At this resonance, the parallel combination has a high impedance — an anti-resonance peak.

For example, a 100 nF cap (SRF at 150 MHz, inductive above) in parallel with a 100 pF cap (SRF at 2 GHz, capacitive below) creates a parallel resonance somewhere around 400-600 MHz. At that frequency, the combined impedance can be 10-100 times higher than either capacitor alone.

This does not mean you should avoid multiple values — it means you need to analyze the combined impedance across frequency, not just assume that more values are better. Simulation tools like SPICE can model the combined impedance of multiple bypass capacitors including their ESL and ESR.

Strategies to manage anti-resonance:

- **Use capacitor values spaced by a factor of 3-10 rather than decades** — This brings the anti-resonance peaks lower and can be managed.
- **Use lossy capacitors (higher ESR) to damp the anti-resonance** — X7R capacitors have higher ESR than C0G/NP0 and naturally damp resonances.
- **Add a small series resistance** — A 0.5-1 ohm series resistor in the bypass path provides broadband damping at the cost of slightly higher minimum impedance.

## The Full Impedance Path

The decoupling impedance seen by the IC is not just the capacitor — it is the entire series path:

1. **IC package inductance** — From the die to the power pin on the PCB. Bond wires add 1-3 nH per pin.
2. **Trace inductance** — The PCB trace from the IC pin pad to the bypass capacitor pad. Every millimeter of trace adds approximately 0.7-1.0 nH/mm.
3. **Capacitor ESL** — The internal inductance of the capacitor, typically 0.3-1.0 nH for 0402.
4. **Via inductance** — The via connecting the capacitor ground pad to the ground plane, typically 0.5-1.0 nH.
5. **Ground plane impedance** — Usually negligible if the plane is solid and close, but can matter if the ground path is long or narrow.

At 1 GHz, a "short" 3 mm trace (approximately 2.5 nH) plus an 0402 cap (0.5 nH ESL) plus a via (0.8 nH) gives a total series inductance of about 3.8 nH. The impedance of this inductance at 1 GHz is about 24 ohms — which overwhelms the capacitor's impedance. The trace inductance, not the capacitor, limits the decoupling effectiveness.

## Placement Rules

**As close as physically possible.** Every millimeter counts. The capacitor should be adjacent to the IC power pin, with the shortest trace physically achievable. In practice, this means the bypass cap pad should be within 1-2 mm of the IC pin.

**Short return path.** The ground pad of the bypass capacitor needs a via directly at the pad — not a trace leading to a via somewhere else. The via should be as close to the ground pad as the PCB fabrication rules allow.

**Orient for shortest loop.** The current loop is: IC power pin, through trace, through capacitor, through via to ground plane, back under the trace to the IC ground pin. This loop should be as small as possible. Orient the capacitor so the current path does not U-turn.

**Multiple vias for the ground connection.** Two vias at the capacitor ground pad instead of one cuts the via inductance roughly in half.

## Ferrite Beads

Ferrite beads are commonly used in power supply filtering at RF. They provide resistive impedance at high frequencies — unlike capacitors, they absorb RF energy as heat rather than reflecting it.

Key characteristics:
- **Impedance at 100 MHz:** The standard rating frequency. Common values: 30, 100, 220, 600, 1000 ohm.
- **DC resistance:** Low values (0.05-0.5 ohm) are needed for power supply lines.
- **Current rating:** Ferrite beads saturate at high DC current, losing their impedance. Always derate for the actual DC current.
- **Frequency response:** Impedance rises with frequency, peaks somewhere between 100 MHz and 1 GHz, then may decline. Check the impedance vs. frequency plot, not just the 100 MHz value.

A ferrite bead in series with the power supply, followed by a bypass capacitor to ground, creates a pi-filter or L-filter that attenuates power supply noise at RF. The ferrite absorbs the energy that the capacitor shunts.

## Designing a Decoupling Strategy

1. **Identify the frequency range** — What frequencies need to be decoupled? For a 2.4 GHz radio IC, you need low impedance from DC to at least 3-5 GHz.
2. **Choose capacitor values based on SRF** — Select values whose SRFs cover the critical frequency bands. For 2.4 GHz, you might use 10 nF (SRF around 400 MHz) and 1 pF (SRF around 6 GHz), plus a bulk 1 uF for low-frequency bypassing.
3. **Simulate the combined impedance** — Use SPICE or an impedance calculator to plot the total impedance of the parallel combination, including ESL and ESR for each cap, plus via and trace inductance.
4. **Minimize trace and via inductance** — Place caps as close to the pin as possible, use multiple vias, and consider blind/buried vias for the lowest inductance.
5. **Add ferrite beads if needed** — For isolating noisy power sections or preventing conducted emissions.

## Gotchas

- **A capacitor above its SRF is an inductor** — Placing a 100 nF cap for "high-frequency decoupling" does nothing at 1 GHz because it self-resonated at 150 MHz and is inductive above that. Always check the SRF for your chosen package.
- **More capacitor values can make things worse** — Parallel resonances between capacitor values create impedance peaks. Simulate before adding values.
- **Trace length to the bypass cap matters more than cap value at GHz** — A perfect capacitor at the end of a 10 mm trace is worse than a mediocre capacitor at 1 mm. Minimize the loop area first.
- **Ferrite beads saturate with DC current** — A 600-ohm ferrite bead rated for 200 mA might drop to 100-ohm impedance at 500 mA. Always check the saturation curve.
- **Do not put ferrite beads on RF signal paths** — Ferrite beads are for power supply filtering. On a signal path, they add loss and distortion. Use proper RF filtering (LC networks, SAW filters) for signal paths.
