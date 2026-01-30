---
title: "Measurement & Perception"
weight: 30
---

# Measurement & Perception

Signal quality can be measured objectively with instruments and described subjectively by human listeners. The two don't always agree. A system with excellent THD might sound harsh due to jitter; a system with mediocre specs might sound pleasant because its distortion character is benign. Understanding both objective metrics and perceptual realities — and where they diverge — is necessary for making informed design decisions rather than chasing numbers or trusting ears alone.

## Key Specifications

### THD (Total Harmonic Distortion)

The ratio of harmonic distortion power to fundamental signal power, expressed in dB or percent:

THD = √(V₂² + V₃² + V₄² + …) / V₁

| THD | Quality Level |
|-----|--------------|
| < 0.001% (-100 dB) | State-of-the-art audio |
| 0.001-0.01% | Excellent — high-end converters, precision op-amps |
| 0.01-0.1% | Good — general-purpose audio |
| 0.1-1% | Audible distortion in critical listening |
| > 1% | Clearly audible; acceptable for speech/comms |

THD is measured with a single-frequency sine wave input. It reveals harmonic nonlinearity but misses intermodulation distortion (distortion from multiple tones), which is often more audible.

**THD+N (Total Harmonic Distortion + Noise)** combines distortion and noise into a single number. More practical than THD alone because it reflects the actual signal quality a listener experiences. At low signal levels, noise dominates THD+N; at high levels, distortion dominates.

### SINAD (Signal-to-Noise-and-Distortion)

The ratio of signal power to everything else (noise + distortion):

SINAD = Signal / (Noise + Distortion) in dB

SINAD is the most comprehensive single-number metric because it captures all degradations. ENOB is derived directly from SINAD:

ENOB = (SINAD - 1.76) / 6.02

### SFDR (Spurious-Free Dynamic Range)

The ratio between the signal and the largest single spurious component (harmonic, intermodulation product, or non-harmonic spur):

SFDR is often larger than SINAD because SINAD includes all noise and distortion, while SFDR only considers the worst single spur. SFDR matters when a strong interfering signal could be mistaken for a real signal — important in communications receivers and spectrum analysis.

### Summary Table

| Metric | Measures | Includes Noise? | Best For |
|--------|----------|-----------------|----------|
| THD | Harmonic distortion only | No | Amplifier linearity |
| THD+N | Distortion + noise | Yes | Overall audio quality |
| SINAD | Signal vs everything | Yes | Converter performance |
| SFDR | Signal vs worst spur | No (just spurs) | Receiver/detector dynamic range |
| SNR | Signal vs noise only | Yes (no distortion) | Noise performance |

## How to Measure

**Audio analyzer (AP, Prism, etc.)** — The gold standard. Generates precision sine waves and measures THD, THD+N, SINAD, noise, frequency response, crosstalk, and more. Dedicated audio analyzers achieve noise floors below -120 dBFS and THD below -115 dB.

**Soundcard + software** — A good external audio interface (Focusrite, MOTU, RME) with measurement software (REW, ARTA, DSCOPE) can measure THD to about -100 dB and noise to -110 dBFS. Limited by the soundcard's own performance — always measure the loopback first to establish the instrument's floor.

**Oscilloscope + FFT** — An oscilloscope's built-in FFT can show harmonics and spurs, but dynamic range is limited (8-bit ADC → ~48 dB). Useful for spotting gross distortion and spurious signals, not for precision measurement. See the [Measurement & Test]({{< relref "/docs/measurement" >}}) section for instrument-specific techniques.

**Measurement best practices:**
- Always verify the instrument's noise floor with input shorted or terminated
- Use the highest-quality source available — the source must be cleaner than the DUT
- Match levels to use the full range of the measurement system
- Specify the measurement bandwidth (20 Hz-20 kHz for audio, or wider for characterization)
- Use averaging to reduce measurement noise

## Human Perception

Specs describe the signal. Perception describes the experience. They're related but not identical.

### Fletcher-Munson Curves (Equal Loudness Contours)

Human hearing sensitivity varies dramatically with frequency:
- Most sensitive: 2-5 kHz (speech intelligibility range)
- Less sensitive: Below 200 Hz and above 10 kHz
- At low listening levels, the bass and treble perception drops even further

**Practical consequence:** Noise or distortion in the 2-5 kHz range is much more audible than the same level at 50 Hz or 15 kHz. A flat noise spectrum is perceived as "hissy" because the midrange dominates perceptually.

### A-Weighting

A-weighting is a frequency-weighting curve that approximates the ear's sensitivity at moderate listening levels. It attenuates low and high frequencies, emphasizing the 1-6 kHz midrange:

- 50 Hz: -30 dB
- 200 Hz: -11 dB
- 1 kHz: 0 dB (reference)
- 4 kHz: +1 dB
- 10 kHz: -2.5 dB

A-weighted measurements always give better (lower noise, better SNR) numbers than unweighted measurements because they de-emphasize frequency regions where noise typically concentrates (low frequencies from 1/f noise, high frequencies from thermal noise). Some datasheets only report A-weighted specs — always check.

### Masking

A loud signal masks (makes inaudible) nearby quieter signals:

- **Simultaneous masking** — A loud tone masks quieter tones at nearby frequencies. The masking effect extends more toward higher frequencies than lower
- **Temporal masking** — A loud sound briefly masks quieter sounds that occur just before (pre-masking, ~20 ms) and after (post-masking, ~100 ms)

Masking is why lossy audio compression (MP3, AAC) works — it removes signal components that would be masked by louder ones. It's also why distortion at -60 dB relative to a loud passage might be inaudible, while the same distortion during a quiet passage is clearly heard.

### Distortion Character

Not all distortion sounds equally bad:
- **Even harmonics (2nd, 4th)** — Often described as "warm" or "pleasant." Musical relationship to the fundamental (octaves). Tube amplifiers produce primarily even harmonics
- **Odd harmonics (3rd, 5th, 7th)** — Sound harsher. Musically dissonant. Semiconductor clipping produces primarily odd harmonics. Digital clipping produces strong odd harmonics
- **High-order harmonics** — Sound increasingly harsh and metallic. Crossover distortion (Class-B, Class-D dead time) produces high-order harmonics that are disproportionately audible

**0.1% THD from even harmonics is far less objectionable than 0.1% THD from odd or high-order harmonics.** THD alone doesn't capture this — the spectrum of the distortion matters as much as its level.

## Gotchas

- **A-weighting flatters noisy circuits** — A circuit with a -90 dB noise floor unweighted might show -95 dB A-weighted. When comparing specs, make sure both are using the same weighting (or no weighting)
- **THD measured at 1 kHz hides crossover distortion** — Crossover distortion produces high-order harmonics at high frequencies that are attenuated by the measurement filter. Measuring THD at 10 kHz or using intermodulation distortion (IMD) tests reveals crossover distortion more effectively
- **Perception depends on listening level** — At low volumes, the ear is less sensitive to bass and treble, and more tolerant of noise. At high volumes, distortion is more easily heard against the louder signal. Specs measured at one level may not predict perception at another
- **"Sounds good" does not mean "measures well"** — Some distortion is euphonic (pleasant tube warmth). Some specs are excellent but the system sounds sterile. Engineering requires both measurement and listening, with the understanding that objective metrics are necessary for reproducibility
- **Dynamic range is not just peak-to-noise** — The usable dynamic range depends on the signal content. Music with a high crest factor (20 dB) uses the top 20 dB for peaks and has only 76 dB of quiet-signal SNR from a 96 dB system. Design for the music, not the sine wave
