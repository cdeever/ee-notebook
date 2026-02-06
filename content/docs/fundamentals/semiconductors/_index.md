---
title: "Semiconductors"
weight: 50
bookCollapseSection: true
---

# Semiconductors

The behavioral primitives that make active circuits possible. Semiconductor devices — diodes, BJTs, MOSFETs, thyristors — are the foundation for amplification, switching, regulation, and protection. Unlike passive components that simply obey constraints, semiconductors exploit those constraints to create useful nonlinear behavior.

This section focuses on **device understanding**: what each device is, how it behaves, and how to reason about it at the bench. The emphasis is on the device itself — its operating regions, its real-world deviations from ideal models, and its failure modes. Circuit techniques that *use* these devices (amplifiers, biasing networks, filters) live in their application domains: [Analog Electronics]({{< relref "/docs/analog" >}}), [Digital Electronics]({{< relref "/docs/digital" >}}), and power-related sections.

## What This Section Covers

- **[PN Junction Fundamentals]({{< relref "pn-junction-fundamentals" >}})** — The physics that underlies all junction devices: forward bias, reverse bias, depletion regions, and the exponential I-V relationship.
- **[Diodes]({{< relref "diodes" >}})** — Rectification, clamping, protection, Zener regulation, and real diode behavior vs. the ideal model.
- **[BJTs]({{< relref "bjts" >}})** — Current-controlled devices: operating regions, biasing fundamentals, and small-signal vs. large-signal behavior.
- **[MOSFETs]({{< relref "mosfets" >}})** — Voltage-controlled devices: thresholds, regions, transconductance, and analog vs. logic-style usage.
- **[Thyristors]({{< relref "thyristors" >}})** — SCRs, triacs, and DIACs: latching behavior, AC phase control, commutation, and snubber networks.
- **[Protection & Clamping Devices]({{< relref "protection-and-clamping" >}})** — TVS diodes, Zener protection, clamping behavior, and choosing the right device for the job.
