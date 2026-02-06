---
title: "Practical Mental Models"
weight: 70
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Practical Mental Models

The abstraction hierarchy — primitives, blocks, subsystems, devices, systems — provides a structure for thinking about electronics at different scales. But structure alone doesn't indicate which level to reason at, what a healthy circuit looks like versus a broken one, or where to direct attention when something goes wrong. For that, mental models are needed: repeatable thinking patterns that compress experience into reusable frameworks.

The models in this section aren't theories or laws. They're tools — ways of looking at a circuit or system that reveal structure, expose weaknesses, and guide diagnosis. They work across abstraction levels and across domains, because the patterns they capture (energy flow, information transformation, temporal coordination, design intent) recur everywhere electronics is built. Internalizing these models is what allows fast, accurate reasoning at the bench without re-deriving everything from first principles each time.

## What This Section Covers

- **[Energy, Information, Time, and Control]({{< relref "energy-information-time-and-control" >}})** — Four orthogonal lenses for reasoning about any circuit or system, and how each reveals different aspects of behavior and failure.

- **[Healthy vs Broken at Each Layer]({{< relref "healthy-vs-broken-at-each-layer" >}})** — What "working correctly" looks like at each abstraction level, and the characteristic signatures of failure at each one.

- **[Warning Signs]({{< relref "warning-signs" >}})** — Patterns that suggest the wrong abstraction is in use, relying on a broken one, or missing a level entirely.

- **[Designing for Debuggability]({{< relref "designing-for-debuggability" >}})** — How architectural choices made during design determine whether a circuit can be diagnosed efficiently when it fails.
