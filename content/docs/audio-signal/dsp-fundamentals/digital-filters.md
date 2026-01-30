---
title: "Digital Filters"
weight: 20
---

# Digital Filters

Digital filters modify the frequency content of a discrete-time signal using arithmetic — multiply, add, delay. They're the digital equivalent of analog RC, LC, and active filters, but with capabilities that analog filters can't match: perfectly linear phase, arbitrarily steep rolloff, and exact reproducibility. The two fundamental architectures — FIR and IIR — represent a core design tradeoff: computational cost versus efficiency, stability versus performance.

## FIR Filters (Finite Impulse Response)

An FIR filter computes each output sample as a weighted sum of the current and past input samples:

y[n] = b₀x[n] + b₁x[n-1] + b₂x[n-2] + … + b_Mx[n-M]

The coefficients {b₀, b₁, …, b_M} define the filter. The filter length is M+1 taps.

**Key properties:**

- **Always stable** — No feedback, so the output is always bounded if the input is bounded. You cannot design an unstable FIR filter
- **Linear phase** — If the coefficients are symmetric (b_k = b_{M-k}), the filter has exactly linear phase, meaning all frequencies are delayed by the same amount. This preserves waveform shape and is critical for applications where timing relationships matter (audio crossovers, measurement systems)
- **Computationally expensive** — A steep low-pass filter at low frequencies relative to the sample rate might need hundreds or thousands of taps. Each tap requires one multiply and one add per output sample

**Design approaches:**
- **Windowed sinc** — Start with the ideal filter (a sinc function in the time domain), truncate to M+1 taps, and apply a window function to control sidelobes
- **Parks-McClellan (Remez)** — Optimal equiripple design that minimizes the maximum error in passband and stopband. The standard method for FIR filters with specified performance
- **Frequency sampling** — Specify desired frequency response at discrete points and inverse-FFT to get coefficients

## IIR Filters (Infinite Impulse Response)

An IIR filter uses feedback — its output depends on both current/past inputs and past outputs:

y[n] = b₀x[n] + b₁x[n-1] + … - a₁y[n-1] - a₂y[n-2] - …

The feedback makes IIR filters much more efficient than FIR for the same frequency selectivity — a 2nd-order IIR biquad can match the performance of a 50+ tap FIR filter for many applications.

**Key properties:**

- **Efficient** — Typically 5-20× fewer multiplies than an equivalent FIR filter. A cascade of 2nd-order biquad sections can implement complex filter shapes with modest computation
- **Can be unstable** — Feedback means poles exist, and if any pole falls outside the unit circle, the filter oscillates or diverges. Stability must be verified after design and is affected by coefficient quantization
- **Nonlinear phase** — IIR filters generally have frequency-dependent group delay, meaning different frequencies arrive at the output at different times. This distorts transients and is audible in some audio applications

**Biquad sections:** The standard building block for IIR implementation. A single biquad is a 2nd-order filter with 5 coefficients (2 feed-forward, 2 feedback, plus gain). Complex filters are built as cascades of biquads. Audio equalizers, crossovers, and dynamics processors are typically implemented as biquad cascades.

**Design approaches:**
- **Bilinear transform** — Map a well-known analog filter design (Butterworth, Chebyshev, elliptic) to the digital domain. This preserves the analog filter's magnitude response but warps the frequency axis
- **Frequency prewarping** — Compensate for the bilinear transform's frequency warping by adjusting the analog prototype before transformation
- **Direct digital design** — Specify poles and zeros directly in the z-plane

## FIR vs IIR: The Design Decision

| Property | FIR | IIR |
|----------|-----|-----|
| Stability | Always stable | Can be unstable |
| Phase | Linear (symmetric) | Nonlinear |
| Computational cost | High (many taps) | Low (few coefficients) |
| Memory | High (stores M input samples) | Low (stores a few past I/O samples) |
| Latency | M/2 samples (linear phase) | Low (a few samples) |
| Fixed-point behavior | Robust | Sensitive to quantization |
| Adaptability | Easy (just update coefficients) | Harder (stability concerns) |

**Choose FIR when:** Phase linearity is required, the filter will run on an FPGA or DSP with hardware multipliers, or fixed-point robustness matters more than efficiency.

**Choose IIR when:** Computational budget is tight (MCU), the filter doesn't need linear phase, or you're implementing a well-known analog filter type (parametric EQ, crossover).

## Practical Implementation Concerns

**Fixed-point arithmetic** — On MCUs without floating-point units, filter coefficients and intermediate values are represented as fixed-point integers. This introduces coefficient quantization (the designed filter is slightly different from the implemented filter) and accumulator overflow risks. IIR filters are particularly sensitive — a pole designed to be at radius 0.999 might quantize to 1.001 and become unstable.

**Biquad coefficient formats** — Common formats include Q15 (16-bit signed, 15 fractional bits) and Q31 (32-bit). Higher precision reduces quantization effects but uses more memory and may be slower. Many MCU DSP libraries (CMSIS-DSP, for example) provide optimized biquad implementations in both formats.

**Computational budget on MCUs** — A 100 MHz Cortex-M4 with single-cycle MAC can execute roughly 100 million multiply-accumulates per second. At 48 kHz sample rate, that's ~2000 MACs per sample. A 100-tap FIR filter uses 100 MACs per sample — feasible. A 1000-tap filter uses 1000 MACs — tight. IIR biquads use ~5 MACs per section, making complex filter banks practical.

**Double-precision cascades** — When cascading many biquad sections, use double-precision (or extended) accumulators for intermediate results. Single-precision accumulation in a 10-section cascade can introduce measurable noise.

## Gotchas

- **Coefficient quantization can cause instability** — An IIR filter that's stable in floating-point may become unstable when coefficients are quantized to fixed-point. Always verify stability with the actual quantized coefficients, not just the design values
- **Linear phase FIR has inherent latency** — A symmetric FIR filter of length M introduces a delay of M/2 samples. A 1000-tap filter at 48 kHz adds 10.4 ms of latency. This is unavoidable with linear phase
- **Narrow filters at low frequencies need many taps** — The number of FIR taps needed is roughly f_s / Δf, where Δf is the transition bandwidth. A 100 Hz filter with 10 Hz transition band at 48 kHz needs ~4800 taps
- **IIR filters ring** — Filters with sharp resonances (high Q) ring when excited by transients. This is audible as ringing on percussive sounds and visible as overshoot on step responses. It's the same physics as analog filter ringing, just implemented digitally
- **Don't design filters in the frequency domain and implement in the time domain without checking** — The FFT-based frequency response of your designed filter and the actual response of the implemented filter (with quantized coefficients, specific arithmetic precision) can differ significantly. Always measure the implemented filter's response
