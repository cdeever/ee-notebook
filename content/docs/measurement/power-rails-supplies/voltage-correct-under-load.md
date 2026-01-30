---
title: "Is Voltage Correct Under Load?"
weight: 20
---

# Is Voltage Correct Under Load?

A rail can measure perfectly at no load and sag badly when the circuit draws current. Static regulation, load-dependent droop, and dropout are all things you catch by measuring under real operating conditions.

## DMM: Static Regulation Check

**Tool:** DMM, V⎓ mode
**Setup:** Circuit powered and running its normal workload

### Procedure

1. Measure rail voltage with the circuit idle (minimal load)
2. Measure again with the circuit running its heaviest load (e.g., transmitting, motors running, LEDs on)
3. Compare the two readings — the difference is load regulation error

### What You Learn

- Small drop (< 1–2% of nominal): regulation is healthy
- Noticeable drop: regulator may be near dropout, trace resistance may be too high, or bulk capacitance is insufficient
- Rail collapses: supply can't handle the load, or there's a fault drawing excess current

### Gotchas

- "Idle" isn't always low-load — some MCUs draw significant current even when the firmware looks idle
- Measure at the load, not at the regulator output — trace and connector resistance can drop voltage between the two points
- If the rail has a sense line (remote sensing), make sure you're measuring what the regulator sees, not what the load sees

## Oscilloscope: Load Transient Response

**Tool:** Oscilloscope, DC-coupled, 10x probe
**Trigger:** Edge trigger on the transient event, or use single-shot capture

### When to Use Instead of DMM

- You need to see the dynamic response — how fast the rail recovers after a load step
- You suspect transient droop that the DMM averages out
- The load is pulsed (e.g., RF transmitter, motor PWM, LED strobe)

### Procedure

1. DC-couple the channel, set vertical scale to see the expected droop (e.g., 100 mV/div for a 3.3V rail)
2. Set timebase to capture the transient: 10–100 µs/div for switcher transients, 1–10 ms/div for bulk cap effects
3. Trigger on the load event if possible (or use single-shot and provoke the event)
4. Observe: initial droop depth, recovery time, any ringing or overshoot

### What You Learn

- Peak transient droop — how far the voltage drops before the regulator catches up
- Recovery time — how long it takes to return to regulation
- Ringing — LC resonance between output cap and supply inductance
- Whether the bulk capacitance is doing its job

### Gotchas

- Use a short ground lead or spring-tip ground to avoid ringing artifacts from the probe
- AC coupling can be useful to zoom in on the transient, but be aware of the coupling time constant — it distorts slow events
- If the load step is very fast (nanoseconds), you may be measuring probe artifacts rather than actual supply behavior. Check with a slower load step to compare
