---
title: "Pulse-Based Encoding"
weight: 20
---

# Pulse-Based Encoding

Instead of varying a sinusoidal carrier's amplitude or frequency, pulse-based techniques encode analog information in the timing or density of digital pulses. PWM (Pulse Width Modulation) and PDM (Pulse Density Modulation) are the two dominant approaches — and they're everywhere in modern electronics: motor control, LED dimming, Class-D audio amplifiers, MEMS microphones, and delta-sigma converter output stages all use pulse-based encoding.

## PWM (Pulse Width Modulation)

The signal value is encoded as the duty cycle of a fixed-frequency pulse train. A 50% duty cycle represents mid-scale; 0% and 100% represent the extremes.

**How it works:** A comparator compares the analog input to a triangle or sawtooth reference waveform. When the signal exceeds the reference, the output is HIGH; otherwise, LOW. The duty cycle of the output directly represents the input amplitude.

**Key parameters:**
- **PWM frequency (f_PWM):** Must be much higher than the signal bandwidth. For audio (20 kHz signal), f_PWM is typically 200 kHz to 1 MHz. For motor control, 10-100 kHz is common
- **Resolution:** Determined by the timer clock frequency divided by PWM frequency. At 100 MHz clock and 100 kHz PWM: 1000 steps ≈ 10 bits. Increasing resolution requires either a faster clock or a lower PWM frequency
- **Demodulation:** A low-pass filter extracts the average value (the signal). The filter must pass the signal bandwidth but reject the PWM frequency and its harmonics

**PWM for DAC applications:** Any MCU timer can generate PWM, making it a zero-cost DAC. The output is a digital signal (rail-to-rail switching) that averages to the desired analog value after filtering. See [Digital-to-Analog Converters]({{< relref "/docs/audio-signal/sampling-and-conversion/digital-to-analog-converters" >}}).

**Resolution vs PWM frequency tradeoff:**

| Clock | PWM Freq | Resolution |
|-------|----------|------------|
| 16 MHz | 62.5 kHz | 8 bits (256 steps) |
| 16 MHz | 31.25 kHz | 9 bits (512 steps) |
| 100 MHz | 100 kHz | ~10 bits (1000 steps) |
| 100 MHz | 48 kHz | ~11 bits (2083 steps) |

## PDM (Pulse Density Modulation)

The signal value is encoded as the density of pulses in a bitstream. A high signal produces more 1s; a low signal produces more 0s. Unlike PWM, there is no fixed pulse width — the bit rate is constant, and the information is in the ratio of 1s to 0s over a given window.

**Connection to delta-sigma:** PDM is the natural output of a 1-bit delta-sigma modulator. The modulator compares the input to the running integral of the output bitstream and adjusts the next bit to minimize the error. Quantization noise is shaped to high frequencies (noise shaping), leaving the baseband clean.

**MEMS microphones with PDM output:** Many modern MEMS microphones output a PDM bitstream directly, running at 1-4 MHz. The receiving MCU or codec decimates this bitstream (low-pass filters and downsamples) to produce PCM audio samples at the desired rate (e.g., 48 kHz, 16-24 bits). The decimation filter replaces the analog anti-alias filter.

**PDM bit rates and resolution:** A 3.072 MHz PDM bitstream decimated to 48 kHz has an oversampling ratio (OSR) of 64. With a well-designed sigma-delta modulator and decimation filter, this yields approximately 16-bit equivalent resolution. Higher OSR or higher-order modulators increase the effective resolution.

## Class-D Amplifiers

Class-D audio amplifiers are essentially high-power PWM (or PDM) systems. The audio input modulates the duty cycle of a switching output stage, and a low-pass filter (the speaker's inductance, sometimes augmented with an LC filter) reconstructs the analog audio.

**Why Class-D dominates modern audio:** Efficiency. The output transistors are either fully ON or fully OFF, so they dissipate minimal power (no linear region operation). Practical efficiency: 85-95%, compared to 25-50% for Class-A/B. This means less heat, smaller heat sinks, and longer battery life.

**PWM vs PDM in Class-D:**
- **PWM-based (analog or digital):** Most common. Fixed switching frequency, variable duty cycle. EMI spectrum is concentrated at the switching frequency and harmonics — easier to filter
- **PDM/sigma-delta based:** Variable switching frequency, noise-shaped spectrum. Can achieve higher linearity but EMI spectrum is spread across a wider band

**Output filter:** An LC filter (typically 10-47 µH inductor, 0.1-1 µF capacitor) smooths the switching waveform. The filter cutoff must pass audio (20 kHz) and reject the switching frequency (200+ kHz). Speaker inductance provides some of this filtering inherently, so some filterless Class-D designs connect the output directly to the speaker.

## Encoding for Signal Transmission

Pulse-based encoding also applies to transmitting signals over digital links:

- **PWM servo control** — Standard RC servo protocol: 1-2 ms pulse width at 50 Hz encodes the desired position. Simple but limited resolution (~10 bits) and slow update rate
- **Sigma-delta data links** — Some sensor interfaces transmit a PDM bitstream over a single wire, requiring only a digital input and a decimation filter at the receiver
- **Pulse-position modulation (PPM)** — Information is in the timing of pulse edges. Used in some optical and UWB communications. More power-efficient than PWM

## Gotchas

- **PWM switching noise is real** — The fast edges of PWM signals generate significant EMI. Layout, shielding, and edge rate control matter. A 500 kHz PWM signal has harmonics extending into the tens of MHz
- **Filter design is critical for audio PWM** — An inadequate reconstruction filter lets PWM carrier energy reach the speaker, causing heating (ultrasonic currents in the voice coil) and potentially audible intermodulation distortion with the audio signal
- **PDM decimation filter quality determines performance** — A simple averaging filter on a PDM bitstream gives poor stopband rejection and allows noise-shaped high-frequency quantization noise to alias back into the audio band. Proper CIC or multi-stage decimation filters are necessary
- **Clock jitter limits PWM resolution** — Jitter on the PWM timer clock modulates the pulse edges, adding noise. At 10-bit PWM resolution, clock jitter of ~1 ns is acceptable. At 12+ bits, jitter requirements become stringent — see [Clocking & Jitter]({{< relref "/docs/audio-signal/practical-signal-reality/clocking-and-jitter" >}})
- **Class-D dead time adds distortion** — To prevent shoot-through (both output transistors on simultaneously), a dead time is inserted during switching transitions. This creates crossover distortion similar to Class-B amplifiers. Compensation techniques exist but add complexity
- **PWM duty cycle extremes are problematic** — Very narrow or very wide pulses (near 0% or 100% duty cycle) may be shorter than the minimum switching time of the output stage, causing nonlinearity or missing pulses at signal extremes
