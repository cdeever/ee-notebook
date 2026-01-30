---
title: "Clocking & Jitter"
weight: 20
---

# Clocking & Jitter

Every sampled system runs on a clock, and every real clock has imperfections. Jitter — the variation in timing of clock edges from their ideal positions — directly translates into noise and distortion in the sampled signal. For high-resolution audio and precision measurement, clock quality is often the limiting factor: a perfect 24-bit ADC with a noisy clock performs like a 16-bit ADC. Understanding jitter, its sources, and its consequences is essential for getting real performance out of high-resolution converters.

## Aperture Jitter and SNR

When an ADC samples a signal, the exact moment of sampling varies from the ideal by the jitter amount Δt. If the signal is changing at that moment, the timing error translates to an amplitude error:

ΔV = dV/dt × Δt = 2πf × V_peak × Δt (for a sinusoid)

The resulting SNR limit from jitter alone:

SNR_jitter = -20 × log₁₀(2πf × Δt_rms)

**Jitter-limited SNR for common scenarios:**

| Signal Frequency | 100 ps jitter | 1 ns jitter | 10 ns jitter |
|-----------------|---------------|-------------|--------------|
| 1 kHz | 116 dB | 96 dB | 76 dB |
| 10 kHz | 96 dB | 76 dB | 56 dB |
| 20 kHz | 90 dB | 70 dB | 50 dB |
| 100 kHz | 76 dB | 56 dB | 36 dB |
| 1 MHz | 56 dB | 36 dB | 16 dB |

**Key insight:** Jitter matters more at higher signal frequencies. A DC signal is unaffected by jitter (dV/dt = 0). A high-frequency signal changes rapidly, so even small timing errors produce large amplitude errors. This is why audio systems can tolerate more jitter than wideband instrumentation systems.

**Jitter budget for audio:** At 20 kHz with 16-bit quality (96 dB SNR), the clock needs < 1 ns RMS jitter. For 24-bit quality (144 dB), the clock needs < 4 ps — which is why 24-bit audio performance is so hard to achieve at the system level.

## Clock Sources for Converters

Not all clocks are created equal. The clock quality directly determines converter performance:

**Crystal oscillators** — The standard for audio clocks. Common audio frequencies: 24.576 MHz (for 48 kHz and multiples) and 22.5792 MHz (for 44.1 kHz and multiples). Good crystals achieve < 1 ps RMS jitter in the audio band. TCXO (temperature-compensated) and OCXO (oven-controlled) variants improve frequency accuracy but don't always improve jitter.

**MCU internal oscillators** — RC oscillators built into MCUs have jitter of 1-10 ns or more. Adequate for 8-12 bit converters but entirely inadequate for high-resolution audio. Always use an external crystal for audio-quality conversion.

**PLLs (Phase-Locked Loops)** — Used to multiply or divide clock frequencies. A PLL generating 24.576 MHz from a 12 MHz reference adds jitter — the PLL's VCO has its own phase noise, and the loop bandwidth determines how much reference jitter passes through versus VCO jitter dominating. Audio-grade PLLs are designed for low jitter in the audio band (20 Hz - 20 kHz), even if their wideband jitter is higher.

**Clock recovery from data** — S/PDIF and AES/EBU receivers recover the clock from the incoming data stream. The recovered clock carries the jitter of the source plus the jitter added by the cable and receiver PLL. This is why asynchronous sample rate converters (ASRCs) are used to reclock data from external sources.

## Clock Distribution and Isolation

Getting a clean clock from the oscillator to the converter is a distribution problem:

**Dedicated clock lines** — The clock trace should be short, direct, and away from noisy digital signals. Don't route the converter clock alongside SPI bus lines or PWM outputs.

**Buffer/driver** — If the clock must drive multiple converters, use a dedicated clock buffer (not a logic gate, which adds jitter). Clock distribution ICs (e.g., Si5351, CDCE913) generate multiple synchronized outputs from a single reference.

**Power supply isolation** — Supply noise on the clock source modulates the edge timing, adding jitter. Use a separate, well-filtered supply for the oscillator and clock distribution circuitry. An LDO dedicated to the clock circuit is common in audio designs.

**Clock domain separation** — Keep the converter clock domain separate from the MCU and digital logic clock domains. If the MCU clock and ADC clock are related (derived from the same source), synchronization is easier, but noise coupling between domains must be managed. If they're independent, a sample rate converter or FIFO is needed at the domain boundary.

## Jitter Types

**Random jitter (RJ)** — Gaussian-distributed, caused by thermal noise, shot noise, and oscillator phase noise. Unbounded (in theory), but described by RMS value. Cannot be eliminated, only minimized by better components and design.

**Deterministic jitter (DJ)** — Bounded and repeatable. Caused by:
- **Periodic jitter (PJ)** — Spurs from supply noise, crosstalk at specific frequencies. Appears as discrete sidebands around the carrier in phase noise plots
- **Data-dependent jitter (DDJ)** — Caused by bandwidth limitations and intersymbol interference on the clock path. Pattern-dependent
- **Duty-cycle distortion (DCD)** — Asymmetry between rising and falling edges

**Total jitter** = RJ + DJ. For audio, random jitter typically dominates. For high-speed data links, deterministic jitter is often the larger concern.

See [Clocks]({{< relref "/docs/digital/timing-and-synchronization" >}}) in the Digital Electronics section for clock generation and distribution in digital systems.

## Gotchas

- **Jitter specs are measured over a bandwidth — check which one** — Audio jitter matters from 20 Hz to 20 kHz. Wideband jitter (10 Hz to 10 MHz) is a different, usually larger number. A clock with "100 fs" jitter measured over 12 kHz to 20 MHz might have 1 ps jitter in the audio band. Compare like with like
- **USB audio has inherent jitter challenges** — USB isochronous transfers deliver audio in packets at 1 ms intervals. The host clock and device clock are asynchronous. Adaptive mode (device follows host clock) adds jitter; asynchronous mode (device has its own clock, host adapts) is preferred for quality
- **Jitter multiplies through PLLs** — If a PLL has a multiplication ratio of N, and its input has jitter Δt, the output jitter is at least Δt (and usually worse due to VCO noise). High-multiplication PLLs need careful design to maintain low output jitter
- **Ground and power noise modulate the sampling instant** — Even with a perfect clock oscillator, noise on the ADC's supply or ground shifts the internal comparator thresholds, effectively adding jitter. Converter analog supply filtering is critical
- **Measuring sub-nanosecond jitter requires specialized equipment** — A standard oscilloscope with 1 GS/s sampling can measure jitter down to about 1 ns. Sub-nanosecond and picosecond jitter requires a dedicated phase noise analyzer or a high-speed oscilloscope with statistics capability. Don't assume your measurement reflects the true clock quality unless you've verified the instrument's noise floor
