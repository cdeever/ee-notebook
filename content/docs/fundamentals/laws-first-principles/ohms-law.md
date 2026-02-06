---
title: "Ohm's Law"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Ohm's Law

V = IR. Three variables, one equation, and the single most-used relationship in electronics. It's the first relationship to reach for when a voltage, current, or resistance is known and one of the others needs to be found.

## The Relationship

Ohm's law says the voltage across a resistive element equals the current through it times its resistance:

- **V = IR** — voltage from current and resistance
- **I = V/R** — current from voltage and resistance
- **R = V/I** — resistance from voltage and current

All three forms are the same equation rearranged. Which form to use depends on which quantity is unknown.

## When It Applies

Ohm's law applies to **resistive elements** — things that behave like ideal resistors. That includes:

- Actual resistors (within their linear range)
- Wire resistance
- The resistive component of more complex impedances

In real-world circuits, many components aren’t purely resistive. Capacitors and inductors store and release energy, which means the relationship between voltage and current depends on frequency and phase, not just magnitude.

To handle this, Ohm’s law is generalized to:

**V = IZ**

Here, Z (impedance) replaces resistance. Impedance extends the same proportional relationship between voltage and current, but includes both magnitude and phase, captured as a complex number at a specific frequency.


## When It Doesn't Apply (Or Doesn't Tell the Whole Story)

Ohm’s law isn’t wrong in these cases — it’s just incomplete or only valid over a narrow range of conditions.

- **Nonlinear devices** — Diodes, transistors, and MOSFETs don't have a fixed resistance. A dynamic resistance can be calculated at a given operating point, but the V/I relationship isn't a straight line
- **Reactive components** — Capacitors and inductors have voltage-current relationships involving time derivatives (or frequency-dependent impedance). Ohm's law in its basic form doesn't capture this. The generalized impedance form does, but only in steady-state AC
- **Frequency-dependent behavior** — A "100 ohm resistor" at DC might look like 100 ohms in parallel with a few pF at high frequencies. The parasitic capacitance starts to matter

## Tips

- **Calculating expected voltage drops** — A 10 mA current through a 100 ohm resistor should drop 1 V. If the measurement shows 1.5 V, something else is going on
- **Estimating current from a voltage measurement** — When breaking the circuit to insert an ammeter isn't practical, measuring the voltage across a known resistor and calculating I = V/R gives the current
- **Wire and trace resistance awareness** — 500 mA through a trace with 100 milliohms of resistance means a 50 mV drop. That matters in circuits delivering a precise voltage
- **Sense resistors** — Deliberately placed low-value resistors for current measurement. The whole purpose is V = IR with a known R

## Caveats

- **Don't forget the "across" and "through"** — Voltage is *across* an element (between two nodes), current is *through* it. Mixing this up leads to nonsensical calculations
- **V = IR is not a universal law of nature** — It's a property of resistive materials. Calling it a "law" can be misleading when applied to things that aren't resistive
- **Contact resistance** — Probes, connectors, and corroded joints add unaccounted resistance. A measurement may include resistance that isn't in the schematic
- **Temperature dependence** — Resistance changes with temperature. A wire-wound resistor's value at room temperature isn't the same as its value at 150 C under load

## In Practice

**An unexpected voltage drop across a wire, trace, or connector** often points to resistance that isn't in the schematic. V = IR applied to the measured drop and known current gives the parasitic resistance directly — trace resistance, contact resistance, or a degraded solder joint.

**Current through a load measuring lower than calculated** suggests additional series resistance dropping voltage before the load. The "missing" voltage appears across the unaccounted resistance, and V = IR on that drop quantifies it.
