---
title: "Which Pin Maps to Which Wire?"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Which Pin Maps to Which Wire?

Cable tracing, connector pinouts, and verifying wiring against a schematic. When staring at an unfamiliar harness, a hand-wired prototype, or a cable that "someone else made," the task is mapping what's actually connected — not what the label says.

## Continuity-Based Wire Tracing

Disconnect the cable at both ends. Pick a pin on one end, touch one probe to it, then touch the other probe to each pin on the far end until a beep indicates connection. Record the mapping and repeat for every pin.

For multi-pin connectors, a systematic approach saves time:
1. Number or label every pin on both ends if not already marked
2. Short one pin on the far end to a known reference (shell, or pin 1)
3. From the near end, find which pin beeps to that reference
4. Move the short to the next far-end pin and repeat

This reveals the actual pin-to-pin wiring, any pins shorted together (unintentional bridges), and any pins that are open (broken wire).

## Resistance-Based Cable Quality

Beyond pass/fail continuity, resistance measurement characterizes wire health:

1. At the far end, short together the test pin and a return pin (creating a loop)
2. At the near end, measure resistance across those two pins
3. Divide by 2 for one-way resistance
4. Compare wires of the same gauge and length — they should read similarly

**Expected resistances:**

| Wire gauge (AWG) | Resistance per foot | 50-foot cable round-trip |
|-----------------|---------------------|------------------------|
| 22 AWG | 16 mΩ/ft | 1.6 Ω |
| 24 AWG | 26 mΩ/ft | 2.6 Ω |
| 26 AWG | 40 mΩ/ft | 4.0 Ω |
| 28 AWG | 65 mΩ/ft | 6.5 Ω |

## Verifying Wiring Against Schematic

With schematic visible and circuit powered off:
1. For each connection shown, verify continuity between the two points
2. Mark each verified connection on the schematic
3. Also check for unintended connections — especially between adjacent pins or nets that run close together

## Tips

- Disconnect cables at both ends before tracing — active electronics in the path give misleading results
- Null DMM lead resistance for short cables where lead resistance matters
- Map the shield separately on shielded cables — it connects to specific pins (usually shell/ground)
- Know what wiring pattern to expect — some cables intentionally cross over (null modem, crossover Ethernet)

## Caveats

- Active cables (USB-C, HDMI, some Ethernet) have electronics inside — continuity testing shows internal circuit resistance, not direct wire paths
- In-circuit continuity can show connections going through components rather than the intended wire — trace carefully if results seem wrong
- Schematics don't always show every connection (power pins sometimes implied, grounds shown separately) — check conventions before declaring "extra" connections as faults
- Corroded connections add resistance at the connector, not in the wire — high reading on one conductor suggests crimp or solder fault
- Temperature affects resistance — copper has positive tempco; a cable in a hot environment reads higher

## In Practice

- One conductor reading significantly higher resistance than others of the same gauge indicates damage or poor termination
- Pin that beeps to multiple far-end pins indicates an unintentional short (bridge) in the cable or connector
- Pin that doesn't beep to any far-end pin indicates an open wire — break is in the cable or at a termination
- Wiring that doesn't match expected pattern could be a fault or could be correct for that cable type (crossover, null modem) — verify expectations first
- Continuity that appears through a component path rather than direct wire suggests the measurement is seeing the circuit, not the intended connection
