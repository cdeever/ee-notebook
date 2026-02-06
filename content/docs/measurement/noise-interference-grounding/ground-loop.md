---
title: "Is There a Ground Loop?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is There a Ground Loop?

Hum, buzz, and ground-referenced interference. A ground loop forms when two or more devices share a ground connection through multiple paths, creating a loop that acts as an antenna for magnetic fields. The classic symptom is 50/60 Hz hum that won't go away — until the loop is broken.

## What a Ground Loop Is

A ground loop exists when:
1. Device A and Device B are both connected to earth ground (through power cords)
2. They're also connected through a signal cable (audio, USB, BNC, etc.)
3. The signal cable's shield creates a second path between ground points
4. Current flows around this loop — driven by voltage difference between ground points

The loop area acts as a single-turn transformer winding. Any magnetic field passing through (from mains wiring, transformers, motors) induces voltage that appears as noise.

## Identifying Ground Loop Hum

AC-couple the scope and set bandwidth limit to 1 kHz or lowest available. Set vertical scale to see the hum (often 1–50 mV range). Set timebase to 5 ms/div.

| Waveform observed | Likely source |
|-------------------|--------------|
| Smooth sine at 50/60 Hz | Magnetic coupling — ground loop or transformer leakage |
| Distorted waveform at 100/120 Hz, 150/180 Hz | Non-sinusoidal ground current (rectifiers, SCR dimmers) |
| Buzz with rich harmonic content | Ground loop combined with digital switching or rectifier harmonics |

**Diagnostic test:**
1. Measure signal with everything connected normally
2. Disconnect the signal cable between devices — if hum disappears, the cable carries ground loop current
3. Power both devices from the same outlet — if hum drops, ground potential difference between outlets was the driver

## Measuring Ground Potential Difference

Set DMM to AC Volts and measure between ground terminals of the two devices (or between ground pins of two outlets). This is the voltage driving current through the loop.

| Ground voltage difference | Significance |
|--------------------------|-------------|
| < 1 mV | Negligible — unlikely to cause audible hum |
| 1–10 mV | Possible hum source in sensitive audio |
| 10–100 mV | Significant — will cause audible hum |
| > 100 mV | Large — different ground references or wiring issues |

## Fixing Ground Loops

| Solution | How it works | Best for |
|----------|-------------|----------|
| Power everything from one outlet | Minimizes ground potential difference | Bench setups, audio systems |
| Balanced connections (XLR, differential) | Ground noise is common-mode and rejected | Audio, instrumentation |
| Ground loop isolator (transformer) | Breaks galvanic ground connection | Audio, video |
| DI box | Transformer-isolated balanced output | Audio (guitar, keyboards) |
| Isolation transformer | Breaks earth ground via transformer | Test setups |
| Star grounding | All ground connections to single point | System-level design |
| Optical isolation | Eliminates ground connection entirely | Data links between systems |

## Tips

- Never lift the safety earth ground to fix a ground loop — this creates a shock hazard
- Star grounding only works if the star topology is maintained — a single additional connection creates a loop
- Balanced connections reject common-mode noise only as well as the receiver's CMRR

## Caveats

- Some hum is not from ground loops — magnetic coupling from transformer leakage or proximity to mains wiring; moving the circuit away helps, breaking ground connections doesn't
- Cheap ground loop isolators use small transformers that distort at low frequencies and roll off bass
- This measurement is AC — ground loops are driven by AC currents; DC ground potential difference is a separate issue

## In Practice

- Hum that disappears when signal cable is disconnected confirms ground loop through that cable
- Hum that disappears when devices share same outlet confirms ground potential difference between outlets
- Hum that persists regardless of cable and power configuration indicates magnetic coupling, not ground loop
- Hum reduced but not eliminated by balanced connection indicates CMRR limit or imbalance in the connection
- Multiple ground connections creating parallel paths indicate potential for ground loops — simplify grounding topology
- **An analog circuit that develops a DC offset only when integrated** commonly appears when the ground potential at the subsystem's input differs from the ground potential at the subsystem's output — the ground shift, caused by return current from other subsystems flowing through the shared ground, appears as a differential-mode signal that the circuit amplifies.
- **An analog measurement with an unexpected DC offset in the system that doesn't exist on the bench** commonly appears when ground potential difference between the sensor and the ADC is being measured as part of the signal — the bench test shared a quiet ground between sensor and ADC, while the system's ground carries return current that creates the offset.
