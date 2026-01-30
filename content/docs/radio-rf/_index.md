---
title: "Radio & RF"
weight: 6
bookCollapseSection: true
---

# Radio & RF

Where wavelength starts to matter.

Radio and RF engineering deal with signals whose physical size is comparable to the circuits that carry them. At these frequencies, energy moves through fields as much as through wires — PCB traces become components, parasitics dominate behavior, and intuition built from low-frequency circuits often breaks down.

Entries cover antennas, impedance matching, transmission lines, RF layout, propagation, and software-defined radio — with an emphasis on practical RF work: what actually happens on real boards and in real space, why measurements are hard, and how small physical details can make or break a design.

## Sections

- **[RF Fundamentals & Wavelength Thinking]({{< relref "rf-fundamentals" >}})** — Rewiring intuition for high-frequency design: wavelength, phase, distributed effects, and why RF problems feel non-local.
- **[Transmission Lines]({{< relref "transmission-lines" >}})** — Characteristic impedance, reflections, VSWR, termination, and the behavior of cables and traces as RF components.
- **[Impedance Matching]({{< relref "impedance-matching" >}})** — Making power go where you want it: matching networks, Smith chart techniques, and real-world compromises.
- **[Antennas]({{< relref "antennas" >}})** — Where circuits meet physics: antenna types, radiation resistance, polarization, tuning, and measurement.
- **[RF Layout & PCB Design]({{< relref "rf-layout-and-pcb-design" >}})** — Copper geometry as circuit design: controlled impedance, return paths, via stitching, decoupling, and shielding.
- **[RF Components & Building Blocks]({{< relref "rf-components" >}})** — The real behavior behind ideal symbols: RF passives, amplifiers, mixers, filters, oscillators, and datasheets.
- **[Propagation & the Real World]({{< relref "propagation" >}})** — What happens after the signal leaves the board: path loss, multipath, materials, weather, and placement effects.
- **[Software-Defined Radio (SDR)]({{< relref "software-defined-radio" >}})** — Where the analog front end meets the digital back end: I/Q signals, sampling, architectures, and SDR as a learning tool.
- **[Measurement, Debugging & RF Tools]({{< relref "measurement-debugging-and-rf-tools" >}})** — Seeing invisible problems: spectrum analyzers, VNAs, probing techniques, and debugging oscillations.
- **[Practical RF Projects & Case Studies]({{< relref "practical-rf-projects" >}})** — Learning by building and breaking: transmitters, antenna experiments, SDR explorations, and postmortems.
