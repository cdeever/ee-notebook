---
title: "Peak Atlas ESR70 — ESR Meter"
weight: 30
---

# Peak Atlas ESR70 — ESR Meter

![Peak Atlas ESR70](images/peak-esr70.png)

Capacitor ESR and capacitance meter. Measures ESR in-circuit, capacitance out-of-circuit. Audible alerts for quick screening.

## At a Glance

| Parameter | Value |
|---|---|
| ESR range | 0.00Ω to 40.0Ω |
| Capacitance range | 0.3 µF to 90,000 µF |
| Test frequency | 50–100 kHz (±4%) |
| Test voltage | ~40 mV typical (into 40Ω) |
| In-circuit capable | ESR only (not capacitance) |
| Display | Alphanumeric LCD with backlight |
| Power | 1× AAA |

## Basic Operation

1. Power on (single button)
2. Touch probes to the capacitor
3. Read display — ESR in ohms, capacitance in µF
4. Meter auto-starts measurement when component is detected

## Display Reading

| Reading | Meaning |
|---|---|
| ESR value (Ω) | Equivalent series resistance at test frequency (~50–100 kHz) |
| Capacitance (µF) | Measured capacitance (out-of-circuit only) |
| Audible tone | Pitch varies with ESR — low = low ESR (good), high = high ESR (suspect) |

## Probe Connections

- Gold-plated crocodile clips with 2mm plugs
- Probes are removable — any 2mm-compatible probes work
- 450mm silicone-covered cables
- For tight spaces, remove crocodile clips and use bare probe tips

## Procedures

### Out-of-Circuit Capacitor Test

Full test giving both ESR and capacitance:

1. **Discharge the capacitor first** — short leads with resistor (100Ω) to drain stored charge
2. Remove capacitor from circuit (desolder at least one lead)
3. Connect probes to capacitor leads
4. Read ESR and capacitance
5. Compare to rated values

### In-Circuit ESR Test

Faster but limited — ESR only, no capacitance:

1. **Power off circuit and discharge capacitors**
2. Leave capacitor soldered in place
3. Connect probes to capacitor pads
4. Read ESR value

**In-circuit notes:** Parallel components affect reading. Use as screening tool — clearly high reading indicates bad cap; normal reading might mask issues from parallel paths. For definitive testing, desolder and test out-of-circuit.

### Low-Ohms Resistance Check

Touch probes to component or connection and read resistance. Useful for trace resistance, connector contact resistance, or very low-value resistors. Resolution: 0.01Ω below 2Ω.

## Interpreting ESR Readings

### Reference Values for Aluminum Electrolytics

| Capacitance | Voltage | Typical Good ESR |
|---|---|---|
| 1000 µF | 16V | < 0.05Ω |
| 470 µF | 25V | < 0.1Ω |
| 100 µF | 25V | < 0.2Ω |
| 47 µF | 50V | < 0.5Ω |
| 10 µF | 50V | < 1.0Ω |
| 1 µF | 50V | < 5Ω |

**Always check specific part's datasheet** — these are rough screening values.

### Warning Signs

- ESR much higher than expected → capacitor drying out, degraded, or heat-damaged
- ESR reads open (no reading) → capacitor failed open
- Capacitance correct but ESR high → classic electrolytic failure mode; cap looks OK on capacitance meter but is actually failing

## Audible Alerts

Pitch indicates ESR level — test capacitors without looking at display:

- **Low pitch:** Low ESR (good)
- **High pitch:** High ESR (suspect)
- **No tone / error:** Open or out of range

Useful when testing a row of capacitors to quickly find the outlier.

## Tips

- Always discharge capacitors before testing — meter injects ~40 mV test signal and expects discharged caps
- Test at room temperature — ESR changes with temperature; cold caps measure higher
- Auto power-off after ~1 minute; press button to wake
- Probe contact matters — clean oxidized capacitor leads; bad contact adds resistance

## Caveats

- **ESR ceiling (40Ω):** Caps with ESR above 40Ω read out of range. If ESR exceeds 40Ω, the cap is dead anyway.
- **Capacitance floor (0.3 µF):** Cannot measure ESR on caps below 0.3 µF. Small ceramics and film caps are out of range.
- **In-circuit accuracy:** Parallel capacitors, traces, and low-impedance paths affect measurement. Suspiciously low in-circuit reading may mean meter sees parallel path.
- **Test frequency (50–100 kHz):** ESR is frequency-dependent. Testing at ~100 kHz is relevant for switching supply decoupling; ESR at other frequencies may differ.
- **Temperature sensitivity:** ESR increases at lower temperatures. Readings below 15°C may be higher than datasheet spec at 25°C — this is cap behavior, not meter error.
- **Charged capacitors:** Meter expects discharged caps. Charged cap gives incorrect reading.
- **Resolution limits:** Below 2Ω, resolution is 0.01–0.02Ω. For very low-ESR caps (polymer, MLCC), differences of 0.01Ω are at resolution limit.

## Specifications

### ESR Measurement

| Parameter | Value |
|---|---|
| Range | 0.00Ω to 40.0Ω |
| Resolution (ESR < 2Ω) | 0.01Ω to 0.02Ω |
| Resolution (ESR > 2Ω) | 0.1Ω to 0.2Ω |
| Accuracy | ±2% typical |
| Test frequency | 50–100 kHz (±4%) |
| Test voltage | ~40 mV typical |

### Capacitance Measurement

| Parameter | Value |
|---|---|
| Range | 0.3 µF to 90,000 µF |
| Conditions | Out-of-circuit only |

### Operating Conditions

| Parameter | Value |
|---|---|
| Operating temperature | 15°C to 35°C |
| Auto power-off | ~1 minute |

## Reference Links

- [Peak ESR70 product page](https://www.peakelec.co.uk/acatalog/esr70-capacitor-esr-meter.html)
- [ESR70 resources and downloads](https://www.peakelec.co.uk/resources/esr70.html)
- [ESR70 datasheet (PDF)](https://www.peakelec.co.uk/downloads/esr70-datasheet-en.pdf)
