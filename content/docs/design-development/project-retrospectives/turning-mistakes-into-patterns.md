---
title: "Turning Mistakes into Patterns"
weight: 50
---

# Turning Mistakes into Patterns

A mistake made once is a lesson. A mistake made twice is a pattern — and patterns are fixable. The goal of a retrospective isn't just to understand what went wrong; it's to build systems that prevent the same thing from going wrong again. This is how individual experience becomes institutional knowledge, how painful debugging sessions become one-line checklist items, and how hard-won lessons compound over a career instead of being forgotten between projects.

## From Incident to Rule

The conversion from mistake to prevention follows a consistent path:

1. **The incident.** Something went wrong. The power supply oscillated. The footprint was wrong. The board didn't fit in the enclosure.
2. **The root cause.** Why did it go wrong? The output capacitor's ESR was too low for the regulator's compensation. The footprint was created from a preliminary datasheet that was later revised. The mechanical drawing wasn't updated after the board dimensions changed.
3. **The rule.** What check or practice would have caught this? "Verify regulator stability with the chosen output capacitor's actual ESR range." "Always create footprints from the current released datasheet." "Cross-check board outline against mechanical model before ordering."

The rule is the artifact that survives the project. The incident fades from memory. The root cause analysis is interesting but project-specific. The rule is general — it applies to every future project where the same class of mistake could occur.

Not every incident produces a useful rule. Some are truly one-off situations unlikely to recur. But most incidents belong to a category, and the rule addresses the category rather than the specific instance. "Verify the footprint" is a rule that prevents an entire class of problems, not just the one you happened to encounter.

## Design Checklists

A design checklist is a list of rules accumulated from past mistakes and best practices. It's the simplest and most effective tool for preventing recurring errors. The power of a checklist is that it doesn't rely on memory — it asks the questions systematically, every time, regardless of schedule pressure or familiarity with the design.

An effective design checklist is:

- **Specific.** "Check power supply stability" is too vague. "Verify that the selected output capacitor ESR falls within the regulator's stable range per the datasheet's stability curves" is actionable.
- **Organized by design phase.** Schematic review checks, layout review checks, pre-fabrication checks, pre-assembly checks. Each phase has its own checklist, used at the appropriate time.
- **Living.** The checklist grows with every project. Each retrospective may add one or two items. Items that prove irrelevant or redundant are removed. The checklist evolves to reflect your actual experience.
- **Short enough to actually use.** A 200-item checklist will be ignored. Keep each phase's checklist to 15-25 items — the ones that have actually caught problems or reflect high-consequence mistakes.

A sample schematic review checklist entry might look like:

- [ ] Every IC power pin has decoupling capacitor placed (check hidden pins)
- [ ] Voltage dividers verified for correct ratio with standard resistor values
- [ ] All polarized components have clear polarity marking on silkscreen
- [ ] ESD protection present on all external-facing signal pins
- [ ] Reset circuit verified: pull-up value, capacitor value, threshold voltage

Each of these entries exists because someone, at some point, was bitten by its absence.

## Template Circuits

Beyond checklists, mistakes become prevention through template circuits — proven sub-circuit designs that encode past lessons into reusable building blocks:

- **Power supply template.** A complete reference design for a specific regulator, including the compensation network, input and output capacitors (with specific part numbers), and layout guidelines. The template captures not just the schematic but the component choices and layout rules that make it work reliably.
- **Reset circuit template.** A microcontroller reset circuit with the supervisor IC, pull-up resistor, and decoupling capacitor values that have been verified to work across the operating temperature range. The template includes notes on why specific values were chosen.
- **ESD protection template.** A standard ESD protection circuit for common interfaces (USB, Ethernet, GPIO) with TVS diode selection, placement guidelines, and routing rules.
- **Connector template.** A standard connector circuit including protection components, pull-ups/pull-downs, and indicator LEDs, with notes on which elements are optional for different applications.

Templates are more than reference designs from datasheets. They're reference designs annotated with your experience — the gotchas you've encountered, the component substitutions that don't work, the layout constraints that aren't obvious from the schematic.

## Anti-Patterns

Just as patterns describe things to do, anti-patterns describe things to avoid. An anti-pattern is a recurring mistake that's tempting, looks reasonable, but reliably leads to problems:

- **"Never route high-speed signals over split planes."** The return current path discontinuity causes impedance mismatches and radiation. This is a well-known rule, but it becomes an anti-pattern in your personal list when you've actually seen it cause a problem.
- **"Never use Y5V dielectric capacitors in timing or filtering circuits."** The capacitance variation with temperature and DC bias is too large. Use X7R or X5R instead.
- **"Never connect a decoupling capacitor with long traces."** The trace inductance negates the capacitor's effectiveness at high frequencies. Place decoupling caps as close to the IC power pins as physically possible.
- **"Never trust a footprint you didn't verify."** Library footprints — even from manufacturers — contain errors. Always check against the datasheet.

Anti-patterns are the negative counterpart to the checklist. The checklist says "do this." The anti-pattern list says "don't do this." Both are built from experience.

## The Personal Design Guide

Over time, checklists, templates, and anti-patterns accumulate into something that deserves a name: the personal design guide. This is a living document — or collection of documents — that captures your accumulated engineering wisdom. It's the distillation of every project, every mistake, every surprise, and every lesson into a reusable resource.

The personal design guide might include:

- **Design checklists** for each project phase.
- **Template circuits** for common functions.
- **Anti-pattern list** of things to avoid.
- **Preferred components** — parts you've used successfully and trust.
- **Preferred tools and settings** — EDA tool configurations, manufacturer design rules, preferred fabrication houses.
- **Process templates** — standard project directory structures, documentation templates, test procedure formats.

The guide doesn't need to be formal. A well-organized directory of notes, templates, and checklists is sufficient. What matters is that it exists, is maintained, and is actually consulted at the start of each new project.

## Sharing Patterns

Individual patterns become more powerful when shared:

- **Design guidelines.** A team's accumulated anti-patterns and best practices, documented and maintained as a shared resource.
- **Application notes.** Detailed explanations of how to use a specific component or implement a specific function, based on real experience rather than theoretical analysis.
- **Code and schematic reviews.** The process of reviewing someone else's work transfers patterns in both directions — the reviewer shares their experience, and the designer's approach may reveal new patterns.
- **Tribal knowledge.** The informal, unwritten rules that experienced engineers know and newcomers don't. Documenting tribal knowledge makes it accessible and preserves it when people move on.

Sharing patterns requires vulnerability — you're admitting that you made mistakes and learned from them. But the alternative is every engineer on the team independently discovering the same pitfalls, which is an enormous waste of collective effort.

## The Compound Effect

The most important thing about turning mistakes into patterns is the compound effect. Each project gets slightly better because the accumulated wisdom grows. The checklist catches problems earlier. The templates reduce design time. The anti-patterns prevent entire categories of error.

Early in a career, every project feels like starting from scratch. After a decade of deliberate retrospection, each new project starts from a foundation of proven patterns, vetted templates, and hard-won rules. The difference between an experienced engineer and a novice isn't just knowledge — it's the accumulated infrastructure of prevention that makes quality seem effortless.

This infrastructure doesn't build itself. It requires the discipline to stop after each project, ask what went wrong, extract the lesson, and encode it in a form that survives until the next project. That discipline is the real subject of this entire retrospectives section — not just thinking about what happened, but converting what happened into what happens next.

## Gotchas

- **Not every mistake deserves a rule.** Some problems are genuinely one-off situations. Adding a checklist item for every incident bloats the checklist until it's unusable. Reserve rules for recurring or high-consequence mistakes.
- **Templates become stale.** A power supply template based on a regulator that's now obsolete is worse than no template if it leads you to design around unavailable parts. Review and update templates periodically.
- **Anti-patterns can become dogma.** "Never do X" rules need context. The conditions that made X a problem in one project might not apply in another. Understand the reason behind the rule, not just the rule itself.
- **Sharing requires maintenance.** A shared design guide that isn't updated becomes a source of bad advice. Assign ownership and schedule periodic reviews.
- **The compound effect requires consistency.** One retrospective per year doesn't build momentum. A brief reflection after every project — even a small one — keeps the accumulation steady.
