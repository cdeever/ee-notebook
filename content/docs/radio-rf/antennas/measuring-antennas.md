---
title: "Measuring Antennas Without a Lab"
weight: 70
---

# Measuring Antennas Without a Lab

Professional antenna characterization involves anechoic chambers, calibrated probe arrays, and six-figure test equipment. Most of us don't have that. The good news is that you can learn a huge amount about an antenna's behavior with modest equipment — a NanoVNA, some basic connectors, and careful technique. The bad news is that some antenna properties (particularly radiation patterns and absolute gain) are very difficult to measure without specialized facilities. Knowing what you can and can't measure at home is the first step.

## What a NanoVNA Can Tell You

The NanoVNA and similar low-cost vector network analyzers (LiteVNA, SAA-2N, etc.) measure the complex reflection coefficient (S11) at their port. From S11, they calculate and display impedance, VSWR, return loss, and Smith chart plots. This is the single most useful measurement for antenna work.

**What S11 gives you:**

- **Resonant frequency**: where the reactance crosses zero (or VSWR reaches a minimum)
- **Impedance at resonance**: the real part tells you if matching is needed
- **Bandwidth**: the frequency range where VSWR stays below your threshold (typically 2:1)
- **Multiple resonances**: broadband antennas or multi-band antennas show multiple VSWR dips
- **Effect of modifications**: trim, tune, add matching components, and see the result immediately

**What S11 doesn't tell you:**

- **Radiation pattern**: the VNA has no idea where the power goes after leaving the antenna
- **Absolute gain**: S11 measures match quality, not radiated power
- **Efficiency**: a perfectly matched dummy load has S11 = -infinity dB (perfect match) but zero radiation

A NanoVNA costs $30-100 depending on the version and gives you about 80% of what you need for antenna development. It's the first instrument to buy for antenna work.

## VSWR Measurements

VSWR is the most common antenna measurement, and it's easy to do correctly — but also easy to do incorrectly.

**Doing it right:**

1. Use a calibration kit (short, open, load) matched to your connector type
2. Calibrate at the cable end, not at the VNA port — this removes the cable's effect
3. Use quality connectors (no adapters if possible, or at least high-quality adapters)
4. Connect to the antenna feedpoint as directly as possible
5. Set the frequency sweep to cover the band of interest plus margin (at least 20% extra)
6. Step away from the antenna during measurement — your body affects it

**Interpreting results:**

| VSWR Reading | What It Means | Action |
|---|---|---|
| 1.0 - 1.2:1 | Excellent match | No changes needed |
| 1.2 - 1.5:1 | Good match | Acceptable for most applications |
| 1.5 - 2.0:1 | Acceptable match | Consider matching network for transmit |
| 2.0 - 3.0:1 | Marginal | Matching needed for transmit; OK for receive |
| > 3.0:1 | Poor | Antenna has a problem or needs matching |

## Impedance Measurements

The raw complex impedance (R + jX) is more informative than VSWR alone because it tells you what kind of mismatch you have and how to fix it:

- **R > 50, X ~ 0**: antenna is resonant but has high impedance. Matching network needed (transform R down to 50).
- **R < 50, X ~ 0**: antenna is resonant but has low impedance. Matching network needed (transform R up to 50).
- **R ~ 50, X > 0**: antenna is slightly inductive (electrically long). Shorten it slightly or add a series capacitor.
- **R ~ 50, X < 0**: antenna is slightly capacitive (electrically short). Lengthen it slightly or add a series inductor.
- **R ~ 50, X ~ 0**: well matched. Done.

The Smith chart display makes these relationships visual. An impedance that's high and inductive appears in the upper right of the chart; low and capacitive appears in the lower left. The direction you need to move to reach the center tells you what components to add.

## Radiation Pattern Measurement

This is the hard one. Measuring a radiation pattern requires:

1. A known transmit source (or receive probe) at a sufficient distance
2. The ability to rotate the antenna under test in azimuth and elevation
3. An environment free of reflections (open field or anechoic chamber)

**The far-field distance** (minimum measurement distance) is: d_min = 2 * D^2 / lambda, where D is the largest antenna dimension. For a half-wave dipole at 146 MHz (D ~ 1 m, lambda ~ 2 m), d_min is about 1 meter. For a 1-meter dish at 10 GHz (lambda ~ 3 cm), d_min is about 67 meters. Getting into the far field is easy for small antennas and hard for large ones.

**Practical approaches without a chamber:**

- **Rooftop or open field**: set up a transmit source (a signal generator with a reference antenna) at a distance of several wavelengths. Rotate the antenna under test and record signal strength at each angle. Works for azimuth patterns of VHF/UHF antennas. Reflections from the ground and nearby buildings limit accuracy.
- **Relative pattern**: instead of measuring absolute gain, compare different angles to each other. This gives you the pattern shape (beamwidth, side lobes, nulls) without needing an absolute reference.
- **Sun noise method**: at VHF/UHF, the Sun is a strong enough noise source that you can measure the antenna's beam pattern by pointing it at the Sun and sweeping in angle. Requires a sensitive receiver but no transmitter.

For hobby purposes, exact pattern measurements are rarely needed. Knowing the approximate beamwidth and that the pattern is roughly correct is usually sufficient.

## Using a Field Strength Meter or SDR as a Relative Indicator

When you can't measure the pattern formally, a relative signal indicator helps answer questions like "is this antenna better than that one?" or "which direction is the main beam pointing?"

**SDR-based approach**: tune an RTL-SDR or similar receiver to a known signal (like a local FM broadcast station or a beacon). Record the signal strength with antenna A, swap to antenna B, record again. The difference gives you relative performance. This isn't calibrated and is affected by multipath, but over many measurements, patterns emerge.

**Field strength meter**: a simple diode detector with a meter, held at a fixed distance from the transmitting antenna. As you rotate the transmit antenna, the meter reading changes proportionally to the field strength in that direction. This gives you a rough radiation pattern without any sophisticated equipment.

**Practical tips for comparative measurements:**

- Keep everything the same except the one variable you're testing
- Make measurements at the same time of day (propagation changes)
- Average multiple readings (signal strength fluctuates)
- Use a digital recording of signal strength if possible (SDR with logging)
- Don't trust a single reading — repeat at least 3 times

## Calibration and Connector Care

The biggest source of measurement error in amateur antenna work isn't the VNA — it's the connectors and cables.

**Connector issues:**

- A damaged SMA connector can add 0.5-1 dB of loss and create an unpredictable impedance mismatch
- Loose barrel connectors at adapter junctions are a common source of intermittent errors
- N-type connectors are more robust than SMA for field work but bulkier
- BNC connectors work to ~4 GHz but have higher loss than SMA above 1 GHz

**Calibration standards:**

- The NanoVNA comes with basic SOL (short-open-load) calibration standards. These are adequate for the VNA's accuracy class.
- Calibrate every time you change cables, adapters, or connector types
- The calibration reference plane is where the standards connect — that's where the measurement is valid. Use an extension cable and calibrate at the far end if the antenna is physically separated from the VNA.
- Store the calibration and verify by connecting the load standard — it should show VSWR 1.0:1 and approximately 50 + j0 ohms.

**Cable care:**

- Don't bend coax cables sharply — this changes the impedance locally and creates a reflection
- Check for continuity and short circuits before measuring
- Keep connectors clean (isopropyl alcohol and lint-free wipes)
- Replace cables that have been kinked, stepped on, or have worn connectors

## What "Good Enough" Looks Like

For learning and hobby purposes, here's what practical antenna measurements achieve:

| Measurement | Achievable Accuracy (NanoVNA) | Professional Lab |
|---|---|---|
| Resonant frequency | +/- 1-2% | +/- 0.01% |
| VSWR at resonance | +/- 0.2 | +/- 0.02 |
| Complex impedance | +/- 5-10% | +/- 1% |
| Bandwidth (VSWR < 2:1) | +/- 5% | +/- 1% |
| Radiation pattern | Rough shape only | Full 3D, 0.5 dB accuracy |
| Absolute gain | Not measurable | +/- 0.3 dBi |
| Efficiency | Crude estimate only | +/- 3-5% |

This level of accuracy is more than adequate for building, tuning, and troubleshooting antennas. You can determine if an antenna is resonant at the right frequency, if the match is acceptable, and whether a modification improved or degraded performance. The gaps in absolute gain and efficiency measurement are real limitations, but they don't prevent effective antenna development at the hobby level.

## Gotchas

- **Calibrate, calibrate, calibrate** — An uncalibrated NanoVNA gives meaningless impedance data. Always calibrate before measuring, and re-calibrate if you change anything in the measurement path.
- **Your body is an antenna perturbation** — Standing next to a VHF antenna while measuring it changes the result. Use a long cable and step away, or use the NanoVNA's remote display feature.
- **Adapter chains kill accuracy** — Each adapter adds loss and impedance mismatch. SMA to N to BNC to UHF is four transitions, each potentially adding error. Minimize adapters; use cables with the right connectors.
- **VSWR doesn't tell you if the antenna is efficient** — A matched dummy load has perfect VSWR. Always consider whether the power is being radiated or dissipated. If VSWR is good but range testing shows poor performance, the antenna may have an efficiency problem.
- **Cheap cables have variable impedance** — Ultra-thin, no-brand coax can have impedance variations along its length that create standing waves within the cable itself. Use quality coax for measurement cables (RG-316, RG-142, or semi-rigid).
- **NanoVNA accuracy degrades above 300 MHz** — The original NanoVNA-H is usable to ~900 MHz but increasingly inaccurate. For 2.4 GHz and above, use a NanoVNA-V2 or LiteVNA with verified accuracy at your frequency of interest.
