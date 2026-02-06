---
title: "Bulk Capacitance & Battery Behavior"
weight: 60
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Bulk Capacitance & Battery Behavior

Energy storage health. Bulk cap ESR, battery voltage under load, and holdup time. When the supply hiccups or the battery sags, these measurements tell whether energy storage is doing its job.

## Battery Voltage Under Load

Measure battery voltage open-circuit (disconnected) for resting voltage, then again with the actual circuit connected (loaded). The difference is voltage drop due to battery internal resistance and connection resistance.

- **Open-circuit voltage** indicates state of charge (compare to chemistry's voltage curve)
- **Voltage under load** indicates whether the battery can deliver the current needed
- **Large sag under load** suggests aged battery (high internal resistance), inadequate capacity for the load, or poor connections

## Bulk Capacitor ESR

Dedicated ESR meter or LCR meter at 100 kHz measures the resistive component of capacitor impedance. Discharge the capacitor first. Disconnect at least one lead for accurate reading.

- **Low ESR matching datasheet:** Capacitor is healthy
- **Elevated ESR:** Capacitor is drying out — common failure mode for aluminum electrolytics near heat sources
- **Very high ESR or open:** Capacitor has failed

**ESR reference values (approximate):**
- 1000 µF / 16V: expect < 0.05 Ω
- 100 µF / 25V: expect < 0.2 Ω
- 10 µF / 50V: expect < 1 Ω

Always check specific part's datasheet for actual ESR spec.

## Holdup Time Measurement

Oscilloscope in single-shot mode to measure how long bulk capacitance holds up the rail when input power is interrupted:

1. Monitor rail voltage on one channel
2. Monitor input power (before regulator) on a second channel
3. Trigger on input power dropping (falling edge)
4. Interrupt input power and measure how long the rail stays within regulation

This reveals whether bulk capacitance is sufficient for the load and how the regulator behaves as input drops toward dropout.

## Tips

- Measure battery under load, not after disconnecting — voltage recovers after load removal
- Allow resting voltage to stabilize after charging or discharging before measuring open-circuit
- Discharge capacitors before ESR testing — meters aren't designed for charged caps
- For holdup measurement, set trigger and timebase before interrupting power — it's a one-shot event

## Caveats

- In-circuit ESR measurements are unreliable — parallel components affect the reading
- A capacitor can measure correct capacitance but have terrible ESR — capacitance alone doesn't indicate health
- ESR meters use high-frequency test signal — tests what matters for decoupling and ripple, but not necessarily for bulk energy storage
- Cold temperatures increase battery internal resistance — a battery that works at room temperature may sag too much when cold
- The regulator's dropout behavior affects holdup time as much as capacitance — they're a system
- Microcontrollers may brown-out and reset before the rail actually drops below the regulator's output during holdup testing

## In Practice

- Battery that shows good open-circuit voltage but sags badly under load has high internal resistance — aged or undersized for the application
- Capacitor with elevated ESR on a switcher output causes increased ripple even if capacitance is correct — check ESR first when debugging ripple
- Capacitor that measures correct ESR and capacitance but circuit still has problems suggests the issue is elsewhere
- Holdup time shorter than expected indicates either insufficient capacitance or regulator dropping out early — check both
- Rail that droops during holdup then suddenly collapses indicates the regulator hit dropout — the capacitance was holding, but the regulator gave up
- Board that resets during brief power interruptions needs more holdup capacitance or a reset supervisor with longer timeout
