---
title: "Oscillators & Phase Noise"
weight: 50
---

# Oscillators & Phase Noise

An oscillator generates a signal at a specific frequency — it is the heartbeat of every radio. In a receiver, the local oscillator (LO) drives the mixer for frequency conversion. In a transmitter, it sets the carrier frequency. The quality of this signal — how spectrally pure it is — directly affects the radio's ability to receive weak signals and avoid interfering with adjacent channels. Phase noise is the measure of that spectral purity, and it is one of the most important specifications in any RF system.

## LC Oscillators

The simplest RF oscillator uses an inductor and capacitor forming a resonant tank circuit, with an active device (transistor) providing gain to sustain oscillation. Common topologies include the Colpitts (capacitive voltage divider feedback), Hartley (inductive feedback), and Clapp (series LC in feedback path) configurations.

**Characteristics:**
- Frequency range: 1 MHz to several GHz depending on topology and device
- Q of the tank: limited by component Q (typically 30-100 for discrete LC)
- Phase noise: moderate, limited by tank Q
- Tunability: variable capacitor (varactor) or switched capacitor bank adjusts frequency
- Cost: low, built from discrete components

LC oscillators are the foundation of VCOs and tunable radio designs. Their main limitation is phase noise — the moderate Q of discrete LC components means the oscillator's spectral purity is moderate at best. For applications requiring better phase noise, the LC oscillator is usually locked to a crystal reference via a phase-locked loop (PLL).

## Crystal Oscillators

Quartz crystal resonators have Q values of 10,000 to 100,000+ — hundreds of times higher than LC circuits. This extremely high Q translates directly into low phase noise and excellent frequency stability.

**Types of crystal oscillators:**

| Type | Abbreviation | Stability | Phase Noise | Use Case |
|------|-------------|-----------|-------------|----------|
| Basic crystal oscillator | XO | +/- 20-50 ppm | Good | General clocking, non-critical RF |
| Temperature-compensated | TCXO | +/- 0.5-2 ppm | Good | GPS, cellular, portable radios |
| Oven-controlled | OCXO | +/- 0.01-0.1 ppb | Excellent | Lab instruments, base stations |
| Voltage-controlled crystal | VCXO | +/- 20-50 ppm (pullable) | Good | PLL references, clock recovery |

Crystal oscillators operate at fixed frequencies, typically from 1 MHz to about 200 MHz. Higher frequencies are achieved using overtone crystals (3rd, 5th harmonic) or by multiplying the crystal frequency.

A TCXO uses a temperature sensor and compensation network to correct for the crystal's frequency drift with temperature. An OCXO encloses the crystal in a temperature-controlled oven, holding it at a constant temperature (typically 70-80C) to virtually eliminate thermal drift. OCXOs provide the best stability but consume significant power (1-5 W during warmup).

## Voltage Controlled Oscillators (VCOs)

A VCO produces a frequency proportional to an input control voltage. The varactor diode in the LC tank changes capacitance with applied voltage, tuning the oscillation frequency.

**Key VCO specifications:**
- **Tuning range:** The span of frequencies the VCO can produce (e.g., 800-1000 MHz)
- **Tuning sensitivity (KVCO):** MHz per volt of control voltage (e.g., 50 MHz/V)
- **Phase noise:** Specified at an offset from the carrier (e.g., -110 dBc/Hz at 10 kHz offset)
- **Output power:** Typically -5 to +5 dBm
- **Pushing:** Frequency change per volt of supply voltage variation (lower is better)
- **Pulling:** Frequency change with load impedance variation (lower is better)

VCOs are the tunable element in PLLs. Their free-running phase noise is moderate (limited by varactor and tank Q), but when locked to a crystal reference in a PLL, the phase noise improves dramatically at offsets within the loop bandwidth.

## Phase Noise

Phase noise measures the spectral purity of an oscillator. An ideal oscillator produces energy at exactly one frequency — a perfect spike on a spectrum analyzer. A real oscillator spreads energy around the carrier, creating skirts that extend on both sides.

Phase noise is specified as the power density relative to the carrier, measured in dBc/Hz at a specific offset frequency:

**L(f_offset) = noise power in 1 Hz bandwidth at f_offset from carrier / carrier power**

Example: -110 dBc/Hz at 10 kHz offset means that in a 1 Hz bandwidth at 10 kHz away from the carrier, the noise is 110 dB below the carrier.

Typical phase noise values:

| Oscillator Type | Phase Noise at 10 kHz Offset | Phase Noise at 100 kHz Offset |
|----------------|------------------------------|-------------------------------|
| Free-running LC VCO | -80 to -100 dBc/Hz | -100 to -120 dBc/Hz |
| Crystal oscillator (XO) | -130 to -150 dBc/Hz | -150 to -170 dBc/Hz |
| TCXO | -120 to -140 dBc/Hz | -140 to -160 dBc/Hz |
| OCXO | -140 to -160 dBc/Hz | -160 to -175 dBc/Hz |
| PLL-synthesized (wideband) | -90 to -105 dBc/Hz | -110 to -130 dBc/Hz |

Phase noise typically improves at larger offsets, following a slope of -20 dB/decade (for 1/f^2 noise) or -30 dB/decade (for 1/f^3 noise from flicker noise in the active device). The close-in phase noise (1-10 kHz offset) is hardest to achieve and most affected by the active device's flicker noise.

## Why Phase Noise Matters

**Receiver sensitivity.** Phase noise on the LO spreads the converted signal and raises the noise floor near the desired signal. If a strong adjacent-channel signal is converted with a noisy LO, the LO's phase noise skirt extends into the desired channel, masking the weak signal. This is called reciprocal mixing.

**Adjacent-channel performance.** In a transmitter, phase noise creates spectral emissions in adjacent channels. Regulatory standards (FCC, ETSI) limit these emissions, which directly constrains allowable transmitter phase noise.

**Modulation quality.** Modern modulation schemes (64-QAM, 256-QAM, OFDM) are sensitive to phase noise because it smears the constellation points. High phase noise increases error vector magnitude (EVM) and reduces data throughput.

**Radar performance.** Phase noise limits a radar receiver's ability to detect slow-moving targets (small Doppler shifts). The radar LO's close-in phase noise must be lower than the target's Doppler return.

## Phase Locked Loops (PLLs)

A PLL combines the spectral purity of a crystal reference with the tunability of a VCO. The basic PLL consists of:

1. **Reference oscillator:** Crystal oscillator providing a stable, low-noise reference frequency
2. **Phase/frequency detector (PFD):** Compares the divided VCO output to the divided reference and produces an error signal
3. **Loop filter:** Low-pass filter that smooths the error signal into a control voltage
4. **VCO:** Produces the output frequency, tuned by the control voltage
5. **Dividers:** Programmable dividers on the reference and VCO paths set the output frequency as a rational fraction of the reference

Within the PLL's loop bandwidth, the output phase noise tracks the reference oscillator (multiplied by 20*log10(N), where N is the division ratio). Outside the loop bandwidth, the output phase noise is that of the free-running VCO. The loop filter bandwidth is the design tradeoff: wider bandwidth improves close-in phase noise (tracking the reference) but allows more VCO noise at larger offsets.

Modern PLL synthesizer ICs (such as the TI LMX2594, Analog Devices ADF4351, or MAX2871) integrate the PFD, dividers, and sometimes the VCO into a single chip, requiring only an external reference, loop filter, and output matching.

## Gotchas

- **Phase noise specification must include the offset frequency** — "-100 dBc/Hz" means nothing without specifying the offset. At 1 kHz offset, -100 dBc/Hz is poor for a crystal oscillator. At 1 MHz offset, it might be excellent.
- **PLL division ratio multiplies reference phase noise** — A PLL with N=1000 adds 60 dB to the reference phase noise (20*log10(1000)). A low-noise reference is essential for high-N synthesizers.
- **VCO pulling from load variation causes frequency instability** — Always isolate the VCO from varying loads with a buffer amplifier. Even small impedance changes at the output can pull the frequency by kHz.
- **Supply noise modulates the VCO frequency** — VCO pushing sensitivity of 1 MHz/V means 1 mV of supply noise creates 1 kHz of frequency modulation. Use a clean, well-regulated supply with excellent RF bypassing.
- **OCXO warmup takes minutes** — An oven-controlled oscillator reaches stable frequency only after the oven stabilizes, typically 3-10 minutes. Plan for this in system startup.
- **Free-running VCOs are not frequency-stable** — Without a PLL locking it to a reference, a VCO drifts with temperature, supply voltage, and mechanical vibration. Never use a free-running VCO where frequency accuracy matters.
