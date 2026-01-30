---
title: "Common SDR Architectures"
weight: 50
---

# Common SDR Architectures

SDR hardware comes in a wide range of designs, from $20 USB dongles to multi-thousand-dollar research platforms. Each makes different architectural choices about how to get from the antenna connector to the digital samples that software processes. Understanding these architectures helps you choose the right tool for a given task and explains why different platforms have such different performance characteristics.

## Direct Sampling

In a direct-sampling SDR, the ADC digitizes the RF signal without any analog frequency conversion. The antenna signal passes through a filter and LNA, then goes directly into the ADC.

**Advantages:** No mixer means no mixer spurious responses, no image frequencies, and no local oscillator leakage. The architecture is conceptually simple and avoids many analog impairments.

**Limitations:** The ADC must sample fast enough to capture the highest frequency of interest (respecting Nyquist). For HF signals (up to 30 MHz), this requires a 60+ MSPS ADC — readily available. For VHF and above, direct sampling requires very fast, very expensive ADCs with excellent clock sources.

**Where it is used:** HF SDR receivers, some research platforms, and sigma-delta receiver architectures. The Red Pitaya (125 MSPS, 14-bit) can directly sample up to about 60 MHz. Some KiwiSDR configurations use direct sampling for the HF bands.

Direct sampling with bandpass (undersampling) techniques can extend the usable frequency range by deliberately aliasing a higher-frequency band down to the ADC's baseband — but this requires excellent analog bandpass filtering at the RF frequency (see [Sampling Theory at RF]({{< relref "/docs/radio-rf/software-defined-radio/sampling-theory-at-rf" >}})).

## Single-Conversion (Superheterodyne SDR)

The most common architecture in affordable SDR hardware. An analog tuner chip downconverts the desired RF frequency to a lower intermediate frequency (IF), which is then digitized by a lower-speed ADC.

**Signal chain:** Antenna → preselector → LNA → mixer/tuner → IF filter → ADC → digital processing

The mixer's local oscillator (LO) is tunable, allowing the SDR to receive any frequency within the tuner's range. The IF frequency is fixed, so the ADC and digital processing always operate at the same frequency regardless of what RF frequency is being received.

**Advantages:** The ADC only needs to digitize the IF bandwidth (typically a few MHz), not the full RF frequency. This allows the use of slower, higher-resolution ADCs. The tuner chip handles frequency selection in the analog domain.

**Limitations:** The mixer introduces spurious responses (images, harmonics, intermodulation). The tuner's analog filtering determines out-of-band rejection. The local oscillator's phase noise limits the noise floor around strong signals.

## Common SDR Platforms

### RTL-SDR (R820T/RTL2832U)

The RTL-SDR is the entry point for most SDR users. Originally designed as a DVB-T TV tuner, it was repurposed for general-purpose SDR reception when developers discovered the RTL2832U chip could stream raw I/Q samples over USB.

- **Architecture:** Single-conversion (R820T tuner → RTL2832U demodulator/ADC)
- **Frequency range:** 24 MHz - 1766 MHz (with gaps)
- **ADC:** 8-bit, up to ~2.4 MSPS effective bandwidth
- **Dynamic range:** ~48 dB instantaneous
- **TX capability:** None (receive only)
- **Interface:** USB 2.0
- **Price:** $10-30

The RTL-SDR is remarkably capable for its price. It can receive FM broadcast, amateur radio (VHF/UHF), ADS-B aircraft transponders, weather satellites, pagers, and hundreds of other signals. Its limitations — 8-bit resolution, limited front-end filtering, moderate oscillator stability — are acceptable for casual exploration and learning. The V3 and V4 versions include a TCXO (temperature-compensated crystal oscillator) for improved frequency stability and bias-tee power output for active antennas and LNAs.

### HackRF One

- **Architecture:** Single-conversion, wideband
- **Frequency range:** 1 MHz - 6 GHz
- **ADC/DAC:** 8-bit, 20 MHz bandwidth
- **Dynamic range:** ~48 dB
- **TX capability:** Yes, half-duplex (can transmit OR receive, not simultaneously)
- **Interface:** USB 2.0
- **Price:** $300-350

HackRF's distinguishing feature is its enormous frequency range and transmit capability. It covers almost every band from HF through WiFi's 5 GHz band. The 20 MHz bandwidth is wide enough to see entire broadcast bands or capture wide signals. The transmit capability enables experiments with signal generation, replay attacks (legally and ethically, on your own devices), and antenna testing.

The limitation is still 8-bit resolution. HackRF has the same dynamic range challenges as the RTL-SDR, just with wider bandwidth and TX capability. It is a breadth tool, not a depth tool.

### ADALM-Pluto (PlutoSDR)

- **Architecture:** Direct-conversion (AD9363 transceiver IC)
- **Frequency range:** 325 MHz - 3.8 GHz (hackable to 70 MHz - 6 GHz)
- **ADC/DAC:** 12-bit, up to 20 MHz bandwidth
- **Dynamic range:** ~72 dB
- **TX capability:** Yes, full duplex
- **Interface:** USB 2.0 (with internal ARM processor)
- **Price:** $150-250

The Pluto is Analog Devices' educational SDR platform, built around the AD9363 — a real transceiver IC used in commercial radio equipment. It has 12-bit resolution (a significant step up from 8-bit), full-duplex operation (simultaneous transmit and receive), and an onboard ARM processor that can run GNU Radio or custom applications.

The Pluto is particularly well-suited for learning digital communications — modulation, coding, and protocol design — because it can both transmit and receive simultaneously. With two Plutos, you can build a complete wireless communication link.

### Airspy (Mini, R2, HF+, HF+ Discovery)

The Airspy family offers a range of platforms optimized for different use cases:

- **Airspy Mini:** 24-1700 MHz, 12-bit, 6 MHz bandwidth, $100
- **Airspy R2:** 24-1700 MHz, 12-bit, 10 MHz bandwidth, $170
- **Airspy HF+ Discovery:** 0.5 kHz - 31 MHz + 60-260 MHz, 16-bit effective, $170

The HF+ Discovery is notable for achieving exceptional dynamic range on HF through oversampling and digital decimation — 16+ effective bits from an 18-bit ADC. Its front-end design specifically addresses the strong-signal challenges of the HF bands, making it one of the best low-cost options for HF reception.

### SDRplay (RSP1A, RSPdx, RSPduo)

- **Architecture:** Single-conversion
- **Frequency range:** 1 kHz - 2 GHz
- **ADC:** 14-bit
- **Bandwidth:** Up to 10 MHz
- **Price:** $110-270

SDRplay platforms offer 14-bit resolution at a moderate price. The RSPduo has two independent tuners, enabling diversity reception or simultaneous monitoring of two bands. The 14-bit ADC provides noticeably better dynamic range than 8-bit platforms — roughly 24 dB more, which makes a real difference in strong-signal environments.

## Platform Comparison

| Platform | Freq Range | ADC Bits | BW (MHz) | TX | Dynamic Range | Price |
|----------|-----------|----------|----------|-----|--------------|-------|
| RTL-SDR V4 | 24-1766 MHz | 8 | 2.4 | No | ~48 dB | $30 |
| HackRF One | 1 MHz-6 GHz | 8 | 20 | Half-duplex | ~48 dB | $325 |
| ADALM-Pluto | 325 MHz-3.8 GHz | 12 | 20 | Full-duplex | ~72 dB | $200 |
| Airspy Mini | 24-1700 MHz | 12 | 6 | No | ~72 dB | $100 |
| Airspy HF+ Disc. | 0.5 kHz-260 MHz | 16 eff. | 0.66 | No | ~90+ dB | $170 |
| SDRplay RSP1A | 1 kHz-2 GHz | 14 | 10 | No | ~84 dB | $110 |
| KiwiSDR | 10 kHz-30 MHz | 14 | 0.032 each | No | ~84 dB | $300 |

## Choosing a Platform

The right SDR depends on what you want to do:

**Casual exploration, ADS-B, FM, weather satellites:** RTL-SDR. It is cheap enough to buy without deliberation and capable enough for hundreds of interesting experiments.

**Learning digital communications, TX experiments:** ADALM-Pluto. Full duplex, 12-bit, and backed by Analog Devices' educational materials.

**Wide-bandwidth work, security research:** HackRF. 6 GHz range and 20 MHz bandwidth cover almost everything.

**HF reception, amateur radio, weak signals:** Airspy HF+ Discovery or SDRplay RSPdx. High dynamic range matters when strong broadcast stations share the HF bands with weak amateur signals.

**Antenna testing, spectrum monitoring:** Depends on frequency range. Airspy or SDRplay for general VHF/UHF. HackRF for microwave bands.

## Gotchas

- **8-bit and 12-bit are not just "slightly different"** — The jump from 8-bit to 12-bit is 24 dB of dynamic range — a factor of 250 in power. In a strong-signal environment, 12 bits is qualitatively different from 8 bits, not just quantitatively better.
- **Frequency range on paper versus in practice** — The HackRF covers 1 MHz to 6 GHz, but performance varies enormously across that range. Sensitivity and filtering are better in some bands than others. Check user reports for your specific frequency of interest.
- **TX capability requires legal awareness** — Transmitting on most frequencies requires a license. Even licensed transmission must comply with power limits and out-of-band emission standards. An unfiltered SDR transmitter produces harmonics that can interfere with other services. Always use appropriate filtering and power levels.
- **USB 2.0 is a bandwidth bottleneck** — USB 2.0's practical throughput is about 30-40 MB/s. At 16-bit I/Q and 20 MSPS, that is 80 MB/s — beyond what USB 2.0 can sustain. Higher-end SDRs use USB 3.0, Ethernet, or PCIe to overcome this limitation.
- **Software support varies** — Not all SDR hardware works with all SDR software. RTL-SDR has the broadest software ecosystem because of its popularity. More specialized platforms may require specific software or plugins. Check compatibility before purchasing.
- **The antenna is still the most important component** — A $300 SDR with a poor antenna performs worse than a $20 RTL-SDR with a good antenna tuned for the frequency of interest. Budget for antennas, not just the SDR hardware.
