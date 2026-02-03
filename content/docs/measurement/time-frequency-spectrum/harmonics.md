---
title: "What Harmonics Are Present?"
weight: 30
---

# What Harmonics Are Present?

Moving from the time domain to the frequency domain. An FFT turns an oscilloscope into a basic spectrum analyzer, revealing harmonic content, switching artifacts, and unexpected frequency components that are invisible in the time-domain waveform.

## Oscilloscope FFT

Capture the signal in the time domain with a stable trigger. Set the record length as long as practical — more samples give better frequency resolution. Enable FFT and set the window type:

- **Hann (Hanning):** Good general-purpose, good frequency resolution, moderate amplitude accuracy
- **Flat-top:** Best amplitude accuracy, wider frequency bins
- **Rectangular (none):** Best frequency resolution but severe spectral leakage — only use for signals that are exactly periodic within the record

Set the vertical scale to dBV or dBm for meaningful amplitude readings. Adjust the frequency span and center frequency to focus on the region of interest.

## Reading the FFT Display

| Feature | Meaning |
|---------|---------|
| Tall peak at fundamental frequency | The primary signal — should be the strongest component |
| Peaks at 2×, 3×, 4× fundamental | Harmonics — amplitude relative to fundamental indicates distortion |
| Peak at an unrelated frequency | Spur — interference, switching noise, or aliasing artifact |
| Elevated noise floor | Broadband noise — thermal, quantization, or EMI |
| Peak at switching frequency (and harmonics) | Switching converter artifacts coupling into the signal |

## Identifying Specific Artifacts

**Switching converter noise:** Look for peaks at the switching frequency and its harmonics (2×, 3×, 4×...). These show up on the output rail and can couple into sensitive analog signals. Compare to the converter datasheet's switching frequency to confirm identification.

**Mains hum:** 50/60 Hz fundamental with harmonics at 100/120 Hz, 150/180 Hz, etc. Strong 50/60 Hz indicates magnetic coupling (ground loop, transformer leakage). Strong 100/120 Hz indicates full-wave rectifier ripple. Harmonics extending to kHz range indicate SCR/triac dimmer, nonlinear load, or power supply with high ripple current.

**Clock crosstalk:** Digital clocks coupling into analog signals appear as peaks at the clock frequency and its odd harmonics (square waves have primarily odd harmonics). Amplitude decreases with frequency as 1/f (-20 dB/decade) for an ideal square wave.

## FFT vs. Dedicated Spectrum Analyzer

| Feature | Oscilloscope FFT | Dedicated spectrum analyzer |
|---------|------------------|-----------------------------|
| Dynamic range | 50–70 dB (limited by ADC bits) | 80–120+ dB |
| Frequency resolution | Depends on record length | Very fine — Hz resolution common |
| Cost | Already included with scope | Separate expensive instrument |
| Best for | Quick look at harmonics, identifying spurs | Precision measurements, EMI compliance |

For most bench debugging, the scope FFT is sufficient. When dynamic range beyond ~60 dB is needed (measuring -80 dBc spurs on a clock), a dedicated spectrum analyzer or SDR-based tool is necessary.

## Tips

- Use Hann or flat-top window to minimize spectral leakage — rectangular window leakage can mask weak signals near strong ones
- Set vertical scale to dB for meaningful amplitude readings
- Compare the FFT of the noisy node to the FFT of the suspected source — if the same frequencies appear, the coupling path is identified

## Caveats

- FFT frequency resolution = sample rate / number of points — for a 1 MS record at 1 GS/s, resolution is 1 kHz; distinguishing signals 100 Hz apart needs a 10 MS+ record
- Spectral leakage from windowing can make a single-frequency signal look like it has sidebands
- The scope's noise floor limits what can be seen — most bench scopes have FFT noise floor around -50 to -70 dBc
- Aliasing: frequency components above the Nyquist frequency fold back and appear as false peaks at lower frequencies
- Scope FFT update rate is slow — looking at a snapshot, not a real-time sweep; intermittent interference may not appear in a single capture
- If a peak appears at exactly half the sample rate or moves when sample rate changes, it's likely aliasing, not a real signal

## Bench Relevance

- Harmonics of the fundamental frequency indicate distortion — compare relative amplitude to fundamental to quantify THD
- Peaks at unrelated frequencies indicate interference coupling in from external sources
- Peaks at switching frequency and harmonics confirm switching converter is coupling noise into the signal path
- Strong 50/60 Hz and harmonics indicate mains-related coupling — either ground loop or magnetic pickup
- Noise floor that's higher than expected limits the dynamic range of the signal chain
