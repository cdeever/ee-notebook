---
title: "When Short Wires Stop Being Short"
weight: 50
---

# When Short Wires Stop Being Short

There is an assumption buried so deeply in low-frequency electronics that most people never examine it: a wire is just a connection. It has no meaningful electrical behavior — it simply links one node to another. This works at DC and through audio frequencies. But as frequency rises, wires stop being passive connections and become active participants in the circuit. A component lead becomes an inductor. A jumper wire becomes an antenna. A PCB trace becomes a transmission line. The wire did not change — the frequency did, and the wire's electrical length grew from negligible to significant.

## Electrical Length Is What Matters

A wire's behavior depends not on its physical length in centimeters, but on its electrical length — how long it is compared to the wavelength of the signal it carries. A 10 cm wire carrying a 1 kHz signal is about 0.000003 wavelengths long. It is electrically invisible. The same 10 cm wire carrying a 1 GHz signal on FR4 is about 0.6 wavelengths long — it is a significant transmission line that supports standing waves, impedance transformations, and radiation.

The [lambda/10 rule]({{< relref "/docs/radio-rf/rf-fundamentals/frequency-vs-wavelength" >}}) sets the rough boundary: when a wire exceeds about one-tenth of the wavelength in the medium it occupies, it can no longer be ignored as a simple connection.

## Component Leads as Unintended Inductors

Every wire has inductance — roughly 1 nH per millimeter for a straight wire in free space, somewhat less above a ground plane. At low frequencies, this inductance is irrelevant. At RF, it dominates.

A through-hole resistor with 5 mm leads on each side has approximately 10 nH of combined lead inductance. Here is what that means at various frequencies:

| Frequency | Reactance of 10 nH | Impact |
|-----------|-------------------|--------|
| 1 MHz | 0.063 ohm | Negligible for nearly any application |
| 10 MHz | 0.63 ohm | Negligible unless you are building precision 50 ohm circuits |
| 100 MHz | 6.3 ohm | Significant — changes the impedance of a 50 ohm termination by 12% |
| 500 MHz | 31 ohm | Dominant — the lead inductance has more reactance than a 10 ohm resistor |
| 1 GHz | 63 ohm | The resistor is mostly inductor at this point |

This is why RF circuits exclusively use surface-mount components with the shortest possible terminations. An 0402 chip resistor might have 0.3 nH of parasitic inductance instead of 10 nH — a factor of 30 improvement just from package size.

## PCB Traces as Transmission Lines

A PCB trace over a ground plane is a microstrip transmission line. At low frequencies, you ignore this and treat it as a wire. At RF, you cannot.

A 10 cm trace on FR4 microstrip becomes electrically significant (exceeds lambda/10) at roughly:
- 170 MHz for a microstrip trace (effective wavelength in FR4)
- 600 MHz in free space

Above this frequency, the trace must be treated as a [transmission line]({{< relref "/docs/radio-rf/transmission-lines/what-makes-a-transmission-line" >}}) with controlled impedance, proper termination, and attention to return path continuity.

What happens when you ignore this:
- Impedance mismatches cause reflections, creating ringing on digital signals and standing waves on RF signals
- The effective impedance at the load depends on trace length, not just the load itself
- Radiation from the trace increases — an unterminated trace is an antenna

## Jumper Wires and Breadboards

Breadboards are the canonical example of "short wires that are not short." A typical breadboard jumper is 2-5 cm, and the internal contact springs add stray capacitance (1-2 pF per contact) and inductance. The breadboard has no ground plane, so there is no controlled return path.

At 10 MHz, a breadboard prototype might work but show some noise and ringing. At 100 MHz, the breadboard itself dominates the circuit behavior — stray coupling between rows, undefined impedances, and resonances from the jumper wires make measurements meaningless. Above 300 MHz, a breadboard is simply a random collection of antennas and resonators.

This is why RF prototyping moves to copper-clad board and dead-bug (Manhattan) construction. The ground plane is immediate and continuous. Connections are short — component leads soldered directly to ground plane pads. It is ugly but electrically sound at hundreds of MHz where breadboards fail completely.

## Specific Examples

**5 cm lead at 433 MHz.** The 433 MHz ISM band has a free-space wavelength of 69 cm, so a 5 cm wire is about lambda/14 — right at the boundary of "short." This wire has noticeable inductance (roughly 50 nH, presenting 136 ohm of reactance) and will radiate noticeably. If this wire is an unintended antenna attached to an oscillator, it may be radiating enough to fail emissions testing. If it is a ground lead, it is adding impedance to the ground path that affects every circuit node.

**10 cm trace at 1 GHz.** At 1 GHz on FR4 microstrip, the wavelength is about 17 cm. A 10 cm trace is 0.59 wavelengths — more than half a wavelength. It supports standing waves and acts as an impedance transformer. The voltage at the near end can be completely different from the voltage at the far end. If this trace is not designed with controlled impedance and proper termination, the circuit at the far end sees a transformed impedance that may not resemble the source at all.

**3 cm oscilloscope probe ground lead at 500 MHz.** A standard oscilloscope probe ships with a 10-15 cm ground clip lead. At 500 MHz (wavelength about 60 cm in free space), this lead is lambda/4 — a quarter-wave antenna. It presents a high impedance at the probe tip, creating a resonance that amplifies noise at that frequency. The measurement shows a large spike around 500 MHz that is entirely an artifact of the ground lead. This is why RF measurements use a probe tip ground spring (2-3 mm long) instead of the alligator clip lead.

**PCB via at 10 GHz.** A via through a 1.6 mm FR4 board is about 1.6 mm long. At 10 GHz (wavelength in FR4 roughly 1.6 cm), this via is lambda/10 — the boundary of significance. The via inductance (roughly 0.2-0.5 nH depending on geometry) presents 12-31 ohm of reactance. At these frequencies, via design, via stitching, and via pad optimization become critical layout concerns.

## Why Breadboards Do Not Work at RF

It is worth enumerating the specific reasons, because "breadboards don't work at high frequency" is often stated without explanation:

1. **No ground plane** — There is no low-impedance return path. Return current must travel through long jumper wires back to the power supply, creating large loop areas that radiate and pick up interference.

2. **Uncontrolled impedance** — The contact springs and bus strips have random impedance that varies with frequency. There is no way to achieve 50 ohm or any controlled impedance.

3. **Excessive stray capacitance** — Adjacent rows of the breadboard have roughly 1-2 pF of coupling. At 100 MHz, 2 pF has an impedance of 800 ohm — enough to couple meaningful signals between unrelated circuits.

4. **Long, unshielded connections** — Jumper wires act as antennas. A 5 cm jumper at 1 GHz is nearly a third of a wavelength — an efficient radiator and receiver.

5. **Parasitic resonances** — The combination of lead inductance and stray capacitance creates resonant circuits at unpredictable frequencies. These resonate and ring, creating oscillations that have nothing to do with the intended circuit.

For most RF work, anything above about 30-50 MHz requires abandoning the breadboard entirely and moving to a ground-plane-based construction method.

## Gotchas

- **Surface mount does not automatically solve the problem** — SMD components are better, but at 5+ GHz even 0402 packages have significant parasitics. The pad geometry, via connections, and trace routing to the component all matter as much as the component itself.
- **Wire gauge does not predict RF behavior** — A thicker wire has more surface area (lower skin-effect loss) but also more inductance per unit length. The relevant parameters at RF are inductance, characteristic impedance, and electrical length — not DC resistance.
- **Unused component pads are stubs** — A dual-footprint pad on a PCB (to accommodate either 0402 or 0603) leaves an unconnected stub when one size is populated. At GHz frequencies, that stub is a resonant element that can degrade signal integrity.
- **Ground lead resonance is real and common** — The most frequent measurement artifact in RF work is the probe ground lead resonating and adding a false peak. If you see a large spike at a particular frequency during oscilloscope measurements, try shortening the ground lead before concluding the spike is real.
- **Even short wires inside connectors matter** — The center pin of a BNC connector is about 1 cm long. At 4 GHz, that pin is lambda/7 and its inductance creates measurable impedance discontinuity. This is why precision RF uses SMA or smaller connectors — shorter center pins mean less parasitic inductance.
