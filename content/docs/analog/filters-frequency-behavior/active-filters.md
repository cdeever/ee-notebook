---
title: "Active Filters"
weight: 20
---

# Active Filters

Op-amp-based filter designs that overcome the limitations of passive RC filters: they can provide gain, don't load the source, have low output impedance, and can achieve higher Q and sharper roll-off without inductors. The tradeoff is complexity, power consumption, and new failure modes (op-amp bandwidth, noise, and stability).

## Why Active Filters?

Passive RC filters have fundamental limitations:

- **No gain** — A passive filter can only attenuate. If you need to filter and amplify, you need two circuits
- **Loading** — Cascading passive stages requires impedance management or buffers
- **No inductorless resonance** — Getting a sharp (high-Q) band-pass with only R and C requires active feedback. Passive high-Q requires inductors, which are large, expensive, and have parasitic resistance
- **Limited Q** — Passive RLC filters' Q is limited by component losses (inductor DCR, capacitor ESR)

Active filters solve all of these by using op-amp feedback to synthesize the desired transfer function.

## Common Topologies

### Sallen-Key

The most widely used active filter topology. Uses a single op-amp in a non-inverting configuration with frequency-dependent feedback.

- Provides second-order (two-pole) response per op-amp
- Low component sensitivity for Butterworth (maximally flat) response
- Easy to design — many online calculators and cookbook formulas
- Gain is typically unity or low (the op-amp acts more as a buffer than an amplifier)

**Limitation:** High-Q designs (Q > 5) become sensitive to component tolerances. Small changes in R or C values significantly affect the response shape.

### Multiple Feedback (MFB)

An inverting topology with two feedback paths (one through a resistor, one through a capacitor).

- Also second-order per op-amp
- Inverting (180-degree phase shift)
- Lower sensitivity to op-amp gain-bandwidth than Sallen-Key at higher frequencies
- Better suited for higher-Q designs than Sallen-Key
- More complex design equations

### State Variable

Uses three op-amps to produce simultaneous low-pass, band-pass, and high-pass outputs from the same circuit.

- Second-order per section
- Q and frequency can be adjusted independently
- Low sensitivity to component tolerances
- Higher component count (three op-amps per second-order section)
- The go-to topology when you need tunable Q or frequency

### Biquad

Similar to state variable but with a different feedback structure. Also produces simultaneous outputs with independently adjustable parameters.

## Filter Response Types

The transfer function mathematics determines the shape of the filter response. The most common types:

**Butterworth (Maximally Flat):**
- Flattest possible passband — no ripple
- Monotonic roll-off
- -3 dB at the cutoff frequency
- Moderate phase nonlinearity
- The default choice when you don't have specific requirements

**Chebyshev (Type I):**
- Steeper roll-off than Butterworth for the same order
- Ripple in the passband (you specify how much — 0.5 dB and 1 dB are common)
- Sharper transition band
- Worse phase nonlinearity
- Use when you need a sharper cutoff and can tolerate passband ripple

**Bessel (Maximally Flat Phase):**
- Best phase linearity (preserves waveform shape)
- Slowest roll-off of the three
- Best step response (minimal overshoot and ringing)
- Use for pulse/digital signals where waveform fidelity matters

## Design Process

1. **Define requirements** — Cutoff frequency, roll-off rate (which sets the filter order), passband ripple tolerance, stopband attenuation
2. **Choose response type** — Butterworth for general use, Chebyshev for sharp cutoff, Bessel for pulse fidelity
3. **Choose topology** — Sallen-Key for simplicity, MFB for higher Q, state variable for tunability
4. **Calculate component values** — Use standard design tables (coefficient tables for each response type) and scale for your desired frequency and impedance level
5. **Verify with simulation** — Component tolerances and op-amp limitations can shift the response. Simulate before building
6. **Build and measure** — Compare measured response to design and simulation. Adjust if needed

## Stability and Component Sensitivity

Active filters use positive feedback (indirectly, through the filter's frequency-dependent network) to create resonance. This makes them potentially unstable:

- **High-Q sections are the most sensitive** — A small component change can push Q toward infinity (oscillation) or collapse it (overdamped response). This is why Q > 10 active filters are difficult in practice
- **Op-amp GBW matters** — The op-amp must have enough bandwidth that its gain is still high at the filter's cutoff frequency. A rule of thumb: GBW should be at least 10x the filter's highest cutoff frequency for Sallen-Key, and more for high-Q designs
- **Component matching** — For higher-order filters (cascaded second-order sections), the Q and frequency of each section must be accurate. Use 1% or better resistors and 5% or better capacitors. For critical applications, use 1% capacitors (C0G/NP0)

## Gotchas

- **Op-amp bandwidth limits the filter** — Above the op-amp's useful bandwidth, the filter response deviates from the design. The filter may even have gain peaks at frequencies where the op-amp's phase shift interacts with the feedback network
- **Noise floor** — Active filters add noise from the op-amp. The noise appears at the output, potentially limiting dynamic range. Low-noise op-amps help, but the fundamental thermal noise of the filter resistors sets a floor
- **Power supply rejection** — Supply noise can couple into the filter output, especially at frequencies near the filter's passband. Good decoupling is essential
- **DC offset** — Op-amp offset voltage appears at the output, potentially amplified by the filter's DC gain. For band-pass and high-pass filters, this is naturally blocked. For low-pass filters, it passes through
- **Capacitor selection matters** — C0G/NP0 capacitors are preferred for active filters because their capacitance doesn't change with voltage, temperature, or time. X7R works for less critical applications but introduces nonlinearity (voltage-dependent capacitance means signal-dependent filter characteristics — a subtle form of distortion)
