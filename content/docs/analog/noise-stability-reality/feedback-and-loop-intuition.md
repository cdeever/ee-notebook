---
title: "Feedback & Loop Intuition"
weight: 15
---

# Feedback & Loop Intuition

Feedback is the single most important idea in analog electronics. Almost every practical analog circuit — amplifiers, regulators, oscillators, PLLs, bias networks — uses feedback to make behavior predictable. But feedback is often taught as control theory math first and circuit intuition second. This page inverts that: what feedback actually does in circuits, why it exists, and the conceptual vocabulary you need before diving into stability analysis.

## What Feedback Is in Circuits

Feedback means taking some portion of a circuit's output and routing it back to influence the input. That's it. The consequences, though, are profound.

**Negative feedback:** The fed-back signal opposes the input. If the output is too high, feedback pushes it down. If too low, feedback pushes it up. The system self-corrects toward a target.

- An op-amp inverting amplifier: output voltage is sampled by a resistor divider and fed back to the inverting input. If the output drifts high, the error signal drives it back down
- A voltage regulator: output voltage is compared to a reference. If the output drops (load increase), the error amplifier drives the pass element harder to restore it
- An emitter degeneration resistor: increased collector current increases the emitter voltage, which reduces V_BE, which reduces collector current. Self-correcting

**Positive feedback:** The fed-back signal reinforces the input. Any deviation from equilibrium grows larger. This is how oscillators and latches work — and how negative feedback circuits fail when phase shifts turn negative feedback into positive feedback at some frequency.

## Why Feedback Exists

Without feedback, circuit behavior depends on component parameters that vary with temperature, manufacturing, aging, and operating conditions. An open-loop transistor amplifier's gain depends on beta and g_m — both of which vary 2:1 or more. An open-loop voltage source depends on the exact output impedance and load.

Feedback trades raw performance for predictability:

| Property | Without feedback | With negative feedback |
|----------|-----------------|----------------------|
| Gain | High but unpredictable | Lower but set by resistor ratios |
| Bandwidth | Narrow | Wider (gain-bandwidth tradeoff) |
| Distortion | Higher | Reduced by the loop gain factor |
| Output impedance | Higher | Reduced by the loop gain factor |
| Input impedance | Device-dependent | Increased (series feedback) or decreased (shunt feedback) |
| Sensitivity to component variation | High | Low (depends on feedback network, not the amplifier) |

The key insight: **with enough loop gain, the closed-loop behavior depends almost entirely on the feedback network** (usually passive components like resistors), not on the active device. This is why op-amp circuits work — the op-amp's exact gain doesn't matter as long as it's "high enough."

## Loop Gain: The Concept

Loop gain is the gain a signal experiences as it travels around the complete feedback loop: from the summing point, through the amplifier, through the feedback network, and back to the summing point.

**Loop gain = open-loop gain x feedback fraction**

Or equivalently: T = A x B, where A is the forward gain and B is the fraction of the output fed back.

**What loop gain tells you:**

- **High loop gain (>> 1):** The circuit tightly controls the output. Errors (distortion, noise, drift) are suppressed by the factor of the loop gain. The closed-loop gain approaches 1/B — determined entirely by the feedback network
- **Low loop gain (approaching 1):** The feedback is weakening. The circuit starts to lose control. Errors are barely suppressed. The actual gain deviates from 1/B
- **Loop gain < 1:** The feedback is too weak to control the output. The circuit is essentially open-loop at this frequency

**Loop gain decreases with frequency.** The amplifier's gain rolls off at high frequencies (every amplifier has finite bandwidth). At some frequency, the loop gain drops to 1 (0 dB). This is the **crossover frequency** — the boundary between "feedback is in control" and "feedback has lost control."

## Phase Margin: How Close to Ringing

Here's where it gets physical. Loop gain doesn't just have a magnitude — it has a phase. As frequency increases, the amplifier and feedback network introduce phase shifts. If the total phase shift around the loop reaches 360 degrees (which looks like 0 degrees — the signal arrives back in phase with where it started) while the loop gain is still >= 1, the circuit oscillates.

**Phase margin** measures how far you are from that catastrophe:

- It's the difference between the actual phase shift and 360 degrees, measured at the crossover frequency (where loop gain = 1)
- 90 degrees of phase margin: very stable, sluggish transient response
- 60 degrees: well-damped, crisp step response with minimal overshoot
- 45 degrees: adequate, some overshoot and ringing on transients
- 30 degrees: marginal, significant ringing
- 0 degrees: sustained oscillation

**The physical intuition:** Think of pushing someone on a swing. If you push at exactly the right moment (in phase), the swing goes higher each cycle — that's oscillation. If your pushes are slightly mistimed (out of phase), the energy doesn't build up and the swing settles to a steady amplitude. Phase margin is how far off your timing is from the resonant condition.

## Why Compensation Exists

Most amplifiers, left to their own devices, don't have enough phase margin. Each gain stage adds phase shift (each pole contributes up to 90 degrees). A three-stage amplifier can easily accumulate 270 degrees of phase shift while the loop gain is still above 1. That's not enough margin.

**Compensation** deliberately shapes the loop gain vs. frequency curve to ensure adequate phase margin. The most common approach:

**Dominant pole compensation:** Add a capacitor that creates a low-frequency pole, rolling off the gain early. This ensures the loop gain drops below 1 before the phase shift reaches the danger zone. The price is reduced bandwidth — you're intentionally making the amplifier slower to make it stable.

This is why most op-amps have a gain-bandwidth product of only 1-10 MHz even though the transistors inside them could operate at hundreds of MHz. The internal compensation capacitor (typically 30 pF) limits the bandwidth to guarantee stability.

**Other compensation strategies** (lead compensation, feedforward compensation) try to get more bandwidth while maintaining adequate phase margin. They're more complex but allow faster circuits. See [Stability & Oscillation]({{< relref "stability-and-oscillation" >}}) for the details.

## Feedback in Circuits You Might Not Recognize

Feedback isn't always obvious. Some circuits that use feedback without looking like textbook feedback loops:

- **Emitter/source degeneration** — The emitter resistor provides local negative feedback within a single transistor stage. No explicit feedback path drawn on the schematic, but the mechanism is the same
- **Voltage regulators** — Every linear regulator and switching regulator is a feedback loop. The error amplifier, pass element, and output divider form the loop. Regulator stability problems are feedback stability problems
- **Bias networks** — Collector feedback bias (resistor from collector to base) is a feedback loop that stabilizes the operating point
- **Crystal oscillators** — Positive feedback at the crystal's resonant frequency. The crystal provides the frequency-selective feedback path
- **AGC (Automatic Gain Control)** — Feedback that adjusts gain to maintain constant output amplitude despite varying input levels

## Gotchas

- **Feedback doesn't create gain — it trades it for other properties.** The closed-loop gain is always less than the open-loop gain. Feedback reduces gain to buy predictability, bandwidth, and lower distortion
- **Negative feedback at DC can become positive feedback at high frequency.** Phase shifts accumulate with frequency. Every circuit with negative feedback has a frequency at which the feedback becomes positive. The question is whether there's still enough gain at that frequency to sustain oscillation
- **More loop gain is not always better.** Higher loop gain improves accuracy and distortion, but it also means the crossover frequency is higher, which makes stability harder. The loop must be stable at the crossover frequency, and higher crossover means dealing with more phase shift from more poles
- **Feedback around nonlinear elements doesn't linearize them perfectly.** Feedback reduces distortion by the loop gain factor, but it doesn't eliminate it. A transistor amplifier with 40 dB of loop gain reduces distortion by 100x — significant, but not zero
- **The feedback network itself has parasitics.** Resistors have capacitance, traces have inductance. At high frequencies, the feedback fraction B is not what the schematic suggests. This is another reason circuits oscillate in practice but not in simulation
