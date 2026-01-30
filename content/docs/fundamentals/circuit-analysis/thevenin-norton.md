---
title: "Thevenin & Norton Equivalents"
weight: 40
---

# Thevenin & Norton Equivalents

Any linear circuit, no matter how complex, can be replaced by a simple equivalent as seen from two terminals: a voltage source in series with a resistance (Thevenin) or a current source in parallel with a resistance (Norton). This is one of the most powerful simplification tools in circuit analysis.

## Thevenin Equivalent

From any two terminals, a linear circuit looks like:

- **V_th** — The open-circuit voltage (voltage at the terminals with nothing connected)
- **R_th** — The equivalent resistance seen looking back into the circuit (with all independent sources turned off: voltage sources replaced by short circuits, current sources replaced by open circuits)

The load sees V_th in series with R_th. That's it.

### Finding V_th

1. Remove the load from the two terminals
2. Calculate (or measure) the open-circuit voltage between the terminals
3. That's V_th

### Finding R_th

Method 1 (Source deactivation): Turn off all independent sources. Replace voltage sources with short circuits, current sources with open circuits. Calculate the equivalent resistance seen from the terminals.

Method 2 (Short-circuit current): Find the short-circuit current I_sc at the terminals (wire the terminals together and calculate the current). Then R_th = V_th / I_sc.

Method 3 (Test source): Apply a test voltage V_test at the terminals and calculate the resulting current I_test. Then R_th = V_test / I_test. (This is the standard approach when dependent sources are present, since you can't just "turn them off.")

## Norton Equivalent

Same circuit, different representation:

- **I_n** — The short-circuit current (current between the terminals when shorted)
- **R_n** — Same as R_th (the equivalent resistance is identical)

I_n = V_th / R_th. The two representations are completely interchangeable.

### When to Use Which

- **Thevenin** — When the source is "voltage-like" (stiff voltage, significant source impedance). Power supplies, signal sources, sensor outputs
- **Norton** — When the source is "current-like" (stiff current, high parallel impedance). Current mirrors, photodiodes, some sensor types

In practice, Thevenin is more commonly used because most sources in electronics are voltage sources.

## Bench Usefulness

### Understanding Source-Load Interaction

Once you have the Thevenin equivalent, you can immediately see:

- **Loaded output voltage:** V_out = V_th x R_load / (R_th + R_load)
- **Load current:** I_load = V_th / (R_th + R_load)
- **How much the output drops under load:** The ratio R_th / R_load tells you the regulation. Small ratio = stiff source = small drop

### Maximum Power Transfer

Maximum power to the load occurs when R_load = R_th. The load gets V_th / 2 volts and power = V_th^2 / (4 x R_th).

This is important in RF (50 ohm matching) and audio (impedance matching). It's generally NOT the goal in power delivery, where you want maximum efficiency (R_load >> R_th), not maximum power transfer.

### Output Impedance Measurement

To find the output impedance of a real circuit (amplifier, power supply, etc.):

1. Measure the open-circuit output voltage (no load): V_oc
2. Connect a known load R_load and measure the loaded voltage: V_loaded
3. Calculate: R_out = R_load x (V_oc - V_loaded) / V_loaded

This is the practical, bench-measurable version of finding R_th.

## Linearity Requirement

Thevenin and Norton equivalents only apply to **linear circuits**. The circuit must obey superposition — output is proportional to input, and the effect of multiple sources is the sum of individual effects.

Nonlinear elements (diodes, transistors in large-signal operation, saturated transformers) break linearity. You can still use Thevenin/Norton:

- At a specific operating point (small-signal analysis)
- For the linear portion of a circuit, treating nonlinear elements as separate
- As an approximation when the operating range is small enough to be approximately linear

## Limits of Abstraction

The Thevenin/Norton equivalent captures the DC or single-frequency behavior perfectly. But:

- **Frequency dependence** — Real circuits have impedance that varies with frequency. R_th becomes Z_th(f), and a single number doesn't capture the full picture. At DC or a single frequency, it works. Over a range of frequencies, you need the full impedance vs. frequency characteristic
- **Noise** — R_th generates thermal noise. The equivalent circuit's noise behavior matches the real circuit's only if you include the noise source (V_noise = sqrt(4kTR_th B))
- **Nonlinearity** — As noted above, the equivalent is only valid in the linear operating region
- **Dynamic behavior** — Thevenin gives you the steady-state equivalent. Transient behavior (capacitive and inductive storage elements) requires more than a single R and V

## Gotchas

- **Dependent sources can't be "turned off"** — When finding R_th, only deactivate independent sources. Dependent sources stay active. Use the test-source method instead
- **R_th is not always resistive** — In AC circuits, Z_th can be complex (resistive + reactive). The "resistance" is actually an impedance
- **Negative R_th means instability** — Some active circuits present negative output impedance in certain frequency ranges. This can cause oscillation when connected to certain loads. If your measured R_th comes out negative, investigate stability
- **Don't confuse open-circuit voltage with nominal voltage** — A 9 V battery's V_th is 9 V only when fresh and unloaded. Under load, the terminal voltage drops by I x R_internal. The "9 V" on the label is the nominal (approximately open-circuit) voltage
