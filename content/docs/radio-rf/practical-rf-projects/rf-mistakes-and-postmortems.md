---
title: "RF Mistakes & Postmortems"
weight: 30
---

# RF Mistakes & Postmortems

Every RF failure teaches something that success never would. The circuits described here all started with reasonable schematics and good intentions, but each one failed in a way that revealed something important about RF behavior. These aren't hypothetical scenarios — they're the kinds of failures that happen on real benches, and each one leaves you better equipped for the next build.

## The Oscillating Amplifier

**The problem**: A 2-stage common-emitter amplifier designed for 20 dB gain at 150 MHz. On the bench, it oscillated at 430 MHz with an output level higher than the intended signal. The desired 150 MHz signal was present but buried under the parasitic oscillation.

**What happened**: The amplifier had gain at 430 MHz — not by design, but because the transistor (a 2N3904 with an fT of 300 MHz) still had 6-8 dB of gain at 430 MHz. The power supply rail, shared between both stages, provided the feedback path. A 10 cm trace from the voltage regulator to the second stage had an inductance of about 10 nH, which combined with the bypass capacitors' self-resonance to create a high-impedance point at exactly 430 MHz. The first stage's output current modulated the supply voltage, which modulated the second stage's input.

**The fix**: Three changes eliminated the oscillation:
1. A 600-ohm-at-100-MHz ferrite bead in series with each stage's VCC supply
2. A 10-ohm resistor in series with the second stage's base, reducing out-of-band gain
3. A 100 pF capacitor from the second stage's collector to ground, rolling off gain above 200 MHz

**The lesson**: Amplifier stability analysis must consider gain at all frequencies, not just the design frequency. The schematic worked perfectly in SPICE simulation because SPICE doesn't model trace inductance, supply rail impedance, or parasitic coupling. The board layout was the schematic's undoing.

## The Detuned Antenna

**The problem**: A 915 MHz patch antenna, designed and simulated to resonate at 915 MHz with -18 dB return loss, measured at 862 MHz after assembly into a plastic enclosure.

**What happened**: The plastic enclosure (ABS, dielectric constant ~2.8) was 3 mm from the patch antenna surface. The dielectric loading from the plastic slowed the effective wave velocity on the patch, increasing its electrical length. A patch antenna that resonates at 915 MHz in free space resonates at a lower frequency when a dielectric material is nearby — and 53 MHz lower was far more shift than expected.

Additionally, the enclosure had a metal screw insert 15 mm from the antenna edge. This metal acted as a parasitic element, further shifting the resonant frequency and distorting the radiation pattern.

**The fix**: The antenna was redesigned with a shorter patch length (accounting for the dielectric loading of the enclosure). The metal screw insert was moved to 40 mm from the antenna edge. After redesign, the antenna resonated at 917 MHz in the enclosure with -15 dB return loss.

**The lesson**: Always test antennas in their final enclosure. A free-space measurement of an antenna that will be enclosed in plastic is misleading. The enclosure's dielectric constant, distance from the antenna, and any metal components must be included in the design — or at minimum, accounted for by testing in the actual housing. See [Enclosure Effects on RF Systems]({{< relref "/docs/radio-rf/practical-rf-projects/enclosure-effects-on-rf" >}}) for more on this topic.

## The Noisy Power Supply

**The problem**: A sensitive receiver (noise figure ~3 dB) at 145 MHz had an elevated noise floor — 15 dB higher than expected. Replacing the receiver with a known-good unit produced the same elevated noise floor.

**What happened**: The receiver was powered by a buck converter switching at 500 kHz. The buck converter's switching waveform contained harmonics extending well into the VHF range. The 290th harmonic of 500 kHz falls at exactly 145 MHz. Even at -80 dBm, this harmonic was 20 dB above the receiver's noise floor and raised the apparent noise level across the passband.

The coupling path was through the power supply leads into the receiver and through radiated emissions from the buck converter's switching node (which was an unshielded trace on the power supply PCB).

**The fix**: Three measures were needed:
1. An LC pi-filter on the power supply input to the receiver (two 100 nF capacitors with a 10 uH inductor between them) reduced conducted emissions by 40 dB.
2. A shielded enclosure around the buck converter reduced radiated emissions.
3. The buck converter was replaced with an LDO linear regulator for the receiver's final stage, eliminating switching noise entirely for the most sensitive circuit.

**The lesson**: Switching power supplies and sensitive receivers are natural enemies. The harmonic-rich switching waveform can land on any frequency. Calculate whether the switching frequency harmonics overlap your receive band, and if they do, use linear regulation or aggressive filtering. A 15 dB noise floor increase means losing signals that would otherwise be perfectly readable.

## Ground Loop Coupling

**The problem**: A transmitter (output +30 dBm at 433 MHz) and a receiver (sensitivity -110 dBm at 868 MHz) shared a PCB. The receiver showed desensitization — its noise floor rose by 10 dB when the transmitter was active, even though the frequencies were different and the receiver had a bandpass filter.

**What happened**: The ground plane was continuous beneath both circuits, and the transmitter's return current flowed through the ground plane under the receiver. At 433 MHz, the current density in the ground plane was not uniform — it followed the path of least inductance, which meant it concentrated under the transmitter's output trace. But the fringing fields extended into the ground plane region under the receiver's LNA input, coupling transmitter energy directly into the receiver's most sensitive node.

The second mechanism was worse: the transmitter's second harmonic at 866 MHz was only 2 MHz from the receiver's center frequency. The receiver's bandpass filter had only 15 dB rejection at 866 MHz, and the second harmonic power was high enough (-5 dBm at the filter input) that the 15 dB of rejection still left -20 dBm arriving at the LNA — far above the LNA's compression point.

**The fix**:
1. A ground plane slot between the transmitter and receiver sections (with via stitching on both sides) reduced ground-plane coupling by 20 dB.
2. An additional harmonic filter on the transmitter output reduced the second harmonic from -25 dBc to -50 dBc.
3. The receiver's bandpass filter was upgraded to a design with 40 dB rejection at 866 MHz.

**The lesson**: Shared ground planes couple circuits that you think are isolated. At RF, the ground plane is not an equipotential surface — it has impedance, and current flows in patterns determined by the traces above it. Physical separation, ground plane partitioning, and filtering are all necessary when high-power and high-sensitivity circuits coexist.

## The Connector Problem

**The problem**: An antenna cable with SMA connectors showed intermittent high VSWR — sometimes 1.3:1, sometimes 5:1 — with no apparent pattern.

**What happened**: One SMA connector had a center pin that was not fully seated. When the cable was straight, the center pin made contact. When the cable was bent or the connector was slightly rotated, the center pin separated from its mating surface, creating an open circuit at the feedpoint.

The failure was invisible from the outside. The connector looked normal. The nut tightened normally. Only when flexing the cable while watching the VNA display did the VSWR jump reveal itself.

**The fix**: Replaced the connector. Tested by flexing the cable while monitoring VSWR on the NanoVNA — the new connector showed stable VSWR under flex.

**The lesson**: Connectors fail more often than circuits. When measurements are intermittent or irreproducible, suspect the connectors and cables before suspecting the circuit. Flex each cable and wiggle each connector while watching the measurement. A $2 connector can waste hours of debugging time.

## The Ground Plane Slot Antenna

**The problem**: A PCB with a 2.4 GHz radio module showed spurious radiation at unexpected angles and degraded antenna performance compared to the evaluation board.

**What happened**: A routing slot in the ground plane — cut to allow a flex cable to pass through the PCB — created an unintended slot antenna. The slot was approximately 30 mm long, which is close to a half wavelength at 2.4 GHz (62.5 mm half-wave, but the slot's effective length was extended by the surrounding ground plane geometry). The slot radiated efficiently, coupling energy from the 2.4 GHz traces above it into an uncontrolled radiation pattern.

The flex cable passing through the slot acted as a feedpoint, further enhancing the slot's radiation. Energy that should have stayed on the PCB was instead radiated downward through the slot and conducted along the flex cable.

**The fix**: The routing slot was shortened and repositioned away from the RF section. Via stitching around the remaining slot confined the ground plane discontinuity. A shield can over the RF section reduced coupling to the slot.

**The lesson**: Any interruption in a ground plane is a potential slot antenna. Ground plane slots from routing channels, connector cutouts, or split planes can radiate efficiently at frequencies where the slot length is a significant fraction of a wavelength. At 2.4 GHz, even a 15 mm slot has meaningful radiation efficiency. Always evaluate ground plane geometry as part of the RF design, and keep slots away from RF traces.

## What to Check First Next Time

Each failure above points to a general debugging principle. When an RF circuit doesn't work:

1. **Check DC first**: Bias voltages, supply currents, regulator outputs. Half of RF problems present as DC anomalies.
2. **Check connectors and cables**: Flex, wiggle, swap. The cheapest and most common failure mode.
3. **Look for oscillation**: Wide-span spectrum analyzer sweep. Is there energy where there shouldn't be?
4. **Isolate the power supply**: Does the problem change when you switch from a switching supply to a battery or linear regulator?
5. **Test in the final mechanical configuration**: Enclosure, cables, mounting — all affect RF behavior.
6. **Change one thing at a time**: Disciplined debugging reveals causes. Changing three things at once leaves you uncertain which change mattered.

## Gotchas

- **Assuming simulation matches reality** — SPICE and EM simulators model the schematic or layout you gave them, not the board you built. Parasitic effects, component tolerances, and assembly variations are not included unless you explicitly model them.
- **Blaming the wrong component** — An oscillation caused by a supply rail feedback path looks like a transistor problem if you only probe the transistor. Broaden your investigation before replacing parts.
- **Fixing the symptom, not the cause** — Adding an attenuator to reduce a spur is not a fix — it's a mask. The spur is still there, and the attenuator reduces the desired signal too. Find and eliminate the source.
- **Intermittent problems that "go away"** — An intermittent failure that disappears on its own will return. Document the conditions (temperature, cable position, mechanical stress) that triggered it and design a test to reproduce it reliably.
- **Not documenting failures** — Every failure is data. Record what happened, what you measured, and what fixed it. The next time a similar symptom appears, your notes are more valuable than any textbook.
