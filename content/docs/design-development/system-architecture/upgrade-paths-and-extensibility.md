---
title: "Upgrade Paths & Extensibility"
weight: 40
---

# Upgrade Paths & Extensibility

Every design exists in time. Today's requirements will evolve, features will be added, and limitations will be discovered. Designing for the next version while building the current one is a balancing act — too little extensibility and you're redesigning from scratch, too much and you've wasted board space, budget, and complexity on capabilities that may never be used.

## Thinking One Step Ahead

Extensibility doesn't mean predicting the future. It means leaving doors open that are cheap to leave open and expensive to cut later. The key insight is asymmetry: some design decisions cost almost nothing to make extensible now but would require a board respin to add later. Those are the decisions worth getting right.

Examples of cheap extensibility:

- **An extra I2C address on the bus.** If the I2C bus is already routed, adding another sensor later requires only an unpopulated footprint and a pullup resistor. The bus is already there.
- **Unpopulated footprint for an optional filter.** A placeholder for a series inductor or RC filter costs nothing if unpopulated but saves a board revision if filtering turns out to be needed.
- **Test points on key signals.** A via or pad on a signal line costs zero board area (the via might already be needed for routing) and provides invaluable access for debugging and validation.
- **A few spare GPIO pins broken out to a header.** If the MCU has unused GPIO pins, routing them to a header costs a few millimeters of board space and provides expansion capability.

These are small bets with disproportionate returns. The cost of inclusion is minimal; the cost of absence is a board revision.

## Header Pins and Test Points

Test points and header pins serve dual roles: they're debugging aids for the current version and expansion ports for the next one.

**Test points** provide access to signals that are otherwise buried under components or inside multi-layer boards. Good test point placement:

| Signal type | Test point location | Why |
|---|---|---|
| Power rails | Near regulators and near loads | Verify voltage at both ends; catch drop across traces |
| Ground | Near sensitive analog circuits | Verify ground potential at the measurement point |
| Clock signals | Near the clock source and near receivers | Check signal integrity at both ends |
| Communication buses | Near the master device | Probe without loading the bus at the receiver |
| Analog signals | After each signal conditioning stage | Verify gain, offset, and noise at each stage |

**Header pins** provide electrical access in a mechanically robust format. A row of 0.1" headers is easy to probe, easy to clip onto, and easy to connect to an expansion board. For the current version, they're debug access. For the next version, they might carry signals to a daughter board.

## Footprints for Optional Components

A powerful extensibility technique is placing footprints on the PCB that are populated only if needed. This costs board area but no BOM cost for the initial version.

Common optional footprints:

- **Series resistors as zero-ohm jumpers.** Place a 0603 footprint in series with a signal trace. Populate with a zero-ohm resistor (jumper) for normal operation, or replace with a resistor value if signal attenuation turns out to be needed.
- **Filter components.** RC or LC filter footprints on power rails or signal lines. Leave unpopulated in rev 1; populate if noise testing reveals a need.
- **Bypass and decoupling.** Extra capacitor footprints on power rails near sensitive components. More decoupling can be added without a board change.
- **Alternate component footprints.** A pad layout that accommodates two different component packages. If the preferred part becomes unavailable, the alternate can be used without layout changes.

The trick is restraint. Every optional footprint adds board area and visual complexity. Place them where you have reason to believe they might be needed, not everywhere "just in case."

## Software-Configurable Behavior

One of the most powerful extensibility strategies is moving design decisions from hardware to software. See [When Software Beats Hardware]({{< relref "/docs/design-development/ideation-and-requirements/when-software-beats-hardware" >}}) for a broader discussion. In the context of extensibility:

- **Programmable gain amplifiers (PGAs)** allow the input range to be adjusted in firmware instead of by changing resistors.
- **Software-selectable mux channels** let the firmware choose which sensor to read without hardware switching.
- **Configurable communication parameters** (baud rate, address, protocol mode) can be changed in firmware for different deployment scenarios.
- **Feature flags in firmware** enable or disable capabilities without hardware changes. A feature that's not ready for the current version can be developed and enabled in a firmware update.

Software configurability shifts the cost of change from a board revision (weeks and dollars) to a firmware update (hours and free). This is enormously valuable for products that might need to adapt to different use cases or evolving requirements.

## Modular Design

Modularity — breaking the system into physically separate modules connected by defined interfaces — is extensibility at the system level:

**Daughter boards.** A main board with a connector for a daughter board allows the sub-function to be changed without redesigning the main board. This is common for RF modules, sensor interfaces, and communication interfaces where the specific requirements might change between applications.

**Mezzanine connectors.** Board-to-board connectors (high-density pin headers, card-edge connectors) allow compact stacking of functional modules. The physical interface (connector type, pinout) becomes the contract between modules.

**Plug-in modules.** Commercially available modules (Adafruit Feather, Arduino shields, Raspberry Pi HATs) follow standard form factors and pinouts. Designing your main board to accept a standard module provides access to a large ecosystem of pre-built functions.

The interface between modules is critical — it must be well-defined, well-documented, and stable. Changing the interface between modules defeats the purpose of modularity, because all modules must change when the interface changes.

## The Cost of Extensibility

Extensibility is not free. Every door left open has a cost:

- **Board area.** Unpopulated footprints, extra headers, and wider connector options all consume PCB space.
- **Routing complexity.** Extra signals routed to expansion headers may complicate the layout of the current version.
- **Connector cost.** Even unpopulated, connector footprints reserve board space and may require keep-out zones.
- **Cognitive load.** A board with many optional features is harder to document, assemble, and debug. Which footprints should be populated? What does each header carry?
- **Testing burden.** Optional configurations that are theoretically supported but never tested are a liability, not an asset.

The cost is worth paying when the extensibility addresses a known or likely future need. It's waste when it addresses a hypothetical need that no one has articulated.

## When NOT to Design for Extensibility

Not every project benefits from extensibility planning:

- **One-off projects.** If the board will be built once and never revised, extensibility features add complexity for zero benefit. Use the board area for better routing or test access instead.
- **Learning prototypes.** When the purpose is to learn how a circuit works, extensibility is a distraction. Build the simplest version that demonstrates the concept. What you learn will inform the next design — which will probably be a fresh start anyway.
- **Tight board constraints.** When every square millimeter of board space matters (very small form factors, dense designs), the area consumed by optional footprints and expansion headers may be unacceptable. In this case, extensibility must give way to the size constraint.
- **Time-critical designs.** Adding extensibility features takes design time. If the schedule is tight, spending time on features for a hypothetical next version is a poor allocation of the scarce resource (your time).

The decision framework is: does the cost of including this extensibility feature now exceed the cost of adding it in a future revision? If so, defer it.

## Gotchas

- **Unpopulated footprints need documentation.** If the board has 10 optional footprints and no documentation about what they're for, the next person (or future you) will have no idea which ones to populate or why. Label them in the silkscreen or the schematic.
- **Expansion headers can create EMC problems.** Long header pins act as antennas. If expansion headers carry high-speed signals and are left unconnected (floating), they can radiate interference or pick up noise. Consider pullup/pulldown resistors on critical signals.
- **Software configurability requires testing each configuration.** A system that can be configured in 10 different ways hasn't been validated unless each configuration has been tested. Untested configurations are features in name only.
- **Modularity adds connector resistance and inductance.** Every board-to-board connection adds contact resistance and inductance. For high-current power paths and high-speed signals, this matters. A modular design may perform differently than a monolithic one.
- **Don't design for flexibility you'll never use.** It's satisfying to build in expansion capability, but if the project has a well-defined scope that won't change, the expansion features are wasted effort. Design for what you need, not what you might hypothetically want.
- **Spare GPIOs are only useful if they're routed out.** An MCU with 8 unused pins is only extensible if those pins are accessible. If they're not connected to any pad or header, they might as well not exist. Route them out or accept that they're not available for future use.
