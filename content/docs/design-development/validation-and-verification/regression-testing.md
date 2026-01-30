---
title: "Regression Testing Across Revisions"
weight: 40
---

# Regression Testing Across Revisions

Every change to a design — every component swap, every firmware update, every layout revision — is an opportunity to break something that previously worked. Regression testing is the discipline of re-running established tests after every change to confirm that nothing has regressed. It sounds tedious because it is tedious. It's also one of the most reliable ways to prevent the slow accumulation of bugs that turns a working design into an unreliable one.

## The Regression Test Suite

A regression test suite is the set of tests that must pass after any change. It's not every test you've ever run — it's a curated subset that covers the critical functionality, safety requirements, and performance benchmarks. The suite should be comprehensive enough to catch regressions, but lean enough to run regularly.

Building the suite is an ongoing process. Start with the functional validation tests from the [Functional Validation]({{< relref "/docs/design-development/validation-and-verification/functional-validation" >}}) page — each requirement should have a corresponding test. Then add tests that were created in response to specific bugs: if a firmware change once caused the ADC to misread, the test that caught (or would have caught) that failure belongs in the regression suite permanently.

The suite grows over time as new failure modes are discovered. This growth is natural and healthy — each regression test represents a lesson learned. The danger is not that the suite grows, but that it grows without pruning.

## Automated vs Manual Regression

For firmware-heavy designs, automated regression testing is transformative. A test harness that exercises the firmware, checks outputs, and reports pass/fail can run in minutes with no human intervention. This means you can run the full suite after every commit, catching regressions within hours instead of weeks.

Automated testing requires investment: test fixtures, scripts, and a reliable way to stimulate inputs and capture outputs. For a microcontroller project, this might be a second MCU that acts as a test controller, exercising GPIOs, sending serial commands, and verifying responses. For analog designs, automated testing is harder — it requires programmable sources and measurement instruments, which pushes the complexity and cost up significantly.

Manual regression testing is slower and more error-prone but requires no infrastructure. For projects where the change rate is low and the test suite is small, manual testing is perfectly adequate. The key is to actually run the tests — a manual suite that nobody runs because it takes too long is worse than useless because it creates false confidence.

The practical approach for most learning and prototype projects is a mix: automate the tests that are easy to automate (typically firmware functional tests), and maintain a manual checklist for hardware and analog tests that require bench measurement.

## What to Include

Not every test belongs in the regression suite. Include tests that cover:

- **Critical functional requirements.** The core functions that define whether the device works at all. If the temperature sensor doesn't read, nothing else matters.
- **Safety-related functions.** Overvoltage protection, overcurrent shutdown, thermal cutoff — anything that prevents damage to the device or its environment. These must be tested on every revision because the consequences of regression are severe.
- **Performance benchmarks.** Key performance numbers that might degrade subtly: ADC accuracy, timing precision, power consumption, communication throughput. These tend to regress in ways that are hard to notice without measurement.
- **Previously found bugs.** Every bug that was found and fixed should generate a regression test. If a bug happened once, conditions exist for it to happen again — especially if a future change modifies the same area of the design.

Exclude tests that are environment-specific (full temperature sweep), destructive (ESD testing), or extremely time-consuming (week-long reliability soak). These are important, but they belong in periodic or milestone test plans, not the regression suite.

## When to Run

The ideal frequency depends on the change rate and the cost of running the suite. Some guidelines:

- **After every firmware change.** Firmware changes are the most common source of regressions, and firmware tests are the easiest to automate. Run the suite on every commit if possible, or at least before every release.
- **After every hardware revision.** A new PCB revision may change parasitic behavior, thermal paths, or component interactions. Run the full regression suite on every new board revision.
- **Before every release.** Before declaring any revision "done" or shipping it to anyone, run the complete regression suite and document the results.
- **After any component substitution.** Swapping a component — even a "drop-in replacement" — can change behavior in subtle ways. Run the regression suite to confirm.

The most important rule is that the suite must actually be run. A regression suite that exists but is skipped "because we're in a hurry" provides no protection. The discipline of running it regularly, even when it feels unnecessary, is what makes it effective.

## The Regression Trap

As a project matures, the regression suite grows. Tests are added for each new feature and each bug fix, and the suite becomes comprehensive. At some point, it also becomes slow — too slow to run casually, which means it's run less often, which means regressions go undetected longer.

This is the regression trap: a suite so thorough that nobody runs it. The solution is to structure the suite in tiers. A fast "smoke test" tier covers the most critical functions and runs in minutes. A full regression tier covers everything and runs in hours. Run the smoke tier constantly and the full tier at milestones.

Pruning also helps. If a test has passed on every run for the last twenty revisions and the area it tests hasn't changed, consider moving it from the fast tier to the full tier. Not removing it — just reducing its frequency. The goal is to keep the fast tier fast enough that running it feels effortless.

## Configuration Management

Regression testing is only meaningful if you know exactly what you're testing. "The board passed all tests" is useless unless you can specify which board revision, which firmware version, which test fixture, and which test script version was used.

Configuration management is the discipline of recording this context. For each test run, document:

- Hardware revision and serial number
- Firmware version (ideally a git commit hash)
- Test script or procedure version
- Test equipment used (instrument serial numbers, calibration dates)
- Environmental conditions (at least ambient temperature)

This level of detail feels excessive on a personal project, but it pays for itself the first time you need to answer "did this board pass with the old firmware or the new firmware?" Without configuration records, that question is unanswerable.

## Golden Units

A golden unit is a known-good reference board that has passed the full test suite and is kept as a baseline for comparison. When a new board revision behaves differently, testing the golden unit distinguishes between "the new board is different" and "the test setup has changed."

Golden units are especially valuable for analog designs where absolute measurements are difficult and relative comparisons are more reliable. If the new board's ADC reads 2% higher than the golden unit under identical conditions, the difference is meaningful. Without the golden unit, you'd need to trust the absolute accuracy of your test setup, which is a higher bar.

Store golden units carefully — labeled, protected from damage, and not used for development. They're reference instruments, not prototypes. If a golden unit needs to be retired (because the design has evolved beyond compatibility), designate a new one from the current revision.

## Gotchas

- **The suite you skip is the one that would have caught the bug.** Schedule pressure is the enemy of regression testing. The cost of skipping a test run is invisible until the regression reaches the field.
- **"It's a small change" is famous last words.** A one-line firmware change can break everything. A single component substitution can change timing, noise, or thermal behavior. The size of the change does not predict the size of the impact.
- **Automated tests can have bugs too.** A test that always passes might have a broken assertion. Periodically verify that your tests can actually detect failures by deliberately injecting a known fault.
- **Configuration drift invalidates results.** If you don't record what you tested, the results are anecdotal, not evidence. Get in the habit of logging configuration before running tests.
- **The regression trap is real.** A test suite that takes four hours to run won't get run daily. Tier your suite: fast smoke tests for constant use, full suite for milestones.
- **Golden units age.** Component parameters drift over time and operating hours. Periodically revalidate the golden unit against known-good references, or replace it with a fresh unit from the current production batch.
