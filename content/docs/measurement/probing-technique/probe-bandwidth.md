---
title: "Is My Probe Bandwidth Sufficient?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is My Probe Bandwidth Sufficient?

Bandwidth defines the highest frequency a measurement system can faithfully reproduce. Below the bandwidth limit, signals come through accurately. At the bandwidth limit, the signal is already 30% low (-3 dB). Above it, the signal is increasingly attenuated and distorted. A probe with insufficient bandwidth doesn't just reduce amplitude — it changes waveshape, hides fast edges, and makes ringing disappear.

## What Bandwidth Means

Bandwidth is the frequency at which output amplitude drops to 70.7% of the input (-3 dB). This is not a cliff — attenuation increases gradually, so signals near bandwidth are already degraded, and signals well below bandwidth are accurate.

| Signal frequency vs. bandwidth | Amplitude error | Waveform fidelity |
|-------------------------------|-----------------|-------------------|
| 1/5th of BW (e.g., 20 MHz signal, 100 MHz BW) | < 2% | Excellent — edges and details preserved |
| 1/3rd of BW | ~5% | Good — minor softening of fast edges |
| At BW (1:1) | 30% | Poor — significant amplitude loss, edges rounded |
| 2x BW | > 60% | Bad — signal barely visible, shape is wrong |

**Rule of thumb (5x):** For accurate amplitude measurements, system bandwidth should be at least 5x the signal's highest significant frequency component.

## Rise Time and Bandwidth

For digital signals, the highest significant frequency component relates to rise time, not clock frequency:

**f_knee ≈ 0.5 / t_rise**

A 10 MHz square wave with 5 ns rise time has frequency content up to ~100 MHz. Accurate measurement requires 500 MHz of bandwidth — not 50 MHz.

The relationship between bandwidth and rise time: **t_rise ≈ 0.35 / BW** (for single-pole, Gaussian response)

| System bandwidth | System rise time |
|-----------------|-----------------|
| 20 MHz | 17.5 ns |
| 100 MHz | 3.5 ns |
| 200 MHz | 1.75 ns |
| 500 MHz | 0.7 ns |
| 1 GHz | 0.35 ns |

If the signal's rise time is faster than the system's rise time, the displayed rise time will be the system's rise time, not the signal's.

## System Bandwidth

The measurement system bandwidth is limited by the slowest element:

**1/BW_system² ≈ 1/BW_probe² + 1/BW_scope²**

| Probe BW | Scope BW | System BW (approx.) |
|----------|----------|---------------------|
| 200 MHz | 100 MHz | ~89 MHz |
| 200 MHz | 200 MHz | ~141 MHz |
| 500 MHz | 100 MHz | ~98 MHz |
| 100 MHz | 100 MHz | ~71 MHz |

A 200 MHz probe on a 100 MHz scope gives about 89 MHz of system bandwidth — the scope is the bottleneck. Mismatched components waste capability.

## When Bandwidth Matters

**Matters:**
- Digital signals (SPI, I2C, UART at high rates) — fast edges carry high-frequency content regardless of data rate
- Switching power supplies — switch node transitions happen in nanoseconds even at hundreds of kHz switching frequency
- Rise/fall time measurements
- Ringing and overshoot from impedance mismatches
- Clock signal integrity, jitter, duty cycle

**Doesn't matter much:**
- DC voltage measurements
- Audio-frequency signals (< 20 kHz)
- Slow analog signals (temperature sensors, strain gauges, battery voltage)
- Low-frequency ripple on power rails (fundamental typically < 2 MHz)

## Tips

- Use the 5x rule: system bandwidth should be at least 5x the highest frequency of interest
- For rise time measurements, calculate the signal's f_knee (0.5 / t_rise) and ensure 5x that bandwidth
- Always compensate probes before bandwidth-critical measurements — adjust the trimmer cap on the scope's cal output
- Match probe bandwidth to scope bandwidth to avoid wasting capability

## Caveats

- 1x probes have much lower bandwidth than 10x — typically 6–15 MHz vs 100–200 MHz; the 10x attenuator forms a compensated divider that extends bandwidth
- Probe compensation affects bandwidth — an under-compensated or over-compensated probe has degraded frequency response
- Sample rate is not bandwidth — a scope with 1 GS/s and 100 MHz bandwidth still only shows 100 MHz of signal content
- Digital filtering can affect displayed bandwidth — some scopes apply interpolation or filtering that changes effective bandwidth

## In Practice

- Rise time that matches the scope's system rise time regardless of the signal being measured indicates the scope is the limiting factor, not the signal
- Displayed rise time can be corrected: t_signal = √(t_displayed² - t_system²)
- A 100 MHz scope showing a 5 ns edge is actually measuring a ~3.6 ns signal (√(5² - 3.5²))
- Ringing that appears on 10x but not 1x probe indicates the ringing frequency is above the 1x probe's bandwidth — the 1x is filtering it out
- Square wave that looks like a sine wave indicates fundamental frequency is near bandwidth and harmonics are being filtered
