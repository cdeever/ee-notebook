---
title: "Spectrum Analyzers"
weight: 10
---

# Spectrum Analyzers

A spectrum analyzer shows signal power versus frequency — the frequency-domain view that reveals what an oscilloscope cannot. Where an oscilloscope answers "what does the voltage look like over time," a spectrum analyzer answers "how much energy is present at each frequency." For RF work, this is often the more important question because harmonics, spurs, and interference are invisible in the time domain.

## How Swept-Tuned Analyzers Work

The classic spectrum analyzer is essentially a superheterodyne receiver that scans across a frequency range. A local oscillator sweeps through frequencies, mixing the input signal down to an intermediate frequency (IF) where a bandpass filter selects a narrow slice. The detector measures the power in that slice, and the display plots the result as the LO sweeps.

This architecture has been the workhorse of RF measurement for decades. The sweep approach means it captures one frequency at a time, which makes it inherently slow for wide spans but capable of excellent dynamic range. A good benchtop swept analyzer might offer 100+ dB of dynamic range — the ability to see a tiny signal sitting next to a much larger one.

The resolution bandwidth (RBW) filter defines how narrow each frequency slice is. A typical analyzer offers RBW settings from a few Hz to several MHz. The tradeoff is fundamental: narrower RBW reveals weaker signals buried in noise, but each sweep takes longer because the filter needs time to settle at each point. A 1 Hz RBW sweep across 1 GHz could take hours. A 1 MHz RBW sweep across the same range finishes in milliseconds but misses low-level signals.

## FFT-Based Analyzers

Modern spectrum analyzers often digitize the input and compute the spectrum using FFT (Fast Fourier Transform). This approach captures an entire bandwidth simultaneously — every frequency at once, rather than one at a time. The advantages are speed and the ability to capture transient events that a swept analyzer would miss.

The limitation is the analog-to-digital converter (ADC). The ADC's dynamic range, sample rate, and linearity set hard limits on performance. A 14-bit ADC provides roughly 84 dB of spurious-free dynamic range in theory, but real-world performance is lower. High-end FFT analyzers use advanced ADCs and processing to approach the performance of swept analyzers, but low-cost tools are notably limited.

Many modern analyzers combine both approaches: FFT for narrow spans and real-time capture, swept-tuned for wide spans and high dynamic range.

## Key Specifications

| Specification | What It Means | Typical Range |
|---|---|---|
| Frequency range | Lowest to highest frequency measurable | 9 kHz – 6 GHz (midrange), up to 50+ GHz (high-end) |
| Resolution bandwidth (RBW) | Narrowest filter width available | 1 Hz – 10 MHz |
| Dynamic range | Difference between strongest and weakest signals visible simultaneously | 70 dB (low-cost) to 120+ dB (high-end) |
| Phase noise | Close-in noise of the internal LO; limits ability to see signals near a carrier | -80 dBc/Hz to -120 dBc/Hz at 10 kHz offset |
| Displayed average noise level (DANL) | Noise floor of the analyzer itself | -130 dBm to -170 dBm (varies with RBW) |
| Amplitude accuracy | How accurate the displayed power level is | ±0.5 dB to ±2 dB |

## Reading the Display

The vertical axis is power in dBm (decibels relative to 1 milliwatt). The reference level is the top of the screen — often set to 0 dBm or +10 dBm. Each division typically represents 10 dB, so a 10-division display covers 100 dB. The horizontal axis is frequency, with the center frequency and span labeled.

Key display elements to understand:

- **Noise floor**: The baseline level across the bottom of the display. Signals below this cannot be seen. The noise floor drops as you narrow the RBW.
- **Markers**: Movable indicators that read out exact frequency and power at a point. Use delta markers to measure the difference between two points.
- **Reference level**: The power level at the top of the screen. Setting it too high wastes dynamic range; setting it too low risks compressing or clipping strong signals.

A common learning exercise: connect a signal generator outputting -20 dBm at 100 MHz, and observe the fundamental, second harmonic (200 MHz), and third harmonic (300 MHz). The harmonic levels tell you about the generator's distortion and the analyzer's own spurious responses.

## Low-Cost Spectrum Analysis

The SDR (software-defined radio) approach uses a wideband receiver (like an RTL-SDR at $25) connected to software that computes and displays the spectrum. This works surprisingly well for relative measurements — comparing antenna performance, identifying interfering signals, or observing modulation. The limitations are significant: dynamic range is typically 50-60 dB, amplitude accuracy is poor without calibration, and frequency accuracy depends on the oscillator quality.

The tinySA is a dedicated low-cost spectrum analyzer (under $100 for the Ultra version) covering up to 5.3 GHz. It is genuinely useful for learning and for situations where ±3 dB accuracy and 70 dB dynamic range are sufficient. It will show you harmonics, verify that a filter is working, and help identify gross problems. It will not replace a proper analyzer for compliance testing, precise noise measurements, or characterizing high-performance circuits.

## What to Look For

When you connect a signal to a spectrum analyzer, the common things to check include:

- **Harmonics**: Integer multiples of the fundamental frequency. A transmitter at 145 MHz will have harmonics at 290, 435, 580 MHz, etc. Regulations typically require harmonics to be suppressed 40-60 dB below the fundamental.
- **Spurs (spurious emissions)**: Signals at unexpected frequencies, often caused by mixing products, oscillator leakage, or intermodulation. They appear as discrete spectral lines.
- **Occupied bandwidth**: How wide the signal actually is. A nominally 200 kHz FM signal might occupy 250 kHz with deviation and modulation.
- **Noise floor elevation**: If the noise floor rises when you turn the device on (vs. off), the device is contributing broadband noise.
- **Phase noise skirts**: Close-in noise spreading out from a carrier, visible as a "skirt" around the main signal. Indicates oscillator quality.

## Gotchas

- **Overloading the input** — Spectrum analyzers have maximum input levels (typically +30 dBm for benchtop, +10 dBm for low-cost). Exceeding this damages the input mixer. Always use an attenuator when measuring transmitters.
- **RBW hiding signals** — If the RBW is wider than the spacing between two signals, they merge into one blob. Narrow the RBW before concluding that a signal is "clean."
- **Sweep speed artifacts** — Setting the sweep too fast with a narrow RBW produces amplitude errors and false readings. Most analyzers warn about uncalibrated sweeps, but low-cost tools may not.
- **Input impedance assumptions** — Spectrum analyzers are 50-ohm instruments. Connecting them to a 75-ohm cable or a high-impedance circuit introduces a mismatch error of about 0.2 dB (50/75 ohm) or much worse for arbitrary impedances.
- **Cable loss is real** — A 3-foot RG-174 cable at 1 GHz loses about 1.5 dB. That loss makes your signal look weaker than it actually is. Characterize your cables or use short, low-loss connections.
- **Confusing analyzer artifacts with real signals** — Every analyzer generates its own internal spurious responses. If a signal disappears when you change the center frequency but keep the same input, it might be an analyzer artifact, not a real signal.
