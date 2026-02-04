---
title: "Magnetics in Practice"
weight: 32
bookCollapseSection: true
---

# Magnetics in Practice (Inductors & Transformers Beyond the Ideal)

The [Passive Components]({{< relref "../passive-components" >}}) section covers what inductors and transformers are and how they behave in theory. This section covers how they actually behave on the bench — the non-ideal effects that cause circuits to overheat, ring, buzz, saturate, or fail at startup.

Real magnetic components are lossy, nonlinear, and frequency-dependent. Their behavior changes with current level, temperature, and drive waveform in ways that resistors and (most) capacitors don't. If a switching power supply doesn't work, or a transformer runs hot, or an inductor screams on the bench, the answer is usually in this section.

## What This Section Covers

- **[Saturation in Practice]({{< relref "saturation" >}})** — What happens when a core runs out of magnetic headroom, why it depends on current and temperature, and how to see it on the scope.
- **[Winding and Core Losses]({{< relref "winding-and-core-losses" >}})** — DCR, copper loss, hysteresis, eddy currents, and why an inductor gets hot even when "nothing is wrong."
- **[Leakage, Stray Capacitance & Ringing]({{< relref "leakage-and-ringing" >}})** — The parasitics that turn clean switching waveforms into ringing messes, and where they come from.
- **[Audible Noise: Whine, Hum & Buzz]({{< relref "audible-noise" >}})** — Magnetostriction, loose windings, and why power supplies and transformers make audible noise.
- **[Inrush Current & Startup Stress]({{< relref "inrush-current" >}})** — Why magnetics create current spikes at power-on that blow fuses, trip breakers, and stress components.
- **[Selecting Magnetics by Application]({{< relref "selection-guide" >}})** — What specs matter for a buck converter inductor vs. an audio transformer vs. an isolation barrier — and how to read a magnetics datasheet without drowning.

For diagnosing magnetics problems at the bench — scope waveforms, thermal signatures, LCR meter checks, and current-draw patterns — see **[Diagnosing Magnetics on the Bench]({{< relref "/docs/debugging/diagnosing-magnetics" >}})** in the Debugging section.
