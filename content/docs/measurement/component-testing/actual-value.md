---
title: "What's the Actual Value?"
weight: 20
---

# What's the Actual Value?

Measuring R, C, and L to find out what a component actually is — not what's printed on it. Unmarked salvage parts, faded color codes, footprint-only SMD components, and "is this really a 10k?" questions all end up here.

## DMM: Resistance Measurement

**Tool:** DMM, Ohm mode
**When:** Measuring resistors, potentiometers, thermistors, or any resistive element

### Procedure

1. Remove the component from the circuit (or ensure no parallel paths affect the reading)
2. Set DMM to Ohms, auto-range
3. Connect probes to the component leads
4. Read the value

### Reading Accuracy

| Resistance range | Typical DMM accuracy | Notes |
|-----------------|---------------------|-------|
| < 1 Ohm | Poor on standard DMM | Lead resistance dominates — use 4-wire or null leads |
| 1 Ohm–1 MOhm | Good (0.5–1%) | Sweet spot for most DMMs |
| > 1 MOhm | Moderate (1–2%) | Humidity and surface contamination affect high-R readings |
| > 100 MOhm | Poor | Beyond most handheld DMM capability; use a megohmmeter or guarded measurement |

### Resistor Color Code Cross-Check

After measuring, compare to the color code or marking:

| Bands | Value | Tolerance |
|-------|-------|-----------|
| Brown-Black-Red-Gold | 1.0 kOhm | ±5% |
| Red-Red-Orange-Gold | 22 kOhm | ±5% |
| Brown-Black-Black-Brown-Brown | 1.00 kOhm | ±1% |

If the measured value disagrees with the marking by more than the tolerance band allows, the resistor has drifted or been damaged.

### Gotchas

- In-circuit resistance measurements are almost always wrong due to parallel paths. A 10 kOhm resistor in parallel with a 100 kOhm pull-up reads ~9.1 kOhm. Lift one leg for accurate measurement
- Body oils on high-value resistors (> 1 MOhm) can create a parallel leakage path across the component. Handle by the leads, not the body
- Potentiometers should be measured at both extremes and at mid-rotation. A scratchy pot may read correct at the extremes but have dead spots or jumps in the middle

## DMM: Capacitance Measurement

**Tool:** DMM with capacitance mode, or dedicated LCR meter
**When:** Identifying unmarked capacitors or verifying values

### Procedure

1. Discharge the capacitor (short leads through a resistor)
2. Remove from circuit if possible
3. Set DMM to capacitance mode
4. Connect the capacitor, observing polarity for electrolytics
5. Wait for the reading to settle — large capacitors take a few seconds

### Measurement Ranges

| Capacitance | Typical DMM capability | Better tool |
|-------------|----------------------|-------------|
| 1 pF–100 pF | Below most handheld DMM resolution | LCR meter |
| 100 pF–10 nF | Marginal — DMM may read, accuracy varies | LCR meter preferred |
| 10 nF–10,000 uF | Good — most DMMs handle this range well | DMM is fine |
| > 10,000 uF | Some DMMs time out on very large caps | Dedicated capacitance meter |

### SMD Capacitor Identification

SMD capacitors (especially MLCCs) usually have no value markings. To identify:

1. Measure capacitance directly with DMM or LCR meter
2. Note the package size — this constrains the possible values and voltage ratings
3. Cross-reference with the schematic if available

### Gotchas

- DMM capacitance mode measures at low voltage and low frequency. MLCC ceramics (Class II: X5R, X7R, Y5V) lose capacitance with applied DC voltage. A 10 uF X5R cap at 0V may measure 10 uF on a DMM but only provide 4 uF at its rated voltage. The DMM reading is "correct" but doesn't reflect actual in-circuit performance
- Temperature also affects Class II ceramics. Y5V caps can lose 50%+ of their capacitance at temperature extremes
- Electrolytic capacitors have a tolerance of -20/+80% or similar. A 100 uF electrolytic measuring 85 uF is within spec

## LCR Meter: Inductance Measurement

**Tool:** LCR meter or DMM with inductance mode
**When:** Measuring inductors, transformers, or identifying unmarked wound components

### Procedure

1. Remove the component from the circuit
2. Set LCR meter to inductance mode, select an appropriate test frequency (1 kHz is standard for most inductors)
3. Connect the component
4. Read inductance (L) and, if available, Q factor or DCR

### Test Frequency Matters

| Component | Recommended test frequency | Why |
|-----------|--------------------------|-----|
| Power inductors (1–100 uH) | 1 kHz–100 kHz | Avoid self-resonance, which is typically > 1 MHz |
| Small RF inductors (1–100 nH) | 1 MHz+ | Need enough frequency for measurable impedance |
| Common-mode chokes | 10 kHz–100 kHz | Measure at frequencies near intended use |
| Audio transformers | 1 kHz | Standard audio test frequency |

### Gotchas

- Inductance is frequency-dependent, especially for ferrite-core inductors. The value at 1 kHz and at 1 MHz can differ significantly due to core permeability changes
- Saturation: the LCR meter's test signal is small (milliamps). An inductor that measures 47 uH at zero DC bias may only have 20 uH at its rated current because the core saturates. LCR meters don't show this — you need a DC bias test or an inductance-vs-current curve
- Core damage (cracks in ferrite) reduces inductance. If a measured value is much lower than marked, inspect the core for physical damage

## Identifying Unmarked SMD Components

**Tool:** DMM (resistance, capacitance, diode mode) + context
**When:** You've desoldered an SMD component and don't know what it is

### Decision Flow

1. **Measure resistance.** < 1 Ohm with stable reading → likely inductor, ferrite bead, or jumper (zero-ohm resistor). Check with inductance mode to distinguish
2. **Try diode mode.** Shows forward voltage drop → semiconductor (diode, LED, TVS). 0.5–0.7V = silicon. 0.2–0.4V = Schottky. 1.5V+ = LED
3. **Measure capacitance.** Nonzero, stable reading → capacitor. Match to standard values (1 nF, 10 nF, 100 nF, 1 uF, 10 uF, etc.)
4. **Measure resistance again with reversed leads.** Same both ways = resistor. Different = semiconductor or polar cap
5. **Check context:** What's the footprint size? What's around it on the board? A 2-terminal device next to a power pin is likely a decoupling cap or ferrite bead. A 3-terminal device is likely a transistor or regulator

### Gotchas

- Zero-ohm resistors (jumpers) look identical to inductors and fuse links under the DMM. Check inductance — a jumper has none
- Very small ceramic capacitors (< 100 pF) may read as open on a DMM in all modes. They're not dead; they're just too small for the meter
- 3-terminal devices could be transistors, voltage regulators, or even small ICs. Package markings (if any remain) and circuit context are more useful than DMM measurements for identification
