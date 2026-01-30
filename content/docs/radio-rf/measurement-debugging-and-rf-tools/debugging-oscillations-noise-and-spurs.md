---
title: "Debugging Oscillations, Noise & Spurs"
weight: 60
---

# Debugging Oscillations, Noise & Spurs

Unwanted oscillations, spurious emissions, and elevated noise floors are among the most common and most frustrating RF problems. They're insidious because they can appear intermittently, change with temperature, disappear when you probe the circuit, and emerge from mechanisms that aren't obvious from the schematic. Debugging these problems requires a systematic approach and a willingness to consider physical causes — layout, grounding, coupling — not just circuit-level issues.

## Oscillation: The Uninvited Signal

An oscillation occurs when a circuit with gain develops a feedback path that satisfies the Barkhausen criterion: the loop gain exceeds unity and the total phase shift around the loop equals 360 degrees (or an integer multiple). Every amplifier is a potential oscillator — the only difference between an amplifier and an oscillator is whether the feedback is intentional.

### How to Identify Oscillation

- **Spectrum analyzer**: The most direct method. An oscillating circuit produces a spectral line at the oscillation frequency and usually at harmonics. If the oscillation is strong, you can see it with a near-field probe held over the circuit without making contact.
- **DC bias shift**: An oscillating amplifier's DC operating point often shifts because the transistor is spending time in nonlinear regions. If a transistor's collector current is higher than expected, it might be oscillating.
- **Unexpected heat**: A transistor that's hotter than expected at its DC bias point may be oscillating, dissipating power at the oscillation frequency.
- **Disappears when you probe**: This is a classic sign. The probe capacitance loads the circuit, changing the phase shift and killing the oscillation. You think the circuit is fine because it looks fine on the scope — but the act of measuring suppressed the problem.

### Common Causes

**Inadequate power supply bypassing**: Every amplifier stage needs its own bypass capacitor(s) placed as close as physically possible to the supply pins. Without them, the power rail becomes a feedback path — one stage's output current modulates the supply voltage, which modulates another stage's input. A 100 nF ceramic capacitor at each stage is the minimum. For broadband suppression, use multiple values in parallel: 100 nF + 1 nF + 10 pF covers three decades of frequency.

**Poor ground return**: If two stages share a ground path with significant inductance (a long trace, a via through a multilayer board, or a ground plane slot), the voltage drop across that inductance couples the stages. At RF, even a few nanohenries of shared ground inductance creates coupling.

**Feedback through the power rail**: Even with local bypass capacitors, the impedance of the supply rail between stages is not zero. Ferrite beads in series with the supply to each stage add impedance at RF without affecting DC, effectively isolating the stages.

**Gain at unexpected frequencies**: An amplifier designed for 100 MHz might have significant gain at 500 MHz or 1 GHz — frequencies where the layout provides unintended feedback paths. Stability analysis must consider the amplifier's gain at all frequencies, not just the design frequency.

## Spurs: Unwanted Signals at Specific Frequencies

Spurious emissions (spurs) are discrete signals at frequencies where no signal should exist. Unlike oscillations, spurs are typically caused by nonlinear mixing of signals that are present in the circuit.

Common spur mechanisms:

- **Harmonics**: Any nonlinear element (amplifier, mixer, diode) generates harmonics of its input signal. A 100 MHz signal through an amplifier produces energy at 200, 300, 400 MHz, etc. The second harmonic is typically the strongest, often 20-30 dB below the fundamental in a reasonably linear amplifier. More nonlinear circuits (like mixers) produce harmonics 10-15 dB down.

- **Intermodulation products**: When two signals at frequencies f1 and f2 pass through a nonlinear element, mixing products appear at f1 ± f2, 2f1 ± f2, f1 ± 2f2, and higher orders. The third-order products (2f1 - f2 and 2f2 - f1) are particularly troublesome because they fall close to the original signals and can't be filtered out easily.

- **Oscillator leakage**: In a superheterodyne system, the local oscillator signal can leak to the output through board-level coupling, inadequate isolation, or power supply coupling. A -40 dBc LO spur is common in simple designs without careful shielding.

- **Clock harmonics**: Digital clocks (microcontrollers, ADCs, PLLs) produce harmonics at every integer multiple of the clock frequency. A 25 MHz clock has harmonics at 50, 75, 100, 125 MHz — potentially landing on an RF signal of interest.

### Identifying Spurs

When you see an unexpected spectral line, determine whether it's a harmonic, mixing product, or independent oscillation:

1. **Change the input frequency slightly**: If the spur moves with the input, it's related (harmonic or mixing product). If it stays fixed, it's independent (oscillation or clock harmonic).
2. **Check the frequency relationship**: If the spur is at exactly 2x or 3x the fundamental, it's a harmonic. If it's at f1 + f2 or 2f1 - f2, it's an intermodulation product.
3. **Remove the input signal**: If the spur remains, it's generated internally — an oscillation or a leaking reference.

## Noise Floor Elevation

A raised noise floor means something is adding broadband energy to the signal. This can be:

- **Low-level oscillation**: An amplifier oscillating at a frequency outside the measurement span can generate broadband noise through intermodulation. The oscillation itself might not be visible if it's above the spectrum analyzer's range, but its noise products appear within the measurement band.
- **Switching power supply noise**: Switch-mode regulators generate noise at the switching frequency and its harmonics, spreading into broadband noise through parasitic coupling. A boost converter switching at 1 MHz creates spurs at 1, 2, 3... MHz and potentially raises the noise floor across the HF band. See [RF Mistakes & Postmortems]({{< relref "/docs/radio-rf/practical-rf-projects/rf-mistakes-and-postmortems" >}}) for a case study.
- **Thermal noise from lossy components**: A resistor in the signal path adds thermal noise. At room temperature, a 50-ohm resistor contributes -174 dBm/Hz noise power density. A lossy connector, corroded trace, or poorly soldered joint can act as a noisy resistor.
- **Amplifier noise figure**: Every amplifier adds noise. If the first amplifier in a chain has a high noise figure (say 6 dB instead of 1 dB), the entire system's noise floor rises by 5 dB. Early-stage noise contribution dominates in cascaded systems.

## Systematic Debugging Approach

When facing an oscillation, spur, or noise problem, resist the urge to randomly change components. Follow a systematic procedure:

1. **Characterize the problem**: Use a spectrum analyzer to measure the frequency, amplitude, and bandwidth of the unwanted signal. Record it. Note whether it's stable, drifting, or intermittent.

2. **Check DC bias points**: Measure the DC voltages at every transistor or amplifier. Compare to the expected values from the schematic. A bias shift is a strong indicator of oscillation.

3. **Isolate sections**: If the circuit has multiple stages, disconnect them one at a time (or add high-value series resistors to break the RF path while preserving DC). This localizes the problem to a specific stage.

4. **Probe the power rails**: Use a spectrum analyzer or oscilloscope to look at the power supply at each stage. Switching noise, oscillation feedback, and coupling all appear on the power rail.

5. **Modify bypassing**: Add capacitors (100 nF, 1 nF, 10 pF) close to the supply pins of the suspect stage. If the problem changes, you've found a supply coupling issue.

6. **Add isolation**: Ferrite beads (600 ohm at 100 MHz is a common value) in series with the supply rail to each stage. Series resistors (10-47 ohms) at amplifier outputs to reduce gain at frequencies outside the design band.

7. **Inspect the layout**: Look for traces that run parallel for long distances (coupling), ground plane slots or gaps (impedance discontinuities), and inadequate via stitching around RF sections.

## Fixing Common Problems

- **Ferrite beads on supply rails**: A ferrite bead in series with VCC to each active stage adds impedance at RF (hundreds of ohms) while passing DC with minimal resistance (typically 0.1-0.5 ohms). This isolates stages from each other through the power supply.

- **RC snubbers on amplifier outputs**: A series RC (10 ohm + 100 pF is a starting point) from the output to ground attenuates high-frequency gain without significantly affecting the in-band signal. This is a common fix for operational amplifier oscillation and also works for RF amplifiers.

- **Layout changes**: Sometimes the only fix is a board respin. Moving a trace, adding ground vias, widening a ground plane connection, or adding shielding walls between stages can eliminate coupling that no component change can fix.

- **Shielding**: A metal shield (soldered can or adhesive shield) over an oscillating stage can reduce radiation and coupling to other sections. The shield must be grounded on all sides with multiple connections to the ground plane.

## When to Suspect the Layout vs the Schematic

If the circuit simulates correctly but oscillates on the board, the problem is almost certainly layout or construction, not the schematic. Simulation doesn't model:

- Parasitic inductance of traces and vias (typically 0.5-1 nH per mm of trace, 0.1-0.5 nH per via)
- Coupling between adjacent traces (depends on spacing, parallel length, and dielectric)
- Ground plane impedance and resonance
- Component lead inductance and parasitic capacitance
- Connector and cable effects

When the schematic is proven (by simulation or previous builds) but the board doesn't work, the investigation must focus on the physical implementation.

## Gotchas

- **Oscillation that disappears when probing** — This is real — the probe capacitance suppresses the oscillation. Try near-field probing instead, or observe the spectrum analyzer while not touching the board.
- **Temperature-dependent oscillation** — An amplifier that's stable at room temperature may oscillate when warm because transistor gain increases at higher temperatures (for BJTs) or device parasitics shift. Test across the expected temperature range.
- **Spur hunting at the wrong frequency** — If your spectrum analyzer span is too narrow, you'll miss spurs outside the visible range. Start with a wide span (full range of the analyzer) before zooming in.
- **Confusing the fix with the problem** — Adding a ferrite bead that shifts an oscillation from 800 MHz to 1.2 GHz hasn't fixed anything — it's moved the problem. Verify that the oscillation is gone, not just moved.
- **Intermittent oscillation from mechanical stress** — Board flex, connector pressure, or thermal cycling can change parasitic capacitance enough to trigger or suppress an oscillation. If a problem comes and goes with handling, suspect a mechanical interaction.
