---
title: "Avoiding Accidental Complexity"
weight: 60
---

# Avoiding Accidental Complexity

Every design has complexity. Some of it is essential — it comes from the problem itself and can't be removed without changing what the system does. The rest is accidental — introduced by the solution, not demanded by the problem. The distinction matters because essential complexity must be managed, while accidental complexity can and should be eliminated.

## Essential vs Accidental Complexity

The terms come from Fred Brooks' 1986 essay "No Silver Bullet," written about software but equally applicable to hardware:

**Essential complexity** is inherent in the problem. A system that must measure temperature at 12-bit resolution, communicate wirelessly, and run from a battery for two years has essential complexity. The ADC, the radio, and the power management are all necessary. You can't simplify them away without changing what the system does.

**Accidental complexity** is introduced by the implementation. Using a complex RTOS when a simple state machine would suffice. Adding a switching regulator where an LDO would meet the requirements. Choosing a BGA part when a QFP would work, adding reflow complexity for no benefit. These choices add complexity that the problem didn't require.

The distinction isn't always clear-cut. A design decision that seems accidental might be justified by a constraint that isn't obvious — the BGA part might be the only package available for that chip, or the switching regulator might be needed for thermal reasons. But when design choices add complexity without a traceable justification, that's accidental complexity worth questioning.

## Signs of Accidental Complexity

Accidental complexity accumulates gradually. Individual decisions seem reasonable, but the aggregate effect is a design that's harder to build, test, and debug than the problem requires. Some warning signs:

- **Unexplainable design decisions.** If you can't explain why a particular circuit topology, component, or architecture was chosen — if the honest answer is "it's what I've always done" or "I saw it in a reference design for a different application" — the decision might be introducing unnecessary complexity.
- **Workarounds for workarounds.** A level translator was added because the sensor runs at 5V but the MCU runs at 3.3V. A buffer was added because the level translator can't drive the load. A filter was added because the buffer oscillates. Each step addresses a real problem, but the cascade suggests the initial decision (mixing voltage domains unnecessarily) introduced accidental complexity.
- **Components that don't directly serve a requirement.** Every component should trace back to a requirement — functional, non-functional, or protection. Components that exist to support other components rather than to fulfill a system requirement are a sign of accidental complexity. Sometimes necessary, but worth questioning.
- **Design rules that can't be explained.** "We always use four-layer boards" or "we always use a 32-bit MCU" — blanket rules that override project-specific analysis prevent right-sizing the design and carry complexity from one project where it was justified to another where it isn't.

## Feature Creep During Design

Feature creep is the most visible form of accidental complexity. It's the gradual addition of capabilities that nobody asked for but seem "easy to add while we're at it."

A sensor monitoring project starts with a clear requirement: read a temperature sensor and transmit the value wirelessly. Then:

- "While we're at it, let's add a humidity sensor." (One more sensor isn't much work.)
- "We should add an SD card for local logging." (Just in case the wireless link fails.)
- "Let's add a display to show current values." (Helpful for debugging.)
- "We should support OTA firmware updates." (So we don't have to visit each sensor.)
- "Let's add a real-time clock for timestamping." (The log data needs timestamps.)

Each addition is individually reasonable. Collectively, they've transformed a simple wireless sensor into a complex data acquisition system. The MCU that was adequate for the original requirement is now too small. The battery that would have lasted two years now lasts three months. The PCB that fit in a small enclosure now needs a bigger one.

The antidote is discipline: every proposed addition must be evaluated against the original requirements (see [Good Enough Criteria]({{< relref "/docs/design-development/ideation-and-requirements/good-enough-criteria" >}})). If it's not in the requirements, it doesn't go in this version. It goes on a list for the next version, where it can be evaluated in the context of a revised requirement set.

## Over-Abstraction

Over-abstraction is the hardware equivalent of writing a framework when you need a function. It's designing for maximum flexibility when the actual requirement is specific and well-defined.

Examples:

- **A universal sensor interface** that can accommodate any sensor type, when the project will only ever use one type of sensor. The universal interface needs muxes, configurable gain, selectable filtering, and software complexity to manage the configuration — all serving a flexibility requirement that doesn't exist.
- **A modular power supply** with interchangeable regulator daughter boards, when the input voltage and output requirements are fixed and known. The connectors, routing, and assembly complexity serve no purpose.
- **A software-defined radio front end** for a project that will only ever receive one frequency. The tunable elements, broadband components, and control software address a problem that the project doesn't have.

Over-abstraction creates complexity that must be designed, tested, documented, and maintained — all for capability that's never used. It's driven by the fear that requirements might change. Sometimes they do. But the cost of abstracting everything "just in case" usually exceeds the cost of redesigning the specific part that actually changes.

## Premature Optimization

Premature optimization in hardware takes several forms:

- **Optimizing power consumption before knowing the power budget.** Spending weeks on sleep mode current optimization when the battery has 10x the capacity needed for the application.
- **Optimizing BOM cost before knowing the production volume.** Spending design time to save $0.50 per board when you're building five units.
- **Optimizing signal integrity before measuring it.** Adding termination resistors, impedance-controlled traces, and matched-length routing on a 1 MHz SPI bus that would work fine with standard routing.
- **Optimizing thermal design before measuring temperatures.** Adding heatsinks and thermal vias to a design that dissipates 200 mW and will never overheat.

Optimization adds complexity — matched terminations, controlled impedances, thermal management, sleep mode firmware — and complexity has costs. Optimizing before measuring means you might be adding complexity to solve a problem that doesn't exist.

The better approach: build first, measure second, optimize what's actually problematic. This requires defining what "good enough" looks like before you start (see [Good Enough Criteria]({{< relref "/docs/design-development/ideation-and-requirements/good-enough-criteria" >}})), so you know what needs optimization and what doesn't.

## The Discipline of "Not in This Version"

Saying "not in this version" is one of the most powerful tools for controlling accidental complexity. It doesn't mean "never" — it means "not now, and not without a deliberate decision to include it."

Maintaining a "future versions" list helps. When someone (including yourself) suggests a feature or improvement during design, it goes on the list rather than into the current design. The list is reviewed when planning the next revision, at which point each item is evaluated against updated requirements.

This practice requires discipline because adding features feels productive and deferring them feels like failure. But every feature added to the current version increases the risk, cost, and schedule of the current version. Deferring it to a future version where it can be properly planned and integrated is not failure — it's engineering.

## Simplicity as a Design Goal

Simplicity isn't the absence of capability — it's the absence of unnecessary capability. A simple design:

- **Has fewer components.** Each component is a potential failure point, a line on the BOM, and something to inspect during assembly. Fewer components means fewer things that can go wrong.
- **Has fewer interfaces.** Each interface is a potential source of mismatches, noise coupling, and debugging confusion. Fewer interfaces means a more tractable system.
- **Has fewer failure modes.** Complex systems fail in complex ways. Simple systems fail in understandable ways. When a simple system breaks, the fault is usually obvious. When a complex system breaks, the interaction between subsystems makes diagnosis difficult.
- **Is easier to understand.** A design that someone can comprehend in one sitting is a design that can be reviewed, maintained, and improved. A design that requires days of study to understand resists all three.

Simplicity requires effort. It's easier to add than to remove. It's easier to include a feature than to decide it isn't needed. The simplest design that meets all requirements is often the last one you arrive at, not the first.

## Gotchas

- **"Simple" doesn't mean "trivial."** A well-designed simple system may contain sophisticated circuits — but only where the problem demands sophistication. Simplicity is about eliminating what's unnecessary, not avoiding what's difficult.
- **Complexity is additive and rarely removed.** Each feature added to a design tends to stay forever. Removing features is harder than adding them because someone might depend on them. Get the feature set right early to avoid carrying unnecessary complexity through every future revision.
- **Reference designs can introduce accidental complexity.** A vendor's reference design may include features your application doesn't need (monitoring circuits, protection for conditions your environment never experiences). Evaluate reference designs critically rather than copying them wholesale.
- **"Best practices" can be accidental complexity in disguise.** A best practice from a high-reliability application (redundant power paths, watchdog timers, extensive monitoring) may be unnecessary for a learning prototype. Apply practices that match the project's actual requirements.
- **Measuring complexity is hard.** Component count is a rough proxy but not perfect — five simple passives may be less complex than one IC with 50 configuration registers. Use judgment, not just metrics.
- **The sunk cost fallacy preserves accidental complexity.** "I already designed that block, so I'll keep it" is not a good reason to retain complexity that doesn't serve the requirements. If a simpler approach emerges, the time spent on the complex approach is already gone.
