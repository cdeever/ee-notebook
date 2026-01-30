---
title: "Scope Usage — Owon SDS7102V"
weight: 20
---

# Scope Usage — Owon SDS7102V

![Owon SDS7102V](images/owon-sds7102v.jpg)

Quick reference for the Owon SDS7102V. 100 MHz bandwidth, 2 channels, 1 GSa/s (single channel), 10 Mpts record length, 8-inch color LCD.

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
