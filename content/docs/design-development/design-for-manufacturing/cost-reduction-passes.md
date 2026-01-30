---
title: "Cost-Reduction Passes"
weight: 30
---

# Cost-Reduction Passes

Every component on a bill of materials costs money — not just the part cost, but the placement cost (machine time and feeder setup), the procurement cost (sourcing and stocking a unique part number), and the failure probability (every part is another potential defect). Cost reduction isn't about being cheap; it's about eliminating waste that doesn't contribute to the product's function. The discipline of systematic cost-reduction passes, applied after the design works but before it ships, is how experienced engineers turn a functional prototype into an efficient product.

## The First Pass: Remove Unnecessary Components

The most effective cost reduction is subtraction. Every component that isn't on the board costs nothing to procure, place, inspect, and repair. The question for each component is: what happens if I remove it?

Components that frequently survive the first scrutiny:

- **Indicator LEDs.** They're useful during development, but does the final product need a power LED? A status LED? If the product has no user-facing surface, probably not.
- **Unused I/O pull-ups/pull-downs.** Resistors on MCU pins that are configured as outputs, or pull-ups on I2C lines where the chip has internal pull-ups enabled.
- **Over-specified decoupling.** A 100nF cap on every power pin is standard practice, but some ICs don't need them all. Check the datasheet — some pins share internal power planes, and the recommended decoupling is fewer caps than there are pins.
- **Test points used only during development.** If a test point served its purpose during bring-up and won't be needed in production testing, it can be removed. But be careful here — the line between "development only" and "field diagnostic" is easy to misjudge.
- **Protection components for conditions that can't occur.** An ESD protection diode on an internal signal that never reaches a connector is wasted. A TVS on a power rail that's already clamped by an upstream regulator is redundant.

This first pass often saves 5-15% of the BOM line count, and every removed component simplifies assembly and improves yield.

## Component Consolidation

Sometimes two or more components can be replaced by one:

- **Integrated solutions.** A voltage regulator that includes soft-start, enable, and power-good functions might replace a simpler regulator plus three external components. The single-chip solution costs more per unit, but the total cost — including the eliminated parts, their pads, and their assembly — is often lower.
- **Resistor arrays.** Four pull-up resistors to the same rail can be replaced by a single four-element resistor array in one package. One placement instead of four, one part number instead of four identical ones.
- **Multi-channel ICs.** A quad op-amp replacing four singles. A dual MOSFET replacing two discretes. The trade-off is that a failure in one channel takes out the whole IC, but for non-critical functions, the consolidation is usually worth it.
- **MCU peripheral integration.** Sometimes an external component (ADC, DAC, comparator, op-amp) can be replaced by an internal peripheral of the MCU. This requires verifying that the integrated peripheral meets the performance requirements, which it often does for non-demanding applications.

Consolidation reduces BOM line count, placement count, and board area. But it can also reduce flexibility — a consolidated design is harder to modify if one function needs to change.

## Package Optimization

The component package affects both material cost and assembly cost:

- **Smaller isn't always cheaper to buy, but it can be cheaper to place.** SMT assembly cost is partially driven by reel changes. If you can use fewer unique packages (all 0402, for instance), the machine needs fewer feeder setups.
- **Standard packages cost less.** A 0603 resistor in a standard E96 value costs fractions of a cent. The same value in an 01005 package may cost several times more due to lower volume and more demanding handling.
- **Footprint compatibility.** When selecting between alternative components, preferring ones that share footprints with existing parts on the BOM means fewer unique pads on the board and potentially fewer stencil aperture variations.

The package optimization pass should consider the assembly method. A board assembled by hand has very different package preferences than one assembled by pick-and-place. An 0402 is efficient for machine assembly but torturous for hand soldering.

## Standard Values

The electronic component supply chain is built around preferred number series (E12, E24, E96). Parts at standard values — 10K, 4.7K, 100nF — are manufactured in enormous volumes and cost very little. Parts at odd values — 9.76K, 47.5nF — cost more because they're lower volume, may have longer lead times, and may be single-sourced.

Practical implications:

- **Design around standard values where possible.** If a voltage divider can use 10K and 4.7K instead of 9.76K and 4.53K, the circuit costs less and the parts are easier to source. The slight accuracy difference rarely matters — if it does, you probably need 0.1% tolerance resistors regardless.
- **Check value availability before finalizing.** It's easy to specify a value in a schematic that doesn't exist as a real component. Run the BOM against distributor stock early in the design process.
- **Fewer unique values reduce procurement complexity.** If you can use 10K resistors everywhere instead of 10K, 10.2K, and 9.76K, you stock one reel instead of three.

## BOM Reduction

The number of unique part numbers on the BOM — the line item count — drives procurement overhead independently of quantity. Each unique part must be sourced, ordered, received, inspected, kitted, and loaded into a feeder. Reducing the number of unique parts simplifies the entire supply chain.

Strategies for BOM reduction:

- **Rationalize passives.** Do you really need both 22K and 22.1K resistors? Can all decoupling caps be 100nF instead of a mix of 100nF and 47nF?
- **Use the same connector family throughout.** Instead of three different connector series, standardize on one that covers all your interconnect needs.
- **Reduce the number of voltage rails.** Each additional voltage rail requires a regulator, decoupling, and potentially a sequencing circuit. Can two 3.3V rails become one? Can a 2.5V rail be eliminated by choosing components that work at 3.3V?
- **Second-source everything.** Parts with multiple manufacturers are inherently cheaper and more available. A single-source component may cost more and creates supply chain risk.

## When Cost Reduction Hurts

Cost reduction has diminishing returns, and beyond a certain point, it creates more problems than it solves:

- **Removing test points.** Eliminating test access to save pennies per board can cost hours per unit in field diagnostics. Test points are cheap insurance. Consider what you'll need when a unit comes back from the field with an intermittent fault — see also [serviceability]({{< relref "/docs/design-development/design-for-manufacturing/serviceability" >}}).
- **Eliminating protection components.** TVS diodes, ferrite beads, and reverse-polarity protection cost a few cents each. The warranty claim when a unit fails from an ESD event costs far more.
- **Reducing design margins.** Using a regulator at 95% of its current rating to avoid stepping up to a larger (more expensive) part saves money until the first thermal shutdown in the field.
- **Combining functions that shouldn't be combined.** Putting a noisy digital function on the same IC as a sensitive analog function to save a part may compromise performance in ways that are hard to debug.

## The Total Cost Picture

BOM cost is the most visible cost, but it's not the only one — and it's often not the largest:

- **BOM cost** — The sum of all component costs at the expected purchase quantity.
- **Assembly cost** — Machine time, labor, setup, stencil, and programming. Driven by placement count and complexity, not just BOM cost.
- **Test cost** — The time and equipment needed to verify each unit. A design without test access requires manual probing, which is slow and expensive.
- **Yield loss** — Scrap and rework from defective units. A 95% yield means 5% of material and assembly cost is wasted.
- **Warranty cost** — Field failures that require repair or replacement. A $0.10 protection component that prevents a $50 warranty claim is the cheapest part on the board.

Real cost optimization considers all of these together. The lowest-BOM-cost design is not always the lowest-total-cost design.

## Gotchas

- **Cost reduction is addictive.** Once you start removing components, it's tempting to keep going until you've stripped the design of necessary margin and protection. Know when to stop.
- **Don't cost-reduce during the first prototype.** The first revision exists to validate the design, not to be cheap. Add the test points, include the debugging LEDs, use the larger packages. Cost-reduce on the second revision, after you know the design works.
- **BOM cost per unit depends on quantity.** A component that costs $2 in quantity 10 may cost $0.20 in quantity 10,000. Cost-reduction decisions made at prototype quantities may not apply at production quantities, and vice versa.
- **The assembly house's setup cost is fixed.** Reducing the BOM from 120 parts to 115 parts saves five placements per board, but the setup cost for the run is unchanged. The per-unit savings may be negligible at low volumes.
- **Removing a part is forever; adding one back requires a respin.** Be conservative about removing components. If there's any doubt about whether a part is needed, leave it in and add a "do not place" (DNP) option instead.
