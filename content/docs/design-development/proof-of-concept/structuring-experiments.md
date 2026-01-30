---
title: "Structuring Experiments to Get Answers"
weight: 50
---

# Structuring Experiments to Get Answers

A proof of concept is an experiment, and experiments produce useful results only when they're structured to answer a specific question. Plugging components together and seeing what happens can be fun, but "it seems to work" is not an answer you can design a system around. A little structure turns a POC from tinkering into engineering.

## Define the Question First

Every POC should start with a single, specific question:

- "Can this accelerometer detect vibrations below 10 Hz with at least 10 mg resolution?"
- "Does this buck converter maintain regulation with a 2 A load step?"
- "Can this LoRa link achieve reliable communication at 500 meters through two interior walls?"
- "Does this op-amp topology maintain less than 1% THD at 20 kHz?"

Vague questions produce vague answers. "Does this sensor work?" leads to a breadboard that sort of works under ideal conditions, which tells you nothing about whether it will work in the actual application. Specificity forces you to define what "works" means before you start building.

## Define Success and Failure Criteria

Before applying power, write down what you expect to see and what would constitute a pass or fail:

| Parameter | Pass | Fail | Method |
|-----------|------|------|--------|
| Sensor noise floor | < 5 mg RMS | > 10 mg RMS | Log 1000 samples, compute RMS |
| Regulator ripple | < 50 mV pk-pk | > 100 mV pk-pk | Scope with AC coupling, tip-and-barrel probe |
| Link range | > 500 m at -120 dBm | < 300 m | Walk test with RSSI logging |
| THD | < 1% at 1 kHz | > 2% at 1 kHz | Audio analyzer or FFT |

This table is the experiment design. It tells you what to measure, how to measure it, and what the result means. Write it before building anything.

The pass/fail criteria come from your [requirements]({{< relref "../ideation-and-requirements" >}}). If the requirements say "detect vibration below 10 Hz," the POC must test at frequencies below 10 Hz with a known reference vibration. Testing at 100 Hz and assuming the sensor will also work at 10 Hz is not a valid POC.

## Control the Variables

A meaningful experiment changes one thing at a time and holds everything else constant:

- **Test the sensor, not the power supply.** Use a clean, well-regulated bench supply so that power supply noise doesn't contaminate sensor measurements. If the sensor fails, you want to know it was the sensor, not the power.
- **Test the communication link, not the antenna.** Use the module's stock antenna (or a known reference antenna) for range testing. If you're also evaluating a custom antenna, that's a separate experiment.
- **Test the circuit, not the firmware.** For analog POCs, use the simplest possible firmware (or no firmware at all — a signal generator and a scope). Firmware bugs create confusing results when you're trying to evaluate hardware.

When you must change multiple things simultaneously (because they're coupled), acknowledge it. "This test evaluates the sensor and the ADC together because they share a reference voltage" is honest and useful. "This test evaluates the sensor" when it's actually measuring the sensor + ADC + firmware + power supply together is misleading.

## Capture the Data

The most common POC failure mode isn't a broken circuit — it's lost data. A week later, when the architecture discussion needs to reference the POC results, the breadboard is disassembled, the scope screenshots are lost, and the only record is a vague memory that "it seemed to work."

**Minimum documentation for every POC:**

- **Photo of the setup** — what's connected to what, which dev board, which breakout, how it's wired.
- **Schematic as built** — not the ideal schematic, but what's actually on the breadboard, including any modifications made during testing.
- **Raw data** — scope screenshots, data logs, serial output captures. Raw data can be reanalyzed later; impressions can't.
- **Results summary** — one paragraph stating what was tested, what was measured, and whether it passed. Include the numbers.
- **Surprises and observations** — anything unexpected. The sensor worked but had a 50 ms startup delay. The regulator met the ripple spec but ran hotter than expected. These observations feed into architecture decisions.

A lab notebook (physical or digital) is the traditional tool. A markdown file in the project repository works just as well. The format doesn't matter — the act of recording does.

## Design for Iteration

A well-structured POC makes the next iteration easy:

- **Use sockets for ICs** so you can swap components without desoldering.
- **Use potentiometers** for resistor values you expect to tune (bias points, gain setting resistors, feedback dividers). Replace with fixed resistors once you've found the right value.
- **Break the circuit into testable stages.** Build and verify the power supply before connecting the analog front end. Verify the analog front end before connecting it to the ADC. Stage-by-stage testing isolates problems.
- **Include test points.** Even on a breadboard, leaving accessible points for scope probes on critical signals (power rails, clock lines, signal nodes) makes measurement faster.

## When the Experiment Doesn't Give a Clear Answer

Sometimes the result is ambiguous — the sensor meets the spec at room temperature but you're not sure about temperature extremes, or the link works at 400 meters but the requirement is 500 and you can't easily test further.

Options:

- **Add margin to the test.** If the requirement is 500 meters, test at 600. If it works at 600, you have confidence in the margin. If it fails at 450, the answer is clear.
- **Test the sensitivity.** If the result is marginal, figure out what's limiting performance. Is it noise, signal strength, bandwidth? Understanding the limiting factor tells you whether the design can be improved or whether the component is fundamentally inadequate.
- **Defer the question honestly.** "The POC showed the sensor works at room temperature. Performance at -20°C is unverified and should be tested on the prototype PCB with a temperature chamber." This is a legitimate POC outcome — you answered what you could and clearly stated what remains unknown.

The worst outcome is to declare the POC a success when the data is actually inconclusive, then build a system on that shaky foundation.

## Gotchas

- **Confirmation bias is real.** When you've spent three hours building a breadboard, you want it to work. Be rigorous about the pass/fail criteria you defined before testing, not the criteria you'd like to apply after seeing the results.
- **One successful trial isn't enough.** A LoRa link that works once at 500 meters proves it's *possible*, not *reliable*. Run multiple trials. Compute statistics if the measurement allows it.
- **Environment matters.** A sensor tested on a quiet bench in the lab may fail in the noisy electrical environment of the final application. If the application environment is known, try to approximate it during the POC.
- **Temperature is a variable you can't ignore.** Many components behave differently at temperature extremes. If the application will see -20°C to +60°C, at minimum note that the POC was tested at room temperature only.
- **Don't optimize the POC.** The goal is to answer a question, not to build the best possible breadboard. If you find yourself spending hours tweaking component values on a breadboard to squeeze out another dB of performance, stop — you've answered the question ("it's marginal") and the optimization belongs in the [schematic design]({{< relref "../schematic-design" >}}) phase.
