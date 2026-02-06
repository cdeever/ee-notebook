---
title: "Which Probe Type for This Situation?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Which Probe Type for This Situation?

The default probe isn't always the right probe. Each probe type makes trade-offs between bandwidth, loading, voltage range, and what it can physically connect to. Picking the right one avoids getting a technically correct but practically useless reading.

## Quick Selection Guide

| Measurement | Recommended probe | Why |
|-------------|------------------|-----|
| General-purpose voltage (digital, analog, power) | Passive 10x | Good all-rounder: wide voltage range, decent bandwidth, low loading |
| Low-level signal (mV range, audio) | Passive 1x or direct BNC | No 10:1 attenuation — better sensitivity and SNR |
| Fast digital (> 50 MHz edge content) | Passive 10x with spring-tip ground, or active probe | 10x for adequate bandwidth; active for lowest loading |
| Very fast digital or RF (> 500 MHz) | Active probe | Low capacitance (~1 pF), high bandwidth |
| Voltage across floating nodes | Differential probe | Two-input, no ground clip to short things |
| Current without breaking the circuit | Current clamp (AC or AC/DC) | Clips around a wire, non-invasive |
| EMI source localization | Near-field probe (H or E) | Sniffs magnetic or electric fields without contact |
| Low resistance (milliohms) | DMM with Kelvin clips (4-wire) | Eliminates lead resistance from measurement |

## Passive 10x Probe

**Bandwidth:** 100–500 MHz | **Input:** 10 MΩ ‖ ~12–15 pF | **Max voltage:** ~300V CAT I

The default for almost everything: digital logic, analog signals, power rail checks. Uses a compensated RC divider — a 9 MΩ resistor in series with the tip, combined with the scope's 1 MΩ input, gives 10:1 attenuation. A trimmer capacitor compensates for cable capacitance so the divider ratio is flat across frequency.

The 10:1 attenuation means the scope's vertical noise is 10x more significant relative to the signal. For millivolt-level signals, 1x or direct BNC is better.

## Passive 1x Probe

**Bandwidth:** 6–15 MHz | **Input:** 1 MΩ ‖ ~100+ pF | **Max voltage:** ~300V CAT I

For audio-frequency signals where sensitivity matters, or low-level DC/slow AC where millivolts need to be seen without 10x attenuation noise. The high capacitance (~100 pF) loads the circuit significantly at high frequencies — this probe is effectively a low-pass filter on high-impedance nodes.

## Active Probes

**Bandwidth:** 500 MHz – 10+ GHz | **Input:** ~100 kΩ ‖ ~1 pF | **Max voltage:** typically ±8V or less

For signals with frequency content above a few hundred MHz, or high-impedance nodes where even 15 pF is too much loading. Contains a FET amplifier at the probe tip that presents high impedance to the circuit and drives the cable capacitance with low-impedance output.

Low voltage range makes them easily damaged by overvoltage. Expensive, require power from the scope, often proprietary interface, and ESD-sensitive at the tip.

## Current Probes

**AC (transformer-based):** Clamps around a conductor; changing magnetic field induces proportional voltage. AC only, needs a single conductor (supply and return together cancel).

**DC/AC (Hall-effect):** Measures both DC and AC. More expensive, needs periodic degaussing (DC offset drifts), lower bandwidth than best AC-only probes.

Both types work best above 100 mA–1A. Position conductor in center of clamp for accuracy. External magnetic fields can affect readings.

## Differential Probes

**Bandwidth:** 25 MHz – 1 GHz+ | **Common-mode:** 600V – 1500V

For measuring voltage across two nodes that are both not at earth ground — high-side current sense resistors, motor phase voltages, bridge circuits, any measurement where connecting a scope ground clip would create a short.

CMRR degrades with frequency. Separate ratings exist for differential voltage (between inputs) and common-mode voltage (both inputs to earth).

## Near-Field Probes

H-field (magnetic loop) or E-field (capacitive stub) probes for localizing EMI sources on a board. Measurements are relative, not calibrated — comparing "more here" vs "less there." H-field probes pick up current loops; E-field probes pick up voltage nodes. Orientation matters.

## DMM Accessories

**Kelvin clips (4-wire):** For resistances below ~1 Ω where lead resistance affects the reading. Four terminals: two carry test current, two sense voltage. Essential for milliohm measurements.

## Tips

- Start with passive 10x for most measurements — switch to specialized probes when loading, bandwidth, or voltage range demands it
- Compensate 10x probes whenever using a new probe or moving between scopes
- Use 10x rather than 1x for anything where loading or bandwidth matters
- For current measurement, single conductor only — supply and return together cancel
- Check both differential and common-mode voltage ratings on differential probes

## Caveats

- 10x probe compensation must be checked — under-compensated shows drooping edges, over-compensated shows overshoot
- Active probes are easily damaged by overvoltage — verify voltage before probing power rails
- Current probe sensitivity decreases for small currents — most work best above 100 mA–1A
- Cheap differential probes may have CMRR of only 30–40 dB even at low frequency
- Standard DMM leads contribute ~0.1–0.5 Ω of lead resistance — negligible above 10 Ω, significant below 1 Ω
- Probe tip contact quality matters more at low resistance — dirty or oxidized contacts add resistance

## In Practice

- Signal that looks clean on 10x but distorted on 1x indicates 1x bandwidth is insufficient or capacitive loading is affecting the circuit
- Oscillator that works normally but stops when probed needs an active probe with lower capacitance
- Measurement across a floating node that causes smoke or trips a breaker indicates the ground clip created a short — differential probe needed
- Current reading that seems too low with clamp probe may be caused by conductor not centered in clamp, or nearby magnetic field interference
- Resistance reading that changes significantly between 2-wire and 4-wire mode indicates lead resistance is a substantial fraction of the measurement
