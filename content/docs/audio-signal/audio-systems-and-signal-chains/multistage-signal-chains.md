---
title: "Multistage Signal Chains"
weight: 30
---

# Multistage Signal Chains

A signal chain is a series of stages — each one transforming the signal in some way — connected input-to-output. Preamp, filter, ADC, DSP, DAC, output amp: each block has well-specified behavior in isolation. But the system's behavior emerges from how the blocks interact: impedance mismatches, noise accumulation, bandwidth limitations, and gain errors compound through the chain. Thinking in terms of the complete chain — not just individual blocks — is essential for diagnosing problems and designing systems that actually achieve their specifications.

## Signal Flow and Level Diagrams

A signal flow diagram maps the path from source to destination, showing each processing stage, its gain (or attenuation), and the signal level at each point. A level diagram adds the noise floor and maximum level at each stage (see [Gain Staging]({{< relref "gain-staging" >}})).

**Drawing the diagram:**

1. List every stage from source to load
2. Note each stage's gain (or loss), input range, output range, and noise floor
3. Calculate the signal level at each point: L_out = L_in + Gain (in dB)
4. Check that the signal stays above the noise floor and below the clipping point at every stage
5. Identify the stage with the tightest margins — that's your limiting stage

**Example: microphone to digital recording**

| Stage | Gain | Signal Level | Noise Floor | Headroom |
|-------|------|-------------|-------------|----------|
| Mic output | — | -50 dBu | -120 dBu | N/A |
| Preamp (40 dB) | +40 dB | -10 dBu | -80 dBu (ref input) | ~14 dB to clip |
| Anti-alias filter | 0 dB | -10 dBu | -78 dBu | ~14 dB |
| ADC (0 dBu = -12 dBFS) | — | -22 dBFS | -118 dBFS (noise) | 22 dB |

The limiting stage here is the preamp — it has only 14 dB of headroom, while the ADC has 22 dB. A loud source could clip the preamp while the ADC still has margin.

## Noise Accumulation: Friis for Signal Chains

The Friis noise formula, originally from RF receiver design, applies to any cascaded amplifier chain:

F_total = F₁ + (F₂ - 1)/G₁ + (F₃ - 1)/(G₁G₂) + …

where F is the noise factor (linear, not dB) and G is the power gain of each stage. The practical takeaways:

- **The first stage dominates** — If G₁ is large, all subsequent noise contributions are divided by G₁ and become negligible
- **A noisy stage after high gain is harmless** — A 20 dB noise figure ADC after a 40 dB gain preamp contributes negligibly to total noise
- **A noisy stage with no preceding gain is catastrophic** — If G₁ = 1 (no gain), the second stage's noise adds directly

**When Friis doesn't apply cleanly:** The formula assumes each stage's noise is independent and that the gain is well-defined. In practice, impedance mismatches, frequency-dependent gain, and correlated noise (ground loops, supply noise) complicate the picture. Friis gives the right intuition but not always the exact answer.

## Impedance Interactions

Each stage has input and output impedance, and these interact at every connection:

**Voltage division at interfaces:** If stage A has output impedance Z_out and stage B has input impedance Z_in, the signal voltage at B's input is:

V_B = V_A × Z_in / (Z_out + Z_in)

For Z_in >> Z_out (bridging), nearly all the voltage transfers. For Z_in ≈ Z_out (matching), half the voltage transfers (but maximum power transfers).

**Bandwidth reduction:** Source impedance and load capacitance form a low-pass filter at every interface. An op-amp output (Z_out ≈ 1 Ω at low frequency but rising with frequency) driving a cable (capacitance 50-100 pF/m) can oscillate if the phase margin is insufficient. Long cables from high-impedance sources roll off high frequencies.

**Reactive loading:** Capacitive loads slow down op-amp outputs and can cause ringing or oscillation. Inductive loads create voltage spikes during switching. Each interface must be analyzed for stability, not just signal level.

## Systematic Problem Diagnosis

When a signal chain doesn't perform as expected, work through it systematically:

**Signal injection:** Feed a known signal at each stage's input and measure the output. Start at the source and work downstream. The first stage that misbehaves is the problem (or the interface before it).

**Signal tracing:** Probe the signal at each stage's output, working from source to load. Watch for level changes, distortion, noise pickup, and frequency response changes that don't match the stage's specifications.

**Divide and conquer:** Split the chain in half. Test each half independently. The half that misbehaves contains the problem — repeat recursively.

**Common system-level problems:**
- **Ground loops** — Current flowing through shared ground paths creates voltage offsets and hum. Look for 50/60 Hz and harmonics. Break the loop with isolation or star grounding
- **Power supply coupling** — Stages sharing a power supply can modulate each other. A power amplifier's current draw modulating a preamp's supply rail causes cross-contamination. Use separate regulators or adequate decoupling
- **Crosstalk** — Signal from one channel couples into another through capacitive or inductive proximity, shared grounds, or multiplexer leakage. Layout and shielding are the primary defenses

## Designing for the Weakest Link

Every chain has a limiting stage. Designing a signal chain means identifying which stage limits performance and improving it — or accepting the limitation and not wasting effort on stages that are already adequate.

**Noise limited:** Improve the first stage (lower noise, more gain). Adding gain later doesn't help — it amplifies the noise equally. See [Microphone & Sensor Preamps]({{< relref "/docs/audio-signal/analog-front-ends/microphone-and-sensor-preamps" >}}).

**Distortion limited:** Find the stage being driven hardest relative to its linear range. Reduce the signal level at that stage, or replace it with a more linear component. Often the limiting stage is an intermediate buffer or filter, not the obvious high-power output stage.

**Bandwidth limited:** Find the stage with the narrowest bandwidth. If it's an op-amp running out of gain-bandwidth product, use a faster op-amp or reduce the gain per stage. If it's a cable, shorten it or buffer more often.

## Gotchas

- **Specifications don't compose simply** — A chain of stages each with 0.01% THD doesn't produce 0.01% THD overall. Distortion products from one stage can be amplified, filtered, or intermodulate with distortion from other stages. Total distortion must be measured end-to-end
- **The best stage is irrelevant** — A signal chain with one excellent stage and one mediocre stage performs like the mediocre stage. Upgrading the already-excellent stage produces no improvement. Identify and fix the bottleneck
- **AC coupling creates cumulative low-frequency rolloff** — Each AC coupling stage (series capacitor) adds a high-pass pole. Three stages each with -3 dB at 10 Hz produce a combined -3 dB at about 17 Hz and steeper rolloff below. Account for all coupling stages in the frequency response
- **Thermal gradients cause drift** — In precision signal chains, temperature differences between stages cause offset drift. Matched component temperatures and thermal isolation from heat sources (regulators, power stages) matter for DC and low-frequency accuracy
- **Test equipment can be the weakest link** — If your oscilloscope or analyzer has worse noise, bandwidth, or distortion than the circuit under test, you're measuring the instrument, not the circuit. Always verify that the test equipment exceeds the DUT's specifications
