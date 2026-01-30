---
title: "Feeding Data Back into Design"
weight: 60
---

# Feeding Data Back into Design

Test results that sit in a folder without influencing the next design iteration are wasted effort. The entire purpose of validation and verification is to produce information — about margins, failure modes, unexpected behaviors, and confirmed capabilities. That information is only valuable if it flows back into the design process, closing the loop between "what we measured" and "what we do next."

## Closing the Loop

The feedback loop is straightforward in concept: a test reveals a problem, the root cause is identified, a design change addresses it, and a re-test confirms the fix. In practice, each step has pitfalls.

The test finding must be specific enough to act on. "The system sometimes fails" is not actionable. "The 3.3V rail drops to 3.05V during a 500 mA load transient, causing the MCU to brown out" is actionable — it points to the power supply design, specifically its transient response.

Root cause analysis requires going beyond the symptom. The brown-out is the symptom. The root cause might be insufficient output capacitance, excessive trace resistance in the power path, or an inadequately decoupled load. Jumping to a fix without identifying the root cause risks treating the symptom while leaving the underlying problem in place.

The design change should address the root cause, not just mask the symptom. Adding a larger brown-out threshold to the MCU firmware might prevent the reset, but the power supply is still drooping — and the next component in the chain might not tolerate it. Fix the supply.

The re-test must confirm that the fix works and that it hasn't introduced new problems. This is where the regression test suite from [Regression Testing Across Revisions]({{< relref "/docs/design-development/validation-and-verification/regression-testing" >}}) earns its keep: run the fix-specific test to confirm the improvement, then run the regression suite to confirm nothing else broke.

## Correlation with Simulation

If the design was simulated before being built (and it should be, for anything analog or power-related), the test results provide an opportunity to check the simulation's accuracy. Does the measured output voltage match the SPICE prediction? Does the measured bandwidth match the AC analysis? Does the measured power dissipation match the thermal simulation?

Agreement between simulation and measurement builds confidence in both — the model is accurate, and the measurement is trustworthy. Disagreement is even more informative because it means something is wrong with the model, the measurement, or both.

Common sources of simulation-measurement disagreement include:

- **Parasitic elements not in the model.** PCB trace resistance, via inductance, connector contact resistance, and stray capacitance all affect real circuits but may not appear in the simulation. If the measured bandwidth is lower than simulated, stray capacitance is a likely culprit.
- **Component models that don't match reality.** SPICE models are approximations. Some are excellent; some are crude. If the measured behavior differs from simulation, the model's accuracy for the specific operating conditions should be questioned.
- **Measurement artifacts.** The measurement itself can perturb the circuit. A scope probe adds capacitance and resistance. A current sense resistor adds voltage drop. If the simulation agrees with theory but not with measurement, consider whether the measurement technique is introducing the discrepancy.

Documenting these correlations — where simulation matched, where it diverged, and why — is valuable reference material for future designs that use similar circuits or components.

## Updating Models

When simulation doesn't match measurement, the model needs attention. This might mean updating component models with more accurate parameters, adding parasitic elements that were omitted, or adjusting environmental conditions in the simulation to match the actual test conditions.

For component models, the best source of truth is the manufacturer's model, validated against your measurements. If the manufacturer's model doesn't match, you may need to extract parameters from your own measurements — a process that's tedious but produces models that are accurate for your specific application.

For parasitic models, PCB layout extraction tools can generate parasitic networks from the physical layout. Even rough estimates are better than nothing — adding 1 nH per via and 10 pF per cm of trace to critical nets often explains discrepancies that disappear when parasitics are included.

The investment in model accuracy compounds over time. Accurate models lead to simulations that predict real behavior, which means fewer surprises during testing, which means fewer design spins. Every hour spent improving a model saves multiple hours in future iterations.

## Design Guidelines from Test Data

Test results from one project often reveal patterns that apply broadly. These patterns become design guidelines — rules of thumb backed by measurement data that prevent repeating the same mistakes.

For example, if testing reveals that a particular regulator oscillates without a minimum output capacitance of 22 uF, that's not just a fix for this board — it's a design guideline: "always place at least 22 uF on the output of regulator X, regardless of datasheet minimum." If margin testing shows that a particular ADC reference needs 100 ms of settling time after power-on before readings are accurate, that becomes a firmware initialization rule.

These guidelines are most useful when they include the supporting evidence: the measurement data, the conditions, and the reasoning. "Always use 100 nF decoupling" is a rule of thumb. "Use 100 nF decoupling on each VDD pin of the STM32F4, placed within 2 mm of the pin, because testing showed that 4.7 nF was insufficient to suppress switching noise below the -80 dBm level needed for ADC accuracy" is a design guideline backed by evidence.

Collecting these guidelines in a central location — a design checklist, a wiki page, a section of this notebook — makes them accessible to future projects. The value accumulates with every project: each test failure that generates a new guideline reduces the probability of the same failure on the next design.

## Sharing Lessons Across Projects

Knowledge gained from testing one project applies to others. If you learn that a particular component is sensitive to moisture, that lesson applies to every future design using that component or similar ones. If you discover that a particular layout pattern causes EMC problems, that lesson applies to every future layout.

The challenge is making lessons findable. Project-specific test reports are useful for that project; cross-project design guidelines are useful for the organization (or the individual engineer's body of knowledge). The transfer mechanism can be as simple as a "lessons learned" section in the project close-out documentation that gets reviewed at the start of each new project.

For personal learning projects, this notebook serves that function. Recording what was learned — not just what was built — makes each project contribute to a growing body of practical knowledge.

## The Continuous Improvement Mindset

Feeding data back into design is not a one-time activity; it's a mindset. Every test result is an opportunity to improve the design process, not just the current design. The question is not just "how do we fix this board?" but "how do we prevent this class of problem on all future boards?"

This mindset shifts the focus from reactive (fix the bug) to proactive (prevent the class of bugs). It's the difference between "add a capacitor here because the board oscillates" and "update the power supply design checklist to always verify loop stability at minimum load."

Continuous improvement also applies to the testing process itself. If a test missed a failure that was later found in the field, the test needs improvement. If a test consistently produces ambiguous results, the test procedure or criteria need refinement. The quality of the testing process is itself something to be measured, evaluated, and improved.

The feedback loop is never closed permanently. New components, new applications, new environments, and new failure modes continuously generate new lessons. The goal is not a static set of perfect guidelines but a living process that steadily reduces the gap between design intent and real-world performance.

## Gotchas

- **Root cause vs symptom.** Treating the symptom (adding a bigger capacitor) without understanding the root cause (inadequate loop stability margin) means the problem will reappear in a different form on the next project.
- **Simulation-measurement disagreement is informative.** Dismissing the disagreement as "SPICE is just an approximation" wastes the most valuable data you have. Investigate the discrepancy — it always teaches something.
- **Design guidelines without evidence decay into folklore.** "We always do it this way" is only useful if you know why. When guidelines are backed by measurement data, they can be evaluated, updated, and applied correctly to new situations.
- **Lessons not recorded are lessons lost.** You will forget. Write it down. The act of recording a lesson also forces you to articulate it clearly, which often deepens your understanding.
- **Sharing requires effort.** Lessons from one project don't automatically transfer to the next. Explicit mechanisms — checklists, design reviews, project retrospectives — are needed to make the transfer happen.
- **Perfection is the enemy of progress.** You don't need a perfect model or a complete set of guidelines before they're useful. An approximate model that captures the dominant behavior is far more valuable than no model at all. Start with what you know and refine over time.
