---
title: "Test Instruments"
weight: 110
bookCollapseSection: true
---

# Test Instruments

Understanding what an instrument actually measures, what its specs mean, and which capability level a given task demands. These pages are organized by instrument type — each covers what the tool does, the specs that matter, and how to decide whether an entry-level or higher-tier instrument is sufficient for the work at hand.

## Which Instrument for Which Measurement?

| Measurement situation | Primary instrument | Also useful |
|---|---|---|
| DC voltage, resistance, continuity | DMM | — |
| AC voltage (power frequency) | DMM (True RMS) | Oscilloscope for waveform shape |
| Ripple and noise on DC rails | Oscilloscope (AC coupled) | — |
| Signal shape and timing | Oscilloscope | Logic analyzer for digital |
| Frequency content / harmonics | Oscilloscope (FFT) | Spectrum analyzer for RF |
| Precision frequency measurement | Frequency counter | Oscilloscope for approximate |
| Digital protocol decode (SPI, I²C, UART) | Logic analyzer or MSO | — |
| Capacitor health (ESR screening) | ESR meter | LCR meter for full characterization |
| Component values (L, C, R at frequency) | LCR meter | DMM for basic R and C |
| Power supply current limit, voltage setting | Bench power supply (read-back) | DMM for independent verification |
| Power supply load testing / characterization | Electronic load | Resistor (limited) |
| Current draw (DC, average) | DMM (current mode) | Inline USB meter |
| Current waveform / transient | Current probe + oscilloscope | Shunt resistor + oscilloscope |
| Function / waveform stimulus | Signal generator | — |

## Instrument Pages

### Core Bench Instruments

- **[Bench Power Supply]({{< relref "bench-power-supply" >}})** — Linear vs switching, CC/CV modes, output noise, and what "programmable" means in practice.
- **[Digital Multimeter (DMM)]({{< relref "dmm" >}})** — Counts, digits, accuracy specs, True RMS, input impedance, and CAT safety ratings.
- **[Oscilloscope]({{< relref "oscilloscope" >}})** — Bandwidth, sample rate, memory depth, vertical resolution, triggering, and MSO capability.
- **[Function / Signal Generator]({{< relref "signal-generator" >}})** — DDS vs AWG, output impedance, distortion, flatness, and modulation.
- **[Electronic Load]({{< relref "electronic-load" >}})** — CC/CR/CV/CP modes, transient testing, battery discharge, and what minimum operating voltage means for low-voltage work.

### Specialized Instruments

- **[ESR Meter]({{< relref "esr-meter" >}})** — Test frequency, in-circuit capability, and when it beats a DMM or LCR meter for capacitor screening.
- **[LCR Meter / Component Tester]({{< relref "lcr-meter" >}})** — Test frequency selection, impedance measurement, and when DMM capacitance mode is not enough.
- **[Logic Analyzer]({{< relref "logic-analyzer" >}})** — Channel count, sample rate, protocol decode, and USB vs MSO vs benchtop trade-offs.
- **[Frequency Counter]({{< relref "frequency-counter" >}})** — Resolution vs accuracy, timebase types, and when a scope's frequency readout isn't enough.
- **[Current Measurement & Probing]({{< relref "current-measurement" >}})** — Shunt resistors, clamp meters, current probes, and inline USB meters for the measurements voltage can't reveal.

## Related Coverage Elsewhere

Spectrum analyzers and vector network analyzers are covered in **[Radio & RF — RF Test Instruments]({{< relref "/docs/radio-rf/rf-test-instruments" >}})**, since their primary use case is RF work and the context there is more relevant than repeating it here.
