---
title: "Antenna Tuning Experiments"
weight: 20
---

# Antenna Tuning Experiments

Antenna theory gives you equations. Antenna building gives you humility. The theoretical half-wave dipole for 146 MHz is 97.3 cm tip to tip — but the one you build and hang in your garage resonates at 152 MHz until you trim it, and its impedance is 62 ohms instead of 73 because the ceiling is 2 meters away. Every antenna experiment is a lesson in the difference between ideal and real, and a NanoVNA turns those lessons from guesswork into data.

## Building a Half-Wave Dipole: Cut, Measure, Trim

The half-wave dipole is the simplest resonant antenna and the best starting point for antenna experiments. The procedure:

1. **Calculate the starting length**: For a half-wave dipole, each leg is approximately λ/4. The free-space formula is: length (meters) = 300 / (frequency in MHz) / 2. For 146 MHz: 300/146/2 = 1.027 m total, or 51.4 cm per leg. In practice, start about 3-5% longer (53 cm per leg) because you can always trim shorter, but you can't add wire back.

2. **Build the antenna**: Strip the end of a length of coax (RG-58 is fine for this). Connect the center conductor to one leg and the shield to the other. Use a BNC or SMA connector at the feedpoint for repeatable measurements.

3. **Mount the antenna**: Hang it at least one wavelength from the ground and away from metal objects. At 146 MHz, that's 2 meters. In practice, even 1 meter of clearance gives usable results for learning, though the impedance will be affected.

4. **Measure with a NanoVNA**: Connect the NanoVNA to the antenna feedpoint. Sweep from 130 to 160 MHz and observe S11 (return loss). The resonant frequency appears as a dip in S11 — the point where the antenna absorbs the most power and reflects the least.

5. **Trim to frequency**: If the resonant frequency is below your target (say 140 MHz instead of 146 MHz), the antenna is too long. Trim 5 mm from each leg, remeasure. Repeat until the dip aligns with your target frequency. Each trim raises the resonant frequency by roughly 1-2 MHz at VHF.

Typical results from a first dipole build:

| Measurement | Expected (Theory) | Actual (First Build) | After Trimming |
|---|---|---|---|
| Resonant frequency | 146.0 MHz | 139.5 MHz | 145.8 MHz |
| Return loss at resonance | > 20 dB | 14 dB | 18 dB |
| VSWR at resonance | < 1.2:1 | 1.5:1 | 1.3:1 |
| Impedance at resonance | 73 + j0 ohm | 58 + j12 ohm | 64 - j3 ohm |
| 2:1 VSWR bandwidth | ~8 MHz | ~6 MHz | ~7 MHz |

The "actual" column reflects real-world effects: proximity to objects, wire thickness (velocity factor), feedpoint construction, and measurement cable effects.

## Using a NanoVNA for Antenna Measurement

The NanoVNA is the essential tool for antenna experiments. Connect it to the antenna feedpoint with a short, known coax cable. Calibrate at the end of the cable (not at the NanoVNA ports) so that the calibration plane is at the antenna feedpoint.

Key measurements to take:

- **S11 magnitude (return loss)**: Shows the frequency of best match as a dip. Deeper is better — a dip to -20 dB means only 1% of power is reflected.
- **VSWR**: Derived from S11. A VSWR of 2:1 or better across the desired frequency range is the common target.
- **Smith chart**: Shows the complex impedance at every frequency. At resonance, the impedance should be near the center of the chart (50 ohms). If it's off to the right, the antenna's radiation resistance is higher than 50 ohms. If it's on the upper half, there's inductive reactance (antenna is too long). Lower half means capacitive reactance (antenna is too short).
- **Impedance readout (R + jX)**: The NanoVNA can display the resistance and reactance components directly. At resonance, X should be close to zero. R should be close to 50 ohms for a good match.

## Effect of Height Above Ground

Antenna impedance and resonant frequency change dramatically with height above ground. The ground acts as a reflector, and the antenna plus its image in the ground form a two-element array. The interaction depends on the height in wavelengths.

Experimental data from a 146 MHz dipole at various heights above earth ground:

| Height Above Ground | Resonant Frequency | Impedance at Resonance | Return Loss |
|---|---|---|---|
| 0.5 m (0.24λ) | 148.2 MHz | 38 + j5 ohm | 11 dB |
| 1.0 m (0.49λ) | 145.1 MHz | 72 - j8 ohm | 13 dB |
| 1.5 m (0.73λ) | 146.3 MHz | 56 + j2 ohm | 22 dB |
| 2.0 m (0.97λ) | 145.8 MHz | 68 - j4 ohm | 15 dB |
| 3.0 m (1.46λ) | 146.0 MHz | 70 + j1 ohm | 16 dB |

The pattern shows significant variation at low heights, converging toward the free-space values as height increases. At half a wavelength above ground (~1 m at 146 MHz), the impedance peaks — this is the well-known half-wave height effect.

The practical lesson: always test the antenna at its intended installation height, not on a bench or table. An antenna that's perfectly matched at 1.5 meters may have 3:1 VSWR at 0.5 meters.

## Adding a Ground Plane to a Monopole

A quarter-wave monopole over a ground plane is a practical antenna for VHF and UHF. The ground plane can be a metal surface, a set of radial wires, or even the ground plane of a PCB.

Experiment: build a quarter-wave monopole (25.7 cm for 292 MHz, or about half that for 2 meter band when accounting for velocity factor) and measure it with and without ground plane radials.

**Without ground plane** (monopole alone on a coax connector): The impedance is unpredictable and varies wildly with cable position. The return loss may show a vague dip somewhere near the expected frequency, but the match is poor and irreproducible. The coax shield becomes part of the antenna, and moving the cable changes the measurement.

**With four ground plane radials at 90 degrees**: The impedance stabilizes. A quarter-wave monopole over an infinite ground plane has a theoretical impedance of 36 ohms. With four radials, the impedance is typically 40-50 ohms — close enough for a good match. The resonant frequency is more predictable and the measurement is repeatable.

**With radials bent downward at 45 degrees**: Bending the radials down raises the impedance toward 50 ohms, improving the match. This is the principle behind the "ground plane antenna" design common in amateur radio.

## Loading Coil Experiments

When an antenna is physically shorter than the required resonant length, a loading coil (series inductor) can be added to compensate for the missing length by adding inductive reactance.

Experiment: Start with a monopole that's 60% of the quarter-wave length for the target frequency. Measure the impedance — it will be capacitive (negative reactance). Add a coil in series and observe the effect on the Smith chart.

For example, a 15 cm monopole at 146 MHz (full quarter-wave is 51 cm) has a capacitive reactance of roughly -j150 ohms. Adding a coil of approximately 0.16 uH (which has +j150 ohms reactance at 146 MHz) cancels the capacitive reactance and brings the antenna closer to resonance.

Practical observations:

- The coil adds loss — the radiation efficiency drops. A loaded antenna is always less efficient than a full-size antenna. Typical efficiency loss with a loading coil is 1-3 dB.
- Coil placement matters: a coil at the base is easiest to build but least efficient. A coil at the center of the radiator or higher up is more efficient but mechanically more complex.
- The bandwidth narrows significantly with loading. A full-size quarter-wave monopole might have 10 MHz of 2:1 VSWR bandwidth. The same antenna loaded to 60% of full size might have only 3-4 MHz bandwidth.
- Winding the coil on a lossy form (like PVC pipe) adds more loss than an air-wound coil. Use polystyrene, PTFE, or air-core at VHF.

## Comparing Commercial Antenna vs Homebrew

A useful experiment: measure a commercial antenna (like a Diamond X50 dual-band vertical or a Nagoya NA-771 handheld antenna) on the NanoVNA, then build a homebrew antenna for the same frequency and compare.

Typical comparison results at 146 MHz:

| Parameter | Commercial Antenna | Homebrew Dipole | Homebrew Ground Plane |
|---|---|---|---|
| VSWR at 146 MHz | 1.2:1 | 1.3:1 | 1.4:1 |
| 2:1 VSWR bandwidth | 6 MHz | 7 MHz | 5 MHz |
| Gain (relative to dipole) | +2 dBd (if collinear) | 0 dBd (reference) | -0.5 dBd |
| Mechanical quality | Weatherproof, robust | Fragile, indoor only | Moderate |
| Cost | $30-80 | $2 | $5 |

The homebrew antenna's electrical performance is often surprisingly close to the commercial antenna. The commercial antenna's advantages are mechanical durability, weatherproofing, and often higher gain from collinear elements — not necessarily a better impedance match.

## What to Expect vs What Actually Happens

The gap between theory and practice in antenna work is consistently larger than expected. Some recurring themes:

- **Everything nearby affects the antenna**: The wooden table, the coax cable, your hand, the NanoVNA itself. Moving the coax cable 10 cm changes the VSWR reading. This is normal.
- **Resonance is sharper than you think**: A well-matched antenna at 146.0 MHz may be poorly matched at 147.5 MHz. The usable bandwidth is often narrower than beginners expect.
- **The feedline is part of the system**: An antenna that's perfectly resonant at its feedpoint can show a different impedance at the other end of the coax because of cable loss and transformation effects. See [Transmission Lines]({{< relref "/docs/radio-rf/transmission-lines" >}}) for why this happens.
- **SWR is not the whole story**: A dummy load has perfect SWR (1.0:1) and zero gain. SWR tells you about impedance match, not radiation effectiveness. A well-matched antenna that's horribly inefficient is worse than a slightly mismatched efficient antenna.

## Gotchas

- **Measuring with the antenna on the bench** — An antenna lying on a table is not the same antenna as one mounted in free space. Measure at the intended installation height and position, not on the workbench.
- **Coax cable acting as part of the antenna** — Common-mode current on the outside of the coax shield makes the cable radiate. A ferrite choke (common-mode choke or "ugly balun") at the feedpoint reduces this effect. Without it, moving the coax changes the antenna measurement.
- **NanoVNA port extension errors** — If you calibrate at the NanoVNA ports but measure through a 1-meter cable, the cable's loss and phase shift are included in the measurement. Calibrate at the cable end (at the antenna feedpoint) for accurate results.
- **Trimming too aggressively** — It's easy to overshoot. Trim 3-5 mm at a time at VHF, remeasure after each cut. Once the antenna is too short, you need to start over or add a matching network.
- **Ignoring velocity factor of the wire** — Insulated wire has a lower velocity factor (typically 0.95-0.97) than bare wire. The antenna will be electrically longer than its physical length, resonating at a lower frequency than the bare-wire formula predicts.
- **Assuming the Smith chart shows impedance at the antenna** — If you haven't calibrated at the feedpoint, the Smith chart shows the impedance at the calibration plane (possibly at the NanoVNA port), transformed by the cable. This is a different impedance and a common source of confusion.
