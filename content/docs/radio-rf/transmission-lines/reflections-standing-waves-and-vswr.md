---
title: "Reflections, Standing Waves & VSWR"
weight: 40
---

# Reflections, Standing Waves & VSWR

When a wave traveling down a transmission line encounters a change in impedance, part of the wave's energy continues forward and part reflects back toward the source. This is the single most important phenomenon in transmission line engineering. It determines signal quality, power delivery, and system performance. Everything in RF matching, termination, and system design exists to manage or eliminate reflections.

## Why Reflections Happen

A wave propagating on a transmission line with characteristic impedance Z0 has a fixed ratio of voltage to current. When the wave reaches a load with impedance Z_L that differs from Z0, the boundary conditions at the junction cannot be satisfied by the incident wave alone — the voltage-to-current ratio demanded by the load does not match what the line delivers. Nature resolves this by generating a reflected wave that, when added to the incident wave, satisfies the load's requirements.

The reflection coefficient, Gamma, quantifies how much of the wave reflects:

**Gamma = (Z_L - Z0) / (Z_L + Z0)**

Gamma ranges from -1 to +1:
- **Gamma = 0:** Z_L = Z0 (matched load). No reflection. All energy is absorbed by the load.
- **Gamma = +1:** Z_L = infinity (open circuit). Total reflection, same polarity. The reflected wave adds to the incident wave, doubling the voltage at the open end.
- **Gamma = -1:** Z_L = 0 (short circuit). Total reflection, inverted. The reflected wave cancels the voltage at the short, producing zero volts.
- **|Gamma| between 0 and 1:** Partial reflection. Some energy is absorbed, some returns.

| Z_L (with Z0 = 50 ohm) | Gamma | Interpretation |
|------------------------|-------|---------------|
| 50 ohm | 0 | Perfect match |
| 75 ohm | +0.20 | Moderate mismatch |
| 100 ohm | +0.33 | Significant mismatch |
| 150 ohm | +0.50 | Half the voltage reflects |
| Open circuit | +1.0 | Total reflection |
| 25 ohm | -0.33 | Significant mismatch (inverted reflection) |
| Short circuit | -1.0 | Total reflection (inverted) |

## Standing Waves

When a continuous-wave (CW) signal is applied to a mismatched line, the forward and reflected waves coexist on the line and interfere with each other. The result is a standing wave — a pattern of voltage maxima (antinodes) and minima (nodes) that are fixed in space along the line.

At voltage maxima, the forward and reflected waves add constructively: V_max = V_forward x (1 + |Gamma|). At voltage minima, they add destructively: V_min = V_forward x (1 - |Gamma|).

The distance between adjacent maxima (or minima) is half a wavelength. The distance between a maximum and the nearest minimum is a quarter wavelength.

Standing waves are not just mathematical abstractions — they create real physical effects:

**Voltage stress.** V_max can be significantly higher than the source voltage. With an open-circuited line (Gamma = +1), the voltage at the end doubles. In high-power systems, this can exceed the voltage rating of connectors, cables, or components, causing arcing or dielectric breakdown.

**Current stress.** Current maxima are at voltage minima and vice versa. In a short-circuited line, current at the short can be twice the forward current. High-power mismatches can overheat conductors at current maxima.

**Power delivery reduction.** With standing waves, the source cannot deliver full power to the load. The power actually absorbed by the load is:

P_load = P_forward x (1 - |Gamma|^2)

A reflection coefficient of 0.33 (VSWR 2:1) means about 11% of the forward power is reflected, and 89% reaches the load. A reflection coefficient of 0.5 (VSWR 3:1) means 25% is reflected.

## VSWR: Voltage Standing Wave Ratio

VSWR is the ratio of the maximum voltage to the minimum voltage on the standing wave pattern:

**VSWR = V_max / V_min = (1 + |Gamma|) / (1 - |Gamma|)**

VSWR is always greater than or equal to 1:1. A perfect match gives VSWR = 1:1 (no variation in voltage along the line). Greater mismatch gives higher VSWR.

| VSWR | |Gamma| | Reflected power | Return loss (dB) | Practical meaning |
|------|---------|----------------|-----------------|-------------------|
| 1.0:1 | 0.00 | 0% | infinite | Perfect match (theoretical) |
| 1.2:1 | 0.09 | 0.8% | 20.8 dB | Excellent — typical spec for good RF components |
| 1.5:1 | 0.20 | 4.0% | 14.0 dB | Good — common specification for antennas |
| 2.0:1 | 0.33 | 11.1% | 9.5 dB | Acceptable for many systems |
| 3.0:1 | 0.50 | 25.0% | 6.0 dB | Poor — significant power loss and stress |
| 5.0:1 | 0.67 | 44.4% | 3.5 dB | Bad — nearly half the power reflects |
| 10.0:1 | 0.82 | 67.0% | 1.7 dB | Severe — approaching open/short |
| infinity | 1.00 | 100% | 0 dB | Complete reflection (open or short) |

## Return Loss

Return loss expresses the reflected power in decibels:

**Return loss (dB) = -20 x log10(|Gamma|)**

Higher return loss means less reflection (better match). A return loss of 20 dB means only 1% of the power reflects. A return loss of 10 dB means 10% reflects.

Return loss is often the preferred specification in professional RF work because it is expressed in dB (additive, easy to work with in cascade analysis) and directly relates to the power reflected. Most RF data sheets specify input and output return loss rather than VSWR.

Relationship summary: VSWR, Gamma, return loss, and reflected power all describe the same physical reality — how much of the wave reflects at an impedance boundary. You will encounter all four representations and need to convert between them fluently.

## What Happens in Time

For a single pulse or step edge (rather than a continuous wave), reflections appear as distinct echoes in the time domain:

1. The source launches a step into the line
2. The step propagates to the end of the line at the propagation velocity
3. At the mismatch, a reflected step is generated (amplitude = Gamma x incident amplitude)
4. The reflected step propagates back to the source
5. If the source is also mismatched, the reflected step re-reflects

The round-trip time is 2L/v, where L is the line length and v is the propagation velocity. On a 15 cm PCB trace (v approximately 1.7 x 10^8 m/s for FR4 microstrip), the round trip is about 1.8 ns. On a 1-meter coax cable (v approximately 2 x 10^8 m/s), it is about 10 ns.

On digital signals, these reflections appear as ringing — the signal overshoots, undershoots, and oscillates around the final value. The ringing frequency is determined by the round-trip time. For a 15 cm unterminated trace, ringing occurs at about 560 MHz (1 / 1.8 ns). If this frequency is near the bandwidth of the receiver, it can cause false triggering or data errors.

## Multiple Reflections and Cascade Effects

In a real system, there are multiple impedance transitions: source to cable, cable to connector, connector to PCB trace, trace to via, via to component pad, pad to component input. Each transition produces a reflection. The reflections interact — they can add constructively or destructively depending on the spacing between them (which is frequency-dependent).

This is why RF system performance varies with frequency. At some frequencies, the reflections from multiple discontinuities cancel, and the system performs well. At other frequencies, they add, and performance degrades. This creates a rippled frequency response that is characteristic of impedance-mismatched systems.

Network analyzers sweep frequency specifically to reveal these patterns. The [S-parameter]({{< relref "/docs/radio-rf/transmission-lines/measuring-lines" >}}) S11 measures the composite reflection from all discontinuities as seen from the input port.

## Practical Thresholds

Different applications tolerate different levels of mismatch:

| Application | Typical VSWR spec | Return loss |
|-------------|-------------------|-------------|
| Precision measurement (VNA cal standards) | < 1.05:1 | > 32 dB |
| RF amplifier input/output | < 1.5:1 | > 14 dB |
| Antenna (operating bandwidth) | < 2.0:1 | > 10 dB |
| Cable TV drop | < 1.5:1 | > 14 dB |
| High-speed digital (DDR4, PCIe) | < 1.3:1 at Nyquist | > 18 dB |
| Amateur radio (typical goal) | < 2.0:1 | > 10 dB |
| Transmitter into mismatched antenna (protection limit) | 3.0:1 | > 6 dB |

Most RF transmitters include protection circuits that reduce power or shut down when VSWR exceeds a threshold (often 3:1) to prevent damage from reflected power heating the output stage.

## Gotchas

- **VSWR does not tell you where the mismatch is** — VSWR measured at the source is a composite of all reflections in the system. A single VSWR measurement cannot distinguish between a mismatched load, a bad connector, or a damaged cable. Use TDR to localize impedance discontinuities.
- **A matched line with loss also shows low VSWR** — A 50 ohm load on a lossy cable may show an excellent VSWR at the source even if the load is mismatched, because the reflected wave is attenuated twice (once going out, once coming back). This masks problems. Measure at the load end if possible.
- **Reflected power goes somewhere** — In a transmitter, reflected power returns to the output stage. If the output stage cannot absorb it, it heats up or is re-reflected. Continuous operation into a severe mismatch can destroy the transmitter's final amplifier.
- **VSWR varies with frequency** — An antenna that is 1.5:1 at 915 MHz may be 3:1 at 930 MHz. Always check VSWR across the entire operating bandwidth, not just at the center frequency.
- **Multiple cascaded mismatches can cancel or compound** — Two mismatches spaced lambda/4 apart may cancel at one frequency but compound at twice that frequency. This creates frequency-dependent ripple in insertion loss and return loss.
- **Digital ringing is a reflection problem** — If a digital signal overshoots and rings, it is because of impedance mismatch and unterminated transmission lines, not because of "bad signal quality." Proper termination eliminates ringing.
