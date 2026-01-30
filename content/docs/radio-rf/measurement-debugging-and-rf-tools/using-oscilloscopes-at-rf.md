---
title: "Using Oscilloscopes at RF"
weight: 30
---

# Using Oscilloscopes at RF

Oscilloscopes show voltage versus time — the time-domain view of a signal. At audio and low frequencies, this is the most natural way to observe a circuit. At RF, the oscilloscope becomes less useful for signal analysis but remains valuable for specific tasks: observing modulation envelopes, measuring pulse timing, catching transient events, and verifying that an oscillator is actually running. The key is understanding what the scope can and cannot tell you at RF frequencies.

## Bandwidth: The Hard Limit

An oscilloscope's bandwidth is the frequency at which its response drops by 3 dB — the displayed amplitude is 70.7% of the actual amplitude. This is not a cliff; it's a gradual rolloff. At the rated bandwidth, you're already measuring 30% low. At twice the bandwidth, the signal is severely attenuated and distorted.

Practical consequences for common oscilloscope bandwidths:

| Scope Bandwidth | Reliable Measurement Range | Marginal Range | Useless Above |
|---|---|---|---|
| 50 MHz | DC – 15 MHz | 15 – 50 MHz | 50 MHz |
| 100 MHz | DC – 30 MHz | 30 – 100 MHz | 100 MHz |
| 350 MHz | DC – 100 MHz | 100 – 350 MHz | 350 MHz |
| 1 GHz | DC – 300 MHz | 300 MHz – 1 GHz | 1 GHz |

The rule of thumb is that reliable amplitude measurements require 3-5x the signal frequency in oscilloscope bandwidth. A 100 MHz scope can measure a 30 MHz signal's amplitude with reasonable accuracy but will show a 100 MHz sine wave at only 70% of its true amplitude and will completely mangle a 100 MHz square wave (because the harmonics that define the square shape are at 300, 500, 700 MHz — far beyond the bandwidth).

## Probe Bandwidth and Loading

The probe is often the weakest link. A standard 10:1 passive probe is rated for a certain bandwidth (typically 100-500 MHz), but this rating assumes it's connected to the oscilloscope it was designed for. The probe's input capacitance — typically 10-15 pF for a passive probe — forms a low-pass filter with the circuit's source impedance.

At 100 MHz, 12 pF of probe capacitance has an impedance of about 133 ohms. If the circuit you're probing has a source impedance of 50 ohms, the probe loads it significantly — the voltage at the probe tip drops, and the circuit behavior changes. At 500 MHz, that 12 pF looks like 27 ohms, essentially shorting out many RF circuits.

The ground lead makes things worse. The standard ground clip and wire that come with every oscilloscope probe form an inductor of roughly 20-25 nH. At 100 MHz, this inductance has an impedance of about 15 ohms and resonates with the probe capacitance somewhere in the 100-300 MHz range. At resonance, the ground lead rings, creating overshoot and oscillation artifacts that look like they're part of the signal but are entirely probe-induced.

## Active Probes: The RF Solution

Active probes place a buffer amplifier right at the probe tip, presenting very low capacitance (0.5-2 pF) and very short ground connections to the circuit. The amplifier drives the cable back to the oscilloscope, so cable capacitance doesn't load the circuit.

Typical active probe characteristics:

| Parameter | Passive 10:1 Probe | Active Probe |
|---|---|---|
| Input capacitance | 10-15 pF | 0.5-2 pF |
| Bandwidth | 100-500 MHz | 1-8 GHz |
| Input resistance | 10 M-ohm | 50 k-ohm to 1 M-ohm |
| Ground inductance | 20-25 nH (clip lead) | 1-3 nH (integrated tip) |
| Price | $20-100 | $500-5,000+ |

The cost is the main barrier. For occasional RF probing, a compromise is to use a passive probe with the ground clip removed, replaced by a short spring ground contact directly on the board. This reduces ground inductance from 25 nH to perhaps 3-5 nH and significantly cleans up the measurement at frequencies below 300 MHz.

## What Oscilloscopes Are Useful For at RF

Despite the limitations, oscilloscopes serve several important roles in RF work:

- **Envelope detection**: Observing the amplitude envelope of a modulated RF signal. AM modulation depth, pulse on/off timing, and burst behavior are all visible on a scope even if you can't resolve individual RF cycles.
- **Modulation waveforms**: Baseband modulation signals before they modulate the carrier — audio for FM, data for FSK, I/Q for digital modulation.
- **Oscillator startup and settling**: How long it takes an oscillator to start and stabilize. A scope shows the amplitude growing from noise to steady-state, with any initial frequency wandering visible as changing waveform periods.
- **Power supply transients**: Switching noise on the power rail that might cause problems for an RF circuit. The time-domain view shows the actual voltage spikes and their timing relative to switching events.
- **Pulse timing**: For pulsed RF systems (radar, time-domain reflectometry), the scope shows pulse width, rise time, repetition rate, and duty cycle.
- **Verifying that something is working**: Connecting a scope to an RF output quickly confirms whether an oscillator is running, a signal is present, or a circuit is dead. You don't need amplitude accuracy for this — you just need to see activity.

## What Oscilloscopes Are Not Useful For at RF

- **Spectral analysis**: The FFT function on most oscilloscopes provides a quick-look spectrum, but the dynamic range is limited to roughly 40-50 dB (compared to 100+ dB on a spectrum analyzer), and frequency resolution depends on the time capture length. Use a [spectrum analyzer]({{< relref "/docs/radio-rf/measurement-debugging-and-rf-tools/spectrum-analyzers" >}}) for frequency-domain work.
- **Impedance measurement**: An oscilloscope shows voltage, not impedance. You can estimate impedance by measuring voltage across a known load, but a [VNA]({{< relref "/docs/radio-rf/measurement-debugging-and-rf-tools/vector-network-analyzers" >}}) provides direct, calibrated impedance data.
- **Precise power measurement**: Oscilloscopes measure voltage, and converting to power requires knowing the exact impedance — which changes with frequency at RF. Use a power meter or spectrum analyzer for power measurements.
- **Frequency accuracy**: Oscilloscope timebase accuracy is typically 10-50 ppm. For a 100 MHz signal, that's 1-5 kHz uncertainty. A frequency counter or spectrum analyzer gives far better frequency accuracy.

## The FFT Function: Useful but Limited

Most modern oscilloscopes include an FFT function that computes a spectrum from the time-domain capture. This is convenient for a quick look at frequency content, but the limitations are important to understand:

- **Dynamic range**: Limited by the ADC resolution. An 8-bit oscilloscope ADC provides roughly 48 dB of dynamic range. Harmonics and spurs below -48 dBc vanish into the quantization noise.
- **Frequency resolution**: Determined by the capture time. A 10-microsecond capture gives 100 kHz resolution. Resolving closely-spaced signals requires long captures.
- **Windowing artifacts**: The FFT assumes the captured waveform repeats infinitely. Without proper windowing (Hanning, Blackman, flat-top), spectral leakage creates false sidebands around every signal.
- **No averaging across sweeps**: Unlike a spectrum analyzer, most scope FFTs show a single-shot computation. Noise looks noisy.

The FFT function is useful for answering quick questions: "Is there a 50 MHz signal present?" or "Is there obvious harmonic content?" It is not useful for quantitative spectral measurements.

## Triggering on RF Signals

Standard edge triggering works well at low frequencies but becomes unreliable at RF. A 100 MHz signal crosses the trigger threshold 200 million times per second. Minor amplitude variations or noise cause the trigger point to jitter, producing an unstable display.

Solutions for triggering at RF:

- **External trigger from a reference**: If you have a reference signal at the same frequency, use it as the external trigger source.
- **Trigger on the envelope or modulation**: For modulated signals, trigger on the lower-frequency modulation rather than the carrier.
- **Burst trigger**: For pulsed RF, trigger on the rising edge of the pulse envelope.
- **High-frequency trigger input**: Some oscilloscopes have a dedicated trigger input with higher bandwidth and better sensitivity than the standard channel inputs.

## Gotchas

- **Trusting the amplitude at RF** — If your signal frequency is above one-third of the oscilloscope bandwidth, the displayed amplitude is wrong. The scope does not warn you about this.
- **The ground clip is an antenna** — Above 30-50 MHz, the standard ground clip picks up ambient RF and radiates energy, creating measurement artifacts. Remove it and use the shortest ground path available.
- **Probe compensation matters more than you think** — An improperly compensated probe shows incorrect rise times and ringing at edges. Always check compensation at the probe's low-frequency adjustment before measuring anything.
- **50-ohm input vs 1 M-ohm input** — Many higher-bandwidth oscilloscopes offer 50-ohm input impedance. Use it for RF signals to avoid reflections on the cable between probe and scope. But never connect a DC bias or large signal to a 50-ohm input — the 50-ohm termination dissipates power and can be damaged (typically limited to 5 Vrms).
- **Aliasing on digital scopes** — If the sample rate is less than 2x the signal frequency, the scope displays a false lower frequency (alias). Most modern scopes warn about this, but in FFT mode the aliased signals can look real.
