---
title: "What's the ESR / Leakage / Gain?"
weight: 40
review:
  status: unreviewed
  method: []
  notes: ""
  date: ""
---

# What's the ESR / Leakage / Gain?

Deeper characterization beyond nominal value. A capacitor can measure the right capacitance and still be bad because its ESR is ten times what it should be. A transistor can show healthy junctions but have degraded gain. These second-order parameters separate marginal components from good ones.

## ESR: Electrolytic Capacitor Health

ESR (Equivalent Series Resistance) is the real (resistive) part of a capacitor's impedance. It represents energy lost as heat in the dielectric, electrolyte, and lead connections. ESR matters most for electrolytics because:

- ESR rises as the electrolyte dries out over time and temperature
- High ESR causes heating under ripple current, accelerating further degradation
- A high-ESR cap on a switching regulator output increases ripple voltage and can cause instability

**Expected ESR values:**

| Capacitance | Voltage | Typical good ESR | Suspect if |
|------------|---------|-----------------|------------|
| 10 µF | 25V | 1–5 Ω | > 10 Ω |
| 100 µF | 25V | 0.1–0.5 Ω | > 2 Ω |
| 1000 µF | 16V | 0.02–0.1 Ω | > 0.5 Ω |
| 1000 µF | 50V | 0.05–0.2 Ω | > 1 Ω |
| 4700 µF | 25V | 0.01–0.05 Ω | > 0.3 Ω |

ESR generally decreases with higher capacitance and lower voltage rating. Measure at 100 kHz for meaningful comparison to datasheet specs.

In-circuit ESR testing is possible with a dedicated ESR meter — the low test voltage (~0.1–0.3V peak) doesn't forward-bias semiconductor junctions, so parallel components usually don't affect the reading.

## Capacitor Leakage Current

Leakage is DC current through what should be an insulator.

**Qualitative check (DMM resistance mode):** Discharge the capacitor, set to highest ohm range, connect, and watch the reading climb toward OL. The final settled reading is the insulation resistance.

| Final resistance | Meaning |
|-----------------|---------|
| > 100 MΩ or OL | Good — negligible leakage |
| 1–100 MΩ | Moderate — may be acceptable for large electrolytics |
| < 1 MΩ | High leakage — suspect for film or ceramic |
| < 10 kΩ | Very leaky — capacitor is degraded |

**Quantitative check:** Apply rated voltage through a series DMM in µA/mA range. After several minutes (5× RC time constant), current settles to DC leakage current.

## Transistor hFE (Current Gain)

Many DMMs have a transistor socket for measuring hFE directly. Insert the transistor into the correct E, B, C positions and read the gain.

**Expected gains:**

| Transistor type | Typical hFE range |
|----------------|-------------------|
| Small-signal NPN (2N3904, BC547) | 100–300 |
| Small-signal PNP (2N3906, BC557) | 100–300 |
| Power transistor (TIP31, 2N3055) | 20–70 |
| Darlington (TIP120) | 1000+ |

A transistor with hFE of 5 when it should be 150 is degraded. Use DMM socket test for go/no-go and rough comparison, not precision — hFE varies with collector current, temperature, and VCE.

## MOSFET Functional Check

A rough functional check confirms the MOSFET switches:

1. Charge the gate by connecting red lead (diode mode) to Gate, black to Source
2. Measure Drain-to-Source — if gate charged above threshold, D-S reads low (channel on)
3. Short Gate to Source to discharge
4. Measure D-S again — should be OL (only body diode)

This confirms switching function but doesn't measure exact threshold voltage or RDS(on).

## Tips

- Discharge capacitors before ESR or leakage testing
- ESR testing is primarily relevant for electrolytic and tantalum capacitors — ceramics have milliohm ESR
- For leakage testing at operating voltage, allow several minutes for settling
- Use DMM hFE socket for quick go/no-go, not precision measurements
- Discharge MOSFET gates before measuring — residual charge affects readings

## Caveats

- ESR is frequency- and temperature-dependent — measure at standard 100 kHz / 20°C for datasheet comparison
- In-circuit ESR measurement reads the parallel combination when capacitors share a rail — may need to lift one leg
- A capacitor can have acceptable ESR and still have reduced capacitance — ESR testing complements capacitance measurement
- Electrolytic capacitors have a normal "reforming" period after storage — initially high leakage that decreases over minutes to hours as oxide reforms
- Temperature increases leakage — room temperature measurement may not reflect high-temperature behavior
- hFE varies with collector current and temperature — DMM uses fixed, often unspecified test conditions
- Very high hFE (> 500 on a 100–300 rated part) can indicate collector-base leakage mimicking gain
- Gain degrades with high-temperature exposure and overcurrent events — a thermally stressed transistor may show healthy junctions but reduced gain
- Logic-level MOSFETs (low Vgs threshold ~1.5–2.5V) are easier to turn on with DMM than standard-threshold devices (~4V)
- Gate oxide damage shows as conductivity Gate-to-Source or Gate-to-Drain — the MOSFET is dead

## In Practice

- Electrolytic with high ESR on a switcher output causes increased ripple and possible instability — even if capacitance measures correctly
- Capacitor that reforms (leakage decreases over time with voltage applied) is exhibiting normal behavior after storage
- Capacitor that doesn't reform (leakage stays high) has degraded dielectric
- Transistor with very low gain but healthy junctions has likely suffered thermal stress
- MOSFET that won't turn on from DMM gate charging may be standard-threshold (not dead) — or may have damaged gate oxide (check for gate conductivity)
- Power supply with excessive ripple after years of service — check ESR of output electrolytics before anything else
- **A precision measurement that drifts over minutes after a load change** commonly appears when thermal coupling from a power-dissipating subsystem is shifting a temperature-sensitive parameter in the measurement subsystem — the thermal time constant creates a delay between the load change and the measurement drift.
