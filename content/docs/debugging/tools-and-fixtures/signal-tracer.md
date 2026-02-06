---
title: "Signal Tracer"
weight: 90
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

A signal tracer is a high-gain audio amplifier with a probe, used to listen to signals at various points in a circuit. Touch the probe to a stage in an amplifier or receiver, and you hear whatever signal is present—amplified through the tracer's speaker. By moving from stage to stage, you follow the signal until it disappears or becomes distorted, pinpointing the faulty section.

Signal tracers are the complement to signal injectors: the injector provides a test signal, the tracer detects it. Together, they can diagnose almost any audio or RF signal path.

## Why Listen Instead of Look?

An oscilloscope shows you waveforms quantitatively—voltage, frequency, distortion. But for troubleshooting audio and radio equipment, your ear is often faster:

- **Presence vs. absence:** You immediately hear whether a signal is there or not
- **Distortion:** Clipping, crossover distortion, and oscillation are obvious by ear
- **Hum and noise:** You hear the character of interference—60Hz hum, buzz, hiss, motorboating
- **Relative level:** Stage gain problems are obvious as you move through the circuit

A scope requires setup: triggering, scaling, interpreting. A signal tracer requires only touching the probe and listening.

## How a Signal Tracer Works

The core is a high-gain audio amplifier:

1. **Probe:** A capacitor-coupled input that blocks DC and passes AC signals
2. **Preamplifier:** High-gain stage to amplify weak signals (millivolts) to usable levels
3. **Power amplifier:** Drives a small speaker or headphones
4. **Volume control:** Adjusts gain for different signal levels

Many signal tracers also include:
- **RF detector probe:** A diode demodulator for tracing AM signals in radio IF and RF stages
- **Headphone jack:** For quieter listening or when the environment is noisy
- **Visual indicator:** LED or meter that responds to signal presence

The gain is high enough to hear microvolt-level signals from early preamp stages and sensitive enough to detect signal flow through RF circuits.

## Using a Signal Tracer

### Basic Tracing Procedure

1. **Connect the ground clip** to circuit ground
2. **Turn on the DUT** and provide an input signal (music, test tone, broadcast station)
3. **Start at the output stage** and touch the probe to the power amp input
4. **Listen:** You should hear the signal (possibly distorted if there's a fault)
5. **Move backward** toward the input, stage by stage
6. **Find where the signal disappears or changes character**

The fault is between the last point where the signal was good and the first point where it's bad.

### RF Tracing

For radio receivers, use the RF/demodulator probe:

1. **Tune the radio to a station** (or inject an RF signal)
2. **Start at the detector/demodulator output** — you should hear audio
3. **Move to the IF stages** — the RF probe demodulates the signal
4. **Move to the mixer output** — still IF frequency
5. **Move to the RF amplifier** — front-end signal

The RF probe's diode detects (demodulates) the amplitude-modulated signal, converting it to audio that the tracer can amplify.

### Comparing Stages

When troubleshooting gain problems:

1. Trace through each stage and note the relative volume
2. A stage that should provide 20dB of gain but barely increases the signal level is suspect
3. Compare to a known-good unit if available

### Finding Noise Sources

Signal tracers excel at finding noise sources:

1. **Remove the input signal** — no input to the DUT
2. **Trace through stages** listening for hum, hiss, or buzz
3. **The noise gets louder** as you move toward the output from its source
4. **The noise disappears** as you move toward the input past its source

The fault is where the noise first appears as you trace from input to output.

## Signal Tracer vs. Signal Injector

| Tool | What It Does | Direction of Trace |
|------|--------------|-------------------|
| Signal Tracer | Listens at each stage | Input → Output (forward) |
| Signal Injector | Injects signal at each stage | Output → Input (backward) |

**Tracer approach:** Start at the input, follow the signal toward the output until it stops.

**Injector approach:** Start at the output, inject signal backward toward the input until the output stops responding.

Both methods find the faulty stage—they just approach from different directions. Using both together confirms your findings: inject at one point, trace at another, and verify the path between them.

## Building a Signal Tracer

A signal tracer is straightforward to build:

### Simple Transistor Design

**Parts:**
- 2× NPN transistors (2N3904 or similar)
- Small speaker (8Ω, 0.5W) or headphone jack
- Coupling capacitors (0.1µF input, 10µF interstage)
- Bias resistors (100kΩ, 10kΩ, 1kΩ typical values)
- Volume pot (10kΩ–100kΩ audio taper)
- 9V battery
- Probe tip and ground lead

This provides enough gain for most troubleshooting. The circuit is a two-stage common-emitter amplifier with direct speaker drive.

### IC-Based Design

Using an LM386 or similar audio amplifier IC simplifies construction:

**Parts:**
- LM386 audio amplifier IC
- Input coupling capacitor (0.1µF–1µF)
- Output coupling capacitor (220µF)
- Gain-setting components (per LM386 datasheet)
- 8Ω speaker
- 9V battery
- Probe and ground lead

The LM386 provides 20–200× gain (26–46dB) depending on configuration, enough for most signal tracing. It directly drives a small speaker.

### RF Probe

For RF tracing, add a demodulator probe:

**Parts:**
- Germanium diode (1N34A) or Schottky diode (1N5817)
- 0.001µF bypass capacitor
- 10kΩ–100kΩ load resistor
- Small coupling capacitor to main tracer input

The diode rectifies the RF signal, and the capacitor filters the RF leaving the audio modulation. Connect this probe output to the tracer's audio input.

## Commercial Signal Tracers

Classic signal tracers (Heathkit, EICO, Sencore) are available on the used market. These often include both audio and RF probes, built-in speakers, and sometimes a signal injector in the same unit.

Modern options are less common—the oscilloscope has replaced the signal tracer for many technicians. But for pure audio troubleshooting, a dedicated tracer is still faster.

**Audio probes for oscilloscopes:** Some scope probe manufacturers offer audio amplifier probes that serve a similar function, outputting to headphones.

## Limitations

**Audio and RF only:** Signal tracers work for signals in the audio range and amplitude-modulated RF. They don't help with digital signals, video, or FM modulation.

**Qualitative, not quantitative:** You hear presence, absence, and character—but not exact amplitude or frequency.

**Loading effects:** The probe input capacitance and resistance can affect high-impedance or high-frequency circuits. Be aware of what you're connecting.

**Noise floor:** Very weak signals may be below the tracer's noise floor. High-gain tracers help, but there's always a limit.

## Safety

- **Watch for high voltages:** Tube equipment has lethal plate voltages. Probe low-voltage points or use proper isolation.
- **DC blocking:** The input capacitor blocks DC, but verify it's working—a failed capacitor could pass DC and damage the tracer or give misleading results.
- **Turn down the volume:** High-gain amplification of unexpected signals can be painfully loud. Start with low volume.
- **Ground loops:** If the tracer is AC-powered, ground loops with the DUT can cause hum. Battery-powered tracers avoid this.

## In Practice

- A signal tracer answers "is there signal here?" in one second—faster than setting up a scope for a simple presence check
- For vintage radio repair, the tracer is indispensable—you can trace a signal from antenna to speaker and find exactly where it stops
- When chasing hum or noise, the tracer's audio output gives you immediate feedback as you probe ground connections, filter caps, and shielding
- Keep the tracer next to your signal injector—they work together as a diagnostic pair
