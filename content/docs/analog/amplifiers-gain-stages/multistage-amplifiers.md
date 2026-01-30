---
title: "Multistage Amplifiers"
weight: 30
---

# Multistage Amplifiers

When one stage isn't enough. A single transistor stage tops out at maybe 40-50 dB of gain under practical conditions. For more gain, better impedance matching, or wider bandwidth, you cascade multiple stages. The art is in how you connect them — each connection point is a potential source of loading, instability, or signal degradation.

## Why Cascade?

Single-stage limitations that multistage designs solve:

- **More gain** — Two stages of 20 dB each give 40 dB total (gains multiply). Three stages can reach 60 dB. But each stage adds noise and potential instability
- **Impedance transformation** — A high-impedance sensor might need a buffer (follower) before a gain stage, then another buffer to drive a low-impedance load. Each stage handles one impedance transformation
- **Bandwidth extension** — Cascoding (common emitter + common base) extends bandwidth by eliminating the Miller effect. The total gain is comparable to a single common emitter stage, but the bandwidth is much wider
- **Function separation** — First stage provides gain, second stage provides output drive. Each stage is optimized for its function

## Interstage Coupling

How you connect stages determines the frequency response and DC behavior.

### DC Coupling (Direct Coupling)

- No coupling capacitor between stages. The DC operating point of one stage directly sets the input condition of the next
- Advantages: no low-frequency cutoff, can amplify DC signals
- Challenges: DC operating points interact. Offset voltage accumulates. A shift in one stage's bias affects all downstream stages
- Op-amps internally use DC coupling throughout. Discrete multistage DC-coupled designs require careful bias design or DC servo loops

### AC Coupling (Capacitive Coupling)

- A coupling capacitor between stages blocks DC and passes AC
- Advantages: each stage's DC bias is independent. Offset doesn't accumulate
- Challenges: low-frequency cutoff determined by C_coupling x R_input of the next stage. Undersized coupling caps cause loss of low-frequency content
- Standard for audio and many signal-processing applications where DC response isn't needed

### Transformer Coupling

- Used in RF and impedance-matching applications
- Provides galvanic isolation and impedance transformation
- Bandwidth limited by transformer characteristics
- Expensive and bulky compared to RC coupling

## Loading Effects

When you connect the output of one stage to the input of the next, the second stage loads the first. The loaded gain of the first stage is:

A_loaded = A_v x (Z_load / (Z_out + Z_load))

If the next stage's input impedance is comparable to the first stage's output impedance, you lose significant gain. This is why impedance matching between stages matters.

**Solutions:**
- Use an emitter follower (source follower) as a buffer between stages
- Design stages with low output impedance and high input impedance
- Use feedback to reduce output impedance
- In IC design, current source loads provide high impedance without large resistors

## The Cascode

A common emitter (source) stage driving a common base (gate) stage. This is arguably the most important two-transistor combination in analog design.

**What it achieves:**
- Gain comparable to a single common emitter stage
- Much wider bandwidth (common base stage eliminates Miller multiplication of C_cb)
- Much higher output impedance (the output is from the common base collector, which has very high impedance)
- Better isolation between input and output (less feedback through parasitic capacitance)

The cascode is used extensively in op-amp input stages, current mirrors, and RF amplifiers. It's the go-to solution when a single common emitter/source stage doesn't have enough bandwidth or isolation.

## Differential Pairs

Two matched transistors with their emitters (sources) connected to a common current source. The most important circuit in analog IC design.

**What it achieves:**
- Amplifies the difference between two inputs while rejecting common-mode signals
- Natural input stage for op-amps and comparators
- Excellent power supply rejection (common-mode signal)
- Temperature drift of the two transistors tends to cancel if they're matched and thermally coupled

The differential pair is where most of the precision in an analog IC comes from. Matching between the two transistors determines offset voltage, CMRR, and distortion.

## Stability Concerns

Multistage amplifiers are more prone to oscillation than single stages because each stage adds phase shift. At some frequency, the total phase shift reaches 360 degrees (or equivalently, 180 degrees beyond the inversion of a negative feedback loop), and if the gain at that frequency is still above unity, the circuit oscillates.

This is the fundamental stability problem, and it's why:

- Most op-amps are internally compensated (a dominant pole is added to roll off gain before phase shift reaches 180 degrees)
- Externally compensated op-amps require a compensation capacitor chosen for the specific gain configuration
- High-gain discrete multistage amplifiers need careful analysis of the loop gain and phase (see [Stability & Oscillation]({{< relref "/docs/analog/noise-stability-reality/stability-and-oscillation" >}}))

## Gotchas

- **Gain accuracy** — Cascaded gains multiply, but so do gain errors. If each stage has 10% gain error, three stages have 33% total error (1.1^3 = 1.33). For precise overall gain, use feedback around the whole chain, not just within each stage
- **Noise figure degrades with each stage** — The first stage's noise figure dominates the overall noise figure (Friis formula). Make the first stage as low-noise as possible, even if later stages are noisier
- **DC offset accumulates** — In DC-coupled chains, each stage's offset gets amplified by all subsequent stages. A 1 mV offset in the first stage of a 60 dB chain produces 1 V of output offset
- **Bandwidth shrinks** — Cascading identical stages reduces bandwidth. Two identical stages with bandwidth B each give a combined bandwidth of about B x 0.64. Three stages: B x 0.51. This is called bandwidth shrinkage
- **Ground loops between stages** — If stages are on different boards or sections of a board, ground impedance between them can couple signals. This is especially problematic in high-gain chains where millivolts of ground noise become volts at the output
