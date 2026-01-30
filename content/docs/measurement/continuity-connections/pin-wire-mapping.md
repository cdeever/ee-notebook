---
title: "Which Pin Maps to Which Wire?"
weight: 30
---

# Which Pin Maps to Which Wire?

Cable tracing, connector pinouts, and verifying wiring against a schematic. When you're staring at an unfamiliar harness, a hand-wired prototype, or a cable that "someone else made," you need to map what's actually connected to what — not what the label says.

## DMM: Continuity-Based Wire Tracing

**Tool:** DMM, continuity mode (beeper)
**When:** Mapping out an unknown cable or verifying a harness against a pinout diagram

### Procedure

1. Disconnect the cable from everything at both ends
2. Set DMM to continuity mode
3. Pick a pin on one end — touch one probe to it
4. Touch the other probe to each pin on the far end until you get a beep
5. Record the mapping: pin 1 → pin 3, etc.
6. Repeat for every pin

### Systematic Approach for Multi-Pin Connectors

For connectors with many pins (DB-25, ribbon cables, etc.), a systematic approach saves time:

1. Number or label every pin on both ends if not already marked
2. Short one pin on the far end to a known reference (e.g., the shell, or pin 1 on the far end)
3. From the near end, find which pin beeps to that reference
4. Move the short to the next far-end pin and repeat
5. Record as you go — a simple table is enough

### What You Learn

- The actual pin-to-pin wiring of the cable
- Whether any pins are shorted together (unintentional bridges)
- Whether any pins are open (broken wire inside the cable)

### Gotchas

- Active cables (USB-C, HDMI, some Ethernet) have electronics inside. Continuity testing won't give meaningful results — you'll see the resistance of the internal circuit, not a direct wire
- Shielded cables have the shield connected to specific pins (usually the shell/ground). Map the shield separately
- Some cables intentionally cross over (null modem, crossover Ethernet). What looks like "wrong" wiring may be correct for the cable type. Know what you're expecting before declaring a fault

## DMM: Resistance-Based Cable Quality

**Tool:** DMM, Ohm mode
**When:** Checking whether wires in a cable are intact and low-resistance, beyond just pass/fail continuity

### Procedure

1. Disconnect cable at both ends
2. At the far end, short together the pin under test and a ground/return pin (creating a loop)
3. At the near end, measure resistance across those two pins
4. The reading includes the wire resistance out and back. Divide by 2 for the one-way resistance
5. Compare wires of the same gauge and length — they should all read similarly

### What You Learn

- Whether wire resistance is consistent across all conductors (one high reading indicates damage)
- Approximate wire resistance for long runs — useful for voltage drop calculations

### Expected Resistances

| Wire gauge (AWG) | Resistance per foot (approx.) | 50-foot cable round-trip |
|-----------------|------------------------------|------------------------|
| 22 AWG | 16 mOhm/ft | 1.6 Ohm |
| 24 AWG | 26 mOhm/ft | 2.6 Ohm |
| 26 AWG | 40 mOhm/ft | 4.0 Ohm |
| 28 AWG | 65 mOhm/ft | 6.5 Ohm |

### Gotchas

- DMM lead resistance (0.1–0.5 Ohm) matters for short cables. Null the leads first
- Temperature affects resistance — copper has a positive temperature coefficient. A cable run through a hot attic reads higher than the same cable at room temperature
- Corroded connections add resistance at the connector, not in the wire. If one conductor reads high, the fault is likely at the crimp or solder point, not a broken wire

## Verifying Wiring Against a Schematic

**Tool:** DMM (continuity mode) + schematic printout
**When:** Confirming a hand-wired assembly, checking someone else's work, or debugging a board that's wired wrong

### Procedure

1. Print the schematic or have it visible on a screen
2. Power off and disconnect the circuit
3. For each connection shown on the schematic, verify continuity between the two points
4. Mark each verified connection on the printout (highlighter works well)
5. Also check for unintended connections — especially between adjacent pins, adjacent traces, or nets that run close together

### What You Learn

- Whether the physical wiring matches the schematic — every connection, no extras
- Where miswires exist if the circuit isn't working

### Gotchas

- In-circuit measurements include parallel paths. A connection that reads "good" on continuity might be going through a component rather than through the intended wire. Trace the path carefully if something seems wrong despite all connections checking out
- Schematics don't always show every connection (power pins sometimes implied, grounds sometimes shown separately). Check your schematic conventions before declaring "extra" connections as faults
- On PCBs, continuity checking confirms the netlist but doesn't catch wrong footprints, wrong component values, or correctly-routed-but-wrong-schematic errors
