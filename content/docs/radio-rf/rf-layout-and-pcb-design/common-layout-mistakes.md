---
title: "Common Layout Mistakes That Kill RF Performance"
weight: 80
---

# Common Layout Mistakes That Kill RF Performance

Most RF layout failures are not exotic or subtle — they are well-known mistakes that keep being repeated. The gap between knowing the rules and consistently applying them is where boards fail. Each mistake below creates measurable degradation on a network analyzer or spectrum analyzer, and each one has been responsible for failed prototypes, respins, and schedule delays in real projects.

## Slot in Ground Plane Under RF Trace

**The mistake:** A power trace, signal trace, or component cutout creates a gap in the ground plane directly beneath an RF signal trace.

**Why it kills performance:** The return current for an RF signal flows in the ground plane directly beneath the trace. A slot forces the return current to detour around the gap, creating a large loop area. This loop radiates, couples to other circuits, and creates an impedance discontinuity. A slot under a 2.4 GHz trace can increase radiated emissions by 15-20 dB and shift the trace impedance enough to create visible reflections.

**The fix:** Treat the ground plane layer beneath RF traces as sacred. Never route other signals on that layer in the RF area. If a power trace must cross an RF area, route it on a different layer. Use a design rule check (DRC) that flags any ground plane break under RF traces.

## Signal Via Without Adjacent Ground Vias

**The mistake:** An RF trace transitions between layers through a signal via with no ground vias nearby.

**Why it kills performance:** The return current must also change layers, but without a nearby ground via, it must find a distant via to complete the transition. This creates a large current loop, impedance discontinuity, and radiation. On a TDR measurement, the signal via appears as an impedance spike.

**The fix:** Always place at least two ground vias immediately adjacent to the signal via (within 0.5 mm), on opposite sides. For frequencies above 5 GHz, use three or four ground vias. See [Via Placement & Stitching]({{< relref "/docs/radio-rf/rf-layout-and-pcb-design/via-placement-and-stitching" >}}) for details.

## Decoupling Cap Too Far from Pin

**The mistake:** A bypass capacitor is placed "near" the IC but connected through several millimeters of trace and a via that is not at the capacitor pad.

**Why it kills performance:** Every millimeter of trace between the IC power pin and the bypass capacitor adds roughly 0.7-1.0 nH of inductance. A 5 mm trace adds about 4 nH. At 1 GHz, 4 nH has 25 ohms of impedance — the bypass capacitor is effectively disconnected at RF. The long return path through the via further increases the loop inductance.

**The fix:** Place the bypass capacitor pad within 1-2 mm of the IC power pin. Put the ground via directly at the capacitor ground pad, not at the end of a trace. For multi-GHz ICs, follow the vendor's recommended layout exactly. See [Decoupling at RF]({{< relref "/docs/radio-rf/rf-layout-and-pcb-design/decoupling-at-rf" >}}) for strategy.

## Uncontrolled Impedance on RF Traces

**The mistake:** RF traces are routed at the default trace width without calculating the impedance for the actual stackup. The trace might be 6 mil (standard digital width) when 50 ohms requires 18 mil on that stackup.

**Why it kills performance:** A trace that should be 50 ohms but is actually 90 ohms creates a return loss of about 8 dB at every point along its length. Signals reflect, gain drops, and matching networks designed for 50 ohms no longer work. A narrow trace also has higher resistive loss, degrading noise figure in receive paths.

**The fix:** Calculate the 50-ohm trace width for your specific stackup using an impedance calculator. Apply this width to all RF traces. Specify controlled impedance to the PCB fabricator. See [Controlled Impedance Traces]({{< relref "/docs/radio-rf/rf-layout-and-pcb-design/controlled-impedance-traces" >}}).

## Sharp 90-Degree Bends

**The mistake:** RF traces make 90-degree turns, creating a corner with excess copper area.

**Why it kills performance:** The outer corner of a 90-degree bend has extra copper that acts as a parasitic capacitance. At lower GHz frequencies, the effect is modest — about 0.1-0.5 dB of additional reflection for a single bend. But multiple bends accumulate, and at frequencies above 5 GHz, the discontinuity becomes significant. The excess capacitance lowers the local impedance, creating a reflection.

**The fix:** Use chamfered (mitered) bends or smooth arcs. A chamfered bend removes the outer corner at 45 degrees. A curved bend with a radius of at least 3x the trace width maintains impedance well. For traces below 2 GHz, chamfers are sufficient. Above 5 GHz, curved bends are preferred.

## Insufficient Clearance Between RF and Digital Traces

**The mistake:** RF signal traces run within 1-2 trace widths of high-speed digital signals, clock lines, or switching regulator traces.

**Why it kills performance:** Capacitive and inductive coupling between traces creates crosstalk. A digital clock with fast edges (1 ns rise time) has harmonic energy extending to hundreds of MHz or GHz. If those harmonics fall in the RF band of interest, they appear as in-band interference. Coupling of -40 dB from a +3.3V digital signal puts the coupled energy at about -27 dBm — far above the noise floor of most receivers.

**The fix:** Maintain at least 3x the trace width (preferably 5x or more) between RF traces and any noisy digital signal. Better yet, route RF traces on a different layer from digital, with a solid ground plane between them. Use ground guard traces with stitching vias between RF and digital sections.

## Missing Ground Stitching

**The mistake:** The board has multiple ground plane layers but no stitching vias connecting them, or stitching vias are sparse and only at the board edges.

**Why it kills performance:** Unstitched ground planes form a parallel-plate resonator. At the resonant frequency (determined by the plane dimensions and dielectric), the ground impedance spikes. This creates hot spots where ground is no longer low-impedance, causing decoupling failures, radiation, and coupling between circuits. For a typical 50 x 50 mm ground plane pair in FR4, the first resonance is around 2 GHz.

**The fix:** Place ground stitching vias in a regular grid across the entire board, with spacing based on the highest frequency of concern (lambda/20). For 2.4 GHz designs, stitch every 3 mm. For 5.8 GHz, stitch every 1.2 mm. Pay extra attention to stitching around the perimeter and between RF sections.

## Assuming Simulation Captures Layout Effects

**The mistake:** A schematic-level simulation (SPICE, harmonic balance) shows the circuit meeting specifications, and the designer assumes the board will perform similarly without verifying layout parasitics.

**Why it kills performance:** Schematic simulation uses ideal connections between components. It does not include trace impedance mismatches, via inductance, ground plane resonances, coupling between traces, or radiation. At RF, these effects can dominate. A filter that simulates with -40 dB rejection might deliver only -20 dB if parasitic coupling bypasses the filter through the layout.

**The fix:** For critical RF blocks (filters, matching networks, amplifier stages), perform post-layout simulation that includes extracted parasitics. For high-frequency designs (above 2-3 GHz), use EM simulation on critical structures. At minimum, compare the layout to known-good reference designs (evaluation boards) and flag any deviations.

## How to Catch These Mistakes

A systematic layout review checklist prevents most of these errors:

1. Verify ground plane continuity under all RF traces — no slots, splits, or routing on the ground layer
2. Check every signal layer transition for adjacent ground vias
3. Verify bypass capacitor placement distance to IC pins
4. Confirm RF trace widths match the controlled impedance specification for the stackup
5. Check for 90-degree bends in RF traces
6. Verify clearance between RF and digital/power traces
7. Check ground stitching via spacing and coverage
8. Compare the layout to the IC vendor's evaluation board layout

## Gotchas

- **DRC does not catch RF layout mistakes** — Standard design rule checks verify electrical connectivity and spacing, not electromagnetic performance. You need a separate RF layout review process.
- **Evaluation board layouts are optimized — your rearrangement is not** — IC vendors iterate their eval board layouts with VNA measurements. Rearranging components to save space or look cleaner usually degrades performance.
- **Multiple small mistakes accumulate** — Any single mistake might only cost 1-2 dB. But five mistakes on one signal path cost 5-10 dB, which can be the difference between a working design and a failed one.
- **Some mistakes only appear at temperature or voltage extremes** — A marginally stable amplifier layout might work at room temperature but oscillate at -20C when gain increases. Test across the full operating range.
- **Layout mistakes are expensive to fix** — Each PCB respin costs money and weeks of schedule. Getting the layout right the first time is worth the review effort.
