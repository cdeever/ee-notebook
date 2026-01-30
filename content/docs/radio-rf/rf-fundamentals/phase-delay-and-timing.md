---
title: "Phase, Delay & Timing in Physical Space"
weight: 20
---

# Phase, Delay & Timing in Physical Space

At DC, the entire circuit settles to its final state essentially instantly. At audio frequencies, propagation delay is so small compared to one cycle that you never think about it. At RF, signals take a measurable fraction of a cycle to travel from one point to another — and that fraction matters. Phase is no longer just a mathematical abstraction from AC circuit analysis; it is a physical reality tied to position along a wave.

## Propagation Is Not Instantaneous

Electromagnetic waves travel at the speed of light in free space: approximately 3 x 10^8 m/s, or equivalently, about 30 cm per nanosecond. That sounds fast, and at low frequencies it is effectively instant. But at 1 GHz, one complete cycle takes 1 nanosecond — meaning a wave travels only 30 cm in one cycle. On a 15 cm PCB trace, the signal at the far end is half a cycle behind the signal at the near end.

This is the core issue: at RF frequencies, the propagation delay through ordinary circuit dimensions becomes a significant fraction of the wave period.

## Propagation Velocity in Different Media

Signals do not always travel at the speed of light. The medium slows them down:

| Medium | Relative velocity (v/c) | Speed (cm/ns) | Typical use |
|--------|------------------------|---------------|-------------|
| Free space / air | 1.00 | 30.0 | Radiated signals, air-core components |
| PTFE (Teflon) coax | 0.69-0.70 | 20.7-21.0 | Low-loss RF cables |
| Polyethylene coax (solid) | 0.66 | 19.8 | RG-58, RG-59, general coax |
| Foam polyethylene coax | 0.80-0.85 | 24.0-25.5 | Low-loss feedlines (LMR-400) |
| FR4 microstrip | 0.55-0.60 | 16.5-18.0 | Standard PCB traces |
| FR4 stripline | 0.47-0.50 | 14.1-15.0 | Inner-layer PCB traces |
| Rogers 4350B microstrip | 0.57 | 17.1 | RF PCB material |

The velocity factor depends on the dielectric constant of the material surrounding the conductor. For microstrip (trace on the surface of a PCB), the wave travels partly in air and partly in the substrate, so the effective dielectric constant is between 1 and the substrate's value. Stripline (trace buried between two ground planes) is fully immersed in the dielectric, so it is slower.

## Phase as Physical Position

A wave is a spatial pattern. At any instant in time, a sine wave has peaks, zeros, and troughs laid out in space along its direction of travel. Phase describes where you are in that pattern.

One complete cycle is 360 degrees. If you are standing at a voltage peak and walk one-quarter wavelength along the transmission line, you reach a zero crossing — that is a 90-degree phase shift. Walk another quarter wavelength, and you reach the negative peak: 180 degrees, fully inverted.

This means two points separated by a physical distance have a fixed phase difference:

**Phase shift (degrees) = 360 x (physical length / wavelength)**

At 1 GHz on FR4 microstrip (wavelength approximately 17 cm), a 4.25 cm trace introduces a 90-degree phase shift. A signal at one end of that trace is at its peak while the other end is passing through zero. They are on the same copper, on the same schematic node — but they have different voltages at the same instant.

## Electrical Length vs Physical Length

Physical length is measured with a ruler. Electrical length is measured in wavelengths or degrees. A trace that is physically 5 cm long has an electrical length that depends on frequency and the propagation velocity:

**Electrical length (degrees) = 360 x f x (physical length / v_p)**

Where v_p is the propagation velocity in the medium.

That same 5 cm trace is:

| Frequency | Electrical length (FR4 microstrip) |
|-----------|-----------------------------------|
| 10 MHz | 1.0 degree |
| 100 MHz | 10 degrees |
| 500 MHz | 51 degrees |
| 1 GHz | 103 degrees |
| 2.4 GHz | 247 degrees |
| 5 GHz | 514 degrees (1.4 wavelengths) |

At 10 MHz, the trace is electrically invisible — less than a degree of phase. At 1 GHz, it is more than a quarter wavelength. At 5 GHz, it is longer than a full wavelength. The physical trace did not change; the electrical reality of that trace is entirely frequency-dependent.

## Why Two Points on a Trace Have Different Voltages

This is the concept that breaks low-frequency intuition most completely. In a lumped circuit, every point on a wire has the same voltage at the same time. That is a fundamental assumption of Kirchhoff's voltage law as taught in introductory circuits.

At RF, it is simply not true. If a 1 GHz signal enters one end of a 7.5 cm trace on FR4 microstrip, the far end of the trace is about 159 degrees of phase behind the near end. When the near end is at positive peak, the far end is at roughly the negative peak. Same wire, same instant, opposite voltages.

This is not a failure or a defect — it is how waves work. The signal is a wave propagating down the trace, and the voltage at any point is determined by the wave's position at that location and time.

This has practical consequences beyond just "the signal is delayed":

**Impedance transformations.** A transmission line transforms impedance as a function of its electrical length. A quarter-wavelength line inverts impedance: a short at one end looks like an open at the other, and vice versa. This is the basis of quarter-wave matching transformers and stub tuning.

**Resonance.** A trace or wire whose length is a half wavelength (or multiple) has voltage maxima and minima at fixed locations. These standing wave patterns create nodes where voltage is always zero and antinodes where it is always maximum. This is not just theory — it affects voltage stress, radiation, and coupling on real boards.

**Timing skew in digital systems.** Parallel data buses at high speed suffer when traces are different lengths, because different bits arrive at slightly different times. A 1 cm length difference on FR4 creates about a 60 ps skew — negligible at 100 MHz, critical at multi-gigabit speeds.

## Delay in Practical Circuits

Some concrete numbers for perspective:

- A 10 cm coax cable (velocity factor 0.66) has a propagation delay of about 0.5 ns. At 1 GHz, that is half a cycle.
- A 5 cm PCB trace on FR4 microstrip has a delay of roughly 0.3 ns. At 2.4 GHz (WiFi), that is 72% of a cycle.
- A 1-meter BNC cable has a delay of about 5 ns. At 100 MHz, that is half a cycle — enough to completely invert a signal.
- The speed of light itself limits how fast signals propagate: across a 30 cm board in free space, the minimum delay is 1 ns. On FR4, it is closer to 1.7 ns.

These delays are built into RF design work. Phase-matched cable assemblies for antenna arrays must be cut to precise lengths. Clock distribution networks on fast digital boards require length matching to within millimeters. Phased array antennas depend on controlling the delay to each element with sub-degree accuracy.

## Gotchas

- **Phase matching means length matching in the same medium** — Two cables cut to the same physical length only have the same delay if they have the same velocity factor. Mixing cable types (or even different batches of the same type) can introduce phase errors.
- **Electrical length changes with frequency** — A trace that is electrically short at 100 MHz may be electrically long at 1 GHz. Every frequency component in a signal sees a different electrical length, which is why broadband RF design is harder than narrowband.
- **Bends and vias add delay** — A right-angle bend or a via through the board adds a small but measurable phase shift. At microwave frequencies, these are included in simulation models. Mitered bends and controlled-impedance vias are standard practice.
- **Temperature changes propagation velocity** — Dielectric constants are temperature-dependent. A cable or board that is phase-matched at room temperature may drift at operating temperature. Critical applications (radar, phased arrays) compensate for this.
- **Do not confuse group delay and phase delay** — Phase delay is how long a single frequency takes to traverse a structure. Group delay is how long a modulated signal's envelope takes. In dispersive media, they differ, and the group delay is usually what matters for signal integrity.
- **Scope probe ground leads add delay and phase shift** — A 15 cm ground clip on an oscilloscope probe at 500 MHz represents about 45 degrees of electrical length. The measurement itself introduces phase error and resonance, which is why spring-ground tips exist.
