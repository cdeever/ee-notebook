---
title: "Is This Bus Communicating?"
weight: 20
---

# Is This Bus Communicating?

Quick checks before diving into protocol decode. Is there any activity at all? Are clock and data both toggling? Is the bus stuck high, low, or floating? These first-pass checks take seconds and immediately narrow down whether the problem is electrical (no activity) or protocol-level (activity but wrong content).

## Oscilloscope Activity Check

Identify the bus signals from the schematic:
- **SPI:** SCK (clock), MOSI (data out), MISO (data in), CS (chip select)
- **I2C:** SCL (clock), SDA (data)
- **UART:** TX, RX
- **CAN:** CANH, CANL (differential pair)

Probe the clock line on CH1 and a data line on CH2. Set trigger to Auto (free-running) to see whatever is present. Look for toggling signals (bus is active) vs. flat lines (bus not communicating or idle).

| Bus | Healthy idle | Active |
|-----|-------------|--------|
| I2C | SCL and SDA both high (pulled up) | Both lines toggling, SDA changes while SCL is low |
| SPI | SCK idle (high or low depending on CPOL), CS high | CS goes low, SCK toggles, MOSI/MISO toggle |
| UART | TX and RX both high (idle = mark) | Line drops low (start bit), followed by data bits |
| CAN | CANH ~2.5V, CANL ~2.5V (recessive) | CANH rises to ~3.5V, CANL drops to ~1.5V (dominant) |

## DMM Static Pin Check

With the system powered, set the DMM to DC Volts and check each bus line vs. ground. Compare to expected idle voltage:
- I2C SCL/SDA: should be near VCC (pull-up voltage) when idle
- SPI CS: should be near VCC when inactive
- UART TX: should be near VCC (idle high)

This reveals whether pull-up resistors are present and working, whether a line is stuck low, or whether a line is floating.

## Common Bus Failure Modes

**Bus stuck low:** One or more lines stuck near 0V, no toggling.

| Possible cause | How to check |
|---------------|-------------|
| Shorted to ground | Disconnect all devices; measure resistance to ground |
| Device holding line low | Remove devices one at a time and check if line releases |
| Missing pull-up resistor | Check schematic for pull-ups; measure resistance from line to VCC |
| Bus contention | Two drivers fighting — high and low driver both on |

**Bus stuck high:** Line stays high, never transitions low.

| Possible cause | How to check |
|---------------|-------------|
| Device not driving | Verify firmware is running and GPIO configured correctly |
| CS/enable not asserted | Check CS line — SPI slave won't respond if CS is high |
| Wrong pin probed | Double-check pinout against schematic |

**Bus floating:** Line at intermediate voltage, noisy, or randomly toggling.

| Possible cause | How to check |
|---------------|-------------|
| Missing pull-up or pull-down | Check schematic; add external pull and see if line stabilizes |
| Device not populated or powered | Verify device is present and has power |
| Broken trace or cold solder joint | Continuity check from device pin to test point |

## Tips

- "No activity" doesn't always mean the bus is broken — some buses are idle until the host initiates a transaction; make sure firmware is actually trying to communicate
- Check idle state first — I2C lines should idle high, SPI CS should idle high, UART TX should idle high
- On multi-device buses (I2C with many slaves), any single device can hold the bus low and prevent all communication

## Caveats

- A DMM averages the reading — if the bus is actively communicating, the DMM shows an average voltage that can look like a "stuck at mid-voltage" fault
- Triggering on Auto mode shows everything including noise — if low-level noise appears on an idle bus, switch to Normal trigger to confirm whether there's real activity
- Level-shifted buses may idle at unexpected voltages if the level shifter has no pull-ups or wrong pull-up voltage
- I2C bus lockup is a common failure: a slave holds SDA low waiting for a clock that never comes (interrupted transaction) — clock SCL manually until SDA releases

## Bench Relevance

- Clock toggling but data flat indicates the master is sending clock but the slave isn't responding — check slave power, address, and CS
- Data toggling but clock flat indicates something is driving data without a clock — unusual, suggests configuration error
- Both lines stuck low with resistance to ground indicates a short — isolate and locate
- Lines at expected idle levels but no activity when communication expected indicates firmware issue, not electrical
- I2C SDA stuck low after partial transaction indicates bus lockup — needs clock recovery
