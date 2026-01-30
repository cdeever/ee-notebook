---
title: "Measuring Transmission Lines"
weight: 60
---

# Measuring Transmission Lines

Understanding transmission line theory is one thing; measuring real cables, traces, and connectors is another. Theory assumes perfect geometry and known dielectrics. Reality delivers cables with unknown velocity factors, PCB traces with etch tolerances, and connectors that may or may not be damaged. The tools for characterizing transmission lines — TDR, VNA, and even a basic oscilloscope — reveal how the physical world departs from the ideal, and learning to interpret their results is essential for RF and high-speed digital work.

## TDR: Time Domain Reflectometry

TDR is the most intuitive transmission line measurement. The idea is simple: send a fast step (or pulse) into one end of the line and watch what comes back. The amplitude and timing of reflections reveal the impedance profile along the entire length of the line.

**How it works:**
1. A step generator produces a fast-rising edge (typically 35-200 ps rise time)
2. The step launches into the line through a known impedance (usually 50 ohm)
3. A high-bandwidth sampling oscilloscope records the voltage at the launch point
4. When the step is traveling down a uniform 50 ohm line, the voltage is constant (V/2 in a matched system)
5. When the step encounters an impedance change, a reflection returns to the launch point, and the voltage changes

**Reading a TDR trace:**
- The x-axis is time, which maps to distance along the line (distance = v x time / 2, because the signal travels out and back)
- The y-axis is impedance (or equivalently, reflection coefficient)
- A flat trace at 50 ohm means a uniform, well-matched line
- An upward step indicates an increase in impedance (e.g., a narrowed trace, a connector transition, or an open circuit)
- A downward step indicates a decrease in impedance (e.g., a widened trace, excess capacitance, or a short)
- The transition time of the impedance change reveals its physical extent — a sharp step means a localized discontinuity, a gradual ramp means a tapered impedance change

**What TDR reveals:**
| Feature on TDR trace | Physical cause |
|---------------------|---------------|
| Constant level at Z0 | Uniform transmission line |
| Step up | Higher impedance: narrower trace, damaged cable, connector transition |
| Step down | Lower impedance: wider trace, solder blob, moisture ingress |
| Spike up then down | Series inductance: via, connector pin, wire bond |
| Dip down then up | Shunt capacitance: pad, connector transition, stub |
| Level at 0 ohm | Short circuit |
| Level rising to infinity | Open circuit |

**Resolution:** TDR resolution is limited by the rise time of the step generator. A 35 ps rise time can resolve features separated by about 2.5 mm in FR4. Slower rise times (common on general-purpose oscilloscopes with TDR options) resolve only larger features.

## VNA-Based Measurements

A Vector Network Analyzer (VNA) measures the complex reflection coefficient and transmission coefficient of a device under test as a function of frequency. This is the most comprehensive measurement tool for transmission lines and RF components.

**S-parameters:** The VNA measures scattering parameters:
- **S11** — Reflection at port 1 (return loss). This is Gamma as a function of frequency.
- **S21** — Transmission from port 1 to port 2 (insertion loss). This tells you how much signal gets through.
- **S22** — Reflection at port 2
- **S12** — Reverse transmission (usually equals S21 for passive, reciprocal networks)

**What you learn from S-parameters:**
- S11 magnitude shows return loss across frequency — peaks indicate frequencies where reflections are worst (resonances, mismatches)
- S21 magnitude shows insertion loss — the signal attenuation through the line or device
- S11 on a Smith chart shows the impedance as a function of frequency — you can read off whether the impedance is capacitive, inductive, or resistive at any frequency
- S21 phase shows the electrical length (phase delay) through the device

**Calibration is critical.** A VNA must be calibrated before measurements. The standard calibration procedure (SOLT: Short, Open, Load, Through) uses known impedance standards to correct for the VNA's systematic errors and the cables/connectors used. Without calibration, VNA measurements are meaningless. The reference plane (where the measurement starts) is at the calibration standard, not at the VNA ports.

**Smith chart interpretation.** The Smith chart maps complex impedance onto a circular plot. The center of the chart is Z0 (typically 50 ohm). Points above the center line are inductive; below are capacitive. The outer circle is purely reactive. A transmission line traces a circle on the Smith chart as frequency is swept — the diameter depends on the mismatch, and one full revolution corresponds to a half-wavelength of electrical length.

## Oscilloscope-Based Measurements

A regular oscilloscope cannot directly measure impedance or reflection coefficient, but it can reveal transmission line problems through indirect observations:

**Step response testing.** Drive one end of a line with a fast pulse generator and observe the waveform at both ends:
- At the source: look for reflected bumps arriving after the round-trip time
- At the load: look for the characteristic two-step waveform of a series-terminated line, or ringing of an unterminated line
- The delay between the incident and reflected pulses gives you the cable length (if you know the velocity factor) or the velocity factor (if you know the length)

**Impedance estimation.** With a known source impedance (typically 50 ohm from a pulse generator), the voltage of the initial step on the line reveals Z0:

V_initial = V_source x Z0 / (Z_source + Z0)

If V_source is 1 V (into the matched load) and V_initial is 0.5 V, Z0 = Z_source = 50 ohm. If V_initial is higher, Z0 > Z_source. This is rough but can give a quick sanity check.

**Bandwidth limitations.** An oscilloscope's bandwidth limits what you can see. A 100 MHz scope misses fast reflections and small impedance discontinuities. For meaningful transmission line work, you need at least 1 GHz bandwidth, and ideally a sampling scope or TDR option.

## Practical Field Tests

Not every situation requires a VNA or TDR. Some useful field measurements for cables and lines:

**Cable length measurement.** Send a pulse into an open-ended cable and measure the time until the reflection returns. Length = v x t_round_trip / 2. With a known velocity factor (0.66 for most polyethylene coax), you can determine cable length to within a few percent using an oscilloscope and a pulse generator.

**Velocity factor determination.** Cut a cable to a known length, measure the round-trip time, and calculate v = 2L / t. Or use a VNA to find the frequency at which the cable is exactly one-quarter wavelength (the phase of S11 crosses through 180 degrees from the cable's open end). Velocity factor = v / c.

**Continuity and faults.** TDR directly shows opens, shorts, and impedance anomalies along a cable. Even a crude TDR (fast pulse generator and oscilloscope) can locate a cable fault to within a meter or so. Professional cable analyzers (used by telecom installers) combine TDR with frequency-domain measurements for comprehensive cable characterization.

**Capacitance-based Z0 estimation.** Measure the capacitance per unit length of a cable with an LCR meter (short cable, far end open). Then:

Z0 = 1 / (v x C_per_length)

If you know the velocity factor is 0.66, and you measure 100 pF/m:

Z0 = 1 / (0.66 x 3 x 10^8 x 100 x 10^-12) = 50.5 ohm

This is a quick bench technique when a TDR or VNA is not available.

## Identifying Common Faults

| Measurement observation | Likely cause |
|------------------------|-------------|
| S11 shows deep null at specific frequency | Quarter-wave resonance in a stub or open trace |
| TDR shows gradual impedance rise along cable | Water ingress increasing dielectric constant of outer conductor |
| S21 shows increasing loss with frequency | Normal conductor and dielectric loss (check against spec) |
| S21 shows sudden loss at specific frequency | Resonant absorption — connector issue or trapped cavity mode |
| TDR shows impedance bump at connector | Damaged or improperly installed connector |
| Ringing on digital signal at specific frequency | Unterminated trace, ringing period = 2x propagation delay |
| High S11 across band with ripple | Multiple reflections from cascaded mismatches |

## Gotchas

- **VNA calibration drifts** — Temperature changes, cable flexure, and connector wear all degrade calibration accuracy. Recalibrate if anything in the setup changes, and always use phase-stable cables for the VNA ports.
- **Probe loading changes the measurement** — Connecting an oscilloscope probe to a transmission line adds capacitance (5-15 pF for a passive probe) that changes the impedance at the measurement point. Use a high-impedance active probe or a proper directional coupler for in-circuit measurements.
- **TDR rise time limits spatial resolution** — A TDR with a 200 ps step can resolve features about 15 mm apart on FR4. Closer features blur together. For sub-millimeter resolution (IC packages, via transitions), you need sub-50 ps rise times or frequency-domain techniques.
- **Cable loss masks load mismatch** — A lossy cable attenuates the reflected wave twice (once on the way out, once on the way back). A badly mismatched load on a long, lossy cable may show an acceptable return loss at the source. Always measure mismatch as close to the discontinuity as possible.
- **SMA connectors have a torque specification** — SMA connectors must be tightened to 5-8 in-lb (0.56-0.90 N-m) with a torque wrench. Hand-tight connections have inconsistent contact resistance that produces measurement artifacts, especially above 6 GHz. Over-tightening damages the connector interface.
- **Open and short calibration standards are not perfect** — They have their own parasitic capacitance and inductance, which is accounted for in the calibration model. Using an unknown open (like an unconnected cable end) as a calibration standard introduces systematic error.
