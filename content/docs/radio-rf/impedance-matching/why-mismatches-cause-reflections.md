---
title: "Why Mismatches Cause Reflections"
weight: 20
---

# Why Mismatches Cause Reflections

Reflections at impedance boundaries are one of those things that seem mysterious until you build the right mental model. The short version is: energy has to go somewhere. When a traveling wave hits a boundary where the impedance changes, part of the wave continues into the new medium and part bounces back. This isn't unique to RF — it happens with sound waves hitting walls, light hitting glass, and water waves hitting a shelf in a pool. The physics is the same.

## The Rope Analogy

The clearest mechanical analogy I've found is a wave pulse traveling along a rope. If the rope is tied to a fixed wall (short circuit in electrical terms), the pulse reflects back inverted — same energy, opposite polarity. If the rope end is free (open circuit), the pulse reflects back with the same polarity. If the rope is connected to another rope of different weight (impedance mismatch), part of the pulse continues into the second rope and part reflects back.

A matched termination is like connecting the rope to a dashpot or damper that absorbs all the energy perfectly — no reflection at all. In electrical terms, this is a load impedance equal to the characteristic impedance of the line.

## What Happens Electrically

A transmission line has a characteristic impedance Z0 determined by its geometry and materials. A signal traveling down the line "sees" Z0 at every point — the ratio of voltage to current is constant. When the signal reaches the end of the line and encounters a load impedance Z_L, the boundary conditions must be satisfied: the voltage and current at the junction must be consistent with both the transmission line and the load.

If Z_L = Z0, the load accepts all the power. The voltage-to-current ratio is the same as on the line, so the wave continues smoothly into the load.

If Z_L != Z0, the load can't accept the same voltage-to-current ratio. The only way to satisfy the boundary conditions is for a reflected wave to exist. The reflected wave adjusts the net voltage and current at the boundary so that V/I = Z_L.

The reflection coefficient (gamma) quantifies this:

gamma = (Z_L - Z0) / (Z_L + Z0)

This produces a value between -1 and +1 (or a complex number if Z_L is complex). The magnitude of gamma tells you how much of the incident wave amplitude is reflected.

## The Extreme Cases

| Termination | Z_L | Gamma | Reflection | What Happens |
|---|---|---|---|---|
| Perfect match | Z0 | 0 | None | All power absorbed |
| Open circuit | Infinity | +1 | Total, same polarity | Voltage doubles at the open end |
| Short circuit | 0 | -1 | Total, inverted | Current doubles at the short |
| 2x mismatch | 2*Z0 | +1/3 | 11% power reflected | Most power delivered, some return |
| 10x mismatch | 10*Z0 | +0.82 | 67% power reflected | Most power reflected |

The "2x mismatch" case is instructive. A 100-ohm load on a 50-ohm line reflects only about 11% of the incident power. That's a VSWR of 2:1 and a return loss of about 9.5 dB. Many systems work perfectly fine at this level of mismatch.

## Standing Waves

When a reflected wave travels back along the line and meets the forward-traveling wave, they interfere. The result is a standing wave pattern — fixed positions along the line where the voltage is always high (antinodes) and always low (nodes). The voltage standing wave ratio (VSWR) measures the ratio of the maximum to minimum voltage along the line:

VSWR = (1 + |gamma|) / (1 - |gamma|)

A VSWR of 1:1 means no standing waves (perfect match). A VSWR of infinity means total reflection (open or short). In practice:

| VSWR | Return Loss (dB) | Power Reflected | Power Delivered |
|---|---|---|---|
| 1.0:1 | Infinite | 0% | 100% |
| 1.2:1 | 20.8 | 0.8% | 99.2% |
| 1.5:1 | 14.0 | 4.0% | 96.0% |
| 2.0:1 | 9.5 | 11.1% | 88.9% |
| 3.0:1 | 6.0 | 25.0% | 75.0% |
| 5.0:1 | 3.5 | 44.4% | 55.6% |
| 10:1 | 1.7 | 67.4% | 32.6% |

Return loss is related by: RL (dB) = -20 * log10(|gamma|). Higher return loss means a better match (less power reflected).

## Why Reflections Cause Real Problems

Reflections aren't just a theoretical concern. They cause several practical problems:

**Voltage peaks along the line.** Standing waves mean the voltage at antinodes is higher than the incident wave alone. At VSWR 3:1, the peak voltage is 3 times the minimum. This can exceed the voltage rating of connectors, cables, or components. It's especially dangerous in high-power transmitter systems where the cable might arc over at a voltage peak.

**Increased line loss.** A transmission line with standing waves has higher average current than one carrying only a forward wave. Since loss is proportional to I^2*R, the same power delivery requires more loss in the feedline. The effect is modest at low VSWR but significant at high VSWR on lossy cables.

**Transmitter damage.** Many RF power amplifiers are designed to work into a specific load impedance. Reflected power coming back into the output stage can cause excessive voltage or current in the transistors, leading to overheating or destruction. Many transmitters have SWR protection circuits that reduce power or shut down when VSWR exceeds about 3:1.

**Signal distortion.** In wideband systems, different frequencies experience different amounts of reflection (because the load impedance varies with frequency). This frequency-dependent reflection causes amplitude ripple and group delay variations in the passband — effectively distorting the signal.

**Multiple reflections.** If both the source and load are mismatched, reflections bounce back and forth between them. The signal at the load is the sum of the direct wave plus delayed copies of itself, each attenuated by the round-trip reflection loss. This creates a comb-filter effect, with periodic nulls in the frequency response. In digital systems, this looks like intersymbol interference.

## Connection to Other Metrics

Reflection coefficient, VSWR, and return loss all describe the same physical phenomenon — they're just different ways of expressing it. I find return loss most intuitive for comparing match quality, VSWR most common in amateur radio and antenna work, and reflection coefficient most useful for calculations and Smith chart work. Converting between them is straightforward, and any instrument that measures one can display the others.

Mismatch loss — the power that fails to reach the load due to reflection — is another useful metric: ML (dB) = -10 * log10(1 - |gamma|^2). A VSWR of 2:1 corresponds to about 0.5 dB of mismatch loss, which is often less than the cable loss itself.

## Gotchas

- **Reflections aren't always bad** — Some circuits intentionally use reflections. A stub filter works by creating a deliberate mismatch at certain frequencies. An open or shorted stub is a pure reflector — and that's the point.
- **Low VSWR doesn't mean low loss** — A lossy cable can show low VSWR at the transmitter end because the reflections are attenuated on the round trip. The power is being lost in the cable, not delivered to the antenna. Always measure VSWR at the antenna feedpoint if possible.
- **VSWR is measured on the line, not at a point** — VSWR describes the standing wave pattern along the entire line. An SWR meter at the transmitter sees the mismatch transformed by the cable length and loss, which can be different from the mismatch at the antenna.
- **Short transient signals don't "see" mismatches the same way** — A single pulse shorter than the round-trip time experiences the mismatch as a delayed echo, not as a standing wave. Standing waves are a steady-state phenomenon.
- **A perfect match at one frequency may be terrible at another** — If the load impedance varies with frequency (as most antennas do), the match quality varies too. Always check VSWR across the intended operating bandwidth, not just at center frequency.
- **Return loss and insertion loss are different things** — Return loss measures reflected power. Insertion loss measures power not delivered to the load (including both reflection and dissipation). A lossy matched cable has low return loss but high insertion loss.
