---
title: "Is the Gain Structure Correct Through the Signal Chain?"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Is the Gain Structure Correct Through the Signal Chain?

Level at each stage. Every multi-stage signal chain has a gain structure — the planned signal level at each node from input to output. When it's wrong, clipping occurs in one stage while noise dominates another. Checking gain structure means measuring signal level at each point and confirming enough headroom above and enough distance from the noise floor below.

## What Gain Structure Means

At every stage in the chain, three numbers matter:

| Parameter | What it is | Why it matters |
|-----------|-----------|----------------|
| Signal level | RMS or peak voltage at this node | Must be above noise floor for adequate SNR |
| Headroom | Distance from signal peak to clipping point | Must be positive to avoid clipping |
| Noise floor | Residual noise at this node | Sets minimum useful signal level |

Dynamic range at each stage = headroom + SNR. The overall chain's dynamic range is limited by the weakest stage.

**The gain structure rule:**
- Each stage should receive signal well above its noise floor
- Each stage should have enough headroom for peaks without clipping
- No stage should run "hot" (near clipping) or "cold" (signal barely above noise)

## Stage-by-Stage Level Check

Apply a known test signal at the circuit input (sine wave at standard level). Measure signal amplitude (Vpp or Vrms) at each stage's output: input buffer, each gain stage, filter outputs, final output.

Record actual gain of each stage: **Gain = V_out / V_in** (or in dB: 20 × log10(V_out / V_in))

Compare measured gain to design intent. At each stage, note the clipping point by increasing input until distortion appears.

**Level diagram example:**

```
Input    →  Preamp  →  Filter  →  Power Amp  →  Output
-20 dBV     0 dBV     -3 dBV     +20 dBV       +20 dBV
            (+20 dB)  (-3 dB)    (+23 dB)
```

At each stage note: actual signal level, stage gain, maximum output before clipping, and headroom (clip point − signal peak).

## DMM Quick Level Check

For quick stage-by-stage level check without a scope, apply a known input signal (sine wave at reference frequency and level). Set DMM to AC Volts (true RMS if available). Measure AC voltage at each stage's output.

The DMM shows signal level as RMS voltage — quick identification of stages with no output or unexpected gain.

## Finding Clipping Points

Feed a sine wave into each stage input and watch the output on the scope. Gradually increase input amplitude until the output waveform begins to clip (flat tops/bottoms). Record the output amplitude at onset of clipping — this is the stage's maximum output swing.

Headroom = clip point − nominal signal level.

| Stage type | Typical clip point |
|-----------|-------------------|
| Op-amp (±15V supply) | ±13V (1–2V from rail) |
| Op-amp (single 5V) | ~0.2V to ~4.5V |
| ADC input | Full-scale voltage |

## Tips

- Use the same measurement bandwidth for all stages — noise measurements at different bandwidths aren't comparable
- Measure at a frequency in the flat part of the response for stages with frequency-dependent gain
- Check both headroom and noise margin — either can be the weak link

## Caveats

- In a multi-stage chain, the first stage to clip determines the chain's maximum level — later stages never see their full capability
- Some stages soft-clip (gradual compression) rather than hard-clip — use THD measurement to find distortion onset, not just visual clipping
- ADC clipping is particularly bad — data is lost and can't be recovered
- AC-coupled stages introduce low-frequency rolloff — use test frequency well within passband
- DMM bandwidth limits apply — most are accurate only to a few hundred kHz
- True RMS meters give correct readings on any waveshape; average-responding meters only accurate on sine waves

## In Practice

- Stage with no output indicates open coupling cap, dead device, or no power
- Stage with unexpected gain indicates wrong component value or feedback problem
- First stage clipping before later stages reach capability indicates gain structure imbalance
- Signal level too low at ADC input wastes resolution — increase gain before ADC
- Signal level too high at ADC input causes clipping — reduce gain or add attenuation
