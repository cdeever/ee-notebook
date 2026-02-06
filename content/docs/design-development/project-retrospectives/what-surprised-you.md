---
title: "What Was Surprising"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What Was Surprising

Every project contains surprises. Some are pleasant — a circuit works better than expected, a clever shortcut saves a week of effort. But the most valuable surprises are the unpleasant ones: things expected to go smoothly that didn't, assumptions made confidently that turned out to be wrong. These surprises are the gap between the mental model and reality, and closing that gap is what turns experience into expertise.

## Categories of Surprise

Surprises cluster into predictable categories, and recognizing which category a surprise falls into helps extract the right lesson:

**Technical surprises.** The circuit didn't behave as simulated. The component didn't meet its datasheet specification under the actual operating conditions. The noise was higher than expected. The thermal performance was worse than calculated. Technical surprises usually mean the analysis was incomplete — a parameter was missed, a parasitic was ignored, or a typical value was trusted instead of a worst-case one.

**Schedule surprises.** Everything took longer than planned. The layout that should have taken a week took three. The firmware that was "almost done" needed another month. Board fabrication took two weeks instead of five days because of an unanticipated holiday. Schedule surprises usually mean complexity was underestimated or dependencies and interruptions were not accounted for.

**Supply chain surprises.** The part the design was built around went on allocation. The specified connector has a 26-week lead time. The alternative component has a subtly different pinout that requires a board respin. Supply chain surprises are increasingly common and highlight the importance of checking availability before committing to a component — not after.

**Integration surprises.** Each subsystem worked perfectly in isolation, but they didn't work together. The digital noise from the MCU corrupted the analog measurement. The mechanical enclosure didn't leave room for the cable bend radius. The firmware's timing requirements conflicted with the hardware's interrupt latency. Integration surprises reveal gaps in system-level thinking — individual blocks were designed well, but their interactions weren't fully considered.

## The Assumption Audit

The most powerful retrospective question is: what was assumed to be true that turned out to be false? Every surprise is rooted in an assumption, and surfacing that assumption is the key to learning from it.

This is harder than it sounds. Assumptions are, by definition, things that went unquestioned. They're the invisible scaffolding holding up the reasoning. To find them, work backwards from the surprise:

- The power supply oscillated. What was assumed? That the output capacitor ESR was within the stability range. What was actually true? The ceramic capacitor chosen had much lower ESR than the datasheet's test conditions suggested.
- The board took three tries to get right. What was assumed? That everything could be routed on two layers. What was actually true? The signal integrity requirements demanded a solid ground plane, which required four layers.
- The project took twice as long as estimated. What was assumed? That work would proceed uninterrupted. What was actually true? Other obligations consumed half the available time.

The assumption audit isn't about blame — it's about calibration. Each surfaced assumption adjusts intuition for the next project.

## Positive Surprises

Not all surprises are problems. Sometimes things go better than expected, and these positive surprises are worth understanding too:

- A circuit worked on the first try. Why? Was it because a well-vetted reference design was followed? Because simulation was thorough? Because component tolerances happened to land favorably? Understanding why something went right makes it possible to replicate the conditions.
- A schedule estimate was accurate. What made this estimate different from the ones that were wrong? Was the estimate padded? Was the work broken into smaller pieces? Was there prior experience with exactly this type of task?
- A component choice turned out to be ideal. What led to the selection? Was it careful analysis, a recommendation from someone experienced, or fortunate coincidence?

Positive surprises are easy to overlook — when things go well, there's no urgency to understand why. But they're just as informative as negative surprises, and understanding successes helps distinguish skill from luck.

## Recording Surprises

The most important thing about capturing surprises is timing. The day a surprise is discovered, the details are vivid — the exact symptom, the debugging path, the root cause, the emotional frustration or relief. A month later, the memory fades to "something went wrong with the power supply" but not the specific mechanism. Six months later, it's forgotten entirely.

A few practical approaches:

- **Keep a project journal.** Even a simple text file where significant events are logged as they happen. Date-stamped entries like "2024-03-15: Discovered that U3 gets hot enough to shut down when Q1 switches at full load. Thermal pad not properly soldered — will need to add thermal vias in rev B." This takes two minutes to write and is invaluable during the retrospective.
- **Annotate the schematic.** Some designers add notes directly to the schematic when they discover something unexpected: "C12: must be X7R, not Y5V — DC bias derating drops effective capacitance below stability threshold." The surprise is documented right where it's relevant.
- **Flag surprises in the task tracker.** When using a project management tool, tag surprising events so they can be found later. A tag like "surprise" or "unexpected" creates a filterable list for the retrospective.

The method matters less than the habit. Any system that captures surprises in the moment is better than trying to reconstruct them from memory after the project ends.

## Surprise as Calibration

The purpose of tracking surprises isn't to create a catalog of things that went wrong. It's to recalibrate intuition. Every experienced engineer carries a mental model of how projects unfold — how long things take, which components are reliable, where integration problems lurk. That model was built by surprises: each one adjusted the model, and over time, the model became more accurate.

A designer who's been surprised by thermal problems three times now instinctively checks thermal performance early. One who's been burned by supply chain disruptions now checks component availability before committing to a design. The surprise isn't just a lesson about one project — it's an update to the model that governs all future projects.

The engineers with the best intuition aren't the ones who never encountered surprises. They're the ones who paid attention to them.

## Tips

- Record surprises the same day they are discovered, while the details — exact symptom, debugging path, root cause — are still vivid
- After each project, perform an assumption audit by working backwards from every surprise to identify the underlying belief that turned out to be false
- Deliberately examine positive surprises (things that went better than expected) to distinguish repeatable skill from coincidental luck
- Annotate schematics and design files in-place when something unexpected is found so the lesson lives where it is most relevant

## Caveats

- **Ignored surprises will repeat.** A surprise that isn't examined is a lesson not learned. The same mistake will recur — possibly in a more expensive context
- **Memory distorts surprises over time.** The farther in time from the event, the more memory edits the story. Record surprises while they're fresh, not during a retrospective six months later
- **Positive surprises are harder to notice.** When things go well, there's no trigger to ask "why?" Make a deliberate effort to examine successes, not just failures
- **Not every surprise is a design flaw.** Some surprises are genuinely unforeseeable — a component manufacturer going bankrupt, a once-in-a-decade weather event. The lesson from these isn't "this should have been predicted" but "a contingency process should exist"
- **Sharing surprises feels vulnerable.** Admitting what was unexpected requires honesty. But shared surprises benefit the entire team — one person's surprise is another's prevention
