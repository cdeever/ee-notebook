---
title: "Is There Jitter, and Where Is It From?"
weight: 50
---

# Is There Jitter, and Where Is It From?

Timing variation on clocks and data signals. A perfect clock has edges at exactly equal intervals — real clocks don't. Jitter is the deviation of edge timing from the ideal, and it comes from noise, power supply variation, crosstalk, and the oscillator itself. Small jitter is normal; excessive jitter causes bit errors, sampling problems, and failed timing margins.

## Understanding Jitter Types

**Period jitter:** Variation in the period of consecutive cycles. If the ideal period is 10 ns and measured periods vary from 9.8 ns to 10.2 ns, period jitter is 0.4 ns peak-to-peak.

**Cycle-to-cycle jitter:** Change in period from one cycle to the next. This captures high-frequency jitter — the kind that changes from edge to edge. Most timing specs for clocks specify cycle-to-cycle jitter.

**Long-term (accumulated) jitter:** How much timing error accumulates over many cycles. This matters for serial data links where the receiver's clock recovery must track data over many bit periods.

**Random vs. deterministic jitter:**

| Type | Source | Behavior | Reducible? |
|------|--------|----------|------------|
| Random (RJ) | Thermal noise, shot noise | Gaussian distribution, unbounded tails | No — fundamental noise floor |
| Deterministic (DJ) | Power supply noise, crosstalk, ISI, duty cycle distortion | Bounded, often periodic or pattern-dependent | Yes — fix the root cause |

## Measuring Jitter

**Persistence method:** Trigger on the rising edge of the clock and enable infinite persistence. Let the display accumulate — edges spread into a "band" showing the jitter distribution. The width of the band at the threshold crossing is the peak-to-peak jitter.

**Statistical measurement method:** Set up the scope to measure period (or frequency) on the signal and enable statistics (mean, standard deviation, min, max). Let the scope accumulate thousands of measurements.
- Period jitter (peak-to-peak) = max - min
- Period jitter (RMS) ≈ standard deviation of the period measurement

## Identifying Jitter Sources

**Power supply noise:** Jitter is correlated with power supply ripple — the oscillator's frequency varies with supply voltage. Trigger the scope on the clock edge, display the power supply on a second channel. If supply noise and jitter are correlated in time, supply noise is the source. Fix with improved decoupling and low-noise regulator.

**Crosstalk:** Jitter appears when a nearby signal switches — the coupling shifts the clock edge timing. Trigger on the interfering signal and observe the clock. The clock edges near the interfering edge shift; those far away don't. Fix with increased spacing and shielding.

**Oscillator phase noise:** Intrinsic jitter from the oscillator itself — thermal noise in the crystal or LC resonator. This is random and irreducible for a given oscillator type. Crystal oscillators have much lower phase noise than RC oscillators.

**Substrate/ground bounce:** In digital ICs, switching activity on other outputs causes supply and ground bounce, which modulates internal delays. Jitter increases with bus activity.

## Tips

- Use infinite persistence to visualize the jitter distribution — where the band is thickest indicates the most probable edge position
- Trigger on the immediately preceding edge to see cycle-to-cycle jitter — triggering on one edge and observing subsequent edges accumulates jitter
- RMS jitter converges with more measurements; peak-to-peak keeps growing — always report measurement count when quoting peak-to-peak

## Caveats

- The scope's own trigger jitter adds to the measurement — most modern scopes have trigger jitter of ~1–5 ps RMS, which matters for sub-100 ps measurements
- Insufficient sample rate broadens the apparent edge and inflates the jitter measurement — time resolution is approximately 1/(sample rate)
- Peak-to-peak jitter keeps growing as more measurements accumulate (because random jitter is unbounded)
- Multiple jitter sources can be present simultaneously — deterministic jitter adds linearly, random jitter adds in RSS
- Temperature changes cause frequency drift, which looks like very low-frequency jitter on short measurements — this is wander, not jitter
- A PLL cleans up input jitter within its loop bandwidth but adds its own jitter (VCO phase noise) outside its loop bandwidth

## Bench Relevance

- Jitter that correlates with power supply ripple indicates supply coupling — improve oscillator decoupling
- Jitter that correlates with nearby signal switching indicates crosstalk — increase spacing or add shielding
- Random, uncorrelated jitter that persists after eliminating external sources is the oscillator's intrinsic phase noise
- Jitter that increases with bus activity indicates substrate or ground bounce
- Jitter specification exceeded indicates potential for bit errors in serial data links or failed timing margins in synchronous systems
