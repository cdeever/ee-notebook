---
title: "Failure Triage & First Response"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Failure Triage & First Response

Before reaching for a meter or scope, stop and look. The first few seconds of observation often reveal more than the first ten minutes of measurement — if attention is paid.

## Five Senses Check

Always the first step. Do this before powering anything on (or immediately after a failure, while things are still warm).

| Sense | What to look for |
|-------|-----------------|
| **Look** | Charred components, bulging capacitors, cracked packages, discolored PCB, solder bridges, missing parts, bent pins, loose wires |
| **Smell** | Burnt electronics (unmistakable), hot plastic, ozone (arcing), chemical smell from leaking electrolytic |
| **Listen** | Clicking relays, buzzing transformers, high-pitched whine from oscillation, silence where fan noise is expected |
| **Touch** | Hot components (power off first!), loose connectors, cracked solder joints detectable by feel, board flex |
| **Context** | What changed? New firmware? New power supply? Was it dropped? Different environment? |

If something looks burnt or smells burnt, don't power it up again until the cause is understood. A visual fault is a gift — it tells exactly where to start.

## Categorize the Failure

This is the most important triage decision. These three categories lead to fundamentally different diagnostic approaches:

### Never Worked

The circuit has never functioned correctly — first power-up of a new build, or a board fresh from assembly.

- Suspect **assembly errors first**: wrong part, rotated IC, solder bridges, missing connections
- Check power rails before anything else — if the supply is wrong, nothing downstream matters
- Verify the BOM against the schematic, especially polarized components
- New designs have design errors too — don't assume the schematic is correct just because it's printed

### Stopped Working

It worked before, and now it doesn't. Something changed.

- **What changed?** Environment, firmware, power source, connected equipment, age
- If nothing obviously changed, suspect **component failure** — especially electrolytics, connectors, and anything that runs hot
- Intermittent failures that got worse over time suggest thermal or mechanical degradation
- A sudden hard failure suggests a component died — look for the weakest link in the power path

### Works Sometimes (Intermittent)

The hardest category. The circuit sometimes works and sometimes doesn't.

- **Characterize the intermittent**: temperature-dependent? Position-dependent? Time-dependent? Load-dependent?
- Temperature: use a heat gun or freeze spray to provoke the fault
- Position: flex the board, wiggle connectors, tap components
- Time: does it fail after warm-up? After hours? After days?
- Load: does it fail only under full load or at specific operating points?
- Intermittent faults are almost always **thermal, mechanical, or marginal** — a part operating right at its limit

## Choosing Your First Measurement

Resist the urge to measure the symptom directly. Instead, work from power toward the symptom:

1. **Power first** — Is the supply voltage present and correct? See [Is voltage present?]({{< relref "/docs/measurement/power-rails-supplies/voltage-present" >}}) and [Is voltage correct under load?]({{< relref "/docs/measurement/power-rails-supplies/voltage-correct-under-load" >}})
2. **Clocks second** (digital/embedded) — Is the oscillator running? Is the clock getting to the IC?
3. **Signals third** — Now trace the signal path from input toward output, looking for where the signal stops or goes wrong

This order exists because power faults masquerade as everything else. A brownout on a 3.3 V rail can look like a firmware bug, a logic error, or a communication failure. Chasing the symptom first can waste hours before revealing the rail is at 2.8 V.

## Hardware vs. Firmware Boundary

For embedded systems, determining whether the fault is hardware or firmware is critical early in triage.

**Signs pointing to hardware:**
- Failure persists across known-good firmware versions
- Power rails are wrong, missing, or noisy
- The processor isn't running at all (no clock, no activity on debug port)
- Symptoms change with temperature or mechanical stress

**Signs pointing to firmware:**
- Hardware checks pass (power, clocks, I/O levels all correct)
- The same board works with a different firmware version
- Symptoms are perfectly repeatable and state-dependent
- Debug output shows the code reaching unexpected states

**The boundary cases** — hardware marginal enough that firmware sometimes trips over it — are the hardest. A noisy power rail that causes occasional flash corruption looks like a firmware bug until the rail is scoped.

## Safety Note

Before probing anything, especially unfamiliar equipment or high-power circuits, check that it's safe to probe. See [Can I Probe Safely?]({{< relref "/docs/measurement/safety-high-energy/can-i-probe-safely" >}})
