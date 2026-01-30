---
title: "Frequency-Domain View"
weight: 20
---

# Frequency-Domain View

Every signal can be decomposed into a sum of sinusoids at different frequencies, amplitudes, and phases. This is the Fourier insight, and it transforms how we think about signals: instead of asking "what is the voltage at each moment?" we ask "how much energy is at each frequency?" The frequency-domain view reveals structure that's invisible on an oscilloscope — harmonic distortion, interference, noise floors, and bandwidth limitations all become obvious on a spectrum display.

## Spectra

A **spectrum** plots amplitude (or power) against frequency. For periodic signals, the spectrum is a set of discrete lines at the fundamental and its harmonics. For aperiodic signals, the spectrum is continuous.

- **Line spectrum** — Periodic signal. Energy exists only at discrete frequencies (f₀, 2f₀, 3f₀, …). A pure sine wave has a single spectral line. A square wave has lines at all odd harmonics
- **Continuous spectrum** — Aperiodic signal. Energy is spread across a continuous range of frequencies. Noise, transients, and most real-world signals have continuous spectra
- **Power Spectral Density (PSD)** — For continuous spectra, amplitude at a single frequency is zero (energy is spread). PSD gives power per unit bandwidth (e.g., V²/Hz or dBm/Hz), which is the meaningful quantity

In practice, we estimate spectra from finite-length signals using the FFT (see [Transforms]({{< relref "/docs/audio-signal/dsp-fundamentals/transforms" >}})). This introduces artifacts — spectral leakage and finite resolution — that must be understood to interpret the results correctly.

## Bandwidth

Bandwidth describes how wide a range of frequencies a signal occupies or a system can handle. The definition varies by context:

- **Signal bandwidth** — The range of frequencies containing the signal's energy. An audio signal might occupy 20 Hz to 20 kHz, giving a bandwidth of ~20 kHz
- **-3 dB bandwidth** — The frequency range where a system's response is within 3 dB of its maximum. This is the most common hardware definition
- **Noise bandwidth** — The equivalent rectangular bandwidth that passes the same total noise power. Often wider than the -3 dB bandwidth by a factor that depends on the filter shape
- **Occupied bandwidth** — The frequency range containing a specified percentage (e.g., 99%) of the signal's total power. Used in RF and communications

**Why bandwidth matters for circuits:** Every amplifier, filter, cable, and connector has a finite bandwidth. If the system bandwidth is less than the signal bandwidth, information is lost. For analog signals, this means distortion and rounding of edges. For digital signals, it means slower rise times and potential intersymbol interference.

## Frequency and Time: The Fundamental Tradeoff

You cannot simultaneously have perfect resolution in both time and frequency. This is not a measurement limitation — it's a mathematical fact (the uncertainty principle, applied to signals).

- A short time window gives good time resolution but poor frequency resolution (wide spectral bins)
- A long time window gives good frequency resolution but poor time resolution (events are averaged together)

Practical consequence: to distinguish two frequencies separated by Δf, you need at least T = 1/Δf seconds of signal. A 1-second measurement can resolve frequencies 1 Hz apart. A 10 ms measurement can only resolve frequencies 100 Hz apart.

This tradeoff drives design decisions in spectrum analyzers, audio equalizers, and any system that needs to track frequency content that changes over time. Short-time Fourier transforms (STFTs) and spectrograms are practical compromises that chop the signal into overlapping windows and analyze each one.

## Why Frequency-Domain Thinking Matters

Many circuit behaviors are most naturally described in the frequency domain:

- **Filters** are defined by their frequency response — which frequencies they pass and which they reject
- **Amplifier bandwidth** determines the highest frequency that can be amplified without significant gain loss
- **Noise** is characterized by its spectral density. The total noise in a measurement depends on the measurement bandwidth
- **Distortion** creates new frequency components (harmonics, intermodulation products) that weren't in the input. These are immediately visible in the spectrum
- **Crosstalk and interference** appear as spectral lines or raised noise floors at specific frequencies, often identifiable by their source (power supply harmonics at 50/60 Hz multiples, switching regulators at their operating frequency)

When troubleshooting, switching between time and frequency views is a powerful diagnostic technique. A glitch that's hard to characterize on an oscilloscope might be an obvious spectral spike at a known switching frequency.

## Decibels

The frequency domain almost always uses logarithmic scales — decibels (dB). This is practical, not arbitrary:

- Human perception (hearing, vision) is roughly logarithmic
- System gains and losses multiply in linear units but add in dB
- Signal levels span many orders of magnitude — a quiet room to a rock concert is a factor of 1,000,000 in power

Key relationships:

| dB | Power Ratio | Voltage Ratio |
|----|-------------|---------------|
| 0 | 1× | 1× |
| 3 | 2× | 1.41× |
| 6 | 4× | 2× |
| 10 | 10× | 3.16× |
| 20 | 100× | 10× |
| 40 | 10,000× | 100× |
| 60 | 1,000,000× | 1,000× |

**dB is a ratio, not an absolute level.** Absolute levels use a reference: dBV (ref 1 V RMS), dBu (ref 0.775 V RMS), dBm (ref 1 mW), dBFS (ref full-scale digital).

## Gotchas

- **Log frequency axis hides bandwidth** — An octave is a factor of 2 in frequency. On a log plot, every octave looks the same width. But the octave from 10 kHz to 20 kHz contains 10,000 Hz of bandwidth, while the octave from 100 Hz to 200 Hz contains only 100 Hz. Noise and distortion products at high frequencies can dominate total energy even though they look small on a log plot
- **dBFS headroom disappears fast** — In a digital system, 0 dBFS is the absolute maximum. There is no headroom above it. Analog systems can clip gracefully (soft clipping); digital systems hit a hard wall at full scale
- **Phase information is usually hidden** — Magnitude spectra discard phase. Two signals with identical magnitude spectra can sound completely different or have different time-domain shapes. Phase matters for transient response, stereo imaging, and waveform reconstruction
- **Spectral leakage is not noise** — When using the FFT, frequency components that don't fall exactly on bin centers smear across multiple bins. This leakage can look like a raised noise floor but is an artifact of the analysis window (see [Transforms]({{< relref "/docs/audio-signal/dsp-fundamentals/transforms" >}}))
- **Bandwidth ≠ highest frequency** — A bandpass system centered at 100 MHz with 1 MHz bandwidth handles frequencies from 99.5 to 100.5 MHz. Bandwidth is width, not position
