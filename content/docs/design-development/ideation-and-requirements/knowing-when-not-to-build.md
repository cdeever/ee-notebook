---
title: "Knowing When Not to Build"
weight: 60
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Knowing When Not to Build

The most efficient design is the one that doesn't need to exist. This sounds obvious, but the pull toward building custom hardware is strong — especially for people who enjoy electronics and have the skills to design boards. The question isn't whether a custom board *can* be built, but whether it *should* be, given the alternatives available and the real costs involved.

## The Appeal of Custom

Custom hardware is appealing for real reasons:

- **Control.** Every component, every trace width, every connector is a deliberate choice. Nothing is a compromise imposed by someone else's design decisions.
- **Learning.** Designing and building custom electronics teaches things that using modules never will. The learning value is genuine.
- **Satisfaction.** There's a real sense of accomplishment in a working custom board. It's yours in a way that a purchased module isn't.
- **Exact fit.** Custom hardware can be precisely tailored to the application — no unused features, no wasted space, no unnecessary cost.

These are valid motivations. The problem arises when they override a rational evaluation of alternatives. Building custom when a better option exists isn't engineering — it's hobby time. Which is fine, as long as the distinction is recognized.

## Buy vs Build Analysis

A useful buy-vs-build evaluation considers several dimensions:

| Factor | Buy (off-the-shelf) | Build (custom) |
|---|---|---|
| **Design time** | Zero — it's already designed | Hours to months depending on complexity |
| **Testing and validation** | Done by the vendor | Falls entirely on the designer |
| **Documentation** | Usually provided | Must be created from scratch |
| **Ongoing support** | Vendor provides updates and fixes | Maintained indefinitely by the designer |
| **Unit cost** | Higher per unit (includes vendor margin) | Lower per unit at volume |
| **NRE cost** | Zero | Significant (design, prototyping, tooling) |
| **Schedule** | Ships in days | Weeks to months for first prototype |
| **Customization** | Limited to what the vendor offers | Complete freedom |
| **Supply chain risk** | Vendor manages sourcing | Sourcing falls on the designer |

For most learning projects and one-off builds, the "buy" column wins on nearly every factor except customization and learning. The breakeven where custom becomes economically rational typically requires volume or a genuinely unique requirement that no existing product meets.

## Evaluating Existing Solutions Honestly

There's a common pattern in technical communities: dismissing off-the-shelf solutions without a serious evaluation. "That module is overkill," "the breakout board has features I don't need," "I could design something better." Maybe, but at what cost?

A fair evaluation requires actually looking at what's available:

- **Modules and breakout boards.** Adafruit, SparkFun, Pololu, and many others sell modules for nearly every common function — sensor interfaces, motor drivers, power supplies, communication interfaces. These are designed, tested, and documented. They cost more per unit than a custom design at volume, but they cost nothing in design time.
- **Evaluation boards.** Chip vendors provide evaluation boards for their components. These aren't just demo boards — they're reference designs that can sometimes be integrated directly into a project.
- **Open-source hardware.** Many designs are freely available with full schematics, layouts, and BOMs. Adapting an existing open-source design is faster than starting from scratch.
- **Industrial modules.** DIN-rail power supplies, signal conditioners, and interface converters exist for nearly every industrial measurement and control task. They're expensive, but they're also certified, documented, and supported.

The honest question is: does a custom design add enough value to justify the time and risk? For a learning project, the answer might be yes purely for the educational value. For a project with a deadline, the answer is often no.

## The Hidden Cost of Custom

Custom hardware carries costs that are easy to underestimate:

**Design time.** Schematic capture, component selection, layout, review — even a simple board takes days. A complex one takes weeks or months. For learners, this time is valuable as education. With a deadline, it's schedule risk.

**Prototype iteration.** The first PCB revision almost never works perfectly. Budget for at least two revisions — more for complex designs. Each revision costs fabrication time (1-3 weeks), assembly time, and debugging time.

**Testing and validation.** Off-the-shelf modules have been tested by the vendor and by thousands of other users. A custom design has been tested by one person, on one bench, under the conditions that person thought to test. Edge cases are entirely on the designer.

**Documentation.** If anyone (including a future version of the designer) needs to understand, modify, or repair the design, it needs documentation. Schematics, BOMs, assembly notes, test procedures, known issues — this is real work that's easy to skip and expensive to recreate later.

**Maintenance.** Components go obsolete. Vendors discontinue parts. New revisions of the design are needed when requirements change. Every custom board ever designed is a future maintenance commitment.

**Debugging.** When an off-the-shelf module doesn't work, the vendor, forums, and other users are available resources. When a custom board doesn't work, the designer is on their own.

## When Custom IS the Right Answer

Custom hardware is the right choice in specific, identifiable situations:

- **Unique requirements.** No existing product meets the need. This is rarer than people think, but it does happen — unusual sensor combinations, specific form factors, integration requirements that no module addresses.
- **Integration constraints.** The design must fit into an existing system with specific electrical, mechanical, or thermal interfaces that no off-the-shelf product matches.
- **Volume economics.** At sufficient production volume, the NRE cost of a custom design is amortized across enough units to make the lower per-unit cost worthwhile. The breakeven quantity depends on the complexity of the design and the cost of the alternative.
- **Performance requirements.** Off-the-shelf solutions introduce compromises — extra connector resistance, longer signal paths, unnecessary level conversion — that degrade performance below what's needed.
- **Learning.** The purpose of the project is to learn hardware design. The custom board is the product, not a means to an end. This is a perfectly valid reason, but be honest about it.

## Prototype First, Then Decide

When the buy-vs-build decision isn't clear, a quick experiment can resolve it. Build a prototype using off-the-shelf modules and breakout boards. Wire them together on a breadboard or with point-to-point connections. Test whether the basic approach works.

This provides several things:

- **Proof of concept** without the cost of custom PCB design and fabrication
- **Real performance data** to compare against what a custom design might achieve
- **A working system** that can serve as a reference while designing the custom version
- **An informed decision** about whether custom hardware is justified

If the module-based prototype meets the requirements, the custom design may not be needed. If it falls short in specific, measurable ways, those shortcomings define the requirements for the custom design.

This approach also saves time even when the decision is to build custom hardware. The prototype validates the architecture, identifies interface issues, and provides test data — all of which inform the custom design and reduce the risk of the first PCB revision failing.

## The Learning Project Exception

For personal learning projects, the buy-vs-build analysis changes significantly. The "cost" of design time is actually a benefit — it's the learning that matters. The fact that a module would be faster, cheaper, and easier is irrelevant if the goal is to understand how the circuit works.

But even learning projects benefit from honest evaluation. If the goal is to learn about sensor interfacing, building a custom power supply for the project might be a distraction. Use an off-the-shelf regulator for the power supply and spend the design time on the part worth learning. Apply the build-vs-buy analysis selectively, building custom where the learning value is highest and buying off-the-shelf where it's not.

## Tips

- Before committing to a custom design, build a quick prototype from off-the-shelf modules to validate the architecture — this reveals interface issues and provides real performance data at minimal cost
- Evaluate buy-vs-build across all dimensions (design time, testing, documentation, maintenance), not just unit cost — the hidden costs of custom often dominate
- On learning projects, apply the build-vs-buy analysis selectively: build custom where the educational value is highest, and buy off-the-shelf for everything else
- If a module-based prototype meets the requirements, seriously consider whether a custom board adds enough value to justify the time and risk

## Caveats

- **"Not invented here" syndrome is expensive.** Rejecting existing solutions because they weren't designed in-house leads to reinventing wheels — use existing work where it fits and save custom effort for where it's needed
- **Module cost is not just BOM cost.** A $15 breakout board seems expensive compared to $2 worth of components, but the breakout board includes design, testing, documentation, and support — the $2 custom alternative requires all of that from the designer
- **Off-the-shelf doesn't mean low quality.** Commercial modules from reputable vendors are typically better designed and better tested than a first attempt at a custom board — using them is pragmatic, not lazy
- **Custom hardware creates single-person dependency.** If only one person understands the custom design, that's a single point of failure for the project — off-the-shelf solutions can be supported by anyone with access to the vendor's documentation
- **The best time to build custom is the second time.** After using a module-based prototype, the requirements, interfaces, and pitfalls are understood — the custom design benefits from everything the prototype revealed
- **Don't let perfect be the enemy of done.** A working system built from modules, delivered on time, is more valuable than a custom design that's still on the workbench three months later
