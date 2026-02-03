---
title: "Does It Match the Expected Waveform?"
weight: 20
---

# Does It Match the Expected Waveform?

The signal is present — now does it look right? Comparing the actual waveform to what the datasheet, schematic, or simulation predicts. The differences between "expected" and "actual" are where the debugging information lives.

## Waveform Comparison

Set up the scope to display the signal cleanly with stable trigger and appropriate vertical and horizontal scale. Use automatic measurements (Vpp, frequency, duty cycle, rise time) to get numbers, then compare each parameter to the expected value from the schematic, datasheet, or simulation.

Key parameters to check:

| Parameter | How to check | Compare to |
|-----------|-------------|------------|
| Amplitude (peak-to-peak) | Cursor measurement or auto-measure | Datasheet spec, schematic annotation, simulation |
| DC offset | DC-coupled measurement, read DC level | Expected bias point (e.g., Vcc/2 for AC-coupled amplifier stages) |
| Frequency / period | Period measurement or frequency counter | Clock spec, oscillator datasheet, RC time constant calculation |
| Waveshape | Visual comparison | Sine, square, triangle, sawtooth, pulse — does it match expected type? |
| Duty cycle | Pulse-width measurement or duty cycle auto-measure | 50% for symmetric clocks, specific ratio for PWM |
| Symmetry | Compare positive and negative half-cycles | Push-pull stages should be symmetric; asymmetry suggests bias or matching problems |

## Reference Waveform Comparison

When a working unit and a failing unit are available, or a saved "golden" waveform exists, capture the waveform from the known-good circuit and save it as a reference trace. Display both on screen — the live trace and the reference — and look for differences in amplitude, timing, waveshape, and noise.

This reveals exactly how the suspect unit differs from a known-good one, including subtle differences that are hard to spot without direct comparison: slight frequency shift, marginally reduced amplitude, different ringing pattern.

## Comparing to Simulation

When no known-good reference exists, simulate the circuit in SPICE with realistic component values. Note the expected waveform parameters: amplitude, frequency, DC bias, waveshape. Measure the actual circuit and compare — differences indicate either a circuit fault or a simulation that doesn't match reality.

## Tips

- Use the scope's automatic measurements for quick parameter checks, but sanity-check against what's visible — auto-measurements can be wrong on noisy or complex signals
- Make sure probe compensation is correct before comparing waveforms — an uncompensated probe changes the apparent waveshape
- DC offset measurement requires DC coupling — AC coupling loses the offset information entirely

## Caveats

- Auto-measurements can be misleading on noisy or complex signals — the scope may measure the wrong edges, trigger on noise, or include ringing in the amplitude measurement
- Test conditions must be identical when comparing units: same input signal, same load, same supply voltage, same temperature
- Component tolerances mean two "good" units won't be identical — know the expected variation before declaring a difference a fault
- Reference waveforms captured at different scope settings (different sample rate, bandwidth limit) aren't directly comparable
- Simulations use ideal models unless parasitics are explicitly included — stray capacitance, trace inductance, ESR, and leakage affect the real circuit but not the simulation
- Simulations don't include probe loading — if the probe changes circuit behavior, the measurement won't match the simulation even if the circuit is perfect

## Bench Relevance

- Amplitude lower than expected suggests gain issue, loading, or component out of tolerance
- Frequency off from expected suggests timing/component value issue — check R and C values in oscillator circuits
- Wrong waveshape suggests the circuit topology isn't doing what's expected — square wave from what should be a sine oscillator indicates clipping or wrong circuit type
- Asymmetric waveform on a push-pull stage indicates bias problem or mismatched components
- Duty cycle off from 50% on a symmetric clock suggests timing component imbalance or loading on one edge
