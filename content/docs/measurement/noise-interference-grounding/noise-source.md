---
title: "Where Is This Noise Coming From?"
weight: 10
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Where Is This Noise Coming From?

The circuit should be quiet but isn't. There's something on the signal that shouldn't be there — a hum, a buzz, a whine, broadband hash, or periodic spikes. Before fixing noise, identify what's generating it and how it's getting in. This is detective work: observe, hypothesize, test.

## Characterizing the Noise

AC-couple the scope to remove DC and focus on the noise. Set bandwidth limit to 20 MHz to reduce probe-artifact noise (unless high-frequency content is suspected). Set vertical scale to zoom in on the noise — start at 10 mV/div and adjust.

Set timebase based on suspected source:
- 5 ms/div: mains hum (50/60 Hz)
- 1 µs/div: switching converter noise (100 kHz–2 MHz)
- 100 ns/div: digital clock crosstalk (MHz range)

| What appears on scope | Likely source |
|----------------------|--------------|
| Smooth sine wave at 50/60 Hz | Mains magnetic coupling (transformer, ground loop) |
| Sine at 100/120 Hz | Full-wave rectifier ripple — power supply issue |
| Periodic spikes or sawtooth at 100 kHz–2 MHz | Switching converter noise |
| Bursts of ringing at irregular intervals | Digital bus activity coupling |
| Broadband hash, no clear frequency | RF interference, oscillation, or thermal noise |
| Signal correlating with motor speed/load | Motor/drive interference |

## FFT for Frequency Identification

Capture the noisy signal and run FFT with a Hann window. Each peak is a clue:
- 50/60 Hz and harmonics → mains-related
- Frequency matching a switching converter → switching noise
- Frequency matching a clock oscillator → digital crosstalk
- Harmonics of a known signal → distortion from nonlinearity

Compare the FFT of the noisy node to the FFT of the suspected source — if the same frequencies appear, the coupling path is identified.

## Near-Field Probes for Localization

Near-field probes (H-field loop or E-field stub) connected to the scope find which component or trace radiates noise.

**H-field probe (magnetic loop):** Sensitive to current loops — switching transistors, inductors, traces carrying pulsed current.

**E-field probe (short stub):** Sensitive to voltage nodes — high-dV/dt switching nodes, clock traces.

Move the probe slowly across the board while watching the scope. Signal amplitude increases approaching the source. Rotate the H-field probe — it's directional (maximum when perpendicular to current flow).

## Process of Elimination

When the noise is characterized but the coupling path is uncertain:

1. **Turn off suspect sources one at a time.** If noise disappears when powering down the switching converter, the converter is the source
2. **Disconnect cables one at a time.** If noise disappears when unplugging a USB cable, that cable carries or radiates the noise
3. **Move the DUT away from other equipment.** If noise reduces with distance, it's radiated; if distance doesn't help, it's conducted
4. **Shield with grounded copper foil.** If noise drops with foil between source and victim, radiated coupling is confirmed
5. **Add ferrite clamp to cable.** If noise drops, common-mode conducted noise on that cable is the path

## Tips

- Before blaming the circuit, disconnect the probe tip and observe noise with just ground connected — if noise persists, it's pickup into the probe, not from the circuit
- Use spring-tip ground for clean noise measurements
- The FFT shows frequency content, not coupling mechanism — a peak at switching frequency doesn't indicate whether noise is conducted or radiated

## Caveats

- Long ground clips act as antennas and pick up noise
- Turning things off changes circuit operating conditions — a converter that's off isn't producing noise but also isn't providing power
- Multiple coupling paths can exist simultaneously — fixing one may reveal another
- Near-field measurements are qualitative — relative "more here, less there," not calibrated dBm

## In Practice

- Noise at exactly 50/60 Hz indicates mains magnetic coupling — check for ground loops or proximity to transformers
- Noise at 100/120 Hz indicates power supply rectifier ripple — check bulk capacitor ESR
- Noise at switching frequency indicates conducted or radiated coupling from switcher — check decoupling and layout
- Noise correlated with digital bus activity indicates crosstalk — increase spacing or slow edges
- Noise that disappears when moving cables indicates the cable is part of the coupling path
- **Crosstalk that appears only when two subsystems run simultaneously** indicates physical coupling that the schematic treats as nonexistent — the layout made the abstraction false.
- **Noise on an analog measurement that correlates with digital bus activity** often shows up as periodic spikes or step changes coinciding with communication transactions — the digital IC's supply current transients are coupling through the shared power rail into the analog circuit's reference or supply.
- **A block whose output includes oscillation in an amplifier block that isn't supposed to oscillate** is a composition failure, not a component failure. Check the feedback path, the supply bypassing, and the input/output impedance interactions before suspecting bad parts.
- **Noise on an analog measurement that correlates with a digital bus's activity** is cross-subsystem coupling through power, ground, or proximity. The correlation pattern reveals the coupling mechanism: supply frequency means conducted, clock frequency means radiated, and data-dependent means ground bounce.
- **Two devices that work independently but interfere with each other when both are active** is frequently a blurred boundary — shared power, shared ground, or electromagnetic coupling between the devices creates an interaction path that doesn't exist during independent testing.
- **A system that works with two devices but fails when a third is added** often shows up as a coordination failure — the third device introduces bus loading, supply current, or electromagnetic interference that disrupts the coordination between the first two. The third device may be functioning perfectly by its own specification.
