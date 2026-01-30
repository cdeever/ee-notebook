---
title: "Op-Amps"
weight: 20
---

# Op-Amps

The operational amplifier is the universal building block of analog design. An op-amp is a high-gain differential amplifier — it amplifies the difference between its two inputs. With external feedback components, it can be configured as virtually any linear analog function: amplifier, filter, integrator, comparator, buffer, summing circuit.

The power of the op-amp comes from a useful simplification: if the open-loop gain is "high enough," the circuit behavior depends entirely on the feedback network, not the op-amp itself.

## Ideal Assumptions

The ideal op-amp model makes analysis tractable:

1. **Infinite open-loop gain** — The output does whatever it takes to make the differential input zero
2. **Infinite input impedance** — No current flows into the inputs
3. **Zero output impedance** — The output can drive any load without voltage drop
4. **Infinite bandwidth** — Gain doesn't roll off with frequency
5. **Zero input offset voltage** — With both inputs at the same voltage, the output is exactly zero

These assumptions lead to two golden rules for negative feedback circuits:

- **No current flows into the inputs** (from assumption 2)
- **The two inputs are at the same voltage** (from assumption 1 + negative feedback)

Apply these two rules, and you can analyze any op-amp feedback circuit with just KCL and Ohm's law.

## Why the Ideal Assumptions Fail

Every real op-amp violates all five assumptions. The question is whether the violations matter for your application.

**Finite open-loop gain (A_OL):**
- Typical: 100 dB (100,000 V/V) at DC
- Drops at 20 dB/decade above the dominant pole (usually a few Hz to a few hundred Hz)
- At the gain-bandwidth product (GBW) frequency, A_OL = 1
- Closed-loop gain can't exceed A_OL at any frequency. If your circuit needs gain of 100 at 1 MHz, you need an op-amp with GBW > 100 MHz

**Finite input impedance:**
- Typically megaohms to teraohms for FET-input op-amps
- Typically hundreds of kilohms to megaohms for BJT-input op-amps
- Input bias current is the practical issue: BJT inputs draw nanoamps to microamps, FET inputs draw picoamps. This current flowing through feedback resistors creates offset voltages

**Non-zero output impedance:**
- Open-loop output impedance is tens to hundreds of ohms
- Feedback reduces effective output impedance by the loop gain factor
- At high frequencies where loop gain is low, output impedance rises. This matters when driving capacitive loads

**Finite bandwidth and slew rate:**
- Gain-bandwidth product (GBW) sets the maximum useful frequency for a given gain
- Slew rate limits how fast the output can change (typically 1-100 V/us for general-purpose op-amps). A slew-rate-limited output clips large fast signals into a triangle wave regardless of the feedback network

**Input offset voltage:**
- Typically 1-10 mV for general-purpose, sub-millivolt for precision types
- Appears as an equivalent DC voltage between the inputs
- Gets amplified by the noise gain of the circuit. A 5 mV offset in a gain-of-100 circuit produces 500 mV of output offset

## Core Topologies

### Non-Inverting Amplifier

- Input at the + terminal, feedback from output to - terminal through a voltage divider
- Gain: A_v = 1 + (R_f / R_in)
- Input impedance: very high (the op-amp's own input impedance, multiplied by loop gain)
- Non-inverting (output in phase with input)
- Minimum gain is 1 (can't be less)

### Inverting Amplifier

- Input through a resistor to the - terminal, feedback resistor from output to - terminal
- Gain: A_v = -(R_f / R_in)
- Input impedance: R_in (the input resistor — the virtual ground means the input sees R_in to ground)
- Inverting (180-degree phase shift)
- Can have gain less than 1 (attenuator)

### Voltage Follower (Buffer)

- Output connected directly to - input, signal applied to + input
- Gain: exactly 1
- Input impedance: extremely high
- Output impedance: extremely low
- The simplest and most useful op-amp circuit. Isolates a high-impedance source from a low-impedance load

### Differential Amplifier

- Amplifies the difference between two inputs while rejecting what's common to both
- Depends critically on resistor matching. 1% resistor mismatch in a differential amp can give you only 40 dB common-mode rejection. For better CMRR, use instrumentation amplifiers (three op-amp topology)

## Real-World Limitations Checklist

When selecting an op-amp for a real application, these are the parameters that actually matter:

| Parameter | Affects | Typical concern |
|-----------|---------|-----------------|
| GBW | Maximum gain at frequency | Audio: >1 MHz. Video: >100 MHz |
| Slew rate | Maximum signal swing speed | Must exceed 2 x pi x f x V_peak |
| Input offset voltage | DC accuracy | Precision measurement: <100 uV |
| Input bias current | High-impedance source loading | High-Z sensors: use FET input |
| Noise (voltage & current) | SNR of weak signals | Low-noise preamps: nV/sqrt(Hz) spec |
| Output drive | Load current capability | Driving headphones, cables, ADCs |
| Supply voltage range | Available power rails | Single-supply: rail-to-rail I/O |
| CMRR / PSRR | Rejection of interference | Industrial environments |

## Gotchas

- **Phase margin and capacitive loads** — Most op-amps are not stable with capacitive loads. A cable or long trace adds capacitance that can cause oscillation. A small series output resistor (10-100 ohm) often fixes this
- **Rail-to-rail doesn't mean rail-to-rail** — "Rail-to-rail output" means the output can get close to the rails under light loads — typically within 50-200 mV. Under heavier loads, the headroom requirement increases
- **Single-supply biasing** — On a single supply, the inputs need to be biased above ground. AC-coupled circuits need a DC bias point at mid-supply. This is straightforward but easy to forget
- **Noise gain vs. signal gain** — The noise gain (which determines stability and bandwidth) is not always the same as the signal gain. For inverting amplifiers, noise gain is 1 + R_f/R_in, which is higher than the signal gain magnitude |R_f/R_in|
- **Decoupling is not optional** — Op-amp power pins need local bypass caps (100 nF ceramic minimum). Without them, the op-amp's power supply rejection degrades and it can oscillate
- **Comparator use** — An op-amp without negative feedback acts as a comparator, but it's usually a bad one — slow, no hysteresis, and the output doesn't swing cleanly to the rails. Use a real comparator for comparison tasks
