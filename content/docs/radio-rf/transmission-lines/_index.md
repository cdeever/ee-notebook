---
title: "Transmission Lines"
weight: 20
bookCollapseSection: true
---

# Transmission Lines

Moving energy without surprises.

A transmission line is any conductor structure where signal wavelength is comparable to or smaller than the conductor length. At that point, voltage and current vary along the length of the conductor, and the geometry of the conductor pair determines how energy propagates.

Transmission line behavior underlies everything from coax cables and PCB traces to antenna feedlines and high-speed digital interconnects. Understanding characteristic impedance, reflections, and termination is essential before tackling matching networks or RF layout.

## What This Section Covers

- **[What Makes a Transmission Line]({{< relref "what-makes-a-transmission-line" >}})** — Any pair of conductors becomes a transmission line when electrically long enough for wave behavior to emerge.
- **[Characteristic Impedance]({{< relref "characteristic-impedance" >}})** — Z0 is a property of geometry, not length, and it determines how energy moves through a conductor structure.
- **[Coax, Twisted Pair, Microstrip & Stripline]({{< relref "coax-twisted-pair-microstrip-stripline" >}})** — The major transmission line types, their properties, and when to choose each.
- **[Reflections, Standing Waves & VSWR]({{< relref "reflections-standing-waves-and-vswr" >}})** — What happens when impedance changes along a line, and how to quantify the mismatch.
- **[Termination Strategies]({{< relref "termination-strategies" >}})** — Techniques for absorbing signal energy cleanly at the end of a line.
- **[Measuring Transmission Lines]({{< relref "measuring-lines" >}})** — TDR, VNA, and practical methods for characterizing cables and traces.
- **[Cables as Components]({{< relref "cables-as-components" >}})** — At RF, a cable has loss, delay, impedance, and frequency-dependent behavior that makes it an active part of the design.
