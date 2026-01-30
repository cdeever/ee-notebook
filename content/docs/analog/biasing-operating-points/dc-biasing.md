---
title: "DC Biasing"
weight: 10
---

# DC Biasing

Why does bias exist at all? Because active devices are nonlinear. A transistor's gain, impedance, and linearity all depend on where it sits on its I-V characteristic curve. Biasing is the process of setting that DC operating point — the Q-point — so the device can do useful AC work.

Without proper biasing, an amplifier might clip, distort, draw too much current, or not turn on at all. Biasing is the unglamorous foundation that makes everything else possible.

## Why Bias Exists

Consider a common emitter amplifier. The transistor needs to be in the active region to amplify — V_BE around 0.6-0.7 V, collector current at some target value, and enough V_CE headroom for the signal to swing.

If you just connect a signal source to the base with no DC bias, the transistor is off for the entire negative half of the signal and distorts the positive half. The bias sets the transistor at a point in the middle of its linear range so the signal can swing symmetrically in both directions.

The same principle applies to MOSFETs (V_GS must be above threshold), JFETs (V_GS must be in the right range), and even op-amp circuits (inputs must be within the common-mode range).

## Major Biasing Topologies

### Fixed Bias (Base Resistor Only)

A single resistor from VCC to the base of a BJT.

I_B = (VCC - V_BE) / R_B, and I_C = beta x I_B.

**Problem:** I_C depends directly on beta, which varies 2:1 or more between devices and with temperature. This topology produces wildly inconsistent results. Avoid it for anything that needs to work reliably.

**When it's acceptable:** Quick experiments where you just need the transistor to turn on and don't care about the exact operating point.

### Collector Feedback Bias

A resistor from the collector to the base (instead of from VCC).

If I_C increases, V_C drops (because of the collector resistor), which reduces base current through the feedback resistor, which reduces I_C. This is negative feedback — it stabilizes the operating point.

**Stability:** Better than fixed bias, but still beta-dependent. The feedback reduces sensitivity to beta by a factor related to the voltage gain, but it also reduces the available AC gain.

### Voltage Divider Bias (The Standard)

Two resistors form a voltage divider from VCC to ground, setting V_B. An emitter resistor R_E converts V_B into a stable I_E:

I_E ≈ (V_B - V_BE) / R_E

If the divider is stiff (divider current >> base current), V_B is essentially independent of beta. I_C ≈ I_E (since I_E = I_C + I_B and I_B is small), so the collector current is set by the resistor network, not by beta.

**Design rule of thumb:** Make the divider current at least 10x the expected base current. This ensures V_B varies less than 10% with beta variations.

**This is the workhorse.** The vast majority of discrete BJT amplifier stages use voltage divider bias.

### Current Source Bias

A current source (often a current mirror) directly sets the bias current. The operating point is determined by the current source value, independent of the transistor's beta or V_th.

**This is the IC standard.** In integrated circuits where transistors are cheap and resistors are expensive, current mirrors and current sources set every bias point. Discrete designs sometimes use current sources too, especially when stability is critical.

## MOSFET Biasing

MOSFET biasing follows the same principles but with different details:

- **Gate current is (essentially) zero** — No need to worry about base current loading a divider. But V_th varies significantly between devices and with temperature
- **Self-bias with source resistor** — Similar to BJT voltage divider bias. V_GS = V_G - I_D x R_S. The source resistor provides negative feedback
- **Gate bias from divider** — Works the same as BJT, but since gate current is negligible, the divider can have very high impedance (megaohms)

The main challenge with MOSFET biasing is V_th variation. A MOSFET designed for V_GS = 2.5 V with V_th = 1.5 V has 1 V of overdrive. If V_th varies from 1.0 to 2.0 V across the production range, the overdrive ranges from 0.5 V to 1.5 V — a 3:1 variation in I_D. Feedback (source degeneration or current source biasing) is essential.

## Choosing the Q-Point

The Q-point determines:

- **Available signal swing** — Place the Q-point in the middle of the output voltage range for maximum symmetric swing. If V_CC = 12 V and V_CE(sat) = 0.3 V, centering V_CE at about 6 V gives ±5.7 V of swing
- **Linearity** — The most linear operation is usually near the center of the active region. Moving toward saturation or cutoff increases distortion
- **Power dissipation** — P_Q = V_CE x I_C. Higher bias current means better noise performance and larger g_m, but more heat
- **Noise** — BJT noise is lowest at moderate collector currents (typically hundreds of microamps to a few milliamps). Too low or too high increases noise

## Gotchas

- **V_BE is temperature-dependent** — About -2 mV/C. A 50 C temperature rise shifts V_BE by 100 mV. Without feedback (emitter degeneration), this causes significant bias drift
- **Bias and signal interact** — Large signals can push the transistor out of the active region momentarily (clipping). The bias point must have enough headroom for the expected signal amplitude
- **Decoupling the bias network** — If the bias resistors are not properly bypassed, power supply noise modulates the bias point, adding noise to the signal
- **Start-up conditions** — Some bias circuits have multiple stable states. At power-on, the circuit might settle at the wrong operating point. This is especially a problem in differential pairs and current mirrors with feedback
