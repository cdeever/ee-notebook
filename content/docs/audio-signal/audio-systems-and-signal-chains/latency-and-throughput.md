---
title: "Latency & Throughput"
weight: 20
---

# Latency & Throughput

Latency is the time between when a signal enters a system and when the corresponding output appears. In real-time audio and control systems, latency determines whether the system feels responsive or sluggish — and excessive latency can make a system unusable. Throughput is the rate at which data flows through the system. High throughput with high latency is fine for batch processing; real-time systems need low latency and sufficient throughput simultaneously.

## Sources of Latency

Every stage in a signal chain adds latency. The total is the sum:

**Analog latency** — Propagation through analog circuits is nearly instantaneous (nanoseconds to microseconds). Analog filters add group delay, which is frequency-dependent: a 4th-order Bessel filter at 20 kHz adds roughly 30 µs. Analog latency is negligible for audio but matters in high-speed control loops.

**Conversion latency** — ADCs and DACs introduce delay:
- SAR ADC: ~1-10 µs per conversion (nearly negligible)
- Delta-sigma ADC: Multiple output-sample periods for filter settling — typically 10-100 samples, which at 48 kHz is 0.2-2 ms
- Pipeline ADC: Fixed pipeline delay of N stages × clock period
- DAC reconstruction: Similar to the ADC, delta-sigma DACs have filter group delay

**Buffer/block latency** — The dominant source in digital audio. A block-processing DSP algorithm must collect an entire block before processing begins:
- Input buffer: N/f_s seconds to fill
- Processing: Algorithm execution time (ideally less than one block period)
- Output buffer: N/f_s seconds to drain
- **Minimum total:** ~2N/f_s (input + output buffers). Double-buffering or ping-pong schemes often add another block period: ~3N/f_s

**Processing latency** — Some algorithms are inherently high-latency:
- Linear-phase FIR filters: Delay = (M-1)/(2f_s), where M is the filter length. A 1024-tap filter at 48 kHz: 10.6 ms
- FFT-based processing: At least one FFT block (N/f_s) plus overlap
- Look-ahead compressors/limiters: Intentionally add latency for predictive gain control

**Network/transport latency** — For networked audio (AES67, Dante, AVB): packet assembly, network switching, and jitter buffers add 1-10 ms typical.

## Audio Latency Thresholds

| Latency | Perception |
|---------|-----------|
| < 1 ms | Indistinguishable from zero — acoustic propagation at 1 ms is ~34 cm |
| 1-5 ms | Imperceptible for most uses. Fine for monitoring and effects |
| 5-10 ms | Perceptible as "thickening" or doubling. Acceptable for live monitoring with care |
| 10-20 ms | Clearly perceptible. Problematic for live performance monitoring |
| 20-40 ms | Distracting. Unusable for real-time performance monitoring |
| > 40 ms | Perceived as distinct echo. Only acceptable for non-real-time playback |

**Context matters:** A vocalist monitoring their own voice through a PA system needs < 5 ms. A conference call is usable up to ~150 ms (one-way). Industrial control loops have latency budgets measured in microseconds, not milliseconds.

## Block Size Tradeoffs

| Parameter | Small Block | Large Block |
|-----------|------------|-------------|
| Latency | Low | High |
| CPU overhead | High (per-block setup is frequent) | Low |
| Frequency resolution (FFT) | Poor | Good |
| Scheduling jitter tolerance | Low (tight deadline) | High (more slack) |
| Memory usage | Low | Higher |

The optimal block size is the smallest that the processing system can handle reliably under worst-case load. Audio interfaces typically offer block sizes from 32 to 2048 samples, and the user trades latency for stability.

## Real-Time Constraints

A real-time system must produce output at a guaranteed rate. For audio, every block must be processed before the output buffer empties — otherwise, the output glitches (clicks, pops, dropout).

**Worst-case, not average:** The system must complete processing within the deadline every single time. An algorithm that usually finishes in 2 ms but occasionally takes 15 ms (due to cache misses, interrupts, garbage collection, or OS scheduling) will produce audible dropouts. Real-time audio on general-purpose operating systems (macOS, Windows, Linux without RT patches) requires careful priority management.

**Interrupt-driven vs polling:** MCU-based audio systems often process samples in a timer interrupt or DMA completion callback. The interrupt must complete before the next one fires. At 48 kHz, that's 20.8 µs per sample — every microsecond of ISR execution time counts. See the [Embedded]({{< relref "/docs/embedded" >}}) section for MCU timing constraints.

**CPU utilization budgets:**
- Desktop audio (DAW, plugin host): Target < 70% CPU load to leave headroom for spikes
- Embedded/MCU audio: Target < 80% of available cycles per sample period
- FPGA audio: Determined by clock rate and pipeline depth — typically no utilization concern for audio-rate processing

## Latency Measurement

Measuring actual end-to-end latency:

**Loopback test:** Send a signal out of the system and record it coming back in. The delay between the sent and received signal is the round-trip latency. Divide by 2 for one-way (assuming the paths are symmetric — which they often aren't).

**Impulse/click method:** Send a sharp click, record the output. The time offset of the received click is the latency. Works for analog and digital paths.

**Oscilloscope:** Probe the analog input and analog output simultaneously. Trigger on the input and measure the delay to the output response. This captures the true analog-to-analog latency including all conversion and processing delays.

## Gotchas

- **Reported latency is often optimistic** — Driver-reported buffer sizes don't include conversion latency, processing pipeline delay, or output buffer delay. Actual end-to-end latency is always higher than the buffer size alone suggests
- **Operating system scheduling adds jitter** — Even with low-latency audio drivers (ASIO, CoreAudio, ALSA), OS interrupts and task scheduling introduce timing variation. This doesn't add to average latency but causes occasional late processing deadlines (glitches)
- **Latency accumulates through effects chains** — Each plugin or processing stage in series adds its latency. A chain of 5 plugins, each adding 3 ms, produces 15 ms total. DAWs use latency compensation (delay other tracks to match) for mixing, but this doesn't help for real-time monitoring
- **Low latency costs CPU** — Smaller block sizes mean more frequent processing calls, more overhead, and less opportunity for the CPU to batch operations efficiently. There's a minimum block size below which the system can't keep up, and it depends on CPU speed and algorithm complexity
- **Delta-sigma converter settling adds hidden latency** — After a gain change or input switch, delta-sigma converters need multiple output samples for their internal digital filters to settle. During this time, the output is invalid. This matters for multiplexed measurement systems
