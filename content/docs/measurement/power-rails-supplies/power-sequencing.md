---
title: "Are Rails Sequencing Correctly?"
weight: 50
---

# Are Rails Sequencing Correctly?

Multi-rail systems where power-up order matters. FPGAs, complex SoCs, mixed-signal boards, and anything with enable chains or power-good signals. Wrong sequencing can cause latch-up, excess current draw, or a chip that just won't start.

## Oscilloscope: Multi-Channel Power-Up Capture

**Tool:** Oscilloscope, 2–4 channels, DC-coupled
**Trigger:** Edge trigger on the first rail to rise, or on a power-enable signal

### Procedure

1. Assign one scope channel per rail of interest (e.g., Ch1 = 1.0V core, Ch2 = 1.8V I/O, Ch3 = 3.3V, Ch4 = power-good signal)
2. DC-couple all channels, set vertical scales appropriate to each rail's voltage
3. Set timebase to capture the full startup sequence — typically 10–100 ms/div
4. Trigger on the first event: input power applied, enable signal asserted, or first rail crossing a threshold
5. Use single-shot acquisition to capture one clean startup event
6. Measure: which rail rises first, time between rails, whether power-good asserts after all rails are stable

### What You Learn

- Actual sequence order vs. designed order — does the core supply really come up before I/O?
- Timing gaps between rails — are they within the IC's requirements?
- Whether any rail overshoots or rings during startup
- Whether power-good waits for all rails to stabilize or fires too early
- Whether the circuit is trying to operate during the transition (drawing current before supplies are valid)

### Gotchas

- Single-shot capture is essential — you only get one power-up event per power cycle. Make sure trigger and timebase are set before you apply power
- If you run out of scope channels, prioritize the rails the datasheet calls out in its sequencing requirements
- Some sequencing problems are timing-sensitive: the circuit may work on a warm start but fail on a cold start (different regulator startup times at different temperatures)
- Enable signal timing is part of the sequence. If you're only watching voltages and not enables, you may miss the root cause

## Logic Analyzer / MSO: Power-Good and Enable Signals

**Tool:** Mixed-signal oscilloscope (MSO) or logic analyzer alongside analog channels
**Use case:** When sequencing involves digital enable/power-good signals alongside analog rail voltages

### Procedure

1. Analog channels on the critical rail voltages
2. Digital channels on enable pins, power-good outputs, reset signals
3. Trigger on power application or a master enable
4. Correlate: when does each enable assert relative to its supply voltage? When does power-good go high?

### What You Learn

- Whether enable timing matches the design intent
- Whether a chip is being held in reset long enough for supplies to stabilize
- Race conditions between enables and rail voltages

### Gotchas

- Digital threshold on the MSO inputs needs to be set appropriately — a 1.0V rail's power-good signal may not trip a 1.65V default logic threshold
- Long capture at low sample rate may miss fast glitches on enable lines. Balance capture length vs. sample rate
