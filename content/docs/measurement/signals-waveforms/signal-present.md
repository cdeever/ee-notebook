---
title: "Is the Signal Present at This Node?"
weight: 10
---

# Is the Signal Present at This Node?

The first question when debugging a signal path. Before worrying about shape, amplitude, or distortion, confirm the signal exists where it should. A missing signal is a different class of problem than a wrong signal — it points to power issues, broken connections, or a stage that isn't running at all.

## Visual Confirmation with an Oscilloscope

DC-couple the channel to see both the signal and its DC offset. Set vertical scale to the expected amplitude — if unknown, start at 1V/div and adjust. Set timebase based on expected frequency: 1 ms/div to 10 ms/div for audio (20 Hz–20 kHz), 1 µs/div to 100 µs/div for digital logic (kHz–MHz), 10 ns/div to 100 ns/div for RF or high-speed digital.

Probe the node of interest and set trigger to edge mode on the signal channel, adjusting trigger level to get a stable display.

This reveals:
- Signal present vs. absent — the most basic question
- Approximate amplitude, frequency, and waveshape at a glance
- DC offset — the signal may be riding on an unexpected DC level
- Whether the signal is continuous, intermittent, or bursty

## DMM AC Voltage Check

For quick yes/no confirmation without a scope, set the DMM to AC Volts (V~) and probe the node vs. ground. Any non-zero AC reading confirms signal presence.

The reading is RMS voltage — useful for rough amplitude comparison between nodes (input vs. output of a stage).

## Audio Signal Tracing

For tracing audio signals through an audio chain without a scope, connect a small speaker or headphone through a DC-blocking capacitor (~1–10 µF) to avoid DC current through the speaker. Touch the probe to each stage: input jack, preamp output, tone control, power amp input. Listening reveals exactly where in the chain the signal stops, plus qualitative assessment of distortion, hum, and noise — the ear is remarkably good at detecting these.

## Tips

- Use Auto trigger (free-running) to show whatever is present when first checking a node — Normal trigger shows a blank screen if the trigger condition isn't met, which can look like "no signal" when the signal is actually present but at the wrong level or frequency
- Use DC coupling for the initial check — AC coupling hides DC offsets and blocks very low-frequency signals
- If the expected signal is in the millivolt range, disconnect the probe tip and observe the noise floor first — the signal should be clearly above it when reconnected

## Caveats

- DMM AC mode has limited bandwidth (typically a few hundred Hz to 100 kHz for average-responding meters, up to ~1 MHz for true RMS). Signals above the meter's bandwidth read low or zero — a 10 MHz clock reads nothing on most DMMs
- DMM shows RMS, which doesn't reveal waveshape — a 1V RMS sine wave and a 1V RMS square wave look identical on the meter
- AC-coupled DMM measurement misses the DC component — useful for ripple checks but misleading when expecting full signal level
- Always use a DC-blocking capacitor when probing with a speaker — many circuit nodes have a DC bias that could damage a speaker or headphone, or cause a loud pop

## Bench Relevance

- No signal at a node that should have one indicates an open connection, unpowered stage, or failed component upstream
- Signal present but at unexpected amplitude suggests gain error or loading problem
- Signal that appears on Auto trigger but won't stabilize on Normal trigger indicates noise or incorrect trigger level setting
- Intermittent signal presence correlates with mechanical connection problems or thermal issues
- DMM showing AC voltage on what should be a DC-only rail indicates unwanted oscillation, noise, or ripple
