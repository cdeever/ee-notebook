---
title: "Ripple & Noise on the Rail"
weight: 30
---

# Ripple & Noise on the Rail

AC on top of DC. Every power rail has some ripple and noise — the question is whether it's acceptable for the circuit downstream. Switching converters are the usual suspects, but LDOs have noise too, and external interference can ride on rails.

## Oscilloscope: Ripple Measurement

**Tool:** Oscilloscope, AC-coupled (or DC-coupled with offset), 1x probe or tip-and-barrel
**Bandwidth limit:** 20 MHz BW limit ON (unless you specifically need full bandwidth)

### Procedure

1. AC-couple the channel to reject the DC component and zoom in on the AC content
2. Set vertical scale to see the ripple — start at 10 mV/div for a clean rail, 50–100 mV/div for a switcher
3. Set timebase based on expected switching frequency:
   - 500 kHz switcher → 1 µs/div shows a few cycles
   - 50/60 Hz mains ripple → 5 ms/div
4. Use 20 MHz bandwidth limit to reject high-frequency probe artifacts and noise
5. Measure peak-to-peak ripple

### Tip-and-Barrel Technique

For the most accurate ripple measurement, remove the ground clip and use the probe tip and barrel (ground ring) directly on the decoupling capacitor pads. This minimizes the ground loop area and kills the probe-induced ringing that makes ripple look worse than it is.

1. Remove the ground clip from the probe
2. Touch the probe tip to the rail pad and the ground barrel to the ground pad — right at a decoupling cap if possible
3. This is the "gold standard" for ripple measurements

### What You Learn

- Ripple amplitude (peak-to-peak) — compare to downstream IC requirements. Many datasheets specify max supply ripple
- Ripple frequency — confirms the switching frequency and reveals if something unexpected is modulating the supply
- Noise spikes — fast transient spikes from switching edges, separate from the fundamental ripple

### Gotchas

- Long ground leads pick up switching noise and radiated EMI — the measurement itself adds noise. Tip-and-barrel fixes this
- AC coupling has a high-pass corner. Very low-frequency noise (< 10 Hz) gets attenuated. If you suspect slow drift, use DC coupling with vertical offset
- 20 MHz bandwidth limit is standard practice for ripple measurement (per most DC-DC converter datasheets), but it hides high-frequency noise. If you're debugging noise coupling into sensitive analog circuits, try full bandwidth too
- 1x probe gives better low-voltage sensitivity (no 10:1 attenuation) but lower bandwidth and more loading. Fine for most ripple measurements

## DMM: AC Voltage on a DC Rail

**Tool:** DMM, V~ (AC Volts) mode
**Use case:** Quick go/no-go when you don't need waveform detail

### Procedure

1. Set DMM to AC Volts (V~)
2. Probe the rail vs. ground
3. Read the AC RMS value

### What You Learn

- Rough indication of total ripple/noise energy
- Good for quick comparison: "is this rail noisier than that one?"

### Gotchas

- Most DMMs measure AC RMS with limited bandwidth (a few hundred Hz to maybe 100 kHz). Switching converter ripple at 500 kHz may be partially or fully rejected
- The reading is RMS, not peak-to-peak. A 50 mVpp triangle wave reads as ~14 mV RMS — this can be misleading if you're comparing to a peak-to-peak spec
- AC mode typically has a series coupling capacitor with a low-frequency cutoff around 1–10 Hz — very low frequency noise won't show up
