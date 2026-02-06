---
title: "Common Failure Modes & Patterns"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Common Failure Modes & Patterns

Experienced debuggers are faster not because they measure faster, but because they recognize patterns. Most circuit failures fall into a handful of categories, and learning to recognize the symptoms early saves enormous time.

## Power Masquerading as Logic Faults

The single most common debugging trap. A power problem rarely announces itself as a power problem — it shows up as something else entirely.

**What happens:** A voltage rail drops below the minimum operating voltage for a downstream IC. The IC doesn't stop working cleanly — it works *wrong*. Outputs are at wrong levels, communication protocols produce garbage, state machines go to undefined states.

**What it looks like:** Firmware crash, I2C/SPI errors, corrupted data, random resets, "noisy" ADC readings, "intermittent" digital failures.

**The fix is always the same:** Check all power rails first. Every time. Measure at the IC supply pin, not at the regulator output — voltage drop across traces and vias matters.

See [Is voltage correct under load?]({{< relref "/docs/measurement/power-rails-supplies/voltage-correct-under-load" >}})

## Thermal Failures

The circuit works when cold and fails when hot (or vice versa). Temperature-dependent faults point to a component operating at the edge of its margin.

**Common culprits:**
- Solder joints with hairline cracks — expansion breaks contact, contraction restores it
- Electrolytic capacitors with rising ESR — worse when hot
- Transistors with gain that shifts with temperature — biasing goes wrong
- Crystal oscillators that shift frequency outside the tolerance window

**How to provoke:**
- Heat gun on individual components (not the whole board) to isolate which part is sensitive
- Freeze spray on suspected components — if the circuit starts working when a specific component is frozen, that component is the suspect
- Let the board warm up naturally and monitor for when the failure appears — note which components are hottest at that moment

**Caution:** Heat guns can damage components. Use low settings, keep moving, and don't heat anything that can't be replaced.

## Ground Problems

"Ground" is not a single point — it's a network of copper with non-zero impedance. When return currents flow through that impedance, different "ground" points sit at different voltages.

**Symptoms:**
- Voltage difference between two ground points (measure it — even millivolts matter for analog)
- Signals that look noisy on the scope but measure fine with a DMM
- Behavior that changes when the scope ground clip is moved to a different location
- Audio hum, video bars, or repeating interference patterns

**What to check:**
- Measure ground-to-ground voltage between key points
- Check for high-current paths sharing ground returns with sensitive circuits
- Look for ground loops in test setups (scope ground, bench supply ground, DUT ground)

See [Ground Loop Detection]({{< relref "/docs/measurement/noise-interference-grounding/ground-loop" >}})

## Hidden Oscillation

A circuit oscillates at high frequency, and it goes unnoticed because nobody is looking for it.

**What happens:** A voltage regulator, op-amp, or transistor circuit breaks into oscillation — often at tens of MHz. The oscillation eats voltage headroom, generates heat, causes EMI, and makes downstream circuits behave unpredictably.

**Clues that oscillation is present:**
- Output voltage is lower than expected (the oscillation is eating headroom)
- Component runs hotter than expected (oscillation power is being dissipated)
- Adding a load makes the circuit work *better* (the load dampens the oscillation)
- Random, irreproducible digital errors downstream

**How to find it:** Put a scope probe on the suspect output, zoom out to a fast timebase (100 ns/div or faster), and look. Make sure bandwidth limiting is OFF — a 20 MHz bandwidth limit will hide a 50 MHz oscillation.

See [Ripple & Noise on the Rail]({{< relref "/docs/measurement/power-rails-supplies/ripple-and-noise" >}})

## Connector and Wiring Failures

Connectors are mechanical components, and mechanical components wear out.

**Position-sensitive intermittent:** The circuit works when the cable is held at a certain angle, a connector is pressed, or the board is flexed. This is always a mechanical connection issue.

- Wiggle test: gently flex cables, press on connectors, tap the board near suspects
- Corroded pins: look for green/white deposits, especially in humid environments
- Backed-out terminals: the wire is still in the connector housing but the terminal isn't fully seated
- Worn contact springs: the connector has been mated too many times and the spring force is gone
- Board-to-board connectors: check for cracked solder joints at the mounting pads

See [Intermittent Connection]({{< relref "/docs/measurement/continuity-connections/intermittent-connection" >}})

## ESD Damage

Electrostatic discharge can damage components without leaving any visible trace. The result is often *partial* damage — the part still works, but not to spec.

**Parametric ESD damage:**
- An op-amp with increased offset voltage or noise
- A MOSFET with increased leakage (won't fully turn off)
- A logic gate with degraded thresholds (marginal at voltage extremes)
- An ADC with increased noise floor or missing codes

**Why it's the worst:** The part isn't dead — it's *degraded*. It passes basic tests but fails under real operating conditions or at temperature extremes. Parametric failures are notoriously hard to diagnose without reference measurements from a known-good board.

**When to suspect ESD:** The board was handled without ESD precautions, the failure is subtle and parametric rather than hard, and the symptoms don't match any other pattern.

## Pattern Recognition Table

Given a symptom, start with the most common cause and the quickest measurement to confirm or rule it out:

| Symptom | First Suspect | First Measurement |
|---------|---------------|-------------------|
| Board completely dead | No power, blown fuse, shorted rail | Check input voltage, measure current draw |
| Works then dies after seconds | Thermal shutdown, overcurrent, short | Feel for hot components, measure current |
| Random resets / crashes | Power rail dip under load, brownout | Scope the supply rail during the fault |
| Communication errors (I2C/SPI) | Power, missing pull-ups, signal integrity | Check power first, then check signal levels |
| Signal present but distorted | Wrong bias point, clipping, oscillation | Scope the signal path stage by stage |
| Intermittent, position-dependent | Bad connector, cracked solder joint | Wiggle test, visual inspection, continuity |
| Intermittent, temperature-dependent | Marginal component, cracked joint | Heat/freeze individual components |
| Works on bench, fails in enclosure | Thermal, grounding, EMI | Temperature monitoring, ground integrity |
| Audio hum / video bars | Ground loop, power supply ripple | Measure ground-to-ground voltage, scope supply |
| Consumes too much current | Shorted component, latch-up, oscillation | Current draw, thermal imaging / touch test |

## In Practice

- **A board revision that fixes one problem but introduces another** often indicates that the original diagnosis was at the wrong layer — the board change coincidentally improved the original condition while disturbing a different coupling path or timing relationship that was previously adequate.
- **A system that works for hours and then fails** is frequently showing a coordination failure that accumulates — a small timing drift, a slow memory leak, a gradual thermal shift — that eventually crosses a threshold. The individual devices haven't degraded; the coordination margin has eroded.
- **An intermittent fault that occurs more frequently under high system load** often indicates a marginal condition — timing, supply, or thermal — that crosses its threshold only when the full system is active and drawing maximum current, generating maximum heat, and creating maximum electromagnetic interference simultaneously.
- **A subsystem IC that works correctly in evaluation board form but fails in the production design** is frequently showing that the collapsed subsystem's internal design assumed specific external conditions (layout, component placement, thermal environment) that the evaluation board provided but the production design does not.
