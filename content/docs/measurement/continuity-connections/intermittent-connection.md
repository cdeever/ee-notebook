---
title: "Is This Connection Intermittent?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is This Connection Intermittent?

The worst kind of fault: works on the bench, fails in the field. Cracked solder joints, fractured traces, loose connectors, cold joints that make contact until thermal expansion breaks them. These faults don't show up on a static continuity check — the connection must be stressed while measuring.

## Continuity Under Mechanical Stress

Connect DMM in continuity or resistance mode across the suspect joint, then mechanically stress the connection while monitoring:

- **Flex the board** gently near the suspect joint — cracked joints and fractured traces open under flex
- **Tap the board** near the connection with a plastic tool — vibration-sensitive joints break momentarily
- **Wiggle the component** — grasp the body and rock gently; a cracked joint shifts under movement
- **Press on the joint** — cold joints may make contact under pressure and open when released

Listen for the beep to cut out or watch for resistance to jump.

## Thermal Cycling

For faults that appear only when warm or cold:

1. Connect DMM across the suspect connection
2. Heat the area with a heat gun (low setting, keep moving) or soldering iron held near but not touching
3. Monitor resistance — watch for it to increase or go open as the joint expands
4. Alternatively, cool with freeze spray and watch for the same
5. Cycle between hot and cold — thermal faults often appear during transitions, not at steady-state

## Oscilloscope Glitch Capture

When the fault is too brief for a DMM:

1. Connect a scope channel across a signal that should be continuous (power rail, logic level, clock)
2. Set trigger to catch the dropout — falling edge below expected voltage, or pulse-width trigger for narrow glitches
3. Use single-shot or persistence mode
4. Mechanically stress the connection while watching for a trigger

This reveals dropout duration (microseconds vs milliseconds), the nature of the failure (clean drop to zero vs noisy marginal contact), and correlation with stress.

## Board-Level Techniques

**Reflow test:** If a specific area is suspected but the exact joint is unknown, reflow all joints in that area. If the fault disappears, it was a solder joint there. This is repair-as-diagnosis — it fixes the fault but doesn't identify exactly which joint.

**Connector stress test:** Monitor continuity while inserting and removing the connector repeatedly. With connector mated, pull gently on the cable in different directions and wiggle the connector body. The fault often appears during one specific motion — this indicates whether it's a pin contact issue, crimp failure, or strain relief problem.

## Tips

- Use min/max recording mode if available — captures brief excursions that are too fast to hear as a beep interruption
- Try different board orientations — some joints work horizontal but fail vertical (gravity pulling on component)
- Document conditions where the fault appeared (temperature, orientation, time since power-on, vibration) and replicate on the bench
- Cleaning with IPA can fix faults caused by contamination (flux residue, moisture) without any rework

## Caveats

- Be gentle — excessive force can crack good joints, lift pads, or break traces
- Heat guns can damage components — keep temperature low and exposure brief
- Freeze spray causes condensation — use on unpowered boards or allow to dry before energizing
- Thermal faults sometimes involve the component itself (internal bond wire, die attach) rather than the solder joint
- Setting scope trigger correctly is critical — too sensitive triggers on noise, too loose misses the fault
- "I reflowed everything and it works now" is valid repair but without identifying the exact joint, the fault may return

## In Practice

- Beep that cuts out when flexing a specific board area localizes the fault to that region
- Resistance that jumps when tapping near a component indicates that joint or nearby trace is marginal
- Fault that appears only when board is warm but not when cold suggests coefficient of thermal expansion mismatch opening a joint
- Fault that appears during thermal transition but not at steady-state temperature indicates the expansion/contraction movement is the trigger
- Scope capture showing clean drop to zero indicates full open; noisy/bouncing signal indicates marginal contact or arcing
- Connector that fails during one specific motion (pull direction, wiggle angle) narrows down whether it's pin, crimp, or strain relief
- **A connector-related failure that's triggered by touching or moving a cable** is frequently showing a degraded connection — corrosion, cracked solder, or loose retention — that the bench environment (short, stress-free cables) didn't expose but the field environment (long cables, vibration, thermal cycling) created.
