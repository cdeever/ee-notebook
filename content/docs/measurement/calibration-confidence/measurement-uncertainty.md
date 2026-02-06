---
title: "What's the Actual Uncertainty?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What's the Actual Uncertainty?

Understanding measurement uncertainty beyond just "accuracy." Every reading has an uncertainty band — a range within which the true value lies. Resolution, accuracy, repeatability, environmental effects, and measurement method all contribute. Knowing how many digits of a reading are real prevents false confidence and unnecessary worry.

## Resolution vs. Accuracy vs. Precision

| Term | Meaning | Analogy |
|------|---------|---------|
| Resolution | Smallest change the instrument can display | Tick marks on a ruler |
| Accuracy | How close the reading is to true value | Whether the ruler's markings are correct |
| Precision (repeatability) | How much reading varies when measuring same thing repeatedly | Whether the ruler gives same reading each time |

**Example:** A 3½-digit DMM on the 4V range:
- Resolution: 1 mV (the last digit)
- Accuracy: ±(0.5% + 3 counts) = ±23 mV on a 4V reading
- Precision: Might repeat within ±2 mV

The display shows 4.000V but true voltage could be 3.977V to 4.023V. Three decimal places look precise, but only first two are reliable.

## Calculating Measurement Uncertainty

**DMM voltage measurement:**
1. Reading accuracy from spec sheet: ±(% of reading + counts)
2. Temperature coefficient if outside 23°C ±5°C
3. Lead resistance for low-resistance measurements
4. Loading effect from DMM input impedance

**Total uncertainty = sqrt(error1² + error2² + ...)** (for independent random errors)

Or conservative: **Total = |error1| + |error2| + ...**

**Oscilloscope amplitude:**
1. Vertical accuracy: typically ±3–5%
2. Probe attenuation accuracy: ±1–3%
3. DC offset accuracy

For derived quantities (like power = V × I):
**%uncertainty_result = sqrt(%uncertainty_V² + %uncertainty_I²)**

## How Many Digits Are Real?

Only report digits within instrument uncertainty. If reading is 3.456V and uncertainty is ±0.023V, true value is between 3.433V and 3.479V. Meaningful report: 3.46V ±0.02V.

| Instrument | Typically meaningful digits |
|-----------|---------------------------|
| 3½-digit DMM (DC Volts) | 3 digits |
| 4½-digit DMM (DC Volts) | 4 digits |
| Oscilloscope cursor reading | 2–3 digits |
| Scope auto-measurement | 2–3 digits |

Digital displays create false precision. A DMM showing "3.3021V" on a 3½-digit meter doesn't mean voltage is known to 0.1 mV.

## Repeatability and Environmental Effects

**Checking repeatability:** Measure the same quantity 10 times without changing anything. Calculate standard deviation. This is the random component of uncertainty.

| Factor | Effect | How to manage |
|--------|--------|---------------|
| Temperature | Specs assume 23°C ±5°C; accuracy degrades outside | Work at room temperature, let instruments warm up |
| Humidity | Affects high-resistance measurements | Be aware for > 1 MΩ |
| Vibration | Affects contact resistance | Use stable connections |
| EMI | External interference adds to reading | Shield sensitive measurements |
| Warm-up time | Instruments drift during warm-up | Allow 30+ minutes |

## Practical Rules of Thumb

For bench work, formal uncertainty analysis is usually overkill:

1. **DMM DC voltage:** Trust to ±1% on name-brand meter
2. **DMM resistance:** Trust to ±1% above 10 Ohm; below 10 Ohm lead resistance matters
3. **Scope amplitude:** Trust to ±5%; use scope for shape, DMM for voltage
4. **Scope timing:** Trust to ±0.01% (50 ppm timebase)
5. **Component values:** A 5% resistor measuring 4.8% off is within spec
6. **Frequency:** Scope and counter agreeing within 0.1% probably agree — difference is timebase accuracy

## Tips

- Averaging increases precision (reduces random variation) but not accuracy (doesn't fix systematic errors)
- Temperature is the biggest environmental factor for most measurements
- Systematic errors (miscalibrated meter) don't reduce with averaging
- The error budget is the fundamental system-level design tool — allocating allowable error across each stage of the chain, then verifying each stage meets its allocation, is more reliable than testing only the end-to-end result

## Caveats

- A meter consistently 1% high is still 1% high after averaging a thousand readings
- Thermoelectric voltages at dissimilar metal junctions create microvolt offsets — matters for precision DC, not everyday bench work
- Standard deviation larger than instrument resolution indicates external factors (temperature drift, noise, contact resistance)

## In Practice

- Two readings differing by less than combined uncertainty are effectively the same
- Reading fluctuating in last digit is normal — that's the uncertainty
- Component measuring slightly off from marked value is expected — check against tolerance spec, not exact value
- Measurements that seem "too precise" probably are — more digits than accuracy supports
- Disagreement between instruments within their combined uncertainty specs is not meaningful — both may be correct
- **A system that works reliably in the lab but fails during field deployment in a specific geographic region** often indicates an environmental factor unique to that region — humidity, temperature, altitude (affecting cooling and dielectric strength), or power quality differences between the lab's clean power and the field installation's shared circuit.
- **A measurement that's different every time it's taken** is frequently showing a real variation that the bench environment doesn't normally expose — supply noise, ground bounce, thermal drift, or electromagnetic coupling that varies with system activity. Averaging the measurements hides the variation; capturing and characterizing it reveals the mechanism.
- **A datasheet specification that doesn't match bench measurements** commonly appears when the test conditions in the datasheet don't match the application conditions. Subsystem-level ICs specify performance under specific external component values, load conditions, and input ranges — measurements taken outside those conditions aren't datasheet violations; they're operation outside the specification's scope.
