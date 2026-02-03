---
title: "Power Basics"
weight: 10
---

# Power Basics

Power is the rate of energy transfer — watts = joules per second. It bridges the electrical quantities measured at the bench (voltage, current) and the physical consequences dealt with in practice (heat, battery drain, component stress).

## The Core Equations

For any circuit element:

- **P = V × I** — voltage across the element times current through it. Always valid
- **P = I² × R** — useful when current and resistance are known (current-squared losses)
- **P = V² / R** — useful when voltage and resistance are known (voltage-squared losses)

The I²R and V²/R forms are just P = VI with Ohm's law substituted in. They only apply to resistive elements. P = VI is the general form.

## Instantaneous vs. Average Power

**Instantaneous power** is V(t) × I(t) at any moment. It can vary wildly — a switching converter's output transistor sees huge instantaneous power during switching transitions, even though the average is modest.

**Average power** determines thermal behavior. A component rated at 1 W can handle 1 W average, not 1 W instantaneous maximum. Pulse loads with high peaks but low duty cycles can stay within thermal limits even though peak power is far above the rating.

Average power over a period T: P_avg = (1/T) × integral of V(t) × I(t) dt

## DC Power

Straightforward: P = V × I, constant over time. A 12 V supply delivering 500 mA provides 6 W. All 6 W are dissipated somewhere in the circuit.

## AC Power: Real, Reactive, and Apparent

In AC circuits with reactive components, voltage and current aren't in phase. This creates three power concepts:

- **Real power (P, watts)** — The power actually dissipated as heat. This is what the utility bills for and what heats things up
- **Reactive power (Q, VAR)** — Power that sloshes back and forth between source and reactive elements. No net energy transfer, but it still causes current to flow
- **Apparent power (S, VA)** — V_rms × I_rms. The product of what the voltmeter and ammeter read. S² = P² + Q²

**Power factor** = P / S. A purely resistive load has PF = 1. A purely reactive load has PF = 0.

### Why This Matters

Reactive power means higher current for the same real power delivered. Higher current means more I²R losses in wires, traces, and connectors. Delivering 100 W to a load might require 1 A at unity power factor, or 2 A at PF = 0.5. The extra current heats everything in the supply path.

## Resistive vs. Reactive Power Dissipation

Only resistance dissipates power. Ideal capacitors and inductors store and return energy without loss. In practice:

- Capacitors have ESR (equivalent series resistance) — real power dissipation that causes heating
- Inductors have winding resistance (DCR) and core losses — real power dissipation
- Wires and traces are resistive — every current path dissipates power

The reactive component determines how much current flows; the resistive component determines how much of that current becomes heat.

## Tips

- Use P = VI for initial power estimates — it's always valid regardless of component type
- For thermal analysis, average power matters more than peak power
- When measuring AC power, ensure RMS values are used, not peak values

## Caveats

- RMS is the key to AC power — P = V_rms × I_rms × cos(θ) for sinusoidal AC. Multiplying peak values does not give average power
- P = I²R is a trap with AC — It works if I is RMS and R is the actual resistance (not impedance magnitude). Using impedance magnitude gives apparent power, not real power
- Power ratings are thermal limits — A "1/4 W resistor" can dissipate 1/4 W before overheating. The actual power dissipated is determined by the circuit, not the rating. The rating is the maximum, not the actual
- Decibels and power — dBm is referenced to 1 mW. 0 dBm = 1 mW. +3 dB doubles the power

## Bench Relevance

- A component running hot indicates high power dissipation — trace back to find where the watts are going
- Unexpectedly high current draw on a supply often means an unintended power dissipation path (short, saturated regulator, oscillation)
- Power supply current limiting kicking in suggests the load is demanding more power than designed for
- Heat concentrated in one component while others stay cool points to a design issue in that specific part of the circuit
