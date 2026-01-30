---
title: "Assembly Options"
weight: 20
---

# Assembly Options

Having a bare PCB and a bag of components is only half the job — you still need to get the components onto the board with reliable solder joints. The assembly method you choose depends on the component mix (through-hole, SMD, fine-pitch), the quantity (one board or fifty), your available equipment, and your turnaround requirements. Choosing the wrong assembly method leads to either unreliable connections or wasted time.

## Hand Soldering

Hand soldering with an iron is the most accessible assembly method. It's what most people learn first, and it's entirely adequate for a wide range of prototype work.

**What hand soldering handles well:**
- Through-hole components of any size
- SMD passives down to 0603 (0805 is comfortable; 0402 is possible but taxing)
- SMD ICs in SOIC, SSOP, and TQFP packages (with flux and fine solder or solder wick for bridging)
- Connectors, switches, and mechanical components

**What hand soldering struggles with:**
- QFN packages — the thermal pad is underneath the component and can't be reached by an iron
- BGA packages — solder balls under the component are completely inaccessible
- 0201 and smaller passives — too small to see, place, or solder reliably without magnification and specialized tools
- Large quantities — hand soldering one board is fine; hand soldering twenty identical boards is soul-crushing and error-prone

For hand soldering, good equipment matters more than technique: a temperature-controlled station (not a cheap fixed-temperature iron), fine-point tips (conical or chisel), good flux (liquid flux pen or flux paste), and thin solder wire (0.5 mm or 0.3 mm for fine-pitch work). Proper magnification — a stereo microscope or at minimum a headband magnifier — transforms the experience once you move below 0805 parts.

## Hot Air Rework

A hot air rework station blows temperature-controlled air through a nozzle to heat components from above. It's the second essential tool for prototype assembly, especially for components that hand soldering can't reach.

**Primary uses:**
- QFN soldering: apply solder paste to the pads, place the component, and reflow with hot air. The thermal pad underneath gets soldered through the heat conducted through the package.
- Removing components for rework: hot air heats all the joints simultaneously, allowing the component to be lifted off.
- Small-batch SMD assembly: with solder paste on the pads and components placed manually, hot air can reflow one component at a time.

**Tips for hot air work:**
- Use the largest nozzle that fits over the target component. Larger nozzles provide more even heating.
- Protect nearby components with Kapton tape or aluminum foil if they're heat-sensitive.
- Don't rush. Give the board time to preheat gradually — thermal shock cracks ceramic capacitors.
- Watch the solder, not the timer. Solder paste changes from gray and matte to shiny and liquid at the moment of reflow. That's when the component self-aligns and you know it's done.

## Reflow Oven (or Skillet)

For boards with many SMD components, reflowing the entire board at once is far more efficient and reliable than soldering components individually.

**The process:**
1. Apply solder paste to all SMD pads using a stencil.
2. Place all components onto the paste (manually or with a pick-and-place machine).
3. Run the board through a temperature profile that preheats, reflows, and cools the solder.

**Equipment options:**
- **Purpose-built reflow ovens** (desktop models from $200-$2000) offer controlled temperature profiles with top and bottom heating. These are the most reliable option.
- **Modified toaster ovens** with aftermarket controllers work surprisingly well for prototyping. The key is a controller that can follow a proper reflow profile (preheat → soak → reflow → cooling).
- **Hot plates and skillets** provide bottom-only heating, which works for single-sided boards. Less even than an oven, but adequate for prototyping.
- **Hot air** can reflow an entire small board if you work slowly and heat the whole board area.

The stencil is critical. A well-cut stainless steel stencil (available from the same companies that make PCBs — often for $5-$15 with a board order) deposits precise solder paste volumes on each pad. Without a stencil, you're either dispensing paste from a syringe (slow and inconsistent) or spreading it by hand (very inconsistent).

## Pick-and-Place Services

For more than a handful of boards, or for boards with components you can't solder yourself (fine-pitch BGA, 0201 passives, large QFN arrays), outsourcing assembly to a PCB assembly house is often the best option.

**Common services:**
- **JLCPCB** — Low-cost assembly from their parts inventory. Fast turnaround, limited component selection (their in-stock parts only, though extended libraries are improving). Best for designs using common jellybean parts.
- **PCBWay** — Broader component sourcing options, including customer-supplied parts. More flexibility but higher cost and longer turnaround.
- **MacroFab, Tempo Automation, Advanced Assembly** — North American services with faster turnaround, better communication, and higher prices. Better for complex or time-critical builds.
- **Local assembly houses** — Worth finding if you need fast iteration. Being able to drive to the factory, review the first board, and make adjustments is invaluable.

**What you'll need to provide:**
- Gerber files (or the native EDA files)
- Bill of materials (BOM) with manufacturer part numbers, quantities, and reference designators
- Centroid file (also called pick-and-place file or XY data): the X, Y position and rotation of every component
- Assembly drawing showing which side each component goes on and any special instructions

Most EDA tools generate these files automatically, but verify them before submitting. A wrong rotation in the centroid file puts every instance of that component on backwards.

## Stencils

The solder paste stencil bridges the gap between the PCB and the assembly process:

- **Laser-cut stainless steel stencils** are the standard. They're thin (0.1-0.15 mm), precise, and reusable for hundreds of boards. Order them with your PCBs — most fabricators offer them as an add-on.
- **Kapton (polyimide) stencils** can be cut with a laser cutter or craft cutter. They're cheaper but less precise and wear out faster. Adequate for prototyping.
- **Hand-cut stencils** are possible for large-pad designs but impractical for fine-pitch work.
- **Frameless vs framed:** Frameless stencils are cheaper and easier to store. Framed stencils align better in a stencil printer. For hand-use, frameless with tape-hinge alignment is the common prototype approach.

Using a stencil well takes practice. The key variables are: squeegee pressure (firm and consistent), squeegee angle (about 45 degrees), paste viscosity (should be smooth, not dried out), and alignment (check that paste lands on the pads, not beside them).

## Mixed Assembly

Most real boards use mixed assembly: SMD components reflowed with paste, then through-hole components soldered by hand or by wave/selective soldering.

**Typical mixed assembly flow:**
1. Print solder paste (stencil), place SMD components, reflow.
2. Hand-solder through-hole components (connectors, large capacitors, transformers).
3. Inspect and touch up.

This is why through-hole components on an otherwise SMD board add process complexity — they require a separate manual step. If you can find SMD equivalents for through-hole parts, the assembly is cleaner. But some components (large connectors, high-current inductors, some electrolytic capacitors) are only available or practical in through-hole form.

## Cost and Turnaround Tradeoffs

The assembly method is a business decision as much as a technical one:

| Method | Best for | Typical turnaround | Typical cost (per board) |
|--------|----------|-------------------|-------------------------|
| Hand soldering | 1-3 boards, simple designs | Hours (same day) | Your time + components |
| Hot air + paste | 1-5 boards, some fine-pitch | Hours to a day | Your time + components + stencil |
| Reflow oven | 1-10 boards, many SMD parts | Hours to a day | Your time + components + stencil |
| Assembly service | 5+ boards, or complex components | 3-14 days | $50-$500+ setup + per-board cost |

For a single prototype, hand assembly is almost always faster in wall-clock time, even if it takes longer to solder. For 10+ identical boards, an assembly service is almost always faster and more reliable. The crossover point is somewhere around 3-5 boards for most designs.

## Gotchas

- **Solder paste expires.** Solder paste has a shelf life (typically 6 months refrigerated) and must be stored properly. Old paste causes poor wetting, solder balls, and unreliable joints. Check the date.
- **Reflow profiles matter.** Too fast and you get tombstoning and solder balls. Too hot and you damage components. Too slow and you get poor wetting. Follow the solder paste manufacturer's recommended profile.
- **Assembly services have component constraints.** JLCPCB's "basic" parts list is limited. If your design uses parts not in their inventory, you'll pay extra for "extended" parts or need to supply components yourself, which adds time and cost.
- **First-article inspection saves money.** When using an assembly service for the first time, request a first-article inspection — they build and photograph one board before assembling the full batch. Catching a rotated IC on one board is cheaper than finding it on fifty.
- **ESD precautions apply during hand assembly.** An ESD wrist strap and grounded mat cost $20. Replacing a static-damaged IC on a finished board costs hours. Use ESD protection, especially when handling CMOS devices and sensitive analog parts.
- **Clean the flux.** Flux residue is conductive when wet and can be corrosive over time. For any board that needs to be reliable, clean the flux after soldering — isopropyl alcohol and a brush are adequate for most no-clean fluxes, despite the name.
