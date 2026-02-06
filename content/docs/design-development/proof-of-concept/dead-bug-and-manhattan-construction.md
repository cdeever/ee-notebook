---
title: "Dead-Bug & Manhattan Construction"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Dead-Bug & Manhattan Construction

When a [breadboard's parasitics]({{< relref "breadboarding-strategies" >}}) make results unreliable — switching regulators, RF circuits, sensitive analog front ends — but an answer is needed faster than a PCB run allows, dead-bug and Manhattan construction fill the gap. These techniques provide a real ground plane, short signal paths, and controlled-impedance connections while still allowing same-day iteration.

## Dead-Bug Construction

Dead-bug construction means soldering components directly to a copper ground plane (a piece of bare copper-clad board) with their leads in the air. ICs are placed upside-down — legs sticking up like a dead bug — and connections are made with short point-to-point wires.

**What it provides:**
- A solid ground plane with low-impedance return paths
- Short, controlled-length connections (low parasitic inductance)
- Fast build and modification — rewiring a connection takes seconds
- Usable performance into the hundreds of megahertz range for simple circuits

**How to build one:**

1. Cut a piece of single-sided copper-clad board to size. FR4 is standard; thicker material (1.6 mm) is easier to work with.
2. Clean the copper surface with fine sandpaper or a Scotch-Brite pad, then wipe with isopropyl alcohol.
3. Tack ground connections by soldering component leads or short wires directly to the copper surface.
4. Mount ICs upside-down, soldering the ground pins to the copper. The remaining pins stick up for point-to-point wiring.
5. Make signal connections with short pieces of enameled (magnet) wire or stripped hookup wire. Keep them as short as possible.
6. Add bypass capacitors directly from IC power pins to the ground plane — physically touching the copper, not connected through a wire.

**Wire choice matters.** Enameled (magnet) wire is ideal: the insulation is thin, so wires can cross without shorting, and the stiffness keeps connections in place. 26–30 AWG is a good range. Solid hookup wire works too but is harder to route when wires need to cross.

## Manhattan Construction

Manhattan construction extends the dead-bug idea by adding small pads — typically squares or rectangles cut from copper-clad board stock — as connection islands on top of the ground plane. Components solder between pads, and from pads to the ground plane.

**Advantages over dead-bug:**
- Component leads don't float in the air — they're anchored to pads, making the circuit more mechanically stable
- Pads provide defined connection points that are easier to probe and modify
- Better suited to circuits with many discrete components (filters, matching networks)

**Making pads:**
- Cut small squares (3–5 mm) from copper-clad board material using metal shears, a saw, or a specialized pad cutter (sold by QRP kit suppliers)
- Glue pads to the ground plane with superglue (cyanoacrylate) or epoxy. Superglue is faster; epoxy is stronger and more heat-resistant.
- Some builders solder the pads to the ground plane through a small piece of copper between the pad and the base — this is an "island" with a defined connection to ground, useful for decoupling

**Manhattan style is the traditional RF prototyping technique.** It remains the fastest way to build and test RF circuits — filters, amplifiers, oscillators, matching networks — below a few gigahertz without ordering a PCB. Many amateur radio operators and RF engineers still prototype this way.

## When to Use Each Technique

| Situation | Technique | Why |
|-----------|-----------|-----|
| Quick op-amp or comparator test | Dead-bug | Fast, one IC, a few passives |
| RF filter or matching network | Manhattan | Multiple components, needs stable pads for tuning |
| Switching regulator evaluation | Dead-bug | Ground plane essential, fast iteration on feedback components |
| Crystal oscillator startup test | Dead-bug | Parasitic-sensitive, needs ground plane |
| Multi-stage RF amplifier | Manhattan | More complex, needs mechanical stability and defined signal flow |
| One-off sensor front end | Dead-bug | Quick answer, will move to PCB regardless |

## Tools and Materials

The materials list is short:

- **Copper-clad board** — single-sided FR4, available from electronics suppliers or eBay in bulk. Double-sided works too (use the bottom as ground, the top for construction).
- **Shears or saw** — for cutting board and pads. A bandsaw works but makes a mess. Metal shears are cleaner.
- **Soldering iron** — needs more thermal mass than fine-pitch PCB work. A larger tip (2–3 mm chisel) and slightly higher temperature (370–400°C) help when soldering to the copper plane, which acts as a heat sink.
- **Superglue** — for attaching Manhattan pads. Gel formula is easier to control than liquid.
- **Enameled wire** — 26–30 AWG for signal connections.
- **Flush cutters and tweezers** — standard electronics tools.
- **Fine sandpaper or Scotch-Brite** — for cleaning copper before soldering.

## Limitations

Both techniques have real constraints:

- **Non-reproducible.** Each build is unique. A dead-bug circuit cannot be handed to a manufacturer with instructions to "build 100 of these." These are for answering questions, not for production.
- **Mechanical fragility.** Dead-bug circuits are delicate. A dropped circuit or a snagged wire can break connections. Manhattan is more robust but still not suitable for handling.
- **Debugging by inspection is hard.** A rats-nest of wires is hard to trace visually. Taking photos during construction and labeling connections helps considerably.
- **Not practical for fine-pitch ICs.** Dead-bug works well with DIP and SOIC packages. QFN and BGA are not feasible — a PCB is required for those.
- **Thermal management is limited.** The copper ground plane conducts heat, which is an advantage for power circuits, but there's no controlled thermal path for hot components.

## Documenting the Build

A dead-bug or Manhattan circuit is temporary, but the knowledge it produces isn't. Before disassembling:

- **Photograph the circuit** from multiple angles. A clear overhead shot with labels is invaluable.
- **Sketch the schematic** as built (not as designed — note any modifications made during construction).
- **Record measurements** — what was tested, what was measured, what the results mean.
- **Note what should change** — this feeds directly into the [system architecture]({{< relref "../system-architecture" >}}) and [schematic design]({{< relref "../schematic-design" >}}) phases.

## Tips

- Use a larger soldering tip (2-3 mm chisel) at 370-400 deg C when soldering to the copper ground plane -- the large copper mass sinks heat quickly and standard fine tips cannot keep up
- Solder bypass capacitors directly from IC power pins to the ground plane with no intervening wire; even a short wire adds enough inductance to matter at higher frequencies
- Photograph the circuit from multiple angles before disassembling, and sketch the as-built schematic including any changes made during construction
- For Manhattan builds, pre-cut a batch of 3-5 mm copper pads in advance so construction flows without interruption

## Caveats

- **The ground plane is a heat sink** -- soldering to a large copper surface requires more heat than soldering to a PCB pad; if joints look cold or lumpy, increase the temperature and use a larger tip
- **Superglue fumes fog nearby surfaces** -- glue Manhattan pads in a ventilated area, away from optics (microscopes, cameras); the fumes deposit a white film on cold surfaces
- **Enameled wire insulation must be removed at solder points** -- either burn it off with the soldering iron (works but produces fumes) or scrape it off with a blade; some enameled wire is "solderable" (the insulation melts at soldering temperature) which is much more convenient
- **Component values may need adjusting for PCB** -- a circuit tuned on a dead-bug build includes the parasitics of that specific construction; when moving to a PCB, expect to re-tune because the parasitics will be different, usually lower
- **RF circuits need SMA connectors** -- for any RF measurement above a few megahertz, solder an SMA edge-launch connector to the copper ground plane for a clean connection to test equipment; clip leads and scope probes are useless at RF
