---
title: "Single-Transistor Amplifiers"
weight: 10
---

# Single-Transistor Amplifiers

The simplest amplifier is one transistor with a few resistors. Understanding single-transistor stages builds the intuition for everything more complex — op-amp internals, multistage designs, and RF front ends are all combinations of these basic building blocks.

## Common Emitter / Common Source

The workhorse amplifier topology. Input at the base (gate), output at the collector (drain), emitter (source) is common to both.

**What it does:**
- Voltage gain: moderate to high (typically 10-200 without feedback)
- Phase inversion: output is 180 degrees out of phase with input
- Moderate input impedance (set by bias network and r_pi for BJT; very high for MOSFET)
- Moderate to high output impedance (set by R_C or R_D and the device's output resistance)

**The gain equation (BJT):** A_v = -g_m x R_C (simplified, no emitter degeneration)

With emitter degeneration (R_E in the emitter path): A_v ≈ -R_C / R_E. This trades gain for stability — the gain now depends on a resistor ratio instead of g_m, which varies with temperature and bias. This is almost always worth doing.

**The gain equation (MOSFET):** A_v = -g_m x R_D. Same structure, but MOSFET g_m is lower for a given bias current, so voltage gain is typically lower than a BJT stage at the same operating point.

### Why Emitter/Source Degeneration Matters

Without degeneration, gain depends on g_m, which depends on bias current, which depends on temperature, component tolerances, and supply voltage. The gain is high but unpredictable.

With degeneration, gain depends on R_C / R_E — a resistor ratio. Resistors are stable, predictable, and cheap. You trade raw gain for predictability. This is the same principle that makes op-amp circuits work (feedback sets the gain).

## Common Collector (Emitter Follower) / Common Drain (Source Follower)

Input at the base (gate), output at the emitter (source). The collector (drain) is common.

**What it does:**
- Voltage gain: approximately 1 (unity gain buffer)
- No phase inversion
- High input impedance
- Low output impedance (approximately 1/g_m)
- Current gain: high

The emitter follower doesn't amplify voltage — it amplifies current. It transforms a high-impedance source into a low-impedance output. Use it when you need to drive a load without loading the source, or as a buffer between a high-impedance signal and a low-impedance load.

**Output impedance:** Z_out ≈ (R_source / beta) + (1/g_m) for a BJT. At moderate currents, this is tens of ohms — much lower than the source impedance.

## Common Base / Common Gate

Input at the emitter (source), output at the collector (drain). The base (gate) is common (AC grounded).

**What it does:**
- Voltage gain: similar to common emitter
- No phase inversion
- Low input impedance (approximately 1/g_m, typically tens of ohms)
- High output impedance
- Excellent high-frequency performance (no Miller effect)

The common base/gate stage is less common as a standalone amplifier because of its low input impedance. But it's essential in **cascode** configurations (stacked with a common emitter/source stage) to improve gain and bandwidth.

## Input and Output Impedance

Understanding impedance is what separates "this stage amplifies" from "I can actually use this stage in a real circuit."

**Why it matters:**
- If the source impedance is too high relative to the amplifier's input impedance, the signal is attenuated before it even gets amplified (voltage divider effect — see [Voltage Dividers & Loading]({{< relref "/docs/fundamentals/circuit-analysis/voltage-dividers-and-loading" >}}))
- If the load impedance is too low relative to the amplifier's output impedance, the amplified signal is attenuated at the output

**The rule:** Each stage should have input impedance much higher than the source impedance, and output impedance much lower than the load impedance. When this isn't achievable, buffer stages (emitter/source followers) bridge the gap.

## Gain Limits

Every single-transistor stage has a maximum useful gain, limited by:

- **Device output resistance (r_o)** — Even with a large load resistor, gain is limited by r_o in parallel. For BJTs, r_o = V_A / I_C (Early voltage divided by bias current). For MOSFETs, r_o = V_A / I_D (channel-length modulation)
- **Supply voltage headroom** — The output can only swing between the supply rails (minus saturation voltages). Higher gain means the same input swing produces a larger output swing, hitting the rails sooner
- **Bandwidth** — Gain and bandwidth trade off. Higher gain at low frequencies means lower bandwidth (gain-bandwidth product is approximately constant for a given device)
- **Stability** — Very high gain in a single stage with parasitic feedback paths can oscillate

Practical single-stage voltage gains: 10-50 with degeneration, 50-200 without. For higher gain, use multiple stages or an op-amp.

## Gotchas

- **Bias point shifts change everything** — Gain, impedance, linearity, and noise all depend on the DC operating point. A stage that works perfectly at I_C = 1 mA may distort at 100 uA or oscillate at 10 mA
- **Coupling capacitors set the low-frequency cutoff** — AC-coupled stages (capacitor between stages) can't amplify DC. The coupling cap and the input impedance of the next stage form a high-pass filter. Undersized coupling caps cause bass roll-off in audio or tilt on pulse waveforms
- **Bypass capacitor on R_E** — Placing a cap across R_E restores the full (non-degenerated) AC gain while keeping the DC bias stable. This is a common technique, but it makes the gain frequency-dependent and can create peaking or instability if not sized correctly
- **Miller effect** — In common emitter/source stages, the collector/drain-to-base/gate capacitance is amplified by the voltage gain (C_miller = C_cb x (1 + |A_v|)). This limits high-frequency response and is the main reason common emitter/source stages are bandwidth-limited
