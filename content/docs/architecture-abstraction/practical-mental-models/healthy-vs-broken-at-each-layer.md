---
title: "Healthy vs Broken at Each Layer"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Healthy vs Broken at Each Layer

A broken circuit doesn't always look broken. A drifted resistor still has a resistance. A degraded op-amp still amplifies. A marginal power supply still delivers voltage. The failure is often not in whether the component works, but in whether it works well enough for its role in the circuit. "Well enough" is defined by the abstraction level — what counts as healthy at the primitive level (correct component value) is different from what counts as healthy at the system level (correct coordinated function).

Developing an internal sense of what "healthy" looks like at each abstraction level — and what the characteristic failure signatures are at each level — is one of the most valuable diagnostic skills. It allows rapid triage: recognizing the level of a failure from its symptoms, without exhaustively testing every component, every block, every subsystem.

## Primitives: Healthy vs Broken

### Healthy

A healthy primitive has the electrical characteristics its datasheet specifies. A resistor has its marked resistance (within tolerance). A capacitor has its rated capacitance, ESR, and voltage rating. A transistor has its specified threshold voltage, gain, and leakage current. A diode has its expected forward voltage and reverse leakage.

At the primitive level, "healthy" means the component's parameters are within their specified ranges. The component doesn't need to know what circuit it's in — it just needs to have the right electrical properties.

### Broken

Primitive-level failures have characteristic signatures:

**Open circuit.** The component presents infinite impedance. A resistor reads as open. A capacitor doesn't charge. A trace is interrupted. Current doesn't flow through the intended path. Symptoms: a node that's at an unexpected voltage (pulled to a rail or floating), a signal that doesn't propagate, a current that's zero where it should be nonzero.

**Short circuit.** The component presents near-zero impedance where it shouldn't. A capacitor has broken down. A semiconductor junction has failed short. A solder bridge connects two nodes. Symptoms: excessive current, hot components, supply voltage pulled down, loss of signal isolation.

**Parameter drift.** The component still functions but its parameter has shifted outside its tolerance. A resistor has increased due to thermal damage. A capacitor has lost capacitance due to aging or DC bias. A transistor's gain has degraded. Symptoms: shifted bias points, changed frequency response, reduced gain — subtle symptoms that make the circuit "work but not well."

**Intermittent connection.** A solder joint, connector contact, or via has a marginal connection that opens and closes with temperature, vibration, or mechanical stress. Symptoms: behavior that changes when the board is pressed, tapped, or thermally stressed. The most maddening primitive-level failure because it appears and disappears unpredictably.

## Blocks: Healthy vs Broken

### Healthy

A healthy block has the correct transfer function. An amplifier has the right gain, bandwidth, and phase response. A filter passes and rejects the correct frequencies. A voltage divider delivers the correct ratio. A comparator switches at the correct threshold. A logic gate produces the correct truth table.

At the block level, "healthy" means the relationship between input and output is correct. The block's internal primitives may have variations, but as long as the transfer function is within specification, the block is healthy.

### Broken

Block-level failures have their own signatures:

**Wrong transfer function.** The block still produces an output, but the input-output relationship is wrong. Gain is too high or too low. The filter's cutoff frequency has shifted. The comparator's threshold has moved. Symptoms: correct waveform shape but wrong amplitude, correct function but wrong frequency response, correct logic function but wrong threshold.

**Saturated or clipped output.** The block's output is limited by its supply rails or its internal drive capability. An amplifier clips because the input is too large or the supply is too low. A comparator output doesn't swing to the rail because the output stage can't source enough current into the load. Symptoms: flat-topped waveforms, output stuck at a rail, loss of signal detail at extremes.

**Oscillation.** The block produces an output signal that wasn't applied to its input. A feedback path (intentional or parasitic) creates a loop with gain greater than one and phase shift of 180°, and the block oscillates. Symptoms: output contains a frequency component not present in the input, often at a frequency related to the block's bandwidth or the parasitic feedback path.

**Noise floor elevation.** The block's output contains more noise than its intrinsic specification predicts. A supply noise coupling path, a ground bounce contribution, or a damaged component adds noise that the block amplifies along with the signal. Symptoms: reduced signal-to-noise ratio, output noise that correlates with unrelated circuit activity.

## Subsystems: Healthy vs Broken

### Healthy

A healthy subsystem meets its specification. A voltage regulator holds its output within tolerance across the specified load, temperature, and input voltage range. An ADC achieves its rated resolution and accuracy. A PLL locks to its reference with the specified phase noise and lock time. A communication transceiver achieves its rated data rate and bit error rate.

At the subsystem level, "healthy" is defined by specifications — quantitative promises about performance under defined conditions. A subsystem can have internal block-level variations (gain slightly off nominal, bias point shifted slightly) and still be healthy if the specification is met.

### Broken

Subsystem-level failures have characteristic signatures:

**Specification violation.** The subsystem's measured performance doesn't meet its specification. The regulator's output voltage is outside tolerance. The ADC's accuracy exceeds its rated error. The PLL doesn't lock, or locks with excessive jitter. Symptoms: the subsystem does its job, but not well enough. The function is correct; the performance is degraded.

**Mode malfunction.** The subsystem is in the wrong operating mode or transitions between modes incorrectly. A regulator enters dropout when it shouldn't, or fails to enter a power-saving mode when commanded. An ADC is in the wrong conversion mode. A transceiver is in the wrong speed or protocol setting. Symptoms: the subsystem does something, but it's the wrong something — wrong output level, wrong timing, wrong format.

**Protection tripping.** The subsystem's internal protection has activated — overcurrent, overvoltage, thermal shutdown, undervoltage lockout. The subsystem has detected a condition that violates its safe operating boundary and has taken protective action. Symptoms: the subsystem shuts down, reduces its output, or enters a fault state. The protection is working correctly; the operating conditions are wrong.

**Internal coordination failure.** The subsystem's internal blocks aren't working together correctly. A feedback loop oscillates. A startup sequence hangs. An internal bias point is wrong, causing dependent blocks to malfunction. Symptoms: the subsystem partially works — some outputs are correct and others aren't, or the subsystem works at some operating points but not others.

## Devices: Healthy vs Broken

### Healthy

A healthy device performs its intended function across its specified operating conditions. A data acquisition device acquires data accurately. A motor controller drives the motor correctly. A communication module maintains its link. All subsystems are operating within specification, and the coordination between subsystems — power sequencing, clock distribution, data flow, control signaling — is functioning.

At the device level, "healthy" means the assembled subsystems work together as an integrated whole. Individual subsystem health is necessary but not sufficient — the interactions, sequencing, and coordination must also be correct.

### Broken

Device-level failures have characteristic signatures:

**Integration failure.** Individual subsystems meet their specifications when tested independently, but the device doesn't function correctly when they're all operating together. Supply coupling, ground coupling, thermal coupling, or electromagnetic coupling between subsystems creates interactions that degrade one or more subsystem's performance below its specification. Symptoms: problems that appear only when the full device is active, and disappear when individual subsystems are tested in isolation.

**Sequencing failure.** The device fails to start up correctly, or fails to recover correctly from a power interruption. The subsystems power up in the wrong order, a reset domain doesn't release correctly, or a calibration routine fails because a dependency wasn't met. Symptoms: the device works if started in a specific way (slow power ramp, specific enable sequence) but fails with other startup conditions. Intermittent startup failure is the hallmark.

**Configuration error.** The device's firmware or hardware configuration puts a subsystem in the wrong state. A peripheral is configured for the wrong mode, a clock is set to the wrong frequency, a pin is configured with the wrong function. Symptoms: the device does something consistently wrong — wrong data format, wrong timing, wrong output level — and the error is reproducible and deterministic.

**Resource exhaustion.** The device exceeds a shared resource's capacity — power budget, thermal budget, bus bandwidth, memory. Symptoms: the device works under light load but fails under heavy load. The failure mode depends on which resource is exhausted: supply droop (power), thermal shutdown (thermal), data corruption (bandwidth), crashes (memory).

## Systems: Healthy vs Broken

### Healthy

A healthy system achieves its intended purpose in its intended environment. All devices are functioning. All inter-device coordination is working. The system handles environmental variation (temperature, power quality, electromagnetic interference) within its specified range. The system responds correctly to both normal inputs and abnormal conditions (faults, out-of-range inputs, communication errors).

At the system level, "healthy" means more than correct function — it includes robustness, graceful degradation, and correct fault response.

### Broken

System-level failures have characteristic signatures:

**Coordination failure.** All devices function correctly individually, but the system doesn't achieve its purpose because the devices aren't working together. Communication timing is wrong, data formats are mismatched, or state machines are out of sync. Symptoms: intermittent errors, data corruption, wrong outputs — problems that depend on the interaction pattern between devices rather than on any single device's behavior.

**Environmental exceedance.** The operating environment exceeds the system's design assumptions. Temperature is higher than rated, power quality is worse than expected, electromagnetic interference exceeds the system's immunity. Symptoms: failures that correlate with environmental conditions — time of day, season, weather, nearby equipment activity.

**Graceful degradation failure.** The system doesn't handle partial failures correctly. When one device fails or one communication link goes down, the system doesn't degrade gracefully — it either continues operating with wrong data (silent failure) or shuts down entirely when partial operation would have been acceptable. Symptoms: disproportionate response to minor faults, or no response to significant faults.

**Aging and drift.** System performance gradually degrades as components age, calibrations drift, connections degrade, and environmental conditions change. Symptoms: gradually increasing error rates, slowly drifting outputs, intermittent failures that become more frequent over time. The system was healthy at deployment and is gradually becoming unhealthy.

## Tips

- The fastest diagnostic approach is to determine the failure's abstraction level first, then diagnose within that level. A component-level failure (parameter drift, open, short) has different symptoms than a subsystem-level failure (specification violation, mode error) or a system-level failure (coordination problem, environmental exceedance). Recognizing the level from the symptom pattern saves the time spent investigating at the wrong level.
- At each level, compare the observed behavior to the expected healthy behavior for that level — not just "does it work?" but "does it meet the specific quantitative criteria for health at this level?" A subsystem that "works" but has 20% less phase margin than designed is not healthy, even if it hasn't failed yet.
- When investigating a failure, check the level below first. If a subsystem doesn't meet its specification, check whether the blocks have correct transfer functions. If a block has the wrong transfer function, check whether the primitives have correct parameters. Most failures originate at a lower level and propagate upward.

## Caveats

- **A healthy appearance at one level can hide a failure at another** — A device that passes its functional test is "healthy" at the device level, but it may have a subsystem operating outside its specification (compensated by margin at the device level) or a component that has drifted (compensated by feedback at the block level). The latent unhealthiness becomes a failure when conditions change.
- **"Broken" is relative to the specification, not to expectations** — A circuit that doesn't meet its specification is broken, even if it seems to work. A circuit that meets its specification is healthy, even if the performance seems disappointing. Debugging should compare measurements to specifications, not to wishes.
- **Intermittent behavior can exist at any level** — Intermittent primitive failures (cracked solder joints), intermittent block failures (oscillation that occurs only at certain temperatures), intermittent subsystem failures (protection tripping on transients), and intermittent system failures (coordination races) all exist. Intermittency doesn't indicate a specific level.
