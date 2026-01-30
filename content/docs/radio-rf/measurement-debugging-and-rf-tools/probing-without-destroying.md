---
title: "Probing Without Destroying the Circuit"
weight: 50
---

# Probing Without Destroying the Circuit

At RF frequencies, the probe is part of the circuit. Every measurement tool you connect adds capacitance, inductance, and resistance to the node under test. At 1 kHz, a 10 pF probe capacitance is irrelevant — its impedance is 16 megohms. At 1 GHz, that same 10 pF has an impedance of 16 ohms, which can detune a filter, shift an oscillator's frequency, or kill an oscillation entirely. The fundamental challenge of RF measurement is observing without disturbing.

## Capacitive Loading: The Silent Killer

Every probe adds capacitance to the node it touches. The effect depends on the circuit impedance and operating frequency. A few examples illustrate how quickly this becomes a problem:

| Probe Capacitance | Frequency | Impedance Added | Effect on 50-ohm Circuit |
|---|---|---|---|
| 12 pF (passive probe) | 10 MHz | 1.3 k-ohm | Negligible |
| 12 pF (passive probe) | 100 MHz | 133 ohm | Noticeable loading |
| 12 pF (passive probe) | 500 MHz | 27 ohm | Severe loading — circuit behavior changes |
| 1 pF (active probe) | 100 MHz | 1.6 k-ohm | Minimal loading |
| 1 pF (active probe) | 1 GHz | 160 ohm | Moderate loading |

For a tuned circuit like a bandpass filter or oscillator tank, even 1-2 pF of added capacitance shifts the resonant frequency. A filter tuned to 100 MHz with a total tank capacitance of 10 pF sees a 10% shift (down to about 95 MHz) when you add 1 pF with a probe. That shift can move the passband enough to completely change the circuit's behavior — making the measurement meaningless because you're no longer observing the circuit as it normally operates.

## Ground Lead Inductance: The Antenna Problem

The ground connection is often worse than the probe tip. A standard oscilloscope probe ground lead is about 6 inches of wire with an alligator clip — roughly 20-25 nH of inductance. At 100 MHz, 25 nH has an impedance of about 16 ohms. Combined with the probe's 12 pF capacitance, the ground lead and probe form a series resonant circuit somewhere around 100-300 MHz.

At resonance, the probe rings violently. You'll see large overshoots and oscillations on every edge, and the probe becomes an efficient antenna, both radiating energy from the circuit and picking up ambient RF. The waveform on screen looks terrible, but the circuit might be perfectly fine — the problem is entirely in the measurement.

The fix is to minimize ground lead length. In order of effectiveness:

1. **Spring-tip ground on the probe barrel** — Most modern probes have a ground ring near the tip and a small spring ground contact. This creates a ground loop of a few millimeters, reducing inductance to 1-3 nH.
2. **Solder a ground wire directly** — Tack a short wire from the probe ground to a ground point within 5 mm of the signal probe point.
3. **Coaxial probing** — Use a probe designed to maintain a coaxial structure all the way to the board. Some active probes achieve this with a built-in coaxial tip.

The ground clip should never be used for measurements above about 30 MHz. This is one of the most common mistakes in RF measurement.

## Near-Field Probes: Non-Contact Measurement

Near-field probes detect the electromagnetic fields radiating from a circuit without making electrical contact. There are two types:

- **Magnetic field probes (H-field)**: Small loops of wire that couple to the magnetic field component. They're sensitive to current flow — useful for finding current paths, identifying which traces carry the most RF current, and locating coupling between traces. A small loop (5-10 mm diameter) provides spatial resolution on the order of its diameter.

- **Electric field probes (E-field)**: Short monopoles or open-ended coaxial structures that couple to the electric field. They're sensitive to voltage — useful for finding high-voltage nodes, identifying radiating points, and mapping electric field patterns.

Near-field probes connect to a spectrum analyzer or oscilloscope. They provide relative measurements — stronger signal here, weaker signal there — rather than absolute values. This makes them ideal for debugging: scanning across a PCB to find where RF energy is leaking, which component is oscillating, or where coupling between traces is strongest.

Commercial near-field probe sets (like the Beehive Electronics 100-series) cost $100-300 and cover frequencies from a few MHz to several GHz. DIY versions — a small loop of wire soldered to an SMA connector — work surprisingly well for debugging, though they lack calibration.

## Built-In Test Points: Design for Testability

The best approach to RF measurement is to design test access into the circuit from the beginning, so you never need to touch the circuit with a probe during debugging.

- **Sense resistors**: A small resistor (1-10 ohms) in series with a power supply or signal path creates a voltage drop proportional to current. Measuring across the resistor with a high-impedance probe reveals current flow without significantly disturbing the circuit. At RF, keep the sense resistor value low enough that its impedance is small compared to the circuit impedance.

- **Directional couplers**: A coupler built into the signal path samples forward or reverse power continuously. See [Directional Couplers & Power Meters]({{< relref "/docs/radio-rf/measurement-debugging-and-rf-tools/directional-couplers-and-power-meters" >}}) for details.

- **Pad-out components**: Leave unpopulated footprints on the PCB for optional series or shunt components. A pad-out series resistor location lets you break the signal path and insert test equipment. A pad-out shunt capacitor location lets you add filtering or loading during debugging.

- **SMA or U.FL connectors**: Include RF connectors at key points — amplifier output, filter input/output, antenna feed. A $0.50 U.FL footprint on the PCB saves hours of debugging time when you can connect a cable directly to a spectrum analyzer or VNA without probing.

- **Test points with guard traces**: If you must use a probe-accessible pad, surround it with grounded guard traces to provide a nearby ground connection and reduce stray coupling.

## Impedance Buffer Probes

Active probes with very high input impedance and very low input capacitance are the gold standard for RF probing. These probes contain a FET or transistor amplifier at the probe tip that buffers the circuit from the measurement cable. The amplifier draws minimal current from the circuit (microamps) and adds minimal capacitance (0.5-1 pF).

High-end active probes from Keysight, Tektronix, and Rohde & Schwarz offer bandwidths from 1 GHz to 30+ GHz with input capacitance below 0.5 pF. They also provide calibrated gain, so the oscilloscope display shows correct voltage levels. The price ranges from $500 for modest probes to $10,000+ for high-bandwidth models.

For the learning bench, less expensive alternatives exist. Analog Devices and Texas Instruments make high-speed op-amps and buffer amplifiers (like the LMH6559 or BUF602) that can be built into homemade active probe circuits. The challenge is maintaining stable operation and calibrated gain across the frequency range.

## Practical Probing Strategy

When you need to measure an RF circuit:

1. **Start with non-contact methods**: Use near-field probes to identify the general area of interest and verify that the circuit is functioning.
2. **Use built-in test points**: If the board has SMA connectors, coupler outputs, or designated test pads, use them first.
3. **Minimize ground lead length**: If you must use a probe, remove the ground clip and use the shortest possible ground connection.
4. **Verify that probing doesn't change behavior**: Measure a known parameter (DC bias, frequency) with and without the probe. If the value shifts significantly, the probe is disturbing the circuit.
5. **Use the highest-impedance, lowest-capacitance probe available**: Active probes are always better than passive probes at RF.

## Gotchas

- **The circuit works until you probe it** — If connecting a probe stops an oscillator or detunes a filter, the probe is the problem, not the circuit. Reduce probe loading or use a non-contact method.
- **Near-field probes are relative, not absolute** — A near-field probe can tell you that point A radiates more than point B, but not how many dBm either one produces. Use them for comparison and localization, not calibrated measurement.
- **Solder flux changes impedance** — Flux residue on probe contact points can introduce a lossy dielectric that affects measurements at high frequencies. Clean the board and probe tip before precision measurements.
- **Active probes need power** — Active probes draw current and have a limited dynamic range (both minimum and maximum measurable voltage). Overdriving an active probe clips the output and can damage the amplifier. Check the probe's linear range before connecting.
- **Multiple probes multiply the loading** — Probing two nodes simultaneously adds capacitance to both. On a tightly coupled circuit like a differential pair or a filter, two probes can cause more disruption than one.
- **Temperature affects active probes** — FET-based probe amplifiers have gain that drifts with temperature. Let the probe warm up (10-15 minutes) before making precise measurements, and recalibrate if the ambient temperature changes significantly.
