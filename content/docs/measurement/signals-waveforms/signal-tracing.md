---
title: "Where in the Chain Does It Go Wrong?"
weight: 30
---

# Where in the Chain Does It Go Wrong?

Stage-by-stage signal tracing. The input looks fine and the output doesn't — so walk through the circuit node by node until the signal breaks. This is the fundamental debugging technique for any multi-stage signal path: audio chains, filter cascades, data pipelines, power conversion stages.

## Stage-by-Stage Tracing

Signal tracing is divide-and-conquer applied to a signal path. Identify the signal chain from input to output (schematic is essential). Probe the input — confirm it's correct. Probe the output — confirm it's wrong. Probe the midpoint of the chain — is it correct or wrong? The fault is between the last correct node and the first wrong node. Continue halving until the faulty stage is isolated.

With two scope channels, watch input and output of each stage simultaneously. CH1 on the input of a stage, CH2 on the output, trigger on CH1. Compare: Is the output the expected transformation of the input?

- Amplifier: output should be a scaled version of the input
- Filter: output should be the input with certain frequencies removed
- Buffer: output should equal input (within loading limits)
- Comparator: output should switch state when input crosses threshold

Move both probes to the next stage and repeat.

## Signal Injection

When no input signal is available or testing one stage in isolation is needed, work backwards. Start at the output stage and inject a known signal at its input. If the output is correct, the output stage is good — move the injection point one stage earlier. Continue working backward until the output stops being correct. The faulty stage is the one that doesn't pass the injected signal correctly.

This reveals each stage's transfer function in isolation — gain, frequency response, distortion — independent from the actual input signal source, which might itself be the problem.

## DC Bias Check

With the circuit powered but no input signal (or with a known DC input), measure DC voltages at key nodes: supply pins of each active device, bias points (transistor base/gate, op-amp inputs), and output DC levels. Compare to schematic expected values or datasheet typical operating conditions.

A stage with wrong DC bias voltages won't process signals correctly — fix the bias first. A transistor with 0V on its collector is saturated or has no power — it can't amplify. An op-amp with both inputs at the same voltage as the negative rail has lost its positive supply.

## Tips

- Use two-channel simultaneous display to see input and output of a stage together — triggering on input ensures timing relationship is visible
- Check DC bias first when troubleshooting — a stage can't process signals correctly if it's not biased in its active region
- For feedback amplifiers, check the feedback path as well as the forward path — a fault in the feedback changes behavior of the entire loop

## Caveats

- Moving probes between stages changes loading — a stage that works with the probe on it may oscillate when the probe is removed (or vice versa)
- AC-coupled stages need time to settle when first probed — wait for the DC blocking capacitor to charge before judging the waveform
- Feedback paths mean a fault in a later stage can manifest as wrong behavior in an earlier stage — if something doesn't make sense, consider whether downstream loading or feedback is pulling the earlier stage off its expected operating point
- Some stages (oscillators, PLLs) don't have an "input" in the signal-chain sense — these need to be checked for correct operation independently
- Match the injected signal to what the stage expects — don't inject 1Vpp into a stage that normally sees 10 mV, which would overdrive it
- DC bias is necessary but not sufficient — a stage can have correct DC bias and still not pass the signal (open coupling capacitor, bad feedback component, oscillation eating up headroom)

## Bench Relevance

- Signal correct at input, wrong at output of a specific stage identifies that stage as the fault location
- Signal amplitude dropping through a stage that should amplify indicates gain problem — check feedback resistors and component values
- Output railed high or low while input varies indicates stage is saturated — check bias and power supply
- Signal fine through a stage with probe connected but wrong when probe removed suggests probe loading is masking an oscillation problem
- DC bias voltages all correct but no signal output suggests an open coupling capacitor between stages
