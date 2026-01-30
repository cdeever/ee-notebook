---
title: "DMM Specs — Triplett MM520"
weight: 15
---

# DMM Specs — Triplett MM520

Reference specs for checking whether a measurement is within the instrument's rated capabilities. When a reading looks suspicious, check here first.

## At a Glance

| Parameter | Value |
|---|---|
| Display | 6000 count |
| Basic DC accuracy | ±0.7% |
| True RMS | Yes (AC modes) |
| Safety rating | CAT III-600V |
| Input impedance | 10 MΩ (standard), LoZ available |
| Power | 3× AAA batteries |

## DC Voltage

| Range | Resolution | Accuracy |
|---|---|---|
| 600.0 mV | 0.1 mV | ±(0.7% + 5 digits) |
| 6.000 V | 0.001 V | ±(0.7% + 5 digits) |
| 60.00 V | 0.01 V | ±(0.7% + 5 digits) |
| 600.0 V | 0.1 V | ±(0.7% + 5 digits) |

## AC Voltage (True RMS)

| Range | Resolution | Accuracy |
|---|---|---|
| 600.0 mV | 0.1 mV | ±(1.0% + 5 digits) |
| 6.000 V | 0.001 V | ±(1.0% + 5 digits) |
| 60.00 V | 0.01 V | ±(1.0% + 5 digits) |
| 600.0 V | 0.1 V | ±(1.0% + 5 digits) |

AC bandwidth: typically 40 Hz – 1 kHz for rated accuracy. True RMS responds to non-sinusoidal waveforms but accuracy degrades above the rated bandwidth.

## DC Current

| Range | Resolution |
|---|---|
| 600.0 µA | 0.1 µA |
| 6.000 mA | 0.001 mA |
| 60.00 mA | 0.01 mA |
| 600.0 mA | 0.1 mA |
| 10.00 A | 0.01 A |

The 10A range uses a separate input jack with its own fuse.

## AC Current (True RMS)

Same ranges as DC current. True RMS measurement.

## Resistance

| Range | Resolution |
|---|---|
| 600.0 Ω | 0.1 Ω |
| 6.000 kΩ | 0.001 kΩ |
| 60.00 kΩ | 0.01 kΩ |
| 600.0 kΩ | 0.1 kΩ |
| 6.000 MΩ | 0.001 MΩ |
| 60.00 MΩ | 0.01 MΩ |

## Capacitance

| Range | Resolution |
|---|---|
| 60.00 nF | 0.01 nF |
| 600.0 nF | 0.1 nF |
| 6.000 µF | 0.001 µF |
| 60.00 µF | 0.01 µF |
| 600.0 µF | 0.1 µF |
| 6.000 mF | 0.001 mF |
| 100.0 mF | 0.1 mF |

## Frequency

| Range | Resolution |
|---|---|
| Up to 10 MHz | Varies by range |

## Temperature

| Range | Resolution | Sensor |
|---|---|---|
| −40°C to 1000°C | 1°C | K-type thermocouple |
| −40°F to 1832°F | 1°F | K-type thermocouple |

## Other Functions

| Function | Key Spec |
|---|---|
| Continuity | Beeps < 10Ω |
| Diode test | Test current ~1 mA, reads forward voltage |
| Duty cycle | 0.1% to 99.9% |
| NCV | Non-contact AC voltage detection |
| Clamp adapter input | 10 mV/A (60A max) |

## Limits to Know

These are the situations where this meter won't give you a trustworthy answer:

- **Bandwidth:** AC voltage accuracy is spec'd for low frequencies (roughly 40 Hz – 1 kHz). Measuring switching converter ripple at 500 kHz? The DMM will underread or miss it entirely. Use the scope.
- **Input impedance:** 10 MΩ standard. High-impedance circuits (> 1 MΩ source impedance) will be loaded. LoZ mode is intentionally low-impedance — don't use it on high-Z circuits.
- **DC accuracy floor:** ±0.7% + 5 counts. On the 6V range, that's ±42 mV + 5 mV = ±47 mV worst case. For a 3.3V rail, that's ±1.4%. Fine for "is it there?" but marginal for precise regulation measurements.
- **Current measurement burden voltage:** The shunt resistor drops voltage. On low-voltage circuits, this can affect the circuit behavior.
- **CAT III-600V:** Rated for distribution-level measurements up to 600V. Not rated for CAT IV (utility entrance) or any voltage above 600V.
- **6000 count limit:** The maximum display reading is 5999. On the 6V range, you can't read above 5.999V — it overranges and switches to the 60V range, losing a digit of resolution.

## Physical

| Parameter | Value |
|---|---|
| Dimensions | 175 × 81 × 48.5 mm (6.9 × 3.2 × 1.9 in) |
| Weight | 350 g (12.3 oz) |
| Power | 3× AAA |

## Reference Links

- [Triplett MM520 product page](https://www.triplett.com/products/mm520-true-rms-digital-multimeter-with-lpf-loz)
- [MM520 manual (PDF)](https://www.files.triplett.com/manual/mm520.pdf)
- [MM520 datasheet (PDF)](https://www.files.triplett.com/datasheet/mm520.pdf)
