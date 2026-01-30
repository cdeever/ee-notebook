---
title: "Cables as Components"
weight: 70
---

# Cables as Components

At low frequencies, a cable is just a way to get a signal from point A to point B. Its only meaningful property is resistance, and that is usually negligible. At RF, a cable is a component — it has characteristic impedance, frequency-dependent loss, a specific propagation delay, and it transforms the impedance at one end based on its electrical length. Treating cables as passive wires at RF leads to unexpected loss, phase errors, impedance surprises, and measurement artifacts. Understanding cables as electrical components is essential for reliable RF system assembly.

## Cable Loss

RF cable loss is specified in dB per unit length at a given frequency. Loss has two components:

**Conductor loss** — Resistive loss in the center conductor and shield, dominated by the [skin effect]({{< relref "/docs/radio-rf/rf-fundamentals/skin-effect-and-proximity-effect" >}}) at RF frequencies. Conductor loss increases as the square root of frequency.

**Dielectric loss** — Energy absorbed by the insulating material between conductors. Dielectric loss increases linearly with frequency.

The total loss increases with frequency — roughly proportional to the square root of frequency at lower frequencies (where conductor loss dominates) and more linearly at higher frequencies (where dielectric loss becomes significant).

| Cable type | Loss at 100 MHz | Loss at 1 GHz | Loss at 5 GHz |
|-----------|----------------|---------------|---------------|
| RG-174 (50 ohm, thin) | 9.8 dB/100m | 33 dB/100m | 80 dB/100m |
| RG-58 (50 ohm, standard) | 5.3 dB/100m | 18 dB/100m | 44 dB/100m |
| RG-213 (50 ohm, thick) | 2.8 dB/100m | 9.4 dB/100m | 22 dB/100m |
| LMR-400 (50 ohm, low-loss) | 1.5 dB/100m | 5.1 dB/100m | 11.8 dB/100m |
| RG-59 (75 ohm) | 3.6 dB/100m | 12 dB/100m | 28 dB/100m |
| RG-6 (75 ohm, quad-shield) | 2.0 dB/100m | 6.6 dB/100m | 16 dB/100m |

Practical consequence: a 10-meter run of RG-58 at 2.4 GHz (WiFi) loses about 6 dB — three-quarters of the signal power is dissipated as heat in the cable. Using LMR-400 for the same run drops the loss to about 1.7 dB, preserving 68% of the power. Cable selection is not an afterthought at RF — it is a link budget decision.

## Velocity Factor

Electromagnetic waves travel slower in cable than in free space. The ratio of the cable propagation velocity to the speed of light is the velocity factor (VF):

**v_cable = VF x c**

The velocity factor depends on the dielectric material:

| Dielectric | Velocity factor | Wavelength reduction |
|-----------|----------------|---------------------|
| Air / vacuum | 1.00 | None |
| Foam polyethylene | 0.80 - 0.85 | 15-20% shorter |
| Solid PTFE (Teflon) | 0.69 - 0.70 | 30-31% shorter |
| Solid polyethylene | 0.66 | 34% shorter |

This means a half-wavelength of cable at 100 MHz (free-space wavelength 3 meters) is only about 1 meter long in solid polyethylene coax (VF = 0.66). If you are cutting a cable to a specific electrical length — for an impedance-matching stub, a phased array feed, or a delay line — you must use the velocity factor, not the free-space wavelength.

Velocity factor can be measured by determining the frequency at which a cable of known physical length is exactly one quarter wavelength (the impedance from an open end goes through a minimum on a VNA, or TDR shows the first reflection at the expected time).

## Cable as a Delay Line

A cable introduces a fixed delay per unit length:

**Delay = Length / (VF x c)**

For RG-58 (VF = 0.66): 5.05 ns per meter.

This delay is used deliberately in some applications:
- **Phased array feeds** — Each antenna element receives a signal through a cable of specific length, creating the inter-element phase shift that steers the beam
- **Trigger delay** — A coax cable delays a trigger pulse by a precise time. A 10-meter RG-58 cable provides about 50 ns of delay
- **Time-domain measurements** — Adding a known cable length separates reflections in time, making TDR traces easier to interpret

But unintended delay causes problems:
- Phase-sensitive systems (mixers, I/Q receivers, phase-locked loops) are disrupted by cable-induced phase shifts
- Cables of different lengths in supposedly symmetric paths create phase imbalance
- Temperature changes alter the velocity factor slightly, shifting the delay — critical in precision timing and phase-coherent systems

## Cable as an Impedance Transformer

A transmission line transforms the impedance at its load based on its [electrical length]({{< relref "/docs/radio-rf/rf-fundamentals/phase-delay-and-timing" >}}). For a lossless line of characteristic impedance Z0 and electrical length theta, the impedance seen at the input is:

**Z_in = Z0 x (Z_L + j Z0 tan(theta)) / (Z0 + j Z_L tan(theta))**

Special cases:
- **Quarter wavelength (theta = 90 degrees):** Z_in = Z0^2 / Z_L. The line inverts the impedance. A 50 ohm quarter-wave cable terminated in 100 ohm presents 25 ohm at the input. A short looks like an open, and an open looks like a short.
- **Half wavelength (theta = 180 degrees):** Z_in = Z_L. The impedance repeats. The line is electrically transparent (but still has loss).
- **Any other length:** Z_in is a complex value that rotates around the Smith chart as frequency changes.

This transformation effect means the impedance measured at the end of a cable depends on the cable's electrical length — which changes with frequency. A load that is perfectly 50 ohm at DC might appear as 40 + j15 ohm at the end of a cable at a particular frequency. This is not an error; it is physics.

**Practical implication:** Never assume that the impedance measured through a cable is the same as the impedance of the load. Either calibrate the measurement to the load plane (de-embed the cable) or measure the load directly at the connector.

## Cable as a Filter

Cable loss is frequency-dependent, which means a cable acts as a low-pass filter. Higher frequency components are attenuated more than lower ones. For wideband signals (like digital pulses or noise), the cable progressively rounds the edges and attenuates high-frequency content.

This filtering effect is sometimes useful (it can reduce EMI by attenuating harmonics) and sometimes harmful (it degrades signal integrity for wideband signals). In precision pulse measurements, cable-induced filtering must be accounted for — the pulse you see at the far end of a cable is not identical to the pulse at the near end.

At extreme lengths or frequencies, the cable becomes essentially opaque. A 100-meter run of RG-58 at 5 GHz has 44 dB of loss — the signal is attenuated by a factor of 25,000. At that point, the cable is not a signal path; it is a termination (it absorbs all the energy before it reaches the far end).

## Connectors

Connectors are part of the cable and part of the transmission line. A poor connector can undo the performance of an excellent cable.

| Connector | Z0 | Frequency range | Typical use |
|-----------|-----|----------------|-------------|
| BNC | 50 ohm (or 75 ohm) | DC - 4 GHz (usable to 4 GHz, specified to 2 GHz) | Lab, test equipment, video |
| SMA | 50 ohm | DC - 18 GHz (26.5 GHz for precision) | RF, microwave, PCB launches |
| N-type | 50 ohm (or 75 ohm) | DC - 11 GHz (18 GHz for precision) | Higher power, antenna systems |
| F-type | 75 ohm | DC - 1 GHz | Cable TV, satellite |
| UHF/PL-259 | Uncontrolled (nominally 50 ohm) | DC - 300 MHz | Amateur radio, CB (avoid above VHF) |
| 3.5 mm | 50 ohm | DC - 34 GHz | Precision measurement, VNA calibration |
| 2.92 mm (K) | 50 ohm | DC - 40 GHz | Millimeter wave, precision |

**Connector quality matters enormously at RF.** A BNC connector has a small impedance discontinuity where the center pin transitions between the cable and connector. At 100 MHz, this is negligible. At 3 GHz, it creates measurable reflections. This is why BNC is not recommended above 4 GHz — the connector's internal geometry is not precise enough to maintain 50 ohm impedance at shorter wavelengths.

SMA connectors are designed with tight dimensional tolerances for controlled impedance up to 18 GHz. But even SMA connectors degrade with wear — the center pin contact resistance increases, and the outer threads loosen. SMA connectors are rated for about 500 mating cycles. Precision applications (VNA calibration, metrology) use 3.5 mm or 2.92 mm connectors with even tighter tolerances.

## Handling and Storage

RF cables are more fragile than they appear:

- **Minimum bend radius** — Bending a coax cable too sharply deforms the geometry, changing Z0 at the bend. Most cables specify a minimum bend radius (typically 5-10x the cable diameter). Permanently kinked cable has permanently degraded impedance.
- **Connector care** — Keep connector interfaces clean and protected with dust caps when not in use. Contamination on the mating surfaces causes loss and inconsistent contact. Clean with isopropyl alcohol and lint-free wipes.
- **Do not step on cables** — Mechanical damage to the outer conductor (crush, kink) creates impedance discontinuities. Even if the cable still conducts DC, the RF performance may be ruined.
- **Phase stability** — Flexing a cable slightly changes its electrical length (by altering the dielectric geometry). Phase-stable cables (with special dielectric supports) are used in VNA measurements and phase-sensitive systems. Standard cables can shift by several degrees of phase when flexed.
- **Adapter quality** — Every adapter (BNC-to-SMA, N-to-BNC, etc.) adds an impedance discontinuity and loss. Minimize adapters in the signal path. Use cables with the correct connectors on each end rather than using adapters whenever possible.

## Gotchas

- **Cable loss is a one-way number, but reflections travel both ways** — If a cable has 3 dB loss and the load reflects all the power, the reflected signal sees another 3 dB of loss on the return trip. The return loss measured at the source includes 6 dB of cable attenuation on top of the load's actual return loss. This makes bad loads look acceptable through lossy cables.
- **Velocity factor varies slightly between cable batches** — Two RG-58 cables from different manufacturers may have velocity factors of 0.65 and 0.67. For phase-matched assemblies, measure the actual velocity factor of your specific cable stock.
- **BNC and SMA connectors exist in both 50 and 75 ohm versions** — They are physically compatible but electrically mismatched. Mixing them produces a 6 dB return loss at every interface. The 75 ohm BNC has a narrower center pin, but hand-feel is not a reliable way to distinguish them. Check the markings.
- **UHF/PL-259 connectors are not RF connectors** — Despite the name "UHF," PL-259 connectors have no controlled impedance and are essentially useless above 150-300 MHz. They persist in amateur radio by tradition, not merit.
- **Cable assemblies degrade over time** — Connector wear, moisture ingress, UV damage to the jacket, and repeated flexing all increase loss and impedance irregularities. Test cable assemblies periodically in critical applications, and replace cables that show degraded return loss.
- **Do not coil excess cable at RF** — A coil of cable acts as an inductor at lower frequencies and a common-mode choke. If you have excess cable length, route it in a non-inductive pattern (figure-8) or cut it to length. Excess cable also adds unnecessary loss.
