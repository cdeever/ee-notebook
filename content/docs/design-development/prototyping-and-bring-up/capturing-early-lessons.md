---
title: "Capturing Early Lessons"
weight: 60
---

# Capturing Early Lessons

The first prototype teaches you more than any simulation, any datasheet, and any design review — but only if you record what you learn. In the rush of bring-up, it's tempting to make a fix, confirm it works, and move on. But the lessons that emerge during first build and test are the most valuable data in the entire project, and they evaporate quickly if they aren't captured. A week later, you won't remember which bodge wire went where. A month later, you won't remember why you changed that capacitor value. Six months later, when revision 2 ships with the same bug revision 1 had, you'll wish you'd written it down.

## What to Document During Bring-Up

The documentation doesn't need to be formal. A text file, a lab notebook, even a series of dated notes is enough. What matters is that the information is recorded at the time of discovery, not reconstructed from memory later.

**Deviations from expected behavior.** The board doesn't perfectly match the simulation or the design analysis — it never does. Document every deviation:
- A supply rail that's 50 mV lower than calculated
- An oscillator that starts up slower than expected
- A digital output that rings more than the simulation predicted
- An analog measurement that's noisier than the datasheet suggested

Not every deviation is a problem, but every deviation is information. Some will be explained by component tolerances. Some will point to layout issues. Some will reveal assumptions in the original design that were wrong.

**Component substitutions.** If a component wasn't available and you substituted a different part, record exactly what was substituted and why. If the substitute works, you may want to make it the official part. If it doesn't, you need to know what was different.

**Bodge wires and modifications.** Bodge wires are the physical corrections applied to a prototype to work around design errors. They're an essential part of prototyping — and they're also the most frequently lost information.

For each bodge:
- What nets are connected or disconnected?
- Why was the change made? (What problem did it fix?)
- What is the schematic change that would make this bodge unnecessary on the next revision?
- Does the bodge have any side effects (increased noise, reduced reliability, temperature sensitivity)?

A bodge that isn't documented is a bodge that will be forgotten. When the next revision is made from the unmodified schematic, the same problem will reappear — and the engineer (possibly future you) will have to rediscover the fix from scratch.

## Photos

Photographs of the prototype are enormously valuable and nearly free to take:

**Before modifications.** A clean photo of the as-assembled board. This serves as the baseline for comparison when things start getting modified.

**After each modification.** A photo of each bodge wire, cut trace, or replaced component. Include enough context to identify the location on the board. A close-up of the bodge plus a wider shot showing its position on the board is ideal.

**Test setups.** How was the board connected during each test? Which probes were on which test points? What equipment was used? A photo of the test setup takes 10 seconds and saves 20 minutes of reconstruction the next time you need to reproduce a measurement.

**Scope screenshots.** Most oscilloscopes can save screenshots to USB. Capture the waveforms that matter: power supply ripple, clock signals, communication bus activity, analog signal quality. Annotate them with what you were measuring and what the expected waveform looks like.

## Measurement Data

Raw measurement data from bring-up forms the baseline for the design's performance:

- **Power consumption:** idle, active, peak, and sleep mode current for each rail
- **Voltage accuracy:** measured values vs design targets for each supply
- **Signal quality:** rise times, overshoot, noise floor, distortion
- **Timing:** startup time, communication latency, sensor response time
- **Environmental sensitivity:** behavior at temperature extremes, with varying supply voltage, under vibration

This data serves two purposes. First, it validates (or invalidates) the design against its requirements. Second, it provides a reference for comparison. If revision 2 has different performance, the revision 1 data lets you determine whether the change is an improvement, a regression, or an expected consequence of a design change.

## The Rev 2 List

The most practically useful document from a first prototype is the running list of changes for the next revision. Start this list immediately — during assembly, not after testing is complete.

The rev 2 list captures everything from critical design errors to minor convenience improvements:

**Critical (must fix):**
- Footprint errors (wrong pad dimensions, wrong pin numbering)
- Design errors (wrong voltage divider ratio, missing pull-up resistor)
- Functionality that doesn't work and can't be fixed with bodge wires

**Important (should fix):**
- Layout improvements discovered during testing (component placement that would reduce noise, better routing for signal integrity)
- Component changes based on measured performance (output capacitor value needs adjustment for stability margin)
- Test access improvements (add a test point here, move a debug header there)

**Nice-to-have (consider fixing):**
- Silkscreen corrections (misspelled labels, reference designator positions)
- Component orientation standardization
- Cosmetic improvements (board outline, copper fill aesthetics)

Categorizing the items helps when deciding whether to do a respin. If the list has critical items, a respin is necessary. If it only has nice-to-haves, the current revision may be good enough — especially if the next revision introduces new features that will create their own bugs.

## Post-Prototype Review

After bring-up and initial testing are complete, a deliberate review session captures the higher-level lessons:

**What worked.** Which design decisions paid off? What tools or techniques were effective? What would you do the same way next time? Positive lessons are easy to overlook but just as valuable as negative ones.

**What didn't work.** Which assumptions were wrong? What failed, and why? Were there warning signs that were missed? Could the failure have been caught earlier — in simulation, in design review, or in a different prototype approach?

**What would you change.** Not just changes to the board, but changes to the process. Would you have benefited from a proof-of-concept before committing to a PCB? Should you have done a more thorough design review? Was the prototype strategy (as discussed in [Prototype Strategies]({{< relref "/docs/design-development/prototyping-and-bring-up/prototype-strategies" >}})) appropriate for this project?

**What did you learn.** Every prototype teaches something that transcends the specific project. A new understanding of a component's behavior, a better approach to power distribution, a debugging technique that worked well — these lessons apply to future projects.

This review feeds into the project's retrospective. For guidance on structuring retrospectives as a broader practice, see the [Project Retrospectives]({{< relref "/docs/design-development/project-retrospectives" >}}) section.

## Documentation Formats That Work

The best documentation format is the one you'll actually use. Some options:

- **Lab notebook (paper).** Traditional and effective. Permanent, always available, easy to sketch in. Hard to search, hard to share, and can't embed scope screenshots.
- **Plain text or markdown files.** Easy to create, version-control-friendly, and searchable. Store them alongside the design files in the project repository.
- **Engineering wiki or notes app.** Good for searchable, cross-referenced notes. Useful if you work on many projects and want to find related notes across them.
- **Annotated schematic printout.** Print the schematic, annotate it with pen during bring-up. Mark measured voltages, identify problem areas, note bodge locations. This is surprisingly effective because the schematic already contains the context.

Whatever format you choose, the key principle is: capture information at the time of discovery. Reconstruction is lossy. Memory is unreliable. A note taken in the moment, however rough, is worth more than a polished report written from memory a week later.

## Gotchas

- **"I'll document it later" means it won't be documented.** The half-life of bring-up knowledge is measured in days. By the time you sit down to write it up, the details have faded. Take notes during the session, not after.
- **Photos without context are useless.** A close-up of a bodge wire with no identifying features doesn't tell you where it is on the board. Include a reference point — a nearby reference designator, a connector, or a board edge.
- **The rev 2 list grows faster than you expect.** This is normal. A long rev 2 list doesn't mean the design is bad — it means you're learning. The goal isn't a short list; it's a complete list.
- **Bodge wires change the circuit but not the schematic.** After prototyping, the physical board and the schematic file no longer match. Update the schematic to reflect every bodge before starting revision 2. This sounds obvious, but it's frequently forgotten, leading to revision 2 boards that have the same bugs as revision 1.
- **Measurement data without units and conditions is meaningless.** "Current = 47" — milliamps? At what voltage? Under what load? In what mode? Record the full context with every measurement.
- **The best time to write the rev 2 list is during bring-up.** The second-best time is immediately after. Every day of delay reduces the quality of the list.
