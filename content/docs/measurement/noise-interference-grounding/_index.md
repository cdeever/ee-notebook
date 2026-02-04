---
title: "Noise, Interference & Grounding"
weight: 90
bookCollapseSection: true
---

# Noise, Interference & Grounding

Tracking down unwanted signals. EMI, ground loops, crosstalk, coupling. The measurements that matter when the circuit "should work" but something invisible is ruining it.

- **[EMI/EMC Reality (When the Circuit Becomes a Radio)]({{< relref "emi-emc-reality" >}})** — The conceptual anchor: coupling mechanisms, why fast edges cause RF, real-world symptoms, first moves that usually work, and measurement approaches with basic tools.
- **[Where is this noise coming from?]({{< relref "noise-source" >}})** — Identifying noise sources: switching converters, digital clocks, motor drives, external interference. Near-field probing, spectrum analysis, and process of elimination.
- **[Is there a ground loop?]({{< relref "ground-loop" >}})** — Hum, buzz, and ground-referenced interference. Identifying ground loops between instruments, between boards, or between a DUT and test equipment.
- **[Is this conducted or radiated?]({{< relref "conducted-radiated" >}})** — Distinguishing coupling paths. Does the noise travel on wires or through the air? Shielding experiments, common-mode vs. differential-mode, and ferrite tests.
- **[Does shielding / rerouting fix it?]({{< relref "shielding-rerouting" >}})** — Empirical fixes and verification. Testing whether a shield, filter, rerouted trace, or grounding change actually solves the problem — and measuring the before/after difference.
