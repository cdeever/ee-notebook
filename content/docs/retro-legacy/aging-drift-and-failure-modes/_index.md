---
title: "Aging, Drift, and Failure Modes"
weight: 60
bookCollapseSection: true
---

# Aging, Drift, and Failure Modes

Components change over time, and older circuits have had more time to change. Electrolytic capacitors dry out and lose capacitance or develop high ESR. Carbon composition resistors drift upward in value — sometimes 20% or more over decades. Solder joints develop cracks from thermal cycling. Potentiometers get noisy. Through-hole connectors develop intermittent contact from oxidation or mechanical fatigue. Rubber belts in anything electromechanical stretch, harden, and crack.

These aren't random failures — they're predictable, era-specific degradation patterns. A 1970s amplifier with carbon comp resistors will have different drift behavior than a 1990s design with metal film parts. Knowing which components in a given era are likely to have drifted or failed narrows the search space dramatically when troubleshooting. For general failure analysis methodology, see [Debugging, Failure & Repair]({{< relref "/docs/debugging" >}}) — this section focuses on the failure signatures that are specific to aged and legacy components.
