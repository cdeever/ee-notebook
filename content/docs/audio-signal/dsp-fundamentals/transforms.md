---
title: "Transforms"
weight: 30
---

# Transforms

The Fourier transform converts a time-domain signal into its frequency-domain representation — decomposing a waveform into its constituent sinusoidal components. For discrete-time signals, this becomes the Discrete Fourier Transform (DFT), and the FFT (Fast Fourier Transform) is simply an efficient algorithm for computing it. The FFT is arguably the most important algorithm in signal processing: spectrum analyzers, equalizers, noise analysis, and compression all depend on it.

## The DFT and FFT

The DFT converts N time-domain samples into N frequency-domain values. Each output bin X[k] represents the signal's content at a specific frequency:

f_k = k × f_s / N

where k is the bin index (0 to N-1), f_s is the sample rate, and N is the transform length.

**The FFT** is not a different transform — it's an algorithm that computes the DFT in O(N log N) operations instead of O(N²). For N = 1024, that's roughly 10,000 operations instead of 1,000,000. This speedup is what makes real-time spectral analysis practical.

Most FFT implementations require N to be a power of 2 (256, 512, 1024, 2048, …). Non-power-of-2 lengths use zero-padding or mixed-radix algorithms, which are less efficient.

## Spectral Bins and Frequency Resolution

An N-point FFT at sample rate f_s produces N/2 + 1 unique frequency bins (for real input signals) spanning 0 Hz to f_s/2:

- **Bin spacing (frequency resolution):** Δf = f_s / N
- **Highest frequency bin:** f_s/2 (Nyquist)
- **DC bin:** k = 0, representing the signal's average value

| N | f_s = 48 kHz Δf | f_s = 44.1 kHz Δf |
|---|-----------------|-------------------|
| 256 | 187.5 Hz | 172.3 Hz |
| 512 | 93.75 Hz | 86.1 Hz |
| 1024 | 46.88 Hz | 43.1 Hz |
| 4096 | 11.72 Hz | 10.8 Hz |

**What resolution means practically:** Two frequency components closer than Δf apart cannot be distinguished — they'll merge into one bin. To resolve a 1000 Hz tone from a 1010 Hz tone (10 Hz apart), you need Δf ≤ 10 Hz, which means N ≥ f_s / 10 = 4800 samples at 48 kHz.

## Spectral Leakage

If a signal's frequency doesn't fall exactly on a bin center, its energy spreads across multiple bins. This is spectral leakage — an artifact of analyzing a finite-length signal, not a property of the signal itself.

**Why it happens:** The DFT assumes the N-sample block repeats infinitely. If the signal's period doesn't divide evenly into N samples, the assumed repetition creates a discontinuity at the block boundary, which introduces broadband artifacts.

**Window functions** reduce leakage by tapering the block edges (see [Discrete-Time Signals]({{< relref "discrete-time-signals" >}})). The tradeoff: windows reduce leakage but widen the main lobe, reducing frequency resolution. A rectangular window (no tapering) has the best resolution but the worst leakage.

**Coherent sampling** — If you control the signal generator (test and measurement), you can set the signal frequency to fall exactly on a bin center. This eliminates leakage without windowing. The requirement: f_signal = M × f_s / N for some integer M.

## Practical FFT Usage

### Power Spectral Density (PSD)

For noise and random signals, the magnitude spectrum depends on FFT length (more bins = less energy per bin). PSD normalizes by bin bandwidth:

PSD[k] = |X[k]|² / (Δf × noise_bandwidth_correction)

PSD has units of V²/Hz (or dBV²/Hz) and is independent of FFT length — making comparisons meaningful.

### Averaging

A single FFT of a noisy signal has high variance — the noise floor fluctuates wildly. Averaging multiple FFTs reduces the variance:

- **Linear averaging:** Average the magnitude (or power) spectra of M consecutive blocks. Noise floor drops by √M (10 log₁₀(M) dB improvement in signal visibility)
- **Exponential averaging:** Weight recent spectra more heavily. Useful for real-time displays that need to track slow changes

### dBFS Scaling

In digital audio, spectral levels are referenced to full scale:

Level_dBFS = 20 × log₁₀(|X[k]| / (N/2)) for a single tone

where N/2 is the normalization for a full-scale sinusoid. A full-scale sine wave at exactly bin center reads 0 dBFS. Everything else reads negative.

**Beware:** Different FFT implementations normalize differently. Some divide by N, some by N/2, some don't normalize at all. Always verify the scaling by putting in a known signal and checking that the output makes sense.

### Spectrogram (Waterfall)

A sequence of FFTs taken over time, displayed as a 2D plot (time vs frequency, with color or intensity for amplitude). This shows how the spectral content changes over time — essential for speech, music, and transient analysis. The time-frequency resolution tradeoff applies: short FFTs give good time resolution but poor frequency resolution, and vice versa.

## Beyond the FFT

The FFT dominates, but other transforms serve specific purposes:

- **DCT (Discrete Cosine Transform)** — Real-valued transform used in audio compression (MP3, AAC) and image compression (JPEG). More energy-compacting than the DFT for typical signals
- **Wavelet transforms** — Variable time-frequency resolution: good time resolution at high frequencies, good frequency resolution at low frequencies. Useful for analyzing transients with mixed frequency content
- **Goertzel algorithm** — Efficiently computes a single DFT bin. Useful when you only need one frequency (e.g., DTMF detection) — O(N) instead of O(N log N)

## Gotchas

- **Leakage looks like noise but isn't** — A strong sine wave analyzed with a rectangular window produces sidelobes that can be 13 dB below the peak and extend far from the true frequency. This can mask weak signals nearby. Use an appropriate window to push sidelobes down
- **Zero-padding interpolates, it does not resolve** — Padding a 1024-point block to 4096 points makes the spectrum look smoother (4× more bins) but the frequency resolution is still f_s/1024. The additional bins are interpolated, not independent measurements
- **Magnitude spectra discard phase** — The FFT output is complex (magnitude and phase). Most spectral displays show only magnitude. Phase information is critical for reconstruction, time-delay measurement, and transfer function analysis — don't discard it unnecessarily
- **The DC and Nyquist bins are special** — Bin 0 (DC) and bin N/2 (Nyquist) are purely real in a DFT of a real signal. They represent zero frequency and the Nyquist frequency respectively. Their amplitude scaling differs from other bins by a factor of 2 in some normalization conventions
- **FFT of clipped signals shows spurious harmonics** — A clipped sine wave generates odd harmonics that are real distortion, not FFT artifacts. But a sine wave that clips due to quantization (exceeding dBFS) also wraps around, creating even-harmonic artifacts that depend on the clipping mechanism. Know whether the harmonics you see are from the signal or the measurement
