---
title: "Validation & Verification"
weight: 70
bookCollapseSection: true
---

# Validation & Verification

Does it actually meet intent?

Validation answers the question "did we build the right thing?" while verification answers "did we build the thing right?" Both are essential and different. A circuit can pass every electrical test and still fail to meet the actual need it was designed for. This subsection covers systematic approaches to confirming that a design works — not just electrically, but in context.

This section intentionally overlaps with the Measurement & Test section of the notebook. The difference is perspective: Measurement & Test focuses on instruments and techniques; Validation & Verification focuses on the design process of confirming that requirements are met. Both perspectives are needed.

## What This Section Covers

- **[Functional Validation]({{< relref "functional-validation" >}})** — Testing whether the system actually does what it was designed to do, traced back to requirements.
- **[Environmental Testing]({{< relref "environmental-testing" >}})** — Confirming the design works outside the controlled conditions of the lab bench.
- **[Margin Testing]({{< relref "margin-testing" >}})** — Pushing beyond nominal conditions to find where the design actually breaks.
- **[Regression Testing Across Revisions]({{< relref "regression-testing" >}})** — Ensuring that changes and fixes don't break what previously worked.
- **[Documentation of Test Results]({{< relref "documentation-of-results" >}})** — Recording test outcomes so they remain useful beyond the moment they were measured.
- **[Feeding Data Back into Design]({{< relref "feeding-data-back" >}})** — Closing the loop between test findings and design improvements.
