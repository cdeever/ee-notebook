---
title: "Design Constraints of Earlier Eras"
weight: 20
bookCollapseSection: true
---

# Design Constraints of Earlier Eras

Every circuit is a product of what was available and what it cost at the time. Designs from the 1960s through the 1980s reflect a world where silicon was expensive, board space was cheap, precision resistors cost real money, and a microcontroller cost more than the analog circuit it might replace. Designers used clever discrete tricks — bootstrapping, current mirrors built from matched pairs, multi-use transistor stages — not because they enjoyed complexity, but because integration wasn't an option yet.

Understanding these constraints explains design choices that look strange through a modern lens. A circuit that uses three transistors where one op-amp would do isn't bad design — it's a rational response to a parts catalog where the op-amp either didn't exist, couldn't handle the bandwidth, or cost ten times more than the transistors. Recognizing the era's constraints turns a confusing schematic into a legible one.
