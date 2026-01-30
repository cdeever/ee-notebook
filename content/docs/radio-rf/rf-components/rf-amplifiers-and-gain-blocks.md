---
title: "RF Amplifiers & Gain Blocks"
weight: 20
---

# RF Amplifiers & Gain Blocks

RF amplifiers are specified and behave differently than audio or DC amplifiers. There is no open-loop gain, no virtual ground, and no feedback resistor setting the gain. Instead, RF amplifiers are characterized by S-parameters, noise figure, compression points, and linearity — all specified into a 50-ohm system. Understanding these specifications is essential for building receiver chains, transmitter paths, and measurement systems that work as designed.

## How RF Amplifiers Differ

An op-amp is specified by open-loop gain, bandwidth, slew rate, and input offset voltage. An RF amplifier is specified by:

- **Gain (S21):** Forward transmission, in dB. How much the signal level increases from input to output. Typical values range from 10 to 25 dB for a single stage.
- **Noise figure (NF):** How much noise the amplifier adds to the signal, in dB. Critical for the first stage in a receiver. Values range from 0.5 dB (high-end LNA) to 6+ dB (general-purpose gain block).
- **P1dB (1 dB compression point):** The output power at which gain drops by 1 dB from its small-signal value. This marks the onset of saturation. Typical values: +10 to +20 dBm output for gain blocks.
- **IP3 (Third-Order Intercept Point):** A measure of linearity. Always higher than P1dB, typically by 10-15 dB. Higher IP3 means the amplifier generates fewer intermodulation products.
- **S-parameters:** Complete characterization of the amplifier's input/output impedance match and gain at every frequency.

## MMIC Gain Blocks

Monolithic Microwave Integrated Circuit (MMIC) gain blocks are the simplest RF amplifiers to use. They are internally matched to 50 ohms on both input and output, provide fixed gain, and require minimal external components — typically just DC blocking capacitors and a bias resistor or inductor.

Common MMIC gain blocks:

| Part | Gain (dB) | NF (dB) | P1dB Out (dBm) | Freq Range | Notes |
|------|-----------|---------|-----------------|------------|-------|
| Mini-Circuits ERA-3+ | 22 | 2.9 | +12.5 | DC-3 GHz | Popular for general amplification |
| Mini-Circuits PGA-103+ | 20 | 0.5 | +16.5 | 50-4000 MHz | Excellent LNA performance |
| Analog Devices ADL5544 | 17 | 2.7 | +21.5 | 30-6000 MHz | High P1dB for driving mixers |
| Qorvo QPA9419 | 14 | 2.0 | +22 | 0.5-4000 MHz | High linearity |

Using an MMIC gain block typically requires:
1. Input DC blocking capacitor (series, AC-couples the signal)
2. Output DC blocking capacitor
3. Bias network: an inductor or resistor from the supply to the output pin (the MMIC draws current through its output)
4. Bypass capacitor on the supply line

The simplicity of MMIC gain blocks makes them ideal for learning and prototyping. If you need amplification between 50-ohm stages and can accept the fixed gain, an MMIC is usually the right first choice.

## Low Noise Amplifiers (LNAs)

The LNA is the first amplification stage in a receiver, placed right after the antenna or antenna filter. Its noise figure dominates the receiver's overall noise performance because of the Friis equation: the noise figure of a cascade is dominated by the first stage, especially if it has gain.

**Friis equation (simplified for two stages):**

**NF_total = NF_1 + (NF_2 - 1) / G_1**

Where NF values are in linear (not dB), and G_1 is the linear gain of the first stage.

Example: An LNA with 1 dB NF and 15 dB gain followed by a mixer with 10 dB NF:
- NF_total = 1.26 + (10 - 1) / 31.6 = 1.26 + 0.28 = 1.54 (about 1.9 dB)

The same mixer preceded by a 6 dB NF gain block:
- NF_total = 3.98 + (10 - 1) / 31.6 = 3.98 + 0.28 = 4.26 (about 6.3 dB)

The difference between 1.9 dB and 6.3 dB system noise figure is enormous — it corresponds to roughly 4.4 dB of sensitivity difference, meaning the better LNA can detect signals that are 2.75 times weaker.

LNA design considerations:
- Input matching must be optimized for minimum noise, not necessarily best return loss. The noise-optimal source impedance is not always 50 ohms.
- LNA input protection (ESD diodes, limiters) adds loss before the LNA, directly degrading noise figure.
- Physical placement should be as close to the antenna as possible, with minimal loss between antenna and LNA input.

## Power Amplifiers (PAs)

Power amplifiers boost the signal to the level needed for transmission. They sit at the end of the transmit chain and must deliver milliwatts to watts of RF power.

Key PA considerations:

**Efficiency.** PAs consume the most power in a transmitter. Class A amplifiers are the most linear but only 25-35% efficient. Class AB provides 40-60% efficiency with moderate linearity. Class C, D, E, and F offer higher efficiency (60-90%) but are increasingly nonlinear, suitable only for constant-envelope modulation.

**Linearity.** Modern modulation schemes (QAM, OFDM) have varying envelope amplitude. A nonlinear PA compresses the peaks, creating spectral regrowth (interference in adjacent channels) and error vector magnitude (EVM) degradation. For these signals, either a linear PA (Class A/AB) or a nonlinear PA with digital predistortion (DPD) is required.

**Thermal management.** A PA delivering +30 dBm (1 W) at 50% efficiency consumes 2 W total, dissipating 1 W as heat. At +40 dBm (10 W) and 40% efficiency, the dissipation is 15 W. Adequate heatsinking, thermal vias under the device, and airflow are essential.

## Gain Flatness

An RF amplifier's gain varies across its operating frequency range. Gain flatness is specified as the peak-to-peak variation across a given bandwidth. For a receiver that operates over a 20 MHz bandwidth centered at 915 MHz, a gain flatness of +/- 0.5 dB means the amplifier gain varies by at most 1 dB across the band.

Gain flatness matters because:
- Receivers must have consistent sensitivity across their bandwidth
- Transmitters must have consistent output power across the channel
- Test equipment requires flat response for accurate measurements

MMIC gain blocks typically have +/- 0.5 to 1.5 dB gain flatness across their rated bandwidth. Narrower-bandwidth amplifiers with external matching can achieve +/- 0.1 dB.

## Stability

An RF amplifier can oscillate if the impedance it sees at its input or output provides enough feedback at the right phase. Stability analysis checks whether the amplifier will remain stable for any passive source and load impedance.

**Unconditionally stable:** The amplifier does not oscillate for any passive impedance presented at input or output. This is the desired condition for most applications.

**Conditionally stable:** The amplifier is stable for some impedances but can oscillate for others. This is common — many devices are conditionally stable at certain frequencies outside their intended band. Stability is frequency-dependent, and an amplifier stable at 2.4 GHz might oscillate at 800 MHz if the impedance is wrong.

Signs of oscillation:
- Output spectrum shows spurious signals not present at the input
- DC current draw changes when input or output impedance changes
- Gain is higher than expected (regenerative feedback adds gain before full oscillation)

Prevention:
- Add resistive loading (a stability resistor) at frequencies where the device is conditionally stable
- Ensure proper bypass and grounding — uncontrolled impedance at the supply pin can create feedback
- Use S-parameter simulation to check the Rollett stability factor (K > 1 and |Delta| < 1 for unconditional stability)

## Gotchas

- **Noise figure is only critical for the first stage** — After 15-20 dB of gain, the noise contribution of later stages is negligible. Do not waste money on a low-NF amplifier for the second or third stage.
- **P1dB and IP3 are output-referred unless stated otherwise** — A datasheet that says "P1dB = +15 dBm" usually means output P1dB. Input P1dB is approximately P1dB_out minus gain.
- **MMIC bias current flows through the output pin** — Forgetting the DC bias network (inductor or resistor to VCC on the output) means the MMIC gets no power. No bias, no gain.
- **Oscillation at a frequency you are not measuring is still oscillation** — An amplifier designed for 2.4 GHz might oscillate at 6 GHz. If your spectrum analyzer only goes to 3 GHz, you will not see it. Always check for out-of-band oscillation.
- **Amplifier gain changes with temperature** — Most RF amplifiers lose about 0.01-0.02 dB/C of gain as temperature rises. Over a 50C operating range, that is 0.5-1.0 dB of variation.
- **Never connect an RF amplifier output directly to another amplifier input without checking levels** — Cascading two high-gain blocks can easily exceed the P1dB of the second stage, causing severe distortion.
