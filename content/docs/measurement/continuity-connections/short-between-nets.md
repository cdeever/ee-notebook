---
title: "Is There a Short Between These Nets?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is There a Short Between These Nets?

Two nets that shouldn't be connected, but are. Solder bridges, damaged traces, internal component failures, conductive contamination — shorts cause everything from "doesn't power up" to "works but runs hot."

## Resistance Between Nets

Power off and disconnect external power. Measure between the two nets that should be isolated (e.g., VCC to GND, adjacent signal pins).

| Reading | Meaning |
|---------|---------|
| 0–1 Ω | Hard short — direct metal-to-metal connection |
| 1–100 Ω | Low resistance path — could be a component or a resistive short (contamination, partial bridge) |
| 100 Ω – 10 kΩ | Possibly normal in-circuit resistance (pull-ups, termination) — check schematic |
| OL | No connection — nets are isolated |

## Diode Mode for Short-Finding

Diode mode distinguishes true shorts from semiconductor junctions by displaying forward voltage drop.

| Reading | Meaning |
|---------|---------|
| 0.000V both directions | True short — metal-to-metal, no semiconductor |
| 0.4–0.7V one direction, OL other | Normal silicon diode — protection diode or body diode |
| 0.2–0.3V one direction | Schottky diode — likely intentional |
| OL both directions | No connection — nets are isolated |

Measure both polarities by swapping leads.

## Localizing a Short

**Comparative resistance method:** Measure resistance from one shorted net to the fault at various board locations. The reading gets lower closer to the short. On boards with multiple ICs on the same rail, measure VCC-to-GND at each IC's bypass cap — the lowest reading is closest to the short.

**Voltage injection method:** Connect a current-limited bench supply (0.5–1V, 100–500 mA) across the shorted nets. Use DMM in millivolt mode to follow the voltage gradient toward zero — the short is where voltage is lowest.

**Thermal method:** Inject current and use a thermal camera, IR thermometer, or finger (low-voltage only) to find the warm spot. The short dissipates power and heats up.

## Tips

- Always measure both polarities — body diodes in MOSFETs show as a short in one direction only
- Wait for capacitors to charge — VCC to GND through a capacitor initially reads near 0 Ω then rises to OL
- Use diode mode to distinguish real shorts from protection diodes doing their job
- Measure at bypass caps across the board to narrow down which section has the short

## Caveats

- In-circuit measurements include all parallel paths — low-ESR capacitors charge fast, showing only a brief low reading
- ICs have internal protection diodes from pins to VCC and GND that can give misleadingly low readings in resistance mode
- Diode mode's ~1 mA test current may read OL on resistive faults that resistance mode catches — check both modes
- Multiple parallel protection diodes (many pins to VCC) can give lower-than-expected forward voltage
- Voltage injection can damage sensitive components — keep voltage < 1V and current limited
- On multi-layer boards, the short may be on an internal layer — invisible and unreachable without removing components

## In Practice

- Brief low resistance reading that rises to OL indicates capacitor charging, not a short
- 0.000V in diode mode both directions confirms a true metal-to-metal short, not a semiconductor path
- Resistance reading that's lowest at one specific IC's bypass cap localizes the short to that IC or nearby
- Component that gets warm during voltage injection is in the short path — could be the fault or just a victim
- Resistance that decreases when measuring closer to one board area narrows down the short location
- Short that remains after removing a suspect component was in that component; short that persists is elsewhere
