---
title: "Is This Joint Making Contact?"
weight: 10
---

# Is This Joint Making Contact?

Solder joints, crimp connections, header pins, socket contacts — any place two conductors are supposed to be electrically connected. A joint can look fine and still be open or resistive. This is the most basic electrical test, and it's the one that catches the most faults on newly built or aging boards.

## DMM: Continuity Beep

**Tool:** DMM, continuity mode (beeper)
**When:** Fast go/no-go — you want to know "connected or not" without reading numbers

### Procedure

1. Set DMM to continuity mode (diode/beep symbol)
2. Touch probes to the two points that should be connected
3. A beep means low resistance (typically < 30–50 Ohm depending on the meter). No beep means open or high resistance

### What You Learn

- Whether the joint is making contact at all — pass/fail
- Fast enough for checking dozens of solder joints in sequence

### Gotchas

- The beep threshold varies by meter. Most beep below 30–50 Ohm, which means a 40 Ohm cold solder joint might beep. Continuity mode tells you "not open," not "good joint"
- Continuity mode applies a small test current and measures the resulting voltage. The test current is low (typically < 1 mA), so it won't turn on semiconductor junctions — but on very low-resistance paths, the reading can be affected by thermoelectric voltages from dissimilar metals at the probe tips
- Speed matters: a good continuity mode responds fast enough that you can drag a probe across pins and hear individual beeps. Slow-responding meters miss intermittent contacts

## DMM: Resistance Measurement

**Tool:** DMM, Ohm mode
**When:** You need a number, not just pass/fail — characterizing marginal joints, comparing good vs. suspect

### Procedure

1. Set DMM to Ohms, auto-range
2. Measure across the joint
3. A good solder joint reads < 1 Ohm (often < 0.1 Ohm). A good crimp reads similarly. Higher resistance indicates a problem

### What Good Joints Look Like

| Connection type | Expected resistance | Suspect if |
|----------------|-------------------|------------|
| Solder joint (through-hole) | < 0.1 Ohm | > 1 Ohm |
| Solder joint (SMD) | < 0.1 Ohm | > 1 Ohm |
| Crimp terminal | < 0.05 Ohm | > 0.5 Ohm |
| IC socket contact | < 0.1 Ohm | > 1 Ohm, or varies when wiggled |
| Header pin connection | < 0.1 Ohm | > 0.5 Ohm |
| PCB trace (short run) | < 0.5 Ohm | Depends on trace width and length |

### What You Learn

- Quantitative resistance of the connection — useful for comparison between known-good and suspect joints
- Whether a joint is marginally connected (high resistance) vs. solidly connected (near zero)

### Gotchas

- At resistances below ~1 Ohm, DMM lead resistance matters. Standard leads contribute 0.1–0.5 Ohm. Null the leads first (short the probes together and note the reading) or use relative/delta mode if your meter has it
- For true milliohm measurements (trace resistance, contact resistance), you need 4-wire (Kelvin) measurement to eliminate lead resistance entirely
- Measuring resistance in-circuit: parallel paths through other components can give a lower reading than the joint alone. If possible, isolate the joint (lift one leg, or measure on a depopulated board)
- Capacitors in the circuit can cause the reading to drift — the DMM's test voltage charges the cap. Wait for the reading to settle, or recognize that a slowly rising resistance reading means you're charging a capacitor, not measuring a resistor

## Solder Joint Assessment: Visual + Electrical

**Tool:** Magnification (loupe, microscope) + DMM
**When:** Troubleshooting a board that "should work" but doesn't

### Procedure

1. Visual inspection under magnification: look for cold joints (grainy, dull surface), insufficient wetting (solder sitting on top of the pad like a ball), cracks, voids, or bridged pins
2. For suspect joints, measure resistance across the joint
3. Compare to adjacent known-good joints of the same type
4. Gently press on the joint while measuring — if resistance changes, the joint is cracked or cold

### What You Learn

- Whether the joint is mechanically and electrically sound
- Cold solder joints often have high resistance that changes when the joint is mechanically stressed

### Gotchas

- A joint can look good visually and still be electrically bad — internal voids, cold joints hidden under a smooth exterior (especially with lead-free solder)
- Conversely, a joint can look ugly (rough, dull) and be electrically perfect. This is common with lead-free solder, which doesn't wet as prettily as leaded solder
- BGA and QFN joints are invisible. You can only assess them electrically (resistance, boundary scan) or with X-ray
