---
title: "Measuring Antennas Without a Lab"
weight: 70
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Measuring Antennas Without a Lab

Professional antenna characterization involves anechoic chambers, calibrated probe arrays, and six-figure test equipment. Most of us don't have that. The good news is that a huge amount can be learned about an antenna's behavior with modest equipment -- a NanoVNA, some basic connectors, and careful technique. The bad news is that some antenna properties (particularly radiation patterns and absolute gain) are very difficult to measure without specialized facilities. Knowing what can and cannot be measured at home is the first step.

## What a NanoVNA Reveals

The NanoVNA and similar low-cost vector network analyzers (LiteVNA, SAA-2N, etc.) measure the complex reflection coefficient (S11) at their port. From S11, they calculate and display impedance, VSWR, return loss, and Smith chart plots. This is the single most useful measurement for antenna work.

**What S11 provides:**

- **Resonant frequency**: where the reactance crosses zero (or VSWR reaches a minimum)
- **Impedance at resonance**: the real part indicates whether matching is needed
- **Bandwidth**: the frequency range where VSWR stays below the target threshold (typically 2:1)
- **Multiple resonances**: broadband antennas or multi-band antennas show multiple VSWR dips
- **Effect of modifications**: trim, tune, add matching components, and see the result immediately

**What S11 does not reveal:**

- **Radiation pattern**: the VNA has no idea where the power goes after leaving the antenna
- **Absolute gain**: S11 measures match quality, not radiated power
- **Efficiency**: a perfectly matched dummy load has S11 = -infinity dB (perfect match) but zero radiation

A NanoVNA costs $30-100 depending on the version and provides about 80% of what is needed for antenna development. It is the first instrument to acquire for antenna work.

## VSWR Measurements

VSWR is the most common antenna measurement, and it's easy to do correctly — but also easy to do incorrectly.

**Doing it right:**

1. Use a calibration kit (short, open, load) matched to the connector type
2. Calibrate at the cable end, not at the VNA port — this removes the cable's effect
3. Use quality connectors (no adapters if possible, or at least high-quality adapters)
4. Connect to the antenna feedpoint as directly as possible
5. Set the frequency sweep to cover the band of interest plus margin (at least 20% extra)
6. Step away from the antenna during measurement -- body proximity affects the result

**Interpreting results:**

| VSWR Reading | What It Means | Action |
|---|---|---|
| 1.0 - 1.2:1 | Excellent match | No changes needed |
| 1.2 - 1.5:1 | Good match | Acceptable for most applications |
| 1.5 - 2.0:1 | Acceptable match | Consider matching network for transmit |
| 2.0 - 3.0:1 | Marginal | Matching needed for transmit; OK for receive |
| > 3.0:1 | Poor | Antenna has a problem or needs matching |

## Impedance Measurements

The raw complex impedance (R + jX) is more informative than VSWR alone because it reveals what kind of mismatch is present and how to fix it:

- **R > 50, X ~ 0**: antenna is resonant but has high impedance. Matching network needed (transform R down to 50).
- **R < 50, X ~ 0**: antenna is resonant but has low impedance. Matching network needed (transform R up to 50).
- **R ~ 50, X > 0**: antenna is slightly inductive (electrically long). Shorten it slightly or add a series capacitor.
- **R ~ 50, X < 0**: antenna is slightly capacitive (electrically short). Lengthen it slightly or add a series inductor.
- **R ~ 50, X ~ 0**: well matched. Done.

The Smith chart display makes these relationships visual. An impedance that is high and inductive appears in the upper right of the chart; low and capacitive appears in the lower left. The direction needed to move toward the center indicates what components to add.

## Radiation Pattern Measurement

This is the hard one. Measuring a radiation pattern requires:

1. A known transmit source (or receive probe) at a sufficient distance
2. The ability to rotate the antenna under test in azimuth and elevation
3. An environment free of reflections (open field or anechoic chamber)

**The far-field distance** (minimum measurement distance) is: d_min = 2 * D^2 / lambda, where D is the largest antenna dimension. For a half-wave dipole at 146 MHz (D ~ 1 m, lambda ~ 2 m), d_min is about 1 meter. For a 1-meter dish at 10 GHz (lambda ~ 3 cm), d_min is about 67 meters. Getting into the far field is easy for small antennas and hard for large ones.

**Practical approaches without a chamber:**

- **Rooftop or open field**: set up a transmit source (a signal generator with a reference antenna) at a distance of several wavelengths. Rotate the antenna under test and record signal strength at each angle. Works for azimuth patterns of VHF/UHF antennas. Reflections from the ground and nearby buildings limit accuracy.
- **Relative pattern**: instead of measuring absolute gain, compare different angles to each other. This gives the pattern shape (beamwidth, side lobes, nulls) without needing an absolute reference.
- **Sun noise method**: at VHF/UHF, the Sun is a strong enough noise source that the antenna's beam pattern can be measured by pointing it at the Sun and sweeping in angle. Requires a sensitive receiver but no transmitter.

For hobby purposes, exact pattern measurements are rarely needed. Knowing the approximate beamwidth and that the pattern is roughly correct is usually sufficient.

## Using a Field Strength Meter or SDR as a Relative Indicator

When measuring the pattern formally is not feasible, a relative signal indicator helps answer questions like "is this antenna better than that one?" or "which direction is the main beam pointing?"

**SDR-based approach**: tune an RTL-SDR or similar receiver to a known signal (like a local FM broadcast station or a beacon). Record the signal strength with antenna A, swap to antenna B, record again. The difference gives relative performance. This is not calibrated and is affected by multipath, but over many measurements, patterns emerge.

**Field strength meter**: a simple diode detector with a meter, held at a fixed distance from the transmitting antenna. As the transmit antenna is rotated, the meter reading changes proportionally to the field strength in that direction. This gives a rough radiation pattern without any sophisticated equipment.

**Practical tips for comparative measurements:**

- Keep everything the same except the one variable being tested
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
- Calibrate every time cables, adapters, or connector types change
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

This level of accuracy is more than adequate for building, tuning, and troubleshooting antennas. It is sufficient to determine if an antenna is resonant at the right frequency, if the match is acceptable, and whether a modification improved or degraded performance. The gaps in absolute gain and efficiency measurement are real limitations, but they do not prevent effective antenna development at the hobby level.

## Tips

- Calibrate the NanoVNA at the end of the cable that connects to the antenna, not at the VNA port -- this sets the measurement reference plane at the feedpoint
- Minimize adapter chains between the VNA and the antenna; each adapter transition adds loss and impedance uncertainty
- For comparative antenna measurements, use an SDR with signal-strength logging to collect repeatable data rather than relying on single readings
- Verify calibration by connecting the 50-ohm load standard after calibration -- it should read VSWR 1.0:1 and approximately 50 + j0 ohms

## Caveats

- **Calibrate, calibrate, calibrate** -- an uncalibrated NanoVNA gives meaningless impedance data; always calibrate before measuring, and re-calibrate if anything in the measurement path changes
- **Body proximity is an antenna perturbation** -- standing next to a VHF antenna while measuring it changes the result; use a long cable and step away, or use the NanoVNA's remote display feature
- **Adapter chains kill accuracy** -- each adapter adds loss and impedance mismatch; SMA to N to BNC to UHF is four transitions, each potentially adding error; minimize adapters and use cables with the right connectors
- **VSWR does not indicate whether the antenna is efficient** -- a matched dummy load has perfect VSWR; always consider whether the power is being radiated or dissipated; if VSWR is good but range testing shows poor performance, the antenna may have an efficiency problem
- **Cheap cables have variable impedance** -- ultra-thin, no-brand coax can have impedance variations along its length that create standing waves within the cable itself; use quality coax for measurement cables (RG-316, RG-142, or semi-rigid)
- **NanoVNA accuracy degrades above 300 MHz** -- the original NanoVNA-H is usable to ~900 MHz but increasingly inaccurate; for 2.4 GHz and above, use a NanoVNA-V2 or LiteVNA with verified accuracy at the frequency of interest

## In Practice

- Sweeping a NanoVNA across a dipole's expected band immediately reveals the resonant frequency as the VSWR minimum -- if it is off target, trimming brings it into range in a few iterations
- Comparing the VNA reading of a 50-ohm dummy load (VSWR 1.0:1) to the reading on an actual antenna highlights how much of the antenna's impedance deviates from ideal, guiding matching network design
- Rotating a Yagi while monitoring received signal strength on an SDR produces a rough azimuth pattern showing the main lobe, side lobes, and back lobe -- enough to verify correct assembly
- Measuring the same antenna with and without a string of adapters shows the cumulative effect of adapter-chain loss and mismatch, typically visible as higher VSWR and a shifted resonance
