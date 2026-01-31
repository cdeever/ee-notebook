---
title: "Voltage Dividers & Loading"
weight: 20
---

# Voltage Dividers & Loading

The voltage divider is the most commonly used circuit pattern in electronics — and the one most commonly misunderstood when a load is attached. Understanding loading effects is the gateway to understanding input impedance, output impedance, and why circuits don't always behave the way the simplified model predicts.

## The Basic Voltage Divider

Two resistors in series from a voltage source to ground. The output is taken from the middle node:

**V_out = V_in x R2 / (R1 + R2)**

Where R1 is the top resistor (connected to V_in) and R2 is the bottom resistor (connected to ground). V_out is the voltage at the junction.

This is just KVL and Ohm's law applied to a series circuit. Nothing exotic — but it's everywhere:

- Feedback networks in regulators
- Biasing circuits for transistors
- ADC input scaling
- Level shifting
- Sensor signal conditioning

## The Loading Problem

The voltage divider equation assumes no current flows out of the output node (or equivalently, the load impedance is infinite). The moment you connect a load, the output voltage changes.

A load resistance R_load in parallel with R2 replaces R2 with the parallel combination:

**V_out_loaded = V_in x (R2 || R_load) / (R1 + R2 || R_load)**

Where R2 || R_load = (R2 x R_load) / (R2 + R_load)

The loaded output is always lower than the unloaded output (assuming a resistive load to ground). The lower the load resistance, the more the output drops.

### The Rule of Thumb

The load should be at least 10x the divider's output impedance (R1 || R2, or approximately R2 if R2 << R1 isn't true, the Thevenin output resistance is R1 || R2) for the loading error to be under about 10%.

For less than 1% error, the load should be at least 100x the source impedance.

## Output Impedance

The voltage divider has an output impedance equal to R1 in parallel with R2:

**Z_out = R1 || R2 = (R1 x R2) / (R1 + R2)**

This is the Thevenin equivalent output resistance. It determines:

- How much the output voltage drops when loaded
- The time constant when driving a capacitive load (tau = Z_out x C_load)
- Noise at the output node

Lower impedance dividers (smaller R values) are stiffer — less sensitive to loading — but draw more quiescent current from the source.

## Input Impedance

From the source's perspective, the divider's input impedance is:

**Z_in = R1 + (R2 || R_load)**

The source has to supply current to the divider and the load. If R1 and R2 are large (to save power), the divider itself draws little current — but it's then easily disturbed by loads.

## Impedance as a Design Tradeoff

This is the fundamental tension:

- **Low-impedance divider** — Stiff output, tolerant of loads, but high quiescent current. Fine when power is plentiful
- **High-impedance divider** — Low quiescent current (good for battery-powered designs), but sensitive to loading, noise pickup, and capacitive effects

There's no universal right answer. The choice depends on the source's drive capability, the load's impedance, power budget, and noise requirements.

## Capacitive Loading and Frequency Response

A voltage divider driving a capacitive load (like an ADC input or a cable) forms an RC low-pass filter:

- Time constant: tau = Z_out x C_load
- Bandwidth: f_3dB = 1 / (2 x pi x Z_out x C_load)

A 10 kohm divider driving a 100 pF load (typical ADC input) has a time constant of 1 us and a bandwidth of about 160 kHz. For slowly-changing signals, this is fine. For fast signals, you need a lower impedance divider or a buffer.

## Reactive Voltage Dividers

Voltage dividers aren't limited to resistors. Capacitive and inductive dividers follow the same principle but with impedances:

- **Capacitive divider:** V_out = V_in x C1 / (C1 + C2) — note the capacitances are "inverted" compared to resistors because Z_C = 1/(jwC). The smaller cap gets more voltage
- **AC coupling:** A series capacitor and a load resistance form a high-pass voltage divider. Below the cutoff frequency, the capacitor's impedance dominates and attenuates the signal

## Gotchas

- **The unloaded voltage divider equation is almost never the whole story** — Any real circuit connected to the output is a load. Even a 10 Mohm oscilloscope probe loads a high-impedance divider
- **Divider impedance and noise** — Higher impedance = more thermal noise (V_noise = sqrt(4kTRB)). In precision or low-noise circuits, this sets a practical lower limit on bandwidth or an upper limit on impedance
- **Voltage dividers waste power** — The current through R1 and R2 is wasted as heat. In battery-powered designs, use the highest impedance the load allows, or replace the divider with a switched/regulated solution
- **Don't use voltage dividers as power supplies** — A voltage divider can set a voltage, but it can't regulate it. Any load variation changes the output. For stable supply voltages, use a regulator
- **Potentiometers are variable voltage dividers** — A pot is R1 and R2 in one package with an adjustable tap. All the loading analysis applies — the pot's output impedance varies with the wiper position (maximum at the midpoint)
