---
title: "Is Voltage Correct Under Load?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is Voltage Correct Under Load?

A rail can measure perfectly at no load and sag badly when the circuit draws current. Static regulation, load-dependent droop, and dropout are caught by measuring under real operating conditions.

## Static Regulation Check

Measure rail voltage with circuit idle (minimal load), then again with circuit running its heaviest load (transmitting, motors running, LEDs on). The difference is load regulation error.

- **Small drop (< 1–2% of nominal):** Regulation is healthy
- **Noticeable drop:** Regulator may be near dropout, trace resistance may be high, or bulk capacitance insufficient
- **Rail collapses:** Supply can't handle the load, or a fault is drawing excess current

## Load Transient Response

Use an oscilloscope to see dynamic response — how fast the rail recovers after a load step. This reveals transient droop that a DMM averages out, and is essential for pulsed loads (RF transmitter, motor PWM, LED strobe).

DC-couple the channel, set vertical scale to see expected droop (e.g., 100 mV/div), set timebase to capture the transient (10–100 µs/div for switcher transients, 1–10 ms/div for bulk cap effects). Trigger on the load event or use single-shot.

Observe initial droop depth, recovery time, and any ringing or overshoot.

## Tips

- Measure at the load, not at the regulator output — trace and connector resistance drops voltage between the two points
- Use a short ground lead or spring-tip ground to avoid ringing artifacts from the probe
- For pulsed loads, trigger the scope on the load event to capture the transient reliably

## Caveats

- "Idle" isn't always low-load — some MCUs draw significant current even when firmware looks idle
- If the rail has a sense line (remote sensing), measure what the regulator sees vs what the load sees separately
- AC coupling can zoom in on transients but distorts slow events due to coupling time constant
- If the load step is very fast (nanoseconds), probe artifacts may dominate — compare with a slower load step

## In Practice

- Rail that measures correct at idle but sags under load indicates regulation or capacity problem — check regulator headroom
- Large transient droop with slow recovery suggests insufficient output capacitance or high ESR
- Ringing after load step indicates LC resonance — check output capacitor ESL and PCB inductance
- Rail that collapses completely under load suggests supply is undersized for the load or a fault is drawing excess current
- Voltage measured at regulator output that's correct while voltage at load is low indicates trace or connector resistance drop
- **A regulated supply reading that drifts with load or temperature** is an abstraction breaking in real time — the supply is no longer the stable rail the rest of the circuit assumes it to be.
- **A device that resets intermittently under heavy load** often shows up when a power supply component has degraded enough to allow momentary voltage droops that violate the processor's minimum supply voltage — the cause is a component-level degradation, but the symptom presents as a device-level functional failure.
- **A power supply that rings or overshoots on load transients** reveals a feedback loop with insufficient phase margin — a subsystem-level composition problem that won't be visible from any individual block measurement.
- **A subsystem that oscillates only when its output is connected to the real load on the device** frequently reveals a stability margin issue — the real load's impedance (capacitive, inductive, or complex) differs from the bench test load, and the subsystem's control loop becomes unstable with the actual load impedance.
- **A power supply that's stable on the bench but oscillates in the system** often indicates that the actual output load impedance in the system (the combination of all downstream circuits, their decoupling, and the interconnect impedance) differs from the bench test load enough to shift the loop's crossover frequency and reduce the phase margin below zero.
- **A regulator IC whose output voltage drifts with temperature beyond its specification** often shows up when the IC's internal reference is degrading — a failure mode that would be directly measurable in a discrete design but can only be inferred from the output behavior in a collapsed subsystem.
- **Oscillation that appears only in the system enclosure and disappears when the board is removed** often shows up when the enclosure temperature elevates the board to a temperature where a feedback loop's phase margin goes to zero — the oscillation is temperature-dependent and occurs only under the thermal conditions the enclosure creates.
