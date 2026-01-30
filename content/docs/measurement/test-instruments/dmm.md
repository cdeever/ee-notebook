---
title: "Triplett MM520 — DMM"
weight: 10
---

# Triplett MM520 — DMM

![Triplett MM520](images/triplett-mm520.jpg)

True RMS digital multimeter. 6000-count display, CAT III-600V rated, with LPF and LoZ modes.

## At a Glance

| Parameter | Value |
|---|---|
| Display | 6000 count |
| Basic DC accuracy | ±0.7% |
| True RMS | Yes (AC modes) |
| Safety rating | CAT III-600V |
| Input impedance | 10 MΩ (standard), LoZ available |
| Power | 3× AAA batteries |

---

## Mode Selection

Rotate the dial to select the primary function. The button panel modifies behavior within each mode.

| Dial Position | Function | Notes |
|---|---|---|
| V⎓ | DC Voltage | Auto-range, 600 mV to 600V |
| V~ | AC Voltage | True RMS, auto-range |
| mV⎓/~ | Millivolt DC/AC | Toggle DC/AC with SELECT |
| µA⎓/~ | Microamp DC/AC | 600 µA range |
| mA⎓/~ | Milliamp DC/AC | 600 mA range |
| A⎓/~ | Amps DC/AC | 10A range, separate jack |
| Ω | Resistance | Auto-range, up to 60 MΩ |
| ⏛ | Continuity | Beeps below ~10Ω |
| ⏛/▶ | Diode test | Shows forward voltage drop |
| F | Capacitance | Up to 100 mF |
| Hz/% | Frequency / Duty Cycle | Up to 10 MHz |
| °C/°F | Temperature | K-type thermocouple input |

## Probe Connections

| Jack | Use |
|---|---|
| **COM** | Black lead — always |
| **V/Ω/Hz/°C** | Red lead for voltage, resistance, frequency, capacitance, temperature, diode, continuity |
| **mA/µA** | Red lead for mA and µA current |
| **10A** | Red lead for high-current measurements only |

**Caution:** Plugging the red lead into the current jack and then probing across a voltage source creates a near-short through the meter's current shunt. This blows the fuse or worse.

## Key Button Functions

| Button | What It Does |
|---|---|
| **SELECT** | Toggles between sub-modes (DC/AC, °C/°F) |
| **RANGE** | Cycles through manual ranges; hold for auto-range |
| **REL** | Relative mode — zeroes the display, shows delta from reference |
| **HOLD** | Freezes the current reading on the display |
| **MIN/MAX** | Records and displays minimum and maximum readings |
| **LPF** | Low Pass Filter — filters out high-frequency noise (useful on VFD-driven circuits) |
| **LoZ** | Low impedance mode — uses low input impedance to reject ghost voltages |
| **NCV** | Non-Contact Voltage detection — hold meter near a conductor to detect live AC |
| **LIGHT** | Toggles backlight |

## Common Procedures

### Quick DC Voltage Check

1. Red lead in V/Ω jack, black in COM
2. Dial to V⎓
3. Probe red to test point, black to ground
4. Read the display — auto-range selects the right scale

### Checking for Ghost Voltages

If you read an unexpected voltage on a supposedly dead circuit:

1. Press **LoZ** to switch to low-impedance input mode
2. Re-measure — if the reading drops to zero or near-zero, the original reading was a ghost voltage from capacitive coupling
3. If the reading persists in LoZ mode, the voltage is real

### Continuity Check

1. Dial to ⏛
2. Touch probes to the two points
3. Beep = connection (< ~10Ω), no beep = open
4. Watch the resistance reading for marginal joints — a beep at 5Ω is different from a beep at 0.2Ω

### Using LPF (Low Pass Filter)

When measuring AC voltage on circuits driven by variable frequency drives (VFDs) or PWM:

1. Dial to V~ (AC Volts)
2. Press **LPF** to enable the low-pass filter
3. This filters out high-frequency switching noise and shows the fundamental frequency component
4. Without LPF, the True RMS reading includes the switching frequency content and reads higher than the actual power-frequency voltage

### Relative Mode for Small Differences

1. Short the probes together (or place on a reference point)
2. Press **REL** — display zeros
3. Now measure — the display shows the difference from the reference
4. Useful for: measuring small resistances (zeroing out lead resistance), comparing components, tracking drift

---

## Specifications

### DC Voltage

| Range | Resolution | Accuracy |
|---|---|---|
| 600.0 mV | 0.1 mV | ±(0.7% + 5 digits) |
| 6.000 V | 0.001 V | ±(0.7% + 5 digits) |
| 60.00 V | 0.01 V | ±(0.7% + 5 digits) |
| 600.0 V | 0.1 V | ±(0.7% + 5 digits) |

### AC Voltage (True RMS)

| Range | Resolution | Accuracy |
|---|---|---|
| 600.0 mV | 0.1 mV | ±(1.0% + 5 digits) |
| 6.000 V | 0.001 V | ±(1.0% + 5 digits) |
| 60.00 V | 0.01 V | ±(1.0% + 5 digits) |
| 600.0 V | 0.1 V | ±(1.0% + 5 digits) |

AC bandwidth: typically 40 Hz – 1 kHz for rated accuracy. True RMS responds to non-sinusoidal waveforms but accuracy degrades above the rated bandwidth.

### DC Current

| Range | Resolution |
|---|---|
| 600.0 µA | 0.1 µA |
| 6.000 mA | 0.001 mA |
| 60.00 mA | 0.01 mA |
| 600.0 mA | 0.1 mA |
| 10.00 A | 0.01 A |

The 10A range uses a separate input jack with its own fuse.

### AC Current (True RMS)

Same ranges as DC current. True RMS measurement.

### Resistance

| Range | Resolution |
|---|---|
| 600.0 Ω | 0.1 Ω |
| 6.000 kΩ | 0.001 kΩ |
| 60.00 kΩ | 0.01 kΩ |
| 600.0 kΩ | 0.1 kΩ |
| 6.000 MΩ | 0.001 MΩ |
| 60.00 MΩ | 0.01 MΩ |

### Capacitance

| Range | Resolution |
|---|---|
| 60.00 nF | 0.01 nF |
| 600.0 nF | 0.1 nF |
| 6.000 µF | 0.001 µF |
| 60.00 µF | 0.01 µF |
| 600.0 µF | 0.1 µF |
| 6.000 mF | 0.001 mF |
| 100.0 mF | 0.1 mF |

### Frequency

| Range | Resolution |
|---|---|
| Up to 10 MHz | Varies by range |

### Temperature

| Range | Resolution | Sensor |
|---|---|---|
| −40°C to 1000°C | 1°C | K-type thermocouple |
| −40°F to 1832°F | 1°F | K-type thermocouple |

### Other Functions

| Function | Key Spec |
|---|---|
| Continuity | Beeps < 10Ω |
| Diode test | Test current ~1 mA, reads forward voltage |
| Duty cycle | 0.1% to 99.9% |
| NCV | Non-contact AC voltage detection |
| Clamp adapter input | 10 mV/A (60A max) |

### Physical

| Parameter | Value |
|---|---|
| Dimensions | 175 × 81 × 48.5 mm (6.9 × 3.2 × 1.9 in) |
| Weight | 350 g (12.3 oz) |
| Power | 3× AAA |

---

## Limits to Know

These are the situations where this meter won't give you a trustworthy answer:

- **Bandwidth:** AC voltage accuracy is spec'd for low frequencies (roughly 40 Hz – 1 kHz). Measuring switching converter ripple at 500 kHz? The DMM will underread or miss it entirely. Use the scope.
- **Input impedance:** 10 MΩ standard. High-impedance circuits (> 1 MΩ source impedance) will be loaded. LoZ mode is intentionally low-impedance — don't use it on high-Z circuits.
- **DC accuracy floor:** ±0.7% + 5 counts. On the 6V range, that's ±42 mV + 5 mV = ±47 mV worst case. For a 3.3V rail, that's ±1.4%. Fine for "is it there?" but marginal for precise regulation measurements.
- **Current measurement burden voltage:** The shunt resistor drops voltage. On low-voltage circuits, this can affect the circuit behavior.
- **CAT III-600V:** Rated for distribution-level measurements up to 600V. Not rated for CAT IV (utility entrance) or any voltage above 600V.
- **6000 count limit:** The maximum display reading is 5999. On the 6V range, you can't read above 5.999V — it overranges and switches to the 60V range, losing a digit of resolution.

## Reference Links

- [Triplett MM520 product page](https://www.triplett.com/products/mm520-true-rms-digital-multimeter-with-lpf-loz)
- [MM520 manual (PDF)](https://www.files.triplett.com/manual/mm520.pdf)
- [MM520 datasheet (PDF)](https://www.files.triplett.com/datasheet/mm520.pdf)
