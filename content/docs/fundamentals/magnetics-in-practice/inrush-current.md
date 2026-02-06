---
title: "Inrush Current & Startup Stress"
weight: 50
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Inrush Current & Startup Stress

Magnetic components can draw enormous currents at the moment power is applied — far beyond their steady-state rating. This inrush current blows fuses, trips breakers, stresses rectifiers, and causes voltage dips on shared power buses. It's one of the most common "mystery" failure modes in equipment that works perfectly once running but destroys something every time it's turned on.

## Why Magnetics Cause Inrush

### Transformer Core Saturation on First Half-Cycle

When AC is applied to a transformer, the core flux must start from wherever it was when power was last removed. In the worst case:

1. The core has residual magnetization from the previous power-down (remanence). In silicon steel, remanence can be 60–80% of B_sat
2. Power is reapplied at a voltage zero-crossing — this means the voltage integral (which determines flux) drives the core through a full half-cycle swing from the residual point
3. The resulting flux reaches B_remanent + B_normal — potentially 1.6× to 1.8× the normal peak flux
4. Since this exceeds B_sat, the core saturates
5. During saturation, the magnetizing inductance drops to near-zero
6. The primary looks like a short circuit — limited only by winding resistance
7. Current spikes to 10–20× the normal full-load primary current

This is not a fault. It's normal physics. It happens every time the voltage phase and core remanence align unfavorably — which is random, so sometimes the transformer powers up cleanly and sometimes it slams the circuit breaker.

### Duration

The inrush is self-correcting. Each subsequent half-cycle, the core's flux walks back toward the steady-state operating point. Winding resistance damps the transient. Typical inrush duration is 5–30 cycles (80–500 ms at 60 Hz), but large transformers with low winding resistance can ring for longer.

### Capacitor Charging Through Rectifiers

In a typical linear power supply, the transformer secondary feeds a bridge rectifier into a filter capacitor. At power-on, the capacitor is discharged. The rectifier conducts as soon as the secondary voltage exceeds the diode drop, and the transformer sees a near-short-circuit load until the capacitor charges up. This combines with the core saturation inrush to produce the highest peak current the circuit will ever experience.

## Inrush in Inductors

### Buck Converter Startup

When a buck converter starts, the output capacitor is discharged. The inductor current ramps up from zero. If the converter uses a "hiccup" or "soft-start" mode that gradually increases the duty cycle, the inductor current rises in a controlled way. If the converter applies full duty cycle immediately (or if soft-start is too fast), the inductor can see full input voltage across it with no back-EMF from the output — resulting in rapid current ramp-up that can overshoot the saturation current.

Well-designed converter ICs manage this with internal soft-start. Discrete converter designs need explicit soft-start circuitry (gradually increasing the reference voltage or duty cycle limit over several milliseconds).

### Inductor with DC Bias Applied Suddenly

Any inductor connected to a voltage source through a switch sees V/L as its initial dI/dt. A 10 µH inductor with 12 V applied sees an initial current rise of 1.2 A/µs. If the steady-state current is limited by circuit resistance (say 12 V / 4 Ω = 3 A), the current reaches steady state in a few L/R time constants. But during that ramp, the inductor's peak current may briefly exceed its saturation rating, momentarily collapsing the inductance and causing a further current spike.

## What Inrush Damages

### Fuses

Fuses have an I²t rating — the energy they can absorb before opening. If the inrush I²t exceeds the fuse's pre-arcing I²t, the fuse blows. Since inrush current can be 10–20× normal, the I²t during inrush can be 100–400× the steady-state value — but only for a few cycles.

**Slow-blow (time-delay) fuses** are the standard solution. They tolerate brief high-current events while still protecting against sustained overcurrent. Equipment designed for a 2 A steady-state draw might need a 3 A or 5 A slow-blow fuse to survive inrush.

### Rectifier Diodes

During the capacitor-charging inrush, rectifier diodes carry current far beyond their average rating. If the peak surge current exceeds the diode's I_FSM (forward surge maximum) rating, the junction is damaged. This is a common failure in equipment that's been power-cycled many times — the rectifier dies of accumulated thermal stress.

### Relay and Switch Contacts

If the power switch or relay that energizes the transformer is mechanical, the inrush current flows through the contacts at the moment of closure. Contact resistance is highest at the instant of closure (small contact area, potential arcing), and the high current can weld or erode the contacts. This is why power switches in equipment with large transformers sometimes fail closed (welded) after years of use.

### Upstream Power Quality

On a shared power bus (like a branch circuit in a building), the inrush from a large transformer can cause a momentary voltage dip that affects other equipment. In audio studios and labs, simultaneous power-on of multiple pieces of equipment can sag the mains enough to reset sensitive equipment.

## Inrush Limiting Techniques

### NTC Thermistors

A negative temperature coefficient resistor in series with the primary. At cold power-on, the NTC has high resistance (typically 5–50 Ω) and limits inrush current. As operating current heats the NTC, its resistance drops to a fraction of an ohm, and it has negligible effect on steady-state operation.

Limitations:
- After a brief power interruption, the NTC is still hot and has low resistance — it won't limit inrush on a quick restart. This is the "warm restart" problem
- The NTC has thermal mass, so it takes seconds to cool down. Rapid power cycling defeats the protection
- In standby-mode equipment (where current is very low), the NTC may cool down even while power is applied, then fail to limit inrush when the load comes on

### Active Inrush Limiters

A resistor bypassed by a relay or MOSFET. At power-on, the resistor limits inrush. After a delay (fixed timer or based on sensing that the capacitor has charged), the relay/MOSFET shorts the resistor out of the circuit.

Advantages over NTC:
- Works on warm restart (the resistor is always cold when the circuit is off)
- Controllable timing
- Higher reliability in equipment that power-cycles frequently

### Soft-Start on Switching Converters

Most switching converter ICs include a soft-start function: the duty cycle or current limit ramps up gradually over 1–50 ms after the enable signal goes high. This limits the peak inductor current during startup and prevents capacitor-charging inrush from overloading the inductor or input supply.

Check that the soft-start time is long enough for the output capacitance. A fast soft-start into a large output capacitor still produces significant inrush.

### Phase-Controlled Switching

For large transformers (industrial equipment, audio amplifiers with large toroidal transformers), phase-controlled switching applies power at the optimal point in the AC cycle — the voltage peak, where the resulting flux starts at zero and doesn't add to the remanence. This eliminates the worst-case flux doubling scenario.

Requires a solid-state switch (TRIAC or back-to-back SCRs) with zero-crossing detection and control logic. Overkill for small equipment, standard practice for large transformers.

## Tips

- Use slow-blow fuses rated for the inrush I²t, not just the steady-state current
- Allow adequate soft-start time for the output capacitance being charged
- Stagger power-on of multiple converters on the same input supply

## Caveats

- Toroidal transformers have worse inrush than E-I laminated transformers — Toroidal cores have low reluctance (no air gap in the magnetic path) and high remanence. A toroidal power transformer can draw 30–60× rated current on a worst-case power-on. E-I transformers have small gaps at the lamination boundaries that reduce remanence
- NTC thermistors are the most common inrush limiter and the most commonly misunderstood — They work great for a single cold start. They don't help on a warm restart after a brief power interruption — which is exactly the scenario that happens during power glitches and brownouts
- Inrush is non-deterministic — The same equipment on the same outlet blows the fuse one time in twenty. The other nineteen times, the voltage phase at switch-on doesn't cause worst-case flux doubling. This makes the problem hard to reproduce and easy to dismiss as "random"
- Putting a bigger fuse in to "solve" inrush just moves the failure — The fuse was protecting the wiring and downstream components. A larger fuse means the wiring or the rectifier takes the abuse instead. Use a slow-blow fuse rated correctly, or add real inrush limiting
- Inrush current creates an inrush voltage dip — If the circuit monitors input voltage to decide when it's safe to start (common in microcontroller supervisory circuits), the voltage dip from inrush on a shared bus can cause repeated reset cycling — the micro starts, draws current, sags the bus, resets, bus recovers, micro starts again
- Multiple converters on the same input should not all start simultaneously — Stagger the enable signals by a few milliseconds each. The combined inrush of all converters starting at once can exceed the input fuse or upstream regulator capacity, even if each individual converter's inrush is acceptable

## In Practice

- A fuse that blows randomly on power-up (but not every time) indicates inrush hitting the fuse's I²t limit at worst-case phase angles
- Equipment that works fine when power is applied gradually (variac) but trips breakers on direct mains connection has an inrush problem
- Voltage sag visible on a scope at power-on indicates significant inrush current
- An NTC thermistor that fails to limit inrush after a brief power cycle confirms the warm-restart limitation
