---
title: "Assembly Yield"
weight: 20
---

# Assembly Yield

Yield is the percentage of assembled units that pass testing — and it's never 100%. Even on a well-designed board with a competent assembler, some fraction of units will have defects. The goal isn't perfection; it's understanding what drives yield down and making design choices that push it up. For a personal project, yield might seem irrelevant — you're building one or two. But a single defective joint on a single board can consume hours of debugging, and the same design choices that improve yield at scale improve reliability at any quantity.

## Common Yield Killers

Most assembly defects fall into a few well-known categories. Understanding them helps you design around them:

- **Solder bridges.** Excess solder shorting adjacent pads. Most common on fine-pitch components (0.5 mm pitch QFP, 0.4 mm pitch BGA) and on pads with insufficient solder mask dams between them. Bridges can be caused by too much solder paste, pads that are too large, or mask registration errors that expose adjacent copper.
- **Tombstoned components.** A small passive component (0402, 0603) stands up on one end during reflow because one pad wets before the other. The surface tension of the molten solder pulls the component vertical. This is overwhelmingly a pad design issue — asymmetric copper connections to the pads (one pad connects to a large pour, the other doesn't) create uneven thermal profiles.
- **Missing components.** The pick-and-place machine failed to place a component, or the component fell off before reflow. Can be caused by insufficient solder paste (the component doesn't stick), machine feeder issues, or incorrect component orientation in the tape.
- **Reversed polarity.** Diodes, electrolytic capacitors, ICs placed backwards. This is partly a design issue (unclear polarity markings on the silkscreen) and partly an assembly issue (incorrect rotation in the pick-and-place data).
- **Cold or insufficient solder joints.** The joint formed but didn't fully wet, creating a weak mechanical and electrical connection that may work initially but fails under thermal cycling or vibration. Often caused by insufficient preheat in the reflow profile or contaminated pads.

## Design Choices That Improve Yield

Many yield problems can be designed out before the first board is ever assembled:

- **Use larger pads than the minimum.** IPC-7351 defines three density levels: most (largest pads), nominal, and least (smallest pads). Designing at the "most" level gives the assembly process more margin for placement accuracy and solder volume. Unless board space forces your hand, prefer larger pads.
- **Minimize fine-pitch components.** Every 0.5 mm pitch QFP or 0.4 mm pitch BGA on the board is a potential yield problem. If a 0.8 mm pitch QFP is available with the same functionality, it's almost always worth the extra board space for the improved assembly margin.
- **Balanced pad connections.** For small passive components, ensure both pads connect to copper features of similar thermal mass. If one pad connects to a ground plane and the other connects to a thin trace, add thermal relief to the ground pad or increase the trace width on the other side. Balanced thermal paths prevent tombstoning.
- **Clear polarity markings.** Every polarized component should have unambiguous silkscreen markings — and those markings should be visible after assembly, not hidden under the component. A cathode bar on a diode footprint, a pin-1 dot on an IC, a "+" mark on a capacitor. These help both automated and manual inspection.
- **Consistent component orientation.** Aligning all passives in the same direction and all ICs with pin 1 in the same corner makes visual inspection faster and more reliable. It's not always possible, but it's worth the effort where layout permits.

## Solder Paste Stencil Design

The solder paste stencil determines how much solder is deposited on each pad, and getting it right is critical for yield. The stencil aperture (the opening corresponding to each pad) isn't always the same size as the pad itself.

- **Aperture reduction.** For most pads, the stencil aperture is the same size as the pad or slightly reduced (5-10%). This prevents excess solder that could cause bridging.
- **QFN thermal pads.** The exposed pad on the bottom of QFN packages needs significant aperture reduction — typically a grid of smaller openings that deposit about 50-70% of the pad area in solder paste. Too much paste under a QFN causes the part to float during reflow, tilting it and creating open joints on the perimeter pads. Too little paste creates voids that increase thermal resistance.
- **Fine-pitch components.** Pads for 0.5 mm pitch parts may need aperture reduction to prevent bridging, or they may need a thinner stencil in that area (stepped stencil), which adds cost.
- **Stencil thickness.** Standard stencils are 4-5 mil (0.1-0.125 mm) thick. Thinner stencils deposit less paste, reducing bridging but risking insufficient solder on larger pads. If your board has both large thermal pads and fine-pitch ICs, a compromise thickness or a stepped stencil may be necessary.

## Reflow Profile

The reflow profile — the temperature-versus-time curve the board follows through the oven — must satisfy the requirements of every component on the board simultaneously. This is straightforward when all components use the same solder alloy and have similar thermal mass, and challenging when they don't.

Lead-free solder (SAC305) reflows at around 235-245C peak, and most components are rated for 260C peak for a limited duration. The profile must reach reflow temperature everywhere on the board — including under large thermal masses that heat slowly — without exceeding the maximum temperature anywhere, including on small components that heat quickly.

Large boards with varying thermal mass require careful profiling. A thermocouple placed on the board during a test reflow measures the actual temperature experienced by different areas, and the profile is adjusted until all areas reach the target window. This is the assembler's responsibility, but a design with dramatically different thermal masses on the same board makes their job harder and may compromise yield.

## Inspection Methods

After assembly, boards must be inspected to catch defects before they ship or, in the case of a personal project, before you spend hours debugging a hardware fault that's actually just a bad solder joint.

- **Visual inspection.** The first line of defense. A magnifying lamp or stereo microscope reveals solder bridges, tombstones, and missing components. Effective for large components but insufficient for fine-pitch or hidden joints.
- **AOI (Automated Optical Inspection).** A machine that photographs each board from multiple angles and compares the images to a known-good reference. Catches placement errors, bridges, tombstones, and polarity reversals with high throughput. Standard in production assembly but not typically available for prototypes.
- **X-ray inspection.** Necessary for BGA and QFN packages where solder joints are hidden beneath the component. X-ray reveals voids, bridges, and incomplete joints that are invisible to optical inspection. Essential for validating BGA assembly; expensive and typically available only at the assembler or a specialized inspection house.

## Rework Procedures

When defects are found, rework is the process of fixing them without damaging the board or adjacent components. Good rework depends on design choices made months earlier:

- **Accessible pads.** Components that can be reached with a soldering iron or hot-air tool are reworkable. Components buried between tall neighbors or under shielding cans are not.
- **Solder mask between pads.** Prevents solder from flowing to adjacent pads during rework, containing the repair.
- **Rework-friendly packages.** Through-hole and large SMD components (0805 and up) are straightforward to rework. Fine-pitch QFP requires skill and a hot-air station. BGA requires specialized rework equipment and stencils.

Design for the assumption that rework will be needed, because it will be.

## First-Article Inspection

The first assembled unit should be inspected more thoroughly than any subsequent unit. First-article inspection (FAI) verifies that the assembly process is set up correctly — right components, right orientation, right solder quality — before the rest of the run proceeds.

For a prototype, this means carefully checking the first board before powering it up. Verify every IC orientation. Check polarized components. Look for bridges under a microscope. Measure resistance between power and ground (it should not be a short). This disciplined first check catches setup errors that would otherwise propagate through every unit in the batch.

## Gotchas

- **Tombstoning is a design problem, not an assembly problem.** If passives are tombstoning, look at your pad geometry and copper balance, not at the assembler's process. Asymmetric thermal connections to pads are the root cause in most cases.
- **Yield improves with quantity — to a point.** The first few boards of a run have higher defect rates as the process stabilizes. Don't judge yield by the first unit off the line.
- **QFN packages are deceptively difficult.** They look simple — a flat package with pads on the bottom. But the hidden thermal pad, the invisible solder joints, and the precise paste volume requirements make them one of the highest-defect-rate package types. Design the stencil apertures carefully.
- **Inspection can't find every defect.** A visually perfect solder joint can still be electrically marginal. Functional testing after inspection catches defects that visual and optical methods miss.
- **Rework degrades the board.** Every rework cycle exposes the board to additional thermal stress, potentially damaging pads, traces, and adjacent components. Design to minimize the need for rework, not to make rework easy as a primary strategy.
