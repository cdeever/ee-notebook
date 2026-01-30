---
title: "Radiation Resistance & Efficiency"
weight: 30
---

# Radiation Resistance & Efficiency

If there's one concept that separates working antenna knowledge from textbook formulas, it's understanding where your RF power actually goes. Every watt you feed into an antenna either radiates into space (useful) or turns into heat (wasted). Radiation resistance and efficiency are the tools for reasoning about this split, and they explain why small antennas are fundamentally limited in ways that no clever engineering can fully overcome.

## Radiation Resistance Explained

Radiation resistance (R_rad) is the equivalent resistance that accounts for the power radiated by the antenna. It's defined by: P_radiated = I^2 * R_rad, where I is the current at the reference point (usually the feedpoint).

This is not a physical resistor you can measure with a multimeter. It's a mathematical abstraction that captures how much power leaves the antenna as electromagnetic radiation, expressed as an equivalent resistance. The concept works because from the generator's perspective, power radiated away looks exactly like power dissipated in a resistor — it's gone, and the generator can't tell the difference.

For common antennas, radiation resistance depends on the antenna's size relative to the wavelength:

| Antenna | R_rad | Conditions |
|---|---|---|
| Half-wave dipole | ~73 ohms | Free space |
| Quarter-wave monopole | ~36 ohms | Over perfect ground |
| Full-wave loop | ~100-120 ohms | Free space |
| Short dipole (length L << lambda) | 20 * pi^2 * (L/lambda)^2 ohms | Free space |
| Small loop (area A, circumference << lambda) | 31,171 * (A/lambda^2)^2 ohms | Free space |

The short dipole formula reveals a critical relationship: radiation resistance is proportional to (L/lambda)^2. Halving the antenna length reduces radiation resistance by a factor of four. A dipole that's 1/10 of a wavelength has a radiation resistance of about 2 ohms. At 1/20 of a wavelength, it's about 0.5 ohms.

For small loops, it's even more extreme: radiation resistance goes as the fourth power of (circumference/lambda). A small loop at 1/10 wavelength circumference has a radiation resistance in the milliohm range.

## Loss Resistance

Everything that isn't radiation resistance is loss resistance (R_loss) — power dissipated as heat in the antenna system:

- **Conductor loss**: resistance of the wire, trace, or radiating element itself. For copper wire at RF, skin effect concentrates current at the surface, increasing effective resistance. A 1 mm diameter copper wire has about 0.08 ohms per meter at DC, but about 0.26 ohms per meter at 100 MHz due to skin effect.
- **Ground system loss**: for monopole antennas, current returns through the ground plane or radial system. Imperfect ground connections have resistance.
- **Loading component loss**: if the antenna uses loading coils (to make an electrically short antenna resonant), the coil's winding resistance adds to R_loss. A loading coil for an HF mobile antenna might have Q of 200, contributing several ohms of loss resistance.
- **Dielectric loss**: in PCB antennas and patch antennas, the substrate material (FR4, Rogers, etc.) absorbs some energy. FR4 has a loss tangent of about 0.02 at 1 GHz; Rogers 4003 is about 0.0027.
- **Connection and solder joint loss**: usually negligible unless corroded or poorly made.

## Efficiency

Antenna efficiency is the ratio of radiated power to total input power:

eta = R_rad / (R_rad + R_loss)

Or equivalently: eta = P_radiated / P_input

This is usually expressed in percent or in dB (eta_dB = 10 * log10(eta)).

**Efficiency examples for common scenarios:**

| Antenna Type | R_rad | R_loss | Efficiency | Efficiency (dB) |
|---|---|---|---|---|
| Half-wave dipole, copper wire | 73 ohms | ~1.5 ohms | 98% | -0.1 dB |
| Quarter-wave monopole, good ground | 36 ohms | ~2 ohms | 95% | -0.2 dB |
| 1/4-wave mobile whip, lossy ground | 36 ohms | ~15 ohms | 71% | -1.5 dB |
| 1/10-wave loaded monopole (HF mobile) | ~2 ohms | ~8 ohms | 20% | -7 dB |
| Chip antenna (2.4 GHz, typical) | ~5 ohms | ~15 ohms | 25% | -6 dB |
| Small loop (1/20 wavelength) | ~0.05 ohms | ~0.5 ohms | 9% | -10.5 dB |
| Electrically tiny antenna (1/50 wave) | ~0.005 ohms | ~1 ohm | 0.5% | -23 dB |

The pattern is unmistakable: as antennas get smaller relative to the wavelength, efficiency drops dramatically. A full-size dipole is over 95% efficient. A 1/10-wave loaded antenna might be 20% efficient. A tiny 1/50-wave antenna is essentially a dummy load that happens to radiate a little.

## The Chu-Harrington Limit

In 1948, Lan Jen Chu derived a fundamental limit on the performance of electrically small antennas. The Chu-Harrington limit (later refined by Harrington, McLean, and others) states that for an antenna enclosed in a sphere of radius a:

**Minimum Q** (and therefore maximum bandwidth) is bounded by: Q_min ~ 1/(ka)^3 + 1/(ka), where k = 2*pi/lambda.

This means:
- Smaller antenna (smaller ka) = higher Q = narrower bandwidth
- You cannot simultaneously have small size, wide bandwidth, and high efficiency
- This is a physical law, not a technology limitation

Practical implications:

| ka (antenna size in wavelengths) | Minimum Q | Max fractional bandwidth | Character |
|---|---|---|---|
| 1.0 (large antenna) | ~2 | ~50% | No significant constraint |
| 0.5 | ~5 | ~20% | Moderate constraint |
| 0.3 | ~15 | ~7% | Noticeable limitation |
| 0.1 | ~1000 | ~0.1% | Severe — very narrowband |
| 0.05 | ~8000 | ~0.01% | Essentially single-frequency |

Any antenna manufacturer claiming small size, wide bandwidth, and high gain is either using a different definition of "small," relying on lossy matching to artificially broaden bandwidth (which destroys efficiency), or bending the truth.

## Why "Small Antenna, High Gain, Wide Bandwidth" Is Impossible

This comes directly from the Chu-Harrington limit and conservation of energy. Here's the intuitive version:

A small antenna couples weakly to the electromagnetic field — it's like trying to catch ocean waves with a teacup. To make it resonate (which helps efficiency), you need a high-Q structure, but high Q means narrow bandwidth. You can broaden the bandwidth by adding loss (resistive loading or lossy matching), but that destroys efficiency.

Gain is limited by directivity (which requires physical aperture) multiplied by efficiency. A small antenna has limited directivity (it can't form a focused beam from a structure much smaller than a wavelength) and limited efficiency. Both factors work against you.

When you see a product claiming a small, wideband, high-gain antenna, check what they're comparing against and what they're actually measuring. Often, "gain" means peak gain at the best frequency, "bandwidth" means the range where VSWR < 3:1 (which may include frequencies with terrible efficiency), and "small" is relative to their product category, not to a wavelength.

## Measuring Efficiency

Measuring antenna efficiency directly is surprisingly difficult. You can't just compare input power to radiated power because collecting all the radiated power requires integrating over a sphere — which needs an anechoic chamber or a near-field scanner.

**Methods:**

- **Wheeler cap method**: Place a metal shell (cap) over the antenna that's large enough to not affect the near fields. The cap prevents radiation, so the measured input resistance with the cap is R_loss. Without the cap, the measured resistance is R_rad + R_loss. The ratio gives efficiency. This works for small antennas and gives results within a few percent of truth.
- **Gain comparison method**: Measure the antenna's gain against a calibrated reference antenna. If you know the directivity (from simulation or pattern measurement), then efficiency = gain / directivity.
- **Radiation pattern integration**: Measure the complete 3D pattern in an anechoic chamber, integrate total radiated power, compare to input power.

For hobby purposes, the Wheeler cap method with a tin can is surprisingly practical for small antennas. Accuracy of 10-20% is achievable with care.

## Gotchas

- **Low VSWR doesn't mean high efficiency** — You can match a tiny antenna to 50 ohms perfectly and still radiate almost nothing. The matching network transforms impedance but doesn't fix the fundamental small-antenna limitations. The power just gets dissipated as heat instead of being reflected.
- **Loading coils reduce efficiency** — A coil-loaded mobile antenna is physically compact, but the coil's loss resistance adds to R_loss and reduces efficiency. Higher-Q coils (air-core, silver-plated wire) help, but the efficiency hit is inherent to the approach.
- **Antenna efficiency and system efficiency are different** — The antenna might be 80% efficient, but if the matching network has 1 dB loss and the cable has 2 dB loss, the system efficiency from transmitter to radiated power is only about 40%.
- **The Chu-Harrington limit applies to all antennas, including "revolutionary" ones** — If a startup claims to have broken the size-bandwidth-efficiency tradeoff, they haven't. They may have made a clever engineering tradeoff within the limits, but the physics hasn't changed.
- **Ground system losses are often the dominant loss** — For HF vertical antennas, improving the ground radial system often helps more than improving the antenna element itself. Going from 4 radials to 32 radials can improve efficiency by 3-6 dB.
- **FR4 substrate loss matters at GHz frequencies** — A 2.4 GHz PCB antenna on FR4 (loss tangent ~0.02) might lose 1-2 dB in the substrate alone. Low-loss substrates like Rogers or Isola make a measurable difference for efficiency-critical designs.
