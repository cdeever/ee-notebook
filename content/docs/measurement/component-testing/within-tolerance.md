---
title: "Is It Within Tolerance?"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is It Within Tolerance?

Comparing what was measured to what the part should be. A resistor drifted 15% from its marked value, a capacitor that's lost half its capacitance, an inductor whose core is partially saturated — these parts "sort of work" and cause subtle, maddening failures.

## Tolerance Specifications

### Resistors

| Tolerance marking | Band color (4-band) | Allowed range for 10 kΩ |
|-------------------|--------------------|-----------------------------|
| ±1% | Brown | 9.9 kΩ – 10.1 kΩ |
| ±5% | Gold | 9.5 kΩ – 10.5 kΩ |
| ±10% | Silver | 9.0 kΩ – 11.0 kΩ |
| ±20% | No band | 8.0 kΩ – 12.0 kΩ |

Most modern resistors are ±1% or ±5%. If a ±1% resistor measures outside ±5%, something is wrong.

### Capacitors

| Type | Typical tolerance (new) | Normal aging/drift |
|------|------------------------|--------------------|
| C0G/NP0 ceramic | ±5% or better | Negligible — extremely stable |
| X7R ceramic | ±10% | Slight, but voltage and temperature derating are bigger issues |
| Y5V ceramic | -20/+80% | Large — changes significantly with temp and voltage |
| Aluminum electrolytic | -20/+80% | Dries out over time — ESR rises, capacitance drops |
| Film (polyester, polypropylene) | ±5–10% | Very stable over life |
| Tantalum | ±10–20% | Generally stable, but can fail short |

### Inductors

| Type | Typical tolerance |
|------|------------------|
| Molded/shielded power inductor | ±20% is common |
| Precision wire-wound | ±5% or better |
| Ferrite bead | Impedance spec at frequency, not inductance ±% |

## Tolerance Verification

Identify the rated value and tolerance, measure out-of-circuit, calculate deviation:

**(measured - rated) / rated × 100%**

**Example:** A 4.7 kΩ ±5% resistor measures 4.52 kΩ:
- Deviation: (4520 - 4700) / 4700 × 100% = -3.8%
- Within ±5% tolerance — part is fine

Same resistor measuring 4.10 kΩ:
- Deviation: -12.8%
- Outside ±5% — resistor has drifted or been damaged

## When Tolerance Alone Isn't Enough

Some circuits depend on precise values or matched ratios.

**Voltage dividers and reference circuits:** If both resistors are ±5% but one drifted high and the other low, the ratio error can be up to 10%. For ADC reference dividers, regulator feedback networks, and amplifier bias networks, the actual ratio matters more than individual values.

**Filter circuits:** RC and LC corner frequencies depend on component values. A ±20% capacitor shifts the corner frequency by ±20%. Calculate actual corner frequency: **f = 1 / (2π × R × C)**

**Oscillator circuits:** RC oscillators depend on component values. ±10% drift in R or C shifts frequency by up to ±10%.

**Matched pairs:** Differential amplifier input resistors and instrumentation amp gain resistors need to match *each other*. Two ±1% resistors could differ by up to 2% from each other.

## Comparative Testing

When the datasheet isn't available or the marking isn't trusted, compare against a known-good component of the same type. Measure both under the same conditions — they should be within the tolerance band of each other.

## Tips

- Use a meter at least 3–4x more accurate than the tolerance being verified — a ±0.5% DMM can't meaningfully verify ±1% tolerance
- Measure at room temperature for meaningful comparison to rated values
- For ratio-dependent circuits, measure both components and calculate the actual ratio
- Calculate expected filter corner frequencies from measured values when debugging filter behavior

## Caveats

- DMM accuracy specification overlaps with tight tolerances — measurement uncertainty may exceed the tolerance band
- Temperature affects the reading — resistors have tempco, ceramics (X7R, Y5V) change value with temperature
- A 1% resistor at 3% drift isn't "failed" by the 5% standard but is degraded beyond its original grade
- Temperature tracking matters in precision circuits — matched components should have the same tempco so they drift together
- Aging: components drift over time, especially in high-temperature environments; film resistors age less than carbon composition
- The "known-good" reference is only as trustworthy as its provenance — parts from original packaging are reliable; parts from a tape-labeled bin are not

## In Practice

- Resistor measuring outside its tolerance band indicates drift from aging, thermal stress, or physical damage
- Capacitor measuring low but within its wide tolerance (-20/+80%) may still be failing — ESR is often a better indicator than capacitance
- Filter cutting off at wrong frequency suggests R or C has drifted — measure components and calculate actual corner
- Amplifier gain that's off by a few percent suggests feedback resistor drift — measure the ratio, not just individual values
- Regulator output voltage that's off suggests feedback divider ratio has shifted — both resistors may have drifted in opposite directions
- Matched pair that differs by more than expected from each other (even if both are "within tolerance") will cause offset or gain errors in precision circuits
- **A precision measurement that drifts after the system has been running for several minutes** commonly appears when a nearby power-dissipating component is thermally coupling into the measurement circuit — the drift follows the thermal time constant of the PCB, not any electrical time constant.
- **A system that works correctly at room temperature but produces intermittent errors at elevated temperature** is frequently showing a failure that propagates upward only when temperature pushes a marginal parameter past its threshold — the component-level drift is within spec at room temperature but exceeds the margin available at the subsystem level when thermal shifts are added.
- **A replacement component that "fixes" the problem on one board but not another** is frequently showing that the component wasn't the root cause — the variation between boards (layout, soldering, component placement) is the actual mechanism, and the replacement component happened to shift a margin enough to work on the first board.
- **A device that works at room temperature but fails in an enclosure** reveals a thermal integration problem — the enclosure restricts airflow, and some subsystem is exceeding its thermal limits.
- **A measurement that drifts during the first 20 minutes after power-up and then stabilizes** often shows up when the circuit's thermal environment is changing as it heats up — the system reaches thermal equilibrium and the drift stops. In the field, this warmup drift may be longer (cold start) or may never reach equilibrium (if the load varies continuously).
- **A subsystem that meets its specification under test conditions but fails in the device** commonly appears when the device-level conditions (supply noise, thermal coupling, loading) push the subsystem's operating point to a region where its specification is no longer met — the subsystem was healthy in isolation and unhealthy in context.
- **A circuit that requires specific component sourcing to work reliably** is exhibiting an abstraction smell — the circuit's behavior depends on component characteristics (parasitic properties, exact tolerance position, manufacturing process) that aren't part of the component's specified abstraction. The dependence on a specific supplier means the design margin is too thin for the specification tolerance.
- **An IC that works in one circuit but not another, despite identical connections,** often indicates that the IC is being treated at the wrong abstraction level — the second circuit has different operating conditions (load, temperature, input range) that violate assumptions invisible when the IC is treated as a simple component.
