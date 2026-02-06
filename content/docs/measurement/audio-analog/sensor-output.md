---
title: "Is This Sensor Outputting the Expected Voltage/Current?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is This Sensor Outputting the Expected Voltage/Current?

Analog sensor interfaces — thermocouples, strain gauges, photodiodes, microphones, potentiometers, Hall sensors. Before blaming signal conditioning or the ADC, verify that the transducer itself produces expected output for the physical stimulus. Many "signal conditioning" bugs are actually "sensor isn't connected right" bugs.

## Voltage-Output Sensors

| Sensor type | Output type | Expected output | How to verify |
|------------|------------|----------------|---------------|
| Potentiometer | Ratiometric DC | 0V to Vref, proportional to position | Rotate and check for smooth voltage change |
| Thermistor (in divider) | DC voltage | Depends on divider and temperature | Measure at known temperature, compare to calculated |
| LM35 / TMP36 | DC voltage | 10 mV/°C (LM35), 10 mV/°C + 500 mV offset (TMP36) | At 25°C: LM35 = 250 mV, TMP36 = 750 mV |
| Phototransistor | DC voltage | Varies with light intensity | Cover = near 0V; shine light = increased voltage |
| Hall effect (linear) | DC voltage | Vcc/2 ± proportional to field | No magnet = Vcc/2; magnet = offset from center |
| Pressure sensor (bridge) | DC differential (mV-range) | Ratiometric to excitation | Zero pressure = near 0 mV differential |

## Current-Output Sensors (4–20 mA)

Wire the DMM in series with the sensor loop (break loop, insert DMM on mA range). Apply known stimulus and read current:

- 4 mA = zero/minimum (sensor powered, reporting low end)
- 20 mA = full scale
- < 4 mA = sensor fault, wiring open, or power issue
- > 20 mA = sensor fault or wiring error

## Dynamic Sensor Output

For sensors with varying output (vibration sensors, microphones, audio pickups, AC current sensors), DC-couple the scope to see the full output (bias + signal). Apply physical stimulus — tap for accelerometer, speak for microphone, move magnet for Hall sensor. Observe whether the output responds and correlates with physical input.

Piezoelectric sensors (accelerometers, some microphones) are AC-only — they produce voltage pulses in response to change, not steady DC. Electret microphones need bias voltage through a resistor to function.

## Thermocouple Measurement

With a thermocouple-capable DMM, connect to the TC input (observing polarity), set to temperature mode and thermocouple type (K, J, T, etc.), and read temperature directly — the DMM handles cold junction compensation.

With a standard DMM in mV mode, read millivolt output and look up in thermocouple reference table, then add cold junction compensation (the reading is the difference between hot and cold junctions).

**Type K reference (0°C cold junction):**
| Temperature | Voltage |
|------------|---------|
| 0°C | 0.000 mV |
| 25°C | 1.000 mV |
| 100°C | 4.096 mV |

## Strain Gauge / Wheatstone Bridge

Verify excitation voltage across the bridge (typically 5V or 10V). Measure differential output between the two output nodes. At zero load/strain, output should be near 0 mV. Apply known load and verify output changes per gauge factor.

Bridge outputs are small — 1–3 mV/V at full scale. A 10V excitation at full load gives only 10–30 mV.

## Tips

- Check excitation first — a resistive bridge needs stable excitation voltage/current
- For ratiometric sensors, measure supply and calculate ratio — if supply drifts, output drifts proportionally
- Discharge the sensor signal path before measuring small voltages — residual charge can offset readings

## Caveats

- Many sensors have small outputs (millivolts for thermocouples, microvolts for strain gauges) — DMM must be on appropriate range with noise floor below expected signal
- "Ratiometric" sensors need supply measured too — absolute voltage is off if supply drifts
- Thermocouple cold junction compensation is essential — without it, reading is relative to meter temperature
- Open thermocouple wire reads random voltage (often railing on dedicated TC meters)
- Piezo sensors don't produce DC — don't expect steady voltage
- Lead resistance matters for bridge sensors — use 4-wire connection for long cable runs
- Temperature affects strain gauges — allow thermal equilibration before measuring

## In Practice

- Sensor output that doesn't change with stimulus indicates disconnected, dead, or wrong sensor type
- Output that changes smoothly with stimulus confirms sensor is working — check magnitude against datasheet
- Output stuck at supply rail indicates open circuit in the sensor or wiring
- Noisy output on sensor that should be stable indicates interference coupling or bad connection
- Thermocouple reading wildly wrong indicates open circuit or wrong thermocouple type selected
- Bridge output not near zero at no-load indicates damaged gauge, wiring error, or large temperature difference
