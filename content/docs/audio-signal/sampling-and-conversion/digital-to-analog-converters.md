---
title: "Digital-to-Analog Converters"
weight: 30
---

# Digital-to-Analog Converters

A DAC converts a digital number back into an analog voltage or current. The process seems straightforward — map binary codes to proportional output levels — but the details of how this is done affect glitches, noise, distortion, settling time, and ultimately the quality of the reconstructed signal. DAC architecture choices mirror ADC choices: there are fundamental tradeoffs between speed, resolution, accuracy, and cost.

## DAC Architectures

### R-2R Ladder

A resistor network that produces binary-weighted currents using only two resistor values (R and 2R). Each bit switches a current branch that contributes a power-of-two fraction of the reference current.

- **Speed:** Moderate to fast (settling is determined by resistor and switch parasitics)
- **Resolution:** Practical up to 12-16 bits (resistor matching limits accuracy)
- **Characteristics:** Simple, well-understood. Monotonicity is guaranteed by design. Resistor matching determines linearity — at 16 bits, the MSB resistor must match to 0.0015%. Laser-trimmed thin-film resistors are used in high-resolution versions

### Current-Steering

An array of matched current sources (usually weighted or segmented), each steered to the output or a dummy load by a differential switch. The output current is the sum of all active sources.

- **Speed:** Very fast — dominant architecture for high-speed DACs (100 Msps to multi-Gsps)
- **Resolution:** 8-16 bits
- **Characteristics:** Differential output by design. Segmented architectures (thermometer-coded MSBs, binary LSBs) reduce glitch energy. Used in communications, radar, and high-speed signal generation

### Delta-Sigma

Like the delta-sigma ADC in reverse: a high-speed, low-resolution (often 1-bit) modulator produces a bitstream whose average value represents the desired output. An analog reconstruction filter converts the bitstream to a smooth analog signal.

- **Speed:** High internal clock, moderate output bandwidth
- **Resolution:** 16-32 bits (through noise shaping)
- **Characteristics:** Inherent low-pass filtering simplifies reconstruction. Excellent linearity (a 1-bit DAC is inherently linear). Used in nearly all audio DACs and precision applications. The same delta-sigma principles from [Sampling Theory]({{< relref "sampling-theory" >}}) apply

### PWM as a DAC

A digital timer generates a pulse-width modulated signal where the duty cycle represents the analog value. A low-pass filter extracts the average (DC) value.

- **Speed:** Limited by PWM frequency and filter settling
- **Resolution:** Limited by timer resolution and clock jitter
- **Characteristics:** No dedicated DAC hardware needed — any MCU timer can generate PWM. Resolution = log₂(timer period / clock period). A 16 MHz timer with 8-bit PWM (256 counts) runs at 62.5 kHz. Useful for control loops, LED dimming, and simple audio — see [Timers & Counters]({{< relref "/docs/embedded" >}}) in the Embedded section

## Reconstruction Filtering

The raw DAC output is a staircase (zero-order hold) that contains images of the signal spectrum centered at multiples of the sample rate. A reconstruction filter removes these images, leaving only the baseband signal.

**Zero-order hold effects:** The staircase output has a sinc-shaped frequency response with nulls at multiples of f_s. The first null is at f_s, which means frequencies near f_s/2 are attenuated by the sinc rolloff (about -3.9 dB at f_s/2). This "sinc droop" must be compensated — either with a digital pre-emphasis filter (inverse sinc) or accepted as part of the system response.

**Modern approach:** Oversampling DACs (delta-sigma and oversampled R-2R) run the internal conversion at a much higher rate, pushing the spectral images far from the signal band. A simple, gentle analog filter then suffices for reconstruction. This is why modern audio DACs achieve excellent performance with minimal analog filtering.

## Glitches and Settling

When a DAC changes output code, the transition is not instantaneous:

**Code-dependent glitches** — In binary-weighted architectures, the major carry transition (e.g., from 0111...1 to 1000...0) can produce large transient glitches because all bits switch simultaneously and don't all settle at exactly the same time. The MSB turns on slightly before the others turn off (or vice versa), creating a momentary wrong output.

**Glitch energy** is measured in pV-s (picovolt-seconds) or nV-s and represents the area of the glitch pulse. Lower glitch energy means less distortion.

**Settling time** — The time for the output to reach its final value within a specified accuracy (typically ±½ LSB) after a code change. This limits the maximum update rate and determines how quickly the DAC can follow a changing signal.

**Deglitching:** A sample-and-hold circuit after the DAC output captures the settled value and holds it, masking the glitch. This is common in high-resolution audio DACs. Alternatively, current-steering DACs with segmented architectures minimize glitches by design.

## Key Specifications

- **INL / DNL** — Same meaning as for ADCs. DNL > 1 LSB means non-monotonic output (increasing codes don't always produce increasing output), which is a serious problem for control loops
- **Monotonicity** — Every increasing code produces an equal or increasing output. Guaranteed by design in R-2R ladders, not guaranteed in all architectures
- **Output impedance** — Voltage-output DACs have low impedance; current-output DACs have high impedance and need an external transimpedance amplifier or load resistor
- **SFDR** — Spurious-free dynamic range: the ratio of the signal to the largest spurious component. Often the limiting spec for communications DACs

## Gotchas

- **PWM DAC resolution is limited by jitter** — Clock jitter modulates the pulse edges, adding noise. At high resolution, jitter noise can exceed quantization noise, making additional timer bits useless. A 1 ns jitter on a 62.5 kHz PWM limits effective resolution to roughly 10 bits
- **Reconstruction filter must match the application** — An audio DAC needs a flat passband to 20 kHz with steep rolloff above. A control DAC needs fast settling with no overshoot. Different applications demand different filter designs
- **Current-output DACs need a good output amp** — The output op-amp must settle fast enough, handle the compliance voltage range, and not add significant distortion. The amplifier often limits the DAC's dynamic performance
- **Reference quality matters as much as DAC quality** — A noisy or drifting voltage reference directly modulates the output. A 24-bit DAC with a noisy reference performs like a 16-bit DAC
- **Differential outputs need proper termination** — High-speed current-steering DACs have differential outputs that must be terminated correctly. Impedance mismatches create reflections and even-order distortion
- **Don't ignore the update rate** — A DAC that can output 16-bit values but only updates at 1 kHz produces a staircase with 1 ms steps. For smooth analog output, the update rate must be much higher than the signal frequency
