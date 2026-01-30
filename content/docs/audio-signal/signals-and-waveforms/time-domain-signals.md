---
title: "Time-Domain Signals"
weight: 10
---

# Time-Domain Signals

A signal is a quantity that varies over time. In electronics, that usually means a voltage or current waveform — and the time-domain view is the most intuitive way to see it: amplitude on the vertical axis, time on the horizontal. This is what an oscilloscope shows you, and it's the starting point for characterizing any signal.

## Amplitude, Frequency, and Phase

The three fundamental properties of a periodic signal:

- **Amplitude** — The size of the signal. Peak amplitude is the maximum excursion from zero (or from the DC offset). Peak-to-peak is the total swing from negative peak to positive peak
- **Frequency** — How many complete cycles occur per second, measured in Hz. Period (T) is the inverse: T = 1/f. A 1 kHz signal has a period of 1 ms
- **Phase** — Where in its cycle a signal starts, measured in degrees or radians. Phase matters when comparing two signals of the same frequency — a 90° phase shift between voltage and current is the signature of reactive impedance

These three parameters fully describe a pure sine wave. Real signals are more complex — they're composed of multiple sinusoidal components at different frequencies, amplitudes, and phases. That's where the [frequency-domain view]({{< relref "frequency-domain-view" >}}) becomes essential.

## Periodic vs Aperiodic Signals

**Periodic signals** repeat exactly after a fixed interval. Sine waves, square waves, triangle waves, and sawtooth waves are all periodic. Their frequency content is discrete — they're composed of harmonics at integer multiples of the fundamental frequency.

**Aperiodic signals** don't repeat. Transients, noise, speech, and music are aperiodic. Their frequency content is continuous — energy is spread across a range of frequencies rather than concentrated at discrete harmonics. Analyzing aperiodic signals requires windowing and averaging (see [Transforms]({{< relref "/docs/audio-signal/dsp-fundamentals/transforms" >}})).

In practice, most real signals are quasi-periodic or aperiodic. A sustained musical note is approximately periodic; speech transitions constantly between different quasi-periodic and noise-like segments.

## Common Waveforms

| Waveform | Harmonic Content | Notes |
|----------|-----------------|-------|
| Sine | Fundamental only | The only waveform with a single frequency component. The building block of Fourier analysis |
| Square | Odd harmonics (1/n amplitude) | Fundamental + 3rd, 5th, 7th… Rich in harmonics, hence the buzzy sound. Fast edges stress bandwidth |
| Triangle | Odd harmonics (1/n² amplitude) | Harmonics roll off faster than square wave. Smoother, less high-frequency content |
| Sawtooth | All harmonics (1/n amplitude) | Both odd and even harmonics. Used in synthesis and as sweep/ramp signals |
| Pulse | Depends on duty cycle | Adjustable duty cycle changes the harmonic spectrum. At 50% duty, identical to square wave |

The harmonic content of a waveform determines how much bandwidth a system needs to reproduce it faithfully. Passing a square wave through a bandwidth-limited channel rounds off its edges — the missing harmonics are the sharp corners.

## RMS vs Peak

Different measurements of signal amplitude serve different purposes:

- **Peak** — Maximum instantaneous value. Determines headroom requirements and clipping thresholds
- **Peak-to-peak** — Total excursion. What you read directly off an oscilloscope display
- **RMS (Root Mean Square)** — The equivalent DC value that delivers the same power to a resistive load. For power calculations, RMS is what matters

For a sine wave, V_RMS = V_peak / √2 ≈ 0.707 × V_peak. This relationship only holds for sine waves. Other waveforms have different crest factors (the ratio of peak to RMS):

| Waveform | Crest Factor (peak/RMS) |
|----------|------------------------|
| Sine | √2 ≈ 1.414 |
| Square | 1.0 |
| Triangle | √3 ≈ 1.732 |
| Gaussian noise | ~3-4 (depends on clipping) |

**Why crest factor matters:** A "true RMS" meter correctly reads RMS for any waveform shape. An "average-responding" meter assumes a sine wave crest factor and gives wrong results for non-sinusoidal signals. For audio signals (complex waveforms with high crest factors), average-responding meters can underread by several dB.

## DC Offset

Many signals ride on a DC level. A microphone output might swing ±50 mV around 0 V, while an ADC input might need to be biased at mid-supply (e.g., 1.65 V for a 3.3 V system). The DC component carries no signal information in AC-coupled systems, but it determines the operating point for active devices and converter inputs.

AC coupling (a series capacitor) removes the DC component. This is useful for measurement and for connecting stages with different DC operating points, but it also introduces a low-frequency rolloff — the coupling capacitor and the load form a high-pass filter. The time constant must be long enough that the lowest signal frequency of interest passes without significant attenuation.

## Gotchas

- **Crest factor surprises** — Audio and speech signals have crest factors of 10-20 dB (peak is 10-20 dB above RMS). Designing headroom based on RMS levels leads to frequent clipping. Always check peak levels
- **Bandwidth limits shape** — A square wave only looks square if the system bandwidth is much higher than the fundamental. A 1 kHz square wave through a 5 kHz bandwidth channel looks almost sinusoidal — the harmonics that make it square have been removed
- **AC coupling hides low-frequency content** — If you're troubleshooting a signal that seems to have a wandering baseline, check if AC coupling is removing a low-frequency component you need to see. Switch to DC coupling on the oscilloscope
- **RMS of noise is not the peak** — Gaussian noise has occasional peaks 3-4× the RMS value. Designing signal swing based on noise RMS will clip the peaks. Use 3σ or 4σ for headroom calculations
- **Phase matters for interference** — Two signals of the same frequency add constructively when in phase and cancel when 180° out. This is the basis of noise cancellation, balanced signaling, and many interference problems
