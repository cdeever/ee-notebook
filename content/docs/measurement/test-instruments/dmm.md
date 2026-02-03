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

**Warning:** Plugging the red lead into the current jack and then probing across a voltage source creates a near-short through the meter's current shunt, blowing the fuse or worse.

## Key Button Functions

| Button | Function |
|---|---|
| **SELECT** | Toggles between sub-modes (DC/AC, °C/°F) |
| **RANGE** | Cycles through manual ranges; hold for auto-range |
| **REL** | Relative mode — zeroes display, shows delta from reference |
| **HOLD** | Freezes current reading on display |
| **MIN/MAX** | Records and displays minimum and maximum readings |
| **LPF** | Low Pass Filter — filters out high-frequency noise |
| **LoZ** | Low impedance mode — rejects ghost voltages |
| **NCV** | Non-Contact Voltage detection |
| **LIGHT** | Toggles backlight |

## Common Procedures

### Quick DC Voltage Check

Red lead in V/Ω jack, black in COM. Dial to V⎓. Probe red to test point, black to ground. Read display — auto-range selects the right scale.

### Checking for Ghost Voltages

If unexpected voltage appears on a supposedly dead circuit, press **LoZ** to switch to low-impedance input mode. Re-measure. If reading drops to zero or near-zero, the original reading was a ghost voltage from capacitive coupling. If reading persists in LoZ mode, the voltage is real.

### Continuity Check

Dial to ⏛. Touch probes to the two points. Beep indicates connection (< ~10Ω), no beep indicates open. Watch resistance reading for marginal joints — a beep at 5Ω differs from a beep at 0.2Ω.

### Using LPF (Low Pass Filter)

When measuring AC voltage on circuits driven by VFDs or PWM, dial to V~ and press **LPF** to enable low-pass filter. This filters high-frequency switching noise and shows the fundamental frequency component. Without LPF, True RMS reading includes switching frequency content and reads higher than actual power-frequency voltage.

### Relative Mode for Small Differences

Short the probes together (or place on a reference point) and press **REL** — display zeros. Now measure — display shows difference from reference. Useful for measuring small resistances (zeroing lead resistance), comparing components, and tracking drift.

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

AC bandwidth: typically 40 Hz – 1 kHz for rated accuracy.

### DC Current

| Range | Resolution |
|---|---|
| 600.0 µA | 0.1 µA |
| 6.000 mA | 0.001 mA |
| 60.00 mA | 0.01 mA |
| 600.0 mA | 0.1 mA |
| 10.00 A | 0.01 A |

The 10A range uses a separate input jack with its own fuse.

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

### Temperature

| Range | Resolution | Sensor |
|---|---|---|
| −40°C to 1000°C | 1°C | K-type thermocouple |

## Limits to Know

- **Bandwidth:** AC voltage accuracy is spec'd for low frequencies (40 Hz – 1 kHz). Measuring switching converter ripple at 500 kHz gives underreading or nothing. Use scope instead.
- **Input impedance:** 10 MΩ standard. High-impedance circuits (> 1 MΩ source) will be loaded. LoZ mode is intentionally low-impedance — don't use on high-Z circuits.
- **DC accuracy floor:** ±0.7% + 5 counts. On 6V range, that's ±47 mV worst case. For 3.3V rail, that's ±1.4%. Fine for presence check, marginal for precise regulation measurement.
- **Current measurement burden voltage:** The shunt resistor drops voltage, which can affect low-voltage circuit behavior.
- **CAT III-600V:** Rated for distribution-level measurements up to 600V. Not rated for CAT IV or above 600V.
- **6000 count limit:** Maximum display reading is 5999. On 6V range, readings above 5.999V overrange to 60V range, losing a digit of resolution.

## Reference Links

- [Triplett MM520 product page](https://www.triplett.com/products/mm520-true-rms-digital-multimeter-with-lpf-loz)
- [MM520 manual (PDF)](https://www.files.triplett.com/manual/mm520.pdf)
- [MM520 datasheet (PDF)](https://www.files.triplett.com/datasheet/mm520.pdf)
