---
title: "🐛 Debugging, Failure & Repair"
weight: 11
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Debugging, Failure & Repair

Debugging is not about taking more measurements — it's about asking better questions. Measurement provides facts; debugging provides direction.

Troubleshooting methods, component failure modes, rework techniques, soldering practice, and post-mortems. This section is about what happens when things don't work — and the systematic approaches that get them working again.

Entries capture debugging strategies, common failure patterns, repair procedures, and the lessons learned from circuits that fought back. For the specific measurement procedures referenced here — how to probe, what mode to use, what the reading means — see the [Measurement & Test]({{< relref "/docs/measurement" >}}) section.

## Entries

- **[Bench Tooling]({{< relref "bench-tooling" >}})** — Soldering stations, hot air, tweezers, magnification, cleaning supplies, and ESD protection

- **[Failure Triage & First Response]({{< relref "triage-and-first-response" >}})** — Categorize the failure and choose the first measurement

- **[Fault Isolation Strategies]({{< relref "fault-isolation" >}})** — Narrow the search space systematically

- **[Common Failure Modes & Patterns]({{< relref "failure-modes-and-patterns" >}})** — Recognize the usual suspects before diving deep

- **[Field Failure Modes by Component]({{< relref "component-field-failures" >}})** — How components fail in the field and how those failures present

- **[Tools & Fixtures for Debugging]({{< relref "tools-and-fixtures" >}})** — Physical setup that makes debugging possible and safe

- **[Diagnosing Magnetics on the Bench]({{< relref "diagnosing-magnetics" >}})** — Scope waveforms, thermal signatures, LCR meter checks, and current-draw patterns for inductors and transformers

- **[Rework & Repair Techniques]({{< relref "rework-and-repair" >}})** — Desoldering, replacement, trace repair, and cleanup

- **[Verification After Repair]({{< relref "verification-after-repair" >}})** — Confirming the fix and catching regressions

- **[Post-Mortems & Lessons Learned]({{< relref "post-mortems" >}})** — Recording what happened to speed up future debugging
