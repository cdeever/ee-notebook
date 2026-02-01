---
title: "Repair, Substitution, and Reverse Engineering"
weight: 70
bookCollapseSection: true
---

# Repair, Substitution, and Reverse Engineering

The original part is discontinued. The schematic doesn't exist. The service manual — if there ever was one — is long gone. This is the starting condition for most legacy repair work, and it demands a different approach than fixing a modern board with full documentation and in-stock BOMs.

Substitution means understanding *why* the original part was chosen, not just its value. A 2N3055 isn't just "an NPN transistor" — it's a specific voltage, current, power, and SOA envelope that the replacement needs to match or exceed. Cross-reference guides (NTE, ECG, semiconductor manufacturer equivalence tables) are a starting point, but verifying the critical parameters for the specific circuit is the real work. Reverse engineering undocumented boards starts with identifying the power rails, tracing signal flow from connectors inward, and recognizing the common circuit blocks of the era. It's slow, but it's learnable — and every board you trace builds pattern recognition for the next one.
