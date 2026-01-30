---
title: "Analog Filtering"
weight: 20
---

# Analog Filtering

Analog filters shape the frequency content of a signal before it reaches the converter. The most critical role is anti-aliasing — removing frequency components above the Nyquist limit so they don't fold back into the signal during sampling. But analog filters also reject interference, limit noise bandwidth, and define the useful frequency range of a signal chain. Filter design is where frequency-domain thinking meets real component constraints.

## Anti-Aliasing: The Mandatory Filter

Before an ADC samples a signal, any energy above half the sampling rate (f_s/2) must be attenuated enough that aliased components fall below the noise floor. This is not optional — aliasing is irreversible. Once aliased components are folded into the signal band, no digital processing can remove them.

**How much attenuation is enough?** The answer depends on the ADC resolution:

| ADC Bits | Dynamic Range | Required Alias Rejection |
|----------|--------------|--------------------------|
| 8 | 48 dB | ~50 dB |
| 12 | 72 dB | ~75 dB |
| 16 | 96 dB | ~100 dB |
| 24 | 144 dB | ~100-120 dB (ENOB limits) |

These numbers assume worst-case out-of-band signals at full scale. In practice, the required rejection depends on the actual spectral content — if there's nothing above Nyquist, no filter is needed. But designing for worst-case is the safe approach.

## Filter Order and Rolloff

A filter's order determines how steeply it attenuates past its cutoff frequency:

| Order | Rolloff Rate | Stages Needed |
|-------|-------------|---------------|
| 1st | -20 dB/decade | 1 RC |
| 2nd | -40 dB/decade | 1 active stage or LC |
| 3rd | -60 dB/decade | Active stage + RC |
| 4th | -80 dB/decade | 2 cascaded 2nd-order stages |

To achieve 80 dB of attenuation one octave above cutoff, you'd need a 13th-order filter at -20 dB/decade per order — impractical. Real anti-alias filters are typically 2nd to 4th order, and the transition band between passband and stopband is managed by choosing the sampling rate appropriately.

**Filter types** trade off passband flatness, transition steepness, and phase behavior:

- **Butterworth** — Maximally flat passband, moderate rolloff. The default choice when you want predictable amplitude behavior
- **Chebyshev** — Steeper rolloff than Butterworth for the same order, but with passband ripple. Useful when transition band is tight
- **Bessel** — Maximally flat group delay (best transient response), but the gentlest rolloff. Choose when waveform shape matters more than frequency selectivity
- **Elliptic (Cauer)** — Steepest rolloff for a given order, but with ripple in both passband and stopband. Maximum efficiency when sharp cutoff is the priority

See [Filters & Frequency Behavior]({{< relref "/docs/analog/filters-frequency-behavior" >}}) for analog filter implementation details.

## Filter Placement

Where the anti-alias filter sits in the signal chain matters:

- **After the preamp, before the ADC** — The standard position. The preamp amplifies the signal (and noise within its bandwidth), then the filter removes out-of-band content before sampling
- **At the sensor** — Sometimes a simple RC filter at the sensor limits bandwidth early, preventing overload from out-of-band signals (e.g., RF interference on a low-frequency sensor)
- **Multiple stages** — A first-order filter at the preamp output followed by a steeper filter before the ADC. The first filter prevents slew-rate limiting; the second provides the required stopband rejection

## Oversampling as a Strategy

Instead of building a steep analog anti-alias filter, sample at a much higher rate and use a digital filter to achieve the required selectivity. This is the oversampling approach:

- **Sample at N× the required Nyquist rate** — This moves the aliasing boundary further from the signal band, relaxing the analog filter requirements
- **Digitally filter and decimate** — A digital low-pass filter provides the steep cutoff, then the sample rate is reduced (decimated) to the required rate

At 4× oversampling, the analog filter only needs to provide adequate rejection at 4× the signal bandwidth instead of at 1×. At 64× or 128× oversampling (common in delta-sigma ADCs), a simple first-order RC filter is often sufficient.

**Tradeoff:** Oversampling requires a faster ADC, more digital processing, and more power. But it dramatically simplifies the analog filter and improves overall system performance by pushing the transition band far from the signal.

## Gotchas

- **Component tolerances shift the cutoff** — A filter designed for 20 kHz cutoff with 5% resistors and 10% capacitors might actually cut off anywhere from 16 kHz to 25 kHz. Use 1% components for precision filter work
- **Op-amp bandwidth limits filter performance** — The op-amp's open-loop gain must be much higher than the filter's Q at the cutoff frequency. A Sallen-Key filter with Q = 5 using an op-amp with only 20 dB of open-loop gain at cutoff will not behave as designed
- **Aliased noise can look like signal** — If broadband noise extends above Nyquist, it aliases back into the signal band and raises the noise floor. The anti-alias filter must attenuate noise, not just the desired signal's harmonics
- **Group delay causes waveform distortion** — Steep filters (Chebyshev, elliptic) have non-constant group delay near cutoff, which distorts transients. If you're analyzing pulse shapes or timing, Bessel filters preserve waveform fidelity
- **Passive filters have impedance interactions** — An RC filter followed by a low-impedance load changes its cutoff frequency. Buffer the filter output or account for the load in the design
- **Don't forget the input** — An anti-alias filter at the ADC input doesn't help if the ADC's sample-and-hold is exposed to high-frequency signals through other paths (e.g., digital feedthrough on the PCB)
