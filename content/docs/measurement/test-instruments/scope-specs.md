---
title: "Scope Specs — Owon SDS7102V"
weight: 25
---

# Scope Specs — Owon SDS7102V

Reference specs for checking whether a measurement is within the instrument's capabilities. When a reading looks wrong, check here before blaming the circuit.

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

## Vertical System

| Parameter | Value |
|---|---|
| Sensitivity | 2 mV/div to 10 V/div |
| Bandwidth | 100 MHz (−3 dB), 20 MHz with BW limit |
| Input impedance | 1 MΩ ∥ ~20 pF |
| Input coupling | DC, AC, GND |
| Resolution | 8 bits |
| Displacement range | ±1V (2–100 mV/div), ±10V (200 mV–1 V/div), ±100V (2–10 V/div) |

### Vertical Accuracy

Scope vertical accuracy is typically ±3–5% — significantly worse than a DMM. Use the scope for waveform shape and timing; use the DMM for precise DC voltage readings.

## Horizontal System

| Parameter | Value |
|---|---|
| Timebase range | 2 ns/div to 5 s/div |
| Sample rate (1 ch) | 1 GSa/s |
| Sample rate (2 ch) | 500 MSa/s |
| Record length | 10 Mpts per channel |

## Trigger System

| Parameter | Value |
|---|---|
| Sources | CH1, CH2, External |
| Types | Edge, Video (NTSC/PAL/SECAM) |
| Modes | Auto, Normal, Single |

## Auto Measurements

| Category | Parameters |
|---|---|
| Voltage | Vpp, Vmax, Vmin, Vtop, Vbase, Vamp, Vavg, Vrms, Overshoot, Preshoot |
| Time | Frequency, Period, Rise Time, Fall Time, Delay A→B, Pulse Width, Duty Cycle |

## Math Functions

CH1+CH2, CH1−CH2, CH1×CH2, FFT

## Connectivity

| Interface | Use |
|---|---|
| USB (device) | PC connection for screenshots and waveform data |
| USB (host) | USB storage for saving waveforms |
| VGA | External monitor output |
| LAN | Remote control (SCPI) |

## Physical

| Parameter | Value |
|---|---|
| Dimensions | 340 × 155 × 70 mm |
| Weight | 2.63 kg |
| Cooling | Fan |

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
