---
title: "Hardware Versioning Sanity"
weight: 60
---

# Hardware Versioning Sanity

Once a project accumulates more than one hardware revision, a new problem emerges: keeping track of what's what. Which board on the bench is Rev A and which is Rev B? Does the firmware loaded on this unit match the hardware revision? When the test report says "passed," which board was it tested on? These questions are easy to answer when there's one board. They become surprisingly difficult when there are six boards across three revisions, each with different rework, different firmware, and different test histories.

## Board Marking

The most basic versioning tool is physical marking on the board itself. This starts with the silkscreen and extends to applied labels.

Silkscreen marking should include, at minimum:

- **Project name or identifier.** Distinguishes this board from the dozen other boards on your bench.
- **Revision.** Rev A, Rev B, 1.0, 2.0 — whatever convention you've established (see [Revision Discipline]({{< relref "/docs/design-development/iteration-and-revision-control/revision-discipline" >}})).
- **Date code.** The date the design files were finalized, identifying when this revision was created.

Beyond the silkscreen, applied labels carry information that changes per unit:

- **Serial number.** A unique identifier for each individual board. This can be as simple as a sequential number written with a permanent marker. Serial number "Rev B - 003" tells you the revision, the specific unit, and gives you a handle for referring to it in test logs and change records.
- **Rework status.** If the board has been modified from the design BOM, a label noting "Modified per CHG-012" or "Reworked 2025-06-15" makes the modification visible without inspecting the board.
- **Firmware version.** For boards with programmable devices, a label or sticker indicating the loaded firmware version prevents confusion. Update the label every time you reprogram.

The effort is minimal — a label maker costs $20 and a roll of labels lasts for years. The return is enormous: the ability to look at any board and immediately know what it is, what's on it, and what state it's in.

## Firmware-Hardware Compatibility

Firmware and hardware revisions evolve on different timelines, and they're not always compatible. A firmware update might use a GPIO pin that was reassigned in a hardware revision. A hardware revision might add a new sensor that the current firmware doesn't support. Tracking compatibility is essential for avoiding the debugging nightmare of incompatible combinations.

A compatibility matrix captures this information:

| Firmware Version | Hardware Rev A | Hardware Rev B | Hardware Rev C |
|-----------------|----------------|----------------|----------------|
| v1.0 | Compatible | Compatible | Not tested |
| v1.1 | Compatible | Compatible | Compatible |
| v2.0 | Not compatible | Not compatible | Compatible |

The matrix doesn't need to be large or complex — it just needs to exist and be maintained. When someone picks up a board and asks "what firmware should I load?", the matrix provides the answer.

Incompatibility between firmware and hardware should be managed actively:

- **Firmware should detect hardware revision.** A GPIO pin tied high or low, a resistor divider read by an ADC, or an I2C EEPROM with the revision encoded — any of these allows firmware to identify the hardware revision at startup and either adapt its behavior or refuse to run on incompatible hardware.
- **Version checks at startup.** Firmware can include a check at power-on that reads the hardware revision and halts with a diagnostic message if the combination is untested or incompatible. This is far better than running silently with undefined behavior.
- **Document the boundaries.** The compatibility matrix should include not just "compatible" and "not compatible" but also "compatible with limitations" — "v1.1 works on Rev A but ADC channel 3 is not functional due to hardware bug fixed in Rev B."

## Test Fixture Versioning

Test fixtures — jig boards, programming adapters, cable harnesses, test scripts — are hardware too, and they have versions. A test fixture designed for Rev A might not work with Rev B if the connector pinout changed or a test point moved. If you don't track fixture versions, you risk testing with the wrong fixture and producing invalid results.

Test fixture versioning follows the same principles as board versioning:

- **Label the fixture** with a name, version, and the board revisions it supports.
- **Maintain compatibility records** between fixtures and board revisions.
- **Update the fixture** when the board changes, and document the update.
- **Store the fixture design** alongside the board design — same repository, same revision control.

For simple test setups (a cable with probes clipped to specific test points), a photograph of the setup labeled with the board revision it was designed for serves as both documentation and fixture definition. For more elaborate setups (bed-of-nails fixtures, automated test equipment), formal versioning becomes necessary.

## Storage and Labeling

Physical boards need physical organization. Unlabeled boards in a pile are a recipe for confusion, wasted debugging time, and accidental damage.

Practical storage guidelines:

- **Anti-static storage.** All boards should be stored in anti-static bags or on anti-static mats. A board damaged by ESD during storage creates a debugging mystery that's nearly impossible to solve.
- **Labeled bags or compartments.** Each board gets its own labeled bag or storage compartment. The label matches the board's serial number and includes the revision and rework status.
- **Separate working from archived boards.** Boards actively in use should be accessible. Boards from previous revisions that are being kept as references should be stored separately and clearly marked as archived, not in active use.
- **Don't rely on memory.** You will not remember which of the three identical-looking boards is the one with the modified power supply. Label everything.

The consequences of poor storage seem minor until you spend two hours debugging a "new" failure that turns out to be caused by grabbing the wrong board from the pile. Or until an unlabeled board is damaged by ESD because it wasn't in a bag. The prevention cost is trivial; the failure cost is not.

## The "Which Board Is This?" Problem

The scenario: you're debugging an intermittent failure. You have three boards on the bench — two Rev B and one Rev C. One of the Rev B boards has rework from last month. The other Rev B board is unmodified. You've been swapping between them to isolate the problem, and now you've lost track of which is which.

This situation is preventable but common. The solutions are all forms of labeling and discipline:

- **Assign serial numbers at assembly.** Every board gets a unique number the moment it's assembled. Write it on the board with a marker if you don't have labels.
- **Log which board is on the bench.** When you start a test session, note the serial number in your test log. This takes seconds and prevents hours of confusion.
- **Use physical differentiators.** If you don't have labels, a piece of colored tape, a sticker, or even the position on the bench can serve as a temporary identifier. Temporary is the key word — replace with proper labeling as soon as possible.
- **One board at a time.** When possible, keep only one board on the bench at a time. This eliminates the identification problem entirely, at the cost of swapping time.

## Configuration Management

Configuration management is the comprehensive practice of tracking the complete state of a system under test: which hardware, which firmware, which test fixture, which test procedure, and which environmental conditions. This is the umbrella that connects all the individual versioning practices.

A configuration record for a test session might look like:

```
Test Session: 2025-06-15
Board: Rev B, S/N 003, modified per CHG-012
Firmware: v1.3 (git commit a7b3c2d)
Test Fixture: Fixture v2, cable set B
Test Procedure: TP-001 rev 3
Environment: Lab bench, 24°C, bench supply at 12.0V
Equipment: Keysight 34465A S/N MY12345678 (cal due 2025-09)
```

This level of detail ensures that any test result can be fully contextualized and reproduced. It also makes comparisons between test sessions meaningful — if two sessions produced different results, the configuration record immediately shows what was different.

For personal projects, this might feel excessive. But even a stripped-down version — board ID, firmware version, date — is better than nothing. The goal is traceability: the ability to look at a test result and know exactly what produced it.

## Gotchas

- **Unlabeled boards multiply faster than you expect.** By the time you realize you need labels, you've already lost track. Label boards at assembly, not when confusion strikes.
- **Firmware-hardware mismatches produce mysterious failures.** The symptoms look like hardware bugs but disappear when the correct firmware is loaded. Always verify the firmware version before debugging hardware.
- **Test fixtures are invisible hardware.** They're easily overlooked in versioning schemes, but a wrong fixture produces wrong results just as surely as a wrong board does.
- **Memory is not a version control system.** "I know which board that is" works for about a week. After that, every board on the bench looks the same.
- **Archived boards get grabbed accidentally.** If old-revision boards are stored in the same place as current boards, someone will eventually pick up the wrong one. Physical separation prevents this.
- **Configuration management feels like overhead until it saves you.** The first time you can answer "what changed?" by consulting your configuration records instead of re-running a week of tests, the practice pays for itself permanently.
