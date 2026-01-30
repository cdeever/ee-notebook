---
title: "What You'd Do Differently Next Time"
weight: 40
---

# What You'd Do Differently Next Time

The retrospective's most actionable output isn't a list of what went wrong — it's a list of concrete changes for the next project. "The power supply oscillated" is a diagnosis. "Always simulate the feedback loop before committing to the output capacitor" is a change. The difference is specificity: a diagnosis tells you what happened; a change tells you what to do about it.

## Process Changes

Process changes modify how you work, not what you design. They're often the most impactful because they apply to every future project regardless of the specific circuit:

- **"Add a power-on checklist."** After powering up a board for the first time and discovering a component installed backwards, the lesson becomes: create a checklist that includes visual inspection, resistance measurements between power and ground, and current-limited power-up before any functional testing.
- **"Do DFM review before ordering."** After discovering that a trace was too close to the board edge and the fab modified it without telling you, the lesson becomes: always request a DFM review and wait for the report before approving fabrication.
- **"Review the BOM against distributor stock before finalizing the design."** After discovering mid-build that a critical component has a 20-week lead time, the lesson becomes: check availability early and design around available parts.
- **"Run ERC and DRC with zero suppressions before generating output files."** After shipping a board with an unconnected power pin because the ERC warning was suppressed during an earlier debugging session, the lesson becomes: start every output generation with a clean rule check.

Process changes are the easiest to identify and the hardest to sustain. They require discipline, and discipline fades when you're under schedule pressure. The key to making process changes stick is embedding them in tools and workflows rather than relying on memory.

## Technical Changes

Technical changes modify what you design — specific design practices that improve reliability or reduce problems:

- **"Always simulate the power supply."** Not just the steady-state output, but the transient response, the start-up behavior, and the loop stability. A 30-minute simulation catches problems that would take days to debug on hardware.
- **"Add test points on every debug bus."** I2C, SPI, UART, and JTAG lines should all have accessible test points. The cost is trivial, and the diagnostic value when something doesn't communicate is enormous.
- **"Use a ground plane on every board."** Even two-layer boards benefit from dedicating one layer primarily to ground. Signal integrity, noise performance, and thermal management all improve.
- **"Derate components by at least 50%."** A capacitor rated for 16V on a 12V rail has almost no margin for transients. Using a 25V capacitor costs a fraction more and eliminates a class of field failures.
- **"Verify every custom footprint against the datasheet."** Before ordering the first board, print the PCB at 1:1 scale and physically check component fit. A wrong footprint is the most common reason for a board respin.

Technical changes accumulate into what amounts to a personal design standard — a set of practices that reflect your accumulated experience.

## Planning Changes

Planning changes modify how you estimate, schedule, and organize projects:

- **"Pad the schedule by 50%."** If you estimate two weeks for layout, plan for three. This isn't pessimism — it's accounting for the interruptions, iterations, and unexpected problems that always occur but are never included in the initial estimate.
- **"Order components before starting layout."** Long-lead-time parts should be ordered as soon as the schematic is finalized. Waiting until the board is ready for assembly to order components adds weeks of dead time.
- **"Define the test plan before the design is finished."** Knowing how you'll test the product influences design decisions — test point placement, access to internal signals, fixture interface. Designing the test strategy after the board is built means missing these opportunities. This connects directly to the validation planning in the [validation and verification]({{< relref "/docs/design-development/validation-and-verification" >}}) section.
- **"Break the project into milestones with deliverables."** A project plan that says "design the board" is too coarse. Breaking it into "complete schematic review," "finish layout and DRC," "order board and components," and "assemble and test" creates natural checkpoints where progress can be assessed.

Planning changes are often the ones that feel most obvious in hindsight and most difficult to implement in practice. The temptation to "just start building" is strong, especially on personal projects where there's no external accountability for planning.

## Communication Changes

Many project problems are communication failures dressed up as technical ones:

- **"Review mechanical constraints with the enclosure designer before layout."** Discovering during assembly that the tallest component interferes with the enclosure lid is a communication failure, not a design failure.
- **"Confirm connector mating parts with the cable supplier before ordering."** A connector that matches the datasheet but doesn't mate with the available cable assembly is a communication failure.
- **"Share the schematic with the firmware developer before ordering the board."** Pin assignments that make schematic sense but firmware sense are a communication failure.
- **"Send the BOM to procurement before finalizing."** A component that's technically ideal but commercially unavailable is a communication failure between engineering and the supply chain.

On solo projects, "communication changes" may mean better documentation for future-you, or seeking review from a peer before committing to fabrication.

## The Difficulty of Actually Changing

Knowing what to do differently is the easy part. Actually doing it is hard. There are real reasons why the same mistakes recur despite clear lessons:

- **Schedule pressure overrides process.** When the deadline is tight, the checklist gets skipped, the review gets deferred, and the simulation doesn't happen. The short-term urgency of the deadline always feels more pressing than the long-term benefit of the process.
- **Habits are strong.** If you've always started layout immediately after the schematic, forcing yourself to do a formal design review first requires breaking a habit, and habits don't change by intention alone.
- **The lesson fades.** The pain of debugging a wrong footprint is vivid for a week, manageable for a month, and forgotten in a year. The urgency to change fades with the memory.
- **Exceptions multiply.** "I'll skip the checklist this one time because it's a simple board." Then again next time, because it's a rush job. Then again, because the checklist doesn't quite fit this project. Soon the exception is the rule.

## Making Changes Stick

The only reliable way to make changes stick is to remove them from the realm of willpower and embed them in infrastructure:

- **Checklists.** A physical or digital checklist that must be completed before a milestone (design review, board order, production release). The checklist doesn't rely on memory — it asks the questions automatically.
- **Templates.** A project template that includes the standard directory structure, documentation files, and process steps. Starting from the template means the process is built into the project from day one.
- **Design rules.** EDA tool settings that enforce technical standards — minimum trace widths, required test points, thermal relief requirements. The tool prevents violations rather than relying on the designer to remember them.
- **Peer review.** Having another person review the design before milestone decisions. A second pair of eyes catches what habit blinds the designer to.

The goal is to convert lessons from the "things I should remember to do" category into the "things that happen automatically" category. Every lesson that makes this transition is a permanent improvement.

## Gotchas

- **The list of things to do differently grows faster than the ability to implement them.** Prioritize ruthlessly — focus on the changes that address the most painful or most frequent failures.
- **Changes that require more time compete with deadlines.** Build the time for process improvements into the schedule rather than treating them as optional extras.
- **Generic resolutions fail.** "Be more careful" is not a change. "Print the footprint at 1:1 and check physical fit before ordering" is a change. Specificity is everything.
- **Solo projects are the hardest to change.** Without external accountability, it's easy to skip every process improvement when you're the only one affected. Consider finding a peer review partner, even informally.
- **Retrospective fatigue is real.** If every project generates a long list of changes that are never implemented, the retrospective itself becomes demotivating. Start with two or three changes per project and actually implement them.
