---
title: "Knowing When the POC Is Done"
weight: 60
---

# Knowing When the POC Is Done

A proof of concept has one job: answer a question. It's done when the question is answered — not when the circuit is perfect, not when every edge case is covered, and not when it looks good on the bench. Recognizing when you've gotten what you need and moving on is a skill as important as building the POC in the first place.

## The Question Is Answered

The clearest signal that a POC is done is that the question defined in your [experiment structure]({{< relref "structuring-experiments" >}}) has a clear answer:

- **Pass:** "The sensor achieves 3 mg RMS noise at 10 Hz, well within the 5 mg requirement." Move to architecture. The sensor is viable.
- **Fail:** "The sensor achieves 12 mg RMS noise at 10 Hz, above the 10 mg fail threshold." Move to evaluating an alternative sensor or relaxing the requirement.
- **Marginal:** "The sensor achieves 6 mg RMS noise at 10 Hz — within spec but without much margin." Document the result and flag it as a risk item for the architecture phase.

All three are valid outcomes. A "fail" result is just as valuable as a "pass" — it prevents you from spending weeks designing around a component that can't do the job.

## Signs You Should Stop

**You're refining instead of answering.** If you're swapping components, tweaking values, and re-measuring the same parameter for the fourth time, you've likely already answered the question — the circuit is marginal, and further optimization belongs in the schematic design phase, not on a breadboard. Breadboard optimization hits diminishing returns quickly because the parasitics dominate the fine adjustments you're trying to make.

**You're adding features.** A POC that starts as "test the sensor" and evolves into "test the sensor, add an LCD display, implement a menu system, and design a 3D-printed enclosure" has lost the plot. The goal was to answer one question, not to build a product. Feature creep on a breadboard is a time sink.

**You're avoiding the next step.** Breadboarding is tangible and satisfying — you can see and touch the circuit. Schematic capture and architecture planning are abstract and feel less productive. If you're continuing to breadboard because the next phase feels daunting, recognize the avoidance for what it is and move on. The POC has done its job.

**The results are consistently repeatable.** If you've run the test multiple times and the results are consistent, additional measurements won't add information. Log the results and move forward.

## Signs You Should Continue

**The results are inconsistent.** If the circuit works sometimes and doesn't other times, you haven't answered the question yet. Inconsistent results mean either the test setup has a problem (loose connection, unstable power) or the circuit has a marginal behavior that needs to be understood.

**You haven't tested the critical parameter.** If the POC was designed to test low-light sensor performance but you've only tested under room lighting, the key question is unanswered regardless of how good the room-light results look.

**You discovered a new question.** The sensor works, but during testing you noticed it draws 50 mA in continuous mode when the power budget assumed 10 mA. That's a new question worth answering before committing to architecture. But be disciplined — answer the new question and stop, don't let it spawn five more.

## What to Do With the Results

A completed POC produces a body of knowledge that feeds the next phases of design:

**For system architecture:**
- Which components are confirmed viable, which are rejected
- Measured power consumption (compared to datasheet estimates)
- Interface behavior (timing, signal levels, protocol quirks)
- Environmental sensitivities discovered during testing

**For schematic design:**
- Component values that were tuned during POC (filter cutoffs, bias points, feedback networks)
- Support circuitry requirements discovered through testing (decoupling needs, pull-up values, bias networks)
- Any component errata or undocumented behavior encountered

**For [part selection]({{< relref "../part-selection-and-sourcing" >}}):**
- Which manufacturer parts were actually tested (not just the generic part type)
- Second-source candidates that could substitute if the first choice becomes unavailable
- Package and footprint observations (did the SOT-23 version fit? was the QFN too hard to prototype?)

## The POC Deliverable

The output of a POC isn't a working circuit — it's a decision. Specifically:

> "Based on [specific measurements] from [described test setup], [component/approach] [meets/does not meet/marginally meets] the requirement for [specific parameter]. Recommendation: [proceed with this approach / evaluate alternative / proceed with risk flag]."

That's one paragraph. If you can write that paragraph with confidence and supporting data, the POC is done.

## Cleaning Up

Once the results are documented:

- **Photograph the setup** before disassembling it. You may need to rebuild it if a question comes back.
- **Save the firmware** (if any) in the project repository with notes on what it does and how it was used.
- **Return borrowed equipment** (dev boards, test equipment, sensors).
- **Recover reusable components.** That $15 sensor breakout board can be used for the next project.
- **File the results** where the team can find them — in the project repository, a shared drive, or a lab notebook. POC results that only exist on one person's bench are lost knowledge.

## Gotchas

- **"Just one more test" is a trap.** If you've answered the original question, additional tests should be justified by a new question, not by vague curiosity. Curiosity is great, but it belongs in a scheduled exploration session, not in the middle of a project timeline.
- **Don't gold-plate the documentation.** A markdown file with a photo, a table of results, and a one-paragraph conclusion is sufficient. A 20-page report with formatted charts is overkill for a POC. Save the polish for the design review.
- **POC results expire.** A POC done six months ago may no longer be valid if the requirements have changed, the component has been revised, or the environment has changed. When referencing old POC results, check whether the conditions still apply.
- **The POC doesn't validate the system.** A sensor that works on a breakout board doesn't guarantee it will work in your system. The POC reduces risk — it doesn't eliminate it. System-level validation happens during [prototyping and bring-up]({{< relref "../prototyping-and-bring-up" >}}).
- **Failed POCs are not wasted time.** A POC that proves an approach won't work saves all the time you would have spent designing, laying out, fabricating, and debugging a board based on a flawed assumption. Document the failure and move on to the next option.
