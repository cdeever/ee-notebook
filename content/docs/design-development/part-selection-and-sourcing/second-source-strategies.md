---
title: "Second-Source Strategies"
weight: 30
---

# Second-Source Strategies

A single-source component is a single point of failure in your supply chain. If that one manufacturer has a production problem, a factory fire, a raw material shortage, or simply decides to discontinue the part, your design is stranded. Second-sourcing — designing with at least two interchangeable component options — is one of the most effective risk mitigation strategies in electronics design. It costs a little more effort during design but can save enormous pain during production.

## Why Second-Sourcing Matters

The argument for second-sourcing was always strong on paper, but the supply chain disruptions that began in 2020 made it viscerally real for the entire industry. Designers who had qualified alternate parts pivoted quickly; those who hadn't spent months redesigning boards or waiting in allocation queues.

Even outside global disruptions, supply problems happen routinely. A manufacturer's fab has a contamination event. A natural disaster disrupts a wafer fabrication plant. A product unexpectedly sells well and the manufacturer can't ramp production fast enough. Customer demand shifts and a distributor's stock evaporates. Any of these can turn a single-source dependency into a production stoppage.

Second-sourcing isn't just about crisis management. It also provides negotiating leverage on pricing, gives you options when lead times differ between manufacturers, and forces you to understand your design requirements deeply enough to evaluate alternatives — which often leads to better design decisions.

## Pin-Compatible Alternatives

The easiest form of second-sourcing: a part from a different manufacturer with the same package, same pinout, and similar enough specifications to be a drop-in replacement. The schematic doesn't change. The layout doesn't change. You simply update the BOM with a different manufacturer's part number.

Pin-compatible alternatives are common in certain component categories:

- **Op-amps.** Many standard op-amp configurations (single in SOT-23-5, dual in SOIC-8, quad in TSSOP-14) follow industry-standard pinouts. A TI OPAx340 can often be substituted with an Analog Devices AD8601 or a Microchip MCP6001, assuming the electrical parameters are compatible.
- **Voltage regulators.** Common fixed-output LDOs in SOT-23-5 or SOT-223 often share pinouts across manufacturers. The TI TLV1117 and ON Semi NCV1117 are pin-compatible 1.117V LDOs from different manufacturers.
- **Logic ICs.** The 74-series logic family has been second-sourced since its inception. TI SN74, NXP 74, Nexperia 74, and ON Semi MC74 parts are typically pin-compatible and spec-compatible.
- **Passive components.** Most resistors, capacitors, and inductors in standard packages (0402, 0603, 0805) are interchangeable across manufacturers, with the caveat that electrical characteristics (ESR, temperature coefficient, voltage derating) may differ.

The key word is "similar enough." Pin-compatible doesn't guarantee electrical equivalence. The alternate part's bandwidth, noise, offset voltage, output drive capability, or stability requirements might differ. Always compare the critical specifications — not just the headline numbers but the full datasheet parameters that affect your application.

## Functional Alternatives

When no pin-compatible substitute exists, the next option is a functional alternative: a different part that performs the same function but may have a different package, different pinout, or slightly different interface.

Functional alternatives require more design flexibility:

- **Different package.** The alternate might be in an SOIC-8 instead of a DFN-8. If the PCB layout includes footprint options for both packages (overlapping or adjacent pads), the swap is a BOM change plus an assembly change, but no board respin.
- **Different pinout.** Same package but different pin assignments require a layout change, which means a board revision. This is more expensive but still cheaper than a complete redesign.
- **Different electrical requirements.** The alternate might need different decoupling, different feedback component values, or different bias conditions. These changes should be documented in advance so the switch can be made quickly when needed.

The concept of pad-out footprints — discussed in [Designing for Substitution]({{< relref "/docs/design-development/part-selection-and-sourcing/designing-for-substitution" >}}) — is specifically aimed at supporting functional alternatives without board respins.

## Qualifying Second Sources

Identifying a potential alternate is the first step. Qualifying it — proving that it actually works in your circuit — is equally important and frequently skipped.

"They have the same specs on paper" is not qualification. Specifications are measured under specific conditions, and two parts with identical headline specs can behave differently in your circuit. An op-amp with the same bandwidth from a different manufacturer might have different phase margin with your feedback network, different output drive capability into your specific load, or different input bias current behavior.

A proper qualification process:

1. **Paper analysis.** Compare the complete datasheets, not just the summary tables. Look at the full parameter tables, the characteristic curves, and the absolute maximum ratings. Identify any parameters where the alternate is worse than the primary and assess whether the difference matters.
2. **Simulation.** If SPICE models are available for both parts, simulate the critical circuit sections with each model. Check that the performance difference is within your design margin.
3. **Prototype testing.** Build boards with the alternate part and test them through the full range of operating conditions. This is the only way to catch interaction effects that analysis and simulation miss.
4. **Documentation.** Record the qualification results — what was tested, what passed, what the margins were, and any design adjustments needed. This documentation is what lets you switch to the alternate quickly during a supply crisis.

For hobby projects and prototypes, the full qualification process may be excessive. But even at a small scale, at least verify the critical parameters on paper and test the alternate part on a development board before committing to it in a production design.

## When Single-Source Is Acceptable

Not every component needs a second source. The effort of identifying, qualifying, and maintaining an alternate is real, and for some components the risk doesn't justify it:

**Unique capability.** Some components have no real alternative — a specific FPGA, a unique sensor technology, a specialized ASIC. For these, second-sourcing isn't an option, and the mitigation strategy shifts to inventory management and design flexibility to accommodate a future replacement.

**Low-volume or prototype-only designs.** If you're building five boards for a lab setup, the risk of a supply disruption is low. The effort to qualify a second source isn't justified.

**Passive components with standard packages.** Standard resistors and capacitors in common packages are so widely sourced that single-manufacturer dependency isn't a realistic risk. You can usually switch between Yageo, Samsung, Murata, and TDK for common MLCC values without any design impact.

**Low-cost, high-availability parts.** Some parts are so cheap and widely available that single-sourcing is a non-issue. A generic 2N2222 transistor or a standard LM358 op-amp can be sourced from dozens of manufacturers.

The judgment call: how critical is this component to the design, how available are alternatives, and how much would a supply disruption cost? For a voltage regulator that's the heart of the power system, second-sourcing is essential. For a generic pull-up resistor, it's unnecessary.

## Maintaining an Alternate BOM

The value of second-sourcing is only realized if the alternate information is captured, maintained, and accessible when needed. An alternate BOM — a documented list of approved substitutions — is the mechanism.

The alternate BOM should include:

- **Primary part number and manufacturer.** The component currently specified in the design.
- **Alternate part number(s) and manufacturer(s).** One or more qualified alternatives.
- **Design adjustments required.** If the alternate needs different external components (feedback resistors, decoupling capacitors), document the changes. If it requires a different assembly process (different reflow profile, different orientation), note that too.
- **Qualification status.** Whether the alternate has been fully tested, paper-analyzed only, or is a theoretical match awaiting validation.
- **Performance differences.** Any parameters where the alternate is measurably different from the primary, and whether those differences affect system performance.

This document is a living artifact. It should be updated when new alternates are identified, when primary parts change, or when production testing reveals issues with an alternate. The alternate BOM is most valuable in a crisis — and a crisis is exactly when you don't have time to create it from scratch.

## Gotchas

- **"Pin-compatible" does not mean "electrically identical."** Two parts in the same package with the same pinout can have very different internal designs. Always verify the critical parameters for your application, not just the package outline.
- **Second-sourcing adds BOM management complexity.** Every alternate must be tracked, its qualification maintained, and its availability monitored. For designs with many components, this management overhead is significant. Focus second-sourcing effort on the critical few components, not every part in the BOM.
- **Qualification results expire.** Manufacturers update their processes and specifications over time. An alternate you qualified two years ago might now have different characteristics due to a die shrink or process change. Requalify periodically, especially for precision applications.
- **The supply chain crisis you prepare for isn't the one that hits.** You may second-source your regulator and find that the unavailable part is actually a mundane connector. Diversify your attention across the full BOM, not just the "important" semiconductors.
- **Cost of qualification scales with volume and criticality.** For a one-time prototype, reading two datasheets might suffice. For a medical device in production, qualification involves environmental testing, statistical analysis, and regulatory documentation. Match the rigor to the stakes.
