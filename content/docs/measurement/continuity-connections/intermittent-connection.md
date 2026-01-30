---
title: "Is This Connection Intermittent?"
weight: 40
---

# Is This Connection Intermittent?

The worst kind of fault: it works on the bench, fails in the field. Cracked solder joints, fractured traces, loose connectors, cold joints that make contact until thermal expansion breaks them open. These faults don't show up on a static continuity check — you have to stress the connection while measuring.

## DMM: Continuity Under Mechanical Stress

**Tool:** DMM, continuity mode (beeper) or Ohm mode
**When:** Suspecting a cracked solder joint, fractured trace, or loose connector

### Procedure

1. Set DMM to continuity mode (beep) and connect across the suspect joint or connection
2. While monitoring, mechanically stress the connection:
   - **Flex the board** gently near the suspect joint — cracked joints and fractured traces open under flex
   - **Tap the board** near the connection with a plastic tool (spudger, pen cap) — vibration-sensitive joints break momentarily
   - **Wiggle the component** — grasp the component body and rock it gently. A cracked joint shifts under component movement
   - **Press on the joint** — a cold solder joint may make contact under pressure and open when released (or vice versa)
3. Listen for the beep to cut out (open) or for the resistance reading to jump

### What You Learn

- Whether the connection is solid or marginal
- Which specific joint or connection is the intermittent one — the fault appears when you stress the right spot

### Gotchas

- Be gentle. The goal is to find the fault, not create new ones. Excessive force can crack good joints, lift pads, or break traces
- Intermittent faults can be position-sensitive — the joint works when the board is horizontal but fails when vertical (gravity pulling on the component). Try different orientations
- Some meters have a "min/max" recording mode that captures brief excursions. This is useful if the fault is too fast to hear as a beep interruption

## Thermal Cycling: Temperature-Sensitive Faults

**Tool:** DMM (continuity or Ohm mode) + heat source and cold source
**When:** Suspecting a fault that appears only when the board is warm or cold

### Procedure

1. Connect DMM across the suspect connection
2. Heat the area with a heat gun (low setting, keep moving) or a soldering iron held near but not touching the joint
3. Monitor the resistance — watch for it to increase or go open as the joint expands
4. Alternatively, cool the area with freeze spray (component cooler) and watch for the same
5. Cycle between hot and cold — intermittent thermal faults often appear during the transition, not at steady-state temperature

### What You Learn

- Whether the connection fails at elevated or reduced temperature
- Which specific joint is temperature-sensitive — localize by heating/cooling specific areas

### Gotchas

- Heat guns can damage components. Keep the temperature low and exposure brief. You're looking for normal operating temperature range, not reflow temperatures
- Freeze spray can cause condensation. On energized boards, moisture can create its own shorts. Use on unpowered boards or in well-ventilated conditions
- Thermal faults sometimes involve the component itself (internal bond wire, die attach) rather than the solder joint. If the joint looks perfect and tests fine, the part itself may be intermittent

## Oscilloscope: Catching Glitches

**Tool:** Oscilloscope, single-shot or persistence mode
**When:** The fault is too brief for a DMM to catch, or you need to characterize the dropout

### Procedure

1. Connect a scope channel across a signal that should be continuous — a power rail, a logic level, a clock signal
2. Set the trigger to catch the dropout:
   - For a power rail: trigger on falling edge below the expected voltage
   - For a logic signal: trigger on an unexpected transition or use pulse-width trigger to catch narrow glitches
3. Set timebase to capture the event with useful detail — start at 1 ms/div and adjust
4. Use single-shot mode to capture the first event, or persistence mode to overlay many events and see intermittent behavior
5. Mechanically stress the connection while watching for a trigger

### What You Learn

- The duration of the dropout — is it microseconds (might cause a logic glitch but not a full failure) or milliseconds (definitely causes a reset or malfunction)?
- The nature of the failure — does the signal drop cleanly to zero (full open) or become noisy (marginal contact, arcing)?
- Whether the fault correlates with your mechanical stress

### Gotchas

- Setting the trigger level correctly is critical. Too sensitive and you trigger on noise; too loose and you miss the fault
- Long capture times need deep memory or segmented acquisition. A fault that happens once per minute at an unknown time requires patience and a scope that can record long windows
- If you're monitoring a power rail, the circuit may brown-out or reset during the dropout, which changes the current draw and can mask or alter the fault signature

## Board-Level Techniques

### Reflow Test

If you suspect a specific area has cold joints but can't pinpoint which one:

1. Document the fault behavior (what fails, when, under what stress)
2. Reflow (reheat with soldering iron or hot air) all joints in the suspect area
3. Retest — if the fault is gone, it was a solder joint in that area
4. This is a repair-as-diagnosis technique: it fixes the fault but doesn't tell you exactly which joint was bad. Acceptable for one-off repair; not ideal for root cause analysis

### Connector Stress Test

For connector-related intermittents:

1. Monitor continuity while inserting and removing the connector repeatedly (mate/unmate cycling)
2. With the connector mated, pull gently on the cable in different directions
3. Wiggle the connector body in the socket
4. The fault often appears during one specific motion — that tells you whether it's a pin contact issue, a crimp failure, or a cable strain relief problem

### Gotchas

- Intermittent faults are the hardest to reproduce on command. Document the conditions where the fault appeared (temperature, orientation, time since power-on, vibration) and try to replicate those conditions on the bench
- "I reflowed everything and it works now" is a valid repair, but without identifying the exact joint, the fault may return if the root cause was thermal cycling stress on a specific footprint
- Some intermittent faults are caused by contamination (flux residue, moisture) rather than mechanical failure. Cleaning the board with IPA and a brush can fix these without any rework
