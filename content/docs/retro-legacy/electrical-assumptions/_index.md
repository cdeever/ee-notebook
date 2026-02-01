---
title: "Electrical Assumptions in Legacy Systems"
weight: 30
bookCollapseSection: true
---

# Electrical Assumptions in Legacy Systems

Modern circuits default to 3.3 V or 1.8 V logic, split ground planes, and low-impedance power distribution. Legacy systems grew up in a different electrical world. 5 V TTL and 12 V CMOS were standard logic levels. Negative supply rails (−5 V, −12 V, −15 V) were common, not exotic. Single-point star grounding was the norm in analog designs, and chassis ground often served as the signal return path. Power supplies were linear, which meant clean rails but significant heat.

These assumptions are baked into every legacy circuit's behavior. A board designed around 5 V TTL thresholds won't just work at 3.3 V. An analog section that relies on ±15 V rails has headroom and bias points that fall apart if you try to run it from a single 5 V supply. Even the PCB layout reflects its era — wide traces, through-hole components, single- or double-sided boards with hand-routed traces and jumper wires where the layout didn't work out. Knowing what was "normal" for the era helps you tell intentional design from bodge-wire repairs.
