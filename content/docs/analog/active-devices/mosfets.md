---
title: "MOSFETs"
weight: 30
---

# MOSFETs

The MOSFET is a voltage-controlled device. A voltage on the gate controls current between drain and source — with essentially zero DC gate current. This high input impedance is the MOSFET's defining advantage over BJTs and the reason MOSFETs dominate both digital logic and power switching. In analog applications, MOSFETs serve as amplifiers, switches, and variable resistors.

## Voltage Control and Transconductance

The fundamental relationship: I_D is controlled by V_GS (gate-to-source voltage).

Below the threshold voltage V_th, the MOSFET is off. Above it, drain current flows. The exact relationship depends on the operating region, but the key parameter is **transconductance (g_m)** — how much drain current changes per volt of gate voltage change:

g_m = delta I_D / delta V_GS

For a MOSFET in saturation: g_m = 2 x I_D / (V_GS - V_th)

Transconductance increases with drain current. A MOSFET biased at higher current has more gain. But g_m for a given I_D is generally lower than a BJT's g_m at the same current (where g_m = I_C / V_T ≈ I_C / 26 mV). This is the fundamental reason BJTs often have higher voltage gain per stage than MOSFETs.

## Thresholds, Regions, and Biasing

### Operating Regions

**Cutoff (V_GS < V_th):**
- No channel exists. Drain current is essentially zero (sub-threshold leakage only)
- The transistor is off

**Linear / Triode (V_GS > V_th, V_DS < V_GS - V_th):**
- The channel exists and acts like a voltage-controlled resistor
- I_D depends on both V_GS and V_DS
- Used for analog switches, variable resistors, and the "on" state in digital switching

**Saturation (V_GS > V_th, V_DS > V_GS - V_th):**
- The channel is pinched off at the drain end
- I_D depends primarily on V_GS, not V_DS (approximately)
- This is the amplification region — the analog equivalent of BJT active mode
- Not the same as "BJT saturation" — this catches people. MOSFET saturation is where you want to be for amplification. BJT saturation is where the device is fully on as a switch

### Threshold Voltage

V_th is the gate voltage at which the MOSFET begins to conduct. Typical values:

- Standard MOSFETs: 1-4 V
- Logic-level MOSFETs: 1-2 V (designed to be fully on with 3.3 V or 5 V gate drive)
- Enhancement-mode: normally off (V_th > 0 for NMOS)
- Depletion-mode: normally on (V_th < 0 for NMOS)

V_th varies with temperature (typically -2 to -5 mV/C) and with manufacturing process. Designing around exact V_th values is fragile — use feedback or current-source biasing instead.

### Biasing for Analog Operation

MOSFET biasing in analog circuits aims to set a stable I_D in the saturation region:

- **Resistive self-bias** — A resistor from drain to gate provides negative feedback. Simple, but the operating point depends on V_th, which varies
- **Source degeneration** — A source resistor stabilizes the operating point. V_GS = V_G - I_D x R_S. If I_D increases, V_GS decreases, limiting the increase. Similar philosophy to BJT emitter degeneration
- **Current source biasing** — A current mirror or current source sets I_D directly, regardless of V_th. The most stable approach, standard in IC design

## Analog vs. Logic-Style Use

This is a common source of confusion, especially for people coming from digital or power electronics.

**Logic-style (switching) use:**
- MOSFET is either fully off (cutoff) or fully on (deep linear/triode region)
- V_GS is driven well above V_th to minimize R_DS(on)
- The MOSFET acts as a switch — low resistance when on, high resistance when off
- R_DS(on) is the key parameter. Lowest possible = best
- This is how MOSFETs work in power supplies, motor drivers, and digital logic

**Analog use:**
- MOSFET operates in saturation (pinch-off) region
- V_GS is carefully biased to set I_D to a specific operating point
- The MOSFET acts as a transconductance amplifier — V_GS controls I_D
- g_m and output impedance are the key parameters
- This is how MOSFETs work in amplifiers, current sources, and analog signal processing

The same physical device serves both purposes — the difference is entirely in how you bias it and which region you operate in.

## MOSFET as an Analog Switch

In the linear region, a MOSFET acts as a voltage-controlled resistor (R_DS varies with V_GS). This makes it useful as an analog switch:

- Gate high = low resistance path between drain and source
- Gate low = open circuit
- R_DS(on) is not zero — it ranges from milliohms (power MOSFETs) to hundreds of ohms (small-signal), and it varies with the signal voltage
- Charge injection from the gate capacitance creates voltage spikes when the switch toggles. This matters in sample-and-hold circuits and precision analog multiplexing

## Gotchas

- **Gate capacitance** — The gate is an insulator, but it has significant capacitance (C_GS, C_GD). Driving this capacitance requires current during transitions. At high switching frequencies, gate drive losses can be substantial
- **Gate oxide is fragile** — Static discharge can punch through the thin gate oxide permanently. Handle MOSFETs with ESD precautions. Most modern MOSFETs have internal protection diodes, but they have limits
- **Body diode** — Every MOSFET has a parasitic diode from source to drain (body to drain in NMOS). This conducts when V_DS goes negative. In half-bridge circuits, this diode carries current during dead time — and it's usually slow with poor reverse recovery
- **MOSFET saturation ≠ BJT saturation** — This terminology trap causes endless confusion. MOSFET saturation = constant current region (good for amplifiers). BJT saturation = fully on switch with low V_CE. They're completely different operating conditions
- **Sub-threshold conduction** — Below V_th, drain current doesn't drop to exactly zero — it decreases exponentially. In ultra-low-power design, this region is deliberately used. In switching applications, it means nonzero off-state leakage that increases with temperature
- **Miller effect** — The gate-drain capacitance (C_GD) appears multiplied by the voltage gain at the drain. This slows switching and can cause unexpected oscillation if gate drive impedance is high
