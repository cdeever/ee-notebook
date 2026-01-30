---
title: "Layout as Part of Design, Not Cleanup"
weight: 10
---

# Layout as Part of Design, Not Cleanup

Layout is not the last step in a project — it's the step where the design becomes physically real, and where a whole category of problems becomes visible for the first time. The schematic captures logical connections, but it says nothing about how far apart two components are, what temperature they'll reach, or how much noise one trace couples into another. Layout is where those questions get answered, and the answers often require changing the schematic.

## The Schematic Doesn't Capture Everything

A schematic tells you what connects to what. It doesn't tell you:

- **Proximity matters.** A decoupling capacitor placed ten centimeters from its IC on the PCB is not really decoupling anything, regardless of what the schematic implies. The physical distance between the cap and the power pins determines its effectiveness, and the schematic gives no hint of this.
- **Thermal paths are invisible on schematics.** A voltage regulator next to a temperature-sensitive ADC might work fine on paper, but on the board, radiated heat from the regulator shifts the ADC's readings. The schematic shows no thermal coupling.
- **Return current paths don't appear on schematics.** Every signal has a return current, and that current follows the path of least impedance. If the ground plane is slotted or the return path is forced around an obstacle, signal integrity degrades. Nothing in the schematic reveals this.
- **Noise coupling depends on geometry.** Two parallel traces running side by side for three centimeters will crosstalk. The schematic shows them as independent nets.

These are not edge cases. They're the normal reality of every PCB, and they mean that layout decisions are design decisions.

## Floorplanning: The First Layout Decision

Before routing a single trace, the most important layout activity is floorplanning — deciding where the major functional blocks will sit on the board. Good floorplanning makes routing natural and keeps noise-sensitive circuits away from noisy ones. Bad floorplanning creates a layout that fights itself at every turn.

A floorplan typically starts with the constraints that can't move: connectors (which must reach the enclosure edge), mounting holes (which are fixed by the mechanical design), and any components with fixed positions (heat sinks aligned with airflow, antennas at the board edge). Everything else is arranged around these anchors.

Key floorplanning principles:

- **Group related components.** The power supply section should be physically together, the analog front end should be together, the digital logic should be together. This minimizes trace lengths within each block and makes it easier to manage the boundaries between blocks.
- **Separate noisy and sensitive circuits.** Keep switching regulators away from sensitive analog inputs. Keep high-speed digital signals away from low-level analog signals. Physical separation is the first and most effective defense against noise coupling.
- **Plan the power distribution early.** Power planes, power traces, and decoupling capacitors all need physical space. If the floorplan doesn't account for power distribution, the routing phase becomes a constant battle for space.
- **Think about the ground strategy.** Will you use a solid ground plane? Split ground planes? Star grounding? This decision shapes the entire layout and must be made during floorplanning, not discovered during routing.

## Iterating Between Schematic and Layout

One of the clearest signs that layout is a design activity is how often it sends you back to the schematic. Common layout-driven schematic changes include:

- **Adding test points.** During layout, you realize you can't probe a critical net without a dedicated test point. This requires adding a component to the schematic.
- **Swapping pin assignments.** An MCU's GPIO pins are often interchangeable. During layout, you discover that swapping two pin assignments eliminates a pair of crossing traces and simplifies routing. The schematic must be updated to reflect the change.
- **Splitting or merging power rails.** Layout may reveal that a single power rail serving two blocks would benefit from separate filtering or separate copper pour areas. This is a schematic-level change driven by physical reality.
- **Adding series resistors or ferrite beads.** A trace that runs near a sensitive area might need a series filter component that wasn't in the original design. The schematic grows during layout.
- **Reconsidering component packages.** A QFP footprint might not fit in the available space, driving a change to a QFN or BGA — which affects the schematic symbol and possibly the pinout.

These iterations are normal and healthy. They represent the design getting better because the physical reality is being incorporated.

## The "Throw It Over the Wall" Antipattern

In some organizations, the schematic designer finishes the design, generates a netlist, and hands it to a layout person who has never seen the design before. The layout person places components and routes traces according to whatever rules they've been given, but they don't understand the design intent — which signals are sensitive, which components need to be close together, which traces carry high-speed signals.

This separation creates problems:

- **Lost intent.** The schematic designer knows that a particular trace is a low-level analog signal that must be guarded, but this information isn't in the netlist. The layout person routes it like any other trace.
- **No feedback loop.** The layout person discovers a problem — a component won't fit, a trace can't be routed without violating spacing rules — but the fix requires a schematic change that only the original designer understands.
- **Slow iteration.** Every layout question requires a round-trip to the schematic designer, adding days or weeks to the schedule.

The best results come when the same person does both schematic and layout, or when the schematic and layout designers work side by side with frequent, informal communication. Layout constraints need to flow upstream into the schematic, and design intent needs to flow downstream into the layout. Any barrier between these two activities degrades the final product.

## Layout Decisions That Shape the Design

Some decisions that feel like "just layout" actually define the circuit's performance:

- **Trace width determines current capacity and impedance.** A trace that's too narrow for its current will heat up. A trace that's the wrong width for its impedance target will cause reflections.
- **Via count and placement affect thermal and electrical performance.** A thermal pad connected to a plane through too few vias will overheat. A signal via placed too close to another via creates unwanted coupling.
- **Component rotation matters for thermal and signal flow.** Rotating a component 90 degrees might put its thermal pad in a better position or align its pins with the routing channels.
- **Copper pour strategy affects everything.** Solid ground pours improve thermal spreading and reduce EMI. But copper pour near sensitive analog circuits can create unwanted capacitive coupling if not managed carefully.

Layout is where all the domains — electrical, thermal, mechanical, and manufacturing — converge. Treating it as a clerical step after the "real" design is done misses the point entirely. The layout is part of the design, and often the most consequential part.

## Gotchas

- **The schematic looks clean but the layout is impossible.** A schematic can be logically correct and still imply a layout that can't be routed in the available space or layer count. Schematic clarity and layout feasibility are separate concerns.
- **Pin swaps save hours of routing.** Many ICs have functionally equivalent pins. Checking whether a pin swap simplifies routing should be standard practice, not an afterthought.
- **Ground plane cuts are invisible killers.** A slot in the ground plane under a signal trace forces the return current to detour, creating a loop antenna. These slots often appear unintentionally when routing other signals on the same layer.
- **"I'll fix it in layout" is the schematic designer's famous last words.** Some problems genuinely can be solved in layout, but many cannot. If the schematic topology is wrong, no amount of clever routing will fix it.
- **Layout reviews catch different bugs than schematic reviews.** A schematic review checks logical correctness. A layout review checks physical correctness — spacing, thermal paths, manufacturing rules. Both are necessary, and they're not interchangeable.
