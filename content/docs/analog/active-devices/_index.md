---
title: "Active Devices"
weight: 10
bookCollapseSection: true
---

# Active Devices

How analog behavior is created. Passive components obey constraints — active devices exploit them to produce gain, switching, regulation, and signal shaping. In this section, "active" refers to devices with nonlinear, state-dependent behavior that control current or voltage — even when they do not provide power gain. Diodes, BJTs, and MOSFETs are the building blocks. Everything else in analog electronics is a combination of these devices wired up with passives.

Understanding active devices means understanding their real behavior, not just the ideal textbook model. Every device has regions of operation, parasitic effects, and failure modes that matter at the bench.

## What This Section Covers

- **[Diodes]({{< relref "diodes" >}})** — Rectification, clamping, protection, Zener regulation, and real diode behavior vs. the ideal model.
- **[BJTs]({{< relref "bjts" >}})** — Current-controlled devices: operating regions, biasing fundamentals, and small-signal vs. large-signal behavior.
- **[MOSFETs]({{< relref "mosfets" >}})** — Voltage-controlled devices: thresholds, regions, transconductance, and analog vs. logic-style usage.
