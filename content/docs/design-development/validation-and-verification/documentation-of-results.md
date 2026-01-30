---
title: "Documentation of Test Results"
weight: 50
---

# Documentation of Test Results

A measurement taken and not recorded is a measurement wasted. You'll remember the general outcome for a few days, maybe a week. After that, the specifics are gone — the exact voltage, the conditions, whether the scope showed that ringing on the rising edge, which firmware version was loaded. Test documentation is not bureaucracy; it's the mechanism by which test results remain useful beyond the moment they were taken.

## Test Reports

A test report answers five questions: what was tested, how it was tested, with what equipment, what were the results, and does it pass. These don't need to be formal documents — a structured markdown file or a filled-in template works. The structure matters more than the format.

For each test, capture:

- **Test name and ID.** Something traceable back to the requirement it verifies.
- **Device under test.** Board revision, serial number, firmware version.
- **Test equipment.** Instrument model and serial number, probe type, cables.
- **Test procedure.** Step-by-step description of what was done, or a reference to a standardized procedure document.
- **Test conditions.** Ambient temperature, supply voltage, load conditions — anything that affects the result.
- **Results.** The measured values, not just pass/fail.
- **Pass/fail determination.** The criterion used and whether the measured value meets it.
- **Date and tester.** Who ran the test and when.

This feels like a lot of overhead for a personal project, and it is — initially. But the overhead drops quickly once you have a template, and the payoff comes the first time you need to compare results across revisions or debug a problem that didn't exist last month.

## Pass/Fail with Measured Values

"PASS" tells you almost nothing. "3.301V (spec: 3.3V +/- 5%, limits 3.135V to 3.465V)" tells you the result, the specification, and the margin. The difference matters enormously.

A result that passes with wide margin is reassuring — the design is robust for this parameter. A result that barely passes is a warning sign even though it's technically within specification. A result at 3.14V against a lower limit of 3.135V is a design that's one component tolerance shift away from failure. You want to know this, and the only way to know it is to record the actual measured value alongside the pass/fail determination.

For analog measurements, record the measurement with appropriate precision. "3.3V" might mean anything from 3.25V to 3.35V depending on the resolution of your instrument. "3.301V measured with Keysight 34465A on 10V range" is unambiguous. You don't need to belabor the point — just enough precision to be meaningful.

For digital functional tests, record any anomalies even if the test passed. "UART communication passed at 115200 baud; occasional framing errors observed at 230400 baud" is more useful than "PASS" because it documents a boundary that might become relevant later.

## Photos and Screenshots

Some test results are best captured visually. Oscilloscope waveforms, spectrum analyzer plots, thermal camera images, and even photographs of physical setup or rework are invaluable documentation that text alone can't replace.

For oscilloscope captures, include the timebase, voltage scale, triggering conditions, and probe compensation status. A waveform screenshot without scale information is nearly useless for comparison. Most modern scopes can save screenshots to USB — use this feature liberally. Name the files descriptively: "rev_B_3v3_ripple_100mA_load.png" is better than "scope_001.png."

Thermal images are especially useful for power electronics and densely packed boards. A thermal capture during normal operation establishes a baseline; a capture during margin testing shows where heat concentration changes under stress. Label the emissivity setting and ambient temperature — thermal cameras are only accurate when these are set correctly.

Photographs of the physical test setup document how the device was connected, probed, and loaded. This matters because test results are only reproducible if the setup is reproducible. A photograph captures details that a written description might miss — where the ground clip was attached, how the cables were routed, whether a shielding can was in place.

## Traceability

Traceability links a test result back to everything that contributed to it: the specific unit tested, the specific firmware running on it, the specific test equipment used, and the calibration status of that equipment.

For the device under test, record the board revision and serial number. If the board doesn't have a serial number, assign one — a label maker is cheap. For firmware, record the version number or, better, the git commit hash. For test equipment, record the model and serial number, and note the calibration date if the instrument is calibrated.

Calibration status matters because an out-of-calibration instrument produces measurements of unknown accuracy. A voltmeter that reads 0.5% high doesn't invalidate the test — but if you don't know it reads high, the measurement is misleading. Record the calibration date and decide whether the instrument's accuracy is adequate for the measurement being made.

Traceability also means knowing what changed between test runs. If a test passed last week and fails today, the first question is "what changed?" Without traceability, the answer is "I don't know," which means you're debugging blind.

## Templates

Standardized test report templates save time and enforce consistency. A template ensures that you capture all the necessary information — it's easy to forget the firmware version or the ambient temperature when you're focused on the measurement itself.

A good template has fields for all the items listed above (test ID, DUT info, equipment, conditions, results, pass/fail) plus space for notes and observations. It should be quick to fill in — if the template takes longer to complete than the test takes to run, the template is too complex.

Start simple. A markdown file with headings for each field works. If you find yourself running the same tests repeatedly across revisions, a spreadsheet with one row per test and columns for each revision's results makes comparison easy. The format doesn't matter nearly as much as the habit of using it consistently.

## Storage and Retrieval

Test documentation that can't be found is functionally identical to test documentation that doesn't exist. Organize test results in a way that makes retrieval straightforward.

A simple directory structure works well: organize by project, then by board revision, then by test date. Within each test session, store the report, screenshots, data files, and any notes together. Use consistent naming conventions so that files can be found without opening every directory.

Version control (git) is excellent for text-based test reports and works tolerably for images. For large binary files (thermal camera exports, long oscilloscope captures), a separate storage location with clear references from the test report is more practical.

The audience for test documentation extends beyond the person who ran the tests. Future you will reference these results months later and will have forgotten the context. A colleague might need to reproduce or extend the testing. A customer or regulatory body might need to review the evidence. Write for an audience that doesn't have your current context — because in six months, that audience includes you.

## The Audience

Test documentation serves multiple audiences, and understanding this shapes what you record:

- **Future you.** The most common audience. You'll revisit these results during debugging, during the next revision, or when a customer reports a problem. Record enough context that future-you can reconstruct what happened without present-you's memory.
- **Collaborators.** If anyone else works on the project, they need to understand the test results without asking you to interpret them. Clear structure, explicit units, and unambiguous pass/fail criteria make this possible.
- **Customers.** For commercial products, test results are evidence that the product meets its specifications. The documentation needs to be presentable, traceable, and defensible.
- **Regulatory bodies.** For products subject to safety or EMC regulations, test documentation is a compliance artifact. It must meet specific format and content requirements defined by the relevant standards.

Even for personal learning projects, writing for an audience beyond yourself enforces clarity. If you can explain the test and its results to someone who wasn't there, you understand it. If you can't, the documentation needs more detail — and so might your understanding.

## Gotchas

- **"PASS" without a number is meaningless.** Record the actual measured value. Margin information is hidden inside the measurement, and you'll need it later.
- **Unnamed screenshots are useless.** "scope_014.png" tells you nothing six months later. Name files descriptively and include scale information either in the filename or in the accompanying report.
- **Missing configuration kills reproducibility.** If you don't record the firmware version, board revision, and test conditions, you can't reproduce the result — and you can't tell whether a later difference is real or just a setup variation.
- **Templates save you from yourself.** Without a template, you'll forget to record something important. It happens every time, because your attention is on the measurement, not the documentation.
- **Storage without structure is hoarding.** A folder full of unsorted test files is almost as bad as no files at all. Invest a few minutes in organizing results when you create them, not weeks later when you need to find something.
- **Write for future-you, who has amnesia.** Six months from now, you won't remember the context, the subtleties, or the reasoning. Write it down now, while you still know it.
