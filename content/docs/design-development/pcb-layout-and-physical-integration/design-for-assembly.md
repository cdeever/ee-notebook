---
title: "Design-for-Assembly Awareness"
weight: 60
---

# Design-for-Assembly Awareness

A design that works perfectly in simulation and looks clean in the layout tool can still fail if it can't be built reliably. Design-for-assembly (DFA) is the practice of making layout decisions that simplify and improve the manufacturing process — whether that's hand soldering one prototype at your bench or running a thousand boards through a pick-and-place line. The board has to be buildable, and the decisions that make it buildable happen during layout.

## Component Orientation

Consistent component orientation seems like a cosmetic concern, but it has real practical value:

- **Align all polarized components the same way.** All diodes with cathode pointing the same direction, all electrolytic capacitors with positive terminal on the same side, all ICs with pin 1 in the same corner. This makes visual inspection dramatically faster — any component that's "facing the wrong way" is immediately suspicious.
- **Align passive components with the reflow direction.** During reflow soldering, boards travel through the oven in one direction. Passive components oriented parallel to the travel direction experience more even heating on both pads, which reduces tombstoning (one end lifting off the pad during reflow).
- **Use consistent silkscreen markings.** Polarity marks, pin 1 indicators, and reference designators should be legible and not obscured by the component body. If the silkscreen is hidden under the component, put it next to the component where it's visible after assembly.

These seem like small things, but on a board with 200 components, consistent orientation is the difference between a 5-minute visual inspection and a 30-minute puzzle.

## Fiducials

Fiducials are small copper marks (typically 1 mm diameter, with a 2 mm clearance from surrounding copper) that pick-and-place machines use to establish the board's position and orientation. Without fiducials, the machine can't align itself to the board accurately.

- **Global fiducials:** At least two (preferably three) fiducials placed asymmetrically on the board. These establish the board's overall position and rotation. Three fiducials placed in an L-pattern (not in a line) give the best correction for both translation and rotation.
- **Local fiducials:** For fine-pitch components (QFP with 0.5 mm pitch, BGA, etc.), a pair of fiducials placed near the component allows the machine to correct for local board stretch or rotation. The fiducials should be diagonally opposite to the component.
- **Panel fiducials:** If the board is panelized, the panel itself needs fiducials in addition to any per-board fiducials.

For hand-assembled prototypes, fiducials don't matter. But if there's any chance the design will be machine-assembled — now or in the future — adding fiducials costs nothing and saves a redesign later.

## Panelization

Most PCB assembly houses prefer to work with panels — multiple copies of a board arranged on a larger panel with shared rails. Panelization is the process of creating this panel layout, and it affects design:

- **Rail width:** The panel rails (borders around the group of boards) must be wide enough for the assembly machine's clamps — typically 5-10 mm on at least two sides.
- **Break-away tabs:** V-score lines or mouse-bite perforations define where individual boards separate from the panel. These features must not pass through sensitive areas of the board — a V-score line creates a stress concentration that can crack nearby solder joints.
- **Tab placement:** Tabs should be placed on edges without close-to-edge components. A tab remnant (the rough edge left after separation) must not interfere with the enclosure fit or connector access.
- **Tooling holes:** The panel needs tooling holes for the assembly machine's registration pins. These are in the rails, not on the board itself.

If you're ordering from a turnkey assembly service (like JLCPCB or PCBWay), they typically handle panelization for you. But it's worth understanding the constraints so you don't design a board outline that's difficult to panelize — very small boards, irregular shapes, or boards with components too close to the edge all cause panelization headaches.

## Tombstoning

Tombstoning is when one end of a small passive component (typically 0402 or 0603) lifts off its pad during reflow, standing the component up on one end like a tombstone. It happens because the solder on one pad melts and surface-tension-pulls the component before the solder on the other pad melts.

Layout practices that reduce tombstoning:

- **Equal pad sizes and thermal relief.** If one pad is connected to a large copper pour and the other isn't, the pour acts as a heat sink that delays solder melting on that pad. Use thermal relief (spoke connections rather than solid connections) on pads connected to planes.
- **Equal trace widths entering both pads.** Asymmetric trace connections create asymmetric thermal paths.
- **Orientation relative to reflow direction.** Components oriented so that both pads enter the hot zone simultaneously (perpendicular to travel direction in some ovens) experience more symmetric heating.
- **Solder paste volume balance.** The stencil apertures for both pads should deposit the same volume of solder paste. Asymmetric paste causes asymmetric surface tension forces.

Tombstoning is mainly a concern for very small components (0402 and below) and for components with pads that have very different thermal connections. For 0805 and larger parts, it's rarely an issue.

## Solder Paste Considerations

The solder paste stencil is the interface between the layout and the assembly process. Layout decisions directly affect solder paste performance:

- **Pad size and shape:** Pads should match the component manufacturer's recommended footprint. Oversized pads waste paste and can cause bridges between pins. Undersized pads don't provide enough solder for a reliable joint.
- **Stencil thickness:** Standard stencil thickness is 0.12-0.15 mm (5-6 mils). Thick stencils deposit more paste, which is good for large pads but causes bridging on fine-pitch components. Some designs need step stencils — different thickness in different areas — but these are expensive.
- **Aperture design:** For fine-pitch components, the stencil aperture may be smaller than the pad (aperture ratio reduction) to prevent excess paste. The layout designer should provide recommended stencil apertures in the fabrication notes if non-standard.
- **Paste-in-hole (pin-in-paste):** Some through-hole components can be reflowed by printing paste into the hole and inserting the component before reflow. This eliminates a wave-soldering step but requires specific pad and hole designs.

## Hand Assembly vs Machine Assembly

The design rules differ between hand and machine assembly, and it's worth knowing which you're targeting:

**Hand assembly** is more forgiving in some ways and less in others:

- Minimum component spacing can be tighter in some areas (a skilled solderer can work between close components) but needs to be wider where the soldering iron needs access.
- Fine-pitch QFP (0.5 mm pitch) is manageable by hand with flux, solder, and a magnifying glass. QFN is much harder — the pads are under the component and can't be soldered with an iron.
- BGA is essentially impossible by hand without specialized equipment.
- Through-hole components are easy by hand, hard by machine (requires wave soldering or selective soldering in addition to reflow).

**Machine assembly** needs:

- Consistent component orientation for the pick-and-place feeder setup.
- Fiducials for alignment.
- Adequate spacing between components for the placement nozzle (typically 0.5 mm minimum between bodies for standard machines).
- Components available on tape-and-reel or in trays (tubes and loose parts are harder to feed).

If you're prototyping by hand but plan to move to machine assembly for production, design for machine assembly from the start. Hand-assembling a machine-optimized layout is straightforward. Retooling a hand-optimized layout for machine assembly often requires a board respin.

## Minimum Component Spacing

Spacing between components serves multiple purposes:

- **Assembly clearance:** Pick-and-place nozzles and soldering irons need physical space to reach each component.
- **Rework access:** If a component needs to be replaced, there must be room for a hot-air nozzle or soldering iron without disturbing adjacent parts.
- **Inspection:** Visual and automated optical inspection (AOI) need clear sightlines to solder joints. Components shadowed by taller neighbors are harder to inspect.
- **Thermal isolation:** Components that shouldn't thermally interact need separation. See [Thermal Considerations]({{< relref "/docs/design-development/pcb-layout-and-physical-integration/thermal-considerations" >}}).

A practical minimum for machine assembly is 0.5 mm between component bodies for passives and 1 mm for ICs. For hand assembly, allow 1-2 mm around components that will be soldered with an iron. Tall components need extra clearance — a 10 mm tall electrolytic capacitor next to a QFP makes rework on the QFP nearly impossible.

## Links to Manufacturing

DFA is one half of the manufacturability equation. The other half — design-for-manufacturing (DFM) — covers the PCB fabrication constraints: minimum trace widths, drill sizes, copper-to-edge clearances, and solder mask registration. See the [Design for Manufacturing]({{< relref "/docs/design-development/design-for-manufacturing" >}}) section for those topics. Both DFA and DFM must be satisfied for a board to be buildable at the intended volume and quality level.

## Gotchas

- **0402 and smaller components are not hand-solderable for most people.** If your prototype will be hand-assembled, think twice before using 0402 passives. 0603 is the practical minimum for hand soldering, and 0805 is far more comfortable.
- **QFN packages need solder paste and reflow.** You can't reliably solder a QFN with just an iron because the thermal pad is hidden underneath. If your prototype process doesn't include reflow (oven, hot plate, or hot air), avoid QFN packages or accept a higher risk of poor connections.
- **Fiducials forgotten on rev 1 are always needed on rev 2.** Adding fiducials to a finished layout is easy. Adding them to a finished and routed layout that's already out of board space is hard. Include them from the start.
- **Silkscreen under components is useless.** Reference designators placed under component bodies are invisible after assembly. Place text next to the component, not under it.
- **Panel break-away tabs leave rough edges.** The mouse-bite remnants along the board edge where it separated from the panel can interfere with enclosure fit. Account for this in mechanical tolerances, and specify which edges will have tabs in the panelization drawing.
- **Mixed assembly (SMD + through-hole) adds process steps.** Every through-hole component on an otherwise SMD board adds a hand-soldering or wave-soldering step. Minimizing through-hole parts simplifies assembly significantly.
