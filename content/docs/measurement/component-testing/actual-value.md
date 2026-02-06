---
title: "What's the Actual Value?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What's the Actual Value?

Measuring R, C, and L to find out what a component actually is — not what's printed on it. Unmarked salvage parts, faded color codes, footprint-only SMD components, and "is this really a 10k?" questions all end up here.

## Resistance Measurement

Remove the component from the circuit (or ensure no parallel paths affect the reading), set DMM to Ohms auto-range, and read the value.

| Resistance range | Typical DMM accuracy | Notes |
|-----------------|---------------------|-------|
| < 1 Ω | Poor on standard DMM | Lead resistance dominates — use 4-wire or null leads |
| 1 Ω – 1 MΩ | Good (0.5–1%) | Sweet spot for most DMMs |
| > 1 MΩ | Moderate (1–2%) | Humidity and surface contamination affect readings |
| > 100 MΩ | Poor | Beyond most handheld DMM capability |

After measuring, compare to the color code or marking. If the measured value disagrees by more than the tolerance band allows, the resistor has drifted or been damaged.

## Capacitance Measurement

Discharge the capacitor first, remove from circuit if possible, set DMM to capacitance mode. Large capacitors take a few seconds to settle.

| Capacitance | Typical DMM capability | Better tool |
|-------------|----------------------|-------------|
| 1 pF – 100 pF | Below most handheld DMM resolution | LCR meter |
| 100 pF – 10 nF | Marginal accuracy | LCR meter preferred |
| 10 nF – 10,000 µF | Good | DMM is fine |
| > 10,000 µF | Some DMMs time out | Dedicated capacitance meter |

SMD capacitors (especially MLCCs) usually have no value markings. Measure capacitance directly and cross-reference with schematic if available.

## Inductance Measurement

Remove the component from circuit, set LCR meter to inductance mode at appropriate test frequency (1 kHz is standard for most inductors).

| Component | Recommended test frequency | Why |
|-----------|--------------------------|-----|
| Power inductors (1–100 µH) | 1 kHz – 100 kHz | Avoid self-resonance (typically > 1 MHz) |
| Small RF inductors (1–100 nH) | 1 MHz+ | Need enough frequency for measurable impedance |
| Common-mode chokes | 10 kHz – 100 kHz | Near intended use frequency |
| Audio transformers | 1 kHz | Standard audio test frequency |

## Identifying Unmarked SMD Components

**Decision flow:**

1. **Measure resistance.** < 1 Ω with stable reading → likely inductor, ferrite bead, or zero-ohm jumper. Check inductance to distinguish.
2. **Try diode mode.** Shows forward voltage → semiconductor. 0.5–0.7V = silicon, 0.2–0.4V = Schottky, 1.5V+ = LED.
3. **Measure capacitance.** Nonzero stable reading → capacitor. Match to standard values.
4. **Measure resistance with reversed leads.** Same both ways = resistor. Different = semiconductor or polar cap.
5. **Check context:** Footprint size, surrounding components. 2-terminal near power pin = likely decoupling cap or ferrite. 3-terminal = likely transistor or regulator.

## Tips

- For resistance < 1 Ω, use 4-wire measurement or null lead resistance first
- Handle high-value resistors (> 1 MΩ) by the leads, not the body — skin oils create parallel leakage
- Test potentiometers at both extremes and mid-rotation — scratchy pots may have dead spots
- Discharge capacitors before measuring — residual charge affects readings and can damage meters

## Caveats

- In-circuit resistance measurements are almost always wrong due to parallel paths
- DMM capacitance mode measures at low voltage and low frequency — MLCC ceramics (X5R, X7R, Y5V) lose capacitance with applied DC voltage, so the DMM reading doesn't reflect in-circuit performance
- Temperature affects Class II ceramics significantly — Y5V caps can lose 50%+ at temperature extremes
- Electrolytic capacitors have -20/+80% tolerance — a 100 µF measuring 85 µF is within spec
- Inductance is frequency-dependent — value at 1 kHz vs 1 MHz can differ significantly for ferrite-core inductors
- LCR meter test signal is small (milliamps) and doesn't show saturation effects — an inductor may measure 47 µH at zero bias but only 20 µH at rated current
- Zero-ohm resistors (jumpers) look identical to inductors under the DMM — check inductance
- Very small ceramic capacitors (< 100 pF) may read as open on a DMM

## In Practice

- Resistance measurement that differs from color code by more than tolerance indicates drift or damage
- Capacitor measuring correct value but circuit still misbehaves suggests ESR or voltage derating issue — DMM capacitance doesn't reveal these
- Inductor measuring much lower than marked value suggests core damage (cracks in ferrite) — inspect physically
- 3-terminal SMD device that doesn't behave like a transistor in diode mode could be a voltage regulator or small IC — package markings and circuit context help more than DMM
- Potentiometer that reads correctly at extremes but jumps erratically in the middle has worn resistive element
- **A component that measures within tolerance on a component tester but causes circuit malfunction** often shows up when the component's parameter at the specific operating condition (voltage, temperature, frequency) differs from its parameter at the tester's conditions — the component is "healthy" by the tester's standard but "broken" for the circuit's requirements.
