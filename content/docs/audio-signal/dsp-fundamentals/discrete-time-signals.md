---
title: "Discrete-Time Signals"
weight: 10
---

# Discrete-Time Signals

Once an analog signal has been sampled, it becomes a sequence of numbers — discrete in time and (after quantization) discrete in amplitude. Working with these sequences requires a slightly different vocabulary and a few concepts that don't exist in the continuous world: sample indexing, block processing, windowing, and the subtle errors that come from treating finite chunks of data as if they represent infinite signals.

## Samples and Sequences

A discrete-time signal x[n] is a sequence of values indexed by an integer n. Each value corresponds to a sample taken at time t = n/f_s, where f_s is the sample rate. The square-bracket notation x[n] (vs parentheses x(t) for continuous signals) is a deliberate convention that flags "this is discrete."

**Sequence operations** are analogous to continuous-time operations:

- **Delay:** x[n - k] shifts the sequence by k samples. One sample of delay at 48 kHz is about 20.8 µs
- **Scaling:** a × x[n] multiplies every sample by a constant
- **Addition:** x[n] + y[n] adds corresponding samples (same rate assumed)
- **Convolution:** y[n] = Σ h[k] × x[n - k] — the fundamental operation of digital filtering

The sample rate is metadata — the sequence itself is just numbers. This means the same sequence of values could represent a 1 kHz signal at 48 kHz sample rate, or a 10 kHz signal at 480 kHz sample rate. All frequency information is relative to the sample rate.

## Frames and Blocks

Real-time digital signal processing doesn't operate on individual samples one at a time (usually). Instead, samples are collected into blocks (frames) of N samples, and the DSP algorithm processes entire blocks:

- **Block size (N):** Typical values range from 32 to 4096 samples. Larger blocks are more computationally efficient (setup overhead is amortized) and provide better frequency resolution for spectral analysis
- **Block latency:** Processing can't begin until a full block is collected, adding at minimum N/f_s seconds of latency. A 256-sample block at 48 kHz adds 5.3 ms minimum

**The latency-efficiency tradeoff:**

| Block Size | Latency at 48 kHz | Use Case |
|-----------|-------------------|----------|
| 32 | 0.67 ms | Real-time monitoring, low-latency effects |
| 128 | 2.67 ms | Live audio processing |
| 256 | 5.33 ms | General audio (near perception threshold) |
| 1024 | 21.3 ms | Spectral analysis, non-real-time effects |
| 4096 | 85.3 ms | High-resolution FFT, offline processing |

For real-time audio, block sizes above ~512 samples at 48 kHz (>10 ms) start to become perceptible as latency. Musical performance monitoring needs ≤5 ms — see [Latency & Throughput]({{< relref "/docs/audio-signal/audio-systems-and-signal-chains/latency-and-throughput" >}}).

## Windowing

When you analyze a finite block of samples, you're implicitly multiplying the infinite signal by a rectangular window — ones inside the block, zeros outside. This abrupt truncation creates artifacts in the frequency domain (spectral leakage): energy from a single frequency smears across many frequency bins.

**Window functions** taper the edges of the block to reduce leakage, trading off frequency resolution for reduced sidelobes:

| Window | Main Lobe Width | Sidelobe Level | Use Case |
|--------|----------------|----------------|----------|
| Rectangular | Narrowest | -13 dB (worst) | When signals are exactly periodic in the window |
| Hann (Hanning) | Moderate | -31 dB | General-purpose spectral analysis |
| Hamming | Moderate | -43 dB | Similar to Hann, slightly better sidelobes |
| Blackman | Wide | -58 dB | When dynamic range matters more than resolution |
| Flat-top | Widest | -44 dB | Amplitude-accurate measurements (calibration) |
| Kaiser | Adjustable (β) | Adjustable | When you need to tune the tradeoff |

**The tradeoff:** Wider main lobe means worse ability to distinguish nearby frequencies. Lower sidelobes mean less leakage from strong signals into weak-signal bins. There's no window that wins on both — this is another manifestation of the time-frequency uncertainty principle.

**Overlap processing:** To avoid losing information at the tapered block edges, consecutive blocks typically overlap by 50-75%. Each sample appears in multiple blocks, weighted by the window function at its position. The overlap-add or overlap-save method reconstructs a continuous output from overlapping windowed blocks.

## Circular vs Linear Convolution

A subtlety that causes real bugs: the FFT inherently computes circular (periodic) convolution, not the linear convolution needed for filtering. A block of N samples convolved with a filter of length M using a straightforward FFT approach produces wrap-around artifacts unless the FFT length is at least N + M - 1.

**Practical solution:** Zero-pad both the signal block and the filter to length N + M - 1 before computing the FFT. The overlap-add and overlap-save methods systematize this for continuous processing of sequential blocks.

## Gotchas

- **Off-by-one errors are everywhere** — A block of N samples spans indices 0 to N-1. An N-point FFT produces N/2 + 1 unique frequency bins (the rest are conjugate mirrors for real signals). The highest frequency bin represents f_s/2, not f_s. These fencepost errors compound in multi-stage processing
- **Sample rate must be tracked explicitly** — The sequence x[n] has no inherent notion of time or frequency. If you process a sequence without knowing its sample rate, you can't interpret the results in physical units. Every processing chain should carry the sample rate as metadata
- **Block boundaries create discontinuities** — If a signal is processed in blocks without proper overlap and windowing, the block boundaries can introduce clicks, pops, or spectral artifacts. This is especially problematic for time-varying operations (filters with changing coefficients)
- **Zero-padding does not create resolution** — Padding a block with zeros and taking a larger FFT interpolates the spectrum (smoother appearance) but does not increase the fundamental frequency resolution. True resolution depends on the signal duration, not the FFT size
- **Integer indexing hides timing precision** — A sample at index n represents a moment in time, but the actual sampling instant has jitter. For high-resolution systems, the assumption of perfectly uniform spacing breaks down — see [Clocking & Jitter]({{< relref "/docs/audio-signal/practical-signal-reality/clocking-and-jitter" >}})
