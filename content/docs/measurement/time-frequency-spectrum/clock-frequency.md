---
title: "Is This Clock at the Right Frequency?"
weight: 10
---

# Is This Clock at the Right Frequency?

Frequency measurement is one of the most fundamental checks on any periodic signal. Clocks, oscillators, PWM outputs, data rates — when any of these are off, everything downstream misbehaves. The good news is that frequency is one of the easiest parameters to measure accurately.

## Oscilloscope Frequency Measurement

Probe the signal and get a stable, triggered display. Use the scope's auto-measurement for frequency or period. For better accuracy, measure period (scope counts time between edges) and calculate frequency: **f = 1 / T**. Measure over multiple cycles if the scope allows — averaging reduces noise in the measurement.

| Scope timebase accuracy | Typical frequency accuracy |
|------------------------|---------------------------|
| Standard crystal (50 ppm) | ±0.005% — good enough for most digital clocks |
| TCXO-equipped scope | ±1–2 ppm — suitable for audio and moderate precision |
| GPS-disciplined or rubidium reference | Sub-ppm — for characterizing oscillators |

## Hardware Frequency Counter

Some scopes include a dedicated hardware frequency counter that uses the scope's timebase directly rather than deriving frequency from the sampled waveform. This gives higher accuracy (often 6+ digits) and updates continuously. Enable it in the Measure menu, separate from auto-measurements.

## DMM Frequency Measurement

For quick frequency checks without a scope, set the DMM to frequency mode (Hz) and probe the signal. This shows the signal frequency as a single number.

DMM frequency bandwidth is limited — typically a few hundred kHz to 10 MHz depending on the meter. Above that, the reading is inaccurate or the meter won't register. The DMM also needs enough signal amplitude to trigger its comparator.

## Checking Specific Oscillator Types

**Crystal oscillators** should be within ±50 ppm of marked frequency at room temperature. If way off (> 1000 ppm), the crystal may have been damaged or load capacitors are wrong values. Probing the crystal pins with a scope can stop oscillation due to capacitive loading — probe the oscillator's output buffer instead.

**RC oscillators** have frequency determined by R and C values with tolerances of ±1–20%. A 555 or RC relaxation oscillator at ±10% of expected frequency is probably fine — the components are within tolerance.

**PLLs** have output frequency dependent on reference frequency, divider ratios, and VCO tuning range. Check the reference clock first if the output is wrong. A PLL that can't lock shows an unstable or wildly fluctuating frequency.

## Tips

- For better accuracy, measure period and calculate frequency — scope counts time between edges directly
- Watch the measurement over time to detect drift as oscillators warm up
- Use hardware frequency counter function if available for highest accuracy

## Caveats

- Auto-frequency measurement can be wrong on signals with multiple zero crossings (ringing, noise, distorted waveforms) — the scope triggers on extra edges and gives a too-high frequency reading
- Scope frequency accuracy is limited by the timebase — a 50 ppm timebase error means a 10 MHz reading could be off by 500 Hz
- Low-frequency signals require long acquisition times for accurate period measurement — a 1 Hz signal needs at least 1 second of capture
- Temperature affects all oscillators — crystal oscillators drift tens of ppm across the operating range; RC oscillators drift hundreds or thousands of ppm
- Startup time matters — some oscillators take milliseconds to seconds to stabilize; don't judge frequency during the startup transient

## Bench Relevance

- Frequency off by a large amount (>1%) on a crystal oscillator indicates wrong crystal, wrong load capacitors, or crystal damage
- Frequency drifting continuously indicates oscillator hasn't stabilized or has a temperature problem
- Wildly fluctuating frequency on a PLL indicates it can't achieve lock — check reference clock, loop filter, and VCO supply
- Frequency exactly half or double expected may indicate trigger on wrong edge or divided/doubled clock
- DMM frequency reading of zero on a signal visible on the scope indicates the signal frequency exceeds the DMM's bandwidth
