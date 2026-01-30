---
title: "Noise Sources"
weight: 10
---

# Noise Sources

Noise is the unwanted signal that sets the floor of your measurement — the minimum detectable signal, the limit of your resolution, the reason your clean sinewave has fuzz on it. Understanding where noise comes from and how it enters a circuit is the first step toward designing circuits that are quiet enough for the job.

## Fundamental Noise Sources

These noise sources are physical — they exist in every circuit because of the nature of electrons and materials. You can minimize them, but you can't eliminate them.

### Thermal Noise (Johnson-Nyquist Noise)

Every resistor generates noise because electrons are in thermal motion. This is the most fundamental noise source.

**V_noise = sqrt(4 x k x T x R x B)**

Where:
- k = Boltzmann's constant (1.38 x 10^-23 J/K)
- T = absolute temperature (Kelvin)
- R = resistance (ohms)
- B = bandwidth (Hz)

**Key properties:**
- White spectrum — equal power at all frequencies
- Proportional to the square root of resistance. 10 kohm is 3.16x noisier than 1 kohm (sqrt(10))
- Proportional to the square root of bandwidth. Narrowing the bandwidth by 100x reduces noise by 10x
- Proportional to the square root of temperature. Cooling helps, but the effect is moderate at room temperature

**Practical impact:** A 10 kohm resistor at room temperature generates about 13 nV/sqrt(Hz), or about 1.3 uV in a 10 kHz bandwidth. This is small, but in a gain-of-1000 amplifier, it becomes 1.3 mV at the output — easily measurable and possibly significant.

### Shot Noise

Caused by the discrete nature of electric charge. Whenever current flows across a potential barrier (a PN junction, a vacuum tube), individual charge carriers arrive at random intervals, creating noise.

**I_noise = sqrt(2 x q x I_DC x B)**

Where q = electron charge (1.6 x 10^-19 C) and I_DC is the DC current.

**Key properties:**
- White spectrum (like thermal noise)
- Proportional to the square root of DC current
- Present in diodes, transistors (collector current), photodiodes, LEDs

**Practical impact:** Shot noise dominates in photodiode circuits, low-current bias circuits, and any high-impedance node where small currents flow across junctions.

### Flicker Noise (1/f Noise)

Noise whose power density increases at lower frequencies. The power spectrum goes as 1/f — hence the name.

**Key properties:**
- Dominates at low frequencies. At some corner frequency (f_c), flicker noise equals white noise. Below f_c, flicker noise dominates. Above f_c, white noise dominates
- Present in all active devices (transistors, op-amps, resistors)
- Worse in MOSFETs than BJTs (surface effects vs. bulk effects). BJTs typically have lower 1/f corner frequencies
- Carbon composition resistors have more 1/f noise than metal film

**Practical impact:** Matters for DC and low-frequency precision circuits. A precision amplifier measuring a slowly changing sensor signal sees flicker noise as a significant error source. Chopper-stabilized amplifiers were invented specifically to overcome this.

## Where Noise Actually Enters a Circuit

Beyond the fundamental sources, noise gets into circuits through practical paths:

### Power Supply Noise

Switching regulator ripple, mains hum (50/60 Hz), and broadband regulator noise all appear on power rails. If the PSRR of your circuit isn't adequate, supply noise becomes signal noise. See [Decoupling & Bypassing]({{< relref "/docs/analog/power-and-regulation/decoupling-and-bypassing" >}}).

### Ground Noise

Multiple return paths with different impedances create voltage differences between "ground" points. High-frequency digital switching current returning through the ground plane creates millivolt-level noise that sensitive analog circuits can pick up. This is the classic mixed-signal design challenge.

### Electromagnetic Pickup

High-impedance nodes act as antennas. A 10 Mohm node with 1 cm of exposed trace picks up ambient electromagnetic fields (radio stations, switching supplies, fluorescent lights, nearby digital circuits). Shielding, guarding, and keeping high-impedance traces short mitigate this.

### Capacitive Coupling (Crosstalk)

Nearby traces couple signals through parasitic capacitance. A fast digital signal on one trace induces noise on an adjacent analog trace. The coupling increases with frequency, proximity, and trace length.

### Inductive Coupling (Magnetic)

Current-carrying loops create magnetic fields that induce voltage in nearby loops. The induced voltage is proportional to the rate of current change (dI/dt) and the mutual inductance between loops. This is why minimizing loop area is a fundamental noise reduction technique.

## Quantifying Noise

### Noise Spectral Density

Noise is characterized by its spectral density — noise power (or voltage) per unit bandwidth. Units: nV/sqrt(Hz) for voltage noise, pA/sqrt(Hz) for current noise.

To get total noise in a bandwidth: V_total = V_density x sqrt(bandwidth) (for white noise only; for 1/f noise, the integration is different).

### Signal-to-Noise Ratio (SNR)

SNR = signal power / noise power, expressed in dB.

SNR (dB) = 20 x log10(V_signal / V_noise) for voltage ratios.

A 60 dB SNR means the signal is 1000x larger than the noise voltage. A 12-bit ADC needs at least 74 dB SNR to use all its bits. A 16-bit ADC needs 98 dB.

### Noise Figure

How much noise a circuit adds beyond the thermal noise of its source impedance.

NF (dB) = 10 x log10(SNR_in / SNR_out)

A noiseless amplifier has NF = 0 dB. Real amplifiers add noise: NF = 1-5 dB for low-noise designs, 10+ dB for general-purpose.

## Gotchas

- **Noise adds in quadrature** — Uncorrelated noise sources add as root-sum-of-squares, not linearly. Two equal noise sources together produce sqrt(2) x the individual noise, not 2x. The largest source dominates
- **Bandwidth determines total noise** — A noisy circuit with a narrow bandwidth may have less total integrated noise than a quiet circuit with a wide bandwidth. Limiting bandwidth is the single most effective noise reduction technique
- **The first stage dominates** — In a multistage amplifier, the first stage's noise gets amplified by all subsequent stages. Making the first stage low-noise is far more effective than making later stages low-noise (Friis formula)
- **Noise measurements require averaging** — Noise is random. A single oscilloscope capture gives one realization. You need averaging (or spectrum analysis) to characterize noise accurately
- **EMI is not noise** — Interference from external sources (switching supply harmonics, radio signals, digital crosstalk) is deterministic, not random. It can be eliminated by shielding, filtering, or fixing the source. True noise cannot be eliminated — only minimized
