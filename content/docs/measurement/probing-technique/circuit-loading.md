---
title: "Am I Loading the Circuit?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Am I Loading the Circuit?

Every instrument changes the circuit by connecting to it. Every probe has finite impedance and draws current from the node being measured. Most of the time this is negligible — but when it isn't, the reading is accurate for the loaded circuit and wrong for the unloaded one.

## DMM Resistive Loading

A DMM's input impedance (typically 10 MΩ) forms a voltage divider with the source impedance of the node being measured. If the source impedance is much less than 10 MΩ, loading is negligible. If it's comparable, the reading is low.

| Source impedance | Loading error with 10 MΩ DMM | Significance |
|-----------------|-------------------------------|--------------|
| 100 Ω (power rail) | 0.001% | Negligible |
| 10 kΩ (resistive divider) | 0.1% | Rarely matters |
| 1 MΩ (high-Z sensor, feedback divider) | 9.1% | Reading is ~91% of actual |
| 10 MΩ (piezo, pH probe) | 50% | Reading is half of actual |

**Rule of thumb:** Source impedance should be less than 1/10th of the meter's input impedance for < 1% loading error. For a 10 MΩ DMM, that means source Z < 1 MΩ.

## Oscilloscope Loading

A scope probe loads the circuit both resistively (10 MΩ, usually negligible) and capacitively (~15–20 pF including the cable). At DC and low frequencies, resistive loading dominates and is almost always irrelevant. At high frequencies, capacitive loading dominates and can significantly affect fast signals.

The probe capacitance forms a low-pass filter with the source impedance:

**f_corner = 1 / (2π × R_source × C_probe)**

| Source impedance | Probe capacitance | Corner frequency | Effect |
|-----------------|-------------------|-----------------|--------|
| 50 Ω | 15 pF | 212 MHz | Negligible — probe bandwidth is the limit |
| 1 kΩ | 15 pF | 10.6 MHz | Starting to matter for fast digital |
| 10 kΩ | 15 pF | 1.06 MHz | Significant — rolls off above 1 MHz |
| 100 kΩ | 15 pF | 106 kHz | Severe — audio frequencies and above are attenuated |

## Current Measurement Burden Voltage

A DMM measures current by inserting a low-value shunt resistor in series with the circuit. This shunt drops voltage — the "burden voltage" — which reduces the voltage available to the circuit and can change the current being measured.

| Current range | Typical shunt | Burden at full-scale | Significance |
|--------------|--------------|---------------------|--------------|
| 10A | ~10 mΩ | ~100 mV | Usually not significant |
| 400 mA | ~1 Ω | ~400 mV | Depends on supply margin |
| 4 mA | ~100 Ω | ~400 mV | Significant fraction of a 3.3V supply |
| 40 µA | ~10 kΩ | ~400 mV | Large drop — almost certainly affects circuit |

## Tips

- For source impedance < 1/10th of meter input impedance, loading error is < 1%
- When a reading seems low or unstable on a high-impedance node, loading is a likely cause
- Use two meters with different input impedances to check for loading — if they agree, loading isn't a factor; if they disagree, the higher-impedance reading is closer to truth
- For high-impedance nodes at high frequency, use an active probe (sub-pF input capacitance)
- Current clamp probes measure without breaking the circuit and have zero burden voltage
- Note which current range the DMM is on — auto-range can change shunt resistance mid-measurement

## Caveats

- Feedback circuits are sensitive to loading — placing a DMM across a voltage divider that sets a regulator's output can shift the output voltage by changing the divider ratio
- LoZ mode (~3 kΩ) intentionally loads the circuit for ghost voltage rejection but will pull down real high-impedance sources
- Crystal oscillator circuits are notoriously sensitive to probe loading — connecting a 15 pF probe can shift frequency, reduce amplitude, or stop oscillation entirely
- Capacitive loading adds phase shift, which matters in feedback loops — probing a compensation network can change the loop response
- 1x probes have much higher tip capacitance (~100 pF+) than 10x probes (~12–15 pF)
- Auto-range switching changes the shunt resistance, which can cause transient current disturbances in sensitive circuits

## In Practice

- Voltage reading that drops when the meter is connected indicates significant loading — the source impedance is comparable to the meter's input impedance
- Oscillator that stops or shifts frequency when probed indicates capacitive loading is affecting the circuit
- Current reading that seems too low on a low-current range may be caused by burden voltage reducing the supply to the circuit
- A 3.3V circuit drawing 20 µA on the 40 µA range (10 kΩ shunt) loses ~200 mV to burden voltage — the circuit is actually running at 3.1V
- Waveform that looks different on 1x vs 10x probe setting (beyond the amplitude scaling) indicates capacitive loading is filtering high-frequency content
- **A probe that changes the behavior it's measuring** is a signal that the measurement itself is part of the system at this level. Zoom out and infer the behavior indirectly, or change the measurement technique to reduce loading.
- **An intermittent failure that "goes away" when a scope probe is connected** commonly appears when the probe's ground clip provides an alternative ground path or its capacitive load changes a timing relationship — the measurement is modifying a physical-layer condition, indicating that the failure mechanism involves the physical layer (ground impedance, parasitic capacitance, or timing margin), not the functional layer where the symptom appeared.
- **A block whose output changes when a scope probe is connected** reveals a loading violation — the probe impedance is comparable to the block's output impedance, and the composition contract assumed a lighter load.
- **Touching a probe to a node inside a feedback loop and seeing the output shift** indicates that the probe's impedance is loading the loop enough to change its operating point — the subsystem's behavior depends on the inter-block relationships that the probe is altering.
- **Failure disappears when scope probe connected** commonly appears when the probe's ground clip provides an alternative ground path or its capacitive load changes a timing relationship — the measurement is modifying a physical-layer condition.
