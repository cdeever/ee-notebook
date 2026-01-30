---
title: "Iteration & Revision Control"
weight: 80
bookCollapseSection: true
---

# Iteration & Revision Control

Design is revision.

Hardware design is iterative — each revision incorporates lessons from the previous one. Unlike software, hardware revisions cost real money and real time, so managing the iteration process efficiently is critical. This subsection covers the discipline of tracking changes, controlling revisions, and deciding when to spin a new board versus patching the current one.

Without revision discipline, projects drift into confusion: which schematic matches this board? What changed between rev B and rev C? Why was this component changed? Good revision control answers these questions and prevents the accumulated chaos that turns a manageable project into an untraceable mess.

## What This Section Covers

- **[Revision Discipline]({{< relref "revision-discipline" >}})** — Establishing consistent practices for naming, marking, and releasing hardware revisions.
- **[Change Tracking & Rationale]({{< relref "change-tracking-and-rationale" >}})** — Recording not just what changed, but why it changed.
- **[BOM Drift]({{< relref "bom-drift" >}})** — Managing the living document that defines what's actually on the board.
- **[ECOs Without Bureaucracy]({{< relref "ecos-without-bureaucracy" >}})** — Applying engineering change discipline at a scale appropriate to the project.
- **[When to Spin vs Patch]({{< relref "when-to-spin-vs-patch" >}})** — Deciding whether to order a new board or rework the one you have.
- **[Hardware Versioning Sanity]({{< relref "hardware-versioning-sanity" >}})** — Keeping track of what hardware is what when multiple revisions coexist.
