---
title: "Connector Placement & Panel Design"
weight: 40
---

# Connector Placement & Panel Design

Connectors are where the PCB meets the outside world — power comes in, signals go out, users plug in cables, and test equipment attaches. Their placement is one of the most constrained aspects of PCB layout because they must satisfy both electrical routing requirements and mechanical interface requirements simultaneously. Get connector placement wrong, and you'll be staring at a board that works on the bench but doesn't fit in its enclosure.

## Edge vs Through-Board Connectors

Connectors broadly fall into two categories based on how they interface with the enclosure:

**Edge-mounted connectors** face outward from the board edge and mate through a panel cutout. USB, Ethernet, barrel jacks, D-sub connectors, and most audio jacks fall into this category. Their position on the board directly defines their position on the enclosure panel, so they must be placed first during layout — usually as the very first components dropped onto the board.

**Through-board connectors** face upward or downward from the board surface. Pin headers, board-to-board connectors, battery connectors, and internal ribbon cable connectors are typical examples. These don't interact with the enclosure panel but do have height constraints — they need clearance above or below the board for the mating connector and cable.

Some connectors are both: a right-angle header might face the board edge like an edge-mount connector but attach to the board surface like a through-board connector. These require careful attention to both the edge alignment and the board surface footprint.

## Placing Edge Connectors First

Edge connectors are the most constrained components on the board, so they get placed first. The process:

1. **Start with the mechanical drawing.** The enclosure panel cutouts define where the connectors must be. If you're designing the enclosure too, start by deciding which connectors go on which face and in what order.
2. **Place connectors on the board to match the panel.** Each connector's position is constrained in X (along the board edge), Y (distance from the board edge), and Z (height above the board surface). All three must match the panel cutout.
3. **Check protrusion and setback.** The connector body must protrude through the panel enough for a cable to mate. Some connectors (like USB Type-A) have specific protrusion requirements defined by the standard. Too much setback and the cable can't reach; too much protrusion and the connector sticks out awkwardly.
4. **Verify with a 3D model or mockup.** Before routing anything, confirm that the connector positions work with the enclosure. This is the cheapest point to catch mistakes.

## Grouping Connectors

How connectors are arranged on the enclosure affects both usability and layout routing:

- **Power on one side, signals on another.** This is the most common approach and has real benefits: power traces can be routed on short, direct paths, and power-side EMI is physically separated from signal-side sensitivity. It also makes cabling cleaner for the end user.
- **All connectors on one edge.** Common in rack-mount equipment and modular systems where only one face is accessible. This simplifies the enclosure design but concentrates all the routing to one board edge, which can create congestion.
- **Connectors on opposite edges.** Useful when the board sits between two systems (e.g., a backplane interface on one side and a front panel on the other). This provides the most routing space but requires the longest internal traces for signals that must cross the board.

The best grouping depends on the enclosure design, the cable routing outside the board, and the internal circuit topology. Think about how someone will actually plug cables into the finished product — connector order should be logical and cable management should be practical.

## Panel Layout Design

The enclosure panel and the PCB connector placement are two views of the same interface. Misalignment between them is one of the most common mechanical failures in electronics projects.

**Designing the panel:**

- Start by listing all external connectors, indicators (LEDs), controls (buttons, switches), and labels.
- Arrange them logically: group related connectors, put indicators where they're visible, put controls where they're reachable.
- Dimension everything from a common reference point — typically one corner of the panel and one corner of the board. This minimizes tolerance stackup between the board and panel.
- Include tolerances. Panel cutouts should be slightly oversized relative to the connector body to accommodate PCB placement variation and panel fabrication tolerances. Most connectors specify a recommended panel cutout size in their datasheet.

**Common panel design mistakes:**

- Cutouts too tight: the connector doesn't fit through the panel.
- Cutouts too loose: the connector wobbles, and the panel looks sloppy.
- Spacing too tight between cutouts: no room for cable strain relief or for fingers to access adjacent connectors.
- Label text too small or too close to cutouts: unreadable once cables are attached.

## Standard Connector Requirements

Common connectors have specific mechanical requirements that affect board layout:

**USB Type-C:** The connector body extends about 3.3 mm from the board edge. The receptacle requires a specific pad layout and usually needs mid-mount or through-hole mounting legs for mechanical strength. The USB-IF specification defines the panel cutout dimensions precisely.

**RJ45 (Ethernet):** These are tall connectors — often 13-14 mm above the board surface — with integrated magnetics adding to the depth on the board side. They need substantial board area and their height can conflict with enclosure lids.

**Barrel jacks (DC power):** The pin orientation (center-positive vs center-negative) and the barrel diameter (2.1 mm vs 2.5 mm) must match the power supply. Panel cutout alignment is less critical than for USB because barrel connectors have more mechanical compliance.

**SMA (RF):** Edge-launch SMA connectors require controlled-impedance traces right up to the connector pad. The ground pins need a solid connection to the ground plane immediately at the board edge. See [RF Layout & PCB Design]({{< relref "/docs/radio-rf/rf-layout-and-pcb-design" >}}) for RF-specific guidance.

## Keying and Polarity Protection

Preventing incorrect connections is a layout responsibility, not just a schematic one:

- **Polarized headers.** Use shrouded headers with a keying notch for any connection that could be inserted backwards. An unkeyed 2x5 header is an invitation for a reversed ribbon cable.
- **Unique pin counts.** If multiple connectors on the same board use the same header type, make them different pin counts so they can't be swapped. A 6-pin and an 8-pin header can't be confused; two 6-pin headers can.
- **Connector shape and color.** Different connector families (JST-XH, Molex KK, etc.) don't intermate. Using different families for different functions provides physical keying.
- **Panel labeling.** Clear labels near each connector indicate function, polarity, and voltage. Silk screen on the PCB helps during development; panel labels help during use.

## Strain Relief and Mechanical Anchoring

Board-mount connectors are mechanically vulnerable. A cable attached to a connector acts as a lever arm, and the solder joints are the fulcrum. Over time, cable forces fatigue the solder joints, especially in applications with vibration or repeated connect/disconnect cycles.

- **Through-hole mounting legs.** Many SMD connectors include through-hole retention tabs that anchor the connector body to the board mechanically, independent of the signal solder joints. Always use these features — don't leave the mounting holes unconnected to save board space.
- **Cable tie-down points.** Adding a hole or slot near a connector for a cable tie or cable clamp transfers cable forces from the connector to the board structure.
- **Enclosure-mounted strain relief.** In some designs, the cable clamps to the enclosure rather than the board, so cable forces never reach the PCB at all. This is the best option for heavy cables or harsh environments.

## Test and Debug Connectors

Not all connectors face the outside world. Development and debug connectors serve the design process:

- **JTAG/SWD headers:** Essential for firmware development. Place them where a debug probe can reach during development. Consider a Tag-Connect footprint (no connector body, just pads) if board space is tight.
- **UART debug headers:** A 3- or 4-pin header for serial console access. Invaluable during bring-up.
- **Test points:** Not technically connectors, but they serve a similar interface function. Place them where scope probes and multimeter leads can reach. See [Design for Test]({{< relref "/docs/design-development/schematic-design/design-for-test" >}}) for test point strategy.

For production boards, debug connectors can be depopulated (footprint present, no connector stuffed) or replaced with smaller form factors (Tag-Connect, pogo-pin pads). The footprint should always be present — the cost of the board space is negligible compared to the cost of not being able to debug a production issue.

## Gotchas

- **Connector datasheets define the mating face, not the board footprint.** The mechanical drawing for a connector often shows dimensions from the mating side. You need the PCB footprint drawing, which is a different page in the datasheet (and sometimes a different document entirely).
- **Right-angle connectors extend further than you think.** A right-angle header's pins extend inboard from the board edge by several millimeters. This space is not available for other components.
- **Hot-plug connectors need protection circuits.** USB, Ethernet, and other hot-pluggable connectors can experience voltage spikes during insertion. ESD protection and inrush current limiting are schematic concerns, but the protection components must be placed physically close to the connector — a layout concern.
- **Mixed connector heights make panel design difficult.** If one connector sits 2 mm above the board and another sits 8 mm above, the panel cutouts will be at different vertical positions relative to the board. This is solvable but must be planned for.
- **Cable bend radius consumes enclosure space.** A right-angle cable exit needs clearance inside the enclosure for the cable to bend. This is invisible in the PCB layout tool but very real in the enclosure.
