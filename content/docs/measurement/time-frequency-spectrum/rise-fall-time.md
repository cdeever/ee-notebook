---
title: "What's the Rise/Fall Time?"
weight: 20
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What's the Rise/Fall Time?

Edge speed matters. Rise and fall times affect signal integrity, EMI emissions, logic timing margins, and crosstalk. Fast edges are what create high-frequency content in digital signals — a 10 MHz clock with 1 ns edges has frequency content into the GHz range. Measuring edges accurately requires knowing when the scope and probe are the bottleneck.

## Measuring Rise/Fall Time

Use a 10x probe with the shortest possible ground connection (spring-tip ground). Ground lead inductance adds ringing that corrupts edge measurements. Probe the signal and get a clean, stable trigger on the edge of interest. Set timebase to zoom in on the edge — the edge should occupy at least 3–5 horizontal divisions for accurate measurement.

Use the scope's auto-measurement for rise time. The standard definition is **10% to 90%** of the final voltage (industry standard). Some scopes also offer 20%-80% measurement, which gives a shorter number for the same edge.

Measure both rise and fall times — they may differ, which indicates driver imbalance.

## Is the Scope the Bottleneck?

The displayed rise time combines the signal and the measurement system:

**t_displayed² = t_signal² + t_scope² + t_probe²**

Or approximately: **t_system = 0.35 / BW_system**

| Scope/probe BW | System rise time | Can accurately measure edges down to |
|----------------|-----------------|-------------------------------------|
| 50 MHz | 7 ns | ~20 ns |
| 100 MHz | 3.5 ns | ~10 ns |
| 200 MHz | 1.75 ns | ~5 ns |
| 500 MHz | 0.7 ns | ~2 ns |
| 1 GHz | 0.35 ns | ~1 ns |

**Rule of thumb:** If the displayed rise time is less than 2× the system rise time, the scope is significantly affecting the measurement.

To estimate true signal rise time: **t_signal = sqrt(t_displayed² - t_system²)**

## Rise Time and EMI

The -3 dB "knee" frequency of a digital signal is: **f_knee ≈ 0.5 / t_rise**

| Rise time | Knee frequency | EMI concern |
|-----------|---------------|-------------|
| 100 ns | 5 MHz | Low — AM radio band |
| 10 ns | 50 MHz | Moderate — FM/VHF band |
| 1 ns | 500 MHz | High — UHF, cellular bands |
| 200 ps | 2.5 GHz | Very high — WiFi, Bluetooth bands |

Slowing edges (with series resistors or ferrite beads) is a primary EMI reduction technique, but edges shouldn't be slowed so much that timing margins are violated.

## Rise Time and Crosstalk

Crosstalk between adjacent traces is proportional to dV/dt — the rate of voltage change. Faster edges couple more energy into neighboring signals. Unexpected glitches on adjacent signals coinciding with fast edges on a driven signal indicate the rise time is too fast for the trace spacing.

## Tips

- Use spring-tip ground for any rise time measurement — ground lead ringing adds overshoot that confuses 10%/90% threshold measurements
- Measure at the receiver end of the trace (after the transmission line), not at the driver output, to see what the receiving device actually sees
- Compare rise and fall times — asymmetry indicates driver imbalance

## Caveats

- Ground lead ringing looks like overshoot and can confuse the 10%/90% measurement thresholds
- Probe loading slows down edges — on high-impedance nodes, probe capacitance forms an RC filter that rounds the edge
- Sample rate matters — for accurate edge reconstruction, at least 5–10 samples on the edge are needed; for a 1 ns rise time, that's 5–10 GS/s
- Sin(x)/x interpolation helps reconstruct edges between samples but can't recover information that wasn't captured
- Datasheet rise times are specified under particular load conditions — actual circuit may have different loading giving different actual rise times

## In Practice

- Rise time significantly faster than expected indicates possible overshoot/ringing issues — check for termination
- Rise time significantly slower than expected indicates excessive capacitive loading or weak driver
- Rise time that changes dramatically when probe is connected indicates the probe is loading the circuit
- Asymmetric rise/fall times indicate driver imbalance or asymmetric loading
- Ringing visible on edges that disappears with spring-tip ground was probe artifact, not actual circuit ringing
