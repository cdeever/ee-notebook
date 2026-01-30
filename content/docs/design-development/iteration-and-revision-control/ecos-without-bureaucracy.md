---
title: "ECOs Without Bureaucracy"
weight: 40
---

# ECOs Without Bureaucracy

Engineering Change Orders exist because uncontrolled changes wreck projects. A resistor gets swapped without updating the schematic. A layout is modified without telling the test engineer. A component is substituted without checking whether the replacement meets the original specification. Each of these causes problems — sometimes immediately, sometimes weeks later when nobody remembers the change was made. ECOs prevent this by formalizing the process: propose, review, approve, implement, verify. But formal ECO processes were designed for production environments with multiple teams and regulatory requirements. For a prototype-stage personal project, a full ECO system is like using a crane to lift a coffee cup — the right idea at the wrong scale.

## Lightweight Change Management

The principle behind an ECO is sound at any scale: changes should be deliberate, documented, and verified. The implementation, however, should match the project's size and stakes.

For a solo learning project, a lightweight change management system might be nothing more than a text file in the project repository:

```
## Change Log

### CHG-005: 2025-06-12
- What: Changed R7 from 10k to 4.7k
- Why: LED brightness insufficient at 1 meter distance;
  increasing current from 1 mA to 2.1 mA
- Test: Verified 2.1 mA through LED, 220 mcd measured at 1 m
- Status: Implemented on Board #3, incorporated in Rev B schematic
```

This captures all the essential information — what, why, test, status — without forms, signatures, or workflow tools. It takes two minutes to write and provides a permanent record.

For a small team, a shared issue tracker (GitHub Issues, for example) adds visibility and discussion. Each change gets an issue number, the rationale is in the description, discussion happens in comments, and closing the issue signals implementation. The issue tracker's search and filtering capabilities make it easy to find past changes.

## When to Formalize

The threshold for formal change management depends on several factors:

- **Number of people involved.** Solo projects can manage changes informally because there's only one person to coordinate. Once two or more people are making changes, a shared system becomes necessary to prevent conflicting modifications.
- **Production status.** A prototype has low stakes — if a change breaks something, you rework the board. A production design has high stakes — a change that breaks something affects every unit built after that change. Production designs need formal control.
- **Regulatory requirements.** Medical devices, automotive electronics, aerospace systems, and other regulated products require documented change control as a condition of certification. The regulatory framework often specifies the level of documentation required.
- **Customer commitments.** If a customer has approved or qualified a specific design revision, changes to that design require the customer's agreement. Formal ECOs are the mechanism for this communication.

For most learning and personal projects, the answer is: keep it informal but consistent. A text file, a spreadsheet, or issue tracker entries — used consistently — provide adequate change control. Formalize when the stakes demand it, not before.

## The Change Cycle

Whether formal or informal, every change follows the same logical cycle:

1. **Identify the need.** A test failure, a component availability issue, a performance improvement opportunity, or a cost reduction idea triggers the change.
2. **Propose the change.** Describe what will change, why, and what the expected impact is. For a personal project, this might be a mental evaluation; for a team, it's a written proposal.
3. **Review the impact.** Consider what else might be affected. Does the resistor change affect a voltage divider ratio? Does the layout change affect a controlled-impedance trace? Does the component substitution change the thermal profile?
4. **Approve and implement.** Make the change in the design files, update the BOM, and modify the physical board if applicable.
5. **Verify.** Test the changed design to confirm that the change achieves its purpose and hasn't introduced new problems. This is where the regression test suite from [Regression Testing Across Revisions]({{< relref "/docs/design-development/validation-and-verification/regression-testing" >}}) applies.

Skipping the review step is the most common shortcut and the most dangerous one. "It's just one resistor" is the preamble to many debugging sessions. Even a single component change can have ripple effects through the circuit.

## Batch Changes

Design changes can be handled individually or accumulated into batches. Both approaches have tradeoffs.

Individual changes (one change per revision) provide maximum traceability — if something breaks after Rev C, and Rev C contains only one change, the cause is obvious. But individual changes are expensive in hardware terms: each revision requires a new board spin, new assembly, and new testing.

Batch changes (multiple changes per revision) are more efficient but harder to debug. If Rev C contains fifteen changes and something breaks, any of the fifteen could be responsible. Isolating the culprit requires systematic testing or bisection.

The practical approach for most projects is to batch changes within a revision but document each change individually. Accumulate changes during prototype testing and rework, recording each one in the change log. When enough changes have accumulated to justify a new board spin, implement them all in the next revision. The change log provides the individual traceability; the revision groups them for fabrication efficiency.

Exceptions exist: safety-critical changes should be implemented and verified immediately, not batched. If testing reveals that a protection circuit doesn't work, waiting to include the fix in a future batch is unacceptable.

## Emergency Changes

Sometimes a change must be made immediately — a component is overheating, a protection circuit isn't protecting, or a critical function fails in a way that blocks all further testing. Emergency changes bypass the normal review process because the cost of delay exceeds the cost of a less-reviewed change.

Emergency changes still need documentation, but the documentation can come after the change rather than before. The pattern is: make the change, fix the immediate problem, and then document what was done, why, and what the impact assessment is. The key discipline is to actually complete the documentation step — emergency changes that remain undocumented are the leading cause of phantom BOMs and untraceable boards.

Emergency rework instructions should include:

- What to change (specific component reference, old value, new value).
- How to change it (removal method, soldering instructions, any special considerations).
- How to verify the change (measurement to confirm correct implementation).
- Scope (which boards need the change — all boards, only boards without the fix, only boards exhibiting the failure).

For prototype work, emergency changes are common and expected. The discipline is in the documentation, not in preventing the changes.

## The Documentation-to-Effort Ratio

The right level of change documentation depends on the project's stage, scale, and stakes. Too little documentation leads to confusion; too much documentation slows progress and gets abandoned.

A useful guideline: the documentation should take less time than the change itself. If changing a resistor takes five minutes, the documentation should take two minutes, not twenty. If redesigning the power supply takes two weeks, a detailed change document taking an hour is entirely reasonable.

For a personal learning project, a one-line entry in a change log file is usually sufficient for small changes. For changes that involved significant analysis or debugging, a paragraph explaining the investigation and reasoning is appropriate. The test of adequacy is: "If I read this entry six months from now, will I understand what happened and why?"

The answer to "how much documentation?" is never "none." Even the simplest change benefits from a record. But the answer is also never "as much as possible" — because that leads to a documentation practice that's so burdensome it gets abandoned, which is the same as "none."

## Gotchas

- **Informal doesn't mean undocumented.** Skipping formal ECOs is fine for small projects. Skipping documentation entirely is not. The change log is the minimum.
- **"It's just one resistor" precedes many debugging sessions.** A single component change can affect voltage dividers, timing constants, filter responses, power dissipation, and thermal behavior. Review the impact before implementing.
- **Emergency changes have the highest documentation debt.** They're made under pressure, and the documentation step is the first thing dropped. Build the habit of documenting emergency changes within 24 hours — before the reasoning fades.
- **Batch changes obscure causality.** When fifteen changes are implemented simultaneously and something breaks, identifying the culprit is expensive. Consider the debugging cost when deciding how many changes to batch.
- **The approval step is where design review happens.** Removing the approval step to save time removes the safeguard against bad changes. For team projects, keep the review even if you streamline everything else.
- **Change fatigue is real.** On a fast-moving prototype, changes happen daily. The temptation to stop documenting "because it's all changing anyway" leads to total loss of traceability. Discipline during rapid iteration is when documentation matters most.
