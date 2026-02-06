---
title: "Laws & First Principles"
weight: 10
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Laws & First Principles

The fundamental requirements. These are the non-negotiable constraints that every circuit obeys, regardless of topology, frequency, or how clever the designer thinks they are. They are not design choices or implementation details — they are the minimum physical requirements for a circuit to behave at all.

Much like fuel, air, and spark in an internal combustion engine, these requirements are not optional. When something doesn't add up at the bench, it's almost always because one of these requirements is being misapplied — not because the law itself is wrong.

## What This Section Covers

- **[Ohm's Law]({{< relref "ohms-law" >}})** — V=IR, when it applies, when it doesn't, and the practical meaning of impedance.
- **[Current Direction & Conventions]({{< relref "current-direction-and-conventions" >}})** — Conventional vs electron flow, reference directions, and the passive sign convention.
- **[Sourcing & Sinking]({{< relref "sourcing-and-sinking" >}})** — What it means for a pin or component to source or sink current, and where the distinction matters in practice.
- **[Kirchhoff's Laws]({{< relref "kirchhoffs-laws" >}})** — KCL and KVL. Reference directions, sign conventions, and why these never fail.
- **[Conservation of Energy]({{< relref "conservation-of-energy" >}})** — Where power goes, heat as the universal sink, and accounting for "missing" power.
