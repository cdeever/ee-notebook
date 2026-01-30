---
title: "Block Diagrams as Thinking Tools"
weight: 10
---

# Block Diagrams as Thinking Tools

Block diagrams are not documentation — or rather, they're not just documentation. They are the primary design tool at the system level, the place where architecture decisions are made, challenged, and refined before any schematic symbol is placed. A good block diagram reveals problems. A missing block diagram hides them until they become expensive.

## What a Block Diagram Should Capture

A system-level block diagram should answer: what are the major functional blocks, how do they connect, and what flows between them? This sounds simple, but getting it right requires thinking through the design at a level of abstraction that many people skip in their rush to the schematic.

The essential elements:

- **Functional blocks.** Each block represents a function, not a component. "Signal conditioning" is a block. "INA219" is a component that lives inside a block. Keeping the diagram at the functional level prevents premature commitment to specific parts.
- **Signal flow.** Arrows showing the direction and type of signals: analog, digital data, control, clock. The direction matters — it reveals dependencies and identifies which blocks are sources and which are sinks.
- **Power domains.** Where power enters the system and how it's distributed. This includes voltage conversion, regulation, and which blocks share a supply. Power architecture is a design decision that affects noise, efficiency, and sequencing.
- **Interfaces to the outside world.** Sensors, actuators, user interfaces, communication ports. These define the system's boundaries and often impose constraints on the rest of the design.
- **Key parameters.** Signal levels, data rates, sample rates, power consumption estimates — the quantitative information that drives design choices. A block diagram without numbers is a picture; a block diagram with numbers is a design tool.

## Levels of Detail

Not all block diagrams serve the same purpose. Different levels of abstraction answer different questions:

**System-level diagram.** Shows the entire system in one view. Answers: what are the major subsystems and how do they interact? This fits on one page and is the first thing you draw. It's also the diagram you show someone who asks "what does your project do?"

**Subsystem diagram.** Zooms into one block from the system-level diagram and shows its internal structure. A "sensor interface" block at the system level might expand into an excitation source, a signal conditioning chain, an ADC, and a digital interface. This level is where you start making circuit topology decisions.

**Detailed block diagram.** Close to a schematic but still abstracted. Shows specific functional stages (gain stage, filter stage, reference) with key parameter values. This is the bridge between architecture and circuit design — the last step before opening the schematic editor.

Each level serves a purpose. Jumping directly to the detailed level skips the systemic thinking that prevents integration problems later.

## Drawing Conventions

Consistency in how you draw block diagrams makes them easier to read and less likely to hide problems. Some conventions I've found useful:

- **Signal type differentiation.** Use different line styles or colors for analog signals, digital signals, and power connections. At minimum, distinguish power from signal. A single-color diagram with power and signal mixed together obscures the power architecture.
- **Direction arrows.** Always show signal direction. Bidirectional interfaces (I2C, SPI with MISO/MOSI) get double arrows or a note. A diagram without arrows is ambiguous.
- **Interface labels.** Name every connection between blocks. "SPI bus," "3.3V rail," "analog sensor output (0-2.5V)" — the label should be specific enough that someone could design the interface from the label alone.
- **Power entry.** Show where power comes in and how it's converted. A box labeled "power supply" is insufficient. Show the input source, the conversion stages, and which blocks are powered from which rails.
- **Boundary marking.** If the design spans multiple boards or multiple physical domains (analog/digital/RF), mark the boundaries. These boundaries become physical partitions in the layout.

## Iterating the Block Diagram

The block diagram should go through multiple revisions before the schematic is started. Each revision sharpens the architecture and reveals issues that are cheap to fix on paper and expensive to fix in copper.

Useful iteration questions:

- **Can each block be tested independently?** If a block can only be verified with the entire system running, testing and debugging will be painful. Consider how you would test each block in isolation and whether the interfaces support that.
- **Are the interfaces between blocks clearly defined?** If two blocks share an interface that's described as "data connection," that's not defined enough. What protocol? What voltage levels? What timing? Vagueness in the block diagram becomes ambiguity in the schematic, which becomes bugs in the hardware.
- **Is the power architecture visible?** If the block diagram doesn't show how power flows, the power design will be an afterthought. Power should be a first-class element of the architecture, not something added after the signal path is designed.
- **Are there circular dependencies?** If block A needs an output from block B to initialize, and block B needs an output from block A, you have a startup sequencing problem. Block diagrams reveal these loops when schematics might hide them across multiple sheets.
- **Is anything missing?** Common omissions: reset circuitry, programming/debug interfaces, status indicators, protection circuits, test access points. These are functional blocks that deserve representation even if they're simple.

## When the Block Diagram Reveals Problems

A well-drawn block diagram acts as a design review in itself. Problems that are difficult to see in a schematic are often obvious in a block diagram:

**Circular dependencies.** Block A generates a clock that block B needs, but block B generates the enable signal for block A. The block diagram shows this as a loop; the schematic might spread it across three sheets where the loop isn't visible.

**Missing functions.** The sensor block feeds the ADC, and the ADC feeds the MCU, but there's no anti-aliasing filter between the sensor and the ADC. At the block level, this gap is obvious. In a schematic, you might not notice the missing stage until you see aliasing artifacts in the data.

**Power architecture gaps.** The system has a 3.3V block and a 5V block, but no level translation between them. The block diagram shows two power domains with a digital interface crossing the boundary — that crossing needs a level translator.

**Unclear ownership.** Two blocks both seem responsible for a function. Who handles overcurrent protection — the power supply block or the load? The block diagram forces this decision before the schematic makes it implicit.

**Unnecessary complexity.** If the block diagram has 15 blocks for a project that should be simple, something has gone wrong. Either the architecture is over-complicated or the level of decomposition is too fine. In either case, simplifying the block diagram simplifies the design.

## Block Diagrams for Small Projects

Even small projects benefit from a block diagram, though it might be a five-minute sketch on a notepad rather than a formal drawing. A one-sensor, one-MCU, one-display project has at least four blocks: sensor interface, processing, display, and power. Drawing those four blocks with their connections — even informally — forces you to think about the interfaces and power before jumping to the schematic.

The investment is tiny. The return is disproportionate. The five-minute sketch might reveal that the sensor output range doesn't match the MCU's ADC input range, or that the display needs 5V but the MCU runs at 3.3V. Better to discover these on paper than after the PCB arrives.

## Gotchas

- **A block diagram is not a schematic with big boxes.** If you're showing component-level detail in the block diagram, you've gone too deep. Stay at the functional level. The schematic is where components live.
- **Don't skip the power architecture.** It's tempting to leave power off the block diagram because "it's just a regulator." Power distribution affects noise, sequencing, and fault behavior. It deserves first-class representation.
- **Label your interfaces with numbers, not just names.** "Analog signal" tells you nothing about design constraints. "0-2.5V analog, 10 kHz bandwidth, 100 ohm source impedance" tells you nearly everything you need to design the receiving block.
- **Update the block diagram when the design changes.** An outdated block diagram is worse than no block diagram — it gives false confidence that the architecture is understood. If you add a block to the schematic, add it to the block diagram too.
- **Don't confuse physical layout with logical architecture.** Blocks that are logically separate may share a chip (e.g., a dual op-amp serves two different signal conditioning functions). The block diagram shows logical functions; the schematic shows physical implementation.
- **Time spent on the block diagram is not time wasted.** Every hour spent iterating the architecture saves multiple hours of schematic rework, layout redo, and debugging. It doesn't feel productive because you're not placing components, but it's the highest-leverage activity in the design process.
