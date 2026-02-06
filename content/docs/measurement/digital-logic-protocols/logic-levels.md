---
title: "Are Logic Levels Correct for This Voltage Domain?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Are Logic Levels Correct for This Voltage Domain?

Logic families have specific voltage thresholds that define what counts as "high" and "low." A 3.3V output driving a 5V input may or may not be recognized as high — it depends on the specific thresholds, not just whether the signal "looks high" on the scope. Marginal logic levels are the source of intermittent, temperature-dependent, works-on-my-bench failures.

## Logic Level Thresholds

| Parameter | Meaning | Who specifies it |
|-----------|---------|-----------------|
| VOH | Minimum output high voltage | Driver datasheet |
| VOL | Maximum output low voltage | Driver datasheet |
| VIH | Minimum input voltage recognized as high | Receiver datasheet |
| VIL | Maximum input voltage recognized as low | Receiver datasheet |

For reliable communication: **VOH > VIH** and **VOL < VIL**. The gap between them is noise margin.

## Common Logic Families

| Family | VCC | VOH (min) | VOL (max) | VIH (min) | VIL (max) |
|--------|-----|-----------|-----------|-----------|-----------|
| 5V CMOS (HC/HCT) | 5V | 4.4V | 0.1V | 3.5V (HC) / 2.0V (HCT) | 1.0V (HC) / 0.8V (HCT) |
| 3.3V LVCMOS | 3.3V | 2.4V | 0.4V | 2.0V | 0.8V |
| 1.8V LVCMOS | 1.8V | 1.2V | 0.45V | 1.17V | 0.63V |
| 5V TTL | 5V | 2.4V | 0.4V | 2.0V | 0.8V |

## Level Shifting: 3.3V to 5V

A 3.3V LVCMOS output has VOH ≥ 2.4V. Whether a 5V input recognizes this as high depends on the receiver:

| 5V receiver type | VIH threshold | 3.3V output recognized as high? |
|-----------------|---------------|-------------------------------|
| 5V HCT (TTL thresholds) | 2.0V | Yes — 2.4V > 2.0V, safe |
| 5V HC (CMOS thresholds) | 3.5V | No — 2.4V < 3.5V, marginal |
| 5V standard TTL | 2.0V | Yes |

This is why HCT-family parts are commonly used for 3.3V-to-5V interfaces — their TTL input thresholds accept 3.3V outputs cleanly.

## Measuring Logic Levels

DC-couple the scope channel and set vertical scale to show the full logic swing. Probe the signal and trigger on an edge to get a stable display. Use cursors or auto-measurement to read the high and low levels — the flat portions when the signal is high and low.

Compare to the VOH/VOL specs (driving side) and VIH/VIL specs (receiving side). Measure at the receiver's input pin, not the driver's output — voltage drops across traces, connectors, and series resistors reduce the level that arrives at the receiver.

## DMM DC Level Spot Check

For quick checks on static logic levels (enable pins, chip selects, configuration pins), set the DMM to DC Volts, probe the pin vs. ground, and compare to VIH/VIL thresholds.

A DMM averages the reading — if the pin is toggling (even slowly), the DMM shows an average voltage between high and low, which lands in the undefined region and looks like a fault.

## Identifying Marginal Logic Levels

Symptoms of marginal levels:
- Works at room temperature, fails when hot or cold
- Works at one supply voltage, fails when the supply droops slightly
- Works on one board but not another (component tolerance)
- Works at low speed but fails at high speed

Diagnosis: Measure VOH at the driver with the actual load connected, then measure voltage at the receiver input pin. Calculate noise margin: **NM_high = V_at_receiver - VIH_threshold**. If noise margin is less than a few hundred millivolts, the interface is marginal.

## Tips

- Measure at the receiver's input pin, not the driver's output — trace and connector resistance drops voltage between the two points
- Temperature affects thresholds and output drive — a marginal signal at room temperature may fail at high temperature
- For open-drain buses (I2C), pull-up resistor value and bus capacitance determine actual levels

## Caveats

- Floating pins can read any voltage — if a pin reads ~1.5V on a 3.3V system and it's not driven, it's probably floating
- A DMM averages toggling signals — use a scope for anything that might be switching
- Capacitive loading rounds edges and reduces time the signal spends at valid levels — at high data rates, the signal may never fully reach VOH or VOL
- Open-drain buses have levels set by pull-up resistors and bus capacitance — a weak pull-up gives slow rise times and VOH that depends on RC time constant vs. data rate

## In Practice

- Measured VOH well above VIH threshold indicates healthy noise margin
- Measured VOH barely above or below VIH threshold indicates marginal interface — will fail under temperature or supply variation
- Pin reading mid-rail voltage when it should be driven indicates floating input or bus contention
- Logic level that's correct at DC but fails at speed indicates capacitive loading slowing the edges
- Interface that works on some boards but not others suggests component tolerance pushing margins — tighten tolerances or redesign interface
- **A digital output whose logic levels have degraded (higher VOL, lower VOH)** commonly appears after the output has been subjected to bus contention or excessive load — the output transistors have been partially degraded by overcurrent, and their on-resistance has increased, a primitive-level consequence of a system-level configuration error.
