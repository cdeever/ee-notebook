---
title: "Ohm's Law"
weight: 10
---

# Ohm's Law

V = IR. Three variables, one equation, and the single most-used relationship in electronics. It's the first thing you reach for when you see a voltage, current, or resistance and need to figure out one of the others.

## The Relationship

Ohm's law says the voltage across a resistive element equals the current through it times its resistance:

- **V = IR** — voltage from current and resistance
- **I = V/R** — current from voltage and resistance
- **R = V/I** — resistance from voltage and current

All three forms are the same equation rearranged. Which one you use depends on which quantity you're solving for.

## When It Applies

Ohm's law applies to **resistive elements** — things that behave like ideal resistors. That includes:

- Actual resistors (within their linear range)
- Wire resistance
- The resistive component of more complex impedances

It also applies in its generalized form (V = IZ) to impedances at a given frequency, where Z is a complex number. That's the bridge from DC Ohm's law into AC circuit analysis.

## When It Doesn't Apply (Or Doesn't Tell the Whole Story)

- **Nonlinear devices** — Diodes, transistors, and MOSFETs don't have a fixed resistance. You can calculate a dynamic resistance at a given operating point, but the V/I relationship isn't a straight line
- **Reactive components** — Capacitors and inductors have voltage-current relationships involving time derivatives (or frequency-dependent impedance). Ohm's law in its basic form doesn't capture this. The generalized impedance form does, but only in steady-state AC
- **Frequency-dependent behavior** — A "100 ohm resistor" at DC might look like 100 ohms in parallel with a few pF at high frequencies. The parasitic capacitance starts to matter

## Practical Bench Relevance

Ohm's law is the go-to sanity check:

- **Calculating expected voltage drops** — A 10 mA current through a 100 ohm resistor should drop 1 V. If I measure 1.5 V, something else is going on
- **Estimating current from a voltage measurement** — Can't break the circuit to insert an ammeter? Measure the voltage across a known resistor and calculate I = V/R
- **Checking wire and trace resistance** — 500 mA through a trace with 100 milliohms of resistance means a 50 mV drop. That matters if you're trying to deliver a precise voltage
- **Sense resistors** — Deliberately placed low-value resistors for current measurement. The whole purpose is V = IR with a known R

## Gotchas

- **Don't forget the "across" and "through"** — Voltage is *across* an element (between two nodes), current is *through* it. Mixing this up leads to nonsensical calculations
- **V = IR is not a universal law of nature** — It's a property of resistive materials. Calling it a "law" can be misleading if you start applying it to things that aren't resistive
- **Contact resistance** — Probes, connectors, and corroded joints add resistance you didn't account for. Your measurement might include resistance that isn't in the schematic
- **Temperature dependence** — Resistance changes with temperature. A wire-wound resistor's value at room temperature isn't the same as its value at 150 C under load
