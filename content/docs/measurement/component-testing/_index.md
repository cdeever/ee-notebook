---
title: "Component Testing"
weight: 40
bookCollapseSection: true
---

# Component Testing

Go/no-go on parts. Real values vs. markings. R, C, L, diodes, transistors, ESR. When you suspect a part, these are the measurements that confirm or clear it.

## What This Section Covers

Measurement intent — the questions you're trying to answer at the bench:

- **Is this part dead or alive?** — Quick go/no-go checks. Diode junctions, transistor beta, capacitor charge/discharge, inductor continuity. Catching the obviously blown parts first.
- **What's the actual value?** — Measuring R, C, and L with a meter or LCR bridge. Unmarked parts, faded markings, and confirming that what's on the board matches what's on the schematic.
- **Is it within tolerance?** — Comparing measured value to rated value and tolerance band. Drift from aging, heat damage, or overstress.
- **What's the ESR / leakage / gain?** — Deeper characterization beyond nominal value. Electrolytic ESR, capacitor leakage current, transistor hFE, and other parameters that separate a marginal part from a good one.
