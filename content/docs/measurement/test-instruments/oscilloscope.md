---
title: "Oscilloscope"
weight: 30
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Oscilloscope

The oscilloscope shows what the DMM cannot: how signals change over time. Voltage as a function of time is the fundamental view, but from that you derive frequency, rise time, jitter, noise, glitches, and timing relationships between signals. When a circuit "does not work" and the DMM says all the voltages are correct, the scope usually reveals why.

## What It Does

An oscilloscope samples an input voltage at regular intervals, stores the samples in memory, and displays them as a waveform — voltage on the vertical axis, time on the horizontal. Modern digital storage oscilloscopes (DSOs) capture waveforms into memory and can display, measure, and analyze them after the trigger event.

The trigger system is what makes the display stable and useful. It tells the scope when to start capturing, so each sweep begins at the same point on the waveform. Without proper triggering, the display is an unreadable mess of overlapping traces.

## Key Specs and What They Mean

| Spec | What it means | Why it matters |
|---|---|---|
| Bandwidth | Frequency at which a sine wave input is attenuated by −3 dB (reads ~30% low) | Determines the fastest signal the scope can display accurately. The "5× rule" says scope bandwidth should be ≥5× the signal's highest significant frequency for <2% amplitude error |
| Sample rate | How many times per second the ADC samples (in Sa/s) | Must be high enough to reconstruct the waveform. Nyquist says ≥2× the bandwidth, but 5–10× gives accurate shape. Low sample rate causes aliasing — displaying false frequencies |
| Memory depth | Total number of samples stored per acquisition | Memory depth = sample rate × capture time. Long captures at high sample rates require deep memory. Shallow memory forces a trade-off: either short capture or reduced sample rate |
| Vertical resolution | ADC bits (8, 10, 12, or high-res mode) | 8-bit = 256 levels across the screen. Small signals on top of large ones get quantized. 12-bit scopes resolve 16× finer voltage steps |
| Number of channels | Analog input channels (2 or 4 typical) | More channels let you observe multiple signals simultaneously — essential for multi-rail power sequencing, clock-data relationships, and differential measurements |
| Trigger types | Edge, pulse width, runt, logic, serial decode, etc. | Advanced triggers isolate specific events. Edge triggering handles most situations; pulse width and runt triggers catch glitches that edge triggering misses |
| MSO (Mixed Signal) | Adds digital/logic channels alongside analog | Lets you correlate analog behavior with digital bus activity — seeing SPI data alongside the analog output it controls, for example |

## Feature Tiers

| Tier | Typical specs | Good enough for | Not sufficient for |
|---|---|---|---|
| **Entry** (2 ch, basic triggers) | 50–100 MHz BW, 500 MSa/s–1 GSa/s, 8-bit, edge trigger only | Audio circuits, power supply verification, basic embedded (UART, I²C at low speed), learning | Fast SPI/I²C, rise time analysis, RF, protocol decode, multi-rail sequencing |
| **Mid-range** (4 ch, protocol decode) | 100–350 MHz BW, 1–5 GSa/s, 8–10 bit, pulse/runt/serial triggers, decode | General embedded development, SPI/I²C/UART decode, power integrity, motor control | High-speed digital (>100 MHz clocks), DDR, SerDes, detailed RF analysis |
| **High-end** (4 ch + MSO, deep memory) | 500 MHz–1 GHz+ BW, 5–20 GSa/s, 10–12 bit, deep memory (100M+ pts), advanced triggers | High-speed digital, power integrity, RF up to UHF, compliance testing, long captures with full sample rate | Multi-GHz serial, mmWave, ultra-low-noise measurements |

## Bandwidth, Sample Rate, and Memory Depth: The Three-Way Trade-Off

These three specs are interconnected, and understanding the relationship prevents misleading captures.

**Bandwidth** limits what frequencies get through the analog front end. A 100 MHz scope attenuates content above 100 MHz, meaning rise times faster than ~3.5 ns are slowed and signal detail above 100 MHz is lost.

**Sample rate** determines reconstruction fidelity. The scope's maximum sample rate applies at the fastest timebase settings. At slower timebases, the scope stretches the memory across more time, which may reduce the effective sample rate. If the sample rate drops below 5× the signal frequency, waveform shape becomes unreliable.

**Memory depth** determines how long the scope can capture at full sample rate. A scope with 10 Mpts and 1 GSa/s can capture 10 ms at full rate. To capture 100 ms, the sample rate drops to 100 MSa/s — fast enough for a 1 MHz signal but undersampling a 50 MHz one.

The practical consequence: when zooming out to see a long time window, check whether the sample rate has dropped. A waveform that looks clean at 100 µs/div may show aliasing artifacts at 10 ms/div because the scope reduced its sample rate to fit the capture into memory.

## Persistence Mode

Persistence mode overlays many acquisitions on the screen, building a visual history of the waveform. Frequent signal paths appear bright; rare events appear dim. This is invaluable for:

- **Spotting jitter:** A clock signal with timing variation shows a thickened edge in persistence mode
- **Finding glitches:** A rare narrow pulse that appears once in ten thousand acquisitions shows up as a dim trace
- **Seeing amplitude variation:** Occasional overshoot or droop that is invisible in single-shot display becomes visible in the persistence overlay

Infinite persistence never clears the display — every acquisition adds to the overlay. Analog-style persistence fades older traces, emphasizing recent behavior while still revealing rare events.

## Gotchas and Limits

- **Bandwidth is −3 dB, not a cutoff:** A 100 MHz scope seeing a 100 MHz signal reads ~30% low in amplitude. At 70% of bandwidth, the error is still ~3%. For accurate amplitude, keep the signal frequency below 1/3 to 1/5 of the scope bandwidth.
- **Probe compensation matters:** A 10× probe that is not compensated shows rounded or overshoot corners on square waves. This is a probe error, not a signal error. Compensate probes every time a different probe is used or the probe setting changes.
- **AC coupling has a low-frequency limit:** AC coupling blocks DC but also attenuates low frequencies (typically below ~10 Hz). Long-period signals or slowly drifting baselines get distorted. Use DC coupling and offset when possible.
- **Vertical accuracy is ±3–5%:** Much worse than a DMM. A scope reading of "3.30V" could really be 3.1V–3.5V. Use the scope for waveform shape and timing; use the DMM for accurate voltage.
- **Grounding the probe incorrectly adds noise:** A long ground lead on the probe acts as an antenna and a loop inductance. For anything above a few MHz, use the spring ground tip, not the alligator clip ground wire.
- **Auto-measurement on noisy signals:** Automatic frequency, rise time, and amplitude measurements can give misleading results on noisy signals because the algorithm may trigger on noise edges. Use cursors for verification when the signal is not clean.

## Tips

- Use DC coupling as the default — it shows the complete signal including DC offset. Switch to AC coupling only when you specifically need to reject a large DC component to see small AC content (like ripple on a DC rail)
- Trigger on the cleanest, most stable edge available. When observing two signals, trigger on the reference (clock, strobe, enable) rather than the data
- Use math channels for differential measurements (CH1 − CH2) to see the voltage across a component when neither side is ground-referenced
- Adjust the trigger level to approximately 50% of the waveform amplitude for stable triggering
- Use single-shot mode for capturing one-time events (power-on sequences, fault conditions, button presses) — set the trigger, arm the scope, then cause the event

## Caveats

- **Sample rate specs are often "maximum" per channel** — With multiple channels active, the sample rate may be split between them. A "1 GSa/s" scope may become 500 MSa/s per channel with two channels active. Check the interleaved vs. real-time sample rate
- **Equivalent time sampling is not real-time** — Some scopes achieve very high effective sample rates by combining samples from many repetitions of the signal. This only works for perfectly repetitive signals and cannot capture single-shot events at that rate
- **FFT on a scope is not a spectrum analyzer** — Scope FFT resolution is limited by memory depth and window function. It is useful for identifying frequency content but lacks the dynamic range and noise floor of a dedicated spectrum analyzer
- **Deep memory slows the scope down** — Acquiring and processing millions of sample points takes time. At maximum memory depth, the scope's waveform update rate drops, making it harder to spot rare events in real time. Some scopes let you trade memory depth for update rate

## In Practice

- A "missing" pulse in a digital signal that appears on the scope but not in the logic analyzer view may be a runt (below logic threshold) — use the runt trigger to isolate it
- Power supply ripple measurement requires AC coupling, bandwidth limit (20 MHz), and a short ground lead on the probe — without these, the measurement includes high-frequency noise pickup from the probe ground loop
- When two signals look time-aligned on the scope, verify by swapping which channel each is connected to — channel-to-channel skew (typically 1–2 ns on mid-range scopes) can hide or create apparent timing differences
- A waveform that looks correct at a slow timebase but shows ringing or overshoot when zoomed in is revealing real signal behavior that was hidden by the reduced sample rate at the slow timebase setting
