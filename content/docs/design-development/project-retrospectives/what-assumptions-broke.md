---
title: "What Assumptions Broke"
weight: 30
---

# What Assumptions Broke

Every design is built on a foundation of assumptions — beliefs about how the world works that are taken as given rather than verified. Some are explicit: "the input voltage will be between 9V and 15V." Many are implicit: "this part will be available when I need it," "the datasheet is accurate," "my simulation model matches reality." When an assumption turns out to be wrong, the design built on top of it becomes wrong in ways that can be subtle, expensive, and maddening to diagnose.

## Categories of Broken Assumptions

Broken assumptions tend to fall into recognizable patterns. Understanding the categories helps you know where to look:

**Technical assumptions.** These are beliefs about how the hardware will behave. "The sensor output is 0-3.3V" — but it's actually 0-2.5V with a common-mode offset that saturates the ADC. "The op-amp bandwidth is sufficient at unity gain" — but the capacitive load destabilizes the output stage. "The thermal pad is optional" — but without it, the regulator shuts down at 70% load. Technical assumptions break when the designer's model of the component or circuit is incomplete, which usually means the datasheet was skimmed rather than studied, or a parameter was trusted at its typical value rather than its worst-case.

**Environmental assumptions.** These are beliefs about the conditions the product will operate in. "It will operate indoors at room temperature" — but the enclosure sits in a south-facing window in direct sunlight, reaching 65C internally. "The power source is a regulated bench supply" — but the actual power source is a car battery with 300mV of alternator ripple. "The environment is electrically quiet" — but there's a motor driver on the same power bus generating switching transients every millisecond. Environmental assumptions break when the designer imagines a benign operating context that doesn't match reality.

**Supply chain assumptions.** "This part is always in stock." It's not — lead times shifted from 4 weeks to 52 weeks during the last semiconductor shortage, and the design couldn't be built. "There's a drop-in replacement." There isn't — the alternative has a different thermal pad configuration that requires a board respin. "The price is stable." It's not — a passives shortage tripled the cost of the MLCC capacitors that make up half the BOM. Supply chain assumptions are particularly dangerous because they exist outside the technical domain where most designers feel competent.

**Timeline assumptions.** "Layout will take two weeks." It took six, because the mechanical constraints weren't finalized, the keep-out zones changed twice, and a critical component footprint was wrong. "Firmware will be ready by the time the boards arrive." It wasn't, because the firmware depended on a driver library that didn't support the chosen MCU variant. "The review will take one meeting." It took four, because each review uncovered issues that required investigation and redesign. Timeline assumptions break because designers estimate based on the work itself and forget to account for dependencies, interruptions, iterations, and the unknown unknowns.

## Why Assumptions Break

Assumptions break for a few fundamental reasons:

- **Incomplete information.** You didn't know what you didn't know. The datasheet didn't specify the parameter you needed. The operating environment wasn't fully characterized. The supplier didn't disclose the upcoming end-of-life notice.
- **Overconfidence in models.** Simulation is a model of reality, not reality itself. Every model omits details, and those omitted details sometimes matter. A SPICE simulation that excludes parasitic capacitance may predict stable behavior in a circuit that oscillates on the bench.
- **Extrapolation from past experience.** "It worked last time" is a powerful but unreliable heuristic. Conditions change, and a design that worked in one context may fail in a slightly different one.
- **Wishful thinking.** Sometimes the assumption is less "I believe this is true" and more "I hope this is true." The designer knows the margin is thin but presses forward because the alternative is a more complex (and time-consuming) design. Hope is not an engineering strategy, but it masquerades as one more often than anyone likes to admit.

## Identifying Broken Assumptions

The retrospective exercise is simple: for each problem encountered during the project, ask "what did I believe was true at the start that turned out to be false?" Then go further: what would I have done differently if I'd known the truth from the beginning?

This second question is critical because it separates the assumption from the consequence. The broken assumption is the diagnosis. The alternative approach is the prescription.

Examples:

- **Assumption:** The 3.3V LDO will handle the MCU's peak current. **Reality:** The MCU's radio transmit burst draws 350mA for 5ms, causing the LDO to droop below the brown-out threshold. **Alternative:** Would have chosen a regulator with better transient response, or added a bulk capacitor to handle the burst.
- **Assumption:** The PCB footprint library is correct. **Reality:** The QFN footprint had the wrong thermal pad size, causing solder voids and intermittent thermal shutdown. **Alternative:** Would have verified the footprint against the manufacturer's recommended land pattern before ordering the first board.
- **Assumption:** The enclosure has sufficient ventilation. **Reality:** The sealed enclosure reached 85C internally in summer conditions. **Alternative:** Would have done a thermal analysis — even a rough one — before finalizing the enclosure design. Would have coordinated with the [mechanical constraints]({{< relref "/docs/design-development/pcb-layout-and-physical-integration" >}}) earlier in the process.

## Converting Broken Assumptions into Checks

The highest-value output of an assumption audit is a checklist of things to verify on future projects. Each broken assumption becomes an explicit check:

- "The sensor output range matches the ADC input range" becomes a check: verify sensor output range (min, max, common mode) against ADC input specification before schematic review.
- "The component is in stock" becomes a check: verify distributor stock and lead time for all critical components before committing to the design.
- "The thermal design is adequate" becomes a check: estimate worst-case power dissipation and verify that the thermal path can handle it before ordering the board.

Over time, these checks accumulate into a design review checklist that catches the most common failure modes before they become problems. Each broken assumption that's converted into a check prevents the same mistake from recurring — see [turning mistakes into patterns]({{< relref "/docs/design-development/project-retrospectives/turning-mistakes-into-patterns" >}}).

The checklist doesn't need to be exhaustive. It just needs to cover the assumptions that have actually broken in your experience. That makes it personal, relevant, and likely to grow with every project.

## Gotchas

- **The most dangerous assumptions are the ones you don't know you're making.** Explicit assumptions can be verified. Implicit assumptions — the ones so deeply embedded that you don't even recognize them as assumptions — are the ones that blindside you.
- **Datasheet typical values are not design values.** A parameter listed as "typical 10mA" might be "maximum 25mA" under worst-case conditions. Design to the worst case, not the typical.
- **"It worked on the bench" is the weakest form of validation.** The bench is a controlled environment with ideal power, stable temperature, and short cables. The field is none of these things.
- **Broken assumptions are not personal failures.** Every designer makes assumptions — it's impossible to verify everything. The failure is not in making assumptions but in not examining them when things go wrong.
- **The same assumption can break in different ways on different projects.** "Sufficient margin" is an assumption that breaks repeatedly, but the specific parameter that's marginal changes each time. The meta-lesson is: always check margin, on everything.
