---
title: "Function / Signal Generator"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Function / Signal Generator

A signal generator provides known, controllable stimuli for testing circuits. Instead of hoping the right signal comes along, you inject one — a sine wave to measure frequency response, a square wave to test step response, a pulse train to simulate a clock, an arbitrary waveform to mimic a sensor output. It turns "what happens if..." into a controlled experiment.

## What It Does

A function/signal generator produces periodic waveforms (sine, square, triangle, ramp, pulse) at adjustable frequency and amplitude. More capable generators add arbitrary waveform (AWG) capability — uploading custom waveforms from data files or math definitions — and modulation (AM, FM, PM, PWM, sweep, burst).

The output is typically a low-impedance source (50Ω) designed to drive transmission lines and test equipment. The generator sets the frequency, amplitude, offset, and waveshape; the circuit under test responds; and the oscilloscope shows what happened.

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| Maximum frequency | Highest output frequency for sine (other waveforms usually lower) | Determines what frequencies you can test. 20 MHz covers audio and most embedded work; 50+ MHz needed for RF and high-speed digital |
| Sample rate (AWG) | How fast the DAC updates the output in arbitrary mode | Higher sample rate = smoother output waveforms and higher maximum arbitrary waveform frequency. Must be ≥2.5× the highest frequency content in the waveform |
| Vertical resolution (DAC bits) | Number of bits in the output DAC (12, 14, or 16 typical) | More bits = smoother waveform amplitude steps and lower quantization noise. Matters for low-distortion sine waves and precise arbitrary waveforms |
| Waveform memory | Number of points that can define an arbitrary waveform | Longer waveforms or higher detail require more memory. 16k points is basic; 1M+ points allows complex or long sequences |
| Output impedance | Source impedance of the output (almost always 50Ω) | Determines how the output voltage divides with the load. Into a 50Ω load, the voltage at the load is half the displayed value (if the generator displays the open-circuit voltage). Some generators let you set displayed amplitude as "into 50Ω" or "high-Z" |
| Amplitude range | Output voltage range (Vpp, Vrms, or dBm) | Must cover the signal levels you need. Common range: 1 mVpp to 10 Vpp (into 50Ω). Higher amplitude often requires an external amplifier |
| THD (Total Harmonic Distortion) | Harmonic content in the sine wave output | Lower THD = purer sine wave. Matters for audio THD+N measurements and filter testing where you need to distinguish circuit distortion from source distortion |
| Flatness | Amplitude variation across the frequency range | Ideally the output amplitude stays constant as frequency changes. A spec of ±0.5 dB means the amplitude varies by up to ±6% across the band |
| Modulation types | AM, FM, PM, FSK, PWM, sweep, burst | Needed for testing modulation circuits, simulating communication signals, and frequency response sweeps |

## DDS vs AWG

**DDS (Direct Digital Synthesis)** generators produce standard waveforms (sine, square, triangle) by stepping through a lookup table at the DAC sample rate. The frequency resolution is extremely fine (microhertz), and phase continuity is maintained during frequency changes. DDS generators are the workhorses for producing clean, stable standard waveforms.

**AWG (Arbitrary Waveform Generator)** capability adds the ability to output any user-defined waveform. The waveform is loaded into memory as a series of amplitude values, and the DAC plays them back in sequence. AWG mode enables complex stimuli — modulated carriers, multi-tone signals, sensor output emulation, digital patterns with specific timing, and waveforms captured from real circuits and replayed into test setups.

Most modern signal generators include both DDS and AWG functions in the same box.

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Entry** (DDS only, single channel) | 1–20 MHz sine, 14-bit DAC, basic modulation, no AWG | Audio testing, basic filter characterization, clock simulation, embedded stimulus | RF work, low-distortion measurements, complex arbitrary waveforms, multi-channel synchronization |
| **Mid-range** (DDS + AWG, 2 channels) | 20–60 MHz sine, 14–16-bit DAC, deep AWG memory, sweep/burst/modulation | General embedded and analog testing, frequency response sweeps, sensor simulation, protocol stimulus | High-frequency RF, ultra-low distortion (<−80 dBc), wideband arbitrary waveforms |
| **High-end** (wideband AWG, multi-channel) | 100 MHz+ sine, 16-bit DAC, GS/s sample rate, long memory, channel synchronization | RF stimulus, high-speed digital pattern generation, radar/communications waveforms, automated production test | Dedicated RF signal generator territory (phase noise, modulation accuracy) |

## Gotchas and Limits

- **50Ω output impedance and voltage doubling:** If the generator is set to display amplitude "into 50Ω" but the load is high impedance (like a scope at 1 MΩ), the actual voltage at the load is twice the displayed value. Many generators let you select "50Ω" or "High-Z" display mode — set it to match the actual load impedance.
- **Square wave bandwidth is not sine wave bandwidth:** A generator rated at "25 MHz sine" may only produce square waves up to 5–10 MHz with acceptable rise times. The square wave spec is often listed separately and is always lower than the sine spec.
- **Rise time depends on the generator, not just the frequency:** A "1 MHz square wave" from an entry-level generator may have 20 ns rise time, while the same frequency from a high-end generator has 3 ns. If testing rise-time-sensitive circuits, the generator's rise time matters.
- **DC offset range interacts with amplitude:** Maximum offset is often limited by the total output voltage swing. A generator with ±5V range cannot produce 8 Vpp with a 3V offset because the positive peak (7V) exceeds the range.
- **Sync output is not a clean clock:** The "Sync" or "TTL Out" on most generators is a logic-level square wave synchronized to the main output. It has its own rise time and jitter, which may be worse than the main output. Do not use it as a precision timing reference.

## Tips

- Use the sweep function with the oscilloscope to quickly map a filter's frequency response — set the generator to sweep across the band of interest while the scope shows the output amplitude
- When testing amplifier distortion, keep the generator's THD significantly below (>10×) the distortion level you are trying to measure in the circuit. If the generator has −60 dBc THD and you are trying to measure −65 dBc distortion, the generator is the limit
- Use burst mode to simulate intermittent signals (packet data, sensor pulses, motor start/stop) without manually toggling the output
- For differential circuit testing, use a 2-channel generator with inverted outputs to create a differential stimulus
- Always verify the generator output on the scope before connecting to the circuit under test — confirm frequency, amplitude, offset, and waveform shape are correct

## Caveats

- **Output amplitude accuracy degrades at high frequency** — The flatness spec applies. A generator rated ±1 dB over its range may output 10% more or less signal at the frequency extremes than at mid-band
- **AWG quantization noise is real** — A 14-bit DAC has a noise floor around −84 dBc. For low-level signal simulation or noise-sensitive circuits, this quantization noise may affect the measurement
- **Triggering the scope from the generator's sync output adds jitter** — For precise timing measurements, trigger from the main output instead and use the scope's trigger level to catch the waveform directly
- **Modulation depth and frequency interact** — At high modulation depths or fast modulation rates, some generators produce artifacts because the DAC or output amplifier runs into slew-rate limits

## In Practice

- A filter whose measured response does not match simulation may be seeing distortion from the generator — check the stimulus purity by connecting the generator directly to the scope and measuring THD (or looking at the FFT) before blaming the filter
- When a circuit behaves differently at "the same frequency" from different generators, the difference is usually in the rise time, harmonic content, or output impedance — not the fundamental frequency
- Amplitude that varies as you sweep frequency indicates the generator's flatness limitation, not necessarily a frequency-dependent gain change in the circuit. Calibrate the measurement by sweeping with no circuit (generator straight into scope) first
- If a circuit oscillates when driven by the generator but not with its real signal source, the generator's output impedance (50Ω) may differ from the real source impedance, changing the loading and stability conditions
