---
title: "Is Current Draw Expected?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is Current Draw Expected?

Total supply current, per-rail current, and spotting overcurrent or undercurrent conditions. Current tells what the circuit is actually doing — voltage tells what the supply is providing.

## DMM Series Current Measurement

Power off, break the supply connection, set DMM to DC Amps (start with highest range if unknown), connect DMM in series: power source → DMM → circuit. Power on and read current.

Compare to datasheet estimates or previous known-good measurements. Higher than expected suggests a fault drawing excess current (short, latch-up, runaway oscillation). Lower than expected suggests something isn't powering up or a connection is broken.

## Current Sense Resistor + Oscilloscope

When current waveform over time is needed — startup inrush, pulsed loads, sleep/wake transitions — insert a low-value resistor (0.1–1 Ω) in series and measure voltage across it with the scope.

**I = V / R_sense**

This shows peak vs average current and correlates current with other signals.

## Current Clamp Probe

Non-intrusive current measurement without breaking the circuit. Clamp around one conductor only (supply and return together cancel). Zero the probe before measuring.

DC/AC clamps (Hall sensor) can see DC but have limited bandwidth (< 100 kHz) and DC drift. AC-only clamps (transformer) have better bandwidth but can't see DC.

## Tips

- Always start on the highest current range to avoid blowing the DMM fuse
- Verify DMM leads are in the correct jacks — many meters have separate current jacks
- Choose sense resistor value that's measurable but doesn't significantly affect the circuit (1 Ω at 100 mA drops 100 mV)
- Position wire in center of current clamp jaw for best accuracy

## Caveats

- DMM current shunt adds resistance (often 0.1–1 Ω on low ranges) — this drops voltage and can affect circuit behavior
- **Never connect a DMM in current mode across a voltage source** — this is a dead short through the meter's low-impedance shunt and will blow the fuse or damage the meter
- Current clamp probes need a single conductor — supply and return in the same cable cancel out
- Hall sensor clamps have DC drift — zero frequently
- Most clamps are designed for hundreds of mA to amps — sensitivity at microamps is poor
- Sense resistor inductance matters at high frequencies — use non-inductive types for fast transients
- Ground-referenced scope probes measuring ground-side sense resistor may need differential probe or two-channel subtraction

## In Practice

- Current significantly higher than expected indicates possible short, latch-up, or component drawing excess current
- Current significantly lower than expected indicates something isn't powering up or a connection is broken
- Current that pulses when it should be steady indicates oscillation or unstable behavior
- Startup current spike (inrush) that exceeds supply or fuse rating can cause brownout or fuse blowing — check bulk capacitor inrush
- Current waveform that correlates with specific events (transmit, motor motion) helps identify which function draws what
- Sleep current that's higher than datasheet spec indicates something isn't entering low-power mode properly
- **Actuators draw current very differently from digital circuits** — motors, servos, and steppers produce inductive spikes, high stall currents, and back-EMF; power supply sizing and decoupling for motor circuits deserves separate attention from the logic power rail.
- **An IC that draws more quiescent current than its datasheet specifies** often shows up after the device has experienced an overvoltage or latch-up event — the excess current is flowing through a damaged junction or a parasitic path that was activated by the stress, indicating physical damage propagated downward from an electrical overstress condition.
- **A circuit that draws the expected total power but has an unexpected thermal distribution** is showing, through the energy lens, that current is flowing through a different path than intended — the total energy is correct but its spatial distribution reveals a routing or operating-point error.
- **An IC that enters thermal shutdown unexpectedly at loads well below its rated capacity** commonly appears when the PCB thermal design doesn't provide adequate heat sinking — the internal thermal protection is responding to actual die temperature, which may be much higher than the package temperature suggests due to thermal resistance from junction to ambient.
