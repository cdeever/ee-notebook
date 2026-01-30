---
title: "Owon SDS7102V — Oscilloscope"
weight: 20
---

# Owon SDS7102V — Oscilloscope

![Owon SDS7102V](images/owon-sds7102v.jpg)

100 MHz bandwidth, 2 channels, 1 GSa/s (single channel), 10 Mpts record length, 8-inch color LCD.

## At a Glance

| Parameter | Value |
|---|---|
| Channels | 2 analog + 1 external trigger |
| Bandwidth | 100 MHz |
| Sample rate | 1 GSa/s (1 channel), 500 MSa/s (2 channels) |
| Record length | 10 Mpts per channel |
| Vertical resolution | 8 bits (256 levels) |
| Display | 8" TFT LCD, 800 × 600, 65535 colors |
| Max input voltage | 400V peak (1 MΩ input) |

---

## Channel Setup

| Control | What It Does |
|---|---|
| **CH1 / CH2** | Select the channel to configure |
| **Vertical scale knob** | Sets V/div (2 mV/div to 10 V/div) |
| **Vertical position knob** | Moves the waveform up/down on screen |
| **Coupling** (menu) | DC, AC, or GND |
| **Probe attenuation** (menu) | Set to match your probe: 1x, 10x, 100x, 1000x |
| **BW Limit** (menu) | 20 MHz bandwidth limit — reduces high-frequency noise |
| **Invert** (menu) | Flips the waveform vertically |

**Important:** Always set the probe attenuation in the scope menu to match your physical probe setting. If the probe is set to 10x but the scope thinks it's 1x, all voltage readings are off by 10×.

## Timebase

| Control | What It Does |
|---|---|
| **Horizontal scale knob** | Sets time/div (2 ns/div to 5 s/div) |
| **Horizontal position knob** | Moves the waveform left/right (adjusts trigger point position) |

### Choosing Timebase

- See a few cycles of a repetitive waveform: set time/div so 3–5 cycles fill the screen
- 1 kHz signal → ~200 µs/div
- 1 MHz signal → ~200 ns/div
- Power-up capture → 50–100 ms/div
- Single fast pulse → set timebase short, use single trigger

## Triggering

| Setting | Options |
|---|---|
| **Source** | CH1, CH2, External |
| **Type** | Edge, Video (NTSC/PAL/SECAM) |
| **Slope** | Rising or falling edge |
| **Level** | Adjust with trigger level knob — set to ~50% of the waveform amplitude |
| **Mode** | Auto (free-running), Normal (waits for trigger), Single (one-shot capture) |

### Common Trigger Recipes

| Situation | Mode | Source | Setup |
|---|---|---|---|
| Repetitive waveform | Auto or Normal | Signal channel | Edge trigger, rising, level at ~50% |
| One-shot event (power-up, glitch) | Single | Relevant channel | Edge trigger, set level just above/below the event threshold, press Run and then cause the event |
| Noisy signal | Normal | Signal channel | Raise trigger level above the noise floor to get a stable display |
| Two signals, want to see timing relationship | Normal | Trigger on the reference signal | Display both channels, trigger on the one with clean edges |

## Coupling Modes

| Mode | When to Use |
|---|---|
| **DC** | Default. Shows the full signal including DC offset. Use for most measurements. |
| **AC** | Blocks DC, shows only AC content. Use for: ripple on a power rail, small AC signal on a large DC offset. |
| **GND** | Disconnects input, shows ground reference line. Use to set the zero-volt reference position on screen. |

### AC Coupling Gotcha

AC coupling inserts a high-pass filter (blocks DC). Low-frequency signals (below ~10 Hz) get attenuated. The waveform "droops" on slow timebase settings. If your signal has low-frequency content that matters, use DC coupling and adjust the vertical offset.

## Measurements

### Automatic Measurements

The scope can auto-measure these parameters (use the Measure menu):

- **Voltage:** Vpp, Vmax, Vmin, Vtop, Vbase, Vamp, Vavg, Vrms, Overshoot, Preshoot
- **Time:** Frequency, Period, Rise Time, Fall Time, Delay (A→B), Pulse Width, Duty Cycle

Up to 5 measurements can be displayed simultaneously.

### Cursors

For manual measurement when auto-measure doesn't capture what you need:

- **Voltage cursors:** Two horizontal lines — read ΔV between them
- **Time cursors:** Two vertical lines — read ΔT between them, plus 1/ΔT frequency

### Math

- **CH1 + CH2, CH1 − CH2, CH1 × CH2** — useful for differential measurements (subtract two channels)
- **FFT** — frequency domain view. Select source channel, window function, and vertical scale (dB or linear)

## Probe Compensation

Do this every time you use a new probe or change probe settings:

1. Connect the probe to the **PROBE COMP** output (square wave reference, usually ~1 kHz, 3Vpp)
2. Set scope to display the square wave
3. Look at the corners of the square wave:
   - **Overshoot / ringing:** probe is overcompensated → turn the trimmer capacitor on the probe down
   - **Rounded corners / slow rise:** probe is undercompensated → turn the trimmer up
   - **Clean square corners:** probe is compensated correctly
4. Adjust the small trimmer screw on the probe until the corners are square

## Common Procedures

### Measuring a DC Rail

1. DC coupling, probe attenuation set correctly (10x probe → set scope to 10x)
2. Set vertical scale to show the expected voltage (e.g., 1 V/div for a 3.3V rail)
3. Probe the rail, read the DC level from the auto-measurement or cursor

### Measuring Ripple

1. AC coupling to reject the DC component
2. BW Limit ON (20 MHz) to reduce probe noise
3. Use tip-and-barrel probing (remove ground clip) for best results
4. Set vertical scale to see the ripple (start at 10–50 mV/div)
5. Read Vpp from auto-measurement

### Capturing a Single Event

1. Set trigger mode to **Single**
2. Set trigger source, slope, and level to catch the event
3. Set timebase to capture the event duration
4. Press **Run** — the scope arms and waits
5. Cause the event — the scope triggers once and stops
6. Analyze the captured waveform

### Comparing Two Signals

1. Connect signals to CH1 and CH2
2. Trigger on the reference signal (the one with clean, predictable edges)
3. Both channels display simultaneously — observe amplitude, phase, timing

---

## Specifications

### Vertical System

| Parameter | Value |
|---|---|
| Sensitivity | 2 mV/div to 10 V/div |
| Bandwidth | 100 MHz (−3 dB), 20 MHz with BW limit |
| Input impedance | 1 MΩ ∥ ~20 pF |
| Input coupling | DC, AC, GND |
| Resolution | 8 bits |
| Displacement range | ±1V (2–100 mV/div), ±10V (200 mV–1 V/div), ±100V (2–10 V/div) |

Scope vertical accuracy is typically ±3–5% — significantly worse than a DMM. Use the scope for waveform shape and timing; use the DMM for precise DC voltage readings.

### Horizontal System

| Parameter | Value |
|---|---|
| Timebase range | 2 ns/div to 5 s/div |
| Sample rate (1 ch) | 1 GSa/s |
| Sample rate (2 ch) | 500 MSa/s |
| Record length | 10 Mpts per channel |

### Trigger System

| Parameter | Value |
|---|---|
| Sources | CH1, CH2, External |
| Types | Edge, Video (NTSC/PAL/SECAM) |
| Modes | Auto, Normal, Single |

### Connectivity

| Interface | Use |
|---|---|
| USB (device) | PC connection for screenshots and waveform data |
| USB (host) | USB storage for saving waveforms |
| VGA | External monitor output |
| LAN | Remote control (SCPI) |

### Physical

| Parameter | Value |
|---|---|
| Dimensions | 340 × 155 × 70 mm |
| Weight | 2.63 kg |
| Cooling | Fan |

---

## Limits to Know

These are the situations where this scope won't give you a trustworthy answer:

- **Bandwidth (100 MHz):** The −3 dB point is 100 MHz. Signals above ~70 MHz are attenuated. A 100 MHz signal reads ~30% low. For accurate amplitude, keep signal frequency below ~1/3 of bandwidth (~33 MHz). Rise time limit: ~3.5 ns (0.35 / 100 MHz) — you can't measure edges faster than this.
- **Sample rate vs. channels:** At 1 GSa/s single-channel, Nyquist is 500 MHz (fine for 100 MHz bandwidth). But at 500 MSa/s dual-channel, Nyquist drops to 250 MHz. For fast signals on both channels, the sample rate is the bottleneck for capturing edges and high-frequency detail.
- **8-bit vertical resolution:** 256 levels across the screen. At 1 V/div (8V full-scale), each level is ~31 mV. Small signals riding on large ones get quantized. To see detail, zoom the vertical scale so the signal fills most of the screen.
- **Record length vs. sample rate trade-off:** 10 Mpts at 1 GSa/s gives 10 ms of capture. If you need longer captures (e.g., 100 ms for a power-up sequence), the scope reduces sample rate to fit, and you lose time resolution. At 10 ms/div (100 ms total), sample rate drops to 100 MSa/s.
- **Vertical accuracy (±3–5%):** A "3.30V" reading on the scope could really be 3.13V–3.47V. For absolute DC voltage, use the DMM.
- **No current probing built in:** Need an external current probe or sense resistor technique.
- **2 channels only:** For multi-rail power sequencing or complex signal tracing, you may need to capture in multiple passes and correlate, or prioritize which two signals matter most.
- **Basic trigger types:** Edge and video only — no pulse width, runt, or serial decode triggers. Catching glitches requires some creativity with trigger level placement.

## Reference Links

- [Batronix product page](https://www.batronix.com/shop/oscilloscopes/Owon-SDS7102V.html)
- [All About Circuits listing](https://www.allaboutcircuits.com/test-measurement/oscilloscopes/sds-series-sds7102v/)
