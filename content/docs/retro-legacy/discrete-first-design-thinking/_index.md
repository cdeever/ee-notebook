---
title: "Discrete-First Design Thinking"
weight: 40
bookCollapseSection: true
---

# Discrete-First Design Thinking

Before cheap op-amps, voltage regulators, and microcontrollers, every function was built from individual transistors, diodes, and passives. Amplifier stages, voltage references, timing circuits, and logic functions were all assembled from discrete parts — and the design patterns of that era are different from what you'd reach for today.

Reading these circuits means recognizing recurring building blocks: common-emitter gain stages, emitter followers for impedance buffering, discrete current mirrors, Darlington pairs for high-beta drive, and transistor-level logic (DTL, RTL) that predates the 7400 series. The component count is higher, the interaction between stages is more direct, and there's less isolation between functions than a modern IC-based design provides. But the underlying principles are the same ones covered in [Fundamentals]({{< relref "/docs/fundamentals" >}}) — just applied one device at a time with every tradeoff visible on the schematic.
