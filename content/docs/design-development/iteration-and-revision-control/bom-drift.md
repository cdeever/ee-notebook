---
title: "BOM Drift"
weight: 30
---

# BOM Drift

The bill of materials is supposed to be the definitive list of what's on the board — every component, every value, every package, every manufacturer part number. In practice, the BOM drifts. Components get substituted during assembly because the original part is out of stock. Values get changed during debugging but the BOM doesn't get updated. Hand-soldered modifications accumulate across prototype boards. Eventually, the BOM on file describes a board that doesn't exist, and the board on the bench has components that aren't in any document.

## Sources of Drift

BOM drift has several common causes, and understanding them is the first step toward controlling them:

- **Component substitutions during assembly.** A specified part is unavailable, so a "compatible" alternative is used. The substitution might be electrically identical, or it might have subtly different characteristics — different ESR on a capacitor, different thermal resistance on a regulator, different rise time on a logic gate. If the substitution isn't recorded in the BOM, the document and the hardware diverge.

- **Value changes during debugging.** Testing reveals that a resistor value needs to change. The component is swapped on the board, the schematic might get updated, but the BOM is forgotten. This is the most common source of drift on prototype boards — the BOM is generated from the schematic, but after the schematic is generated, hand modifications on the board create a gap.

- **Package changes.** A component is available in 0402 but not 0603, or vice versa. The substitution works physically, but the BOM still lists the original package. This causes problems when ordering for the next revision or when someone else tries to assemble from the BOM.

- **Hand-soldering modifications.** Bodge wires, added components, removed components — all the rework that happens during prototype development. Each modification is a BOM deviation that should be documented but often isn't.

- **DNP (Do Not Populate) confusion.** Components that are in the schematic and BOM but intentionally left off the board. If DNP status isn't clearly tracked, it's easy to lose track of which components are supposed to be present and which are deliberately absent.

## Phantom BOMs

A phantom BOM is a document that describes something that doesn't match any physical board. It typically arises when the schematic has been updated but the board hasn't been reworked to match, or when the board has been reworked but the schematic hasn't been updated. The BOM, generated from the schematic, inherits whatever disconnect exists between the schematic and the hardware.

Phantom BOMs are dangerous because they create false confidence. You think you know what's on the board because you have a document that says so. But the document is wrong, and decisions based on it — ordering components, debugging a failure, comparing to a simulation — are based on incorrect information.

The cure is simple but requires discipline: after any change to the board or the schematic, verify that the BOM matches both. This takes a few minutes and prevents hours of confusion. For prototype boards with extensive rework, maintain a "board-specific BOM" that documents exactly what's on each individual board, separate from the "design BOM" that describes the intended next revision.

## BOM Management Tools

For small projects, a spreadsheet exported from the schematic tool is adequate. KiCad, for example, generates a BOM from the schematic with component values, footprints, and reference designators. This export is the starting point; additions for manufacturer part numbers, distributor information, and pricing make it useful for ordering.

For larger projects or ongoing work, dedicated BOM management tools provide more structure:

- **KiCad BOM export with plugins.** KiCad supports BOM export scripts that can generate formatted BOMs with grouped components, part numbers, and pricing from distributor APIs.
- **Spreadsheets with structure.** A well-organized spreadsheet with columns for reference designator, value, footprint, manufacturer, MPN, distributor, and price is sufficient for most prototype work. The key is maintaining it consistently.
- **Inventory tools.** Tools like InvenTree or PartsBox track both the BOM and the physical inventory, linking what's specified to what's on the shelf. This is useful when managing multiple projects and shared component stocks.

The tool matters less than the practice. A consistently maintained spreadsheet beats an abandoned database. Choose whatever you'll actually use.

## BOM Review as Part of Revision Process

Every time a new revision is released, the BOM should be reviewed and verified against the schematic. This review catches:

- Components in the schematic that are missing from the BOM (usually due to export errors or manual BOM editing).
- Components in the BOM that are no longer in the schematic (remnants from a previous revision).
- Value or footprint mismatches between the schematic and the BOM.
- Manufacturer part numbers that don't match the specified value or package.
- Components that are no longer available from the specified manufacturer or distributor.

This review is a checklist task that takes 15-30 minutes for a moderately complex board. It's monotonous, but it catches errors that would otherwise result in wrong-part assembly, ordering delays, or mysterious test failures.

For KiCad users, generating a fresh BOM export from the current schematic and diffing it against the existing BOM file is a quick way to identify discrepancies. Any difference is either an intentional update (which should be in the change log) or an error (which should be corrected).

## Cost Drift

BOMs also drift in cost. Component prices change with market conditions, availability, and order volume. A BOM costed at $15 per unit six months ago might cost $20 today — or $10, if a key component dropped in price or a cheaper alternative became available.

For production projects, periodic BOM cost re-evaluation is essential. For learning and prototype projects, it matters less — but it's still useful to understand the cost trajectory, especially if the project might eventually move toward production.

The most common cost surprises are:

- **Obsolete components.** A key part goes end-of-life, and the replacement is more expensive, differently packaged, or differently characterized. Catching this early allows for a design change rather than an emergency substitution.
- **Minimum order quantities.** A component that costs $0.10 in 1000-piece quantities costs $2.50 for a single piece from a distributor. Prototype BOM cost and production BOM cost are very different numbers.
- **Currency and tariff changes.** For components sourced internationally, exchange rates and import duties affect cost in ways that are hard to predict.

Tracking BOM cost at each revision provides a cost history that helps with budgeting and with identifying cost-reduction opportunities.

## The "What's Actually on This Board?" Problem

When multiple prototype boards exist — each potentially with different rework, different component substitutions, and different firmware versions — the question "what's actually on this board?" becomes surprisingly hard to answer. The design BOM describes the intended configuration. The actual board might be different.

The practical solution is physical labeling. Each board should carry:

- Its revision identifier (on the silkscreen).
- A serial number or unique identifier (handwritten or label).
- A list of deviations from the design BOM (on a label attached to the board or documented in a per-board record).

For small numbers of prototypes, a simple log works: "Board #3: Rev A, modified per ECO-002 (R7 changed to 4.7k, C15 changed to 1 uF), running firmware v1.3." This log lives in the project repository alongside the design files and test results.

The effort invested in tracking individual boards is small but prevents the all-too-common scenario of spending an hour debugging a problem that turns out to be caused by a modification you forgot you made on that particular board.

## Gotchas

- **The BOM you exported last month is already wrong.** If you've made any schematic changes since the export, the BOM is out of date. Re-export before ordering or assembling.
- **"Compatible" substitutions aren't always compatible.** A ceramic capacitor substituted for another ceramic of the same value might have different voltage derating, different temperature coefficient, or different ESR. Check the datasheet, not just the value.
- **DNP is not the same as "not in BOM."** Do Not Populate components should remain in the BOM with a DNP flag. Removing them entirely makes it unclear whether the component was deliberately omitted or accidentally forgotten.
- **Hand modifications are invisible to the BOM.** Every bodge wire, every swapped resistor, every added capacitor creates a gap between the BOM and reality. Document rework immediately, not "later."
- **Prototype BOM cost is not production BOM cost.** Single-piece pricing from distributors is 5-20x the volume price. Don't use prototype costs to estimate production economics.
- **BOM drift is cumulative and silent.** Each small undocumented change is forgettable. Fifty of them create a board that nobody fully understands. The antidote is consistent, immediate documentation of every deviation.
