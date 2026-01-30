---
title: "Sampling Theory"
weight: 10
---

# Sampling Theory

Sampling converts a continuous signal into a sequence of discrete values taken at regular intervals. The fundamental question is: how fast must you sample to preserve the original signal? The Nyquist-Shannon sampling theorem provides the answer — and its consequences are absolute. Violate the theorem and information is irreversibly destroyed. Respect it and perfect reconstruction is theoretically possible.

## The Nyquist Criterion

A bandlimited signal containing no frequencies above f_max can be perfectly reconstructed from samples taken at a rate f_s > 2 × f_max.

The minimum sampling rate (2 × f_max) is called the Nyquist rate. The frequency f_s/2 is called the Nyquist frequency — the highest frequency that can be represented at a given sample rate.

**Examples:**

| Signal | f_max | Minimum f_s | Typical f_s |
|--------|-------|-------------|-------------|
| Telephone audio | 3.4 kHz | 6.8 kHz | 8 kHz |
| CD audio | 20 kHz | 40 kHz | 44.1 kHz |
| Professional audio | 20 kHz | 40 kHz | 48 kHz, 96 kHz |
| Ultrasonic | 100 kHz | 200 kHz | 250-500 kHz |

The theorem says "greater than," not "greater than or equal to." Sampling at exactly 2× works only under mathematically ideal conditions — infinite-length signals, zero-width samples, perfect reconstruction. In practice, you always sample faster than the theoretical minimum.

## Aliasing: The Irreversible Error

When a signal contains frequencies above f_s/2 and is sampled at rate f_s, those high-frequency components appear at incorrect lower frequencies in the sampled data. This is aliasing — and it cannot be undone.

**How aliasing works:** A frequency f above f_s/2 appears in the sampled signal at f_alias = |f - n × f_s|, where n is the nearest integer. A 26 kHz tone sampled at 44.1 kHz appears at |26 - 44.1| = 18.1 kHz — an audible frequency that wasn't in the original signal.

**Visual intuition:** Think of a wagon wheel in a movie appearing to rotate backwards (the stroboscopic effect). The camera's frame rate (sampling rate) is too low to capture the true rotation speed, and the visual system interprets the undersampled motion as a lower frequency moving in the wrong direction.

**Why it's irreversible:** Once aliased, the spurious frequency is indistinguishable from a real signal at that frequency. No amount of digital processing can separate them — the information about which was real and which was aliased is gone. This is why anti-alias filtering before the ADC is mandatory (see [Analog Filtering]({{< relref "/docs/audio-signal/analog-front-ends/analog-filtering" >}})).

## Reconstruction

Converting samples back to a continuous signal requires filling in the gaps between sample points. The theorem says this is done by convolving each sample with a sinc function: sinc(t) = sin(πt)/(πt).

**The ideal reconstruction filter** is a perfect low-pass filter (a brick wall at f_s/2) — which is the sinc function in the time domain. This is physically unrealizable because:

- The sinc function extends infinitely in both directions (requires future samples — non-causal)
- It's infinitely long (requires infinite computation)
- A perfect brick-wall frequency response is impossible with real components

**Practical reconstruction:** Real DACs use practical approximations:

- **Zero-order hold (ZOH)** — The simplest: hold each sample value until the next sample. This creates a staircase waveform with a sinc-shaped frequency rolloff (the ZOH sinc droop). A compensation filter or analog post-filter smooths the output
- **Linear interpolation** — Draw straight lines between samples. Better than ZOH but still imperfect
- **Oversampling + digital filter** — Interpolate additional samples digitally (upsampling), then use a gentle analog filter. This is how modern audio DACs work — see [Digital-to-Analog Converters]({{< relref "digital-to-analog-converters" >}})

## Practical Departures from Theory

The sampling theorem assumes ideal conditions that real systems don't provide:

**Finite signal duration** — The theorem applies to infinite-length signals. Real signals have beginnings and ends, which means they're not truly bandlimited (truncation creates spectral splatter). Windowing functions manage this tradeoff.

**Non-ideal sampling** — Real sample-and-hold circuits take a finite time to acquire the signal (aperture time) and have uncertainty in exactly when the sample is taken (aperture jitter). Both introduce errors — see [Clocking & Jitter]({{< relref "/docs/audio-signal/practical-signal-reality/clocking-and-jitter" >}}).

**Quantization** — The theorem assumes continuous amplitude values. Real ADCs quantize to discrete levels, adding quantization noise — see [Quantization Effects]({{< relref "/docs/audio-signal/practical-signal-reality/quantization-effects" >}}).

**Oversampling in practice** — Sampling at exactly 2× f_max requires a theoretically perfect (infinite-order) anti-alias filter with a brick-wall cutoff. Practical sampling rates are higher — 2.2× to 2.5× for most applications, or much higher (64× to 256×) in oversampling converters — to allow realizable analog filters to provide adequate alias rejection.

## Gotchas

- **Aliasing is not always obvious** — An aliased signal looks perfectly legitimate in the sampled data. Without knowing the original signal content, you can't tell that a frequency component is aliased. This is why anti-alias filters are designed for worst-case, not typical conditions
- **Nyquist applies to signal bandwidth, not to the center frequency** — Bandpass sampling (undersampling) deliberately aliases a high-frequency signal to a lower frequency. A 10 MHz signal with 1 MHz bandwidth can be sampled at 2+ MHz, not 20+ MHz — but the anti-alias filter must be a bandpass filter that rejects all unwanted alias bands
- **"44.1 kHz can capture 22.05 kHz" is misleading** — Technically true, but the anti-alias filter must achieve full rejection between 20 kHz and 22.05 kHz — a transition band of only 2.05 kHz. This requires a very steep filter, which is why 44.1 kHz was a challenging design target for early CD players
- **Higher sample rates don't always help** — Sampling at 192 kHz for content that only contains energy below 20 kHz wastes storage and processing with no audible benefit. The advantage of higher rates is relaxed anti-alias filter requirements and lower latency, not extended frequency response
- **Aliasing affects noise too** — Broadband noise above Nyquist aliases back into the signal band. An anti-alias filter that only filters the signal and ignores wideband noise will have a higher-than-expected noise floor after sampling
