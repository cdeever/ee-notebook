---
title: "BJTs"
weight: 20
---

# BJTs

The bipolar junction transistor is a current-controlled device. A small base current controls a much larger collector current — that's the fundamental gain mechanism. BJTs were the first practical transistors and they're still everywhere: discrete amplifiers, current mirrors, references, and inside most analog ICs.

## Operating Regions

A BJT has three operating regions, and knowing which one you're in is the key to understanding what the circuit is doing.

### Active (Forward Active)

- Base-emitter junction is forward biased (V_BE ~ 0.6-0.7 V)
- Base-collector junction is reverse biased
- I_C = beta x I_B (collector current is proportional to base current)
- This is the amplification region. The transistor is doing useful analog work

### Saturation

- Both junctions are forward biased
- V_CE drops to V_CE(sat), typically 0.1-0.3 V
- The transistor is fully "on" — acting as a closed switch
- I_C is no longer controlled by I_B; it's limited by the external circuit
- Beta is much lower in saturation than in active mode

### Cutoff

- Both junctions are reverse biased (or V_BE below the turn-on threshold)
- The transistor is fully "off" — no collector current (except leakage)
- Acts as an open switch

### What Happens at the Boundaries

The transitions between regions are not sharp walls — they're gradual. A transistor "near saturation" has reduced gain and increased distortion. A transistor "near cutoff" clips the signal. Understanding where your operating point sits relative to these boundaries determines how much signal swing you have before distortion.

## Current Control and Beta

The fundamental relationship: I_C = beta x I_B

**Beta (h_FE) is the current gain.** Typical values range from 50 to 500, depending on the device and operating conditions.

The critical thing about beta: **don't design around it.** Beta varies:

- From device to device (even same part number): 2:1 spread is common
- With temperature: beta increases with temperature
- With collector current: peaks at a medium current, drops at very low and very high currents
- With V_CE: slight increase with higher V_CE (Early effect)

Good analog design makes the circuit behavior depend on resistor ratios and V_BE, not on beta. If your circuit only works with beta = 200, it will fail when you get a device with beta = 80.

## Biasing Fundamentals

Setting the DC operating point so the BJT stays in the active region with enough headroom for the signal to swing without clipping.

**The basic problem:** You need to set I_C to a known value despite beta variations. The classic topologies:

- **Fixed bias** (resistor from VCC to base) — Simple but terrible. I_C depends directly on beta. Don't use this for anything that needs to work reliably
- **Collector feedback bias** — Resistor from collector to base. Provides negative feedback: if I_C increases, V_C drops, reducing base current. Better stability, but gain is reduced
- **Voltage divider bias (self-bias)** — The standard approach. A voltage divider sets V_B, and an emitter resistor sets I_E ≈ (V_B - V_BE) / R_E. Nearly independent of beta if the divider is stiff enough. This is the workhorse biasing topology

V_BE is approximately 0.6-0.7 V for silicon at room temperature, decreasing about 2 mV/C. Biasing circuits must account for this temperature variation or accept the resulting drift.

## Small-Signal vs. Large-Signal Behavior

**Large-signal analysis** sets the DC operating point — the bias. It uses the full nonlinear device equations (or simplified models like V_BE = 0.7 V, I_C = beta x I_B).

**Small-signal analysis** describes how the transistor responds to small AC signals around that operating point. The device is linearized at the Q-point, producing a small-signal model with:

- **g_m (transconductance)** = I_C / V_T, where V_T ≈ 26 mV at room temperature. This is the gain parameter — how much collector current changes per volt of base-emitter voltage change
- **r_pi (input resistance)** = beta / g_m. The resistance seen looking into the base
- **r_o (output resistance)** = V_A / I_C, where V_A is the Early voltage. Usually large enough to ignore in simple circuits

The small-signal model is a linear circuit that you can analyze with all the standard techniques (superposition, Thevenin, KVL/KCL). This is where the [Fundamentals]({{< relref "/docs/fundamentals" >}}) section connects directly to analog design.

The key insight: **the DC bias sets the small-signal parameters.** Change the bias point, and g_m, r_pi, and r_o all change. This is why biasing matters so much — it determines the amplifier's gain, impedance, and linearity.

## Gotchas

- **Beta is not a design parameter** — Design for the minimum beta specified in the datasheet, and verify the circuit works across the full beta range
- **V_BE is not exactly 0.7 V** — It depends on current, temperature, and device type. For precision work, measure it. For design, use 0.6-0.7 V as an estimate and rely on feedback to handle the variation
- **Thermal runaway** — BJTs have a positive temperature coefficient for collector current at a fixed V_BE (hotter = more current = hotter). In power applications, this requires thermal feedback or emitter degeneration resistors
- **Storage time in saturation** — A saturated BJT has excess charge in the base region that must be removed before it can turn off. This limits switching speed. Schottky-clamped BJTs (like 74LS logic) prevent deep saturation to avoid this
- **Base current is not zero** — Unlike MOSFETs, BJTs draw continuous base current. This loads the driving circuit. High-impedance sources may not be able to supply enough base current for the desired collector current
- **Second breakdown** — At high voltage and high current simultaneously, localized heating can cause destructive current focusing. This is a safe operating area (SOA) limit, not a simple power limit
