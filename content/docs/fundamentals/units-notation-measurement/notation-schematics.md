---
title: "Notation & Schematics"
weight: 20
---

# Notation & Schematics

Schematics are the shared language of electronics. Reading them fluently — knowing the symbols, reference designators, polarity conventions, and layout patterns — is a prerequisite for debugging, building, and understanding circuits. The notation conventions are mostly standardized, but "mostly" leaves room for confusion.

## Reference Designators

Every component on a schematic gets a reference designator: a letter code plus a number.

| Designator | Component | Notes |
|-----------|-----------|-------|
| R | Resistor | R1, R2, R17 |
| C | Capacitor | C1, C2, C33 |
| L | Inductor | L1, L2 |
| D | Diode | Including LEDs, Zeners, Schottky |
| Q | Transistor | BJT, MOSFET, JFET |
| U | Integrated circuit | ICs, chips |
| J | Connector | Sometimes "P" for plug |
| SW | Switch | |
| F | Fuse | |
| T | Transformer | |
| X or Y | Crystal / oscillator | Varies by convention |
| TP | Test point | |
| FB | Ferrite bead | Sometimes L or just "bead" |

Numbering is typically sequential (R1, R2, R3...) but doesn't imply any ordering or importance. After PCB layout revisions, the numbering often has gaps.

## Polarity and Direction Conventions

### Voltage Polarity

- The **+** and **-** markings on a component indicate the assumed polarity for the voltage across it
- For voltage sources: current flows out of the + terminal through the external circuit
- For passive elements: conventional current flows from + to - (from higher to lower potential)

### Current Direction

- **Conventional current** flows from + to - (from high potential to low). This is the standard in circuit analysis
- **Electron flow** is opposite — electrons move from - to +. Some older texts and technician training use this convention
- Pick one and be consistent. Most engineering contexts use conventional current

### Ground Symbols

Multiple ground symbols exist and they mean different things:

- **Earth ground** (three horizontal lines of decreasing length) — Physical connection to earth. Safety ground
- **Chassis ground** (similar but with a line under) — Connected to the equipment chassis
- **Signal ground** (inverted triangle or single line with three shorter lines) — The circuit's reference point, not necessarily earth

On most schematics, "ground" means the circuit reference (0 V). It may or may not be connected to earth ground.

## Reading Other People's Schematics

### The Skill

Reading a schematic is not the same as reading text — it's pattern recognition. Experienced engineers see functional blocks (voltage divider, RC filter, H-bridge, bootstrap circuit) rather than individual components. Building this pattern library takes exposure.

### Common Layout Patterns

- **Power flows top-to-bottom or left-to-right** — Positive supply at top, ground at bottom. Signal flows left to right
- **Decoupling caps are drawn near their IC** — But sometimes they're collected on a separate sheet. If an IC has no visible bypass caps, check the power sheet
- **Net names replace wires** — In complex schematics, wires between distant parts of the circuit are replaced by labels. "VCC_3V3" on one sheet connects to "VCC_3V3" on another sheet. Follow the labels, not the wires
- **Power flags/symbols** — VCC, VDD, 3V3, 5V, GND are symbols that indicate global power connections without drawing explicit wires

### Multi-Sheet Schematics

Large designs use multiple schematic sheets. Understanding the hierarchy:

- **Flat schematic** — All sheets are at the same level, connected by global net names
- **Hierarchical schematic** — A top-level sheet shows blocks, each block is a separate sheet with defined ports. More structured but harder to trace signals across boundaries

### What to Look for First

1. **Power supply section** — Where does power come from? What voltages exist? What generates them?
2. **Main signal path** — Input to output, through the functional blocks
3. **Feedback and control** — What signals feed back? Where are the regulation loops?
4. **Protection** — ESD, overcurrent, overvoltage, reverse polarity
5. **Connectors** — What goes in and out of the board?

## Schematic Notation Variations

Things that vary between schematics and can cause confusion:

- **Component values** — Some schematics put "10K" on the schematic, some put "10kohm," some put "10,000." All mean 10 kohm
- **Capacitor units** — "104" on a ceramic cap = 10 x 10^4 pF = 100 nF = 0.1 uF. This three-digit code is common on physical parts and sometimes appears on schematics
- **Pin numbers vs. pin names** — ICs might show pin numbers (physical pins), pin names (functional names), or both. Know which you're looking at when probing
- **Dot convention on transformers** — Dots indicate winding polarity (same instantaneous polarity). Getting this wrong flips the phase of the output

## Gotchas

- **Not all connections are explicit** — Power pins on ICs are sometimes hidden in the schematic symbol. Check the datasheet to find which pins need power connections and bypass caps
- **"No connect" pins** — A pin with an X or "NC" marking should genuinely be left unconnected. But some ICs reuse "NC" pins in later revisions. Check the specific part revision
- **Schematic ≠ layout** — Component placement on the schematic has no relationship to physical placement on the PCB. Two adjacent components on the schematic might be on opposite sides of the board
- **Outdated schematics** — Schematics don't always match the built hardware. Rework, component substitutions, and cut traces create discrepancies. When debugging a physical board, verify critical connections, don't just trust the drawing
