---
title: "Good Enough Criteria"
weight: 40
---

# Good Enough Criteria

Perfection is the enemy of completion, and in electronics design, it's also the enemy of learning. Every project reaches a point where further refinement costs more than it's worth — in time, money, or complexity. The skill isn't in achieving perfection but in knowing when a design is sufficient for its purpose and having the discipline to stop there.

## Defining "Done" Before Starting

The single most effective practice I've found for avoiding over-engineering is to define what "done" looks like before beginning the design. This means writing acceptance criteria — specific, testable conditions that determine whether the design is complete.

Without acceptance criteria, "done" becomes "when I can't think of anything else to improve," which is never. Every circuit can be tweaked, optimized, or extended. Without a defined stopping point, projects stretch indefinitely.

Examples of useful acceptance criteria:

- Output voltage within 3.3V +/- 50 mV under load from 0 to 200 mA
- Temperature reading within +/- 1 degree C from 0 to 50 degrees C
- Battery life exceeds 6 months at one measurement per hour
- Total BOM cost under $10 for a single unit
- PCB fits within 40 mm x 60 mm, two layers

Each of these is measurable. When the prototype meets all of them, the design is done — even if you can see ways to make it better.

## Pass/Fail Thresholds vs Optimization Targets

There's an important distinction between a threshold and a target:

| Type | Example | Design implication |
|---|---|---|
| **Threshold (pass/fail)** | Noise floor below 100 uV RMS | Must be met. If not, the design has failed its requirement. |
| **Target (optimization)** | Noise floor as low as practical | No defined stopping point. Invites infinite tweaking. |

Thresholds give you a clear stopping point. Targets don't. Wherever possible, convert targets into thresholds. Instead of "low noise," specify "below X uV." Instead of "long battery life," specify "at least Y months." The number doesn't have to be perfect — a somewhat arbitrary threshold is still more useful than no threshold at all.

## Prototype Quality vs Production Quality

What counts as "good enough" depends entirely on the purpose of the design. A proof-of-concept prototype and a production product have radically different quality bars:

**Proof of concept:**
- Validates that the basic approach works
- Dead-bug or breadboard construction is fine
- Component values can be approximate
- No enclosure, no labeling, no user interface polish
- Documentation: enough to reproduce the test setup

**Engineering prototype (rev 1 PCB):**
- Validates the circuit design in a real layout
- Should meet key electrical specifications
- Test points and debug headers are welcome
- Some manual rework and bodge wires are expected
- Documentation: schematic, BOM, known issues list

**Production design:**
- Meets all specifications reliably across tolerance and temperature
- Designed for manufacturing: standard packages, proper fiducials, panel layout
- Passes regulatory and compliance requirements
- Full documentation: assembly instructions, test procedures, acceptance criteria
- Designed for repair: accessible test points, labeled connectors, documented fault modes

Applying production quality criteria to a proof of concept wastes time. Applying proof-of-concept quality to a production design ships unreliable product. Knowing which stage you're at — and designing to that stage's quality bar — is one of the more useful skills to develop.

## Over-Engineering: Adding Cost Without Value

Over-engineering is applying more precision, robustness, or features than the application requires. It's seductive because it feels like good engineering — who wouldn't want a more robust design? But every feature, every tighter tolerance, and every additional protection circuit has a cost.

Signs of over-engineering:

- **Specifying 0.1% resistors when 1% would meet the accuracy requirement.** The 0.1% part costs 10x more and requires careful handling to avoid thermal effects that exceed its tolerance anyway.
- **Adding ESD protection to an internal-only interface.** TVS diodes on a signal that never leaves the PCB add cost and capacitance for zero benefit.
- **Using automotive-grade components for a desk instrument.** -40 C to +125 C rated parts cost significantly more than commercial parts. If the device lives on a desk, commercial grade is fine.
- **Building in expansion for features nobody has requested.** Extra connectors, unpopulated footprints, and expansion headers add PCB area and assembly confusion. If the feature isn't in the requirements, the expansion path shouldn't be either (with exceptions for strategically placed test points).

Over-engineering is especially tempting on learning projects, where the goal of "doing it right" can easily become "doing everything." The cost isn't just money — it's complexity. More components mean more possible failure points, more assembly time, and more to debug when something doesn't work.

## Under-Engineering: Where Cutting Corners Hurts

Under-engineering is the opposite — meeting the spec in nominal conditions but failing when the real world introduces variation. It's the design that works perfectly on the bench with the lab supply but fails with a noisy wall adapter.

Common under-engineering patterns:

- **No input protection.** The circuit works fine until someone plugs in a cable during a static discharge event and the input pin dies.
- **No decoupling capacitors.** The breadboard prototype worked, so the PCB must not need them either. It does.
- **Minimum-spec power supply.** The regulator's maximum output current exactly equals the circuit's maximum draw. No margin for startup surges, tolerance variation, or temperature derating.
- **Ignoring tolerance stacking.** Each component is within spec individually, but the combined effect of worst-case tolerances pushes the circuit out of spec.

Under-engineering often comes from testing only the happy path. The circuit works with typical component values, at room temperature, with a clean power supply. Real-world operation includes worst-case components, temperature extremes, and noisy power.

## How "Good Enough" Changes With Project Stage

The same design might need different levels of refinement at different stages. Recognizing where you are in the project lifecycle prevents both over- and under-engineering:

| Stage | Good enough means | Acceptable shortcuts |
|---|---|---|
| Concept exploration | Basic function demonstrated | Breadboard, hand-picked components, bench supply |
| Feasibility prototype | Key performance parameters validated | Bodge wires, manual calibration, minimal documentation |
| Rev 1 PCB | Circuit design validated in real layout | Known layout issues documented for rev 2, test points may need rework |
| Rev 2 PCB | Meets all electrical specifications | Enclosure and manufacturing optimizations deferred |
| Production release | Meets specs across all conditions, manufacturable, documented | Nothing — this is the real thing |

Skipping stages is risky. Going directly from concept to production skips the learning that prototype stages provide. But over-iterating at a stage — doing three revisions of a prototype that should be tested and moved on from — wastes time and delays the learning that comes from the next stage.

## The Psychology of "Good Enough"

There's an emotional component to stopping. Declaring a design "good enough" can feel like admitting defeat — especially for learners who are still building confidence. "Good enough" sounds like compromise.

But in practice, shipping a good-enough design teaches more than endlessly polishing a never-finished one. A working prototype on the bench provides real-world feedback that no amount of simulation or analysis can match. The lessons from rev 1 inform rev 2 far more effectively than spending three extra months on rev 1.

The discipline of "good enough" is also the discipline of iteration. Rather than perfecting one design, build it, test it, learn from it, and improve it in the next revision. The second prototype is almost always better than a first prototype that took twice as long.

## Gotchas

- **"Good enough" is not "sloppy."** Good enough means meeting defined criteria, not ignoring quality. It's disciplined, not lazy. The criteria must exist for the concept to work.
- **Moving the goalposts.** If you keep raising the acceptance criteria after meeting them, you'll never finish. Write the criteria down before starting and hold yourself to them. New requirements go in the next revision.
- **Confusing "done" with "perfect."** A design that meets all its acceptance criteria is done. It's not perfect — no design ever is. Accepting this is part of the engineering mindset.
- **Scope creep disguised as quality.** Adding features is not the same as improving quality. "While I'm at it, I'll also add Bluetooth" is scope creep, not engineering rigor.
- **Ignoring the learning value of imperfect designs.** A prototype with known limitations teaches you what matters. You learn more from testing an imperfect design than from designing a perfect one you never build.
