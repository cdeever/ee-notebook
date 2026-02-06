---
title: "Probing & Measurement Technique"
weight: 20
bookCollapseSection: true
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Probing & Measurement Technique

Connecting to a circuit without changing the thing being measured. Probe selection, ground leads, bandwidth, loading — the stuff that separates a real reading from an artifact.

- **[Am I loading the circuit?]({{< relref "circuit-loading" >}})** — Probe impedance vs. source impedance. When a 10 MΩ DMM or 10x scope probe is still too heavy. High-Z nodes, current sense resistors, and knowing when the measurement itself has changed the circuit.
- **[Is my probe bandwidth sufficient?]({{< relref "probe-bandwidth" >}})** — Matching probe bandwidth to signal bandwidth. A 20 MHz probe on a 50 MHz signal doesn't just attenuate — it lies about edge shape.
- **[Is my ground connection adding artifacts?]({{< relref "ground-connection" >}})** — Ground lead inductance, ringing from long ground clips, and why the spring-tip ground works best for anything fast.
- **[Which probe type for this situation?]({{< relref "probe-selection" >}})** — Passive vs. active, 1x vs. 10x, current probes, differential probes, near-field probes. Choosing the right tool before the measurement begins.
