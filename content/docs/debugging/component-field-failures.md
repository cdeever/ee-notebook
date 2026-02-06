---
title: "Field Failure Modes by Component"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Field Failure Modes by Component

How components actually fail in the field, and how those failures present at the bench. This is not about how components work or how to characterize them on a curve tracer — for test procedures and instrument settings, see [Component Testing]({{< relref "/docs/measurement/component-testing" >}}). This page is symptom-driven: what shows up at the bench, what to suspect, how to confirm, and where to go next.

## Electrolytic Capacitors

The most failure-prone passive component. Electrolytics have a liquid electrolyte that dries out over time, and the failure rate increases dramatically with temperature.

| Symptom | Suspect | Quick confirmation | Next step |
|---------|---------|-------------------|-----------|
| Increased ripple on a DC rail | ESR rise from dry-out | ESR meter — compare to published specs | Replace the cap |
| Decoupling degraded, downstream IC misbehaving | ESR rise or capacitance loss | ESR meter or substitution test | Replace and retest the downstream circuit |
| Rail drops to zero or fuse blows | Shorted cap (dielectric breakdown) | Remove cap, check if short clears | Replace; check for overvoltage cause |
| Brown/orange residue on PCB near cap | Leaking electrolyte | Visual — it's leaking | Replace cap, clean residue (it's corrosive), inspect nearby traces |

**Visual signs:** Bulging top vent, leaking residue, discolored PCB underneath, cap sitting crooked (pushed up by internal pressure).

**Testing detail:** A basic capacitance meter won't catch the most common failure (ESR rise). This requires an ESR meter or an LCR meter that reports ESR at the right frequency. See [ESR, Leakage & Gain]({{< relref "/docs/measurement/component-testing/esr-leakage-gain" >}}).

**Rule of thumb:** In consumer electronics more than 5–10 years old, electrolytics near heat sources (voltage regulators, power transistors) are the first suspect.

## Ceramic Capacitors

Usually reliable, but they have one spectacular failure mode.

| Symptom | Suspect | Quick confirmation | Next step |
|---------|---------|-------------------|-----------|
| Rail shorted to ground, upstream protection trips | Cracked ceramic → internal short | Remove ceramic caps one at a time near the fault; short clears when the cracked one is removed | Replace; investigate mechanical stress source |
| Subtle capacitance loss on high-K dielectric (X5R/X7R) | DC bias derating — not a field failure, a design issue | Measure capacitance at operating voltage vs. at zero bias | Redesign with lower-K dielectric or larger package |

**How cracks happen:** Board flex during assembly, thermal shock, rough handling, or press-fit connectors nearby. Visually, a hairline crack may be visible on the top surface, but often the crack is hidden underneath.

## Voltage Regulators

Linear and switching regulators are common failure points because they handle the full load current and dissipate power.

| Symptom | Suspect | Quick confirmation | Next step |
|---------|---------|-------------------|-----------|
| No output voltage | Input missing, enable pin in wrong state, or regulator dead | Measure input pin, enable pin, and output pin voltages | If input and enable are correct but output is zero → replace regulator |
| Output low (e.g., 2.8 V instead of 3.3 V) | Overcurrent (regulator in current limit) or dropout (input too close to output for LDO) | Check load current; check Vin − Vout margin | Reduce load or fix downstream short; ensure adequate input voltage |
| Output oscillating | Missing or wrong output capacitor, ESR out of range for LDO stability | Scope the output; check cap values and ESR against datasheet | Replace output cap with correct value and type |
| Output voltage correct but noisy | Switching noise (normal for DC-DC, but excessive), or input noise coupling through | Scope with short ground lead; compare to datasheet ripple specs | Add/improve input and output filtering |
| Regulator extremely hot | Excessive load, shorted output, or high dropout dissipation | Measure current draw; check for downstream shorts | Fix the load problem; don't just add a heatsink to a fault |

**Check first:** Input voltage *at the regulator pin* (not just "somewhere on the board"). Enable/shutdown pin state. Output voltage at the regulator pin and at the load.

## Transistors (BJT and MOSFET)

| Symptom | Suspect | Quick confirmation | Next step |
|---------|---------|-------------------|-----------|
| Circuit stuck high or low regardless of control signal | BJT shorted C-E or C-B (overcurrent/avalanche) | Diode-check: reads near zero in both directions across shorted junction | Replace; check what caused the overcurrent |
| Circuit open — no current flowing through transistor path | BJT or MOSFET open (bond wire or die crack) | Diode-check: reads open on all junctions | Replace |
| MOSFET won't turn off, drain-source always conducting | Gate oxide breakdown or D-S short from overcurrent | Diode-check D-S; check gate threshold voltage | Replace; investigate ESD or Vgs overvoltage source |
| MOSFET switching but running hotter than expected | Increased Rds(on) from partial damage | Measure Rds(on) or compare thermal behavior to a known-good part | Replace — partial damage gets worse |

**Testing:** Diode check across all terminal pairs (gate-source, gate-drain, drain-source, both directions). Compare readings to what the device type should show. See [Dead or Alive?]({{< relref "/docs/measurement/component-testing/dead-or-alive" >}})

## Resistors

Resistors are generally reliable, but they fail under sustained stress.

| Symptom | Suspect | Quick confirmation | Next step |
|---------|---------|-------------------|-----------|
| Circuit open, charred or cracked component visible | Resistor open from overcurrent — burned through | Resistance measurement: reads open or megohms | Replace; investigate what caused the overcurrent |
| Bias point or voltage divider slightly off | Value drift from chronic overheating | Measure resistance, compare to marked value and schematic | Replace; check power dissipation in the design |
| Intermittent behavior, especially with vibration or temperature change | Solder joint failure (the resistor itself is fine) | Reflow the joints; check for cracks under magnification | Reflow or replace |

**The sneaky one:** A resistor that's drifted 20% doesn't look broken, and a quick measurement might seem "close enough." Always compare to the marked value (color code or package markings) *and* to the schematic.

## Connectors

Connectors are mechanical components, and mechanical components wear.

| Symptom | Suspect | Quick confirmation | Next step |
|---------|---------|-------------------|-----------|
| Intermittent connection, position-sensitive | Corroded pins or worn contact springs | Visual inspection (green/white deposits); wiggle test with continuity meter | Clean with contact cleaner, or replace |
| Wire pulls free with gentle tension | Backed-out terminal — not fully seated in housing | Pull test on each wire | Reseat or re-crimp the terminal |
| Intermittent on a board-mount connector, especially one that sees cable insertion/removal | Cracked solder joint from mechanical stress | Magnification; reflow and see if behavior changes | Reflow or replace the connector |

## ICs

IC failures are usually diagnosed by exclusion — verify everything around the IC first.

| Step | What to check | If wrong |
|------|--------------|----------|
| 1 | All supply pins — correct voltage, decoupled, no excessive ripple | Fix the power problem |
| 2 | Control inputs — reset, enable, chip-select at correct levels | Fix the upstream driver or pull-up/pull-down |
| 3 | Clock (if applicable) — correct frequency, clean edges | Fix clock source |
| 4 | Data/signal inputs — correct levels, timing, protocol | Fix the upstream source |
| 5 | All inputs correct, outputs still wrong | Suspect the IC itself |

**Don't jump to "bad IC" too quickly.** An IC with incorrect inputs produces incorrect outputs, and the problem is upstream. Most "bad IC" diagnoses in hobbyist debugging turn out to be bad power, missing pull-ups, or wrong configuration.

## Quick Reference

| Component | Common field failure | How it presents | First move |
|-----------|---------------------|-----------------|------------|
| Electrolytic cap | ESR rise / dry-out | Increased ripple, poor decoupling | ESR meter |
| Ceramic cap | Cracked → short | Rail drops to zero, upstream protection trips | Remove caps one at a time |
| Voltage regulator | Overcurrent / thermal death | Wrong output voltage or no output | Measure Vin / Vout / enable |
| BJT | Shorted junction | Circuit stuck high or low | Diode check all junctions |
| MOSFET | Gate oxide / D-S short | Won't switch off, always conducting | Diode check, gate threshold |
| Resistor | Open from overcurrent | Open circuit, charred body | Resistance measurement |
| Connector | Corroded / worn | Intermittent, position-sensitive | Wiggle test, continuity |
| IC | Various | Wrong outputs despite correct inputs | Verify all inputs first |

## In Practice

- **An IC that works for weeks and then fails without any change in operating conditions** often indicates cumulative downward damage — electromigration, oxide degradation, or solder joint fatigue that has been progressing since initial deployment, finally reaching the threshold where the circuit can no longer function.
- **A gradually increasing error rate over weeks or months** often indicates aging at the primitive level — a solder joint developing a fatigue crack, a capacitor losing capacitance, a connector contact corroding — propagating upward through the hierarchy as a gradually worsening performance metric at the system level.
