---
title: "Level Shifting & Conditioning"
weight: 30
---

# Level Shifting & Conditioning

Real-world signals rarely arrive in the format an ADC expects. A sensor output might swing ±10 V while the ADC accepts 0 to 3.3 V. A microphone outputs millivolts AC while the converter needs a signal centered at mid-supply. Level shifting and conditioning bridges this gap — scaling, offsetting, and protecting the signal so the converter sees exactly what it needs, with maximum use of its input range.

## DC Biasing for Single-Supply ADCs

Most microcontroller ADCs run from a single positive supply and accept inputs from 0 V (or ground) to V_ref. AC signals that swing symmetrically around 0 V will clip on the negative half-cycle. The solution is to add a DC bias that shifts the signal to mid-range:

**Resistive divider bias:** Two equal resistors from V_ref to ground create a mid-supply reference (V_ref/2). The signal is AC-coupled through a capacitor to this bias point. Simple and effective for audio-frequency signals.

**Voltage reference bias:** For better accuracy, use a voltage reference or buffered divider to set the bias point. An unbuffered resistive divider has finite output impedance that the signal source loads.

**Design calculation example:** For a 3.3 V ADC with 0-3.3 V input range:
- Bias point: 1.65 V (mid-supply)
- Maximum signal swing: ±1.65 V peak before clipping
- With headroom margin: design for ±1.5 V peak (allows for component tolerance)
- AC coupling capacitor: C = 1/(2π × f_low × R_bias), where f_low is the lowest frequency of interest and R_bias is the parallel combination of the bias resistors

## Scaling and Attenuation

When the signal is larger than the ADC's input range, it must be attenuated. When smaller, it should be amplified to use more of the converter's dynamic range.

**Resistive divider attenuation:** The simplest approach — two resistors divide the signal. Attenuation = R₂/(R₁ + R₂). Works for slow signals but the divider impedance must be low enough that ADC sampling doesn't cause errors (the ADC's sample-and-hold capacitor must charge fully during the acquisition time).

**Op-amp scaling:** An inverting amplifier with gain < 1 attenuates, while providing low output impedance to drive the ADC. A non-inverting configuration with gain > 1 amplifies. The op-amp can also add the DC offset in the same stage, combining scaling and biasing.

**Differential to single-ended conversion:** Many sensors produce differential outputs (bridges, balanced audio). If the ADC is single-ended, a difference amplifier converts the signal. An instrumentation amplifier followed by a reference offset is the cleanest approach.

**Range considerations:** Use as much of the ADC's input range as possible without clipping. An ADC used at 25% of its range loses 2 bits of effective resolution — the signal occupies only 1/4 of the codes, wasting 3/4 of the converter's capability. See [Analog-to-Digital Converters]({{< relref "/docs/audio-signal/sampling-and-conversion/analog-to-digital-converters" >}}).

## Input Protection

The ADC input is typically the most vulnerable node in the signal chain. Overvoltage from hot-plugging, ESD, power supply transients, or fault conditions can damage the converter permanently.

**Clamp diodes** — Diodes to V_ref and ground (or to the supply rails) steer overvoltage current away from the ADC input. Most ADC inputs have internal ESD clamp diodes, but they're rated for brief transients, not sustained overvoltage. External Schottky diodes clamp faster and handle more energy. See [Diodes]({{< relref "/docs/analog/active-devices/diodes" >}}).

**Series resistance** — A resistor in series with the ADC input limits current during overvoltage events. The clamp diodes conduct and the resistor drops the excess voltage. Typical values: 100 Ω to 10 kΩ. Too much resistance slows ADC acquisition; too little doesn't protect.

**TVS diodes** — For harsh environments (industrial, automotive), TVS diodes provide fast, high-energy clamping. Choose a TVS with a clamping voltage just above the ADC's maximum input and a low capacitance that won't filter the signal.

**RC input filter** — A small RC filter (e.g., 100 Ω + 1 nF) at the ADC input serves double duty: it limits current during faults and provides some high-frequency filtering. This is often the last line of anti-alias defense and EMI rejection.

## Common Conditioning Circuits

**Single-supply AC measurement:** Resistive divider (100 kΩ + 100 kΩ from 3.3 V) for bias, AC coupling capacitor from the signal source, series resistor to ADC, clamp diodes. This handles audio signals, AC mains measurement (via a step-down transformer), and general AC sensing.

**High-voltage measurement:** Resistive divider with high-value resistors (e.g., 1 MΩ + 10 kΩ for ~100:1 attenuation), followed by a buffer amplifier. The divider resistors must be rated for the voltage. For mains-connected measurements, isolation (optocoupler or isolated amplifier) is essential for safety.

**Current sensing:** A shunt resistor converts current to voltage. For low-side sensing (shunt in the ground return), a standard op-amp works. For high-side sensing (shunt in the supply rail), a dedicated current-sense amplifier or instrumentation amplifier handles the common-mode voltage.

## Gotchas

- **ADC input impedance is not constant** — SAR ADCs present a switched-capacitor load that varies with sampling phase. The source must be able to charge the sample capacitor fully during the acquisition window. Buffer the signal or use a low source impedance
- **Bias resistors affect noise** — Higher-value bias resistors generate more thermal noise. A 100 kΩ bias network at room temperature produces ~4 µV/√Hz of noise. For low-noise applications, use lower resistor values and buffer
- **Clamp diode current limits** — Internal ADC clamp diodes typically handle only 1-5 mA. A 10 V overvoltage through a 1 kΩ series resistor drives 10 mA — exceeding the rating. Size the series resistor to limit current within the clamp diode spec
- **AC coupling creates low-frequency rolloff** — The coupling capacitor and bias resistors form a high-pass filter. For 20 Hz audio with 100 kΩ bias: C ≥ 1/(2π × 20 × 50k) ≈ 160 nF (using parallel R of 50 kΩ). Use the next standard value up
- **Protection adds parasitic capacitance** — Clamp diodes and TVS devices add capacitance to the ADC input, potentially limiting bandwidth or affecting the anti-alias filter response. Account for this in the filter design
