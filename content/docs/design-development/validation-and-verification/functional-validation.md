---
title: "Functional Validation"
weight: 10
---

# Functional Validation

A circuit that powers up and doesn't smoke is not a circuit that works. Functional validation is the process of systematically confirming that the system does what it was designed to do — that every requirement has a corresponding test, and that every test produces a clear, recorded result. Without this discipline, "it seems to work" is the best you can say, and that's not enough when the design moves forward.

## Test Against Requirements

Every requirement in the design should map to at least one test. This is the core of functional validation: if you can't test a requirement, you can't confirm it's met — and you should question whether the requirement was well-defined in the first place.

Start with the requirements list (see [Problem Definition vs Solution Bias]({{< relref "/docs/design-development/ideation-and-requirements/problem-definition-vs-solution-bias" >}}) for how that list should be developed). For each item, write a test that would confirm the requirement is satisfied. Some requirements map neatly to single measurements — "output voltage shall be 3.3V +/- 3%" is a voltage measurement with clear pass/fail boundaries. Others are harder: "the system shall be responsive" needs a concrete definition (latency under what threshold, under what conditions?) before it can be tested at all.

The process of writing tests often exposes requirements that are vague, contradictory, or missing. That's not a failure of the testing process — it's one of its most valuable outputs. A requirement that can't be tested is a requirement that hasn't been adequately defined.

## Requirements Traceability

Traceability is the mapping between requirements and the tests that verify them. In its simplest form, this is a table with three columns: requirement, test method, and result. For a small personal project, a markdown table is more than sufficient. For larger efforts, spreadsheets or dedicated requirements management tools earn their keep.

The value of traceability is that it makes gaps visible. If a requirement has no corresponding test, you can see it immediately. If a test doesn't trace back to any requirement, it might be wasted effort — or it might reveal an implicit requirement that was never written down.

Traceability also matters at the other end of the process: when a test fails, the trace tells you exactly which requirement is at risk and what the impact of the failure might be.

## Pass/Fail Criteria

The best tests have quantitative, unambiguous pass/fail criteria defined before the test is run. "Output voltage within 3.3V +/- 5%" is a clear criterion. "System works properly" is not.

For analog parameters, specify the acceptable range: voltage within tolerance, current below a limit, temperature rise under a threshold. For timing parameters, specify maximum or minimum values: startup time under 500 ms, interrupt latency below 10 microseconds. For digital functions, specify expected behavior: pressing button A produces output B within 100 ms.

Where possible, express criteria numerically. "LED is bright enough" becomes "LED luminous intensity greater than 200 mcd at 20 mA." The act of converting subjective assessments into measurable quantities is itself a design activity — it forces clarity about what "good enough" actually means.

## Integration Testing

Individual subsystems can each work perfectly in isolation and still fail when combined. Integration testing verifies that subsystems work together: the power supply delivers clean voltage to the analog front end, the ADC correctly digitizes the signal, the MCU processes the data, and the communication interface transmits it.

Integration testing should be incremental. Don't power on the entire system and hope for the best. Start with the power supply, verify it's clean, then bring up the next subsystem. At each step, confirm that the previously working subsystems are still behaving correctly. This layered approach makes failures much easier to diagnose — if something breaks when you add subsystem C, the problem is likely in subsystem C or its interaction with A and B, not somewhere random.

The interfaces between subsystems are where most integration failures occur. Signal levels, timing, impedance mismatches, grounding paths — these are the places to focus attention.

## User-Scenario Testing

Bench testing validates electrical behavior. User-scenario testing validates that the device actually works in the context it was designed for. These are different, and both matter.

A temperature monitor that reads correctly on the bench might fail in the greenhouse because humidity affects the sensor, or because the display is unreadable in direct sunlight, or because the enclosure blocks airflow and causes self-heating. None of these failures would appear in electrical testing — they only show up when the device is used as intended.

User-scenario testing means putting the device in its real (or simulated) environment and exercising it through its real use cases. Power it from the actual supply it will use, not the bench supply. Connect it to the actual load, not a test resistor. Let it run for hours, not seconds. The goal is to find the failures that only appear in context.

## The Demo Trap

There's a dangerous pattern where a system works perfectly during a controlled demonstration but fails in real use. The demo environment is optimized — stable power, room temperature, short cable runs, no interference, a rehearsed sequence of operations. Reality is none of these things.

The demo trap catches projects that were tested only under ideal conditions. Avoiding it requires deliberately testing under non-ideal conditions: at temperature extremes, with marginal power, with long cables, with electrical noise, with unexpected sequences of user inputs. If the system only works when everything is perfect, it doesn't really work.

## Documenting Test Results

A test result that isn't recorded is a test that will be repeated. Every test should produce a documented outcome that includes: what was tested, how it was tested, what equipment was used, what the measured value was, and whether it passed or failed.

"PASS" alone is nearly useless. "3.301V, within specification of 3.3V +/- 5%" is useful. The measured value matters because it tells you how much margin you have — a result that barely passes is a warning, even if it's technically within specification.

Record conditional results honestly. If a test passed at room temperature but you haven't tested at temperature extremes, the result is "PASS at 25C, untested at extremes" — not just "PASS." Incomplete information is fine; misleading information is not.

## Gotchas

- **Requirements without tests are wishes.** If you can't define a test for a requirement, the requirement isn't concrete enough. Refine the requirement until it's testable, or accept that it's aspirational rather than verifiable.
- **The demo trap is insidious.** It feels like success because the system works — but it works in a carefully controlled environment that doesn't represent reality. Always ask "what conditions are we not testing?"
- **Integration failures hide in interfaces.** The power supply works. The ADC works. But the switching noise from the power supply corrupts the ADC reading. Integration testing exists to find these interactions.
- **Subjective criteria invite debate.** "Fast enough" and "clean enough" mean different things to different people. Convert subjective criteria to numbers before testing, not after.
- **Test coverage is never complete.** You can't test every possible combination of conditions. Focus on the most likely failure modes and the highest-consequence failures. Accept that some risks remain untested and document what you didn't cover.
- **User-scenario testing feels inefficient.** It's slower and less controlled than bench testing. But it finds an entirely different class of failures — the kind that matter most to whoever will actually use the device.
