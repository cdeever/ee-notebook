---
title: "What's the Actual Bandwidth Here?"
weight: 40
---

# What's the Actual Bandwidth Here?

Measuring the real bandwidth of amplifiers, filters, and signal paths — not what the datasheet claims, but what the built circuit actually delivers. Bandwidth changes with component tolerances, parasitic capacitance, loading, and layout. The datasheet says 10 MHz; the board says maybe.

## Swept Frequency Response

Connect a function generator to the circuit input and scope CH1 to the input, CH2 to the output. Set the generator to a sine wave at a low frequency well within the expected passband. Measure the output amplitude — this is the reference level (0 dB).

Increase the frequency in steps (1×, 2×, 5×, 10× sequence works well: 100 Hz, 200 Hz, 500 Hz, 1 kHz...). At each step, record the output amplitude. Continue until the output has dropped well below the reference (at least -10 dB past the -3 dB point).

The -3 dB frequency is where the output amplitude drops to 70.7% of the reference.

**Gain_dB = 20 × log10(V_out / V_out_ref)**

| Gain relative to passband | dB |
|---------------------------|-----|
| 100% (passband) | 0 dB |
| 70.7% (-3 dB point) | -3 dB |
| 50% | -6 dB |
| 10% | -20 dB |

## Step Response Method

A square wave's sharp edge contains all frequencies. The circuit's bandwidth determines how much of that edge it can pass. The output's rise time is directly related to bandwidth:

**BW ≈ 0.35 / t_rise**

Apply a square wave at a frequency low enough that the output fully settles between edges. Measure the output's 10%-90% rise time. Calculate bandwidth: **BW ≈ 0.35 / t_rise_output**

If the input edge isn't infinitely fast, subtract the input's contribution:

**t_circuit = sqrt(t_out² - t_in²)**

This assumes a single-pole (first-order) rolloff. Higher-order systems have a different relationship — the 0.35 constant changes (0.34–0.45 depending on filter type and order).

## Common Reasons Measured BW Differs from Datasheet

**Measured BW < Datasheet BW:**

| Reason | Bandwidth loss | How to verify |
|--------|---------------|---------------|
| Parasitic capacitance (PCB, socket, wiring) | 10–50% | Calculate expected rolloff from parasitics |
| Output loading (scope probe, cable, downstream circuit) | Varies | Remove load and re-measure |
| Component tolerance (feedback resistors, filter caps) | ±10–20% on BW | Measure actual component values |
| Power supply inadequacy | Can be severe | Check supply for droop under dynamic load |

**Measured BW > Expected:**

| Reason | Concern |
|--------|---------|
| Peaking before rolloff | Marginal stability — resonant peak extends apparent -3 dB frequency |
| Missing filter component | A filter stage that should limit bandwidth isn't working |

## Tips

- Keep the input amplitude constant across the sweep — some generators' amplitude varies with frequency
- Monitor CH1 (input) and adjust as needed, or use the ratio V_out/V_in rather than absolute V_out
- Use short cables and calibrated probes — at high frequencies, cable capacitance and probe loading affect the measurement

## Caveats

- Don't overdrive the circuit at low frequencies then wonder why it clips — set input amplitude so the circuit operates in its linear range at all frequencies
- Source impedance matters — the generator's output impedance forms a divider with the circuit's input impedance
- Step response method assumes single-pole rolloff — overshoot indicates peaking, and the 0.35/t_rise estimate becomes approximate
- Datasheets specify bandwidth under specific conditions (gain setting, load, supply voltage, temperature) — match test conditions before concluding the part is underperforming
- "Gain-bandwidth product" for op-amps means bandwidth depends on closed-loop gain — at gain of 10, bandwidth is 1/10th of the GBW product

## Bench Relevance

- Bandwidth lower than datasheet spec suggests parasitic capacitance, loading, or component tolerance issues
- Bandwidth significantly higher than expected with peaking indicates marginal stability — the system is close to oscillating
- Rolloff slope reveals filter order — first-order = -20 dB/decade, second-order = -40 dB/decade
- Peaks or dips in the passband indicate resonance or impedance mismatch
- Bandwidth that changes with load indicates the circuit is sensitive to output impedance — check if the actual load matches test conditions
