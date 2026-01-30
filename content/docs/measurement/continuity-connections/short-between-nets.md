---
title: "Is There a Short Between These Nets?"
weight: 20
---

# Is There a Short Between These Nets?

Two nets that shouldn't be connected, but are. Solder bridges, damaged traces, internal component failures, conductive contamination — shorts cause everything from "doesn't power up" to "works but runs hot." Finding them is straightforward; narrowing down *where* on a complex board takes technique.

## DMM: Resistance Between Nets

**Tool:** DMM, Ohm mode
**When:** Checking whether two nets that should be isolated are shorted

### Procedure

1. Power off the circuit. Disconnect external power sources
2. Set DMM to Ohms, lowest manual range for best resolution
3. Measure between the two nets — e.g., VCC to GND, adjacent signal pins, adjacent traces
4. A short reads near 0 Ohm. An open reads OL (over limit)

### Interpreting the Reading

| Reading | Meaning |
|---------|---------|
| 0–1 Ohm | Hard short — direct metal-to-metal connection |
| 1–100 Ohm | Low resistance path — could be a component in circuit (check schematic) or a resistive short (contamination, partial bridge) |
| 100 Ohm–10 kOhm | Possibly a component's normal in-circuit resistance (pull-ups, pull-downs, termination). Check schematic before declaring a fault |
| OL | No connection — nets are isolated |

### What You Learn

- Whether two nets are shorted, and a rough sense of the short's resistance
- Comparing resistance between VCC and GND across different ICs can help localize which IC or section has the short

### Gotchas

- In-circuit measurements include all parallel paths through components. VCC to GND through a 100 uF capacitor initially reads near 0 Ohm as the cap charges, then rises to OL. Wait for the reading to settle
- Low-ESR electrolytics charge fast — the "short" reading flashes by quickly. If you see a brief low reading that rises, that's a capacitor, not a short
- Some ICs have internal protection diodes from every pin to VCC and GND. In resistance mode, these can conduct and give misleadingly low readings. Use diode mode to check (see below)
- Body diodes in MOSFETs show as a short in one direction. Always measure both directions

## DMM: Diode Mode for Short-Finding

**Tool:** DMM, diode test mode
**When:** Distinguishing real shorts from semiconductor junctions, and narrowing down short location

### Why Diode Mode

Diode mode applies a known current (typically ~1 mA) and displays the forward voltage drop. This is more useful than resistance mode for distinguishing:

- A true short (0.000V) from a semiconductor junction (0.4–0.7V for silicon)
- A real fault from a protection diode doing its job

### Procedure

1. Set DMM to diode mode
2. Measure between the suspect nets in both polarities (swap red/black leads)
3. Interpret the voltage readings:

| Reading | Meaning |
|---------|---------|
| 0.000V both directions | True short — no semiconductor junction, metal-to-metal |
| 0.4–0.7V one direction, OL other | Normal silicon diode — probably a protection diode or body diode |
| 0.2–0.3V one direction | Schottky diode or germanium — likely intentional |
| OL both directions | No connection — nets are isolated |

### What You Learn

- Whether the "short" is a real metal-to-metal fault or a conducting semiconductor junction
- Which direction the junction conducts — helps identify which component is in the path

### Gotchas

- Diode mode's test current is small (~1 mA). Some faults are resistive enough that diode mode reads OL while resistance mode shows a low value. Check both modes
- Multiple parallel diodes (protection diodes on an IC with 20 pins to VCC) can give a lower-than-expected forward voltage because current shares across them

## Localizing a Short on a Board

**Tool:** DMM (resistance mode) + thermal or voltage-injection techniques
**When:** You've confirmed a short exists and need to find it physically

### Comparative Resistance Method

1. Identify two nets that are shorted (e.g., VCC to GND reads 0.5 Ohm)
2. Pick one net (say VCC) and measure resistance from that net to the short point at various locations on the board
3. The reading gets lower as you measure closer to the short — resistance decreases as you approach the fault because you're eliminating trace resistance between your probe and the short
4. On a board with multiple ICs on the same rail, measure VCC-to-GND resistance at each IC's bypass cap. The lowest reading is closest to the short

### Voltage Injection Method

1. With the board unpowered, connect a current-limited bench supply (set to 0.5–1V, current limit 100–500 mA) across the shorted nets
2. Use the DMM in millivolt DC mode to measure voltage drops along the traces
3. Follow the voltage gradient toward zero — the short is where the voltage is lowest
4. This works because current flows through trace resistance, creating a voltage drop that you can follow like a trail

### Thermal Method

1. Inject current into the shorted nets as above (enough to warm the short, not enough to damage anything — start low)
2. Use a thermal camera, IR thermometer, or even a finger (on low-voltage shorts only) to find the warm spot
3. The short dissipates power and heats up. Solder bridges, shorted capacitors, and failed ICs all get warm when you push current through them
4. Freeze spray (component cooler) can help: spray components one at a time and watch for the resistance to change as the suspect component cools

### Gotchas

- Voltage injection can damage sensitive components. Keep the voltage low (< 1V) and the current limited. You're only trying to create a detectable gradient, not power the circuit
- On multi-layer boards, the short may be on an internal layer — invisible and unreachable without removing components to isolate sections
- Removing components one at a time and re-checking the short is tedious but definitive. Start with the most likely suspects: ICs with the most pins on the shorted nets, areas with fine-pitch soldering, recently reworked areas
