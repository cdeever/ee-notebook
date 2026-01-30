---
title: "When to Spin vs Patch"
weight: 50
---

# When to Spin vs Patch

Every hardware problem presents the same fork in the road: do you spin a new board revision, or do you patch the one you have? Spinning costs money and time — new gerbers, new fabrication, new assembly, new testing. Patching is cheaper and faster, but it accumulates technical debt in the form of bodge wires, cut traces, and hand-soldered modifications that make the board increasingly fragile and difficult to debug. Neither option is always right. The skill is knowing when each one is appropriate.

## When to Spin

A new board spin is justified when the changes are significant enough that patching would create more problems than it solves. Specific situations that favor spinning:

- **Layout-critical changes.** Any change that affects controlled impedance traces, power plane integrity, or critical component placement can't be reliably implemented as a bodge. If the fix requires moving a component or rerouting a differential pair, you need a new board.
- **Many accumulated patches.** When the current board has five or ten bodge wires, the board itself has become an unreliable test platform. Noise from long bodge wires, parasitic effects from dangling cut traces, and the sheer fragility of hand-rework all compromise the validity of any measurements. A clean board restores confidence.
- **Moving to production.** A prototype with rework is fine for development. A production board must be clean — no bodge wires, no manual modifications, no deviation between the design files and the physical board. Spinning a clean production-intent board is a necessary step.
- **Footprint or package errors.** If a component's footprint doesn't match the actual part — wrong pad size, wrong pin spacing, wrong pin numbering — no amount of rework makes it right. The board needs to be respun with the correct footprint.
- **Mechanical changes.** Board outline changes, mounting hole relocations, connector repositioning, and enclosure interface modifications require a new layout.
- **Shared with others.** If the board will be assembled by someone else or used as a reference, it should be clean. Handing someone a board covered in bodge wires with a sheet of rework instructions is asking for assembly errors.

## When to Patch

Patching is appropriate when the change is small, well-defined, and doesn't affect layout-critical parameters. Situations that favor patching:

- **Single-component value changes.** Swapping a resistor or capacitor value is straightforward hand rework that doesn't affect the layout. If the footprint is the same, remove the old part and solder the new one.
- **Adding a small component.** A decoupling capacitor, a pull-up resistor, or a protection diode can often be soldered point-to-point between existing pads or test points. This is a legitimate fix, not a hack, as long as it's documented.
- **Cutting a trace and adding a wire.** Simple circuit modifications — interrupting a connection and rerouting it — are standard prototype rework. They're ugly but effective for validating a fix before committing to a board spin.
- **Temporary debugging aids.** Series resistors for current measurement, headers for logic analyzer connection, and other temporary modifications are expected on development boards and don't need to be "clean."
- **Validating before spinning.** Before committing to a board spin, patch the fix onto the existing board and verify it works. This avoids the expensive mistake of spinning a board with a fix that doesn't actually solve the problem.

The last point is particularly important: always validate a fix on the existing board before incorporating it into a new revision. A board spin based on an untested fix is a gamble. A board spin based on a tested fix is a known improvement.

## Bodge Wire Discipline

Bodge wires are an accepted part of prototype development. But undisciplined bodge work creates boards that are fragile, difficult to debug, and impossible to reproduce. A few practices keep bodge work manageable:

- **Document every bodge.** Photograph the rework and record it in the change log. Include the reference designators, the old and new values, and any added wires or cut traces. This is essential — see [Change Tracking & Rationale]({{< relref "/docs/design-development/iteration-and-revision-control/change-tracking-and-rationale" >}}).
- **Keep wires short.** Long bodge wires add inductance and act as antennas. For signal-integrity-sensitive connections, keep wires as short as physically possible.
- **Secure wires mechanically.** A wire that's only held by its solder joints will eventually break. Use adhesive, kapton tape, or hot glue to strain-relieve bodge wires, especially on boards that will be handled frequently.
- **Use appropriate wire.** Solid wire (30 AWG wire-wrap wire) for short, static connections. Stranded wire for connections that might flex. Coaxial cable for RF or high-speed signals. The wire type should match the signal's requirements.
- **Mark reworked areas.** A dot of nail polish, a label, or a marking pen near the reworked area makes it visible during inspection and reminds you (or someone else) that this area has been modified.

## The "One More Fix" Trap

There's a seductive pattern where the current board is almost right — just one more fix and it'll be perfect. So you make the fix. Then you find something else. One more fix. And another. Eventually, the board is a patchwork of modifications, each individually reasonable, collectively creating something fragile and untraceable.

The "one more fix" trap wastes time in two ways. First, each bodge takes time to implement, document, and verify. Second, the accumulating modifications reduce confidence in the board as a test platform — you're no longer sure whether a test result reflects the design or the rework.

A useful rule of thumb: when the number of bodge wires on a board exceeds five, or when the rework has modified a critical signal path (power, clock, or high-speed data), it's time to spin. The cost of a new board is typically $50-500 for a prototype quantity; the cost of engineering time spent nursing a heavily reworked board is usually much higher.

## Green Wire vs Blue Wire

Some organizations use color conventions for bodge wires to communicate the status of the modification:

- **Green wire**: An approved change that will be incorporated in the next revision. This is a permanent fix, validated and documented.
- **Blue wire**: A temporary modification for debugging or experimentation. This may or may not be incorporated in the next revision.
- **Red wire**: A safety-critical modification that must be preserved.

These conventions aren't universal, and the specific colors vary. The principle — distinguishing between permanent fixes and temporary experiments — is useful at any scale. On a personal project, you might use two colors of wire-wrap wire and your own conventions. The point is that looking at the board tells you something about the intent of each modification.

## Cost Analysis

The decision to spin versus patch has a financial dimension:

- **PCB fabrication**: $5-50 for small 2-layer boards from budget fabs (JLCPCB, PCBWay), $100-500 for more complex boards (4+ layers, tight tolerances, fast turnaround).
- **Assembly**: $0 for hand assembly, $100-500 for small-batch PCBA with simple boards.
- **Components**: Already in stock (no additional cost) or $20-200 for a new set.
- **Turnaround time**: 5-15 business days for standard fab, 2-5 days for expedited, plus shipping.

Compare this to the engineering time cost of working around a flawed layout:

- **Rework time**: 15-60 minutes per bodge, including documentation.
- **Debugging overhead**: Extra time spent diagnosing whether a problem is real or rework-related.
- **Confidence cost**: Reduced trust in test results from a heavily modified board.

For a board with a $30 fab cost, spending more than a few hours nursing bodge wires instead of spinning is economically irrational. For a $500 board, the threshold is proportionally higher. The calculation is straightforward: estimate the remaining engineering time on the current board versus the cost and time of a clean spin.

## Gotchas

- **Untested fixes don't belong in a board spin.** Always validate a fix on the existing board before incorporating it into the next revision. A board spin based on an untested change is a gamble with money and time.
- **Bodge wires are antennas.** A 3 cm bodge wire has significant inductance at frequencies above a few MHz. For high-frequency signals, bodge wires can introduce problems that don't exist in a properly routed board. Test results from bodged high-speed circuits should be interpreted with caution.
- **The rework that looks fine today breaks tomorrow.** Bodge wires fatigue, cold solder joints develop, and components shift when the board is handled. Prototype rework is temporary by nature — don't treat it as permanent.
- **Sunk cost thinking delays necessary respins.** "We've already put so much work into this board" is not a reason to keep patching. The question is always forward-looking: is the next hour better spent patching or spinning?
- **Respinning without reviewing all accumulated changes misses fixes.** Before spinning, review every bodge, every change log entry, and every known issue. A new board that incorporates nine of ten fixes but misses the tenth is a preventable failure.
- **Someone else's bodge wire is invisible.** If you didn't do the rework yourself, you might not even notice it during debugging. Thorough documentation and visible marking prevent this.
