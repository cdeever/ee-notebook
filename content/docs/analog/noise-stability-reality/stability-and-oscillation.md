---
title: "Stability & Oscillation"
weight: 20
---

# Stability & Oscillation

Feedback done right produces a stable amplifier with predictable gain. Feedback done wrong produces an oscillator. The difference is phase margin — how much room you have between the actual phase shift and the 360 degrees that would sustain oscillation. Understanding stability is essential for any circuit with feedback, which includes almost every practical analog circuit.

## The Oscillation Condition

A feedback system oscillates when two conditions are simultaneously met (Barkhausen criterion):

1. **Loop gain magnitude >= 1** (0 dB) at some frequency
2. **Loop phase shift = 360 degrees** (or equivalently, 0 degrees) at that frequency

In a negative feedback amplifier, the inverting input already provides 180 degrees. So the remaining circuit (amplifier + feedback network) needs to add another 180 degrees of phase shift at a frequency where the gain is still >= 1. If this happens, negative feedback becomes positive feedback and the circuit oscillates.

## Phase Margin

Phase margin is the safety buffer: how many degrees of additional phase shift it would take to reach 360 degrees at the frequency where loop gain = 1 (the gain crossover frequency).

**Phase margin = 180 degrees - (phase shift at gain crossover)**

- **>60 degrees:** Well-behaved, minimal overshoot in step response
- **45-60 degrees:** Adequate for most applications. Some overshoot and ringing on transients
- **20-45 degrees:** Marginal. Significant ringing, possible oscillation with load or temperature changes
- **<20 degrees:** Likely to oscillate under some conditions
- **0 degrees:** Sustained oscillation

## Gain Margin

Gain margin is the other safety buffer: how many dB the loop gain is below 0 dB at the frequency where phase shift reaches 360 degrees.

- **>10 dB:** Generally safe
- **6-10 dB:** Adequate but leaves less room for component variations
- **<6 dB:** Risky

A stable amplifier needs adequate both phase margin and gain margin. Either one being insufficient can cause oscillation.

## Why Good Designs Still Oscillate

The circuit might have adequate phase margin on paper (or in simulation) but oscillate on the bench because of factors the model didn't include:

### Parasitic Capacitance

Every PCB trace, component pad, and wire has capacitance to ground and to nearby traces. This adds high-frequency poles that aren't in the schematic. A few picofarads at a high-impedance node can shift the phase enough to lose stability.

### Output Loading

Capacitive loads (cables, long traces, downstream input capacitance) add a pole to the loop transfer function. Many op-amps are specified for a maximum capacitive load. Exceeding it causes oscillation.

**Fix:** A small series resistor (10-100 ohm) between the op-amp output and the capacitive load isolates the load from the feedback path.

### Stray Feedback Paths

Physical proximity between the output and input creates unintended feedback through capacitive coupling or magnetic coupling. In a high-gain amplifier, even femtofarads of stray capacitance can create a feedback path that the designer didn't account for.

### Supply Impedance

At high frequencies, the supply impedance rises (the regulator's loop gain drops). If the supply impedance is high enough at a frequency where the amplifier has gain, the supply acts as a feedback path: output current modulates the supply voltage, which modulates the input. This is why decoupling matters for stability, not just for noise.

### Temperature and Component Drift

A circuit with marginal phase margin at room temperature may lose enough margin at elevated temperature (where transistor parameters shift and capacitor values change) to oscillate.

## Compensation Techniques

### Dominant Pole Compensation

Add a capacitor that creates a pole at a low enough frequency to roll off the gain before the phase shift reaches the critical point. This is how most internally compensated op-amps work — a small on-chip capacitor creates a dominant pole at a few Hz, guaranteeing stability at any gain.

**The cost:** Bandwidth. A dominant pole compensation sacrifices high-frequency gain for stability. An uncompensated op-amp with 100 MHz bandwidth might be compensated to 1 MHz GBW.

### Lead Compensation

Add a zero in the loop transfer function that counteracts a troublesome pole. A feedback capacitor across the feedback resistor in an inverting amplifier creates a zero that can improve phase margin.

### Miller Compensation

Uses a capacitor between the output and input of a gain stage (exploiting the Miller effect) to create a dominant pole. This is the standard internal compensation technique in op-amps.

### Output Isolation

A resistor in series with the output, outside the feedback loop, isolates capacitive loads. The feedback is taken from before the resistor, so the load capacitance doesn't affect the loop stability.

## How to Diagnose Oscillation

**On the oscilloscope:**
- Continuous sine-wave oscillation at a specific frequency — the circuit is oscillating at the frequency where the Barkhausen criteria are met
- Ringing on step responses (damped sine wave) — insufficient phase margin but not oscillating. The ringing frequency indicates where the phase margin is worst
- High-frequency fuzz on the output — could be oscillation at a frequency above your scope's display resolution, or parasitic oscillation in a transistor stage

**Quick checks:**
- Touch the output node with a scope probe (adds ~10 pF capacitance). If the oscillation frequency changes, it's load-dependent — suggests capacitive loading is the issue
- Squeeze the feedback resistor with your fingers (adds parasitic capacitance). If the oscillation changes, stray feedback is involved
- Add a small cap (10-100 pF) across the feedback resistor. If oscillation stops, you need lead compensation

## Gotchas

- **Stability is a closed-loop property** — You can't assess stability by looking at the open-loop behavior alone. You need the loop gain (open-loop gain x feedback fraction) plotted versus frequency
- **Simulation misses parasitics** — SPICE simulation with ideal models may show perfect stability. Add parasitic capacitances (a few pF at critical nodes) and re-simulate. If the circuit is marginal, the real board will oscillate
- **Non-inverting is less stable than inverting** — At the same signal gain, a non-inverting amplifier has higher noise gain (and thus the same loop bandwidth as a lower-gain inverting configuration). The practical effect: non-inverting configurations are more prone to instability with capacitive loads
- **Unity-gain is the worst case** — For a feedback amplifier, unity gain (voltage follower) has the highest noise gain and the widest bandwidth. If the amplifier is stable at unity gain, it's stable at any higher gain. This is why op-amps are typically characterized for stability at unity gain
- **Intermittent oscillation** — A circuit that oscillates only sometimes (on power-up, at certain temperatures, with certain loads) has marginal stability. This is worse than continuous oscillation because it's harder to detect and debug
