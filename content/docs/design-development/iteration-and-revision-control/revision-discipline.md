---
title: "Revision Discipline"
weight: 10
---

# Revision Discipline

A revision is not just another version of the board — it's a specific, documented snapshot of the design at a point in time. Without revision discipline, you end up with a pile of boards that look similar but behave differently, schematics that might or might not match the hardware in your hand, and BOMs that describe something that no longer exists. Revision discipline is the habit of making each snapshot deliberate, labeled, and traceable.

## Naming Conventions

Pick a naming convention and stick with it. The two most common schemes are letter-based (Rev A, Rev B, Rev C) and number-based (1.0, 1.1, 2.0). Both work. Mixing them doesn't.

Letter-based naming is simple and common in hardware. Rev A is the first prototype, Rev B incorporates the first round of fixes, and so on. The letters are unambiguous and easy to stamp on a silkscreen. The downside is that they don't inherently distinguish between minor and major changes — Rev B might be a single resistor value change or a complete layout redesign.

Number-based naming (semantic versioning) adds that distinction. Version 1.0 is the first release, 1.1 is a minor change (component value, silkscreen fix), and 2.0 is a major change (new architecture, different MCU, layout redesign). This carries more information but requires judgment about what constitutes "major" vs "minor."

For personal and small-team projects, letter-based naming is usually sufficient. The important thing is that every board revision has a unique, unambiguous identifier that appears on the board itself, in the schematic, in the BOM, and in any test documentation that references it.

## What Constitutes a New Revision

Any change to the schematic, layout, or BOM creates a new revision. This seems strict, but the alternative — having changes that exist in some files but not others, or on some boards but not all — leads to confusion that costs far more time than the discipline of incrementing a revision letter.

Changes that require a new revision include:

- Any schematic change: added or removed components, changed values, changed connections.
- Any layout change: moved components, rerouted traces, changed board outline.
- Any BOM change: different component, different manufacturer, different package.
- Any silkscreen change: added text, corrected labeling, updated revision marking.

Changes that don't require a new board revision but should still be documented include firmware-only changes (tracked by firmware versioning, not hardware revision) and test procedure changes. These are configuration changes, not design changes, and they're tracked separately.

The key principle is that a hardware revision identifier refers to a specific, frozen set of design files. If the files change, the identifier must change.

## Marking Boards

Every physical board should carry its revision on the silkscreen — visible without magnification, in a location that isn't covered by components or enclosures. This is the most basic form of revision tracking, and it's surprising how often it's omitted.

A complete board marking includes:

- **Project name or identifier.** Something that distinguishes this project from others on your bench.
- **Revision.** Rev A, Rev B, or whatever convention you've chosen.
- **Date code.** The date the design files were released for fabrication — not the fab date or assembly date. Format: YYYY-MM-DD or YYYYMMDD.
- **Serial number area.** A blank space or a sequential number for distinguishing individual boards within the same revision. A blank space with a label like "S/N:" can be filled in by hand with a marker.

Some designers also include a short URL or QR code linking to the project repository. This is optional but useful for boards that might end up on someone else's bench months or years later.

The silkscreen is the minimum. For boards that might be reworked or modified, a sticker or label area allows adding information after assembly — "rework per ECO-003" or "modified per Rev C schematic, awaiting Rev C PCB."

## Revision History in the Schematic

The schematic itself should contain a revision history — a table (typically in the title block or on a dedicated sheet) that lists each revision, the date, and a brief description of the changes. This table is the primary design-level change record.

A minimal revision history table:

| Rev | Date | Description |
|-----|------|-------------|
| A | 2025-03-15 | Initial prototype |
| B | 2025-05-02 | Changed R7 from 10k to 4.7k, added C12 for decoupling, corrected U3 footprint |
| C | 2025-07-20 | Redesigned power supply section, added reverse polarity protection |

The description should be specific enough to understand the scope of changes but brief enough to fit in a table. Detailed rationale for each change belongs in the change log (see [Change Tracking & Rationale]({{< relref "/docs/design-development/iteration-and-revision-control/change-tracking-and-rationale" >}})), not in the revision history table.

## Plan for Iteration

The first revision is never the last. Expecting perfection from Rev A is unrealistic and leads to either paralysis (never releasing because it's not perfect) or disappointment (releasing and being surprised by the necessary changes).

Planning for iteration means:

- **Leave room in the layout.** Don't fill every square millimeter of the first board. Leave space for additional components, test points, and routing changes that the first round of testing will inevitably require.
- **Add test points.** Bring key signals — power rails, clock lines, communication buses, analog nodes — to accessible test points. These are essential for bring-up and validation, and they cost almost nothing in board area.
- **Include unpopulated component positions.** If you suspect you might need a filter, a pull-up, or a protection device but aren't sure, add the footprint and leave it unpopulated. It's far cheaper to solder one component onto an existing pad than to bodge-wire it to a board that doesn't have the footprint.
- **Document assumptions.** Every design decision rests on assumptions — about the load, the environment, the component behavior. Write them down. When the first prototype doesn't behave as expected, the assumptions are the first things to check.

Iteration is not failure. It's the expected, healthy progression of a design from initial concept to working product. Revision discipline ensures that each iteration builds on the last rather than starting from confusion.

## Release Process

"Releasing" a revision means declaring that the design files are frozen and ready for fabrication. This is a deliberate act, not something that happens by accident. The release process ensures that the schematic, layout, and BOM are self-consistent and that the files sent to the fabricator match the files in the repository.

A minimal release checklist:

1. Run design rule check (DRC) on the layout — no violations.
2. Run electrical rules check (ERC) on the schematic — no errors, all warnings reviewed.
3. Verify that the BOM matches the schematic — every component accounted for.
4. Generate fabrication outputs (gerbers, drill files) from the final layout.
5. Review gerbers in a viewer — compare against the layout for obvious errors.
6. Tag the repository (if using version control) with the revision identifier.
7. Update the revision history in the schematic.
8. Archive the complete file set (schematic, layout, BOM, gerbers, assembly drawings) as a single, immutable package.

After release, changes require a new revision. The released files are not modified — they represent the historical record of what was fabricated. This discipline prevents the confusion of having gerbers that don't match the schematic, or a BOM that describes a different board than the one in your hand.

## Gotchas

- **Unlabeled boards are untraceable.** If the silkscreen doesn't carry the revision, you'll spend time with a multimeter trying to figure out which board you're holding. Always mark the revision, always.
- **Revision history gaps cause confusion.** If you skip from Rev A to Rev C, someone will wonder what happened to Rev B. Either include every revision or note explicitly that Rev B was never fabricated.
- **"I'll remember what changed" is always wrong.** You won't. Write it down. The five minutes spent documenting changes saves hours of forensic investigation later.
- **Firmware versions and hardware versions are independent.** A hardware Rev B might run firmware v1.0, v1.1, or v2.0. Track them separately and document compatibility: "Firmware v2.0 requires hardware Rev C or later."
- **Releasing too early wastes money.** If you send gerbers to the fab before finishing the design review, you'll find the error the next morning and have to spin again. Take the time to review before releasing.
- **Never-releasing wastes time.** If you keep refining indefinitely because "one more change" will make it perfect, you never get the feedback that only comes from building and testing real hardware. Ship Rev A, learn from it, and build Rev B.
