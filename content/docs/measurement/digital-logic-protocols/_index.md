---
title: "Digital Logic & Protocols"
weight: 80
bookCollapseSection: true
---

# Digital Logic & Protocols

Logic levels, bus health, protocol decode (SPI, I2C, UART, CAN). MCU I/O verification. Where analog measurement meets digital communication.

- **[Are logic levels correct for this voltage domain?]({{< relref "logic-levels" >}})** — VOH, VOL, VIH, VIL thresholds. Level shifting between 3.3V and 5V domains. Marginal logic levels that work sometimes.
- **[Is this bus communicating?]({{< relref "bus-activity" >}})** — Quick checks: is there activity? Are clock and data both toggling? Is the bus stuck high, low, or floating?
- **[Is the device ACKing / responding?]({{< relref "device-responding" >}})** — Protocol-level verification. I2C ACK/NACK, SPI response bytes, UART framing. Using protocol decode to see what's actually on the wire.
- **[Are clock and data edges aligned?]({{< relref "clock-data-alignment" >}})** — Setup and hold timing. SPI clock phase/polarity, I2C timing margins, and catching the cases where it works on the bench but fails in production.
- **[Why does it fail at higher speeds?]({{< relref "speed-failures" >}})** — Signal integrity at speed. Reflections, crosstalk, inadequate termination, and the point where a breadboard prototype hits a wall.
