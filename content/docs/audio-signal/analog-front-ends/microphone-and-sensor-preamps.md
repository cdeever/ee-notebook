---
title: "Microphone & Sensor Preamps"
weight: 10
---

# Microphone & Sensor Preamps

The first active stage in a signal chain has an outsized influence on the entire system's noise performance. A preamplifier takes a weak signal — microvolts from a thermocouple, millivolts from a microphone, or nanoamps from a photodiode — and amplifies it to a level where subsequent stages can process it without degrading the SNR. Get the preamp wrong and no amount of downstream processing can recover the lost signal quality.

## Why the First Stage Dominates: Friis Intuition

The Friis formula for cascaded noise figures shows that the first stage's noise figure dominates the system:

NF_total ≈ NF₁ + (NF₂ - 1)/G₁ + (NF₃ - 1)/(G₁ × G₂) + …

The key insight: each subsequent stage's noise contribution is divided by the gain that precedes it. If the first stage has 20 dB of gain and a noise figure of 3 dB, the second stage's noise is attenuated by 20 dB when referred back to the input. This is why low-noise design effort concentrates on the preamp.

**Practical consequence:** A cheap noisy ADC following a good preamp can outperform an expensive low-noise ADC with a mediocre preamp, as long as the preamp has enough gain to lift the signal well above the ADC's noise floor.

## Impedance: Matching vs Bridging

How the source connects to the preamp determines both signal transfer and noise behavior:

**Impedance matching** (Z_load = Z_source) — Maximizes power transfer. Used in RF systems (50 Ω), some professional audio (600 Ω legacy), and transmission line termination. The signal voltage at the load is half the open-circuit source voltage.

**Impedance bridging** (Z_load >> Z_source) — Maximizes voltage transfer. Used in most audio and instrumentation applications. The preamp input impedance is typically 10× or more the source impedance. Nearly all the source voltage appears across the load.

**Noise implications:** The optimal source impedance for minimum noise depends on the amplifier's input noise voltage (e_n) and noise current (i_n). There's an optimum source impedance R_opt = e_n / i_n where total input-referred noise is minimized. For BJT-input op-amps, this favors low-impedance sources; for JFET/CMOS inputs, it favors higher impedances.

## Preamp Topologies

**Inverting amplifier** — Simple, predictable, with virtual ground at the input. Input impedance equals the input resistor (can be low). Good for current-output sources and when a defined input impedance is needed.

**Non-inverting amplifier** — High input impedance (set by the op-amp, not external resistors). Signal appears directly at the non-inverting input. Gain is 1 + Rf/Rg, so minimum gain is 1 (unity). The default choice for voltage-output sensors.

**Instrumentation amplifier** — Three op-amps (or a dedicated IC like INA128) providing differential input with high CMRR, high input impedance on both inputs, and gain set by a single resistor. Essential for bridge sensors, thermocouples, and any source where the signal rides on a common-mode voltage. CMRR > 80 dB is typical; precision instrumentation amps exceed 120 dB.

**Charge amplifier (transimpedance)** — Converts charge or current to voltage. A capacitor (for charge) or resistor (for current) in the feedback path of an op-amp. Used for piezoelectric sensors, photodiodes, and capacitive transducers. The feedback element sets the sensitivity; bandwidth is limited by the feedback network and op-amp GBW.

## Source-Specific Considerations

**Dynamic microphones** — Low impedance (150-600 Ω), low output (~1-5 mV), balanced. Need 40-60 dB of clean gain. BJT-input preamps often have lower noise at these source impedances. Phantom power (48 V) is not needed and should be blocked.

**Condenser/electret microphones** — Higher output, require bias voltage or phantom power. Electret capsules with built-in JFET buffer present a moderate source impedance. MEMS microphones often have digital (PDM) or analog outputs with built-in amplification.

**Piezoelectric sensors** — Very high source impedance (capacitive), charge output. Require either a charge amplifier or a buffer with extremely high input impedance (>10 MΩ, often >1 GΩ). JFET-input op-amps or dedicated charge amplifiers are necessary. Cable capacitance affects sensitivity if not using a charge amp.

**Resistive bridges (strain gauges, load cells)** — Differential millivolt output on a common-mode voltage. Instrumentation amplifier is the standard approach. Bridge excitation voltage, lead resistance, and CMRR all affect accuracy.

## Gotchas

- **Gain bandwidth product limits high-gain stages** — An op-amp with 10 MHz GBW at a gain of 1000 (60 dB) only has 10 kHz bandwidth. High-gain preamps may need faster op-amps or cascaded lower-gain stages
- **Input bias current creates offset with high-impedance sources** — A JFET-input op-amp has pA bias current; a BJT-input op-amp has nA to µA. With a 1 MΩ source, 100 nA of bias current creates 100 mV of offset — which may rail the output or reduce headroom
- **Phantom power can damage equipment** — 48 V phantom power applied to an unbalanced input or a ribbon microphone can cause damage. Preamp design must account for phantom power routing
- **Cable capacitance acts as a low-pass filter** — Long cables from high-impedance sources (guitar pickups, piezo sensors) roll off high frequencies. Moving the preamp close to the source (or using a buffer) solves this
- **EMI pickup scales with impedance** — Higher-impedance nodes pick up more electromagnetic interference. High-impedance preamp inputs need careful shielding, short traces, and guard rings on PCBs
