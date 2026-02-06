---
title: "Are Clock and Data Edges Aligned?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# Are Clock and Data Edges Aligned?

Setup and hold timing. The data must be stable before the clock edge (setup time) and remain stable after it (hold time). When these margins are violated, the receiver captures wrong or metastable data — and the failure is often intermittent, temperature-dependent, and maddening.

## Setup and Hold Fundamentals

| Parameter | Definition | Effect of violation |
|-----------|-----------|---------------------|
| Setup time (tSU) | Minimum time data must be stable before the active clock edge | Data may not be captured correctly — wrong bit value |
| Hold time (tH) | Minimum time data must remain stable after the active clock edge | Captured value may change after being latched — metastability |

Both are specified in the receiver's datasheet. The transmitter's datasheet specifies when data transitions occur relative to the clock — the difference is the timing margin.

**Setup margin = (time data is stable before clock edge) − tSU_required**

**Hold margin = (time data remains stable after clock edge) − tH_required**

Both margins must be positive for reliable operation.

## Measuring Setup and Hold

CH1 on the clock signal, CH2 on the data signal. Trigger on the active clock edge (rising or falling depending on the protocol). Zoom the timebase to see the clock edge and surrounding data transitions clearly.

Measure the time from the data transition to the clock edge (setup time) and from the clock edge to the next data transition (hold time). Use cursors for manual measurement.

The data line should be flat (stable) before and after the clock edge. Data transitions should happen during the "don't care" window between sample points.

## SPI Timing

| Mode | CPOL | CPHA | Clock idle | Data sampled on | Data shifted on |
|------|------|------|-----------|----------------|----------------|
| 0 | 0 | 0 | Low | Rising edge | Falling edge |
| 1 | 0 | 1 | Low | Falling edge | Rising edge |
| 2 | 1 | 0 | High | Falling edge | Rising edge |
| 3 | 1 | 1 | High | Rising edge | Falling edge |

Verify CPOL (does clock idle at expected level?) and CPHA (is data valid at the sampling edge?). CPOL/CPHA mismatch is the #1 SPI problem — data appears shifted by one bit.

## I2C Timing

| Parameter | Standard (100 kHz) | Fast (400 kHz) | Fast+ (1 MHz) |
|-----------|--------------------|----------------|---------------|
| SCL clock period | ≥ 10 µs | ≥ 2.5 µs | ≥ 1 µs |
| Setup time (data) | ≥ 250 ns | ≥ 100 ns | ≥ 50 ns |
| Rise time (SCL, SDA) | ≤ 1000 ns | ≤ 300 ns | ≤ 120 ns |

Rise times are controlled by pull-up resistor value and bus capacitance: **t_rise ≈ 0.8473 × R_pullup × C_bus**

SDA must change only when SCL is low — SDA changing while SCL is high is a START or STOP condition.

## Persistence Display for Timing Jitter

Trigger on the clock's active edge and enable infinite persistence. Let the display accumulate many acquisitions. Data transitions appear as a band — the width shows timing jitter.

This reveals whether timing is tight but consistent (narrow band, safe) or jittery (wide band, risky), and whether occasional outlier transitions come dangerously close to the clock edge.

## Tips

- Measure at the receiver's input pins, not at the transmitter's output — propagation delay through PCB traces, buffers, and level shifters adds to clock-to-data skew
- Measure timing from the threshold crossing point (typically 50% of swing), not from the start or end of the transition
- Use matched probes and cables to avoid channel-to-channel skew artifacts

## Caveats

- Both clock and data have rise/fall times — the "edge" isn't instantaneous
- Probe delay mismatch between channels can introduce apparent skew that isn't real
- At high SPI clock rates (>10 MHz), trace length differences between SCK and data lines become significant — a few centimeters adds nanoseconds
- Bus capacitance accumulates with every device and centimeter of trace — I2C spec limits total bus capacitance to 400 pF
- Temperature and voltage variations cause timing to shift — room-temperature measurements may look fine while extremes fail

## In Practice

- Data transitions happening close to clock edge indicate tight timing margin — will fail under temperature or voltage variation
- Data not stable at clock edge indicates setup violation — receiver captures wrong data
- Data changing immediately after clock edge indicates hold violation — metastability possible
- Timing that works at low speed but fails at high speed indicates margins consumed by propagation delay
- Wide timing jitter band on persistence display indicates unstable timing — investigate source of jitter
- **A clock-dependent subsystem that works at room temperature on the bench but fails at temperature in the integrated device** often indicates that thermal coupling from an adjacent power subsystem is shifting a timing-sensitive parameter — the bench test at room temperature had no thermal coupling, and the integrated device at elevated temperature has less timing margin.
- **An intermittent fault that occurs more frequently at high temperature and fast clock speeds** is showing, through the time lens, a timing margin that shrinks with conditions — the failure point moves in a predictable direction as temperature and speed increase, confirming that propagation delay versus timing requirement is the mechanism.
