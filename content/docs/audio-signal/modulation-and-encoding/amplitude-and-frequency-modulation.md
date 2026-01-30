---
title: "Amplitude & Frequency Modulation"
weight: 10
---

# Amplitude & Frequency Modulation

Modulation impresses information onto a carrier signal by varying one of its properties — amplitude, frequency, or phase. This is most familiar in radio (AM/FM broadcast), but the same principles appear throughout electronics: chopper-stabilized amplifiers, lock-in measurement, ultrasonic sensors, and analog signal multiplexing all use modulation to move signals to frequencies where they can be processed more effectively.

## Why Modulation Exists

A baseband signal (like audio: 20 Hz - 20 kHz) can't be transmitted efficiently through free space — the required antenna size would be kilometers long. Modulation shifts the signal to a higher frequency (the carrier) where transmission is practical. But modulation isn't just for radio:

- **Frequency shifting** — Move a signal away from DC to avoid 1/f noise and DC offset drift (chopper amplifiers)
- **Multiplexing** — Multiple signals can share a medium by modulating onto different carrier frequencies (FDM — frequency division multiplexing)
- **Noise immunity** — An FM signal is resistant to amplitude variations (interference, fading), which is why FM radio sounds cleaner than AM
- **Bandwidth matching** — Match the signal to the channel's characteristics

## Amplitude Modulation (AM)

The carrier amplitude varies proportionally to the modulating signal:

s(t) = [1 + m × x(t)] × cos(2πf_c × t)

where m is the modulation index (0 to 1 for conventional AM), x(t) is the baseband signal, and f_c is the carrier frequency.

**Sidebands and bandwidth:** Modulation creates new frequency components:
- A carrier at f_c modulated by a single tone at f_m produces three components: f_c (carrier), f_c + f_m (upper sideband), and f_c - f_m (lower sideband)
- A baseband signal with bandwidth B produces sidebands spanning f_c - B to f_c + B
- **AM bandwidth = 2 × baseband bandwidth** — AM is spectrally inefficient because it transmits the information twice (in both sidebands) plus the carrier (which carries no information)

**AM variants:**
- **DSB-SC (Double Sideband Suppressed Carrier)** — Remove the carrier. All power goes into the sidebands. Requires coherent (synchronous) demodulation
- **SSB (Single Sideband)** — Transmit only one sideband. Half the bandwidth, but harder to generate and demodulate. Used in HF radio communications
- **AM with envelope detection** — Standard broadcast AM. The carrier enables simple demodulation with a diode and capacitor (envelope detector) — no frequency reference needed at the receiver

**Overmodulation (m > 1):** The carrier envelope crosses zero, which distorts the signal when demodulated with an envelope detector. This doesn't destroy the information (coherent demodulation still works), but it creates distortion for simple receivers.

## Frequency Modulation (FM)

The carrier frequency varies proportionally to the modulating signal:

s(t) = cos(2π[f_c + Δf × x(t)] × t)

where Δf is the peak frequency deviation — how far the carrier frequency swings from its center value.

**Deviation and modulation index:** The FM modulation index β = Δf / f_m, where f_m is the modulating frequency. For FM broadcast: Δf = 75 kHz, so β ranges from about 5 (for 15 kHz audio) down to very large values for low-frequency content.

**Carson's rule** for FM bandwidth:

BW ≈ 2 × (Δf + f_m) = 2 × f_m × (β + 1)

FM broadcast bandwidth is about 200 kHz — much wider than AM's ~10 kHz, but the extra bandwidth buys noise immunity.

**FM noise advantage:** FM is inherently resistant to amplitude noise because information is in the frequency, not the amplitude. A limiter in the receiver strips off amplitude variations. This gives FM a significant SNR advantage over AM for a given transmit power — the classic wideband-for-noise tradeoff (Shannon's theorem in action).

**Pre-emphasis and de-emphasis:** FM noise increases with frequency (triangular noise spectrum). To compensate, the transmitter boosts high frequencies before modulation (pre-emphasis) and the receiver attenuates them after demodulation (de-emphasis). This equalizes the noise spectrum and improves perceived SNR, particularly for audio.

## Non-RF Applications of Modulation

Modulation techniques appear in signal processing and measurement contexts far from radio:

**Chopper amplifiers** — Modulate a DC or low-frequency signal to a higher frequency (typically kHz), amplify it in a region free of 1/f noise and DC offset, then demodulate back. Modern zero-drift op-amps (e.g., OPAx177, ADS1235) use this technique internally to achieve microvolt-level offset and negligible drift.

**Lock-in amplifiers** — Modulate the excitation signal at a known reference frequency. The lock-in detector demodulates the response at exactly that frequency, rejecting all noise at other frequencies. This allows measurement of signals buried 60-100 dB below the noise floor. See [Noise & Signal Quality]({{< relref "/docs/audio-signal/signals-and-waveforms/noise-and-signal-quality" >}}).

**Ultrasonic sensing** — Modulate ultrasonic carriers (40 kHz+) for distance measurement, flow metering, and non-destructive testing. The modulation technique (pulse, CW, chirp) determines range resolution and accuracy.

**Phase-locked loops (PLLs)** — Use FM principles to track and synthesize frequencies. The PLL locks a VCO to a reference, enabling frequency multiplication, clock recovery, and demodulation. PLLs bridge [RF]({{< relref "/docs/radio-rf" >}}) and [digital clocking]({{< relref "/docs/digital/timing-and-synchronization" >}}).

## Gotchas

- **AM is not just for radio** — Any nonlinear operation (mixing, multiplication, switching) creates amplitude modulation. Intermodulation distortion in amplifiers is AM between interfering signals. Understanding AM sidebands helps diagnose distortion products
- **FM deviation must match the receiver bandwidth** — Too little deviation wastes SNR advantage. Too much deviation exceeds the receiver filter bandwidth and causes distortion. The modulation index must be designed for the channel
- **Carson's rule is approximate** — It captures about 98% of FM signal power. The actual FM spectrum has infinite extent (Bessel function sidebands). For strict out-of-band emission limits, the true spectrum must be calculated
- **Chopper artifacts** — Residual carrier feedthrough in chopper amplifiers appears as small spikes at the chopping frequency. These are usually filtered by an output low-pass filter, but they limit the useful output bandwidth
- **AM envelope detectors distort on fast signals** — The diode-capacitor detector tracks the envelope, but the discharge time constant must be slow enough to follow the carrier and fast enough to follow the modulation. Wrong time constant = diagonal clipping distortion
