---
title: "ESR Meter Usage — Peak Atlas ESR70"
weight: 30
---

# ESR Meter Usage — Peak Atlas ESR70

![Peak Atlas ESR70](images/peak-esr70.png)

Quick reference for the Peak Atlas ESR70 (ESR Gold). Measures ESR and capacitance of electrolytic capacitors, including in-circuit ESR.

## Basic Operation

The ESR70 is about as simple as a test instrument gets:

1. Power on (single button)
2. Touch probes to the capacitor
3. Read the display — ESR in ohms, capacitance in µF
4. That's it. No mode selection, no range setting.

The meter auto-starts measurement when it detects a component on the probes.

## What the Display Shows

| Reading | Meaning |
|---|---|
| ESR value (Ω) | Equivalent series resistance at the test frequency (~50–100 kHz) |
| Capacitance (µF) | Measured capacitance (out-of-circuit only) |
| Audible tone | Pitch varies with ESR — low tone = low ESR (good), high tone = high ESR (suspect) |

## Probe Connections

- Gold-plated crocodile clips with 2mm plugs
- Probes are removable — any 2mm-compatible probes can be used
- Extra-long silicone-covered cables (450mm)
- For tight spaces, remove the crocodile clips and use the bare probe tips

## Procedures

### Out-of-Circuit Capacitor Test

The full test — gives you both ESR and capacitance:

1. **Discharge the capacitor first.** Short the leads with a resistor (100Ω is fine) to safely drain any stored charge
2. Remove the capacitor from the circuit (desolder at least one lead)
3. Connect the ESR70 probes to the capacitor leads
4. Read ESR and capacitance
5. Compare to the part's rated values

### In-Circuit ESR Test

Faster but limited — gives ESR only, no capacitance:

1. **Power off the circuit and discharge capacitors**
2. Leave the capacitor soldered in place
3. Connect probes to the capacitor's pads
4. Read ESR value

**In-circuit caveats:**
- Parallel components (other capacitors, low-impedance paths) affect the reading
- The reading shows the ESR of whatever impedance the probes see — which may not be just the one capacitor
- Use in-circuit ESR as a screening tool: if the reading is clearly high, the cap is bad. If the reading looks normal, it might still be bad (parallel paths masking it)
- For definitive testing, desolder and test out-of-circuit

### Low-Ohms Resistance Check

The ESR70 also works as a low-ohms resistance meter:

1. Touch probes to the component or connection
2. Read the resistance — useful for checking trace resistance, connector contact resistance, or very low-value resistors
3. Resolution: 0.01Ω below 2Ω

## Interpreting ESR Readings

### What's "Good" ESR?

ESR depends on capacitance value, voltage rating, and capacitor series. Rough guidelines for aluminum electrolytics:

| Capacitance | Voltage | Typical Good ESR |
|---|---|---|
| 1000 µF | 16V | < 0.05Ω |
| 470 µF | 25V | < 0.1Ω |
| 100 µF | 25V | < 0.2Ω |
| 47 µF | 50V | < 0.5Ω |
| 10 µF | 50V | < 1.0Ω |
| 1 µF | 50V | < 5Ω |

**Always check the specific part's datasheet** — these are rough screening values. Low-ESR series caps have much tighter specs than general-purpose parts.

### Warning Signs

- ESR much higher than expected → capacitor is drying out, degraded, or heat-damaged
- ESR reads open (no reading) → capacitor has failed open
- Capacitance correct but ESR high → the cap looks OK on a capacitance meter but is actually failing. This is the classic electrolytic failure mode.

## Audible Alerts

The ESR70 uses pitch to indicate ESR level — you can test capacitors without looking at the display:

- **Low pitch:** Low ESR (good)
- **High pitch:** High ESR (suspect)
- **No tone / error tone:** Open or out of range

This is useful when you're testing a row of capacitors on a board and want to quickly find the outlier.

## Tips

- **Always discharge capacitors before testing.** The ESR70 injects a small test signal (~40 mV) and is not designed to handle charged caps. A charged capacitor won't damage the meter but will give a wrong reading.
- **Test at room temperature.** ESR changes with temperature — cold caps measure higher ESR. The spec'd operating range is 15–35°C.
- **Auto power-off** kicks in after ~1 minute of inactivity. Just press the button to wake it up.
- **Probe contact matters.** Bad contact on the crocodile clips adds resistance that shows up in the ESR reading. Clean the capacitor leads if they're oxidized.
