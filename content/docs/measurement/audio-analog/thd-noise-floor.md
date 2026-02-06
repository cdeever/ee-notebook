---
title: "What's the THD / Noise Floor?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What's the THD / Noise Floor?

Distortion and noise measurements. In audio and precision analog circuits, the signal itself is the product — so how clean it is matters directly. THD tells how much harmonic distortion a stage adds; noise floor tells the quietest signal that can be resolved.

## THD: Total Harmonic Distortion

Feed a pure sine wave into an amplifier — the output should be a pure sine wave (scaled by gain). Any harmonics (2×, 3×, 4× the fundamental frequency) are distortion added by the amplifier.

**THD = sqrt(V2² + V3² + V4² + ...) / V1**

Where V1 is the fundamental amplitude and V2, V3, etc. are harmonic amplitudes.

| THD | Practical meaning |
|-----|-------------------|
| < 0.01% (-80 dB) | Excellent — high-fidelity audio, precision instrumentation |
| 0.01–0.1% (-80 to -60 dB) | Good — most listeners can't distinguish from 0.01% |
| 0.1–1% (-60 to -40 dB) | Audible on careful listening |
| 1–10% (-40 to -20 dB) | Clearly audible — guitar amps run here intentionally |
| > 10% | Severe distortion — clipping or broken |

## Measuring THD with Oscilloscope FFT

Feed a clean sine wave from a low-distortion function generator into the circuit input. Capture the output and run FFT with Hann or flat-top window. Identify the fundamental peak and each harmonic peak (2×, 3×, 4×, 5× fundamental). Read each peak's amplitude in dBV.

Convert each harmonic from dBV to voltage: **V = 10^(dBV/20)**

**THD = sqrt(V2² + V3² + ...) / V1 × 100%**

Which harmonics dominate reveals the distortion type: 2nd harmonic indicates asymmetric distortion; 3rd indicates symmetric clipping.

## Noise Floor Measurement

Connect the circuit output to the scope with no input signal applied (or input shorted to ground). AC-couple the channel to remove DC offset. Set bandwidth limit (20 MHz for general noise; 20 kHz for audio-specific). Set vertical scale to the most sensitive range that shows noise without clipping.

Measure the RMS voltage of the noise using the scope's measurement function.

| Reference | Formula | Common in |
|-----------|---------|-----------|
| dBV | 20 × log10(Vrms / 1V) | Consumer audio |
| dBu | 20 × log10(Vrms / 0.775V) | Professional audio |
| dBFS | Relative to ADC full-scale | Digital audio |

## SNR: Signal-to-Noise Ratio

Apply a full-scale sine wave (maximum level before clipping) and measure output signal amplitude (RMS). Remove the input signal and measure output noise amplitude (RMS) at the same gain setting.

**SNR (dB) = 20 × log10(V_signal / V_noise)**

| System | Typical SNR |
|--------|------------|
| Decent op-amp stage | 80–100 dB |
| CD-quality audio (16-bit) | ~96 dB (theoretical) |
| 24-bit audio interface | ~110–120 dB (practical) |

## Tips

- The signal source must be cleaner than the circuit being measured — for THD below 0.1%, a dedicated low-distortion oscillator is needed
- Always specify bandwidth when quoting noise floor — "1 mV noise" at 20 kHz bandwidth differs from 1 mV at 20 MHz bandwidth
- Use flat-top window for FFT amplitude accuracy

## Caveats

- Most bench scopes can reliably measure THD down to about -50 to -60 dB (0.1–0.3%) — below that, the scope's distortion dominates
- FFT windowing matters — flat-top for amplitude accuracy, Hann for frequency resolution
- Make sure the scope input isn't clipping — a clipped input adds harmonics from the scope, not the circuit
- Measurement bandwidth directly affects noise reading — wider bandwidth captures more noise
- The scope's own input noise may be comparable to the circuit's noise — check scope noise floor first

## In Practice

- Strong 2nd harmonic indicates asymmetric transfer curve — check bias in single-ended stages
- Strong 3rd harmonic indicates symmetric clipping — check headroom
- Strong odd harmonics (3rd, 5th, 7th) indicate crossover distortion in push-pull output stages
- Noise floor higher than expected limits dynamic range — check for oscillation, interference, or inadequate decoupling
- SINAD (signal-to-noise-and-distortion) is more representative of actual signal quality than SNR alone
