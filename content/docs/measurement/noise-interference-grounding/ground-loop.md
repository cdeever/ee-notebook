---
title: "Is There a Ground Loop?"
weight: 20
---

# Is There a Ground Loop?

Hum, buzz, and ground-referenced interference. A ground loop forms when two or more devices share a ground connection through multiple paths, creating a loop that acts as an antenna for magnetic fields. The classic symptom is 50/60 Hz hum that won't go away no matter what you try — until you break the loop.

## What a Ground Loop Is

**Concept:** Multiple ground paths forming a loop

A ground loop exists when:

1. Device A and Device B are both connected to earth ground (through their power cords)
2. They're also connected to each other through a signal cable (audio cable, USB, BNC, etc.)
3. The signal cable's shield or ground wire creates a second path between the two ground points
4. Current flows around this loop — driven by the small voltage difference between the two ground points

The loop area acts as a single-turn transformer winding. Any magnetic field passing through the loop (from mains wiring, transformers, motors) induces a voltage that appears as noise on the signal.

### The Classic Setup

```
Device A ──── power cord ──── Outlet A ──── Building ground
    │                                           │
    └──── signal cable ──── Device B ──── power cord ──── Outlet B ──── Building ground
```

The two paths from Device A's ground to Device B's ground (signal cable and building wiring) form a loop. If the two outlets are on different circuits, there can be millivolts to volts of difference between their ground potentials — and that difference drives current through the signal cable shield.

## Oscilloscope: Identifying Ground Loop Hum

**Tool:** Oscilloscope, AC-coupled, low bandwidth limit
**When:** You see hum on a signal and suspect a ground loop

### Procedure

1. AC-couple the channel and set bandwidth limit to 1 kHz or lowest available (to focus on mains-frequency content)
2. Set vertical scale to see the hum (often 1–50 mV range)
3. Set timebase to 5 ms/div (shows about one cycle of 60 Hz or one and a quarter cycles of 50 Hz)
4. Observe the waveform:
   - **Smooth sine at 50/60 Hz:** Magnetic coupling — ground loop or transformer leakage
   - **Distorted waveform with harmonics at 100/120 Hz, 150/180 Hz:** Non-sinusoidal ground current (from rectifiers, SCR dimmers, nonlinear loads)
   - **Buzz (rich harmonic content at mains frequency):** Often ground loop combined with digital switching or rectifier harmonics

### The Diagnostic Test

1. **Measure the signal with everything connected normally** — observe the hum level
2. **Disconnect the signal cable between the two devices.** If the hum disappears, the cable is carrying ground loop current
3. **Alternatively, lift the signal ground at one end** (if the cable allows it — e.g., disconnect the shield at one end of an audio cable). If hum drops dramatically, it's a ground loop
4. **Power both devices from the same outlet** (same power strip). If hum drops, the ground potential difference between outlets was the driver

### What You Learn

- Whether the hum is caused by a ground loop (goes away when the loop is broken) or by something else (persists)
- The magnitude of the ground loop interference

### Gotchas

- Never lift the safety earth ground on equipment to fix a ground loop. This creates a shock hazard. Use proper solutions: isolation transformers, ground loop isolators, balanced connections, or DI boxes
- Some hum is not from ground loops — it's from magnetic coupling (transformer leakage, proximity to mains wiring). Moving the circuit away from the source reduces this; breaking ground connections doesn't help

## DMM: Measuring Ground Potential Difference

**Tool:** DMM, V~ (AC Volts)
**When:** Quantifying the voltage difference driving the ground loop

### Procedure

1. Set DMM to AC Volts
2. Measure between the ground terminals of the two devices (or between the ground pins of the two outlets)
3. This is the ground potential difference — the voltage driving current through the loop

### Interpreting the Reading

| Ground voltage difference | Significance |
|--------------------------|-------------|
| < 1 mV | Negligible — unlikely to cause audible hum |
| 1–10 mV | Possible hum source, especially in sensitive audio circuits |
| 10–100 mV | Significant — will cause audible hum in most audio systems |
| > 100 mV | Large — indicates different ground references or wiring issues |

### What You Learn

- The magnitude of the driving voltage for the ground loop
- Whether the problem is a few millivolts (may tolerate) or hundreds of millivolts (must fix)

### Gotchas

- This measurement is AC — ground loops are driven by AC currents in the building wiring. DC ground potential difference is a separate issue (galvanic corrosion, thermoelectric effects)
- The measurement includes the DMM lead resistance in the loop. For millivolt-level measurements, this is fine. For more precise measurement, use shielded leads

## Fixing Ground Loops

### Solutions (From Simplest to Most Involved)

| Solution | How it works | Best for |
|----------|-------------|----------|
| Power everything from one outlet | Minimizes ground potential difference | Bench setups, audio systems |
| Use [balanced connections]({{< relref "/docs/fundamentals/signaling-models/balanced-vs-unbalanced" >}}) (XLR, differential) | Signal carried as a differential pair; ground noise is common-mode and rejected | Audio, instrumentation |
| Ground loop isolator (transformer-based) | Breaks the galvanic ground connection in the signal path | Audio, video |
| DI box (Direct Injection) | Transformer-isolated, balanced output from unbalanced source | Audio (guitar, keyboards into mixer) |
| Isolation transformer on one device | Breaks the earth ground connection via transformer | Test setups (but be aware of safety implications) |
| Star grounding | All ground connections go to a single point; no loops | System-level design |
| Optical isolation | Eliminates ground connection entirely (optocoupler, fiber) | Data links between separate systems |

### Gotchas

- Balanced connections reject common-mode noise (including ground loop) only as well as the receiver's CMRR. At 60 Hz, most balanced inputs have excellent CMRR (60–80 dB). At higher frequencies, CMRR degrades
- Cheap "ground loop isolators" for audio use small transformers that can distort at low frequencies and roll off bass. Quality isolation transformers maintain response down to 20 Hz
- Star grounding only works if you maintain the star topology. A single additional ground connection between two branches creates a loop
