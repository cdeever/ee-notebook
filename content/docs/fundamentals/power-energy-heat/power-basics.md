---
title: "Power Basics"
weight: 10
---

# Power Basics

Power is the rate of energy transfer — watts = joules per second. It's the bridge between the electrical quantities you measure (voltage, current) and the physical consequences you deal with (heat, battery drain, component stress).

## The Core Equations

For any circuit element:

- **P = V x I** — voltage across the element times current through it. Always valid
- **P = I^2 x R** — useful when you know current and resistance (current-squared losses)
- **P = V^2 / R** — useful when you know voltage and resistance (voltage-squared losses)

The I^2 R and V^2/R forms are just P = VI with Ohm's law substituted in. They only apply to resistive elements. P = VI is the general form.

## Instantaneous vs. Average Power

**Instantaneous power** is V(t) x I(t) at any moment. It can vary wildly — a switching converter's output transistor sees huge instantaneous power during switching transitions, even though the average is modest.

**Average power** is what determines thermal behavior. A component rated at 1 W can handle 1 W average, not 1 W instantaneous maximum. Pulse loads with high peaks but low duty cycles can stay within thermal limits even though peak power is far above the rating.

Average power over a period T: P_avg = (1/T) x integral of V(t) x I(t) dt

## DC Power

Straightforward: P = V x I, constant over time. A 12 V supply delivering 500 mA provides 6 W. All 6 W are dissipated somewhere in the circuit.

## AC Power: Real, Reactive, and Apparent

In AC circuits with reactive components, voltage and current aren't in phase. This creates three power concepts:

- **Real power (P, watts)** — The power actually dissipated as heat. This is what you pay for and what heats things up
- **Reactive power (Q, VAR)** — Power that sloshes back and forth between source and reactive elements. No net energy transfer, but it still causes current to flow
- **Apparent power (S, VA)** — V_rms x I_rms. The product of what your voltmeter and ammeter read. S^2 = P^2 + Q^2

**Power factor** = P / S. A purely resistive load has PF = 1. A purely reactive load has PF = 0.

### Why This Matters

Reactive power means higher current for the same real power delivered. Higher current means more I^2 R losses in wires, traces, and connectors. You can deliver 100 W to a load with 1 A at unity power factor, or you might need 2 A at PF = 0.5. The extra current heats everything in the supply path.

## Resistive vs. Reactive Power Dissipation

Only resistance dissipates power. Ideal capacitors and inductors store and return energy without loss. In practice:

- Capacitors have ESR (equivalent series resistance) — real power dissipation that causes heating
- Inductors have winding resistance (DCR) and core losses — real power dissipation
- Wires and traces are resistive — every current path dissipates power

The reactive component determines how much current flows; the resistive component determines how much of that current becomes heat.

## Gotchas

- **RMS is the key to AC power** — P = V_rms x I_rms x cos(theta) for sinusoidal AC. Don't multiply peak values and expect to get average power
- **P = I^2 R is a trap with AC** — It works if I is RMS and R is the actual resistance (not impedance magnitude). Using impedance magnitude gives you apparent power, not real power
- **Power ratings are thermal limits** — A "1/4 W resistor" can dissipate 1/4 W before it overheats. The actual power it dissipates is determined by the circuit, not the rating. The rating is the maximum, not the actual
- **Decibels and power** — dBm is referenced to 1 mW. 0 dBm = 1 mW. +3 dB doubles the power. This comes up constantly in RF and audio
