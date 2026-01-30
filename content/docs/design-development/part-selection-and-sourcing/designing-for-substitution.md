---
title: "Designing for Substitution"
weight: 60
---

# Designing for Substitution

The most supply-chain-resilient design is one where parts can be changed without changing the board. This sounds idealistic, but practical techniques exist that make substitution realistic for many — though not all — components. The idea isn't that every part is interchangeable, but that the design deliberately avoids unnecessary lock-in to specific components, manufacturers, or proprietary interfaces. When a supply disruption happens, the question shifts from "how do we redesign the board?" to "which approved alternate do we populate?"

## The Principle of Deliberate Flexibility

Designing for substitution is a mindset that runs through every design decision. It asks: "Is there a way to accomplish this function that doesn't lock me into a single source?" Sometimes the answer is no — a specific FPGA or a specialized sensor has no alternative, and you accept that dependency. But surprisingly often, a small amount of design flexibility eliminates single-source dependencies without compromising performance.

The cost of flexibility is usually small: a few extra pads on the PCB, an adjustable regulator instead of a fixed one, or a standard interface instead of a proprietary one. The cost of inflexibility becomes apparent only when the supply chain breaks — and then it's enormous.

This connects directly to the [second-source strategies]({{< relref "/docs/design-development/part-selection-and-sourcing/second-source-strategies" >}}) discussed earlier, but goes deeper: instead of just identifying alternates, you're designing the circuit and layout to accommodate them.

## Generic Footprints

Many functional categories of components share standard packages. By selecting parts that fit common footprints, you maximize the number of potential substitutes.

**SOT-23 family.** The SOT-23-3, SOT-23-5, and SOT-23-6 packages are used for an enormous range of small-signal transistors, MOSFETs, voltage references, LDOs, op-amps, and supervisors. If your regulator fits in a SOT-23-5, dozens of alternates from different manufacturers likely share the footprint.

**SOIC-8.** The classic 8-pin SOIC is home to op-amps, voltage regulators, EEPROM, serial flash, gate drivers, and many other IC types. Designing around SOIC-8 parts gives you a wide substitution pool.

**Standard passive sizes (0402, 0603, 0805, 1206).** Passives in these standard imperial sizes are manufactured by dozens of companies. The packages are identical across manufacturers, so substitution is trivial — you're changing a BOM line, not a footprint.

The tradeoff: generic packages sometimes mean accepting larger size, higher cost, or fewer features compared to a vendor-specific optimized package. A QFN-20 part might offer better thermal performance and smaller size than an SOIC-8 equivalent, but the SOIC-8 has more substitution options. Choose based on what matters more for your application.

## Flexible Power Regulation

Power supply design is one of the most impactful areas for substitution-friendly design, because voltage regulators are among the most commonly affected by supply shortages.

**Adjustable regulators with external feedback resistors** are inherently more flexible than fixed-output regulators. A fixed 3.3V regulator is a specific part number. An adjustable regulator set to 3.3V by external resistors can be substituted with any adjustable regulator in the same package and topology — the output voltage is set by your components, not the IC's internal reference divider.

This doesn't mean adjustable regulators are always better. Fixed regulators are simpler (fewer external components, no resistor tolerance to worry about), and for common voltages (1.8V, 2.5V, 3.3V, 5V) fixed parts are widely available from many manufacturers. But for less common voltages or when supply resilience is critical, the adjustable approach provides flexibility.

**Standard topologies.** Using well-established regulator topologies (buck, boost, LDO) with standard control architectures means the design methodology transfers across manufacturers. A voltage-mode buck controller from TI and a voltage-mode buck controller from Microchip may have different part numbers and slightly different pinouts, but the surrounding circuit — inductor, capacitors, feedback network — follows the same design approach. Understanding the topology deeply, as discussed in [Reference Designs]({{< relref "/docs/design-development/schematic-design/reference-designs" >}}), makes substitution tractable.

## Standard Interfaces

Choosing standard communication interfaces over proprietary ones maximizes the number of compatible peripheral components.

**I2C sensors** from different manufacturers (Bosch, TI, Sensirion, STMicroelectronics) all communicate over the same two-wire bus. An I2C temperature sensor from manufacturer A can be substituted with an I2C temperature sensor from manufacturer B. The register map and commands differ, but the physical interface is the same, and the firmware adaptation is usually straightforward.

**SPI devices** follow a similar pattern, though SPI is less standardized (clock polarity and phase conventions vary). Still, the physical interface — four wires, standard logic levels — is universal.

**UART/serial interfaces** are the most universal of all. Any device with a standard serial port (UART TX/RX at common baud rates) can communicate with any other.

The firmware implication: if your software is structured with a hardware abstraction layer (HAL) that separates the communication protocol from the sensor-specific commands, swapping a sensor becomes a firmware update rather than a hardware redesign. This is a software architecture decision that directly supports hardware flexibility.

## Pad-Out Footprints

Pad-out footprints are physical features on the PCB that accommodate multiple component options without requiring a board respin. They're a layout technique, but they start with a schematic decision to include the option.

**Dual footprints.** Some PCB layout tools support placing two overlapping or adjacent footprints for the same functional position. The board can be assembled with either part. This works well for components that come in multiple standard packages — an SOIC-8 outline with overlapping DFN-8 pads, for example.

**Alternate component pads.** For passives, placing pads for a larger or smaller package adjacent to the primary pad gives assembly flexibility. An 0603 footprint with extended pads that also accept an 0805 component provides options without increasing board area significantly.

**Unpopulated option positions.** Including schematic positions for components that are only populated in certain configurations. A filter stage that can be bypassed with a zero-ohm resistor, an alternate clock source that's populated only if the primary crystal isn't available, or additional decoupling positions that can be used if a different regulator requires them.

The cost of pad-out footprints is board area. Every extra pad takes space, and in dense designs, space is precious. The tradeoff evaluation: is the flexibility worth the area? For critical components (regulators, main ICs, expensive or hard-to-source parts), it usually is. For commodity passives, it usually isn't.

## Software-Configurable Behavior

Modern embedded systems can adapt to hardware variations through firmware, extending the concept of substitution beyond passive swapping into active adaptation.

**Auto-detection of hardware variants.** Firmware can read a hardware revision pin or I2C address to determine which sensor is populated and adjust its driver accordingly. This enables the same board to be assembled with different component options based on availability.

**Configurable parameters.** Instead of hard-coding timing values, calibration constants, or threshold levels, store them in a configuration structure that can be updated for different hardware variants. When a sensor substitute has a different sensitivity or offset, the firmware adapts without a code rewrite.

**Feature flags.** If a hardware substitution changes the available features (a cheaper ADC with fewer channels, a radio module with different frequency bands), firmware feature flags enable or disable functionality based on the populated hardware.

This approach requires upfront software architecture investment but pays dividends in production flexibility. The board becomes a platform that accommodates multiple hardware configurations, rather than a rigid implementation tied to specific parts.

## Documentation: The Substitution Manual

None of the flexibility in the world helps if the information about approved substitutes, required changes, and tested configurations isn't documented and accessible.

The substitution documentation should include:

- **For each critical component:** primary part, approved alternates, qualification status, and any electrical or mechanical differences.
- **For each alternate:** specific changes needed — BOM line changes, firmware configuration changes, assembly process changes, test procedure changes.
- **For the board:** which pad-out positions are available, what components they accept, and which configurations have been tested.
- **For the firmware:** which hardware variants are supported, how variant detection works, and what parameters change between variants.

This documentation lives alongside the BOM and design files. It should be reviewed and updated whenever a new alternate is qualified or an existing alternate's availability changes.

## Gotchas

- **Over-designing for flexibility adds cost and complexity.** Not every component needs substitution flexibility. Focus on the components most likely to be disrupted: high-value semiconductors, specialized parts, and anything with a history of supply problems. Standard passives in standard packages are already inherently substitutable.
- **Dual footprints can cause assembly confusion.** If the PCB has pads for two different packages, the assembly documentation must clearly indicate which option to populate. A board with unexplained extra pads invites questions and potential errors on the assembly line.
- **Adjustable regulators require tighter resistor tolerances.** The output voltage accuracy of an adjustable regulator depends on the tolerance of the feedback resistors. A fixed regulator might guarantee 1% output accuracy; an adjustable regulator with 1% resistors might achieve only 2-3% accuracy. Account for this in your design margin.
- **Software abstraction layers have performance costs.** Adding indirection for hardware flexibility (HAL layers, configurable drivers) adds code size and execution time. For most applications this is negligible, but for real-time or resource-constrained systems, verify that the abstraction doesn't violate timing or memory constraints.
- **Substitution testing must cover the full operating range.** A substitute part that works at room temperature on the bench may fail at temperature extremes or under load conditions that stress it differently than the primary part. Test substitutes under worst-case conditions, not just typical conditions.
- **The best time to design for substitution is during initial design.** Adding flexibility after the board is laid out is expensive (board respin). Adding it during schematic design costs almost nothing. Consider substitution as a design requirement from the start, not a retrofit.
