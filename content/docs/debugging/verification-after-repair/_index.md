---
title: "Verification After Repair"
weight: 60
bookCollapseSection: true
---

# Verification After Repair

Replacing the faulty component is only half the job. The repair isn't done until you've confirmed the circuit works correctly — and that the repair didn't introduce new problems.

This page covers the general verification framework. For device-specific verification plans — full checklists tailored to a particular type of DUT — see the sub-pages below.

## Before Power-Up

Don't just plug it in and hope. Quick checks before applying power can prevent a second failure.

1. **Visual inspection** — Look at the rework area under magnification. Check for solder bridges, cold joints, flux residue, and correct component orientation (especially ICs, diodes, and polarized caps)
2. **Shorts check** — Measure resistance across the power rail(s) near the repair area. Compare to what you expect — a dead short means something is still wrong. If you didn't measure before the repair, now you know to do it next time
3. **Continuity check** — Verify the new component's connections are solid. Probe from the component pad to a downstream point on the same net

See [Is voltage present?]({{< relref "/docs/measurement/power-rails-supplies/voltage-present" >}}) and [Joint & Contact Integrity]({{< relref "/docs/measurement/continuity-connections/joint-contact" >}})

## Current-Limited First Power-Up

If you have a current-limited bench supply, use it for the first power-up after repair.

1. Set the voltage to the correct supply voltage
2. Set the current limit to slightly above the expected normal draw (if known) or start low (50–100 mA for small circuits) and increase
3. Power on and watch the current reading
4. If current spikes to the limit immediately, power off — something is still shorted or drawing excessive current
5. If current is normal, proceed to functional testing

This simple step prevents a cascade failure where a botched repair destroys additional components on the first power-up.

See [Is current draw expected?]({{< relref "/docs/measurement/power-rails-supplies/current-draw" >}})

## Functional Test: Confirm the Original Fault is Fixed

Test the specific symptom that started the debug session.

- If the board was dead → does it power up and run?
- If a signal was wrong → is it correct now?
- If it was intermittent → does the intermittent condition still trigger it? (This may require extended testing or environmental simulation)

Don't just check "does it turn on" — verify that the original fault condition is resolved. If the symptom was "resets under load," test it under load.

## Regression: Did the Repair Break Anything Else?

A repair can introduce new problems, especially if:
- You disturbed adjacent components during rework
- You overheated a nearby part
- You changed the board's thermal characteristics (different component, added thermal mass)
- The original fault was caused by something that could damage multiple components

**What to check:**
- All functions, not just the one you were fixing
- Adjacent circuits on the board
- Different operating modes (if applicable)
- If the board has multiple channels, check them all

## Stress Testing

Normal operation on the bench is the minimum bar. For a repair you want to trust, stress the board.

| Stress type | What it catches |
|-------------|----------------|
| **Thermal soak** — Let the board run in a warm environment (or with reduced airflow) for extended time | Marginal solder joints, components that fail when hot, thermal shutdown issues |
| **Load test** — Run at maximum rated load | Inadequate repair of power path, components that fail under current stress |
| **Vibration / flex** — Gently flex the board, tap near the repair area | Mechanical solder joint issues, lifted pads that aren't caught at rest |
| **Power cycling** — Repeatedly power on and off | Transient issues, inrush problems, timing-sensitive startup faults |

Not every repair needs every stress test. Match the stress to the failure mode — if the original fault was thermal, thermal soak is essential. If it was mechanical, the flex/vibration test matters most.

## Confidence Levels

Not all "working" is equal. Be honest about what you've verified:

### "Boots"

The circuit powers up and shows signs of life. This is the lowest bar — it means power is probably okay and the processor (if any) is running, but you haven't verified much else.

### "Stable"

The circuit passes functional tests under normal conditions. The original fault is gone, and basic operation is confirmed. Most bench repairs reach this level.

### "Reliable"

The circuit passes functional tests under stress conditions (temperature, load, vibration, extended run time). You've tested enough to trust it in its actual operating environment. This level requires deliberate stress testing — you can't reach it by running the board on your bench for five minutes.

**Be explicit about which level you've reached** when you declare a repair "done." If you've only reached "boots," say so — don't assume stability.

## DUT-Specific Verification Plans

The general framework above applies to everything. The pages below are full verification checklists for specific device types — what to measure, in what order, and what the pass criteria are.

- **[Car Audio Amplifier]({{< relref "car-audio-amp" >}})** — Full verification plan for high-power 12 V automotive amplifiers

## Cross-References

- Power verification: [Is voltage present?]({{< relref "/docs/measurement/power-rails-supplies/voltage-present" >}})
- Current draw: [Is current draw expected?]({{< relref "/docs/measurement/power-rails-supplies/current-draw" >}})
- Intermittent connection testing: [Intermittent Connection]({{< relref "/docs/measurement/continuity-connections/intermittent-connection" >}})
