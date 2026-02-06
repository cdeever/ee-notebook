---
title: "Does Shielding / Rerouting Fix It?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Does Shielding / Rerouting Fix It?

Empirical fixes and verification. The noise and coupling path are identified — now try a fix and measure whether it actually works. Shielding, filtering, rerouting, and grounding changes are the main tools. The key is measuring before and after, changing one thing at a time, and not assuming something worked because it "should."

## Shielding Experiments

Measure baseline noise level. Place grounded copper or aluminum foil between suspected source and victim. Re-measure and compare.

| Material | Effective against | Not effective against |
|----------|------------------|---------------------|
| Copper foil | Electric fields, high-frequency magnetic (> 100 kHz via eddy currents) | Low-frequency magnetic (50/60 Hz) |
| Aluminum foil | Same as copper | Low-frequency magnetic |
| Mu-metal | Low-frequency magnetic (50/60 Hz) | Less effective at high frequency |
| Steel enclosure | Broad spectrum | Very low frequency magnetic |

**PCB shield cans:** Identify the noisy component using near-field probing. Improvise a temporary shield with copper tape soldered to ground plane. Measure improvement. If effective, design a proper shield can into the next PCB revision.

A shield must be grounded to work against electric fields. Gaps and seams leak — a shield with a 1 cm gap provides much less attenuation than a complete enclosure. Cables penetrating a shield carry noise through the boundary — filter at the entry point.

## Filtering Experiments

**Decoupling capacitor test:** Measure noise on power rail at victim device. Add ceramic capacitor (100 nF starting point) from VCC to GND as close to victim IC as possible. Re-measure.

For noise at specific frequency, choose capacitor for lowest impedance at that frequency:
- 100 nF: low impedance around 5–10 MHz
- 10 nF: low impedance around 15–30 MHz
- 1 µF: low impedance around 1–3 MHz

**Ferrite bead test:** Insert ferrite in series with power rail (between main rail and local bypass cap). The ferrite + bypass cap forms an LC low-pass filter.

**Series resistor on signal lines:** Add small series resistor (22–100 Ohm). Combined with input capacitance, this forms a low-pass filter that reduces high-frequency noise at the cost of slowed edges.

## Rerouting and Layout Changes

**Trace rerouting:** Identify aggressor trace (switching node, clock) and victim trace (analog, ADC input). Cut victim trace and reroute with jumper wire that increases distance from aggressor. Re-measure. If improved, incorporate into next PCB revision.

**Ground plane experiments:** If PCB has split or slotted ground plane, bridge the gap with copper tape or jumper wire. Slots force return current to detour, enlarging current loop and increasing coupling. Bridging the gap often dramatically reduces noise.

## Grounding Changes

| Experiment | What it tests |
|-----------|--------------|
| Dedicated ground wire from victim to source ground | Whether existing ground path has too much impedance |
| Star-ground: route all returns to one point | Whether ground loop currents between stages are the problem |
| Ground pour around sensitive signal | Whether local ground shield reduces capacitive coupling |
| Bond PCB ground to enclosure | Whether connection to enclosure ground reduces pickup |

## Tips

- Measure before and after every change — don't assume a fix worked
- Use multiple capacitor values in parallel for broadband filtering (1 µF + 100 nF + 1 nF)
- Jumper wires have different impedance than PCB traces — use for validation, not permanent fixes

## Caveats

- Capacitors have parasitic inductance (ESL) — above self-resonant frequency they become inductive and stop filtering
- Ferrite beads saturate at high DC current — impedance drops near rated limit
- Adding filter capacitors to voltage regulator outputs can affect stability
- Moving one trace may improve one coupling path and worsen another — always measure
- Ground plane modifications change return current paths for all signals
- Adding ground connections can create new ground loops if not done carefully

## In Practice

- Noise that drops significantly with copper foil shield confirms electric field or high-frequency magnetic coupling — permanent shield effective
- Noise unchanged by copper but reduced by mu-metal is low-frequency magnetic — need high-permeability shielding
- Noise reduced by decoupling capacitor indicates conducted coupling through power rail
- Noise reduced by ferrite bead indicates high-frequency conducted noise — ferrite filters work
- Noise reduced by trace rerouting confirms proximity coupling was dominant — layout matters
- Ground pour that helps indicates capacitive coupling was significant — consider guard traces
- **A noise problem that persists after extensive supply filtering** often shows up when the noise is coupling through a path other than the supply — ground impedance, electromagnetic radiation, or substrate coupling inside an IC. The supply was never the mechanism; it was just the first place investigated because supply noise was easy to measure.
- **A debugging session that requires numerous attempts at the same type of fix (more capacitors, more filtering, more shielding) without resolution** commonly appears when the coupling mechanism has been misidentified — each additional filter addresses the assumed path while the actual path remains untreated.
