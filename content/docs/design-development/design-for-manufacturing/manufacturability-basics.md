---
title: "Manufacturability Basics"
weight: 10
---

# Manufacturability Basics

Designing for manufacturing means removing obstacles between your design files and a finished, working board. A circuit that functions perfectly in simulation can be unbuildable if traces are too narrow for the fab process, components are too close together for the assembly equipment, or the data package is incomplete. DFM isn't a separate phase tacked onto the end of design — it's a set of constraints that should inform decisions from the very first schematic sheet.

## PCB Fabrication DFM

Every PCB fabrication house has design rules — minimum trace widths, minimum spacing between conductors, minimum drill sizes, minimum annular rings. These aren't suggestions. They're the physical limits of the manufacturing process, and violating them means your board either can't be built or will be built unreliably.

The critical fab parameters to check:

- **Minimum trace width and spacing.** Standard two-layer boards from budget fabs typically support 6 mil (0.15 mm) trace and space. Four-layer boards and higher-end fabs may go down to 4 mil or even 3.5 mil, but every step smaller reduces yield and increases cost. Design at the widest traces your routing allows — there's no prize for using the minimum everywhere.
- **Minimum drill size.** Standard mechanical drills bottom out around 0.2 mm (8 mil). Smaller holes require laser drilling, which costs more and is typically only available on higher-layer-count processes. Via sizes should be chosen with the drill capability in mind.
- **Annular ring.** The copper pad surrounding a drilled hole must be wide enough to ensure a reliable connection even with registration tolerance. IPC standards define minimum annular rings, but your fab's specific capability determines the practical limit. A 5 mil annular ring is typical for standard processes.
- **Board edge clearance.** Components and copper too close to the board edge risk being damaged during depanelization. Most fabs require 10-15 mil clearance from the board outline to any copper feature.
- **Copper-to-edge distance.** If you need copper extending to the edge (for edge connectors, for instance), this requires special handling — typically a plated edge or castellated vias, both of which need to be communicated to the fab.

These constraints vary between manufacturers and between their process tiers. A board designed for one fab's premium process may violate another fab's standard rules. Always download and import your specific fab's design rules into your EDA tool before starting layout.

## Assembly DFM

Fabrication gets you a bare board. Assembly gets components onto it. Assembly DFM is about ensuring that components can be placed accurately and soldered reliably, whether by hand, by pick-and-place machine, or by a combination of both.

Key assembly DFM considerations:

- **Component spacing.** Parts placed too close together create problems for both automated placement (nozzle clearance) and manual rework (iron access). IPC-7351 provides courtyard dimensions that include the minimum space needed around each component. Violating courtyards means overlapping components or insufficient clearance for solder fillets.
- **Thermal relief pads.** Large copper pours connected directly to component pads act as heat sinks, making soldering difficult. Thermal relief patterns (spoke connections) allow solder to wet properly while still providing the electrical connection. This matters especially for through-hole components on ground planes.
- **Solder mask dams.** The solder mask between adjacent pads prevents solder bridges. If pads are too close, the fab can't maintain the mask dam, and solder paste from adjacent pads merges during reflow. Minimum dam width depends on the fab's solder mask registration capability — typically 3-4 mil.
- **Fiducials.** Pick-and-place machines need reference marks to align the board. Global fiducials (two or three per board) establish overall alignment. Local fiducials near fine-pitch components (QFP, BGA) provide additional accuracy where it's needed most. If you're building more than a handful of boards, add fiducials — they're free copper dots that save enormous assembly headaches.

## Common DFM Violations

Some mistakes show up repeatedly in designs headed for their first fabrication run:

- **Traces too close to board edges.** Routing traces right up to the board outline, where they'll be damaged by the routing bit during depanelization.
- **Vias in pads without specification for fill.** A via placed in a component pad will wick solder away from the joint during reflow, creating a void or a dry joint. Via-in-pad is a valid technique, but only when the vias are filled and planarized — which costs extra and must be specified.
- **Components too close for rework.** Placing a 0402 capacitor right next to a QFP lead means you can't rework either one without disturbing the other. Design for the possibility of rework, not just initial assembly.
- **Acid traps.** Acute-angle copper features where etchant can pool, under-etching the copper. Most modern fabs handle this, but it's still flagged in DFM checks and worth avoiding.

## The DFM Check

Most PCB fabrication houses offer a free DFM review. After you upload your design files, their engineering team checks for violations against their specific process capabilities and sends back a report highlighting problems. Use this service every time. It costs nothing and catches issues that your EDA tool's DRC might miss because your design rules don't perfectly match the fab's actual capabilities.

Some designers skip this step to save a day or two. The result is often a week of delay when the fab rejects the design or, worse, builds it with marginal features that fail intermittently.

## Standards Worth Knowing

You don't need to memorize IPC standards, but knowing they exist and where to look is valuable:

- **IPC-2221** — Generic standard for printed board design, covering trace widths, spacing, and materials.
- **IPC-A-610** — Acceptability of electronic assemblies. Defines what a good solder joint looks like, what constitutes a defect, and the classification levels (Class 1 consumer, Class 2 dedicated service, Class 3 high reliability).
- **IPC-7351** — Land pattern standards for surface-mount components. Defines the pad geometries that produce reliable solder joints.

Even for hobby work, understanding the IPC-A-610 criteria for acceptable solder joints improves your ability to inspect your own work.

## Panelization

If you're building more than a few boards, panelization — arranging multiple copies of the board on a single larger panel — reduces cost and simplifies handling. The panel moves through the fab and assembly process as one piece, then individual boards are separated afterward.

Common separation methods:

- **V-score.** A V-shaped groove cut partially through the panel, allowing boards to be snapped apart. Produces clean edges but requires straight separation lines across the full panel width.
- **Tab routing.** The boards are routed out of the panel with small tabs holding them in place. Tabs are broken or cut after assembly. Allows irregular board shapes but leaves small nubs on the board edge.
- **Mouse bites.** A row of small drilled holes forming a perforated line within a tab. The tab breaks along the perforation, leaving a slightly rough edge that can be filed smooth.

Your fab house can usually design the panel for you if you specify the method and provide board dimensions, but understanding the options helps you design boards with appropriate edge features.

## Clean Design Files

The manufacturing data package is the complete set of files needed to build and assemble your board. An incomplete package causes delays, questions, and errors. At minimum:

- **Gerber files** — One file per copper layer, solder mask layer, silkscreen layer, and board outline. Use RS-274X (extended Gerber) or, increasingly, ODB++ or IPC-2581 for a single-file package.
- **Drill files** — Excellon format, specifying hole locations, sizes, and whether they're plated or non-plated.
- **Pick-and-place data** — Component reference designators, X/Y coordinates, rotation, and the board side (top or bottom). Needed for automated assembly.
- **Bill of materials** — Every component with manufacturer part number, value, package, reference designator, and quantity. This is the authoritative list of what goes on the board.
- **Assembly drawing** — A visual reference showing component placement, orientation indicators, and any special assembly notes.

Generate these files fresh from your final design — don't reuse files from an earlier revision. Every file in the package must correspond to the same design state. A mismatch between the gerbers and the BOM is one of the most common causes of assembly errors, and it's entirely preventable.

## Gotchas

- **Your EDA tool's defaults aren't DFM-safe.** Default trace widths, via sizes, and clearances are often set for ease of routing, not manufacturing robustness. Import your fab's design rules and use them from the start.
- **DFM review is not the same as DRC.** Design Rule Check in your EDA tool verifies your rules. DFM review at the fab verifies their process. Both are necessary, and they catch different things.
- **Hand assembly has different DFM constraints.** If you're hand-soldering, the considerations shift: you need iron access, visible joints, and components large enough to handle. A design optimized for machine assembly can be miserable to hand-build.
- **The cheapest board isn't always the cheapest project.** Pushing trace widths to the minimum to fit a two-layer board might save $5 on fabrication but cost hours in assembly rework due to bridging.
- **Panelization affects component placement.** Components near panel edges or tabs may be damaged during separation. Keep sensitive parts and connectors away from breakaway features.
