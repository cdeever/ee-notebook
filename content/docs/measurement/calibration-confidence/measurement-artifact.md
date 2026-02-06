---
title: "Could This Be a Measurement Artifact?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Could This Be a Measurement Artifact?

Questioning the reading before trusting it. The most dangerous measurements are ones that look reasonable but are wrong. Probe artifacts, aliasing, ground bounce, and coupling from hands can all create readings that look like real circuit behavior — and send debugging down the wrong path.

## Common Artifacts

**Ground lead ringing:** Overshoot and damped oscillation on fast edges, typically ~100 MHz. Caused by inductance of ground clip resonating with probe capacitance. Test by switching from alligator clip to spring-tip ground — if ringing disappears, it was the ground lead.

**Probe loading:** Circuit works differently when probe is connected — oscillation starts/stops, frequency shifts, amplitude changes. Caused by probe capacitance (~15 pF passive) and resistance (10 MΩ) loading the circuit. Compare behavior with and without probe; use active probe (~1 pF) if available.

**Aliasing:** Signal appears at wrong frequency, or repetitive signal has unexpected modulation. Caused by sample rate too low — signals above Nyquist fold back. Test by changing sample rate — if apparent frequency changes with sample rate, it's aliased.

**Ghost voltages (DMM):** DMM reads 30–80V AC on circuit that's off and should be 0V. Caused by capacitive coupling to high-impedance DMM input. Test with LoZ mode — ghost voltages collapse to zero, real voltages remain.

**Hand capacitance:** Signal changes when hand moves near probe, board, or component. Body acts as antenna and capacitor coupling to high-impedance nodes. Stabilize probe mechanically, step back, and observe.

**Scope input clipping:** Waveform appears flat-topped but circuit is clean. Signal exceeds scope input range — ADC clips. Increase vertical scale or use 10x probe attenuation.

**Trigger coupling artifact:** Waveform looks jittery, has frequency modulation, or is unstable. Trigger is set wrong — triggering on noise or wrong edge. Change trigger source, adjust level, or use different trigger mode.

## The Artifact Checklist

When a measurement looks unexpected:

1. Is the probe compensated?
2. Is the ground lead short?
3. Is the probe loading the circuit?
4. Is the sample rate adequate?
5. Is the scope input clipping?
6. Is noise coupling into the measurement?
7. Is the trigger stable?
8. Is the DMM on the right mode and range?

## The Ultimate Test

**Real signals are properties of the circuit. Artifacts are properties of the measurement.**

If a signal changes when:
- Changing the probe → probe-dependent (artifact or loading)
- Changing the ground lead → ground-related (ringing artifact)
- Changing the sample rate → aliasing
- Moving hand → body coupling
- Changing scope settings → scope issue

If the signal stays the same regardless of measurement setup changes, it's real.

## Tips

- When something looks wrong, change the measurement setup before changing the circuit
- A quick probe compensation check catches many artifacts
- If ringing goes away when shortening ground lead, it wasn't in the circuit

## Caveats

- Some real signals are affected by measurement setup (probe loading changing oscillator frequency) — the distinction isn't always clean
- Confirming an artifact explains a weird reading is satisfying but doesn't answer the original question — still need to make the measurement correctly
- Multiple artifacts can exist simultaneously

## In Practice

- Ringing that disappears with spring-tip ground was probe artifact, not circuit behavior
- Oscillation that stops when probe is connected indicates probe capacitance is stabilizing marginal circuit
- Signal that changes frequency when sample rate changes is aliased — increase sample rate
- Unexpected AC voltage on "dead" circuit with standard DMM is likely ghost voltage — verify with LoZ
- Signal that varies when moving hand near circuit indicates high-impedance node picking up coupling
- **Intermittent faults that appear to move around the circuit when probed from different points** often have a fixed root cause at a different level than where the symptoms appear. The wandering symptoms are the effect of changing the observation point; the root cause doesn't move.
- **A device whose behavior changes when its enclosure is opened or removed** often indicates that the enclosure is part of the device boundary in a way the design didn't intend — the enclosure provides shielding, thermal management, or a ground reference that affects the device's operation.
- **An intermittent failure that disappears when the enclosure is opened** commonly appears when the failure is temperature-related — opening the enclosure changes the airflow and reduces the operating temperature, shifting the circuit away from its failure point. The failure is real and will return when the enclosure is closed.
- **A system-level problem that disappears when the enclosure is opened for debugging** commonly appears because the thermal conditions change when the enclosure is open — the failing component cools below its failure temperature, or a thermal gradient that was causing the problem equalizes with ambient. The failure is real; the enclosure is part of the system.
