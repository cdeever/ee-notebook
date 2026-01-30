---
title: "Mechanical Constraints"
weight: 30
---

# Mechanical Constraints

A PCB doesn't exist in a vacuum — it sits inside an enclosure, bolts to a chassis, or mounts in a rack. The mechanical world imposes constraints that the schematic knows nothing about: board outline, mounting holes, height limits, connector positions, and thermal clearances. Ignoring these constraints during layout results in boards that work electrically but don't fit physically, which is a uniquely frustrating failure mode.

## Board Outline and Mounting

The board outline is the first mechanical constraint and often the least negotiable. It's defined by the enclosure, the product form factor, or the available space in a larger system. Everything else on the board must fit within this boundary.

Key outline considerations:

- **Shape isn't always rectangular.** Irregular outlines with cutouts, notches, and rounded corners are common. Internal cutouts for through-hole connectors, display windows, or airflow passages all reduce available routing area.
- **Mounting holes consume board space.** Each mounting hole needs a keep-out zone — typically 2-3 mm around the hole where no copper or components can be placed (to clear the screw head and washer). Four mounting holes in the corners of a small board can consume a surprising amount of usable area.
- **Board edge clearance.** Components and traces must be set back from the board edge by the fabricator's minimum (usually 0.25-0.5 mm) plus any additional clearance needed for the enclosure's internal features — ribs, guides, or card-edge retainers.
- **Panel tabs and breakaway features.** If the board will be panelized for manufacturing, the tab locations and V-score lines must be planned into the outline. Tab remnants ("mouse bites") along the board edge should not interfere with enclosure fit or connector access.

## Height Restrictions

PCB layout tools show the board from above, which makes it easy to forget that components have height. An electrolytic capacitor that clears all design rules in the XY plane might collide with the enclosure lid in the Z direction.

Common height-related issues:

- **Enclosure lid clearance.** The tallest component on the board plus any solder joint standoff must fit below the enclosure lid. Capacitors, transformers, inductors, and connectors are the usual offenders.
- **Component-to-component clearance.** A tall component next to a low one is fine. Two tall components next to each other may interfere during assembly or rework.
- **Bottom-side components.** If components are placed on both sides of the board, the bottom-side components must clear the mounting surface. Stand-off height must accommodate both the board thickness and the tallest bottom-side component.
- **Connector mating height.** Connectors have a specific mating height — the distance from the board surface to the point where a cable or mating connector engages. This must align with the enclosure panel cutout.

I've learned to maintain a "height map" — even a rough sketch showing which areas of the board have height restrictions — and to check it against the enclosure model before finalizing component placement.

## Connector Placement

Connectors define the physical interface between the PCB and the outside world. Their placement is constrained by the enclosure and by the cables or mating connectors that will connect to them.

- **Edge-mounted connectors must align with panel cutouts.** The connector position on the PCB must match the cutout position on the enclosure panel within tight tolerances — usually 0.5 mm or less. Misalignment means the connector either doesn't protrude enough for mating or sits at an angle that stresses the solder joints.
- **Connector height and depth.** Panel-mount connectors have a specific protrusion distance from the board edge. Some (like USB Type-C) have very tight depth requirements that constrain how close other components can be to the board edge.
- **Grouped connectors need consistent spacing.** If multiple connectors line up along one edge, their pitch must match the panel cutout spacing. This constrains the routing channels between them.

See [Connector Placement & Panel Design]({{< relref "/docs/design-development/pcb-layout-and-physical-integration/connector-placement" >}}) for detailed connector layout guidance.

## Thermal Clearance

Hot components need space — both for their own heat dissipation and to protect nearby temperature-sensitive parts.

- **Airflow paths.** If the enclosure has vents or a fan, hot components should be placed in the airflow path, not in dead-air pockets. The mechanical design of the enclosure determines airflow, and the PCB layout must respect it.
- **Heatsink access.** Components that need heatsinks require clear space above them (for the heatsink body) and around them (for airflow across the heatsink fins). A heatsink that's enclosed on all sides is barely better than none at all.
- **Thermal isolation.** Temperature-sensitive components (voltage references, precision resistors, crystal oscillators) should be physically separated from heat sources. A few centimeters of separation on a PCB can make several degrees of difference.

See [Thermal Considerations]({{< relref "/docs/design-development/pcb-layout-and-physical-integration/thermal-considerations" >}}) for the electrical side of thermal management.

## Vibration and Shock

Boards used in vehicles, industrial equipment, portable devices, or outdoor installations must survive mechanical stress — vibration, shock, and thermal cycling.

- **Heavy components need mechanical anchoring.** A large transformer or heatsink relying only on solder joints for mechanical support will fail under vibration. Bolts, clips, or adhesive backing provide mechanical support independent of the solder connection.
- **Strain relief on connectors.** Board-mount connectors subjected to cable forces need either mechanical anchoring to the board (through-hole solder pins, screw retention) or strain relief on the cable side.
- **Component orientation.** Tall, heavy components oriented with their long axis parallel to the expected vibration direction experience less bending stress than those oriented perpendicular to it.
- **Conformal coating.** For environments with moisture, dust, or salt spray, conformal coating protects the board. But conformal coating affects reworkability and must be kept off connectors, test points, and any socketed components — all of which requires keep-out zones in the layout.

## The Mechanical Drawing

The mechanical drawing is the formal interface between electrical and mechanical design. It specifies:

- Board outline with dimensioned mounting holes
- Keep-out zones (areas where no components or copper may be placed)
- Connector positions with tolerances
- Maximum component height by zone
- Panel cutout locations and dimensions
- Any required markings, labels, or indicators

In a one-person project, this "drawing" might be a sketch on graph paper. In a team environment, it's typically a formal document or a 3D model exchange (STEP file). Either way, it must exist. Without an agreed mechanical interface, the PCB and enclosure will be designed independently, and the first time they meet will be at assembly — the most expensive possible time to discover a mismatch.

## When to Involve Mechanical Design

The answer is: at the beginning. Not after the schematic is done. Not after layout starts. At the beginning.

Mechanical constraints shape the board outline, which constrains component placement, which affects routing, which influences the stackup. If the mechanical design isn't defined before layout begins, you're guessing — and those guesses tend to be wrong in ways that require expensive respins.

Even on personal projects where you're the only designer, sketching the enclosure and board relationship before starting layout saves rework. A 3D model, a cardboard mockup, or even a scale drawing on paper is enough to catch the most common mechanical mismatches: "the board doesn't fit," "the connector is in the wrong place," and "the capacitor hits the lid."

## Gotchas

- **3D models catch what 2D drawings miss.** Most EDA tools support 3D component models and board visualization. Use this feature — it's the fastest way to spot height conflicts and connector alignment issues before fabrication.
- **Mounting hardware has its own clearance.** A screw, washer, and nut take up space on both sides of the board. Don't place components inside the mounting hardware footprint.
- **Tolerance stackups add up fast.** If the board position tolerance is +/-0.5 mm and the connector position tolerance is +/-0.25 mm and the panel cutout tolerance is +/-0.5 mm, the worst-case misalignment is 1.25 mm. Design for the worst case.
- **Thermal expansion moves connectors.** A board that's 100 mm long expands about 0.14 mm over a 10C temperature rise (FR4 CTE ~14 ppm/C). For boards in environments with wide temperature swings, this movement can stress edge-mounted connectors.
- **"It fit in the CAD model" doesn't mean it fits in real life.** CAD models don't capture wire bend radii, cable harness stiffness, or the size of human fingers trying to plug in a connector. Always prototype the mechanical integration, not just the electronics.
