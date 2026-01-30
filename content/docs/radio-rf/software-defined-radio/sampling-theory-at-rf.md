---
title: "Sampling Theory at RF"
weight: 30
---

# Sampling Theory at RF

Sampling theory is the bridge between the continuous analog world and the discrete digital world. At audio frequencies, the rules are straightforward — sample at twice the bandwidth. At RF, the same rules apply, but the numbers are larger, the consequences of getting it wrong are more severe, and a technique called bandpass sampling turns aliasing from an enemy into a tool. Understanding sampling at RF is essential for knowing what your SDR can and cannot do.

## Nyquist: The Fundamental Rule

The Nyquist-Shannon sampling theorem states: to perfectly reconstruct a signal, you must sample at a rate of at least twice the signal's bandwidth. Not twice the highest frequency — twice the bandwidth.

For a baseband signal (one that starts at DC and extends to some maximum frequency f_max), the minimum sample rate is 2 * f_max. This is the familiar case: audio signals up to 20 kHz need at least 40 kHz sampling (CD audio uses 44.1 kHz with some margin).

For an I/Q SDR signal centered on zero frequency (after downconversion), the complex sample rate equals the usable bandwidth. A 2.4 MSPS I/Q stream captures 2.4 MHz of bandwidth. This is because the complex (I/Q) representation eliminates the negative frequency ambiguity that halves the bandwidth of real-valued sampling.

## Bandwidth, Not Center Frequency

This distinction is critical for understanding SDR. You do not need to sample at twice the center frequency — you need to sample at twice the signal bandwidth.

An FM broadcast station at 100 MHz has about 200 kHz of bandwidth. After analog downconversion to baseband, you need only about 400 kHz sample rate (or 200 kHz complex sample rate) to capture it fully. You do not need to sample at 200 MHz.

This is exactly what an SDR does: the analog front end downconverts the signal of interest to baseband (or a low IF), and the ADC samples this much lower frequency signal. The tuner handles the high frequency; the ADC handles the bandwidth.

## Bandpass Sampling (Undersampling)

Here is where RF sampling gets interesting. If you have a bandpass signal — one that occupies a narrow band centered on a high frequency — you can deliberately sample below the Nyquist rate for the center frequency and use aliasing to fold the signal down to a lower frequency.

Consider a signal centered at 70 MHz with 10 MHz bandwidth (occupying 65-75 MHz). The Nyquist rate for the highest frequency is 150 MHz. But if you sample at just 20 MSPS, the 65-75 MHz band aliases down to 5-15 MHz — perfectly captured with no information loss, as long as nothing else occupies the 5-15 MHz alias band.

Conditions for bandpass sampling to work:
- The signal bandwidth must be less than half the sample rate (B < fs/2)
- The alias bands must not overlap (the signal and its aliases must not fold onto each other)
- No unwanted signals can be present in any alias band — they will fold in on top of your desired signal

The third condition is why analog anti-alias filtering is critical in bandpass sampling systems. Any signal in any of the alias bands — noise, interference, or spurious signals — folds into the same digital frequency range as the desired signal and cannot be removed.

## Anti-Alias Filtering

The analog filter before the ADC is the most important filter in the system. Its job is to ensure that only the desired band reaches the ADC — everything else must be attenuated enough that it does not contribute visible artifacts when aliased.

For baseband sampling, this is a low-pass filter at half the sample rate. For bandpass sampling, this is a bandpass filter centered on the signal of interest.

How much attenuation is "enough" depends on the ADC resolution. For an 8-bit ADC with ~48 dB of dynamic range, the filter needs to attenuate out-of-band signals by at least 48 dB — anything weaker than the quantization noise floor is irrelevant. For a 16-bit ADC with ~96 dB range, the filter must provide 96 dB of rejection, which is a very demanding specification.

In an RTL-SDR, the R820T tuner chip contains a tunable bandpass filter that provides moderate selectivity before the 8-bit ADC. The limited filter rejection is one reason strong out-of-band signals can degrade RTL-SDR performance — the filter does not attenuate them enough to keep them below the ADC's dynamic range.

## Quantization Noise

When an ADC converts an analog signal to digital, it rounds each sample to the nearest quantization level. The error between the actual voltage and the quantized value is quantization noise. For a uniform ADC, the theoretical signal-to-noise ratio is:

**SNR (dB) = 6.02 * N + 1.76**

Where N is the number of bits. This gives:

| ADC Bits | Theoretical SNR | Approximate Dynamic Range |
|----------|----------------|--------------------------|
| 8 | 49.9 dB | ~48 dB |
| 10 | 62.0 dB | ~60 dB |
| 12 | 74.0 dB | ~72 dB |
| 14 | 86.1 dB | ~84 dB |
| 16 | 98.1 dB | ~96 dB |
| 24 | 146.2 dB | ~144 dB (theoretical only) |

Real ADCs never achieve their theoretical SNR due to thermal noise, nonlinearity, and clock imperfections. A 16-bit ADC might achieve 80-85 dB of actual SNR (expressed as SINAD or ENOB — effective number of bits). The gap between theoretical and actual performance widens at higher sample rates and higher input frequencies.

## Processing Gain from Oversampling

Sampling faster than necessary provides a real benefit: processing gain. By oversampling and then decimating (averaging and reducing the sample rate), the noise floor drops because quantization noise is spread across a wider bandwidth and then filtered out.

The rule: every factor of 4 in oversampling provides approximately 6 dB of SNR improvement (equivalent to 1 additional bit of resolution).

| Oversampling Factor | SNR Improvement |
|--------------------|----------------|
| 4x | ~6 dB (+1 effective bit) |
| 16x | ~12 dB (+2 effective bits) |
| 64x | ~18 dB (+3 effective bits) |
| 256x | ~24 dB (+4 effective bits) |

This is why some SDR architectures deliberately oversample. A 1-bit sigma-delta ADC sampling at hundreds of MHz, combined with digital decimation filtering, can achieve 16+ effective bits of resolution at a much lower output sample rate. This is common in modern receiver ICs.

For a practical example: an 8-bit RTL-SDR sampling at 2.4 MSPS has about 48 dB of instantaneous dynamic range across the full 2.4 MHz bandwidth. If you only need 10 kHz of bandwidth for an FM channel, you are effectively oversampling by 240x. The decimation process narrows the noise bandwidth and provides roughly 24 dB of processing gain, bringing the effective dynamic range to about 72 dB for that 10 kHz channel — much more usable.

## Real ADC Limitations

Beyond quantization noise, real ADCs face several challenges at RF:

**Aperture jitter:** The ADC samples at slightly irregular time intervals due to clock uncertainty. This time jitter translates directly to voltage error for high-frequency signals. A sine wave at frequency f with jitter of delta_t has an SNR ceiling of:

**SNR_jitter (dB) = -20 * log10(2 * pi * f * delta_t)**

At 100 MHz with 1 ps of jitter, the SNR ceiling is about 64 dB. No amount of ADC bits helps beyond this limit. At 1 GHz with the same jitter, the ceiling drops to 44 dB. This is why clock quality matters enormously at RF — a noisy clock limits performance regardless of ADC resolution.

**Clock phase noise:** The spectral purity of the sampling clock directly affects the noise floor around any signal. A clock with poor phase noise spreads noise skirts around every digitized signal, obscuring weak signals near strong ones.

**Spurious-free dynamic range (SFDR):** Real ADCs produce spurious signals (harmonics, intermodulation products) at specific frequencies related to the input signal. SFDR measures the distance from the signal to the strongest spurious component. A 12-bit ADC might have 80 dB SFDR — better than its 72 dB SNR — meaning spurious tones are below the noise floor.

## Gotchas

- **Aliasing is invisible once it happens** — If an unwanted signal aliases into your band of interest, it looks exactly like a real signal at the aliased frequency. You cannot tell the difference after digitization. Anti-alias filtering must happen in analog, before the ADC.
- **Oversampling helps SNR but not SFDR** — Processing gain from oversampling improves the noise floor but does not remove spurious tones from ADC nonlinearity. Spurs fold into the decimated output and remain visible.
- **Clock quality limits high-frequency performance** — At RF frequencies, aperture jitter and phase noise often limit dynamic range more than ADC bit count. An 8-bit ADC with a superb clock can outperform a 12-bit ADC with a mediocre clock at high frequencies.
- **Sample rate determines bandwidth, not frequency range** — An SDR with 2.4 MSPS can tune to any frequency its front end supports but only sees 2.4 MHz at a time. To observe a wider band, you need a higher sample rate or must scan across frequencies sequentially.
- **Decimation requires computation** — The processing gain from oversampling is not free. The digital decimation filter must process every sample at the full rate before outputting at the reduced rate. Higher oversampling ratios demand more computational power.
- **The 6.02N + 1.76 formula assumes ideal conditions** — Real ADCs with real clocks at real frequencies rarely achieve theoretical SNR. Use ENOB (effective number of bits) from the datasheet, measured at your frequency of interest, not the headline bit count.
