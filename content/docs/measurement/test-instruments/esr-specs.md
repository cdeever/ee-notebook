---
title: "ESR Meter Specs — Peak Atlas ESR70"
weight: 35
---

# ESR Meter Specs — Peak Atlas ESR70

Reference specs for the Peak Atlas ESR70 (ESR Gold). Check here when you need to know whether a reading is within the instrument's capabilities.

## At a Glance

| Parameter | Value |
|---|---|
| ESR range | 0.00Ω to 40.0Ω |
| Capacitance range | 0.3 µF to 90,000 µF |
| Test frequency | 50–100 kHz (±4%) |
| Test voltage | ~40 mV typical (into 40Ω) |
| In-circuit capable | ESR only (not capacitance) |
| Display | Alphanumeric LCD with backlight |
| Power | 1× AAA (alkaline, NiMH, or LiFe) |

## ESR Measurement

| Parameter | Value |
|---|---|
| Range | 0.00Ω to 40.0Ω |
| Resolution (ESR < 2Ω) | 0.01Ω to 0.02Ω |
| Resolution (ESR > 2Ω) | 0.1Ω to 0.2Ω |
| Accuracy | ±2% typical |
| Test frequency | 50–100 kHz (±4%) |
| Test voltage | ~40 mV typical |

## Capacitance Measurement

| Parameter | Value |
|---|---|
| Range | 0.3 µF to 90,000 µF |
| Conditions | Out-of-circuit only |

Capacitance measurement is available only when the capacitor is disconnected from the circuit. In-circuit, only ESR is reported.

## Operating Conditions

| Parameter | Value |
|---|---|
| Operating temperature | 15°C to 35°C (60°F to 95°F) |
| Auto power-off | ~1 minute |
| Low battery protection | Will not operate if battery is low |

## Probes

| Parameter | Value |
|---|---|
| Type | Gold-plated crocodile clips |
| Connector | 2mm plugs (removable) |
| Cable length | 450 mm silicone-covered |
| Compatible | Any 2mm probes |

## Limits to Know

These are the situations where this meter won't give you a trustworthy answer:

- **ESR ceiling (40Ω):** Capacitors with ESR above 40Ω read as out of range. Very small or very degraded caps may exceed this. But honestly, if ESR is above 40Ω, the cap is dead anyway.
- **Capacitance floor (0.3 µF):** Can't measure ESR on caps below 0.3 µF. Small ceramic caps, film caps, and most non-electrolytic types are out of range.
- **In-circuit accuracy:** In-circuit ESR readings are approximate. Parallel capacitors, traces, and low-impedance paths affect the measurement. A suspiciously low in-circuit reading may mean the meter is seeing a parallel path, not the capacitor's true ESR.
- **Test frequency (50–100 kHz):** ESR is frequency-dependent. The ESR70 tests at ~100 kHz, which is relevant for switching power supply decoupling. ESR at other frequencies (e.g., audio) may differ.
- **Temperature sensitivity:** ESR increases at lower temperatures. If you're testing caps in a cold environment (below 15°C), the reading may be higher than the datasheet spec measured at 25°C. This is the cap's behavior, not a meter error — but be aware of it.
- **Charged capacitors:** The meter expects the capacitor to be discharged. A charged cap will give an incorrect reading and may confuse the auto-detection. Always discharge first.
- **Resolution limits:** Below 2Ω, resolution is 0.01–0.02Ω. For very low-ESR caps (polymer, MLCC), differences of 0.01Ω are at the resolution limit and shouldn't be over-interpreted.

## Reference Links

- [Peak ESR70 product page](https://www.peakelec.co.uk/acatalog/esr70-capacitor-esr-meter.html)
- [ESR70 resources and downloads](https://www.peakelec.co.uk/resources/esr70.html)
- [ESR70 datasheet (PDF)](https://www.peakelec.co.uk/downloads/esr70-datasheet-en.pdf)
