---
title: "What's the ESR / Leakage / Gain?"
weight: 40
---

# What's the ESR / Leakage / Gain?

Deeper characterization beyond nominal value. A capacitor can measure the right capacitance and still be bad because its ESR is ten times what it should be. A transistor can show healthy junctions but have degraded gain. These are the second-order parameters that separate a marginal component from a good one.

## ESR: Electrolytic Capacitor Health

**Tool:** Dedicated ESR meter, or LCR meter at 100 kHz
**When:** Diagnosing failed or degraded electrolytic capacitors — the most common failure mode in aging electronics

### What ESR Is

ESR (Equivalent Series Resistance) is the real (resistive) part of a capacitor's impedance. It represents energy lost as heat in the capacitor's dielectric, electrolyte, and lead connections. All capacitors have ESR, but it matters most for electrolytics because:

- Electrolytic ESR rises as the electrolyte dries out over time and temperature
- High ESR causes the capacitor to heat up under ripple current, accelerating further degradation
- A high-ESR cap on a switching regulator output increases ripple voltage and can cause instability

### Expected ESR Values

| Capacitance | Voltage | Typical good ESR | Suspect if |
|------------|---------|-----------------|------------|
| 10 uF | 25V | 1–5 Ohm | > 10 Ohm |
| 100 uF | 25V | 0.1–0.5 Ohm | > 2 Ohm |
| 1000 uF | 16V | 0.02–0.1 Ohm | > 0.5 Ohm |
| 1000 uF | 50V | 0.05–0.2 Ohm | > 1 Ohm |
| 4700 uF | 25V | 0.01–0.05 Ohm | > 0.3 Ohm |

ESR generally decreases with higher capacitance and lower voltage rating. Check the specific part's datasheet for the manufacturer's ESR specification (usually given at 100 kHz and 20°C).

### Procedure

1. **Discharge the capacitor** before connecting any test equipment
2. **In-circuit ESR testing** is possible with a dedicated ESR meter — the low test voltage (~0.1–0.3V peak) doesn't forward-bias semiconductor junctions, so parallel components usually don't affect the reading
3. Connect the ESR meter probes to the capacitor
4. Read the ESR value and compare to the expected range for that capacitance/voltage

### What You Learn

- Whether the electrolyte has dried out — the primary aging failure mode
- Which specific capacitors need replacement in a repair scenario
- Whether a switching regulator's output capacitors are still adequate

### Gotchas

- ESR is frequency- and temperature-dependent. Measure at the standard 100 kHz / 20°C for meaningful comparison to datasheet specs
- In-circuit ESR measurement works well when parallel components have much higher impedance than the cap's ESR. On power rails with very low-ESR capacitors in parallel, the meter reads the parallel combination — you may need to lift one leg
- Ceramic capacitors have very low ESR (milliohms) — ESR testing is primarily relevant for electrolytic and tantalum capacitors
- A capacitor can have acceptable ESR and still have reduced capacitance. ESR testing complements capacitance measurement; it doesn't replace it

## Capacitor Leakage Current

**Tool:** DMM (Ohm mode for qualitative check) or bench supply + DMM (for quantitative measurement)
**When:** Suspecting a leaky capacitor — one that draws DC current through what should be an insulator

### Qualitative Check: DMM Resistance Mode

1. Discharge the capacitor
2. Set DMM to highest Ohm range (MOhm)
3. Connect to the capacitor (observe polarity for electrolytics)
4. Watch the reading: it should climb toward OL over several seconds as the cap charges from the DMM's test voltage
5. The final settled reading is the insulation resistance (leakage)

| Final resistance | Meaning |
|-----------------|---------|
| > 100 MOhm or OL | Good — negligible leakage (typical for film, ceramic, good electrolytic) |
| 1–100 MOhm | Moderate leakage — may be acceptable for large electrolytics |
| < 1 MOhm | High leakage — suspect, especially for film or ceramic caps |
| < 10 kOhm | Very leaky — capacitor is degraded |

### Quantitative Check: Bench Supply Method

For a more precise leakage measurement at the actual operating voltage:

1. Discharge the capacitor
2. Connect a bench supply set to the capacitor's rated voltage (or its in-circuit operating voltage)
3. Put a DMM in series, set to uA or mA range, to measure the current flowing into the cap
4. Apply voltage and wait — the initial charging current will be high, then decay exponentially
5. After several minutes (5× the RC time constant, where R is the leakage resistance), the current settles to the DC leakage current

### What You Learn

- The actual leakage current under operating conditions
- Whether the capacitor is suitable for circuits that depend on charge retention (sample-and-hold, timing circuits, energy storage)

### Gotchas

- Electrolytic capacitors have a normal "reforming" period when voltage is first applied after storage. A cap that's been sitting discharged for months may initially show high leakage that decreases over minutes to hours as the oxide reforms. This is normal behavior, not a fault
- Temperature increases leakage. A cap that measures fine at room temperature may leak significantly at 85°C
- Leakage current specs in datasheets are usually given after a specified reforming time (e.g., "after 5 minutes at rated voltage"). Compare your measurement to the same conditions

## Transistor hFE (Current Gain)

**Tool:** DMM with hFE socket, or bench measurement (two DMMs + resistor)
**When:** Checking whether a transistor's gain is reasonable, or sorting transistors by gain for matching

### DMM hFE Socket Method

Many DMMs have a transistor socket labeled with E, B, C positions for NPN and PNP.

1. Identify the transistor's pinout (EBC order varies by package — check the datasheet)
2. Insert the transistor into the correct socket holes
3. Read the hFE value on the display

### Bench Measurement Method

For more control over test conditions:

1. Build a simple test circuit: base resistor from a known voltage to the base, collector resistor from supply to collector, emitter to ground
2. Measure base current (I_B) with one DMM in the base path
3. Measure collector current (I_C) with another DMM in the collector path
4. hFE = I_C / I_B

### Expected Gains

| Transistor type | Typical hFE range |
|----------------|-------------------|
| Small-signal NPN (2N3904, BC547) | 100–300 |
| Small-signal PNP (2N3906, BC557) | 100–300 |
| Power transistor (TIP31, 2N3055) | 20–70 |
| Darlington (TIP120) | 1000+ |

### What You Learn

- Whether the transistor has reasonable gain — a transistor with hFE of 5 when it should be 150 is degraded
- Relative gain matching for differential pairs and current mirrors

### Gotchas

- hFE varies with collector current, temperature, and collector-emitter voltage. The DMM socket test uses a fixed, often unspecified test condition. Use it for go/no-go and rough comparison, not precision
- Very high hFE (> 500 on a part rated for 100–300) can indicate collector-base leakage mimicking gain. Check the junctions in diode mode for leakage
- Gain degrades with high-temperature exposure and overcurrent events. A transistor that survived a thermal event may still show junctions in diode mode but have significantly reduced gain
- Some modern SOT-23 transistors integrate base resistors. These won't give meaningful hFE readings in a standard DMM socket

## MOSFET Parameters

**Tool:** DMM (basic check), or curve tracer / bench setup (detailed)
**When:** Checking MOSFET gate threshold, on-resistance, or whether the device switches properly

### Gate Threshold Check (Rough)

1. Set DMM to diode mode
2. Connect red to Gate, black to Source (N-channel)
3. This charges the gate through the DMM's test current
4. Now measure Drain-to-Source resistance — if the gate charged above threshold, the MOSFET turns on and D-S reads low
5. Short Gate to Source to discharge, then re-measure D-S — should be OL (body diode only)

This is a rough functional check — it confirms the MOSFET switches, but doesn't tell you the exact threshold voltage.

### Gotchas

- Logic-level MOSFETs (low Vgs threshold, ~1.5–2.5V) are easier to turn on with a DMM than standard-threshold devices (~4V). If the DMM can't charge the gate above threshold, the device won't turn on — this doesn't mean it's dead
- Gate oxide is fragile. ESD can damage it. If Gate-to-Source or Gate-to-Drain shows any conductivity in diode mode, the gate oxide is likely damaged
- RDS(on) specs in datasheets are given at specific Vgs and current. A DMM can't replicate these conditions, so use DMM for go/no-go, not for measuring exact on-resistance
