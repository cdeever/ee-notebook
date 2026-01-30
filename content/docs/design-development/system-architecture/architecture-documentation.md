---
title: "Architecture Documentation"
weight: 50
---

# Architecture Documentation

If the architecture isn't written down, it exists only in one person's head — and even there, it degrades over time. Memory is unreliable, especially for design decisions. Six months after a project, you won't remember why you chose a particular signal conditioning topology, why the power supply uses two stages instead of one, or why the digital section runs at 3.3V instead of 1.8V. Documentation captures these decisions while they're still fresh.

## Why Document Architecture?

The schematic captures what the circuit is. Architecture documentation captures why it is that way. The distinction matters because:

- **Schematics don't explain alternatives.** The schematic shows a buck converter. It doesn't show that you considered a boost converter, evaluated an LDO, and chose the buck because the dropout was too high for the LDO and the voltage direction was wrong for the boost.
- **Schematics don't explain constraints.** The schematic shows a four-layer board. It doesn't explain that four layers were needed because the ADC required a continuous ground plane under its analog inputs, which couldn't be achieved on two layers.
- **Schematics don't explain tradeoffs.** The schematic shows a 100 kHz switching frequency. It doesn't explain that 500 kHz would have been smaller but violated the EMC budget, while 50 kHz would have required a larger inductor.

Architecture documentation fills these gaps. It's the narrative that makes the schematic comprehensible to someone who wasn't in the designer's head when the decisions were made.

## Minimum Viable Documentation

Documentation doesn't have to be formal or exhaustive to be useful. A project with no documentation at all is a project that can't be understood, maintained, or improved by anyone — including the person who designed it. But a project with excessive documentation that nobody reads is also a failure.

The minimum set that I've found consistently valuable:

### Block Diagram

The system-level block diagram (see [Block Diagrams as Thinking Tools]({{< relref "/docs/design-development/system-architecture/block-diagrams-as-thinking-tools" >}})) is the single most important architecture document. It shows:

- Major functional blocks and their relationships
- Signal flow direction and type
- Power architecture and voltage domains
- External interfaces and connectors
- Key parameters (signal levels, data rates, power consumption)

This is the document that answers "what does this system do and how is it organized?" in one view.

### Interface Definitions

A list of the interfaces between blocks (see [Interfaces & Boundaries]({{< relref "/docs/design-development/system-architecture/interfaces-and-boundaries" >}})) with their key parameters:

| Interface | Blocks connected | Type | Key parameters |
|---|---|---|---|
| Sensor SPI | Sensor board / MCU | SPI | Mode 0, 1 MHz, 3.3V |
| Analog signal | Sensor / ADC | Analog | 0-2.5V, 10 kHz BW, 100 ohm source |
| Power input | Connector / Regulator | Power | 7-15V DC, 500 mA max |
| Debug | MCU / External | UART | 115200 baud, 3.3V, TX/RX only |

This table might be informal — a text file, a section of a project notebook, or annotations on the block diagram. The format doesn't matter; the information does.

### Design Decisions and Rationale

The most frequently forgotten and most valuable documentation: why was this decision made?

A design decision record doesn't need a formal template. A simple entry works:

**Decision:** Use a TLV1117-33 LDO instead of a switching regulator for the analog supply.

**Context:** The analog section draws 30 mA max and is sensitive to supply ripple. The input voltage is 5V USB.

**Alternatives considered:**
- Switching regulator: higher efficiency but introduces switching ripple (10-50 mV typical) that would require additional filtering.
- Ferrite bead + capacitor filter from the 3.3V digital supply: simpler but couples digital noise to the analog section.

**Rationale:** The 1.7V dropout at 30 mA dissipates 51 mW, which is thermally insignificant. The LDO provides inherently low output noise (< 1 mV) without additional filtering. The efficiency penalty is acceptable given the USB power source.

This takes five minutes to write and saves hours of "why did I do this?" questioning later. It also prevents the next revision from "improving" the power supply by replacing the LDO with a switching regulator, not realizing the LDO was chosen specifically for its noise performance.

## Living Documents vs Snapshots

There are two approaches to documentation maintenance, and they serve different purposes:

**Living documents** are updated as the design evolves. The block diagram reflects the current design, the decision records include the latest changes, and the interface table matches the current schematic. Living documents are useful for active projects that are being modified.

**Snapshots** capture the state of the design at a specific point in time — typically at each PCB revision. "Rev 1 architecture" is a frozen document that records what was designed and why. When rev 2 is started, a new snapshot captures the updated architecture.

For personal projects, a practical approach is: maintain a living block diagram and keep a running list of design decisions. When you fabricate a board, take a snapshot by saving a copy of all documentation with the revision label. This gives you both a current view and a historical record.

## Documentation Tools

The best documentation tool is the one you'll actually use. Some options:

**Plain text and markdown.** Simple, version-controllable, searchable, and tool-independent. A `design-notes.md` file in the project repository captures decisions in a format that survives any tool change. This is what I use most.

**Schematic annotations.** Many EDA tools allow text notes on schematic sheets. Putting design rationale directly on the schematic keeps it co-located with the design it describes. The downside: annotations don't capture system-level decisions that span multiple sheets.

**Diagrams-as-code.** Tools like Mermaid, PlantUML, or Graphviz generate diagrams from text descriptions. The text source is version-controllable, and the diagram updates automatically when the text changes. Useful for block diagrams that change frequently.

**Project notebooks.** Physical or digital notebooks (OneNote, Notion, plain lab notebooks) capture informal design thinking, calculations, test results, and decisions. They're less structured than formal documentation but capture the thought process that formal documents miss.

**Wiki or documentation sites.** For larger projects or teams, a wiki provides structured, linked documentation. Overkill for personal projects but valuable when multiple people need access.

## The Audience for Architecture Docs

Documentation is communication, and effective communication requires knowing the audience:

**Future you.** The most common audience. Six months from now, you'll pick up this project and need to understand what you did and why. Future you has forgotten the context, the alternatives you considered, and the rationale for your decisions. Write for someone with your skills but none of your current context.

**Collaborators.** If anyone else will work on the project, they need to understand the architecture without a verbal walkthrough from you. The block diagram, interface definitions, and design decisions give them enough context to contribute without breaking things.

**Reviewers.** If you're asking someone for design feedback, the architecture documentation gives them the context they need to provide useful input. A reviewer who only sees the schematic can comment on circuit details but can't evaluate whether the architecture is sound.

**Repair and maintenance.** Someone debugging a failed unit needs to understand the system architecture to isolate the fault. Which block does what? Where are the interfaces? What are the expected signal levels? Architecture documentation turns a debugging nightmare into a systematic investigation.

## Gotchas

- **Documentation written after the fact is worse than documentation written during design.** The rationale for decisions fades quickly. Write decision records when you make the decision, not after the board is fabricated.
- **Too much documentation is as bad as too little.** A 50-page design document that nobody reads provides no value. Keep documentation focused on what's useful: block diagram, interfaces, and decisions. Skip the boilerplate.
- **Diagrams without labels are decoration.** A block diagram with boxes and arrows but no signal names, voltage levels, or data rates is a picture, not a design tool. The labels carry the information.
- **Don't document what the schematic already shows.** There's no need to write "R1 is connected between pin 3 and pin 7" — that's what the schematic is for. Documentation should capture what the schematic can't: why, alternatives, and constraints.
- **Undocumented decisions will be re-litigated.** If you don't record why a decision was made, the next person (or future you) will question it, possibly reverse it, and potentially reintroduce the problem the decision was meant to solve.
- **Version-control your documentation alongside your design files.** Documentation that lives in a different location from the schematic and layout will eventually drift out of sync. Keep them together in the same repository or project folder.
