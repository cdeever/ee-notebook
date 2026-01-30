---
title: "Vector Network Analyzers"
weight: 20
---

# Vector Network Analyzers

A vector network analyzer (VNA) measures both the magnitude and phase of signals reflected from and transmitted through a device under test. This makes it the essential tool for characterizing impedance, filters, matching networks, antennas, and cables — anything where you need to know not just how much signal gets through, but how the signal's phase changes in the process.

## S-Parameters: The Language of RF Networks

A VNA measures scattering parameters (S-parameters), which describe how RF energy flows between ports. For a two-port device:

| Parameter | Name | What It Measures |
|---|---|---|
| S11 | Input reflection coefficient | How much signal bounces back from port 1 (related to input impedance) |
| S21 | Forward transmission | How much signal passes from port 1 to port 2 (gain or loss) |
| S12 | Reverse transmission | How much signal passes from port 2 to port 1 (isolation or reverse gain) |
| S22 | Output reflection coefficient | How much signal bounces back from port 2 (related to output impedance) |

S-parameters are complex numbers — they have both magnitude and phase. The magnitude of S11, expressed as return loss in dB, tells you how well a device is impedance-matched. The magnitude of S21 tells you the insertion loss (or gain) of the device. The phase information is what makes a VNA a "vector" analyzer rather than a scalar one, and it's essential for computing impedance, group delay, and time-domain transforms.

Return loss values to develop intuition for:

| Return Loss (dB) | VSWR | Power Reflected | Interpretation |
|---|---|---|---|
| 6 | 3.0:1 | 25% | Poor match — significant reflection |
| 10 | 1.9:1 | 10% | Acceptable for many applications |
| 15 | 1.4:1 | 3.2% | Good match |
| 20 | 1.2:1 | 1% | Very good match |
| 30 | 1.07:1 | 0.1% | Excellent match |

## What a VNA Reveals

The power of a VNA comes from the variety of measurements you can derive from S-parameters:

- **Impedance**: S11 maps directly to impedance through the Smith chart. A VNA can show you the complex impedance (R + jX) at every frequency in the sweep — essential for designing matching networks.
- **Return loss and VSWR**: Quantify how well a device (antenna, filter, amplifier input) is matched to 50 ohms. See [Impedance Matching]({{< relref "/docs/radio-rf/impedance-matching" >}}) for context on why this matters.
- **Insertion loss**: How much signal a filter, cable, or connector absorbs. A good SMA connector has less than 0.1 dB insertion loss; a bandpass filter might have 2-5 dB.
- **Group delay**: The derivative of phase with respect to frequency, measured in nanoseconds. Flat group delay means the device passes all frequencies with the same time delay. Variation in group delay distorts wideband signals.
- **Smith chart display**: Plots S11 on a chart that maps reflection coefficient to impedance. The center is 50 ohms (perfect match). Moving right increases resistance; arcs upward are inductive, arcs downward are capacitive.

## Calibration: You Cannot Skip This

VNA measurements are only as good as the calibration. The analyzer must mathematically remove the effects of cables, connectors, and its own internal imperfections before measuring the device under test.

The standard calibration procedure is SOLT — Short, Open, Load, Through:

1. **Short**: Connect a precision short-circuit standard to each port. This defines the total-reflection, 180-degree phase reference.
2. **Open**: Connect a precision open-circuit standard. This defines total reflection at 0 degrees (with fringing capacitance correction).
3. **Load**: Connect a precision 50-ohm termination. This defines zero reflection.
4. **Through**: Connect port 1 directly to port 2 (or through the test cables). This defines the transmission reference.

After calibration, the VNA mathematically subtracts the effects of cables and connectors, leaving only the device under test. Calibration is valid for the specific cables, adapters, and frequency range used during the calibration process. Change a cable, and you need to recalibrate.

The calibration plane is the physical point where the calibration standards were connected. Everything between the VNA ports and the calibration plane is "removed" by calibration. Everything beyond the calibration plane is measured.

## The NanoVNA: Affordable VNA Capability

The NanoVNA and its successors (NanoVNA-H4, NanoVNA V2 Plus4, SAA2N) have made VNA measurements accessible to hobbyists and learners for $30-100. These instruments cover DC to 1.5 GHz (original) or up to 4.4 GHz (V2 Plus4) and provide genuine two-port S-parameter measurements with Smith chart display, marker functions, and calibration.

NanoVNA capabilities and limitations:

| Characteristic | NanoVNA | Benchtop VNA |
|---|---|---|
| Frequency range | 50 kHz – 1.5 GHz (original), up to 4.4 GHz (V2) | 10 MHz – 6 GHz+ |
| Dynamic range | ~70 dB | 100-130 dB |
| Port power | ~-13 dBm (not adjustable) | -60 to +10 dBm (adjustable) |
| Number of points | 101-201 (original), up to 1024 (V2) | 10,000+ |
| Calibration | Electronic calibration via SOLT standards (included) | Electronic or mechanical cal kits |
| Price | $30-100 | $5,000-200,000 |

For learning impedance matching, checking antenna VSWR, verifying filters, and characterizing cables, the NanoVNA is genuinely capable. Its 70 dB dynamic range is sufficient for most antenna and filter work. The limitations become apparent when measuring high-isolation filters (stopband deeper than 70 dB), making precise phase measurements, or working above 1.5 GHz with the original version.

## Practical Uses

Common VNA measurement tasks on the hobbyist and learning bench:

- **Antenna VSWR**: Sweep the frequency range and look for the dip in S11 where the antenna is resonant. A good antenna shows return loss better than 10 dB across the desired bandwidth. See [Antenna Tuning Experiments]({{< relref "/docs/radio-rf/practical-rf-projects/antenna-tuning-experiments" >}}) for hands-on examples.
- **Filter characterization**: Measure S21 to see the passband shape, insertion loss, and stopband rejection. Measure S11 to see the input match.
- **Cable loss**: Connect the cable as a through device. S21 shows the loss at each frequency. A 10-foot RG-58 cable might show 1 dB loss at 100 MHz and 3 dB at 1 GHz.
- **Matching network verification**: Design a matching network on paper or in simulation, build it, and measure. The Smith chart shows exactly where the impedance lands.

## VNA vs Spectrum Analyzer vs Oscilloscope

| Question | Best Tool |
|---|---|
| What frequencies are present in a signal? | Spectrum analyzer |
| What is the impedance at each frequency? | VNA |
| What does the signal look like in time? | Oscilloscope |
| How much power is a transmitter producing? | Spectrum analyzer or power meter |
| Is my antenna matched at 145 MHz? | VNA |
| Are there spurious emissions? | Spectrum analyzer |
| What is the insertion loss of my filter? | VNA |
| What is the group delay through my cable? | VNA |

## Gotchas

- **Calibration drift** — Temperature changes and cable movement invalidate calibration. If your lab is cold in the morning and warm in the afternoon, recalibrate. On a NanoVNA, bumping a cable can shift readings by several dB.
- **Connector torque matters** — SMA connectors should be tightened to 5 in-lbs with a torque wrench. Hand-tight connections are not repeatable and can introduce 0.5+ dB errors at high frequencies.
- **Measuring through adapters** — Every adapter between the calibration plane and the DUT adds uncorrected loss and phase shift. Minimize adapters, or calibrate at the DUT reference plane.
- **Port extension is not calibration** — Port extension mathematically shifts the reference plane by adding electrical delay, but it doesn't correct for cable loss or mismatch. It's a useful approximation, not a substitute for proper calibration.
- **The NanoVNA display is small** — Use PC software (NanoVNA-Saver, NanoVNA-QT) for serious analysis. The built-in display is adequate for quick checks but makes it easy to misread markers and miss details.
- **Phase noise limits close-in measurements** — The NanoVNA's oscillator phase noise means S11 measurements very close to a deep null (better than 40 dB return loss) become unreliable. The instrument's noise floor limits what you can resolve.
