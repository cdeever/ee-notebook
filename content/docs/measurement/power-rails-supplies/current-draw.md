---
title: "Is Current Draw Expected?"
weight: 40
---

# Is Current Draw Expected?

Total supply current, per-rail current, and spotting overcurrent or undercurrent conditions. Current tells you what the circuit is actually doing — voltage tells you what the supply is providing.

## DMM: Series Current Measurement

**Tool:** DMM, A⎓ (DC Amps) mode
**Setup:** DMM in series with the supply (break the circuit and insert the meter)

### Procedure

1. Power off the circuit
2. Break the supply connection (disconnect one lead of the power source)
3. Set DMM to DC Amps, appropriate range (start with the highest range if unknown)
4. Connect DMM in series: power source → DMM → circuit
5. Power on and read current

### What You Learn

- Total supply current — compare to datasheet estimates or previous known-good measurements
- Whether a fault is drawing excess current (possible short, latch-up, or runaway oscillation)
- Whether the circuit is drawing less than expected (something not powering up, or a broken connection)

### Gotchas

- The DMM current shunt adds resistance (often 0.1–1Ω on low ranges). This drops voltage and can affect circuit behavior, especially on low-voltage or high-current rails
- **Fuse risk:** Most DMMs have a current fuse (typically 500 mA or 10A). Exceeding it blows the fuse. Always start on the highest current range
- **Never connect a DMM in current mode across a voltage source.** This is a dead short through the meter's low-impedance shunt. It blows the fuse or damages the meter
- The meter leads must be in the correct jacks — many DMMs have separate jacks for current measurement

## Current Sense Resistor + Oscilloscope

**Tool:** Oscilloscope + known sense resistor in series
**Use case:** When you need to see current waveform over time, not just a DC average

### Procedure

1. Insert a low-value resistor (e.g., 0.1Ω to 1Ω) in series with the supply
2. Measure voltage across the sense resistor with the scope (differential measurement is ideal)
3. Calculate current: I = V / R_sense

### What You Learn

- Current waveform: startup inrush, pulsed loads, sleep/wake transitions
- Peak current vs. average current — important for battery life and supply sizing
- Correlation with other signals (trigger scope on an event, see what current does)

### Gotchas

- The sense resistor drops voltage: a 1Ω resistor at 100 mA drops 100 mV. Choose a value that's measurable but doesn't significantly affect the circuit
- If measuring ground-side current, be careful of ground-referenced scope probes — you may need a differential probe or two-channel subtraction
- Sense resistor inductance matters at high frequencies. Use a non-inductive type for fast transient measurements

## Current Clamp Probe

**Tool:** AC/DC current clamp probe on the oscilloscope
**Use case:** Non-intrusive current measurement — no need to break the circuit

### Procedure

1. Clamp the probe around one conductor only (not a power cable with supply and return together — the fields cancel)
2. Zero the probe (most have a zero button for DC offset)
3. Set scope scale based on probe sensitivity (e.g., 100 mV/A → 10 mA resolution at 1 mV/div)

### What You Learn

- Current without breaking the circuit — useful for monitoring in systems you can't easily disassemble
- Dynamic current waveform with good time resolution (depending on probe bandwidth)

### Gotchas

- DC current clamps use Hall sensors and have limited bandwidth (typically < 100 kHz) and noticeable DC drift
- AC-only clamps (transformer type) can't see DC — they only show AC current components
- Sensitivity at low currents is poor — most clamps are designed for hundreds of mA to amps, not microamps
- Position the wire in the center of the clamp jaw for best accuracy
