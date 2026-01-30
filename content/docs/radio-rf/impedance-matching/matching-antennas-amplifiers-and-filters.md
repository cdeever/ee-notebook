---
title: "Matching Antennas, Amplifiers & Filters"
weight: 60
---

# Matching Antennas, Amplifiers & Filters

Textbook matching problems usually start with two known resistive impedances. Real-world matching rarely does. Antennas present complex impedances that change with frequency, weather, and nearby objects. Amplifiers have different input and output impedances, neither purely resistive. Filters expect specific termination impedances to achieve their designed response shape. Each interface in an RF system needs its own match, and the practical challenges differ depending on what you're matching.

## Matching Antennas

An antenna's impedance at the feedpoint is complex: Z_ant = R_ant + jX_ant. The resistive part includes both radiation resistance (power you want to radiate) and loss resistance (power wasted as heat). The reactive part depends on the antenna length relative to a wavelength — electrically short antennas are capacitive, electrically long antennas are inductive, and antennas at resonance have approximately zero reactance.

A half-wave dipole at resonance has an impedance of about 73 + j0 ohms in free space. A quarter-wave monopole over a perfect ground plane is about 36 + j0 ohms. But "in free space" and "over a perfect ground plane" don't exist in practice. Real antennas might present 35 + j22, 120 - j45, or worse, depending on installation.

The matching challenge with antennas is that the impedance varies with frequency. A dipole might be 73 + j0 at 146 MHz, but 90 + j40 at 148 MHz and 60 - j35 at 144 MHz. The matching network needs to provide an acceptable match across the operating bandwidth, not just at center frequency.

**Practical approach:**

1. Measure the antenna impedance with a VNA across the band of interest
2. Plot on a Smith chart to visualize the impedance trajectory
3. Design a matching network for the center frequency
4. Verify that the match stays within specifications across the band (typically VSWR < 2:1)
5. If the bandwidth is insufficient, consider a broader-bandwidth matching approach or redesign the antenna

Environmental factors add another layer. Mounting the antenna near metal structures shifts its resonant frequency. A handheld radio antenna is detuned by the user's hand and body. A vehicle-mounted antenna changes impedance depending on where it's mounted on the vehicle. The matching network must accommodate these variations or be tunable.

## Matching Amplifiers

Amplifier matching is different from antenna matching in several ways. First, the input and output impedances of a transistor are usually different from each other — and different from 50 ohms. A typical RF MOSFET might have an input impedance of 5 - j12 ohms and an output impedance of 8 + j6 ohms at its operating frequency.

Second, the "best" match depends on what you're optimizing. The impedance that maximizes power gain is different from the impedance that minimizes noise figure, which is different from the impedance that maximizes output power. These are characterized on the transistor's datasheet as:

| Parameter | What it optimizes | Typical notation |
|---|---|---|
| S11* (conjugate) | Maximum small-signal gain | Input match for gain |
| Gamma_opt (or Z_opt) | Minimum noise figure | Noise match |
| Load-pull contours | Maximum output power / efficiency | Power match |

For a low-noise amplifier (LNA) at the front end of a receiver, you match the input for minimum noise figure, not maximum gain. This often means accepting a deliberate mismatch at the input — the noise match might correspond to a VSWR of 3:1 or more at the input. A circulator or balanced amplifier topology can be used if you need both noise performance and good input match simultaneously.

For a power amplifier, load-pull measurements tell you the optimal output impedance for maximum power or maximum efficiency. These are usually far from 50 ohms — a typical RF PA transistor might want to see 2 + j1 ohms at its drain for maximum power at 900 MHz. The output matching network has to transform 50 ohms down to this value, which is a large transformation ratio with inherently narrow bandwidth.

**Stability considerations.** A poorly matched amplifier can oscillate. The Rollett stability factor (K) and auxiliary conditions determine whether a transistor is unconditionally stable (won't oscillate with any passive termination) or potentially unstable. If K < 1 at any frequency, certain source and load impedances will cause oscillation. Matching network design must avoid these impedance regions, even at frequencies outside the intended operating band.

## Matching Filters

Filters are designed assuming specific termination impedances — usually 50 ohms at both input and output. If the actual impedance presented to the filter differs from the design impedance, the filter response shape changes: passband ripple increases, stopband rejection degrades, and the cutoff frequency may shift.

This matters especially for bandpass filters, where the response shape is sensitive to termination. A Chebyshev bandpass filter designed for 50-ohm terminations might show 0.5 dB ripple as designed, but 3 dB ripple and a shifted passband if terminated in 75 ohms. The filter doesn't just have worse return loss — its entire transfer function changes.

When cascading a filter with an amplifier, the amplifier's output impedance at the filter's frequency must be close to the filter's design impedance. If it isn't, you need a matching network between them. The matching network itself has frequency-dependent behavior, so it becomes part of the overall filter response — this is one of those places where simulation is much more reliable than back-of-the-envelope calculation.

**SAW and crystal filters** present additional matching challenges. A SAW filter might have an input impedance of 140 + j90 ohms and an output impedance of 350 + j120 ohms, both far from 50 ohms. The matching network is essential for the filter to function correctly. SAW filter datasheets typically include recommended matching circuits, and deviating from these is risky without simulation capability.

## Cascading Matched Stages

In a receiver chain — antenna, bandpass filter, LNA, mixer, IF filter, IF amplifier — each interface between stages needs its own impedance match. The total system gain and noise figure depend on all these matches being correct.

A common approach is to design every interface to be 50 ohms. This makes each stage independently testable: you can connect it to a 50-ohm signal generator and spectrum analyzer and verify its performance. It also means you can swap components without redesigning the entire chain.

However, there are cases where non-50-ohm interfaces make sense. Some integrated receiver ICs specify their input impedance as 200 ohms to directly interface with certain SAW filters. Matching everything through 50 ohms would require two extra matching networks (SAW output to 50 ohms, then 50 ohms to IC input), adding loss and complexity compared to a direct SAW-to-IC match.

## Using a VNA for Matching

A vector network analyzer (VNA) is the essential tool for matching work. It measures both magnitude and phase of the reflection coefficient, giving you the complex impedance at the port under test. With a two-port VNA, you can also measure the transmission through a matching network or filter.

**Practical VNA workflow for antenna matching:**

1. Calibrate the VNA at the cable end (not at the VNA port) using SOL (short-open-load) standards
2. Connect the antenna and measure S11 across the band
3. Display the impedance on a Smith chart
4. Note the impedance at center frequency — this is your matching target
5. Design the matching network (or use the VNA's built-in matching calculator if available)
6. Build the matching network and re-measure
7. Iterate: tweak component values, re-measure, repeat

The NanoVNA and similar low-cost VNAs have made this workflow accessible to hobbyists. While they lack the accuracy of professional instruments, they're more than adequate for antenna matching and simple filter alignment. See [Measuring Antennas Without a Lab]({{< relref "/docs/radio-rf/antennas/measuring-antennas" >}}) for more on practical VNA measurements.

## Gotchas

- **Amplifier matching is not just conjugate matching** — Noise match, gain match, and power match are different impedances. Know which one you need before designing the matching network.
- **Filter response changes with termination impedance** — A mismatched filter doesn't just have poor return loss; its passband shape and stopband rejection change. Always simulate or measure with the actual termination impedances.
- **Antenna impedance depends on the environment** — The 73-ohm textbook dipole impedance assumes free space. A real dipole over real ground, near a mast, with a coax feedline has a different impedance. Measure the actual antenna in its installed location.
- **Cascaded mismatches interact unpredictably** — Two stages, each with moderate mismatch, can create frequency-dependent ripple in the passband due to reflections bouncing between them. The effect depends on the electrical length between them, which changes with frequency.
- **SAW filter matching is not negotiable** — SAW filters are designed for specific complex impedances. Using a SAW filter without its recommended matching network will give wrong passband shape and poor rejection. Follow the datasheet.
- **Stability analysis covers all frequencies, not just the operating band** — An amplifier that's conditionally stable at 500 MHz might oscillate at 2 GHz where the gain is still positive and the matching network presents a wrong impedance. Check stability across the full gain bandwidth.
