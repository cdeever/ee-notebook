---
title: "Bulk Capacitance & Battery Behavior"
weight: 60
---

# Bulk Capacitance & Battery Behavior

Energy storage health. Bulk cap ESR, battery voltage under load, and holdup time. When the supply hiccups or the battery sags, these measurements tell you whether the energy storage is doing its job.

## DMM: Battery Voltage Under Load

**Tool:** DMM, V⎓ mode
**Setup:** Battery connected to the actual circuit (loaded)

### Procedure

1. Measure battery voltage open-circuit (disconnected) — this is the resting voltage
2. Connect the load (the actual circuit)
3. Measure battery voltage again under load
4. The difference is the voltage drop due to battery internal resistance and connection resistance

### What You Learn

- Open-circuit voltage indicates state of charge (compare to the battery chemistry's voltage curve)
- Voltage under load indicates whether the battery can deliver the current the circuit needs
- Large sag under load suggests: aged battery (high internal resistance), inadequate battery for the load, or poor connections adding resistance

### Gotchas

- Battery voltage recovers after load removal — measure under load, not after disconnecting
- Resting voltage takes time to stabilize after charging or discharging. Wait a few minutes for an accurate open-circuit reading
- Cold temperatures increase internal resistance — a battery that works at room temperature may sag too much in the cold

## ESR Meter: Bulk Capacitor Health

**Tool:** Dedicated ESR meter or LCR meter at 100 kHz
**Use case:** Checking electrolytic capacitors for degradation

### Procedure

1. **Discharge the capacitor first** — ESR meters inject a small test signal and are not designed to handle charged capacitors
2. Disconnect at least one lead of the capacitor from the circuit (in-circuit ESR readings are approximate and can be misleading)
3. Connect ESR meter leads to the capacitor
4. Read ESR value and compare to expected ESR for that capacitor's rating

### What You Learn

- Low ESR (matching datasheet): capacitor is healthy
- Elevated ESR: capacitor is drying out, degraded, or damaged. Common failure mode for aluminum electrolytics, especially near heat sources
- Very high ESR or open: capacitor has failed

### ESR Reference Values

ESR varies widely by capacitance, voltage rating, and series. General rules of thumb:

- 1000 µF / 16V: expect < 0.05Ω for a good low-ESR part
- 100 µF / 25V: expect < 0.2Ω
- 10 µF / 50V: expect < 1Ω
- Always check the specific part's datasheet for its ESR spec

### Gotchas

- In-circuit measurements are unreliable — parallel components (other caps, low-impedance paths) affect the reading
- A capacitor can measure correct capacitance but have terrible ESR. Capacitance alone doesn't tell you the part is healthy
- ESR meters use a high-frequency test signal. This tests high-frequency impedance, which is what matters for decoupling and ripple current, but not necessarily for energy storage (bulk holdup)

## Oscilloscope: Holdup Time and Transient Sag

**Tool:** Oscilloscope, DC-coupled, single-shot capture
**Use case:** Measuring how long bulk capacitance holds up the rail when input power is interrupted

### Procedure

1. Monitor the rail voltage on one channel
2. Monitor the input power (before the regulator) on a second channel if possible
3. Set up single-shot trigger on the input power dropping (falling edge)
4. Interrupt input power (pull the plug, toggle a switch, or use a relay)
5. Measure: how long does the rail stay within regulation before drooping?

### What You Learn

- Holdup time — critical for systems that need to ride through brief power interruptions
- Whether bulk capacitance is sufficient for the load
- How the regulator behaves as input voltage drops toward dropout

### Gotchas

- This is a one-shot measurement per power cycle. Make sure trigger and timebase are set first
- The regulator's dropout behavior affects holdup time as much as the capacitance does — they're a system, not independent
- If the load includes a microcontroller, it may brown-out and reset before the rail actually drops below the regulator's output. Watch for unexpected resets during the holdup period
