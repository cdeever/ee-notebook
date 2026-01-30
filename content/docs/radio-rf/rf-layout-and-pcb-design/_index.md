---
title: "RF Layout & PCB Design"
weight: 50
bookCollapseSection: true
---

# RF Layout & PCB Design

Copper geometry as circuit design.

At RF frequencies, the PCB layout is not a physical implementation of the schematic — it is the circuit. Trace widths set impedances, return paths determine coupling, and millimeters of misplacement create measurable performance differences. The schematic is necessary but not sufficient; the layout is where the design actually happens.

Many RF designs that work in simulation fail on the bench because of layout issues. Understanding controlled impedance, return current paths, via behavior, and shielding is as important as selecting the right components.

## What This Section Covers

- **[Why RF Layout Matters More Than Schematic]({{< relref "why-rf-layout-matters" >}})** — At low frequencies layout is about connectivity, but at RF it is about electromagnetics.
- **[Controlled Impedance Traces]({{< relref "controlled-impedance-traces" >}})** — How trace width, dielectric thickness, and copper weight combine to determine characteristic impedance.
- **[Return Paths & Ground Strategy]({{< relref "return-paths-and-ground-strategy" >}})** — Every signal has a return current, and at RF it follows the path of least impedance.
- **[Via Placement & Stitching]({{< relref "via-placement-and-stitching" >}})** — Via inductance, parallel vias, and ground stitching for controlled transitions between layers.
- **[Decoupling at RF]({{< relref "decoupling-at-rf" >}})** — Why "just add more capacitors" fails at RF and how to design a frequency-aware decoupling strategy.
- **[RF Connectors & Transitions]({{< relref "rf-connectors-and-transitions" >}})** — Connector types, impedance transitions, and launch design for maintaining signal integrity.
- **[Shielding & Isolation Techniques]({{< relref "shielding-and-isolation" >}})** — Metal enclosures, shield cans, guard traces, and strategies for keeping RF energy where it belongs.
- **[Common Layout Mistakes That Kill RF Performance]({{< relref "common-layout-mistakes" >}})** — The most frequent layout errors and why they cause failures on the bench.
