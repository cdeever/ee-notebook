---
title: "Temperature & Drift"
weight: 30
---

# Temperature & Drift

Why yesterday's circuit behaves differently today. Every component in an analog circuit has temperature-dependent behavior. Resistors drift, transistor parameters shift, capacitor values change, and reference voltages move. In a well-designed circuit, these effects are controlled by feedback. In a poorly designed one, they cause the circuit to drift out of spec, distort, or fail — often intermittently.

## Where Temperature Sensitivity Lives

### Transistor Parameters

**BJTs:**
- V_BE: -2 mV/C (this is the dominant temperature effect). At constant I_C, V_BE drops as temperature rises
- Beta: increases with temperature (positive tempco). Roughly +0.5-1%/C
- Leakage current (I_CBO): doubles every 10 C. Negligible at room temperature for modern silicon, but can become significant at 100+ C

**MOSFETs:**
- V_th: -2 to -5 mV/C. Threshold voltage decreases with temperature
- Mobility: decreases with temperature. This partially compensates the V_th shift — at some bias current, the effects cancel (zero temperature coefficient point, ZTC)
- R_DS(on): increases with temperature (positive tempco). This is actually useful — it provides natural current sharing between paralleled MOSFETs

### Passive Components

**Resistors:**
- Tempco depends on type. Thick film: ±100-200 ppm/C. Metal film: ±25-50 ppm/C. Wirewound: ±5-20 ppm/C
- A 100 ppm/C resistor in a circuit that swings 50 C changes by 0.5%. In a precision voltage divider, this can shift the output by millivolts

**Capacitors:**
- C0G/NP0: ±30 ppm/C (essentially stable)
- X7R: ±15% over -55 to +125 C range
- Y5V: +22/-82% over -30 to +85 C range — almost useless for precision work
- Electrolytic: ESR increases significantly at low temperatures. A cap that decouples fine at room temperature may not decouple adequately in a cold environment

**Inductors:**
- Core permeability changes with temperature, changing inductance
- DCR changes with temperature (copper: +0.39%/C)

### Voltage References

Even "stable" references drift:

- Basic Zener: 100-1000 ppm/C
- Bandgap reference (e.g., LM4040): 10-100 ppm/C
- Precision reference (e.g., LTZ1000): <0.05 ppm/C

The reference sets the absolute accuracy of any measurement or regulation circuit. Everything downstream is limited by the reference's stability.

## How Drift Manifests

### Slow Offset Drift

The most common symptom. The output of an amplifier chain slowly drifts as the circuit warms up after power-on. The circuit settles after the thermal environment stabilizes (thermal equilibrium), but any change in ambient temperature or power dissipation restarts the drift.

In measurement circuits, this is the warm-up time — the period after power-on during which readings are unreliable.

### Gain Drift

If gain depends on a component with a significant tempco, the gain changes with temperature. An amplifier with gain set by two resistors with matched tempcos has minimal gain drift (the ratio stays constant even though the individual values change). Mismatched tempcos cause gain drift.

### Thermal Tails

After a transient event (a burst of signal, a load change), the circuit's thermal state changes. Components that heated up during the event cool slowly, causing a gradual drift back to the original operating point. This appears as a slow tail on an otherwise fast transient response.

### Intermittent Failures

The worst kind of temperature-related problem. The circuit works at room temperature, fails at 50 C, works again when it cools down. The failure might be a bias point crossing a region boundary, a reference drifting past a threshold, or a marginal component becoming out of spec.

## Designing Against Drift

### Matched Components

When gain or output depends on a ratio of components (like a voltage divider), use components with matched tempcos. If both resistors in a divider have the same tempco, the ratio stays constant even as individual values change.

In IC design, matched transistor pairs on the same die track each other thermally. This is why differential pairs and current mirrors work so well in ICs — the matching rejects common-mode temperature drift.

### Feedback

Negative feedback reduces sensitivity to component variations. An op-amp circuit with gain set by feedback resistors depends on the resistor ratio, not on the op-amp's gain. The op-amp's gain can change significantly with temperature without affecting the circuit — as long as the loop gain remains high enough.

### Thermal Coupling

If two components need to track each other, put them physically close together on the board so they experience the same temperature. In critical cases, mount them on the same thermal mass or in the same package.

### Chopper Stabilization

For ultra-low-drift applications, chopper-stabilized amplifiers modulate the signal to high frequency, amplify it (where drift is irrelevant), and demodulate. This eliminates DC offset drift at the cost of complexity and bandwidth.

## Gotchas

- **Self-heating** — A component dissipating power heats itself. This changes its own parameters, which changes the power dissipation, which changes the temperature. This feedback loop can stabilize (negative thermal feedback) or run away (positive thermal feedback). BJTs are particularly susceptible to thermal runaway because higher temperature means more current at the same V_BE
- **Thermal gradients** — A single warm component creates a temperature gradient across the PCB. Nearby components see different temperatures depending on their position. A precision circuit with one side closer to a hot regulator drifts asymmetrically
- **The warm-up problem** — You can't avoid the fact that components change from cold to warm. The question is whether your design tolerates the change or relies on exact values. Feedback-based designs tolerate it; open-loop designs don't
- **Temperature cycling fatigue** — Repeated heating and cooling mechanically stresses solder joints and component bodies. This is a reliability issue separate from electrical drift, but it's caused by the same thermal variations
