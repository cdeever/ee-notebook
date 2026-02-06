---
title: "Can I Touch/Probe This Safely?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Can I Touch/Probe This Safely?

The first question before any measurement. Before connecting a probe, the circuit's state must be determined: whether it's energized, whether stored energy remains, and whether contact is safe. This habit keeps a person measuring for decades instead of months.

## The Safety Check Sequence

A reliable safety assessment follows a four-step sequence: visual inspection, non-contact voltage detection, contact voltage measurement, and capacitor discharge verification. Each step catches what the previous one might miss.

### Visual Inspection

Visual inspection comes first because it identifies hazards that make powering up dangerous or pointless. Look for burnt or discolored components, bulging or leaking electrolytic capacitors, cracked PCBs, arcing marks on traces or connectors. The distinctive burnt-electronics odor indicates something has already failed. Loose wires, solder bridges, or anything that could short when power is applied warrants attention before proceeding.

On mains equipment, inspect the power cord for damage and verify earth/ground continuity with a DMM before plugging in. Safety-critical components — fuses, bleeder resistors, protective earth connections — should be intact and present.

### Non-Contact Voltage Detection

Non-contact voltage (NCV) detection provides a quick, hands-off check for mains AC before touching anything. The meter's front end is brought near the conductor, outlet, or wire insulation. If an AC electric field is present, the meter beeps or lights up.

NCV confirms whether a breaker is actually off or whether a wire is de-energized before cutting. However, NCV only detects AC fields — it won't detect DC, and it won't find stored charge in capacitors. Shielded cables and metal enclosures can block the field entirely.

### DMM Voltage Measurement

Contact measurement with a DMM confirms what NCV suggested. Before trusting any reading, verify the meter is working by testing on a known-live source. A meter with dead batteries or a blown fuse reads 0V on a live circuit.

Measure across power rails or capacitor terminals in both DC and AC modes. Some circuits have residual AC even when the DC supply is off. On circuits where ghost voltages are possible — long cable runs, circuits near transformers, high-impedance nodes — LoZ (Low Impedance) mode loads the node with approximately 3 kΩ, collapsing ghost voltages to zero while showing real voltages at full value.

### Capacitor Stored Energy

A voltage reading alone doesn't tell the whole story. The danger from capacitors is the stored energy, not just the voltage reading. A 220 µF capacitor at 400V stores 17.6 joules (E = ½CV²) — enough to be lethal.

Large capacitors in power supplies, PFC stages (often 200–450V), and any capacitor rated above 50V warrant attention. If voltage is present, discharge through an appropriate resistor — never a screwdriver. Screwdriver discharge creates current spikes that can damage the capacitor, weld contacts, or spray molten metal. A 1–10 kΩ power resistor (5–25W) with insulated leads, applied across the terminals, allows controlled discharge. Discharge time is approximately 5RC.

After discharge, measure again to confirm voltage is below 1V. Then measure *again* after a few minutes — capacitors can recover voltage through dielectric absorption.

## Tips

- Verify meter function on a known-live source before trusting a 0V reading
- Use LoZ mode to collapse ghost voltages on high-impedance circuits
- Discharge capacitors through a resistor, not a screwdriver
- Measure again after capacitor discharge — dielectric absorption can restore voltage
- Follow the one-hand rule when probing hazardous voltages — current path hand-to-hand crosses the heart
- Check earth/ground continuity on mains equipment before applying power
- Use probes and tools rated for the voltage present — CAT-rated probes exist for a reason
- If working on live high-voltage alone isn't avoidable, tell someone where the work is happening

## Caveats

- Visual inspection cannot detect internal component failure — a MOSFET can be dead-shorted and look perfectly fine
- NCV only detects AC fields — misses DC and stored charge entirely
- Shielded cables and metal enclosures block NCV detection, giving false "clear" readings
- Ghost voltages from capacitive coupling can make dead circuits read 30–80V on high-impedance (10 MΩ) meters
- Capacitors can recover voltage after discharge (soakback) — large electrolytics at high voltage can bounce back to tens of volts after a few minutes
- Bleeder resistors in the original circuit may have failed open, leaving capacitors charged indefinitely
- "Unplugged" does not mean "safe" — capacitors in power supplies, CRT circuits, and photoflash units hold charge for hours or days
- Inductors store energy too (E = ½LI²) — disconnecting a current-carrying inductor creates a voltage spike

## In Practice

- A meter reading 0V on a known-energized circuit indicates dead batteries, blown fuse, or wrong mode — never trust a single 0V reading without meter verification
- Unexpectedly high voltage (30–80V) on a "dead" circuit with a high-impedance meter suggests ghost voltage from capacitive coupling — switch to LoZ mode to confirm
- Voltage that returns after capacitor discharge indicates dielectric absorption — standard behavior for large electrolytics, requires re-measurement before contact
- Sparks or arcing when making contact suggest stored energy that wasn't discharged — stop and reassess the discharge procedure
- A circuit that reads 0V DC but shows AC voltage indicates induced voltage from nearby wiring or transformers
