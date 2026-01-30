---
title: "Analog-to-Digital Converters"
weight: 20
---

# Analog-to-Digital Converters

An ADC converts a continuous voltage into a digital number. The fundamental operation is comparison: the input voltage is compared against reference levels, and the result is encoded as a binary word. Everything about ADC design is a tradeoff between resolution, speed, power, cost, and accuracy — and the architecture chosen reflects which tradeoffs matter most for the application.

## Resolution vs ENOB

**Resolution** is the number of output bits — a 12-bit ADC produces codes from 0 to 4095. But resolution is not accuracy. A 16-bit ADC might only perform like a 12-bit ADC due to noise, distortion, and non-linearity.

**ENOB (Effective Number of Bits)** is the resolution that the converter actually achieves, accounting for all real-world impairments:

ENOB = (SINAD - 1.76) / 6.02

Where SINAD is the signal-to-noise-and-distortion ratio in dB. A 16-bit ADC with 84 dB SINAD has an ENOB of (84 - 1.76)/6.02 ≈ 13.7 bits — it wastes more than 2 bits of resolution on noise and distortion.

| Stated Resolution | Typical ENOB | Lost Bits |
|-------------------|-------------|-----------|
| 8-bit | 7.5-8 | 0-0.5 |
| 12-bit | 10-11.5 | 0.5-2 |
| 16-bit | 12-14 | 2-4 |
| 24-bit | 17-21 | 3-7 |

**Why the gap grows with resolution:** Achieving true 24-bit performance (144 dB dynamic range) requires sub-microvolt noise levels and parts-per-million linearity. Real circuits can't economically achieve this, so high-resolution ADCs trade resolution for other properties (noise shaping, oversampling).

## ADC Architectures

### Successive Approximation Register (SAR)

The workhorse architecture. A binary search algorithm: compare the input to V_ref/2, then V_ref/4, etc., narrowing in on the answer one bit at a time over N clock cycles for N bits.

- **Speed:** Moderate — typically 100 ksps to 10 Msps
- **Resolution:** 8-20 bits
- **Power:** Low — good for battery-powered systems
- **Characteristics:** One sample per N clock cycles. Excellent for multiplexed inputs. Common in MCU ADC peripherals

### Delta-Sigma (ΔΣ)

Oversamples at a very high rate and uses a noise-shaping feedback loop to push quantization noise out of the signal band. A digital decimation filter then produces high-resolution samples at the output rate.

- **Speed:** Slow to moderate output rate — the high internal clock yields low output rates after decimation
- **Resolution:** 16-32 bits (highest available)
- **Power:** Moderate
- **Characteristics:** Excellent for DC and low-frequency measurements (precision instruments, audio). Inherent anti-aliasing from the digital filter. Settling time means multiplexing is slow. Most 24-bit audio converters are delta-sigma

### Pipeline

Multiple stages, each resolving a few bits and passing the residue to the next stage. All stages operate simultaneously on different samples — like an assembly line.

- **Speed:** Fast — 10 Msps to 1+ Gsps
- **Resolution:** 8-16 bits
- **Power:** Higher
- **Characteristics:** High throughput but multi-cycle latency (pipeline delay). Used in video, communications, and instrumentation where speed matters

### Flash

All comparators operate in parallel — 2^N - 1 comparators for N bits. The fastest possible architecture.

- **Speed:** Very fast — 1+ Gsps
- **Resolution:** Limited to 6-8 bits (exponential comparator count)
- **Power:** High
- **Characteristics:** Single-cycle conversion. Used in oscilloscopes, radar, and as sub-ADCs within pipeline architectures

## Sampling Rate Tradeoffs

Higher sampling rates provide:
- More bandwidth (higher Nyquist frequency)
- Relaxed anti-alias filter requirements
- Lower latency (less delay between signal change and digital output)
- Oversampling benefits for delta-sigma architectures

But cost:
- More data to store and process
- Higher power consumption
- Potentially worse ENOB (speed-resolution tradeoff)
- More demanding clock requirements (jitter matters more at higher frequencies)

For MCU ADC peripherals, the sampling rate is often limited by the conversion time and the processor's ability to handle the data — see [Analog Peripherals]({{< relref "/docs/embedded" >}}) in the Embedded section.

## Key Specifications Beyond Resolution

- **INL (Integral Non-Linearity)** — Maximum deviation of the actual transfer function from a straight line. Affects accuracy across the full range
- **DNL (Differential Non-Linearity)** — Variation in step size between adjacent codes. DNL > 1 LSB means missing codes
- **Input bandwidth** — The -3 dB frequency of the input stage, often much higher than the Nyquist frequency. Useful for bandpass sampling
- **Reference quality** — The ADC is only as accurate as its reference. Reference noise and drift directly appear in the output

## Gotchas

- **ENOB drops with input frequency** — ADC specs are usually given at low input frequencies. At higher input frequencies, ENOB degrades due to aperture jitter, comparator settling, and other dynamic effects. Check the datasheet's ENOB vs frequency plot
- **Missing codes** — If DNL exceeds 1 LSB, some output codes never appear. A "12-bit" ADC with missing codes effectively has lower resolution. Check DNL specs
- **SAR ADCs have a kickback transient** — The sampling capacitor switching creates a current pulse on the input. The source must settle from this disturbance within the acquisition window. Use a low-impedance buffer or an RC filter designed for the ADC's sampling behavior
- **Delta-sigma settling time** — After changing channels or input conditions, a delta-sigma ADC needs multiple output samples to settle its internal filters. Don't trust the first several readings after a change
- **Don't confuse throughput with bandwidth** — A 1 Msps SAR ADC doesn't necessarily have 500 kHz analog bandwidth. The actual usable bandwidth depends on ENOB at the frequency of interest
