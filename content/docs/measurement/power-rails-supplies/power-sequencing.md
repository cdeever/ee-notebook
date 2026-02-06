---
title: "Are Rails Sequencing Correctly?"
weight: 50
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Are Rails Sequencing Correctly?

Multi-rail systems where power-up order matters. FPGAs, complex SoCs, mixed-signal boards, and anything with enable chains or power-good signals. Wrong sequencing can cause latch-up, excess current draw, or a chip that won't start.

## Multi-Channel Power-Up Capture

Assign one scope channel per rail of interest (e.g., Ch1 = 1.0V core, Ch2 = 1.8V I/O, Ch3 = 3.3V, Ch4 = power-good signal). DC-couple all channels with vertical scales appropriate to each rail's voltage.

Set timebase to capture the full startup sequence — typically 10–100 ms/div. Trigger on the first event: input power applied, enable signal asserted, or first rail crossing a threshold. Use single-shot acquisition for one clean startup capture.

Measure which rail rises first, time between rails, and whether power-good asserts after all rails are stable.

## Logic Analyzer / MSO for Digital Signals

When sequencing involves digital enable/power-good signals alongside analog voltages:

- Analog channels on critical rail voltages
- Digital channels on enable pins, power-good outputs, reset signals
- Trigger on power application or master enable
- Correlate: when does each enable assert relative to its supply? When does power-good go high?

This reveals whether enable timing matches design intent, whether reset is held long enough for supplies to stabilize, and race conditions between enables and voltages.

## Tips

- Use single-shot capture — there's only one power-up event per power cycle, so trigger and timebase must be set before applying power
- If short on scope channels, prioritize rails the datasheet calls out in sequencing requirements
- Capture enable signals alongside voltages — if only voltages are watched, the root cause may be missed

## Caveats

- Some sequencing problems are timing-sensitive — circuit may work on warm start but fail on cold start (different regulator startup times at different temperatures)
- Enable signal timing is part of the sequence — watching only voltages may miss the root cause
- Digital threshold on MSO inputs must be set appropriately — a 1.0V rail's power-good may not trip a 1.65V default logic threshold
- Long capture at low sample rate may miss fast glitches on enable lines — balance capture length vs sample rate

## In Practice

- Rail that rises before it should (ahead of sequence) can cause latch-up in ICs that require a different rail first
- Power-good that asserts before all rails are stable can allow the processor to start executing before supplies are valid
- Reset that releases too early (before supplies stable) can cause unpredictable startup behavior
- One rail that's slow to rise compared to others indicates that regulator may have different soft-start timing or is current-limited
- Sequence that works at room temperature but fails when cold suggests temperature-dependent startup timing — test at temperature extremes
- Rail that overshoots or rings during startup may violate IC absolute maximum ratings even if it settles correctly
- **A circuit that fails in production but works on the bench** is frequently showing a downward propagation path that exists in the production environment but not in the bench environment — different power sequencing, different transient conditions during hot-insertion, or different thermal profiles during reflow soldering that stress components beyond their process ratings.
- **A subsystem that starts up correctly on some power-on cycles but not others** has a sequencing or startup timing issue — the blocks may all be functional, but they're initializing in the wrong order or with insufficient settling time.
- **A device that fails intermittently on power-up but works once running** has a startup sequencing or reset timing problem. Monitoring the power rails, reset lines, and enable signals with a scope during power-up — capturing the first 100 ms — usually reveals which subsystem is losing the race.
- **A device that starts correctly on some power-up cycles but not others** often shows up when the power sequencing has marginal timing — the delay between supplies is close to the minimum required by the IC, and variation in the supply ramp rate or regulator enable timing pushes some cycles across the boundary between correct and incorrect sequencing.
- **An intermittent startup failure that depends on how fast the power switch is toggled** is a control-timing interface interaction — the power sequencing and the reset/enable timing are racing, and the outcome depends on the power ramp rate.
- **Intermittent startup failure in an IC-based subsystem** is frequently caused by external component values that place the soft-start or enable timing at the edge of the IC's internal timing requirements — a slower input voltage ramp, a different decoupling capacitor value, or a different enable resistor can shift the timing enough to cross the boundary between reliable and unreliable initialization.
