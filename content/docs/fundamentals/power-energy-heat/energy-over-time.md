---
title: "Energy Over Time"
weight: 20
---

# Energy Over Time

Watts tell you the rate. Joules tell you the total. The distinction matters whenever you're thinking about battery life, capacitor holdup, inrush current, or how long something can survive a fault condition.

## Joules vs. Watts

- **Power (watts)** = rate of energy transfer. How fast energy flows
- **Energy (joules)** = power x time. How much energy flows in total

1 W for 1 second = 1 J. A 60 W light bulb running for 1 hour consumes 216,000 J (60 W x 3600 s) = 216 kJ.

In battery contexts, energy is often expressed in watt-hours (Wh) or milliamp-hours (mAh). These are just energy in more convenient units:

- 1 Wh = 3600 J
- mAh is charge, not energy — you need to multiply by voltage to get energy: E = mAh x V (approximately, since voltage varies with discharge)

## Capacitors as Energy Storage

A charged capacitor stores energy:

**E = 1/2 CV^2**

- A 1000 uF cap at 12 V stores 1/2 x 0.001 x 144 = 0.072 J
- That's not a lot. Capacitors are fast energy sources, not bulk storage

### Holdup Time

How long can a capacitor sustain a load after the input is removed?

Rough estimate: t = (C x V_drop) / I_load

Where V_drop is the voltage the cap can sag before the downstream regulator drops out. A 1000 uF cap feeding a 5 V LDO with 1 V of headroom at 100 mA gives about 10 ms of holdup. That's typical — capacitors buy you milliseconds, not seconds.

### Inrush Current

A discharged capacitor looks like a short circuit at t=0. Charging a big cap through a low-impedance source creates a large inrush current spike. The energy stored in the cap has to come from somewhere, and the supply has to deliver it:

- Peak inrush current = V_source / R_path (where R_path is the total series resistance including source impedance, trace resistance, and any inrush limiter)
- Inrush limiters (NTC thermistors, resistors, active circuits) deliberately add resistance to control this spike

## Inductors as Energy Storage

A current-carrying inductor stores energy:

**E = 1/2 LI^2**

- A 10 uH inductor at 1 A stores 5 uJ — tiny, but released very quickly it creates a large voltage spike
- This is why switching off inductive loads (relays, solenoids, motors) creates voltage spikes that destroy transistors. The stored energy has to go somewhere, and if you don't provide a path (flyback diode), the inductor forces the voltage up until something breaks down

## Time Constants

The time constant tells you how fast energy moves in and out of storage elements.

### RC Time Constant

tau = R x C

After one time constant, a charging capacitor reaches 63% of the final voltage. After five time constants, it's within 1% (effectively fully charged for most purposes).

- 1 kohm x 1 uF = 1 ms
- 10 kohm x 100 nF = 1 ms (same result, different parts)
- The RC time constant sets response time, filter cutoff frequencies, and timing circuit behavior

### RL Time Constant

tau = L / R

Same exponential behavior, but for current in an inductor. After one time constant, current reaches 63% of its final value.

- 10 mH / 100 ohm = 0.1 ms
- Inductive time constants are usually short in electronics (small L, moderate R) but can be significant with large inductors or very low resistance paths

## Gotchas

- **Energy scales with V^2 for caps and I^2 for inductors** — Doubling the voltage on a cap quadruples the stored energy. This matters for safety (charged caps can deliver dangerous energy) and for sizing storage
- **mAh is charge, not energy** — A 2000 mAh battery at 3.7 V has 7.4 Wh. A 2000 mAh battery at 1.2 V has 2.4 Wh. Same mAh rating, very different energy
- **Time constants assume linear circuits** — The exponential response assumes constant R and C (or L and R). Nonlinear elements (voltage-dependent capacitance, current-dependent inductance) change the dynamics
- **Supercapacitors bridge the gap** — With farads of capacitance, supercaps can provide seconds to minutes of holdup. But they have limited voltage ranges and high ESR compared to batteries
