---
title: "Is It Within Tolerance?"
weight: 30
---

# Is It Within Tolerance?

Comparing what you measured to what the part should be. A resistor that's drifted 15% from its marked value, a capacitor that's lost half its capacitance, an inductor whose core is partially saturated — these are the parts that "sort of work" and cause subtle, maddening failures.

## Understanding Tolerance Specs

**Concept:** What "within tolerance" means for different component types

### Resistors

| Tolerance marking | Band color (4-band) | Allowed range for 10 kOhm |
|-------------------|--------------------|-----------------------------|
| ±1% | Brown | 9.9 kOhm – 10.1 kOhm |
| ±5% | Gold | 9.5 kOhm – 10.5 kOhm |
| ±10% | Silver | 9.0 kOhm – 11.0 kOhm |
| ±20% | No band | 8.0 kOhm – 12.0 kOhm |

Most modern resistors are ±1% or ±5%. If a ±1% resistor measures outside ±5%, something is wrong.

### Capacitors

| Type | Typical tolerance (new) | Normal aging/drift |
|------|------------------------|--------------------|
| C0G/NP0 ceramic | ±5% or better | Negligible — extremely stable |
| X7R ceramic | ±10% | Slight, but voltage and temperature derating are bigger issues |
| Y5V ceramic | -20/+80% | Large — capacitance changes significantly with temp and voltage |
| Aluminum electrolytic | -20/+80% (common) | Dries out over time — ESR rises, capacitance drops |
| Film (polyester, polypropylene) | ±5–10% | Very stable over life |
| Tantalum | ±10–20% | Generally stable, but can fail short |

### Inductors

| Type | Typical tolerance |
|------|------------------|
| Molded/shielded power inductor | ±20% is common |
| Precision wire-wound | ±5% or better |
| Ferrite bead | Impedance spec at frequency, not inductance ± % |

## DMM / LCR Meter: Tolerance Verification

**Tool:** DMM (for R, C) or LCR meter (for L, C, and more detail)
**When:** Confirming a suspect component or verifying a batch of parts

### Procedure

1. Identify the component's rated value and tolerance from markings, datasheet, or schematic BOM
2. Measure the actual value out-of-circuit
3. Calculate the deviation: **(measured - rated) / rated × 100%**
4. Compare to the tolerance spec

### Example

A resistor marked 4.7 kOhm ±5% measures 4.52 kOhm:

- Deviation: (4520 - 4700) / 4700 × 100% = -3.8%
- This is within the ±5% tolerance — the part is fine

The same resistor measuring 4.10 kOhm:

- Deviation: (4100 - 4700) / 4700 × 100% = -12.8%
- This is well outside ±5% — the resistor has drifted or been damaged

### What You Learn

- Whether the component is within its original specification
- How far it has drifted — a 1% resistor at 3% drift isn't "failed" by the 5% standard but is degraded beyond its original grade

### Gotchas

- Your DMM has its own accuracy specification. A DMM accurate to ±0.5% can't meaningfully verify a ±1% tolerance — the measurement uncertainty overlaps the tolerance band. For precision tolerance checks, you need a meter at least 3–4x more accurate than the tolerance you're verifying
- Temperature affects the reading. Resistors have a temperature coefficient (tempco), and ceramic capacitors (X7R, Y5V) change value with temperature. Measure at room temperature for meaningful comparison to rated values

## When "Within Tolerance" Isn't Good Enough

**Concept:** Application-sensitive tolerances

Some circuits depend on precise component values or matched ratios, not just "within spec."

### Voltage Dividers and Reference Circuits

A voltage divider's output depends on the ratio of two resistors. If both are ±5% but one has drifted high and the other low, the ratio error can be up to 10%. For circuits like:

- ADC reference dividers
- Feedback networks in regulators
- Bias networks for amplifiers

The actual ratio matters more than the individual values. Measure both resistors and calculate the actual ratio, then compare to the schematic intent.

### Filter Circuits

RC, LC, and active filter corner frequencies depend on component values. A ±20% capacitor shifts the corner frequency by ±20%. If a filter is cutting too early or too late, measure the actual R and C values and calculate the actual corner frequency:

**f = 1 / (2 * pi * R * C)**

### Oscillator Circuits

Crystal oscillators are stable, but RC oscillators depend on component values. A ±10% drift in either R or C shifts the frequency by up to ±10%.

### Gotchas

- Matched pairs (differential amplifier input resistors, instrumentation amp gain resistors) need to match *each other*, not just be within tolerance. Two ±1% resistors could differ by up to 2% from each other
- Temperature tracking: in precision circuits, matched components should have the same tempco so they drift together. Measuring at room temperature only tells you the room-temperature match, not the match across temperature
- Aging: components drift over time. A resistor that's within spec today may not be in 10 years, especially in high-temperature environments. Film resistors age less than carbon composition

## Comparative Testing

**Tool:** DMM or LCR meter + a known-good reference
**When:** You don't have the datasheet or don't trust the marking

### Procedure

1. Find a known-good component of the same type and marked value (from a fresh reel, or from a working identical board)
2. Measure both components under the same conditions
3. Compare the readings — they should be within the tolerance band of each other
4. If the suspect part differs significantly from the known-good part, it has drifted

### What You Learn

- Relative deviation from a known reference — useful when you're unsure of the DMM's absolute accuracy or the component's true rated value

### Gotchas

- The "known-good" reference is only as trustworthy as its provenance. Parts from a reputable supplier in original packaging are reliable. Parts from a parts bin labeled with tape are not
- Measuring multiple components from the same batch gives you the batch distribution but doesn't tell you if the whole batch is off from the rated value (systematic error from the manufacturer, or a reel of counterfeits)
