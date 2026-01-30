---
title: "Translating Blocks into Schematics"
weight: 10
---

# Translating Blocks into Schematics

A block diagram tells you what the system does. A schematic tells you how it does it. The translation between these two is one of the most important steps in electronics design, and it's where many projects first go wrong — not because the circuits are bad, but because the organization is unclear and the intent gets lost in a tangle of wires and symbols.

## From Blocks to Sheets

The block diagram created during [system architecture]({{< relref "/docs/design-development/system-architecture" >}}) defines functional blocks: power supply, microcontroller, sensor interface, communication, user interface, and so on. Each of these blocks typically becomes one or more schematic sheets. The mapping isn't always one-to-one — a simple block might fit as a section of a shared sheet, while a complex power supply might need two or three sheets — but the block diagram provides the organizing principle.

The key decision is granularity. Too few sheets and each one becomes a dense, unreadable wall of components. Too many sheets and you spend all your time navigating between them, losing sight of how signals flow through the system. A reasonable guideline: if a sheet requires scrolling or zooming to see the whole thing, it's too dense. If a sheet has fewer than a dozen components, it's probably too sparse and should be combined with related circuitry.

For most projects I've worked on, organizing by function works well: one sheet for power supply and distribution, one for the microcontroller and its immediate support circuitry (crystal, decoupling, reset), one for each major peripheral interface (sensor front end, communication, motor drive), and one for connectors and mechanical interface. This keeps related circuits together and makes it natural to hand off sections for review or parallel development.

## Hierarchical vs Flat Schematics

Schematic tools offer two organizational approaches: flat (multiple sheets with named nets connecting them) and hierarchical (a top-level sheet with blocks that expand into sub-sheets). Both work. The choice depends on project complexity and personal workflow.

Flat schematics are simpler to manage and work well for most projects up to moderate complexity — maybe 5-10 sheets. Every net that crosses a sheet boundary is connected by name, and you can see all sheets at the same level. The downside is that with many sheets, it becomes hard to see the overall signal flow without referring back to the block diagram.

Hierarchical schematics add a top-level sheet that looks like the block diagram, with each block expanding into a detailed sub-sheet. This is powerful for large designs — it makes navigation intuitive and preserves the architectural view. But it adds complexity to the design tool workflow. Ports on hierarchical blocks must be carefully maintained, and changes to interfaces between blocks require editing both the top-level sheet and the sub-sheets. For small-to-medium projects, the overhead often isn't worth it.

My current approach: use flat schematics for most projects, but organize the sheets in a sequence that mirrors the block diagram. The first sheet is typically a title page or system overview, followed by power, then signal path from input to output. This gives the reader a logical flow without the structural overhead of hierarchy.

## Multi-Sheet Organization

The order and grouping of schematic sheets matters more than it might seem. A well-organized schematic tells a story — it walks the reader through the design in a way that builds understanding. A poorly organized one forces the reader to jump randomly between sheets, losing context with every transition.

Organize by function, not by physical location. Putting "all the stuff in the upper-left quadrant of the PCB" on one sheet makes no sense to anyone reading the schematic for the first time. Instead, group circuits that serve the same purpose: all power regulation together, all sensor interface circuits together, all digital I/O together.

A common sheet ordering that works well:

1. Title page or system overview (if used)
2. Power input, protection, and regulation
3. Main processor or controller with support circuitry
4. Analog front end or sensor interfaces
5. Communication interfaces (USB, UART, SPI buses)
6. User interface (LEDs, buttons, displays)
7. Connectors, test points, and mechanical interface

This ordering follows the natural dependency chain: power must be understood before anything else, the controller provides context for its peripherals, and connectors tie everything to the outside world.

## Signal Flow Conventions

Consistent signal flow direction makes schematics dramatically easier to read. The standard convention — and it exists for good reason — is:

- **Inputs on the left, outputs on the right.** Signal flows left to right across the page, matching the way most people read.
- **Power at the top, ground at the bottom.** Current flows "downhill" on the page, matching the intuition that higher potential is physically higher.
- **Signal flow matches block diagram flow.** If the block diagram shows data flowing from sensor to ADC to processor, the schematic sheets should follow the same sequence.

These aren't rigid rules, and sometimes circuit topology makes strict left-to-right flow impractical. But deviating from convention should be a conscious choice, not an accident. When a signal must flow right-to-left, adding an annotation explaining why helps the reader.

## Net Naming and Bus Conventions

Net names are the primary mechanism connecting signals across schematic sheets. Every net that leaves a sheet should have an explicit, meaningful name. Unnamed nets that happen to connect because the tool auto-assigned the same number are a maintenance disaster waiting to happen.

Good net naming follows predictable patterns. Power rails should include their voltage: `VCC_3V3`, `VCC_5V`, `VIN_12V`. Signal names should indicate function: `SPI_CLK`, `I2C_SDA`, `ADC_CH0`. Active-low signals need a consistent prefix or suffix: `nRESET`, `nCS`, `nIRQ` (I prefer the `n` prefix, but some teams use `_B` suffix or an overbar).

Bus signals benefit from consistent numbering: `DATA[0]`, `DATA[1]`, ... `DATA[7]`, or `ADDR[0:15]`. Most schematic tools support bus notation that lets you draw a single thick line representing all signals in the bus, with individual signals breaking out where they connect to pins. This dramatically cleans up schematics with wide parallel buses.

One naming trap I've fallen into: using the same signal name for logically different nets. If two separate I2C buses exist in the design, naming them both `SDA` and `SCL` creates a short circuit. Use `I2C0_SDA`/`I2C1_SDA` or `SENSOR_SDA`/`DISPLAY_SDA` to distinguish them.

## Common Mistakes

Even experienced designers make organizational errors that cause problems downstream. A few I've encountered or learned about the hard way:

**Orphaned nets.** A net name on one sheet with no matching name anywhere else. The designer intended a connection, but a typo or copy-paste error means the signal goes nowhere. Most ERC (Electrical Rules Check) tools catch this, but only if you run them — and only if you don't dismiss the warnings.

**Missing power connections.** A component is placed but its power pins aren't connected, often because the schematic symbol hides them (implicit power pins). This is especially common with op-amps, logic gates, and other multi-unit components where power pins are on a separate symbol. Always verify that every component has power and ground connected.

**Ambiguous signal direction.** A net called `DATA` that could be input, output, or bidirectional. Without context, the reader doesn't know which way information flows. Name signals directionally when possible (`MCU_TX`, `SENSOR_OUT`) or add net labels indicating direction.

**Schematic-layout mismatch.** Changing the schematic without updating the layout, or vice versa. This is a tool discipline issue — always forward-annotate schematic changes to the layout, and back-annotate layout changes (like component value adjustments) to the schematic. The schematic is the source of truth.

## Gotchas

- **Hidden power pins create hidden bugs.** Many schematic symbols have implicit power connections that don't appear on the schematic. Always check that the symbol's hidden pins match your actual power net names, or make them explicit.
- **Copy-paste across sheets breaks net connections.** Copying a circuit block from one sheet to another often duplicates net names that should be unique. Review every pasted block for unintended connections.
- **The first schematic organization is rarely the best.** As the design evolves, the original sheet organization may no longer make sense. Reorganizing mid-project feels wasteful but often pays off in reduced confusion during layout and debug.
- **ERC warnings are not optional.** Electrical Rules Check exists to catch exactly the mistakes that manual review misses. Running ERC and resolving every warning — not just suppressing them — is one of the highest-value habits in schematic design.
- **Schematic readability is a feature, not vanity.** A schematic that "works" but is incomprehensible to anyone else (including your future self) is a liability. Time spent on layout, alignment, and annotation is not wasted.
