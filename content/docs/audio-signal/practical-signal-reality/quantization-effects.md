---
title: "Quantization Effects"
weight: 10
---

# Quantization Effects

Quantization maps a continuous analog value to the nearest discrete digital code. This rounding introduces an error — quantization error — that can never be eliminated, only managed. For large signals, this error behaves like noise (quantization noise). For small signals, it behaves like distortion (quantization distortion). Understanding the difference, and knowing how to use dithering and oversampling to improve things, is essential for getting the most out of any digital audio or measurement system.

## Quantization Noise

For a uniformly distributed, busy (dithered or complex) signal, quantization error is approximately uniformly distributed between ±½ LSB. This error acts like additive white noise with a well-defined power:

**The fundamental formula:**

SNR_max = 6.02B + 1.76 dB

where B is the number of bits. Each additional bit adds ~6 dB of dynamic range.

| Bits | Theoretical SNR | Practical ENOB | Context |
|------|----------------|----------------|---------|
| 8 | 49.9 dB | 7-8 | Telephone, basic control |
| 12 | 74.0 dB | 10-11.5 | General instrumentation, MCU ADC |
| 16 | 98.1 dB | 13-14 | CD audio, good instrumentation |
| 24 | 146.2 dB | 17-21 | Professional audio, precision measurement |
| 32 | 194.2 dB | ~20-24 | Theoretical — limited by other noise sources |

**Why real converters don't reach theoretical SNR:** Thermal noise, clock jitter, nonlinearity, and reference noise all contribute additional noise that reduces ENOB below the stated resolution. A 24-bit converter with 120 dB SNR has an ENOB of about 20 bits — still excellent, but 4 bits below the theoretical maximum. See [Analog-to-Digital Converters]({{< relref "/docs/audio-signal/sampling-and-conversion/analog-to-digital-converters" >}}).

## Quantization Distortion

When the signal is small (spanning only a few LSBs), the rounding error is no longer random — it correlates with the signal. The result is distortion rather than noise:

- A sine wave spanning only 4 LSBs peak-to-peak is essentially a 4-level staircase. The output looks like a coarse approximation of a sine wave with visible steps
- The harmonics from this staircase are correlated with the signal frequency, producing audible distortion (harsh, metallic quality) rather than broadband noise (which sounds like hiss)

**When does quantization become distortion?** Roughly, when the signal amplitude is below about 20-30 LSBs, the quantization error starts to become correlated and audible as distortion. Above this level, it's essentially noise.

**This matters most for:** Fade-outs in audio (signal decays into the last few bits), low-level ambient recordings, and precision DC measurements near the LSB level.

## Dithering

Dithering adds a small amount of noise to the signal before quantization, deliberately randomizing the quantization error. This converts distortion into noise — a perceptually and mathematically preferable form of error.

**TPDF (Triangular Probability Density Function) dither** is the standard for audio:
- Amplitude: ±1 LSB peak (2 LSBs peak-to-peak)
- Distribution: Triangular (formed by summing two uniform random variables)
- Effect: Completely eliminates quantization distortion (all signal-correlated error). The noise floor rises by a small amount, but the distortion products disappear entirely

**Why TPDF and not uniform?** Uniform (rectangular) dither eliminates the first-order distortion but leaves a noise modulation — the noise character changes with signal level. TPDF eliminates both the distortion and the noise modulation, making the noise completely independent of the signal.

**When to dither:**
- **Always** when reducing bit depth (e.g., 24-bit to 16-bit for CD mastering)
- **At the ADC** — many converters add dither internally. Delta-sigma converters' noise shaping inherently provides dither-like randomization
- **Not needed** if the signal already contains enough uncorrelated noise to decorrelate the quantization. In most real-world analog signals, analog noise provides natural dithering

## Oversampling and Noise Shaping

**Oversampling** spreads quantization noise across a wider frequency band. Since the total noise power is fixed (determined by bit depth), distributing it over a wider band means less noise in any given sub-band:

For an oversampling ratio of R (sampling at R × Nyquist rate), the in-band noise is reduced by:

SNR improvement = 10 × log₁₀(R) dB

Each doubling of the sample rate improves SNR by 3 dB (= ½ bit). Getting one extra bit of resolution through oversampling alone requires 4× the sample rate. Getting 4 extra bits requires 256×.

**Noise shaping** makes oversampling dramatically more effective. Instead of spreading quantization noise uniformly, a feedback loop shapes the noise spectrum — pushing most of the noise to high frequencies (above the signal band) where it can be removed by a digital filter:

- 1st-order noise shaping: 9 dB/octave improvement (1.5 bits per octave of oversampling)
- 2nd-order: 15 dB/octave (2.5 bits per octave)
- Higher-order: Even more aggressive, but stability becomes harder to maintain

**This is how delta-sigma converters work:** A 1-bit quantizer running at 64× oversampling with 4th-order noise shaping achieves 16+ effective bits. The low-resolution quantizer combined with aggressive noise shaping and decimation filtering produces high-resolution output. See [Analog-to-Digital Converters]({{< relref "/docs/audio-signal/sampling-and-conversion/analog-to-digital-converters" >}}).

## Gotchas

- **Truncation is not the same as rounding** — Truncation always rounds toward zero (or toward negative infinity), creating a DC offset in the quantization error. Rounding to the nearest code keeps the error centered at zero. Always round, never truncate, when reducing bit depth
- **Dither must be applied before quantization** — Adding noise after quantization doesn't help. The dither must be present when the rounding decision is made
- **Noise shaping pushes noise to high frequencies — it doesn't remove it** — If the decimation filter doesn't adequately reject the out-of-band shaped noise, it aliases back into the signal band during downsampling. The decimation filter is critical
- **Re-dithering at every bit-depth reduction** — If a signal is reduced from 24 to 20 bits, then later from 20 to 16 bits, dither should be applied at each reduction. But the accumulated dither noise is higher than a single 24-to-16-bit dithered conversion. Minimize the number of bit-depth reductions
- **Fixed-point DSP accumulates quantization error** — Every multiply-and-round operation in fixed-point arithmetic introduces quantization error. Long filter chains or recursive (IIR) structures accumulate this error. Use wider accumulators (40-bit or 64-bit) for intermediate calculations, and only truncate/round at the final output
