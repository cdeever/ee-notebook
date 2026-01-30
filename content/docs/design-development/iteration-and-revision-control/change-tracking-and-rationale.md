---
title: "Change Tracking & Rationale"
weight: 20
---

# Change Tracking & Rationale

Every change to a design has a reason. Maybe it was a test failure, a component going obsolete, a layout optimization, or a cost reduction. Whatever the reason, if it isn't recorded, it vanishes — and the next person to look at the design (including future you) will wonder why a resistor value is different from the reference design, or why a particular trace was routed in an apparently suboptimal way. Change tracking records the what; rationale recording captures the why. Both are essential.

## The Change Log

A change log is a chronological record of every modification to the design. At minimum, each entry should capture:

- **What changed.** The specific component, connection, layout feature, or parameter that was modified.
- **Why it changed.** The reason for the change — a test failure, a simulation result, a component availability issue, a customer requirement.
- **Who decided.** The person who made or approved the change.
- **When.** The date of the change.
- **Which revision.** The revision that incorporates the change.

For a personal project, a markdown file in the project repository is perfectly adequate. For a team project, a shared spreadsheet or issue tracker provides better visibility and searchability. The format matters less than the habit.

A change log entry should read like a brief engineering narrative: "Changed R7 from 10k to 4.7k to increase LED drive current from 1 mA to 2.1 mA, meeting the 200 mcd visibility requirement at 1 meter. Verified by measurement on Rev A board #003. Incorporated in Rev B." This takes thirty seconds to write and saves thirty minutes of detective work later.

## Engineering Change Orders (ECOs)

An Engineering Change Order is a formal change management document used in production environments. It typically includes the change description, the reason, the affected documents (schematic, layout, BOM, test procedures), the approval signatures, and the implementation instructions.

ECOs exist because in a production environment, an undocumented change can cause cascading problems: purchasing orders the wrong component, assembly builds the wrong board, test uses the wrong criteria, and the customer receives something that doesn't match the specification. The formality of an ECO is the mechanism that prevents this cascade.

For prototype and learning projects, full ECOs are overkill. But the concept behind them — that every change should be documented, reviewed, and implemented in a controlled way — applies at every scale. The difference is in the level of formality, not the principle. See [ECOs Without Bureaucracy]({{< relref "/docs/design-development/iteration-and-revision-control/ecos-without-bureaucracy" >}}) for lightweight approaches.

## Informal Change Tracking

For projects without formal ECO processes, informal change tracking can be just as effective if done consistently. Options include:

- **A CHANGES.md file in the repository.** Simple, version-controlled, and always available. Each entry follows a consistent format.
- **Git commit messages.** If the design files are in git (and KiCad files work well with git), each commit message can serve as a change record. The advantage is that the change history is intrinsically linked to the file changes.
- **A spreadsheet.** Columns for date, change description, rationale, affected files, and revision. Easy to filter, sort, and search.
- **Issue tracker entries.** GitHub Issues, GitLab Issues, or similar tools work well for tracking changes that start as problems or feature requests and are resolved by design modifications.

The best system is the one you'll actually use. A sophisticated tracking tool that's empty is less useful than a text file that's consistently maintained.

## The "Why" Is More Important Than the "What"

The what is usually visible in the design files themselves — a diff between Rev A and Rev B schematics shows every changed component, value, and connection. The why is invisible in the files and exists only in the heads of the people who made the changes.

"Changed C15 from 100 nF to 1 uF" is a fact you can extract from a schematic diff. But it doesn't tell you whether the change was made to fix an oscillation problem, to meet a new decoupling requirement, to compensate for a different component's parasitic, or because someone misread the original value. The rationale determines whether the change can be safely reversed, modified, or applied to a similar circuit in another project.

Without the why, future design decisions are made in a vacuum. If a cost reduction exercise proposes changing C15 back to 100 nF (saving $0.02), the absence of recorded rationale means nobody knows whether that's safe. With the rationale on record — "Changed C15 from 100 nF to 1 uF to eliminate 2 MHz oscillation on the 3.3V rail observed during Rev A testing" — the risk of the reversal is immediately clear.

Recording rationale takes seconds per change. Not recording it costs hours of investigation, or worse, reintroduces a problem that was already solved.

## Version Control for Design Files

Version control systems (git, SVN, Mercurial) are standard practice for software and increasingly common for hardware design files. KiCad's file formats are text-based and work well with git — schematics, layouts, and symbol/footprint libraries all produce meaningful diffs.

A basic git workflow for hardware design:

- **One commit per logical change.** "Changed voltage divider R7/R8 to correct ADC input scaling" is a good commit. "Updated schematic" is not — it tells you nothing about what changed or why.
- **Meaningful commit messages.** The commit message is a change log entry. Include the what, the why, and any relevant measurement data or references.
- **Tag each released revision.** When you generate gerbers for fabrication, tag the commit with the revision identifier (e.g., `rev-b`). This allows you to check out the exact files that were used for any past fabrication.
- **Branch for experiments.** If you're trying a speculative change (different power supply topology, alternative component), do it on a branch. If it works, merge it. If it doesn't, the main branch is unaffected.

The investment in learning git for hardware projects pays off immediately. The ability to see exactly what changed between any two revisions, to roll back a bad change, and to maintain parallel experimental branches is as valuable for hardware as it is for software.

## Diff Tools

Seeing what changed between revisions is essential for change tracking. Several tools support this:

- **KiCad's built-in diff.** Recent versions of KiCad support schematic comparison. The output highlights added, removed, and changed components and connections.
- **Visual gerber comparison.** Overlay the gerber files from two revisions and look for differences. Tools like gerbv, KiCad's gerber viewer, or online diff tools can generate overlay or difference images.
- **BOM comparison.** Export the BOM from both revisions as CSV files and diff them. This reveals added, removed, and changed components. A simple script can automate this comparison.
- **Git diff.** For text-based design files (KiCad), standard git diff shows line-level changes. This is most useful for schematic files; layout file diffs are harder to interpret as text.
- **PDF overlay.** Export schematics as PDFs, overlay them in a viewer, and look for differences. This is crude but effective for visual comparison.

The best practice is to generate a diff summary as part of the revision process. Before releasing a new revision, compare it to the previous one and verify that every difference is intentional and documented. Unexpected differences — changes that are present in the files but not in the change log — indicate either incomplete tracking or accidental modifications.

## Gotchas

- **"Changed R7" is not a useful change record.** Without the old value, the new value, and the reason, a change entry tells you almost nothing. Be specific: "Changed R7 from 10k to 4.7k to increase LED current to 2.1 mA."
- **Commit messages are change log entries.** Treat them as such. "Updated files" and "fixed stuff" are useless. "Fixed 3.3V rail oscillation by increasing C15 to 1 uF per Rev A test report #7" is a permanent record of engineering reasoning.
- **The why decays fastest.** You'll remember what you changed for a few weeks. The why fades within days. Record it immediately, while the reasoning is fresh.
- **Undocumented changes accumulate silently.** Each one is small. Together, they create a design that nobody fully understands. Consistent tracking prevents this drift.
- **Schematic diffs catch what humans miss.** Reviewing a diff is faster and more reliable than trying to remember every change you made. Always diff before releasing.
- **Change tracking is not overhead — it's context.** It feels like extra work when you're doing it. It feels like essential information when you need it.
