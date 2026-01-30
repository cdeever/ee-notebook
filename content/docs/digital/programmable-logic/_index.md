---
title: "Programmable Logic"
weight: 50
bookCollapseSection: true
---

# Programmable Logic

Scaling digital systems beyond fixed-function chips. Discrete logic gates, flip-flops, and small-scale ICs work well for simple designs, but complex digital systems need hundreds of thousands or millions of logic elements. Programmable logic devices — PALs, CPLDs, and FPGAs — put reconfigurable hardware on a single chip, replacing board-level complexity with configuration.

The conceptual shift is significant: instead of wiring up physical gates, the designer describes behavior in a hardware description language and lets tools map that description onto physical resources. This is not software — it is hardware that happens to be configured by a file rather than by a manufacturing process. Understanding what synthesis actually does, and thinking in terms of hardware rather than code, is the key to using programmable logic effectively.

## What This Section Covers

- **[PLDs & CPLDs]({{< relref "plds-and-cplds" >}})** — Why they exist; sum-of-products architecture; when a small programmable device is the right choice.
- **[FPGAs]({{< relref "fpgas" >}})** — LUTs, routing, block RAM, and timing; the hardware description mindset; not software on a chip.
- **[HDL Concepts]({{< relref "hdl-concepts" >}})** — Combinational vs sequential description; what synthesis actually does; thinking in hardware, not code.
