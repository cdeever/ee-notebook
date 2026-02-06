---
title: "Downward Failure Propagation"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Downward Failure Propagation

A firmware update configures a GPIO pin as a push-pull output instead of open-drain. The pin now drives a bus that has other devices pulling it low. The resulting contention forces both the GPIO driver and the external device to sink and source current simultaneously, exceeding the pin's rated drive current. The output transistor inside the microcontroller overheats. If the condition persists, the die is damaged.

The cause is a configuration error — a system-level decision. The damage is physical — a primitive-level failure. Between them, the error propagated downward through the abstraction hierarchy: a wrong register value (device level) created an electrical conflict (subsystem level) that overstressed a circuit element (block level) and destroyed a transistor (primitive level). Downward propagation is how bad decisions at high levels become real damage at low levels.

## The Mechanism

Upward propagation carries symptoms from cause to observation. Downward propagation carries stress from decision to damage. The two directions are fundamentally different:

- **Upward propagation changes information** — a parameter drift becomes a spec violation becomes a functional error. The physical hardware at the bottom may be fine; the problem is in the signal chain above it.
- **Downward propagation changes hardware state** — a wrong decision becomes an abnormal operating condition becomes physical stress becomes degradation or destruction. The decision at the top may be corrected later, but the damage at the bottom persists.

This asymmetry is important: upward propagation is usually reversible (fix the cause, and the symptom disappears), while downward propagation is often irreversible (fix the configuration, but the transistor is already damaged).

## How Decisions Become Damage

### Configuration Errors

Modern devices contain enormous numbers of configurable parameters — clock frequencies, pin functions, peripheral modes, voltage references, interrupt priorities, power states. Each configuration parameter controls some aspect of the internal hardware, and incorrect settings can drive the hardware into conditions it wasn't designed for.

**Over-clocking a peripheral beyond its rated frequency** causes the internal logic to violate setup and hold times. The immediate consequence is data corruption, but the secondary consequence is increased switching current, increased power dissipation, and potential latch-up of CMOS structures. The clock frequency is a device-level parameter; the latch-up is a primitive-level failure.

**Setting the wrong voltage for an I/O bank** applies excessive voltage to gate oxides, accelerating time-dependent dielectric breakdown. The I/O voltage selection is a configuration register; the gate oxide degradation is physics at the nanometer scale. The damage may not cause immediate failure — it may reduce the transistor's lifetime from years to months.

**Enabling an output that conflicts with an external driver** creates bus contention. Both sides try to establish different logic levels, and the resulting current depends on the output impedance of both drivers. If the current exceeds the rated maximum for either driver, the output stage may be damaged.

### Operating Condition Violations

System-level design decisions determine the operating conditions that subsystems and components experience. Wrong decisions at the system level create conditions that stress components beyond their ratings:

**Insufficient thermal management** allows junction temperatures to exceed maximum ratings. The system designer chose the heat sink, the airflow, and the power budget. If these choices don't keep the die temperature within the IC's absolute maximum rating, the silicon degrades — electromigration accelerates, threshold voltages shift, and the device ages prematurely. The thermal design is a system-level responsibility; the consequence is transistor-level degradation.

**Inadequate supply filtering** allows transients to reach sensitive components. A system that doesn't filter inductive load switching transients from the supply bus exposes downstream ICs to voltage spikes. The spikes may exceed the IC's absolute maximum supply voltage, causing gate oxide stress or junction breakdown. The filtering decision is system-level; the oxide damage is nanometer-scale.

**Exceeding mechanical stress limits** during assembly or operation — overtightened mounting hardware, thermal expansion mismatch, vibration — creates mechanical stress on solder joints, bond wires, and die attach. The mechanical decisions are system-level; the cracks in solder joints are material-level failures.

### Fault Handling Failures

When a system detects a fault, the response it chooses can either contain the damage or propagate it downward:

**Ignoring a fault signal** allows the fault condition to continue. A thermal warning flag from a power IC, if ignored by the controlling processor, allows the junction temperature to continue rising until thermal shutdown activates — or, if the shutdown is too slow, until the die is damaged. The fault flag was the IC's attempt to prevent downward propagation; ignoring it removed the containment.

**Incorrect fault response** can worsen the condition. Responding to an overcurrent fault by cycling power rapidly can subject the circuit to repeated inrush currents, each one stressing the input protection and charging circuits. A single overcurrent event might be within ratings; a hundred rapid power cycles might not be.

**Incomplete recovery from a fault** can leave hardware in a stressed state. A latch-up event that's resolved by briefly removing power but not fully resetting all internal state may leave internal parasitic thyristors in a condition where they re-trigger more easily. The recovery procedure at the system level was insufficient to restore the primitive-level state.

## Why Downward Propagation Is Underestimated

Several factors cause downward propagation to receive less attention than upward propagation:

**The damage may not be immediately visible.** A component that's been electrically overstressed may continue to function — with degraded parameters, reduced lifetime, or increased vulnerability to the next stress event. The damage is cumulative and statistical, not immediate and deterministic. A circuit that "survived" an overvoltage event may have had its reliability reduced from twenty years to two years, but it works fine today.

**The causal chain is counterintuitive.** The idea that a firmware bug can physically damage hardware contradicts the mental model many engineers carry — the model that software and hardware are separate domains. In reality, software controls the hardware's operating conditions, and wrong control creates wrong conditions.

**Testing rarely covers the worst case.** System testing verifies that correct configurations produce correct behavior. It rarely verifies that incorrect configurations don't damage hardware, because the space of incorrect configurations is enormous and the damage may be latent. A configuration error that survives testing may cause field failures months later.

**Protection circuits have limits.** ESD protection, overcurrent shutdown, and thermal limiting are designed to handle specific fault scenarios. Novel fault conditions — combinations of stresses, unusual sequences, sustained marginal overloads — may exceed the protection circuits' design intent and allow damage to reach the protected components.

## Tips

- When reviewing firmware or configuration settings, check not just whether the settings produce the desired function but whether any setting could create an electrically invalid condition — bus contention, overvoltage, over-current, or operation beyond rated frequency. Configuration review is a form of safety review.
- Absolute maximum ratings in datasheets are not design targets — they are damage thresholds. Any system-level decision that allows operating conditions to approach absolute maximum ratings under worst-case combinations (high temperature, maximum load, transient conditions) is allowing downward propagation potential.
- When an IC has been exposed to a suspected overstress event, don't assume it's fine because it still works. Measure critical parameters (leakage current, offset voltage, quiescent current) and compare to the datasheet. Latent damage often manifests as increased leakage or shifted parameters before it causes outright failure.
- Power sequencing specifications exist to prevent downward propagation. When a datasheet specifies that VDD must be applied before VDDIO, the reason is usually that violating this sequence forward-biases internal ESD protection diodes or parasitic junctions, injecting current into the substrate and potentially triggering latch-up. Sequencing requirements are damage-prevention requirements.

## Caveats

- **"Absolute Maximum" doesn't mean safe operation** — Operating at absolute maximum rating for one parameter may be destructive if other parameters are also at their limits. Datasheets specify absolute maxima individually; the combined stress from multiple parameters at their limits may exceed the silicon's capability even if no single parameter exceeds its individual limit.
- **Damage can be progressive and invisible** — Electromigration, hot carrier injection, and dielectric breakdown are cumulative degradation mechanisms. Each stress event does some damage. The IC continues to function — with gradually shifting parameters — until the accumulated damage crosses a failure threshold. The failure appears sudden, but the damage was accumulating over weeks or months.
- **Protection circuits can become the failure point** — ESD protection diodes, substrate clamps, and thermal shutdown circuits are designed for occasional activation. If system-level conditions cause these protection circuits to activate continuously or repeatedly, the protection circuits themselves may degrade. A supply rail that repeatedly triggers an internal ESD clamp may eventually damage the clamp itself.
